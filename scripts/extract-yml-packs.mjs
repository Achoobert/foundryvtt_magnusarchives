#!/usr/bin/env node
/**
 * Extracts the compiled LevelDB packs back into yml_source/<pack>/ as one YAML
 * file per document, nested by Foundry folder. Use it to pull in edits made in
 * a running Foundry (unlock the compendium, edit, close Foundry, extract).
 * It replaces yml_source/<pack>/ wholesale, so commit or stash YAML edits first.
 *
 * Run: pnpm packs:extract            (every pack in system.json)
 *      pnpm packs:extract -- skills  (only the named packs)
 */
import {existsSync} from "node:fs";
import path from "node:path";
import {extractPack} from "@foundryvtt/foundryvtt-cli";
import {ROOT} from "./lib/fvtt-config.mjs";
import {SYSTEM_MANIFEST} from "./lib/system-manifest.mjs";

const SOURCE_DIR = path.join(ROOT, "yml_source");

const only = new Set(process.argv.slice(2).filter((arg) => arg !== "--"));
const packs = SYSTEM_MANIFEST.packs.filter((pack) => !only.size || only.has(pack.name));
const unknown = [...only].filter((name) => !SYSTEM_MANIFEST.packs.some((pack) => pack.name === name));
if (unknown.length) {
  console.error(`Not a system.json pack: ${unknown.join(", ")}`);
  process.exit(1);
}

for (const pack of packs) {
  const source = path.join(ROOT, pack.path);
  if (!existsSync(source)) {
    console.error(`Missing ${pack.path}; run pnpm packs:build first.`);
    process.exit(1);
  }
  await extractPack(source, path.join(SOURCE_DIR, pack.name), {yaml: true, folders: true, clean: true});
  console.log(`Extracted ${pack.path} -> yml_source/${pack.name}`);
}
