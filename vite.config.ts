import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import reactVirtualized from "./devtools-ui/react-virtualized-patch";

// https://vitejs.dev/config/
export default defineConfig({
  root: "examples",
  plugins: [react(), reactVirtualized()],
  optimizeDeps: { exclude: ["fsevents"] },
});
