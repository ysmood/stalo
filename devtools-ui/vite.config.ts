import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import reactVirtualized from "./react-virtualized-patch";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), reactVirtualized()],
  optimizeDeps: {
    exclude: ["fsevents"],
    include: [
      `monaco-editor/esm/vs/language/json/json.worker`,
      `monaco-editor/esm/vs/editor/editor.worker`,
    ],
  },
});
