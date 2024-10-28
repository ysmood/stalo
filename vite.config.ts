import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  root: "examples",
  plugins: [react()],
  optimizeDeps: { exclude: ["fsevents"] },
});
