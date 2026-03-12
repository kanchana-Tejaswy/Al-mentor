// @ts-nocheck
import { build } from "esbuild";
import { execSync } from "child_process";
import path from "path";
import fs from "fs";

async function main() {
  console.log("Building client using Vite...");
  // run from project root so the config file is resolved correctly
  execSync("vite build", { stdio: "inherit" });

  // production output will land in dist/public per vite.config.ts
  // no further copying is required

  console.log("Building server for local use...");
  await build({
    entryPoints: ["server/index.ts"],
    bundle: true,
    platform: "node",
    outfile: "dist/index.cjs",
    format: "cjs",
    sourcemap: true,
    target: "node18",
  });

  console.log("Building Netlify function...");
  await build({
    entryPoints: ["server/netlify.ts"],
    bundle: true,
    platform: "node",
    outfile: "netlify/functions/server.js",
    format: "cjs",
    sourcemap: true,
    target: "node18",
  });

  console.log("Build complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
