#!/usr/bin/env node
import {readFile} from "node:fs/promises";

import {
  buildExampleCharacterDocuments,
  compileExampleCharacterPack,
  defaultExampleCharacterPaths,
  readExampleCharacterSource,
  validateExampleCharacterDocuments,
  withCypherPack,
  writeExampleCharacterDocuments
} from "./example-character-importer.mjs";
import {generateCypherImport, readCypherImportSource} from "./cypher-importer.mjs";

const paths = defaultExampleCharacterPaths();
const source = await readExampleCharacterSource(paths.source);
const {cypherDocuments} = generateCypherImport(await readCypherImportSource(paths.cypherCatalog));
const corePackSource = withCypherPack(JSON.parse(await readFile(paths.corePackSource, "utf8")), cypherDocuments);

const documents = validateExampleCharacterDocuments(
  buildExampleCharacterDocuments(source, corePackSource)
);
const sourceDirectory = await writeExampleCharacterDocuments(paths.generatedRoot, documents);
await compileExampleCharacterPack({projectRoot: paths.projectRoot, sourceDirectory});

const embedded = documents.reduce((total, document) => total + document.items.length, 0);
console.log(`Compiled ${documents.length} Example Characters with ${embedded} embedded Items.`);
console.log(`Canonical example character source: ${paths.source}`);
