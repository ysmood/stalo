import { defineConfig } from "@playwright/test";
import express from "express";
import { createServer } from "vite";
import viteConfig from "./vite.config";

export default (async () => {
  const baseURL = await serve();

  return defineConfig({
    use: {
      baseURL,
    },
  });
})();

// Create a vite server on a random port.
async function serve() {
  const app = express();

  viteConfig.cacheDir = ".vite-playwright";

  viteConfig.server = {
    ...viteConfig.server,
    middlewareMode: true,
    ws: false,
    watch: null,
    hmr: false,
  };

  viteConfig.logLevel = "error";

  const vite = await createServer(viteConfig);

  app.use(vite.middlewares);

  return new Promise((resolve, reject) => {
    const listener = app.listen(0, (err) => {
      if (err) return reject(err);

      resolve(`http://127.0.0.1:${listener.address().port}`);
    });
  });
}
