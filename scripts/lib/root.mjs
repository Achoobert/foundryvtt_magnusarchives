import path from "node:path";
import {fileURLToPath} from "node:url";

// Repo root. Kept apart from fvtt-config.mjs so build scripts that run in CI
// don't need a local fvtt.config.js.
export const ROOT = path.dirname(path.dirname(path.dirname(fileURLToPath(import.meta.url))));
