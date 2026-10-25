import {mkdir, writeFile} from "node:fs/promises";
import {existsSync} from "node:fs";
import path from "node:path";
import {DATA_DIR} from "./lib/fvtt-config.mjs";
import {SYSTEM_ID, SYSTEM_MANIFEST, SYSTEM_TITLE} from "./lib/system-manifest.mjs";

const WORLD_ID = SYSTEM_ID;
const WORLD_DIR = path.join(DATA_DIR, "worlds", WORLD_ID);
const WORLD_JSON_PATH = path.join(WORLD_DIR, "world.json");

await mkdir(path.join(WORLD_DIR, "data"), {recursive: true});
await mkdir(path.join(WORLD_DIR, "scenes"), {recursive: true});

if (existsSync(WORLD_JSON_PATH)) {
  console.log(`World already exists at ${WORLD_JSON_PATH}`);
  process.exit(0);
}

const worldJson = {
  title: SYSTEM_TITLE,
  system: SYSTEM_ID,
  id: WORLD_ID,
  coreVersion: SYSTEM_MANIFEST.compatibility.verified,
  compatibility: {
    minimum: SYSTEM_MANIFEST.compatibility.minimum,
    verified: SYSTEM_MANIFEST.compatibility.verified
  },
  systemVersion: SYSTEM_MANIFEST.version,
  description: `Local dev world for the ${SYSTEM_TITLE} system.`,
  flags: {}
};

await writeFile(WORLD_JSON_PATH, `${JSON.stringify(worldJson, null, 2)}\n`);
console.log(`Created dev world at ${WORLD_JSON_PATH}`);
console.log(`Launch it with: ./start_direct.sh ${WORLD_ID} (from your container dir)`);
