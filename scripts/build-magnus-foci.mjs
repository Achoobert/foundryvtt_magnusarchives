/**
 * Rewrites the `foci` and `focus-abilities` packs inside
 * content/core-items/reviewed-packs.json from the authored Magnus foci and
 * Avatar powers. Run after build-magnus-skills.mjs, because skill mentions in
 * ability text resolve against the skills pack in that same file.
 */
import {createHash} from "node:crypto";
import {readFileSync, writeFileSync} from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {AVATAR, MAGNUS_FOCI} from "./content/magnus-foci.mjs";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SOURCE = path.join(ROOT, "content", "core-items", "reviewed-packs.json");
const SKILL_PACK = "Compendium.magnusarchives.skills.Item";
const ABILITY_PACK = "Compendium.magnusarchives.focus-abilities.Item";
const BOOK = "The Magnus Archives Roleplaying Game";
const FOCUS_IMG = "systems/magnusarchives/assets/icons/magnusfocus.webp";
const ABILITY_IMG = "systems/magnusarchives/assets/icons/magnusability.webp";

function stableId(seed) {
  return createHash("sha256").update(`magnusarchives:${seed}`).digest("hex").slice(0, 16);
}

function slugify(text) {
  return text.toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
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

function itemSystemBase({slug, description, page, tags}) {
  return {
    schemaVersion: 1,
    slug,
    description,
    source: {uuid: "", book: BOOK, page, license: "original"},
    automation: {mode: "descriptive", duration: {enabled: false, trigger: "recovery"}, rollDefaults: {}},
    ruleElements: [],
    tags,
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
    }
  };
}

function folderDocument(name, sort) {
  const id = stableId(`focus-folder:${name}`);
  return {
    type: "Item",
    folder: null,
    name,
    color: null,
    sorting: "a",
    _id: id,
    description: "",
    sort,
    flags: {},
    _stats: emptyStats(),
    _key: `!folders!${id}`
  };
}

const data = JSON.parse(readFileSync(SOURCE, "utf8"));
const skills = new Map(data.packs.skills.documents.map((document) => [document.name.toLowerCase(), document]));

/** `[[perception]]` → a link to that Skill, keeping the written wording. */
function linkSkills(text) {
  return text.replace(/\[\[([^\]]+)\]\]/g, (match, label) => {
    const skill = skills.get(label.toLowerCase());
    if (!skill) throw new Error(`Focus text references unknown skill "${label}".`);
    return `@UUID[${SKILL_PACK}.${skill._id}]{${label}}`;
  });
}

function plain(text) {
  return text.replace(/\[\[([^\]]+)\]\]/g, "$1");
}

const POOLS = {might: "might", speed: "speed", intellect: "intellect"};

/** "4+ Intellect + 3 Stress" → cost fields; "3 Speed/Intellect" allows either Pool. */
function parseCost(cost) {
  if (!cost) return {amount: 0, scalable: false, pools: [], stress: 0};
  const match = cost.match(/^(\d+)(\+)? ([A-Za-z/]+)(?: \+ (\d+) Stress)?$/);
  if (!match) throw new Error(`Unreadable ability cost "${cost}".`);
  const pools = match[3].split("/").map((pool) => POOLS[pool.toLowerCase()]);
  if (pools.some((pool) => !pool)) throw new Error(`Unknown Pool in ability cost "${cost}".`);
  return {amount: Number(match[1]), scalable: Boolean(match[2]), pools, stress: Number(match[4] ?? 0)};
}

function costLabel(cost) {
  if (!cost) return "";
  const parsed = parseCost(cost);
  const pool = parsed.pools.map((name) => name[0].toUpperCase() + name.slice(1)).join(" or ");
  const points = `${parsed.amount}${parsed.scalable ? "+" : ""} ${pool} point${parsed.amount === 1 && !parsed.scalable ? "" : "s"}`;
  return parsed.stress ? `${points} and ${parsed.stress} Stress` : points;
}

function abilityDescription(ability, supernatural) {
  const parts = [];
  if (ability.cost) parts.push(`<p><strong>Cost:</strong> ${costLabel(ability.cost)}.</p>`);
  parts.push(`<p>${linkSkills(ability.text)}</p>`);
  parts.push(`<p>${ability.act === "enabler" ? "Enabler." : "Action."}</p>`);
  if (supernatural) parts.push("<p><em>Supernatural ability.</em></p>");
  return parts.join("");
}

const abilityDocuments = new Map();
const snapshotText = new Map();

/** One Ability document per (scope, name); a focus that repeats an ability reuses it. */
function abilityDocument({scope, scopeSlug, ability, tier, page, folder, tags}) {
  const key = `${scope}\u0000${ability.name}`;
  const existing = abilityDocuments.get(key);
  if (existing) return existing;
  const parsed = parseCost(ability.cost);
  const supernatural = parsed.stress > 0 || tags.includes("avatar");
  const id = stableId(`focus-ability:${scope}:${ability.name}`);
  const document = {
    name: ability.name,
    type: "ability",
    _id: id,
    img: ABILITY_IMG,
    system: {
      ...itemSystemBase({
        slug: `${scopeSlug}-${slugify(ability.name)}`,
        description: abilityDescription(ability, supernatural),
        page,
        tags: ["focus-ability", ...tags, ...(supernatural ? ["supernatural"] : [])]
      }),
      tier,
      category: "focus",
      archived: false,
      activation: ability.act,
      pool: parsed.pools.length === 1 ? parsed.pools[0] : parsed.pools.length > 1 ? "choose" : "none",
      cost: {amount: parsed.amount, scalable: parsed.scalable, ignoresEdge: false, allowedPools: parsed.pools},
      roll: "none",
      rollModifier: 0,
      attackModifier: 0,
      damage: 0,
      damageEffect: "none",
      stressAmount: parsed.stress || 3,
      range: "",
      targetMode: "none",
      sourceFocusUuid: "",
      sourceNodeId: ""
    },
    effects: [],
    folder,
    sort: (abilityDocuments.size + 1) * 100,
    ownership: {default: 0},
    flags: {},
    _stats: emptyStats(),
    _key: `!items!${id}`
  };
  abilityDocuments.set(key, document);
  snapshotText.set(id, plain(ability.text));
  return document;
}

function node(document, tier, x) {
  return {
    id: `t${tier}-${slugify(document.name)}`,
    abilityUuid: `${ABILITY_PACK}.${document._id}`,
    abilitySnapshot: {name: document.name, description: snapshotText.get(document._id)},
    tier,
    position: {x, y: null}
  };
}

/** Every node of one tier leads to every node of the next tier present. */
function chainConnections(focusName, tiers) {
  const connections = [];
  for (let index = 1; index < tiers.length; index++) {
    for (const from of tiers[index - 1]) {
      for (const to of tiers[index]) {
        connections.push({id: `connection-${stableId(`focus-connection:${focusName}:${from.id}:${to.id}`)}`, from: from.id, to: to.id});
      }
    }
  }
  return connections;
}

function listItems(items) {
  return `<ul>${items.map((item) => `<li><p>${item}</p></li>`).join("")}</ul>`;
}

function focusDocument({name, slug, description, page, nodes, connections, folder, sort, tags}) {
  const id = stableId(`focus:${name}`);
  return {
    _id: id,
    name,
    type: "focus",
    img: FOCUS_IMG,
    system: {...itemSystemBase({slug, description, page, tags}), graph: {version: 1, nodes, connections}},
    effects: [],
    folder,
    sort,
    flags: {},
    _stats: emptyStats(),
    ownership: {default: 0},
    _key: `!items!${id}`
  };
}

const focusFolders = [];
const abilityFolders = [];
const foci = MAGNUS_FOCI.map((focus, index) => {
  const slug = slugify(focus.name);
  const folder = folderDocument(focus.name, (index + 1) * 100);
  abilityFolders.push(folder);
  const make = (ability, tier) => abilityDocument({
    scope: focus.name,
    scopeSlug: slug,
    ability,
    tier,
    page: focus.page,
    folder: folder._id,
    tags: [slug]
  });

  const tiers = focus.tiers.map((entry) => {
    const abilities = [...entry.abilities, ...(entry.also ?? [])];
    return abilities.map((ability, x) => node(make(ability, entry.tier), entry.tier, x));
  });
  const extras = (focus.extras ?? []).map((ability) => make(ability, 1));
  const link = (document) => `@UUID[${ABILITY_PACK}.${document._id}]{${document.name}}`;

  const tierLines = focus.tiers.map((entry) => {
    const names = entry.abilities.map((ability) => link(make(ability, entry.tier)));
    const also = (entry.also ?? []).map((ability) => link(make(ability, entry.tier)));
    const text = entry.choice
      ? `Choose ${names.join(" or ")}.${also.length ? ` Either way, you also gain ${also.join(" and ")}.` : ""}`
      : names.join(", ");
    return `<strong>Tier ${entry.tier}:</strong> ${text}`;
  });

  const parts = [`<p>${linkSkills(focus.summary)}</p>`];
  parts.push("<p><strong>Connection:</strong> Choose one of the following with your group.</p>");
  parts.push(`<ol>${focus.connections.map((entry) => `<li><p>${linkSkills(entry)}</p></li>`).join("")}</ol>`);
  if (focus.equipment) parts.push(`<p><strong>Additional Equipment:</strong> ${focus.equipment}</p>`);
  if (extras.length) parts.push(`<p><strong>Optional:</strong> ${focus.extrasNote} ${extras.map(link).join(", ")}.</p>`);
  parts.push(`<p><strong>Minor Effect Suggestion:</strong> ${focus.minor}</p>`);
  parts.push(`<p><strong>Major Effect Suggestion:</strong> ${focus.major}</p>`);
  parts.push(`<p><strong>GM Intrusions:</strong> ${focus.intrusions}</p>`);
  parts.push(`<p><strong>Abilities by tier:</strong></p>${listItems(tierLines)}`);
  for (const note of focus.notes ?? []) parts.push(`<p>${note}</p>`);

  return focusDocument({
    name: focus.name,
    slug,
    description: parts.join(""),
    page: focus.page,
    nodes: tiers.flat(),
    connections: chainConnections(focus.name, tiers),
    folder: null,
    sort: (index + 1) * 100,
    tags: ["focus"]
  });
});

// Avatar foci, one per Entity, in their own Folders (see magnus-foci.mjs).
const avatarFocusFolder = folderDocument("Avatars", 100000);
const avatarAbilityFolder = folderDocument("Avatar Powers", 100000);
focusFolders.push(avatarFocusFolder);
abilityFolders.push(avatarAbilityFolder);
const common = AVATAR.common.map((ability) => abilityDocument({
  scope: "avatar",
  scopeSlug: "avatar",
  ability,
  tier: 1,
  page: "90",
  folder: avatarAbilityFolder._id,
  tags: ["avatar"]
}));
const avatarFoci = AVATAR.entities.map((entry, index) => {
  const entitySlug = slugify(entry.entity);
  const powers = entry.powers.map((ability) => abilityDocument({
    scope: `avatar:${entry.entity}`,
    scopeSlug: `avatar-${entitySlug}`,
    ability,
    tier: 4,
    page: entry.page,
    folder: avatarAbilityFolder._id,
    tags: ["avatar", entitySlug]
  }));
  const commonNodes = common.map((document, x) => node(document, 1, x));
  const powerNodes = powers.map((document, x) => node(document, 4, x));
  const name = `Serves as an Avatar: ${entry.entity}`;
  const connections = powerNodes.map((to) => ({
    id: `connection-${stableId(`focus-connection:${name}:${commonNodes[0].id}:${to.id}`)}`,
    from: commonNodes[0].id,
    to: to.id
  }));
  const link = (document) => `@UUID[${ABILITY_PACK}.${document._id}]{${document.name}}`;
  const description = [
    `<p>${AVATAR.summary}</p>`,
    `<p>"Serves as an Avatar" is an extra focus added on top of the character's normal focus. This one is for an Avatar of ${entry.entity}.</p>`,
    `<p><strong>Requirements:</strong></p>${listItems(AVATAR.requirements)}`,
    `<p><strong>Feeding:</strong> ${AVATAR.feeding}</p>`,
    `<p><strong>All Avatars gain:</strong> ${common.map(link).join(" and ")}.</p>`,
    `<p><strong>${entry.entity} power:</strong> Choose one of ${powers.map(link).join(", ")}, or customise one with the GM.</p>`,
    `<p>${AVATAR.customNote}</p>`
  ].join("");
  return focusDocument({
    name,
    slug: `avatar-${entitySlug}`,
    description,
    page: `89-90, ${entry.page}`,
    nodes: [...commonNodes, ...powerNodes],
    connections,
    folder: avatarFocusFolder._id,
    sort: (index + 1) * 100,
    tags: ["focus", "avatar", entitySlug]
  });
});

data.packs.foci.documents = [...focusFolders, ...foci, ...avatarFoci];
data.packs["focus-abilities"].documents = [...abilityFolders, ...abilityDocuments.values()];
writeFileSync(SOURCE, `${JSON.stringify(data, null, 2)}\n`);
console.log(
  `Wrote ${foci.length} Magnus foci, ${avatarFoci.length} Avatar foci and ${abilityDocuments.size} focus abilities to ${path.relative(ROOT, SOURCE)}.`
);
