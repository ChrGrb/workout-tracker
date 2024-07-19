const defaultTheme = require("tailwindcss/defaultTheme");

import { skeleton } from "@skeletonlabs/tw-plugin";
import { join } from "path";
import type { Config } from "tailwindcss";
import { customTheme } from "./src/theme";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./src/**/*.{html,js,svelte,ts}",
    join(
      require.resolve("@skeletonlabs/skeleton"),
      "../**/*.{html,js,svelte,ts}"
    ),
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Montserrat", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [skeleton({ themes: { custom: [customTheme] } })],
} satisfies Config;
