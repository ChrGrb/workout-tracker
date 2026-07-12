import { describe, it, expect } from "vitest";
import { lightenDarkenColor } from "./lightenDarkenColor";

// Characterization tests — pin the CURRENT behavior (each channel shifted by the
// amount, clamped to [0,255]), not an idealized spec.
describe("lightenDarkenColor", () => {
  it("lightens each channel by the amount (note: no zero-padding — a known quirk)", () => {
    // 0x0a0a0a stringifies to "a0a0a" (leading zero dropped), not "0a0a0a".
    expect(lightenDarkenColor("#000000", 10)).toBe("#a0a0a");
  });

  it("darkens each channel by the amount", () => {
    expect(lightenDarkenColor("#ffffff", -20)).toBe("#ebebeb");
  });

  it("clamps above 255", () => {
    expect(lightenDarkenColor("#ffffff", 50)).toBe("#ffffff");
  });

  it("preserves the leading '#' only when present", () => {
    expect(lightenDarkenColor("ffffff", 0)).toBe("ffffff");
  });
});
