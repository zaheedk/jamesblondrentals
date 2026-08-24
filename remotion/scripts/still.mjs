import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition, openBrowser } from "@remotion/renderer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frames = process.argv.slice(2).map(Number);

const bundled = await bundle({
  entryPoint: path.resolve(__dirname, "../src/index.ts"),
  webpackOverride: (c) => c,
});

const browser = await openBrowser("chrome", {
  browserExecutable: "/bin/chromium",
  chromiumOptions: { args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"] },
  chromeMode: "chrome-for-testing",
});

const composition = await selectComposition({ serveUrl: bundled, id: "main", puppeteerInstance: browser });

for (const frame of frames) {
  await renderStill({
    composition,
    serveUrl: bundled,
    output: `/tmp/browser/f${frame}.png`,
    frame,
    puppeteerInstance: browser,
    overwrite: true,
  });
  console.log("frame", frame);
}

await browser.close({ silent: false });
