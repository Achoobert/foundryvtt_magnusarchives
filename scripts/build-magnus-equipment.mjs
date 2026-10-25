/**
 * Rewrites the `weapons-and-armors` pack and adds an `equipment` pack inside
 * content/core-items/reviewed-packs.json, from the Magnus price tables.
 */
import {createHash} from "node:crypto";
import {readFileSync, writeFileSync} from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {MAGNUS_ARMOR, MAGNUS_EQUIPMENT, MAGNUS_WEAPONS} from "./content/magnus-equipment.mjs";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SOURCE = path.join(ROOT, "content", "core-items", "reviewed-packs.json");
const ICONS = "systems/magnusarchives/assets/icons";

function id(kind, name) {
  return createHash("sha256").update(`magnusarchives:${kind}:${name}`).digest("hex").slice(0, 16);
}

const data = JSON.parse(readFileSync(SOURCE, "utf8"));
const pack = data.packs["weapons-and-armors"];
const weaponTemplate = pack.documents.find((document) => document.type === "weapon");
const armorTemplate = pack.documents.find((document) => document.type === "armor");
const folders = pack.documents.filter((document) => document._key.startsWith("!folders!"));
const weaponFolder = folders.find((folder) => folder.name === "Weapons");
const armorFolder = folders.find((folder) => folder.name !== "Weapons");
if (!weaponTemplate || !armorTemplate || !weaponFolder || !armorFolder) {
  throw new Error("The weapons-and-armors pack is missing its folders or templates.");
}

const source = (page) => ({
  uuid: "",
  book: "The Magnus Archives Roleplaying Game",
  page,
  license: "original"
});

const description = (entry) => (entry.notes ? `<p>${entry.notes}</p>` : "");

const weapons = MAGNUS_WEAPONS.map((weapon, index) => {
  const documentId = id("weapon", weapon.name);
  return {
    ...structuredClone(weaponTemplate),
    folder: weaponFolder._id,
    name: weapon.name,
    _id: documentId,
    _key: `!items!${documentId}`,
    sort: (index + 1) * 100,
    img: `${ICONS}/magnusweapons.png`,
    system: {
      ...structuredClone(weaponTemplate.system),
      slug: "",
      description: description(weapon),
      source: source("102"),
      category: weapon.category,
      attackType: weapon.attackType,
      rangeCategory: weapon.range,
      rangeNotes: weapon.rangeNotes ?? "",
      defaultPool: weapon.attackType === "ranged" ? "speed" : "might",
      bonusDamage: 0,
      rapidFire: weapon.rapidFire === true,
      explosive: weapon.explosive === true
    }
  };
});

const armors = MAGNUS_ARMOR.map((armor, index) => {
  const documentId = id("armor", armor.name);
  return {
    ...structuredClone(armorTemplate),
    folder: armorFolder._id,
    name: armor.name,
    _id: documentId,
    _key: `!items!${documentId}`,
    sort: (index + 1) * 100,
    img: `${ICONS}/magnusarmor.png`,
    system: {
      ...structuredClone(armorTemplate.system),
      slug: "",
      description: description(armor),
      source: source("100"),
      category: armor.category,
      grantsHurtStep: true,
      speedTaskHindrance: 1
    }
  };
});

pack.label = "Weapons & Armor";
pack.documents = [weaponFolder, armorFolder, ...weapons, ...armors];

// The equipment pack reuses the weapon document shape, minus the combat fields.
const {category, attackType, rangeCategory, rangeNotes, skillLevel, defaultPool,
  damageOverride, attackModifier, bonusDamage, baseDamage, freelyUsed, ammo,
  rapidFire, explosive, ...sharedSystem} = weaponTemplate.system;
void category; void attackType; void rangeCategory; void rangeNotes; void skillLevel;
void defaultPool; void damageOverride; void attackModifier; void bonusDamage;
void baseDamage; void freelyUsed; void ammo; void rapidFire; void explosive;

const equipment = MAGNUS_EQUIPMENT.map((item, index) => {
  const documentId = id("equipment", item.name);
  return {
    folder: null,
    name: item.name,
    type: "equipment",
    _id: documentId,
    _key: `!items!${documentId}`,
    sort: (index + 1) * 100,
    img: `${ICONS}/magnusequipment.png`,
    effects: [],
    flags: {},
    ownership: {default: 0},
    _stats: structuredClone(weaponTemplate._stats),
    system: {
      ...structuredClone(sharedSystem),
      slug: "",
      description: description(item),
      source: source("102"),
      level: item.level ?? 4,
      quantity: 1,
      equipped: false,
      price: item.price,
      priceNote: ""
    }
  };
});

data.packs.equipment = {
  label: "Equipment",
  documentType: "Item",
  documents: equipment
};

writeFileSync(SOURCE, `${JSON.stringify(data, null, 2)}\n`);
console.log(`Wrote ${weapons.length} weapons, ${armors.length} armor and ${equipment.length} equipment items.`);
