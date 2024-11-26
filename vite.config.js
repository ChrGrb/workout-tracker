import { sveltekit } from "@sveltejs/kit/vite";
import mkcert from "vite-plugin-mkcert";
import { defineConfig } from "vite";
import { resolve } from "path";
import svg from "@poppanator/sveltekit-svg";
import { SvelteKitPWA } from "@vite-pwa/sveltekit";
import { purgeCss } from "vite-plugin-tailwind-purgecss";

export default defineConfig({
  server: {
    host: "dev.workout-tracker.com",
    watch: {
      usePolling: true,
    },
    proxy: {},
  },
  resolve: {
    alias: {
      $: resolve("./src"),
    },
  },
  define: {
    "process.env.NODE_ENV":
      process.env.NODE_ENV === "production" ? '"production"' : '"development"',
  },
  plugins: [
    sveltekit(),
    purgeCss(),
    mkcert(),
    svg({
      includePaths: ["./src/lib/icons/"],
    }),
    SvelteKitPWA({
      srcDir: "./src",
      strategies: "injectManifest",
      filename: "service-worker.ts",
      devOptions: {
        enabled: true,
        type: "module",
      },
      injectManifest: {
        globPatterns: ["client/**/*.{js,css,ico,png,svg,webp,woff,woff2}"],
      },
      workbox: {
        globPatterns: ["client/**/*.{js,css,ico,png,svg,webp,woff,woff2}"],
        swDest: "service-worker.js",
      },
      manifest: {
        short_name: "Workout Tracker",
        name: "Workout Tracker",
        description: "The minimal workout tracking app",
        start_url: "/auth/login",
        scope: "/overview",
        display: "standalone",
        theme_color: "#000000",
        background_color: "#ffffff",
        orientation: "portrait",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
});
