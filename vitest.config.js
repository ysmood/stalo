import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["@vitest/coverage-istanbul"]
  },
  test: {
    include: ["./src/*.test.ts", "./src/*.test.tsx"],
    browser: {
      enabled: true,
      name: "chromium",
      provider: "playwright",
      headless: true,
    },
    coverage: {
      provider: "istanbul",
      include: ["src/*.ts", "src/*.tsx"],
    },
    setupFiles: ["./src/vitest.setup.ts"],
  },
});
