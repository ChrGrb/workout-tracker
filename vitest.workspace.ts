import { resolve } from "path";

// Two projects: fast Node tests for pure logic + write-path, and a jsdom project
// (browser resolve conditions, SvelteKit `$app`/`$env` stubs) for component tests.
export default [
  {
    extends: "./vitest.config.ts",
    test: {
      name: "unit",
      environment: "node",
      include: ["src/**/*.test.ts"],
      exclude: ["src/**/*.svelte.test.ts"],
    },
  },
  {
    extends: "./vitest.config.ts",
    resolve: {
      // Svelte 5 client components require the browser export condition.
      conditions: ["browser"],
      alias: {
        $: resolve("./src"),
        $lib: resolve("./src/lib"),
        "$app/navigation": resolve("./tests/mocks/app-navigation.ts"),
        "$app/environment": resolve("./tests/mocks/app-environment.ts"),
        "$app/stores": resolve("./tests/mocks/app-stores.ts"),
        "$env/static/public": resolve("./tests/mocks/env-static-public.ts"),
        "$env/dynamic/public": resolve("./tests/mocks/env-dynamic-public.ts"),
      },
    },
    test: {
      name: "components",
      environment: "jsdom",
      include: ["src/**/*.svelte.test.ts", "tests/components/**/*.test.ts"],
      setupFiles: ["./tests/setup.components.ts"],
    },
  },
];
