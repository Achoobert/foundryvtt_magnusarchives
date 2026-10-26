/**
 * Rewrites the `artefacts` pack inside content/core-items/reviewed-packs.json
 * from the authored Magnus artefact and book list, then leaves
 * `pnpm import:core-packs` to compile the LevelDB pack as usual.
 */
import {createHash} from "node:crypto";
import {readFileSync, writeFileSync} from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {MAGNUS_ARTEFACTS} from "./content/magnus-artefacts.mjs";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SOURCE = path.join(ROOT, "content", "core-items", "reviewed-packs.json");
const IMG = "systems/magnusarchives/assets/icons/magnusartefact.webp";

function documentId(kind, name) {
  return createHash("sha256").update(`magnusarchives:${kind}:${name}`).digest("hex").slice(0, 16);
}

function emptyStats() {
  return {
    coreVersion: "14.360",
    systemId: null,
    systemVersion: null,
    createdTime: null,
    modifiedTime: null,
    lastModifiedBy: null,
    compendiumSource: null,
    duplicateSource: null,
    exportSource: null
  };
}

function slugify(text) {
  return text.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// Books are a subcategory of artefacts (p267), so both live in one pack.
const FOLDERS = [
  {kind: "artefact", name: "Artefacts"},
  {kind: "book", name: "Books"}
].map((folder, index) => {
  const id = documentId("artefact-folder", folder.name);
  return {
    kind: folder.kind,
    document: {
      type: "Item",
      folder: null,
      name: folder.name,
      color: null,
      sorting: "a",
      _id: id,
      description: "",
      sort: (index + 1) * 100000,
      flags: {},
      _stats: emptyStats(),
      _key: `!folders!${id}`
    }
  };
});

function render(block) {
  if (Array.isArray(block)) return `<ul>${block.map((entry) => `<li><p>${entry}</p></li>`).join("")}</ul>`;
  return `<p>${block}</p>`;
}

function describe(artefact) {
  return [
    `<p><strong>Level:</strong> ${artefact.level}</p>`,
    `<p><strong>Related Entity:</strong> ${artefact.entities.join(" and ")}</p>`,
    `<p><strong>Stress:</strong> ${artefact.stress}</p>`,
    ...artefact.effect.map(render),
    `<p><strong>Fear:</strong> ${artefact.fear}</p>`
  ].join("");
}

const data = JSON.parse(readFileSync(SOURCE, "utf8"));
const used = new Set();
const items = MAGNUS_ARTEFACTS.map((artefact, index) => {
  const id = documentId("artefact", artefact.name);
  if (used.has(id)) throw new Error(`Duplicate artefact "${artefact.name}".`);
  used.add(id);
  const folder = FOLDERS.find((entry) => entry.kind === artefact.kind);
  if (!folder) throw new Error(`Artefact "${artefact.name}" has unknown kind "${artefact.kind}".`);
  return {
    folder: folder.document._id,
    name: artefact.name,
    type: "artifact",
    _id: id,
    _key: `!items!${id}`,
    sort: (index + 1) * 100,
    img: IMG,
    effects: [],
    flags: {},
    ownership: {default: 0},
    _stats: emptyStats(),
    system: {
      schemaVersion: 1,
      slug: slugify(artefact.name),
      description: describe(artefact),
      source: {uuid: "", book: "The Magnus Archives Roleplaying Game", page: artefact.page, license: "original"},
      automation: {mode: "descriptive", duration: {enabled: false, trigger: "recovery"}, rollDefaults: {}},
      ruleElements: [],
      tags: [artefact.kind, ...artefact.entities.map(slugify)],
      grantedBy: {
        kind: "other",
        sourceUuid: "",
        instanceId: "",
        grantId: "",
        status: "active",
        contentUuid: "",
        contentKey: "",
        replacement: {
          active: false,
          originalName: "",
          originalContentUuid: "",
          originalContentKey: "",
          replacementName: "",
          replacementContentUuid: "",
          replacementContentKey: "",
          selectionKind: "none"
        }
      },
      // Magnus artefacts have no depletion roll: their cost is Stress and their fear.
      level: artefact.level,
      identified: true,
      depletion: {enabled: false, die: "d6", formula: "1d6", threshold: 1},
      depleted: false,
      uses: 0
    }
  };
});

data.packs.artefacts.documents = [...FOLDERS.map((folder) => folder.document), ...items];
writeFileSync(SOURCE, `${JSON.stringify(data, null, 2)}\n`);
const books = MAGNUS_ARTEFACTS.filter((artefact) => artefact.kind === "book").length;
console.log(`Wrote ${items.length - books} Magnus artefacts and ${books} books to ${path.relative(ROOT, SOURCE)}.`);
