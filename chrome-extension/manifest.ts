import { type Plugin } from "vite";
import { writeFileSync, readFileSync } from "fs";
import { execSync } from "child_process";

const appFilename = "index.html";
const jsFilename = "devtools.js";
const htmlFilename = "devtools.html";
const communicator = "communicator";
const background = "background";
const contentScript = "content-script";
const manifestFilename = "manifest.json";
const dist = "dist";

function genManifest() {
  const manifest = {
    manifest_version: 3,
    name: "Stalo Chrome Extension",
    version: JSON.parse(readFileSync("package.json", "utf-8")).version,
    description: "Chrome extension for stalo debugging",
    devtools_page: `${htmlFilename}`,
    icons: {
      128: "icon.png",
    },
    background: {
      service_worker: background + ".js",
    },
    content_scripts: [
      {
        matches: ["<all_urls>"],
        js: [contentScript + ".js"],
        run_at: "document_start",
      },
    ],
    host_permissions: ["file:///*", "http://*/*", "https://*/*"],
    web_accessible_resources: [
      {
        resources: [communicator + ".js"],
        matches: ["<all_urls>"],
      },
    ],
  };

  writeFileSync(
    `${dist}/${jsFilename}`,
    `chrome.devtools.panels.create("Stalo", undefined, "${appFilename}");`
  );
  console.info("Generated chrome extension js entrypoint");

  writeFileSync(
    `${dist}/${htmlFilename}`,
    `<html>
      <head>
        <meta charset="utf-8"/>
        <title>Stalo Devtools</title>
      </head>
      <script src="${jsFilename}"></script>
    </html>`
  );
  console.info("Generated chrome extension html entrypoint");

  [communicator, background, contentScript].forEach((entry) => {
    execSync(`npx vite -c vite.ext.config.ts build`, {
      stdio: "inherit",
      env: {
        ...process.env,
        ENTRY: entry,
      },
    });
  });

  writeFileSync("dist/icon.png", readFileSync("src/icon.png"));
  console.info("Generated chrome extension icons");

  writeFileSync(
    `${dist}/${manifestFilename}`,
    JSON.stringify(manifest, null, 2)
  );
  console.info("Generated chrome extension manifest");
}

const plugin: Plugin = {
  name: "generate-manifest",
  closeBundle: genManifest,
  buildStart() {
    this.addWatchFile("src/inject.ts");
  },
};

export default plugin;
