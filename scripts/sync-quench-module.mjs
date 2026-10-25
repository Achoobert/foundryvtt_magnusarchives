import {cp, mkdir, rm} from "node:fs/promises";
import {existsSync} from "node:fs";
import path from "node:path";
import {DATA_DIR, ROOT} from "./lib/fvtt-config.mjs";
import {QUENCH_MODULE_ID} from "./lib/system-manifest.mjs";

const SOURCE = path.join(ROOT, "tests", "quench");
const TARGET = path.join(DATA_DIR, "modules", QUENCH_MODULE_ID);

if (!existsSync(SOURCE)) {
  console.error(`No Quench sources at ${SOURCE}.`);
  process.exit(1);
}

await rm(TARGET, {recursive: true, force: true});
await mkdir(TARGET, {recursive: true});
await cp(SOURCE, TARGET, {recursive: true, force: true});

console.log(`Quench test module deployed to ${TARGET}`);
