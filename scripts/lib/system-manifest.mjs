import {readFileSync} from "node:fs";
import path from "node:path";
import {ROOT} from "./fvtt-config.mjs";

export const SYSTEM_MANIFEST_PATH = path.join(ROOT, "system.json");
export const SYSTEM_MANIFEST = JSON.parse(readFileSync(SYSTEM_MANIFEST_PATH, "utf8"));
export const SYSTEM_ID = SYSTEM_MANIFEST.id;
export const SYSTEM_TITLE = SYSTEM_MANIFEST.title;
export const QUENCH_MODULE_ID = `${SYSTEM_ID}-quench-tests`;
