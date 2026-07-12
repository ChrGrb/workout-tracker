import { describe, it, expect } from "vitest";
import { sortByCreatedAt } from "./sortByDate";

describe("sortByCreatedAt", () => {
  it("orders newest first (descending)", () => {
    const items = [
      { createdAt: new Date("2024-01-01") },
      { createdAt: new Date("2024-03-01") },
      { createdAt: new Date("2024-02-01") },
    ];
    const sorted = items.toSorted(sortByCreatedAt).map((i) => i.createdAt.getMonth());
    expect(sorted).toEqual([2, 1, 0]); // Mar, Feb, Jan
  });
});
