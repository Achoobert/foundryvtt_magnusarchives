/**
 * Rewrites content/cyphers/catalog.json from the authored Magnus cypher list,
 * replacing the Cypher V2 catalogue. Then `pnpm import:cyphers` compiles the
 * Cyphers and Cypher Tables packs as usual.
 */
import {readFileSync, writeFileSync} from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {cypherTableCompendiumUuid, validateCypherImportSource} from "./cypher-importer.mjs";
import {MAGNUS_CYPHERS, MAGNUS_CYPHER_TABLES} from "./content/magnus-cyphers.mjs";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const TARGET = path.join(ROOT, "content", "cyphers", "catalog.json");

function slug(name) {
  return name.toLowerCase().replace(/['’!]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const tablesById = new Map(MAGNUS_CYPHER_TABLES.map((table) => [table.id, table]));

function describe(cypher) {
  const header = [`<strong>Level:</strong> ${cypher.level}`];
  if (cypher.instant) header.push("<strong>Instant.</strong>");
  const parts = [`<p>${header.join(" · ")}</p>`, `<p>${cypher.effect}</p>`];
  if (cypher.table) {
    const table = tablesById.get(cypher.table);
    if (!table) throw new Error(`Cypher "${cypher.name}" references unknown table "${cypher.table}".`);
    parts.push(`<p>Roll on @UUID[${cypherTableCompendiumUuid(table.id)}]{${table.name}}.</p>`);
  }
  return parts.join("");
}

const cyphers = MAGNUS_CYPHERS.map((cypher, index) => {
  const fixed = /^\d+$/.test(cypher.level) ? Number(cypher.level) : null;
  return {
    id: slug(cypher.name),
    name: cypher.name,
    category: "standard",
    manifestation: "subtle",
    power: null,
    level: fixed,
    levelOverride: fixed !== null,
    levelFormula: cypher.level,
    instant: cypher.instant === true,
    form: "",
    description: describe(cypher),
    sourcePage: cypher.page,
    sourceOrder: index + 1,
    nonstandard: false,
    reviewStatus: "verified",
    reviewNote: ""
  };
});

const tables = [
  {
    id: "random-cyphers",
    name: "Random Cyphers",
    sourcePage: "107",
    formula: "1d100",
    results: MAGNUS_CYPHERS.map((cypher) => ({
      range: [...cypher.d00],
      text: null,
      cypherId: slug(cypher.name),
      tableId: null
    }))
  },
  ...MAGNUS_CYPHER_TABLES.map((table) => ({
    id: table.id,
    name: table.name,
    sourcePage: table.page,
    formula: "1d100",
    results: table.results.map(([range, text]) => ({range: [...range], text, cypherId: null, tableId: null}))
  }))
];

const catalog = {
  $schema: "./catalog.schema.json",
  schemaVersion: 1,
  source: {
    id: "magnus-archives-rpg-cyphers",
    title: "The Magnus Archives Roleplaying Game",
    version: "2024",
    license: "Rusty Quill; not covered by the Cypher Open License",
    pages: "105-113"
  },
  reviewIssues: [
    {
      issueType: "source-license",
      reviewStatus: "manual-review",
      note: "Cypher effects are paraphrased from The Magnus Archives Roleplaying Game. Rusty Quill's IP (entity names in cypher names) is not under the Cypher Open License; confirm redistribution terms before public release."
    }
  ],
  cyphers,
  tables
};

validateCypherImportSource(catalog);
writeFileSync(TARGET, `${JSON.stringify(catalog, null, 2)}\n`);
console.log(`Wrote ${cyphers.length} Magnus cyphers and ${tables.length} tables to ${path.relative(ROOT, TARGET)}.`);
