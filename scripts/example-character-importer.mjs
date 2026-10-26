import {createHash} from "node:crypto";
import {mkdir, readFile, rm, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

export const EXAMPLE_CHARACTER_SCHEMA_VERSION = 1;
export const EXAMPLE_CHARACTER_PACK_ID = "example-characters";
export const EXAMPLE_CHARACTER_PACK_LABEL = "Example Characters";

const FOUNDRY_ID_PATTERN = /^[A-Za-z0-9]{16}$/;
const ACTOR_TYPES = ["character", "npc"];
/** NUL cannot appear in a pack id, document name or index, so joined keys stay unambiguous. */
const SEPARATOR = "\u0000";

export class ExampleCharacterValidationError extends Error {
  constructor(errors) {
    super(`Example Character content is invalid:\n${errors.map((entry) => `- ${entry}`).join("\n")}`);
    this.name = "ExampleCharacterValidationError";
    this.errors = errors;
  }
}

export function stableDocumentId(kind, sourceId) {
  // Stable-ID hash seed: intentionally still 'cypherv2'. Changing it regenerates every
  // generated document _id and breaks the @UUID cross-references in content/.
  return createHash("sha256")
    .update(["cypherv2", kind, sourceId].join(SEPARATOR))
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

function mergeSystem(base, overrides) {
  const merged = structuredClone(base ?? {});
  for (const [key, value] of Object.entries(overrides ?? {})) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      merged[key] = mergeSystem(merged[key], value);
    } else merged[key] = structuredClone(value);
  }
  return merged;
}

/** Index the reviewed core Items by pack and name so `ref` entries can reuse them. */
export function indexCorePackItems(corePackSource) {
  const index = new Map();
  for (const [packId, pack] of Object.entries(corePackSource?.packs ?? {})) {
    for (const document of pack.documents ?? []) {
      if (!String(document._key ?? "").startsWith("!items!")) continue;
      index.set([packId, document.name].join(SEPARATOR), {packId, document});
    }
  }
  return index;
}

function resolveItem(entry, index, errors, location) {
  if (entry.ref) {
    const found = index.get([entry.ref.pack, entry.ref.name].join(SEPARATOR));
    if (!found) {
      errors.push(`${location}.ref does not resolve: ${entry.ref.pack} / ${entry.ref.name}.`);
      return null;
    }
    return {
      name: entry.name ?? found.document.name,
      type: found.document.type,
      img: found.document.img,
      system: mergeSystem(found.document.system, entry.system),
      compendiumSource: `Compendium.magnusarchives.${found.packId}.Item.${found.document._id}`
    };
  }
  if (!entry.inline) {
    errors.push(`${location} must have either a 'ref' or an 'inline' Item.`);
    return null;
  }
  return {
    name: entry.inline.name,
    type: entry.inline.type,
    img: entry.inline.img ?? "icons/svg/item-bag.svg",
    system: structuredClone(entry.inline.system ?? {}),
    compendiumSource: null
  };
}

function buildEmbeddedItem(resolved, actor, index) {
  const _id = stableDocumentId("example-character-item", [actor.id, index, resolved.name].join(SEPARATOR));
  return {
    _id,
    // Embedded documents carry their own sub-collection LevelDB key.
    _key: `!actors.items!${actor.documentId}.${_id}`,
    name: resolved.name,
    type: resolved.type,
    img: resolved.img,
    system: resolved.system,
    effects: [],
    folder: null,
    sort: (index + 1) * 100,
    flags: {},
    ownership: {default: 0},
    _stats: {...emptyStats(), compendiumSource: resolved.compendiumSource}
  };
}

/**
 * Embedded Item IDs are generated here, so content cannot write them directly.
 * `{{itemId:Some Item}}` in any string resolves to that sibling Item's ID, which
 * is how a Focus node, its granted Ability and `system.focusProgress` are tied
 * together. An embedded ID is also what survives import into a World, where the
 * Actor gets a fresh ID and an `Actor.<id>.Item.<id>` UUID would go stale.
 */
function resolveItemIdTokens(value, itemIdsByName, errors, location) {
  if (typeof value === "string") {
    return value.replace(/\{\{itemId:([^}]+)\}\}/g, (match, name) => {
      const id = itemIdsByName.get(name.trim());
      if (!id) {
        errors.push(`${location} references unknown embedded Item '${name.trim()}'.`);
        return match;
      }
      return id;
    });
  }
  if (Array.isArray(value)) {
    return value.map((entry, index) => resolveItemIdTokens(entry, itemIdsByName, errors, `${location}[${index}]`));
  }
  if (value && typeof value === "object") {
    for (const [key, entry] of Object.entries(value)) {
      value[key] = resolveItemIdTokens(entry, itemIdsByName, errors, `${location}.${key}`);
    }
  }
  return value;
}

export function buildExampleCharacterDocuments(source, corePackSource) {
  const errors = [];
  const index = indexCorePackItems(corePackSource);
  const documents = [];

  for (const [actorIndex, actor] of (source.actors ?? []).entries()) {
    const location = `actors[${actorIndex}]`;
    if (typeof actor.id !== "string" || !actor.id.trim()) errors.push(`${location}.id must be non-blank.`);
    if (typeof actor.name !== "string" || !actor.name.trim()) errors.push(`${location}.name must be non-blank.`);
    if (!ACTOR_TYPES.includes(actor.type)) errors.push(`${location}.type must be one of: ${ACTOR_TYPES.join(", ")}.`);

    const _id = stableDocumentId("example-character", String(actor.id));
    const items = [];
    for (const [itemIndex, entry] of (actor.items ?? []).entries()) {
      const resolved = resolveItem(entry, index, errors, `${location}.items[${itemIndex}]`);
      if (resolved) items.push(buildEmbeddedItem(resolved, {id: actor.id, documentId: _id}, itemIndex));
    }

    const itemIdsByName = new Map(items.map((entry) => [entry.name, entry._id]));
    for (const entry of items) {
      entry.system = resolveItemIdTokens(entry.system, itemIdsByName, errors, `${location} '${entry.name}'.system`);
    }

    const img = actor.img ?? "systems/magnusarchives/assets/icons/magnuspc.webp";
    documents.push({
      _id,
      _key: `!actors!${_id}`,
      name: actor.name,
      type: actor.type,
      img,
      system: resolveItemIdTokens(
        structuredClone(actor.system ?? {}),
        itemIdsByName,
        errors,
        `${location}.system`
      ),
      items,
      effects: [],
      folder: null,
      sort: (actorIndex + 1) * 100,
      flags: {},
      ownership: {default: 0},
      prototypeToken: {
        name: actor.name,
        texture: {src: img},
        actorLink: true,
        sight: {enabled: true},
        disposition: 1
      },
      _stats: emptyStats()
    });
  }

  if (errors.length > 0) throw new ExampleCharacterValidationError(errors);
  return documents.sort((left, right) => left.sort - right.sort || left.name.localeCompare(right.name));
}

export function validateExampleCharacterSource(source) {
  const errors = [];
  if (!source || typeof source !== "object" || Array.isArray(source)) {
    throw new ExampleCharacterValidationError(["Source root must be an object."]);
  }
  if (source.schemaVersion !== EXAMPLE_CHARACTER_SCHEMA_VERSION) {
    errors.push(`schemaVersion must be ${EXAMPLE_CHARACTER_SCHEMA_VERSION}.`);
  }
  if (source.target?.systemId !== "magnusarchives") errors.push("target.systemId must be 'magnusarchives'.");
  if (source.pack?.id !== EXAMPLE_CHARACTER_PACK_ID) errors.push(`pack.id must be '${EXAMPLE_CHARACTER_PACK_ID}'.`);
  if (source.pack?.label !== EXAMPLE_CHARACTER_PACK_LABEL) errors.push(`pack.label must be '${EXAMPLE_CHARACTER_PACK_LABEL}'.`);
  if (source.pack?.documentType !== "Actor") errors.push("pack.documentType must be 'Actor'.");
  if (!Array.isArray(source.actors) || source.actors.length === 0) errors.push("actors must be a non-empty array.");
  if (errors.length > 0) throw new ExampleCharacterValidationError(errors);
  return source;
}

export function validateExampleCharacterDocuments(documents) {
  const errors = [];
  const ids = new Set();
  for (const [index, document] of documents.entries()) {
    const location = `documents[${index}]`;
    if (!FOUNDRY_ID_PATTERN.test(document._id ?? "")) errors.push(`${location}._id must be a 16-character Foundry ID.`);
    if (ids.has(document._id)) errors.push(`${location} duplicates document ID '${document._id}'.`);
    ids.add(document._id);
    if (document._key !== `!actors!${document._id}`) errors.push(`${location}._key does not match its ID.`);
    const itemIds = new Set();
    for (const [itemIndex, item] of document.items.entries()) {
      const itemLocation = `${location}.items[${itemIndex}]`;
      if (!FOUNDRY_ID_PATTERN.test(item._id ?? "")) errors.push(`${itemLocation}._id must be a 16-character Foundry ID.`);
      if (itemIds.has(item._id)) errors.push(`${itemLocation} duplicates embedded Item ID '${item._id}'.`);
      itemIds.add(item._id);
      if (item._key !== `!actors.items!${document._id}.${item._id}`) {
        errors.push(`${itemLocation}._key does not match its Actor and ID.`);
      }
      if (typeof item.name !== "string" || !item.name.trim()) errors.push(`${itemLocation}.name must be non-blank.`);
      if (typeof item.type !== "string" || !item.type.trim()) errors.push(`${itemLocation}.type must be non-blank.`);
    }
  }
  if (errors.length > 0) throw new ExampleCharacterValidationError(errors);
  return documents;
}

export async function readExampleCharacterSource(filePath) {
  return validateExampleCharacterSource(JSON.parse(await readFile(filePath, "utf8")));
}

export async function writeExampleCharacterDocuments(directory, documents) {
  await rm(directory, {recursive: true, force: true});
  await mkdir(directory, {recursive: true});
  for (const document of documents) {
    await writeFile(
      path.join(directory, `actor-${document._id}.json`),
      `${JSON.stringify(document, null, 2)}\n`,
      "utf8"
    );
  }
  return directory;
}

function assertPackDestination(projectRoot, destination) {
  const expected = path.resolve(projectRoot, "packs", EXAMPLE_CHARACTER_PACK_ID);
  if (path.resolve(destination) !== expected) {
    throw new Error(`Refusing to write unexpected pack destination '${destination}'.`);
  }
}

export async function compileExampleCharacterPack({projectRoot, sourceDirectory}) {
  const {compilePack} = await import("@foundryvtt/foundryvtt-cli");
  const destination = path.resolve(projectRoot, "packs", EXAMPLE_CHARACTER_PACK_ID);
  assertPackDestination(projectRoot, destination);
  await rm(destination, {recursive: true, force: true});
  await compilePack(sourceDirectory, destination, {log: true});
  return destination;
}

export function defaultExampleCharacterPaths(
  projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
) {
  return {
    projectRoot,
    source: path.join(projectRoot, "content", "example-characters", "characters.json"),
    corePackSource: path.join(projectRoot, "content", "core-items", "reviewed-packs.json"),
    generatedRoot: path.join(projectRoot, ".generated", "example-character-import")
  };
}
