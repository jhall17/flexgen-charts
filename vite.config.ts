import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import react from "@vitejs/plugin-react-swc";
import wasm from "vite-plugin-wasm";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    wasm(),
    viteStaticCopy({
      targets: [
        {
          src: "node_modules/scichart/_wasm/scichart2d.data",
          dest: "./",
        },
        {
          src: "node_modules/scichart/_wasm/scichart2d.wasm",
          dest: "./",
        },
      ],
    }),
    dts(),
  ],
  server: {
    fs: {
      allow: [".."],
    },
  },
  build: {
    lib: {
      name: "@flexgen/charts",
      entry: "dist/index.js",
      fileName: "index",
    },
  },
});
