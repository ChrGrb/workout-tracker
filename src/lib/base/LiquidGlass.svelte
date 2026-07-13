<script lang="ts">
  import clsx from "clsx";
  import { liquidGlassFilter } from "./liquidGlass";

  interface Props {
    children?: import("svelte").Snippet;
    className?: string;
    /** Width of the refracting bezel band, in px (falls back to a share of the shorter side). */
    bezel?: number;
    /** Maximum lateral pixel displacement applied at the edge of the bezel. */
    scale?: number;
    /** Frost blur applied on top of the refraction, in px. */
    blur?: number;
    /** Refractive index of the glass (air is 1). Apple-ish glass is ~1.5. */
    ior?: number;
    /**
     * Add glossy specular rim highlights so the surface reads as a 3D glass
     * lens even when there is no textured content behind it to refract.
     */
    specular?: boolean;
  }

  let {
    children,
    className,
    bezel,
    scale,
    blur = 2,
    ior = 1.5,
    specular = false,
  }: Props = $props();

  // Layered inset highlights that fake a glossy glass rim (top + bottom
  // specular). Set via `style:box-shadow` so it coexists with the
  // backdrop-filter the action writes directly onto the node.
  const specularShadow =
    "inset 0 2px 1px rgba(255,255,255,0.95), inset 0 -1px 1px rgba(255,255,255,0.5), inset 0 -10px 16px rgba(255,255,255,0.14), inset 0 0 0 1px rgba(255,255,255,0.18)";
</script>

<div
  use:liquidGlassFilter={{ bezel, scale, blur, ior }}
  style:box-shadow={specular ? specularShadow : undefined}
  class={clsx(
    "bg-white/15 backdrop-blur-md backdrop-filter border border-white/30 overflow-hidden",
    !specular && "shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]",
    className,
  )}
>
  {#if specular}
    <div
      class="pointer-events-none absolute inset-0"
      style="background:
        radial-gradient(60% 45% at 30% 20%, rgba(255,255,255,0.7), rgba(255,255,255,0) 55%),
        radial-gradient(50% 30% at 70% 92%, rgba(255,255,255,0.35), rgba(255,255,255,0) 60%);"
    ></div>
  {:else}
    <div
      class="pointer-events-none absolute inset-0
              bg-gradient-to-b
              from-white/40 via-white/10 to-transparent"
    ></div>
  {/if}
  {@render children?.()}
</div>
