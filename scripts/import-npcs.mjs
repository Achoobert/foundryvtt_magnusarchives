#!/usr/bin/env node
import {
  buildNpcDocuments,
  compileNpcPack,
  defaultNpcPaths,
  validateNpcDocuments,
  writeNpcDocuments
} from "./npc-importer.mjs";

const paths = defaultNpcPaths();
const documents = validateNpcDocuments(buildNpcDocuments());
const sourceDirectory = await writeNpcDocuments(paths.generatedRoot, documents);
await compileNpcPack({projectRoot: paths.projectRoot, sourceDirectory});

const folders = documents.filter((document) => document._key.startsWith("!folders!")).length;
console.log(`Compiled ${documents.length - folders} NPCs and monsters in ${folders} Folders.`);
console.log("Canonical NPC source: scripts/content/magnus-npcs.mjs");
