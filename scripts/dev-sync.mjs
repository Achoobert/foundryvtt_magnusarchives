import {cp, mkdir} from "node:fs/promises";
import {existsSync} from "node:fs";
import path from "node:path";
import {DATA_DIR, ROOT} from "./lib/fvtt-config.mjs";
import {SYSTEM_ID} from "./lib/system-manifest.mjs";

// Everything Foundry needs to serve the system. `dist/` holds the Vite bundle,
// `packs/` holds the LevelDB compendiums produced by the import:* scripts.
const ENTRIES_TO_SYNC = [
  "system.json",
  "dist",
  "templates",
  "lang",
  "assets",
  "packs"
];

const TARGET = path.join(DATA_DIR, "systems", SYSTEM_ID);

if (!existsSync(path.join(ROOT, "dist"))) {
  console.error("No dist/ directory. Run `pnpm build` (or `pnpm dev`) first.");
  process.exit(1);
}

await mkdir(TARGET, {recursive: true});

for (const entry of ENTRIES_TO_SYNC) {
  const source = path.join(ROOT, entry);
  if (!existsSync(source)) {
    console.warn(`Skipping ${entry} (not present).`);
    continue;
  }
  await cp(source, path.join(TARGET, entry), {recursive: true, force: true});
}

console.log(`Synced ${SYSTEM_ID} to ${TARGET}`);
