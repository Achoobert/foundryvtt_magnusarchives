/**
 * Rewrites the `types` and `type-abilities` packs inside
 * content/core-items/reviewed-packs.json from the authored Magnus type list.
 * Run after build-magnus-skills.mjs, because every skill grant resolves against
 * the skills pack in that same file. `pnpm import:core-packs` then compiles them.
 */
import {createHash} from "node:crypto";
import {readFileSync, writeFileSync} from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {MAGNUS_TYPES} from "./content/magnus-types.mjs";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SOURCE = path.join(ROOT, "content", "core-items", "reviewed-packs.json");
const SKILL_PACK = "Compendium.magnusarchives.skills.Item";
const ABILITY_PACK = "Compendium.magnusarchives.type-abilities.Item";
const BOOK = "The Magnus Archives Roleplaying Game";
const TYPE_IMG = "systems/magnusarchives/assets/icons/magnustype.webp";
const ABILITY_IMG = "systems/magnusarchives/assets/icons/magnusability.webp";
const POOLS = ["might", "speed", "intellect"];
const ORDINALS = {1: "First", 2: "Second", 3: "Third", 4: "Fourth", 5: "Fifth", 6: "Sixth"};
const CYPHER_USE = {2: "Cypher Use", 3: "Expert Cypher Use", 4: "Adroit Cypher Use", 5: "Master Cypher Use"};
/** Core Setup starts every Pool at 8 before the six free points (character-initialization-service). */
const CORE_POOL_BASE = 8;

/** Deterministic ids keep the pack byte-stable between runs. */
function stableId(kind, seed) {
  return createHash("sha256").update(`magnusarchives:${kind}:${seed}`).digest("hex").slice(0, 16);
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
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

function provenance() {
  return {
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
  };
}

function baseSystem(page, description, tags) {
  return {
    schemaVersion: 1,
    slug: "",
    description,
    source: {uuid: "", book: BOOK, page, license: "original"},
    automation: {mode: "descriptive", duration: {enabled: false, trigger: "recovery"}, rollDefaults: {}},
    ruleElements: [],
    tags,
    grantedBy: provenance()
  };
}

function itemDocument({id, name, type, img, folder, sort, system}) {
  return {
    name,
    type,
    _id: id,
    img,
    system,
    effects: [],
    folder,
    sort,
    ownership: {default: 0},
    flags: {},
    _stats: emptyStats(),
    _key: `!items!${id}`
  };
}

function folderDocument({id, name, parent, sort}) {
  return {
    type: "Item",
    folder: parent,
    name,
    color: null,
    sorting: "m",
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

function skillDocument(name) {
  const skill = skills.get(name.toLowerCase());
  if (!skill) throw new Error(`Type references unknown skill "${name}".`);
  return skill;
}

function skillLink(name) {
  const skill = skillDocument(name);
  return `@UUID[${SKILL_PACK}.${skill._id}]{${skill.name}}`;
}

function skillSnapshot(skill) {
  return {name: skill.name, img: skill.img, system: structuredClone(skill.system)};
}

/** "2+ Intellect", "1 Might|Speed" or "" → the Ability cost fields. */
function parseCost(spec) {
  if (!spec) return {amount: 0, scalable: false, pools: []};
  const match = spec.match(/^(\d+)(\+)? ([A-Za-z|]+)$/);
  if (!match) throw new Error(`Unreadable ability cost "${spec}".`);
  const pools = match[3].split("|").map((pool) => pool.toLowerCase());
  for (const pool of pools) if (!POOLS.includes(pool)) throw new Error(`Unknown Pool in cost "${spec}".`);
  return {amount: Number(match[1]), scalable: Boolean(match[2]), pools};
}

function costLabel(ability) {
  const parts = [];
  if (ability.cost) {
    const {amount, scalable, pools} = parseCost(ability.cost);
    const poolNames = pools.map((pool) => pool[0].toUpperCase() + pool.slice(1)).join(" or ");
    parts.push(`${amount}${scalable ? "+" : ""} ${poolNames} point${amount === 1 && !scalable ? "" : "s"}`);
  }
  if (ability.stress) parts.push(`${ability.stress} Stress`);
  return parts.join(" and ");
}

const ACTIVATION_LABELS = {action: "Action.", enabler: "Enabler.", special: ""};

function abilityDescription(ability) {
  const parts = [];
  const cost = costLabel(ability);
  if (cost) parts.push(`<p><strong>Cost:</strong> ${cost}.</p>`);
  const activation = ACTIVATION_LABELS[ability.activation];
  const text = /Action to initiate|Action to change/.test(ability.text) || !activation
    ? ability.text
    : `${ability.text} ${activation}`;
  parts.push(`<p>${text}</p>`);
  if (ability.supernatural) {
    parts.push("<p><em>Supernatural ability:</em> available only once you have gained 10 levels of Stress from supernatural sources (p27), or from first tier with the Occultist's Already Tainted.</p>");
  }
  return parts.join("");
}

function abilitySystem(type, ability, tier) {
  const {amount, scalable, pools} = parseCost(ability.cost);
  const system = {
    ...baseSystem(ability.page, abilityDescription(ability), [
      "type-ability",
      slugify(type.name),
      ...(ability.supernatural ? ["supernatural"] : [])
    ]),
    tier,
    category: "type",
    archived: false,
    activation: ability.activation,
    pool: pools.length === 1 ? pools[0] : pools.length > 1 ? "choose" : "none",
    cost: {amount, scalable, ignoresEdge: false, allowedPools: pools},
    roll: ability.roll ?? "none",
    rollModifier: 0,
    attackModifier: 0,
    damage: ability.npcDamage ?? 0,
    damageEffect: ability.inflicts ? "stress" : "none",
    stressAmount: ability.inflicts ?? 3,
    range: "",
    targetMode: "none",
    sourceFocusUuid: "",
    sourceNodeId: ""
  };
  system.slug = `${slugify(type.name)}-${slugify(ability.name)}`;
  return system;
}

const typeDocuments = [];
const abilityDocuments = [];

for (const [typeIndex, type] of MAGNUS_TYPES.entries()) {
  const typeFolderId = stableId("type-ability-folder", type.name);
  abilityDocuments.push(folderDocument({id: typeFolderId, name: type.name, parent: null, sort: (typeIndex + 1) * 100000}));

  const byTier = {1: type.tier1, ...type.tiers};
  const abilities = {};
  for (const [tierKey, list] of Object.entries(byTier)) {
    const tier = Number(tierKey);
    const folderId = stableId("type-ability-folder", `${type.name}:${tier}`);
    abilityDocuments.push(folderDocument({
      id: folderId,
      name: `${ORDINALS[tier]} Tier`,
      parent: typeFolderId,
      sort: tier * 100
    }));
    abilities[tier] = list.map((ability, index) => {
      const id = stableId("type-ability", `${type.name}:${ability.name}`);
      const document = itemDocument({
        id,
        name: ability.name,
        type: "ability",
        img: ABILITY_IMG,
        folder: folderId,
        sort: (index + 1) * 100,
        system: abilitySystem(type, ability, tier)
      });
      abilityDocuments.push(document);
      return document;
    });
  }

  const abilityLink = (document) => `@UUID[${ABILITY_PACK}.${document._id}]{${document.name}}`;
  const knowledgeOptions = type.skills.options === "knowledge"
    ? data.packs.skills.documents
      .filter((document) => document.system.category === "knowledge")
      .map((document) => document.name)
      .filter((name) => !(type.skills.exclude ?? []).includes(name))
      .concat(type.skills.extraOptions ?? [])
    : type.skills.options;

  const poolBonuses = Object.fromEntries(POOLS.map((pool) => [pool, Math.max(0, type.pools[pool] - CORE_POOL_BASE)]));
  const notes = [];
  const belowBase = POOLS.filter((pool) => type.pools[pool] < CORE_POOL_BASE);
  for (const pool of belowBase) {
    notes.push(`The ${pool[0].toUpperCase()}${pool.slice(1)} Pool starts at ${type.pools[pool]}, below Core Setup's base of ${CORE_POOL_BASE}; lower it by ${CORE_POOL_BASE - type.pools[pool]} on the sheet.`);
  }
  const extraEdges = POOLS.filter((pool) => type.edges[pool] > 0 && pool !== type.edgeGrantPool);
  for (const pool of extraEdges) {
    notes.push(`Only the ${type.edgeGrantPool[0].toUpperCase()}${type.edgeGrantPool.slice(1)} Edge is applied automatically; set the ${pool[0].toUpperCase()}${pool.slice(1)} Edge of ${type.edges[pool]} on the sheet.`);
  }
  if (type.cyphers[1] !== 2) {
    notes.push(`Core Setup sets a cypher limit of 2; raise it to ${type.cyphers[1]}.`);
  }
  notes.push("Cypher limits at higher tiers are raised by hand on the sheet.");

  const poolLine = POOLS.map((pool) => `${pool[0].toUpperCase()}${pool.slice(1)} ${type.pools[pool]}`).join(", ");
  const edgeLine = POOLS.map((pool) => `${pool[0].toUpperCase()}${pool.slice(1)} ${type.edges[pool]}`).join(", ");
  const weaponLine = type.weapons.length === 3
    ? "You're practiced with light, medium and heavy weapons."
    : `You're practiced with ${type.weapons.join(" and ")} weapons${type.heavyInability ? ", and have an inability with heavy weapons" : ""}.`;
  const skillText = [
    ...(type.skills.trained ?? []).map((name) => `trained in ${skillLink(name)}`),
    `trained in ${type.skills.choose === 1 ? "one" : "two"} of ${knowledgeOptions.map(skillLink).join(", ")}`
  ].join(", and ");

  const firstTier = [
    "<strong>Effort:</strong> Your Effort is 1.",
    `<strong>Fit:</strong> Edge ${edgeLine}.`,
    `<strong>${type.skills.label}:</strong> You're ${skillText}.`,
    `<strong>${CYPHER_USE[type.cyphers[1]]}:</strong> You can have ${type.cyphers[1]} cyphers at a time.`,
    `<strong>Weapons:</strong> ${weaponLine}`,
    `<strong>${type.abilityLabel}:</strong> Choose two of ${abilities[1].map(abilityLink).join(", ")}.`
  ];
  const tierSections = [2, 3, 4, 5, 6].map((tier) => {
    const lines = [];
    if (type.cyphers[tier]) lines.push(`<strong>${CYPHER_USE[type.cyphers[tier]]}:</strong> You can have ${type.cyphers[tier]} cyphers at a time.`);
    lines.push(`<strong>${type.abilityLabel}:</strong> Choose two of ${abilities[tier].map(abilityLink).join(", ")}, or from a lower tier. You can also swap one lower-tier ability for another from a lower tier.`);
    return `<h3>${ORDINALS[tier]}-Tier ${type.name}</h3><ul>${lines.map((line) => `<li><p>${line}</p></li>`).join("")}</ul>`;
  });

  const description = [
    `<p>${type.summary}</p>`,
    `<p><strong>Starting Pools:</strong> ${poolLine}, plus 6 points to assign as you wish.</p>`,
    `<h3>First-Tier ${type.name}</h3><ul>${firstTier.map((line) => `<li><p>${line}</p></li>`).join("")}</ul>`,
    ...tierSections,
    "<p>Abilities marked supernatural need 10 levels of Stress from supernatural sources first (p27).</p>",
    `<p><em>Sheet notes:</em> ${notes.join(" ")}</p>`
  ].join("");

  const typeId = stableId("type", type.name);
  const choiceGroupId = stableId("type-ability-choice", type.name);
  const skillGroupId = stableId("type-skill-choice", type.name);
  typeDocuments.push(itemDocument({
    id: typeId,
    name: type.name,
    type: "characterType",
    img: TYPE_IMG,
    folder: null,
    sort: (typeIndex + 1) * 100,
    system: {
      ...baseSystem(type.page, description, ["character-type"]),
      slug: slugify(type.name),
      poolBonuses,
      woundBonuses: {minor: 0, moderate: 0, major: 0},
      edgeGrant: {mode: "fixed", pool: type.edgeGrantPool, amount: type.edges[type.edgeGrantPool]},
      weaponUse: {light: type.weapons.includes("light"), medium: type.weapons.includes("medium"), heavy: type.weapons.includes("heavy")},
      armorUse: {light: false, medium: false, heavy: false},
      superhero: {rank: 0, powerShiftCount: 0, superheroics: {enabled: false, poolBonus: 0}},
      abilityGrants: [],
      abilityChoiceGroups: [{
        id: choiceGroupId,
        choose: 2,
        options: abilities[1].map((document) => ({
          id: stableId("type-ability-option", `${type.name}:${document.name}`),
          abilityUuid: `${ABILITY_PACK}.${document._id}`,
          notes: "",
          snapshot: {name: document.name, img: document.img, system: structuredClone(document.system)},
          alternatives: []
        }))
      }],
      skillGrants: (type.skills.trained ?? []).map((name) => {
        const skill = skillDocument(name);
        return {
          id: stableId("type-skill-grant", `${type.name}:${name}`),
          skillUuid: `${SKILL_PACK}.${skill._id}`,
          customName: "",
          notes: "",
          rank: "trained",
          snapshot: skillSnapshot(skill),
          alternatives: []
        };
      }),
      choiceGroups: [{
        id: skillGroupId,
        choose: type.skills.choose,
        rank: "trained",
        options: knowledgeOptions.map((name) => {
          const skill = skillDocument(name);
          return {
            id: stableId("type-skill-option", `${type.name}:${name}`),
            skillUuid: `${SKILL_PACK}.${skill._id}`,
            customName: "",
            notes: "",
            snapshot: skillSnapshot(skill)
          };
        })
      }],
      genre: "none",
      customGenreId: "",
      backgroundOptions: "",
      equipmentNotes: "",
      equipmentBundleUuid: "",
      instance: {
        sourceUuid: "",
        instanceId: "",
        role: "primary",
        attachedAt: 0,
        selections: {
          edgePool: "none",
          superheroicsPool: "none",
          powerShifts: [],
          poolChoices: [],
          skillChoices: [],
          abilityChoices: [],
          suppressedGrantIds: []
        },
        parent: provenance()
      },
      weaponFamilies: []
    }
  }));
}

data.packs.types.documents = typeDocuments;
data.packs["type-abilities"].documents = abilityDocuments;
writeFileSync(SOURCE, `${JSON.stringify(data, null, 2)}\n`);
const abilityCount = abilityDocuments.filter((document) => document._key.startsWith("!items!")).length;
console.log(`Wrote ${typeDocuments.length} Magnus types and ${abilityCount} type abilities to ${path.relative(ROOT, SOURCE)}.`);
