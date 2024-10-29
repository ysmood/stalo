import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import manifest from "./manifest";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), manifest],
  optimizeDeps: {
    include: [
      `monaco-editor/esm/vs/language/json/json.worker`,
      `monaco-editor/esm/vs/editor/editor.worker`,
    ],
  },
  build: {
    chunkSizeWarningLimit: 10 * 1024 * 1024,
  },
});
