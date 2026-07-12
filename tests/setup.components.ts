import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/svelte";

// A signed-in user id is required for getZ()/components that read it; seed it so
// code paths that call `useUserId()` don't blow up. (Components under test mock
// `$lib/zero/z.svelte` directly, but this keeps the store happy.)
localStorage.setItem("userId", JSON.stringify("test-user"));

// jsdom implements neither the Web Animations API nor scrollTo; Svelte
// transitions (slide/fly) call element.animate, and some UI libs call scrollTo.
if (!Element.prototype.animate) {
  Element.prototype.animate = () =>
    ({
      cancel: () => {},
      play: () => {},
      pause: () => {},
      finish: () => {},
      finished: Promise.resolve(),
      onfinish: null,
      addEventListener: () => {},
      removeEventListener: () => {},
    }) as unknown as Animation;
}
if (!Element.prototype.scrollTo) {
  Element.prototype.scrollTo = () => {};
}

// jsdom lacks matchMedia; some UI libs probe it.
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList;
}

afterEach(() => cleanup());
