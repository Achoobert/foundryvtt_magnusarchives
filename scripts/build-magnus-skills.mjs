/**
 * Rewrites the `skills` pack inside content/core-items/reviewed-packs.json from
 * the authored Magnus skill list, then leaves `pnpm import:core-packs` to
 * compile the LevelDB pack as usual.
 *
 * Document IDs are reused wherever a skill name already exists, so any @UUID
 * reference to a skill that survives the switch keeps working.
 */
import {createHash} from "node:crypto";
import {readFileSync, writeFileSync} from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {MAGNUS_SKILLS} from "./content/magnus-skills.mjs";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SOURCE = path.join(ROOT, "content", "core-items", "reviewed-packs.json");

// Stable, deterministic ID for a skill the previous pack did not have.
function skillId(name) {
  return createHash("sha256").update(`magnusarchives:skill:${name}`).digest("hex").slice(0, 16);
}

function paragraph(text) {
  return `<p>${text}</p>`;
}

const data = JSON.parse(readFileSync(SOURCE, "utf8"));
const existing = new Map(
  data.packs.skills.documents.map((document) => [document.name.toLowerCase(), document])
);
const template = data.packs.skills.documents[0];
if (!template) throw new Error("The skills pack has no document to use as a template.");

const used = new Set();
const documents = MAGNUS_SKILLS.map((skill, index) => {
  const previous = existing.get(skill.name.toLowerCase());
  const id = previous?._id ?? skillId(skill.name);
  if (used.has(id)) throw new Error(`Duplicate skill document ID for "${skill.name}".`);
  used.add(id);
  return {
    ...structuredClone(template),
    folder: null,
    name: skill.name,
    _id: id,
    _key: `!items!${id}`,
    sort: (index + 1) * 100,
    system: {
      ...structuredClone(template.system),
      defaultPool: skill.pool,
      category: skill.category,
      initiative: skill.initiative === true,
      contexts: [],
      rank: "untrained",
      slug: "",
      description: paragraph(skill.description),
      source: {uuid: "", book: "The Magnus Archives Roleplaying Game", page: "16", license: "original"}
    }
  };
});

const removed = [...existing.keys()].filter(
  (name) => !MAGNUS_SKILLS.some((skill) => skill.name.toLowerCase() === name)
);

data.packs.skills.documents = documents;
writeFileSync(SOURCE, `${JSON.stringify(data, null, 2)}\n`);

console.log(`Wrote ${documents.length} Magnus skills to ${path.relative(ROOT, SOURCE)}.`);
if (removed.length) {
  console.log(`Dropped ${removed.length} skills that are not in the Magnus list: ${removed.join(", ")}`);
  console.log("Any @UUID reference to one of those is now dangling — check content/ before release.");
}
