// eslint.config.js
import js from "@eslint/js";
import svelte from "eslint-plugin-svelte";
import globals from "globals";
import ts from "typescript-eslint";
import svelteConfig from "./svelte.config.js";

export default ts.config(
  {
    // Flat config does not read `.eslintignore`; ignore build output and other
    // generated artifacts here so only source is linted.
    ignores: [
      ".svelte-kit/",
      "build/",
      "package/",
      ".vercel/",
      "static/",
      "*.timestamp-*",
      // Vendored Pusher Beams service worker bundle — third-party, not our code.
      "src/service-worker/beams-sw.js",
    ],
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  ...svelte.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ["**/*.svelte", "**/*.svelte.ts", "**/*.svelte.js"],
    // See more details at: https://typescript-eslint.io/packages/parser/
    languageOptions: {
      parserOptions: {
        projectService: true,
        extraFileExtensions: [".svelte"], // Add support for additional file extensions, such as .svelte
        parser: ts.parser,
        // Specify a parser for each language, if needed:
        // parser: {
        //   ts: ts.parser,
        //   js: espree,    // Use espree for .js files (add: import espree from 'espree')
        //   typescript: ts.parser
        // },

        // We recommend importing and specifying svelte.config.js.
        // By doing so, some rules in eslint-plugin-svelte will automatically read the configuration and adjust their behavior accordingly.
        // While certain Svelte settings may be statically loaded from svelte.config.js even if you don’t specify it,
        // explicitly specifying it ensures better compatibility and functionality.
        //
        // If non-serializable properties are included, running ESLint with the --cache flag will fail.
        // In that case, please remove the non-serializable properties. (e.g. `svelteConfig: { ...svelteConfig, kit: { ...svelteConfig.kit, typescript: undefined }}`)
        svelteConfig,
      },
    },
  },
  {
    rules: {
      // TypeScript itself resolves identifiers, and core `no-undef` does not know
      // about TS-only globals (utility types like `Record`, `Partial`,
      // `Parameters`). Disabling it for TS/Svelte is the typescript-eslint
      // recommendation and removes those false positives.
      "no-undef": "off",
      // Allow intentionally-unused identifiers prefixed with `_` (placeholder
      // params, ignored destructured values, caught errors).
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      // This project navigates via string-path helpers (see
      // `$lib/utils/routing/routes`) rather than route-id `resolve()`, so this
      // opt-in SvelteKit rule does not fit the codebase's routing convention.
      "svelte/no-navigation-without-resolve": "off",
    },
  },
);
