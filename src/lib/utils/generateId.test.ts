import { describe, it, expect } from "vitest";
import generateId from "$lib/utils/generateId";

describe("generateId", () => {
  it("defaults to length 6", () => {
    expect(generateId()).toHaveLength(6);
  });

  it("honours a custom length", () => {
    expect(generateId(12)).toHaveLength(12);
  });

  it("excludes ambiguous characters (I, l, _, -)", () => {
    const id = generateId(200);
    expect(id).not.toMatch(/[Il_-]/);
  });
});
