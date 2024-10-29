import { defineConfig } from "vite";

const name = process.env.ENTRY!;

export default defineConfig({
  build: {
    emptyOutDir: false,
    chunkSizeWarningLimit: 10 * 1024 * 1024,
    rollupOptions: {
      input: `./src/${name}.ts`,
      output: {
        entryFileNames: "[name].js",
        format: "iife",
      },
    },
  },
});
