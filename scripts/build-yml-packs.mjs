#!/usr/bin/env node
/**
 * Compiles the editable YAML under yml_source/<pack>/ into the LevelDB packs
 * that system.json declares. yml_source/ is the source of truth; packs/ is
 * build output. Each pack directory holds one .yml per document, nested by
 * Foundry folder (a folder's own document is its _Folder.yml).
 *
 * Run: pnpm packs:build
 */
import {existsSync} from "node:fs";
import path from "node:path";
import {compilePack} from "@foundryvtt/foundryvtt-cli";
import {ROOT} from "./lib/fvtt-config.mjs";
import {SYSTEM_MANIFEST} from "./lib/system-manifest.mjs";

const SOURCE_DIR = path.join(ROOT, "yml_source");

const missing = SYSTEM_MANIFEST.packs.filter((pack) => !existsSync(path.join(SOURCE_DIR, pack.name)));
if (missing.length) {
  console.error(`No YAML source for: ${missing.map((pack) => pack.name).join(", ")} (expected yml_source/<pack>/).`);
  process.exit(1);
}

for (const pack of SYSTEM_MANIFEST.packs) {
  await compilePack(path.join(SOURCE_DIR, pack.name), path.join(ROOT, pack.path), {yaml: true, recursive: true});
  console.log(`Compiled yml_source/${pack.name} -> ${pack.path}`);
}
