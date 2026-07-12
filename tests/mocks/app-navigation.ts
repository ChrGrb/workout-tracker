// Stub for `$app/navigation` in component tests (no SvelteKit runtime present).
// Individual tests can `vi.mock("$app/navigation", ...)` to assert on these.
export const goto = () => Promise.resolve();
export const invalidate = () => Promise.resolve();
export const invalidateAll = () => Promise.resolve();
export const preloadData = () => Promise.resolve();
export const preloadCode = () => Promise.resolve();
export const afterNavigate = () => {};
export const onNavigate = () => {};
export const beforeNavigate = () => {};
export const pushState = () => {};
export const replaceState = () => {};
export const disableScrollHandling = () => {};
