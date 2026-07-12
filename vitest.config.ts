import { defineConfig } from "vitest/config";
import { svelte, vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { resolve } from "path";

// Standalone test config — deliberately does NOT reuse vite.config.js, whose
// plugins (mkcert, PWA, purgeCss, vercelToolbar) are irrelevant/hostile to a test
// run. Only the `$` alias and the Svelte compiler are shared. Per-project
// environment/resolve overrides live in vitest.workspace.ts.
export default defineConfig({
  // Cast to never: vitest bundles its own copy of Vite, so the svelte plugin's
  // Plugin type (from the root Vite) is nominally distinct from the one vitest's
  // defineConfig expects. The plugin is runtime-compatible; only the types differ.
  plugins: [
    svelte({
      preprocess: vitePreprocess(),
      compilerOptions: { hmr: false },
    }) as unknown as never,
  ],
  resolve: {
    alias: {
      // `$` → src (custom, from vite.config.js) and `$lib` → src/lib (SvelteKit
      // default). Rollup alias respects the `/` boundary, so they don't collide.
      $: resolve("./src"),
      $lib: resolve("./src/lib"),
    },
  },
});
