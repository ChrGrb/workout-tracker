// Liquid-glass refraction, shared between the <LiquidGlass> component and the
// `liquidGlassFilter` action (used e.g. on portalled dropdown content that
// can't be wrapped in a component). See https://kube.io/blog/liquid-glass-css-svg/
//
// The bezel is modelled as a convex-squircle surface. For samples along the
// border we compute the surface normal, refract a viewer ray through it with
// Snell's law, and take the ray's lateral landing shift as the displacement
// magnitude. That 1-D profile is reused for every pixel via a rounded-rect SDF
// (direction = the SDF gradient), encoded into an RGBA displacement map that an
// <feDisplacementMap> applies to the backdrop.

const SAMPLES = 128;

// Apple's preferred profile: a smooth flat->curve transition that stays well
// behaved when stretched into rectangles.
const surface = (x: number) => Math.pow(1 - Math.pow(1 - x, 4), 1 / 4);

export function buildProfile(eta: number): number[] {
  const mags = new Array<number>(SAMPLES);
  const delta = 1e-3;
  for (let i = 0; i < SAMPLES; i++) {
    const s = i / (SAMPLES - 1);
    // Numerical derivative -> surface normal in the (distance, height) plane.
    const y1 = surface(Math.max(0, s - delta));
    const y2 = surface(Math.min(1, s + delta));
    const slope = (y2 - y1) / (2 * delta);
    const nl = Math.hypot(-slope, 1);
    const nx = -slope / nl;
    const ny = 1 / nl; // points up, toward the incoming ray

    // Incoming ray travels straight into the surface: (0, -1).
    const ix = 0;
    const iy = -1;
    const cosi = -(ix * nx + iy * ny); // = ny
    const k = 1 - eta * eta * (1 - cosi * cosi);
    let mag = 0;
    if (k >= 0) {
      const c = eta * cosi - Math.sqrt(k);
      const rx = eta * ix + c * nx;
      const ry = eta * iy + c * ny;
      // Trace the refracted ray down to the backdrop; lateral shift per unit
      // thickness (a constant factor normalization removes).
      if (ry !== 0) mag = Math.abs(rx / ry);
    }
    mags[i] = mag;
  }
  return mags;
}

// Signed distance to a rounded rectangle centered at the origin, with
// half-extents (hx, hy) and corner radius r. Negative inside.
function roundedRectSDF(
  px: number,
  py: number,
  hx: number,
  hy: number,
  r: number,
) {
  const qx = Math.abs(px) - hx + r;
  const qy = Math.abs(py) - hy + r;
  return (
    Math.min(Math.max(qx, qy), 0) +
    Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) -
    r
  );
}

export function buildDisplacementMap(
  width: number,
  height: number,
  radius: number,
  bezelWidth: number,
  profile: number[],
  maxMag: number,
): string | null {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const image = ctx.createImageData(width, height);
  const data = image.data;

  const hx = width / 2;
  const hy = height / 2;
  const r = Math.min(radius, Math.min(hx, hy));
  const n = profile.length;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cx = x + 0.5 - hx;
      const cy = y + 0.5 - hy;
      const dist = -roundedRectSDF(cx, cy, hx, hy, r); // distance inside edge

      let rCh = 128;
      let gCh = 128;

      if (dist >= 0 && dist < bezelWidth) {
        const s = dist / bezelWidth; // 0 edge -> 1 interior
        const t = s * (n - 1);
        const i0 = Math.floor(t);
        const i1 = Math.min(n - 1, i0 + 1);
        const fr = t - i0;
        const mag = profile[i0] * (1 - fr) + profile[i1] * fr;

        // Outward normal = normalized gradient of the SDF.
        const e = 1;
        const gxRaw =
          roundedRectSDF(cx + e, cy, hx, hy, r) -
          roundedRectSDF(cx - e, cy, hx, hy, r);
        const gyRaw =
          roundedRectSDF(cx, cy + e, hx, hy, r) -
          roundedRectSDF(cx, cy - e, hx, hy, r);
        const gl = Math.hypot(gxRaw, gyRaw) || 1;
        const nx = gxRaw / gl;
        const ny = gyRaw / gl;

        const dx = (nx * mag) / maxMag; // [-1, 1]
        const dy = (ny * mag) / maxMag;
        rCh = 128 + dx * 127;
        gCh = 128 + dy * 127;
      }

      const idx = (y * width + x) * 4;
      data[idx] = rCh;
      data[idx + 1] = gCh;
      data[idx + 2] = 128; // unused axis (neutral)
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(image, 0, 0);
  return canvas.toDataURL();
}

export interface LiquidGlassOptions {
  /** Width of the refracting bezel band, in px (defaults to a share of the shorter side). */
  bezel?: number;
  /** Maximum lateral pixel displacement applied at the edge of the bezel. */
  scale?: number;
  /** Frost blur applied on top of the refraction, in px. */
  blur?: number;
  /** Refractive index of the glass (air is 1). Apple-ish glass is ~1.5. */
  ior?: number;
}

let instanceCount = 0;

function backdropSupported() {
  return (
    typeof CSS !== "undefined" &&
    typeof CSS.supports === "function" &&
    (CSS.supports("backdrop-filter", "url(#x)") ||
      CSS.supports("-webkit-backdrop-filter", "url(#x)"))
  );
}

/**
 * Svelte action that applies the liquid-glass refraction backdrop-filter to an
 * element, regenerating the displacement map whenever the element resizes. The
 * SVG <filter> lives in <body> so it works for portalled elements. Where SVG
 * backdrop filters are unsupported (Firefox/Safari), it no-ops and leaves any
 * CSS `backdrop-blur` fallback in place.
 */
export function liquidGlassFilter(
  node: HTMLElement,
  options: LiquidGlassOptions = {},
) {
  const id = `liquid-glass-${instanceCount++}`;
  const supported = backdropSupported();
  let opts = options;
  let svg: SVGSVGElement | null = null;

  function ensureSvg() {
    if (svg) return;
    svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("width", "0");
    svg.setAttribute("height", "0");
    svg.style.cssText =
      "position:absolute;width:0;height:0;pointer-events:none;";
    document.body.appendChild(svg);
  }

  function regenerate() {
    if (!supported) return;
    const w = node.clientWidth;
    const h = node.clientHeight;
    if (w < 2 || h < 2 || w * h > 1_500_000) return;

    const cs = getComputedStyle(node);
    const parsedRadius = parseFloat(cs.borderTopLeftRadius) || 0;
    const radius = Math.min(parsedRadius, Math.min(w, h) / 2);

    const minSide = Math.min(w, h);
    const bezel = Math.max(2, Math.min(opts.bezel ?? minSide * 0.4, minSide / 2));
    const maxShift = opts.scale ?? bezel * 0.6;
    const blur = opts.blur ?? 2;
    const ior = opts.ior ?? 1.5;

    const profile = buildProfile(1 / ior);
    const maxMag = Math.max(...profile) || 1;
    const url = buildDisplacementMap(w, h, radius, bezel, profile, maxMag);
    if (!url) return;

    ensureSvg();
    // feDisplacementMap shifts by scale * ((channel/255) - 0.5); the encoded
    // peak is ~0.5, so scale = 2*maxShift yields maxShift px at the edge.
    svg!.innerHTML = `<filter id="${id}" color-interpolation-filters="sRGB" x="-20%" y="-20%" width="140%" height="140%"><feImage href="${url}" x="0" y="0" width="${w}" height="${h}" preserveAspectRatio="none" result="displacement_map"/><feDisplacementMap in="SourceGraphic" in2="displacement_map" scale="${maxShift * 2}" xChannelSelector="R" yChannelSelector="G"/></filter>`;

    const value = `url(#${id}) blur(${blur}px)`;
    node.style.backdropFilter = value;
    node.style.setProperty("-webkit-backdrop-filter", value);
  }

  const ro = supported ? new ResizeObserver(() => regenerate()) : null;
  ro?.observe(node);
  regenerate();

  return {
    update(newOptions: LiquidGlassOptions = {}) {
      opts = newOptions;
      regenerate();
    },
    destroy() {
      ro?.disconnect();
      svg?.remove();
      svg = null;
      node.style.removeProperty("backdrop-filter");
      node.style.removeProperty("-webkit-backdrop-filter");
    },
  };
}
