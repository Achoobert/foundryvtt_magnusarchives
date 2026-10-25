import {describe, expect, it} from "vitest";
import {readFileSync} from "node:fs";
import {PRICE_CATEGORIES} from "../../src/constants/system";
import {deriveCharacterData} from "../../src/rules/core/derived-data";
import {pools} from "../helpers/core-fixtures";

const equipment = readFileSync("src/data/items/equipment.ts", "utf8");
const armor = readFileSync("src/data/items/armor.ts", "utf8");
const weapon = readFileSync("src/data/items/weapon.ts", "utf8");
const template = readFileSync("templates/item/item-sheet.hbs", "utf8");

function armorItem(overrides: Record<string, unknown> = {}) {
  return {
    id: "armor-1",
    type: "armor",
    system: {
      category: "light" as const,
      equipped: true,
      freelyUsed: true,
      grantsHurtStep: true,
      speedTaskHindrance: 1,
      ...overrides
    }
  };
}

function derive(armorItems: ReturnType<typeof armorItem>[] = []) {
  return deriveCharacterData(
    Object.assign(pools(), {effortBase: 1}),
    {minor: [], moderate: [], major: []},
    {oneAction: false, tenMinutes: false, oneHour: false, tenHours: false},
    {},
    armorItems,
    {armorCategories: ["light"], freelyUse: []}
  );
}

describe("Magnus equipment", () => {
  it("prices goods by the six categories rather than a currency amount", () => {
    expect(PRICE_CATEGORIES).toEqual([
      "inexpensive", "moderate", "expensive", "veryExpensive", "exorbitant", "priceless"
    ]);
    expect(equipment).toContain("choices: [...PRICE_CATEGORIES]");
    expect(equipment).toContain("priceNote");
    expect(template).toContain('<select name="system.price">');
  });

  it("defaults mundane gear to level 4", () => {
    expect(equipment).toContain("level: integerField(4)");
  });

  it("keeps an unrecognised legacy price as a note", () => {
    expect(equipment).toContain("migrated.priceNote = migrated.price");
  });
});

describe("Magnus armor", () => {
  it("has no damage-reduction value", () => {
    expect(armor).not.toContain("damageReduction");
    expect(armor).toContain("grantsHurtStep");
    expect(armor).toContain("speedTaskHindrance");
  });

  it("gives the wearer the extra hurt step", () => {
    expect(derive().damageTrack.hurtAvailable).toBe(false);
    const derived = derive([armorItem()]);
    expect(derived.damageTrack.hurtAvailable).toBe(true);
    expect(derived.damageTrack.steps).toEqual(["hale", "hurt", "impaired", "debilitated", "dead"]);
  });

  it("hinders Speed tasks even for a familiar wearer", () => {
    expect(derive([armorItem()]).combat.armor.speedTaskHindrance).toBe(1);
  });

  it("grants nothing while unequipped", () => {
    expect(derive([armorItem({equipped: false})]).damageTrack.hurtAvailable).toBe(false);
  });
});

describe("Magnus weapons", () => {
  it("keeps the book's light/medium/heavy damage", () => {
    expect(weapon).toContain("{light: 2, medium: 4, heavy: 6}");
  });

  it("records rapid-fire and explosive weapons", () => {
    expect(weapon).toContain("rapidFire");
    expect(weapon).toContain("explosive");
    expect(template).toContain('name="system.rapidFire"');
    expect(template).toContain('name="system.explosive"');
  });
});
