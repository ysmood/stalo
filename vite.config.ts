import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  root: "examples",
  plugins: [react()],
  resolve: {
    alias: {
      "create-global-state": "../src/index.ts",
    },
  },
});