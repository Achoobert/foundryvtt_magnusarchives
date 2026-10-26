import {createHash} from "node:crypto";
import {mkdir, rm, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

import {
  MAGNUS_ANIMALS,
  MAGNUS_MONSTERS,
  MAGNUS_NPC_FOLDERS,
  MAGNUS_PEOPLE,
  MAGNUS_SIDEBAR_PEOPLE
} from "./content/magnus-npcs.mjs";

export const NPC_PACK_ID = "npcs";
export const NPC_PACK_LABEL = "NPCs & Monsters";
export const NPC_IMG = "systems/magnusarchives/assets/icons/magnusnpc.webp";

const BOOK = "The Magnus Archives Roleplaying Game";
const FOUNDRY_ID_PATTERN = /^[A-Za-z0-9]{16}$/;
const RANGE_CATEGORIES = ["immediate", "short", "long", "very-long", "specified"];
const MODIFICATION_MODES = ["levelOverride", "levelDelta", "ease", "hinder"];
/** NUL cannot appear in a source id, so joined keys stay unambiguous. */
const SEPARATOR = "\u0000";

export class NpcValidationError extends Error {
  constructor(errors) {
    super(`NPC content is invalid:\n${errors.map((entry) => `- ${entry}`).join("\n")}`);
    this.name = "NpcValidationError";
    this.errors = errors;
  }
}

export function stableNpcId(kind, sourceId) {
  return createHash("sha256")
    .update(["magnusarchives", kind, sourceId].join(SEPARATOR))
    .digest("hex")
    .slice(0, 16);
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

function escapeHtml(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** The book's default: level 1-3 inflicts 1 Stress per level, level 4+ a serious injury (p193). */
function defaultDamage(level) {
  return level >= 4 ? "serious" : level;
}

function damageText(damage) {
  if (damage === "serious") return "Serious injury";
  return `${damage} point${damage === 1 ? "" : "s"} of Stress`;
}

function modificationText(entry) {
  return `${entry.label} as level ${entry.value}${entry.note ? ` (${entry.note})` : ""}`;
}

function movementText(movement) {
  const label = movement.category === "very-long" ? "Very long" : movement.category[0].toUpperCase() + movement.category.slice(1);
  return movement.notes ? `${label}. ${movement.notes}` : label;
}

function statLine(label, value) {
  return `<p><strong>${label}:</strong> ${escapeHtml(value)}</p>`;
}

/** The full stat block as the sheet's Notes, since that is the prose field the NPC sheet shows. */
function renderNotes(entry, damage, movement) {
  const parts = [];
  if (entry.summary) parts.push(`<p>${escapeHtml(entry.summary)}</p>`);
  parts.push(statLine("Level", `${entry.level} (${entry.level * 3})`));
  if (entry.entity) parts.push(statLine("Related Entity", entry.entity));
  if (entry.visage) parts.push(statLine("Stress on first realizing its horror", `${entry.visage} (usually on a failed Intellect defense roll)`));
  parts.push(statLine("Health", entry.health ?? entry.level * 3));
  parts.push(statLine("Damage Inflicted", entry.damageNote ?? damageText(damage)));
  parts.push(statLine("Movement", movementText(movement)));
  if (entry.mods.length) parts.push(statLine("Modifications", entry.mods.map(modificationText).join("; ")));
  if (entry.combat || entry.abilities?.length) {
    parts.push(`<h3>Combat</h3>`);
    if (entry.combat) parts.push(`<p>${escapeHtml(entry.combat)}</p>`);
    for (const [name, text] of entry.abilities ?? []) {
      parts.push(`<p><strong>${escapeHtml(name)}:</strong> ${escapeHtml(text)}</p>`);
    }
  }
  if (entry.interaction) parts.push(`<h3>Interaction</h3><p>${escapeHtml(entry.interaction)}</p>`);
  if (entry.use) parts.push(`<h3>Use</h3><p>${escapeHtml(entry.use)}</p>`);
  if (entry.extra?.length) parts.push(`<h3>Notes</h3>${entry.extra.map((line) => `<p>${escapeHtml(line)}</p>`).join("")}`);
  parts.push(`<p><em>${BOOK}, p${entry.page}.</em></p>`);
  return parts.join("");
}

function buildModifications(entry) {
  return entry.mods.map((modification, index) => ({
    id: stableNpcId("npc-modification", [entry.id, index, modification.label].join(SEPARATOR)),
    label: modification.label,
    contexts: [...modification.contexts],
    mode: modification.mode,
    value: modification.value,
    visibility: "gm",
    predicate: structuredClone(modification.predicate ?? {}),
    description: modification.note ? `<p>${escapeHtml(modification.note)}</p>` : ""
  }));
}

function buildActor(entry, folderIds, sort, hostile) {
  const _id = stableNpcId("npc", entry.id);
  const damage = entry.damage ?? defaultDamage(entry.level);
  const movement = {category: "short", notes: "", ...(entry.movement ?? {})};
  const health = entry.health ?? entry.level * 3;
  return {
    _id,
    _key: `!actors!${_id}`,
    name: entry.name,
    type: "npc",
    img: NPC_IMG,
    system: {
      schemaVersion: 1,
      description: entry.summary ? `<p>${escapeHtml(entry.summary)}</p>` : "",
      notes: renderNotes(entry, damage, movement),
      gmNotes: "",
      level: entry.level,
      health: {value: health, baseMax: health},
      armor: 0,
      armorBase: 0,
      damage: {
        amount: damage === "serious" ? entry.level : damage,
        effect: damage === "serious" ? "seriousInjury" : "stress",
        stressAmount: damage === "serious" ? 3 : damage,
        defense: {allowBlock: true, allowDodge: true},
        notes: entry.damageNote ?? damageText(damage)
      },
      movement: {category: movement.category, distance: "", notes: movement.notes},
      modifications: buildModifications(entry),
      gmIntrusion: entry.gmIntrusion ? `<p>${escapeHtml(entry.gmIntrusion)}</p>` : ""
    },
    items: [],
    effects: [],
    folder: folderIds.get(entry.folder) ?? null,
    sort,
    flags: {magnusarchives: {source: {book: BOOK, page: String(entry.page), sidebar: entry.sidebar === true}}},
    ownership: {default: 0},
    prototypeToken: {
      name: entry.name,
      texture: {src: NPC_IMG},
      actorLink: false,
      sight: {enabled: false},
      disposition: hostile ? -1 : 0
    },
    _stats: emptyStats()
  };
}

function buildFolder(name, index) {
  const _id = stableNpcId("npc-folder", name);
  return {
    _id,
    _key: `!folders!${_id}`,
    name,
    type: "Actor",
    folder: null,
    color: null,
    sorting: "a",
    description: "",
    sort: (index + 1) * 100,
    flags: {},
    _stats: emptyStats()
  };
}

/** Every chapter 12 entry plus the p195 tables, as Folder and Actor documents. */
export function buildNpcDocuments() {
  const folders = MAGNUS_NPC_FOLDERS.map(buildFolder);
  const folderIds = new Map(folders.map((folder) => [folder.name, folder._id]));
  const simple = (entry, folder) => ({page: 195, ...entry, folder});
  const entries = [
    ...MAGNUS_MONSTERS.map((entry) => ({entry, hostile: true})),
    ...MAGNUS_SIDEBAR_PEOPLE.map((entry) => ({entry, hostile: true})),
    ...MAGNUS_ANIMALS.map((entry) => ({entry: simple(entry, "Animals"), hostile: false})),
    ...MAGNUS_PEOPLE.map((entry) => ({entry: simple(entry, "People"), hostile: false}))
  ];
  const actors = entries.map(({entry, hostile}, index) => buildActor(entry, folderIds, (index + 1) * 100, hostile));
  return [...folders, ...actors];
}

export function validateNpcDocuments(documents) {
  const errors = [];
  const ids = new Set();
  const folderIds = new Set(documents.filter((document) => document._key.startsWith("!folders!")).map((document) => document._id));
  for (const [index, document] of documents.entries()) {
    const location = `documents[${index}] '${document.name}'`;
    if (!FOUNDRY_ID_PATTERN.test(document._id ?? "")) errors.push(`${location}._id must be a 16-character Foundry ID.`);
    if (ids.has(document._id)) errors.push(`${location} duplicates document ID '${document._id}'.`);
    ids.add(document._id);
    if (document._key.startsWith("!folders!")) {
      if (document._key !== `!folders!${document._id}`) errors.push(`${location}._key does not match its ID.`);
      if (document.type !== "Actor") errors.push(`${location}.type must be 'Actor' for a Folder in an Actor pack.`);
      continue;
    }
    if (document._key !== `!actors!${document._id}`) errors.push(`${location}._key does not match its ID.`);
    if (document.type !== "npc") errors.push(`${location}.type must be 'npc'.`);
    if (document.folder && !folderIds.has(document.folder)) errors.push(`${location} references missing Folder '${document.folder}'.`);
    const system = document.system;
    if (!Number.isInteger(system.level) || system.level < 1) errors.push(`${location}.system.level must be a positive integer.`);
    if (!Number.isInteger(system.health.baseMax) || system.health.baseMax < 1) errors.push(`${location}.system.health.baseMax must be a positive integer.`);
    if (!RANGE_CATEGORIES.includes(system.movement.category)) errors.push(`${location}.system.movement.category is invalid.`);
    if (!["stress", "seriousInjury"].includes(system.damage.effect)) errors.push(`${location}.system.damage.effect is invalid.`);
    for (const modification of system.modifications) {
      if (!MODIFICATION_MODES.includes(modification.mode)) errors.push(`${location} modification '${modification.label}' has an invalid mode.`);
      if (!Number.isInteger(modification.value)) errors.push(`${location} modification '${modification.label}' needs an integer value.`);
      if (!modification.contexts.length) errors.push(`${location} modification '${modification.label}' needs at least one context.`);
    }
  }
  if (errors.length > 0) throw new NpcValidationError(errors);
  return documents;
}

export async function writeNpcDocuments(directory, documents) {
  await rm(directory, {recursive: true, force: true});
  await mkdir(directory, {recursive: true});
  for (const document of documents) {
    const prefix = document._key.startsWith("!folders!") ? "folder" : "actor";
    await writeFile(path.join(directory, `${prefix}-${document._id}.json`), `${JSON.stringify(document, null, 2)}\n`, "utf8");
  }
  return directory;
}

export function assertNpcPackDestination(projectRoot, destination) {
  const expected = path.resolve(projectRoot, "packs", NPC_PACK_ID);
  if (path.resolve(destination) !== expected) {
    throw new Error(`Refusing to write unexpected pack destination '${destination}'.`);
  }
}

export async function compileNpcPack({projectRoot, sourceDirectory}) {
  const {compilePack} = await import("@foundryvtt/foundryvtt-cli");
  const destination = path.resolve(projectRoot, "packs", NPC_PACK_ID);
  assertNpcPackDestination(projectRoot, destination);
  await rm(destination, {recursive: true, force: true});
  await compilePack(sourceDirectory, destination, {log: true});
  return destination;
}

export function defaultNpcPaths(projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")) {
  return {
    projectRoot,
    generatedRoot: path.join(projectRoot, ".generated", "npc-import")
  };
}
