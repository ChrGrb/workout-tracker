import {
  defineConfig,
  minimal2023Preset,
} from "@vite-pwa/assets-generator/config";

export default defineConfig({
  preset: {
    ...minimal2023Preset,
    apple: {
      sizes: [180],
      padding: 0,
    },
  },
  images: ["static/favicon.png"],
});
