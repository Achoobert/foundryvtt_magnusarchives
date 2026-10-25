/**
 * Rewrites the `descriptors` pack inside content/core-items/reviewed-packs.json
 * from the authored Magnus descriptor list. Run after build-magnus-skills.mjs,
 * because every skill grant resolves against the skills pack in that same file.
 */
import {createHash} from "node:crypto";
import {readFileSync, writeFileSync} from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {MAGNUS_DESCRIPTORS} from "./content/magnus-descriptors.mjs";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SOURCE = path.join(ROOT, "content", "core-items", "reviewed-packs.json");
const SKILL_PACK = "Compendium.magnusarchives.skills.Item";

function descriptorId(name) {
  return createHash("sha256").update(`magnusarchives:descriptor:${name}`).digest("hex").slice(0, 16);
}

/** Deterministic ids keep the pack byte-stable between runs. */
function stableUuid(seed) {
  const hash = createHash("sha256").update(`magnusarchives:descriptor-choice:${seed}`).digest("hex");
  return [
    hash.slice(0, 8), hash.slice(8, 12), `4${hash.slice(13, 16)}`,
    `8${hash.slice(17, 20)}`, hash.slice(20, 32)
  ].join("-");
}

const data = JSON.parse(readFileSync(SOURCE, "utf8"));
const skills = new Map(
  data.packs.skills.documents.map((document) => [document.name.toLowerCase(), document])
);
const template = data.packs.descriptors.documents.find((document) => document.type === "descriptor");
if (!template) throw new Error("The descriptors pack has no document to use as a template.");

function skillDocument(name) {
  const skill = skills.get(name.toLowerCase());
  if (!skill) throw new Error(`Descriptor references unknown skill "${name}".`);
  return skill;
}

function skillLink(name) {
  const skill = skillDocument(name);
  return `@UUID[${SKILL_PACK}.${skill._id}]{${skill.name}}`;
}

function skillOption(descriptorName, skillName, index) {
  const skill = skillDocument(skillName);
  return {
    id: stableUuid(`${descriptorName}:option:${index}:${skillName}`),
    skillUuid: `${SKILL_PACK}.${skill._id}`,
    customName: "",
    snapshot: {name: skill.name, img: skill.img, system: structuredClone(skill.system)}
  };
}

function knowledgeSkillNames() {
  return data.packs.skills.documents
    .filter((document) => document.system.category === "knowledge")
    .map((document) => document.name);
}

function describe(descriptor) {
  const parts = [`<p>${descriptor.summary}</p>`];
  const items = [];
  if (descriptor.poolsNote) {
    items.push(`<strong>${descriptor.label}:</strong> ${descriptor.poolsNote}`);
  } else {
    for (const [pool, value] of Object.entries(descriptor.pools)) {
      const label = pool[0].toUpperCase() + pool.slice(1);
      items.push(`<strong>${descriptor.label}:</strong> +${value} to your ${label} Pool.`);
    }
  }
  for (const name of descriptor.trained ?? []) {
    items.push(`<strong>Skill:</strong> You're trained in ${skillLink(name)}.`);
  }
  for (const group of descriptor.trainedOneOf ?? []) {
    const text = group.note ?? group.options.map((name) => skillLink(name)).join(" or ");
    items.push(`<strong>Skill:</strong> You're trained in ${text}`);
  }
  if (descriptor.feature) {
    items.push(`<strong>${descriptor.feature.name}:</strong> ${descriptor.feature.description}`);
  }
  if (descriptor.secondSkill) {
    items.push(`<strong>Suggested Second Skill:</strong> ${descriptor.secondSkill}`);
  }
  const inability = descriptor.inability
    ? `${descriptor.inabilityNote} You have an inability in ${skillLink(descriptor.inability)}.`
    : descriptor.inabilityNote;
  if (inability) items.push(`<strong>Suggested Inability:</strong> ${inability}`);

  parts.push("<p><strong>You gain the following characteristics:</strong></p>");
  parts.push(`<ul>${items.map((item) => `<li><p>${item}</p></li>`).join("")}</ul>`);
  return parts.join("");
}

const documents = MAGNUS_DESCRIPTORS.map((descriptor, index) => {
  const id = descriptorId(descriptor.name);
  const skillGrants = (descriptor.trained ?? []).map((name, position) => {
    const skill = skillDocument(name);
    return {
      id: stableUuid(`${descriptor.name}:grant:${position}:${name}`),
      skillUuid: `${SKILL_PACK}.${skill._id}`,
      customName: "",
      rank: "trained",
      snapshot: {name: skill.name, img: skill.img, system: structuredClone(skill.system)}
    };
  });
  const choiceGroups = (descriptor.trainedOneOf ?? []).map((group, position) => {
    const names = group.options ?? knowledgeSkillNames();
    return {
      id: stableUuid(`${descriptor.name}:group:${position}`),
      choose: group.choose ?? 1,
      rank: "trained",
      options: names.map((name, optionIndex) => skillOption(descriptor.name, name, `${position}-${optionIndex}`))
    };
  });

  return {
    ...structuredClone(template),
    folder: null,
    name: descriptor.name,
    _id: id,
    _key: `!items!${id}`,
    sort: (index + 1) * 100,
    system: {
      ...structuredClone(template.system),
      slug: "",
      description: describe(descriptor),
      source: {
        uuid: "",
        book: "The Magnus Archives Roleplaying Game",
        page: descriptor.page,
        license: "original"
      },
      poolBonuses: {
        might: descriptor.pools.might ?? 0,
        speed: descriptor.pools.speed ?? 0,
        intellect: descriptor.pools.intellect ?? 0
      },
      poolBonusChoiceGroups: [],
      skillGrants,
      choiceGroups
    }
  };
});

data.packs.descriptors.documents = documents;
writeFileSync(SOURCE, `${JSON.stringify(data, null, 2)}\n`);
console.log(`Wrote ${documents.length} Magnus descriptors to ${path.relative(ROOT, SOURCE)}.`);
