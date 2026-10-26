import {describe, expect, it} from "vitest";
import {loadYmlPack} from "../helpers/yml-packs";

interface PackDocument {
  _id: string;
  _key: string;
  name: string;
  type: string;
  folder: string | null;
  system: Record<string, any>;
}

function documents(packId: string): PackDocument[] {
  return loadYmlPack(packId);
}

function items(packId: string) {
  return documents(packId).filter((document) => document._key.startsWith("!items!"));
}

function allStrings(value: unknown, strings: string[] = []): string[] {
  if (typeof value === "string") strings.push(value);
  else if (Array.isArray(value)) value.forEach((entry) => allStrings(entry, strings));
  else if (value && typeof value === "object") Object.values(value).forEach((entry) => allStrings(entry, strings));
  return strings;
}

const types = items("types");
const abilities = items("type-abilities");
const byName = (typeName: string, abilityName: string) =>
  abilities.find((document) => document.name === abilityName && document.system.tags.includes(typeName.toLowerCase()));

describe("Magnus character types (chapter 3)", () => {
  it("ships the four types and their tiered ability lists", () => {
    expect(types.map((document) => document.name)).toEqual(["Investigator", "Protector", "Elocutionist", "Occultist"]);
    expect(abilities).toHaveLength(186);
    // One folder per type, with a sub-folder per tier.
    expect(documents("type-abilities").filter((document) => document._key.startsWith("!folders!"))).toHaveLength(28);
    expect(abilities.filter((document) => document.system.tags.includes("supernatural"))).toHaveLength(23);
  });

  it("resolves every ability and skill reference inside the reviewed packs", () => {
    const ids = {
      "type-abilities": new Set(abilities.map((document) => document._id)),
      skills: new Set(items("skills").map((document) => document._id))
    };
    const references = allStrings([types, abilities]).flatMap((value) => [
      ...value.matchAll(/Compendium\.magnusarchives\.(type-abilities|skills)\.Item\.([A-Za-z0-9]{16})/g)
    ]);
    expect(references.length).toBeGreaterThan(100);
    for (const [, pack, id] of references) expect(ids[pack as keyof typeof ids].has(id as string)).toBe(true);
    const folders = new Set(documents("type-abilities").map((document) => document._id));
    for (const ability of abilities) expect(folders.has(ability.folder as string)).toBe(true);
  });

  it("maps starting Pools onto the Core Setup base of 8 and offers two first-tier abilities", () => {
    const investigator = types.find((document) => document.name === "Investigator")!;
    expect(investigator.system.poolBonuses).toEqual({might: 2, speed: 1, intellect: 1});
    expect(investigator.system.weaponUse).toEqual({light: true, medium: true, heavy: false});
    expect(investigator.system.abilityChoiceGroups[0].choose).toBe(2);
    expect(investigator.system.abilityChoiceGroups[0].options).toHaveLength(9);
    expect(investigator.system.choiceGroups[0].choose).toBe(2);

    const occultist = types.find((document) => document.name === "Occultist")!;
    expect(occultist.system.skillGrants.map((grant: {snapshot: {name: string}}) => grant.snapshot.name)).toEqual([
      "Occultism"
    ]);
    expect(occultist.system.description).toContain("Might Pool starts at 7");
  });

  it("records costs, tiers and supernatural flags faithfully", () => {
    const dream = byName("Investigator", "Unnatural Dream")!;
    expect(dream.system.tier).toBe(3);
    expect(dream.system.cost).toMatchObject({amount: 3, allowedPools: ["intellect"]});
    expect(dream.system.tags).toContain("supernatural");
    expect(dream.system.description).toContain("3 Stress");

    expect(byName("Protector", "One Against Many")!.system.cost).toMatchObject({
      amount: 1,
      scalable: true,
      allowedPools: ["speed"]
    });
    expect(byName("Protector", "Slow Them Down")!.system.cost.allowedPools).toEqual(["might", "speed"]);
    expect(byName("Occultist", "Stressed Mind")!.system).toMatchObject({
      tier: 5,
      damageEffect: "stress",
      stressAmount: 6
    });
    expect(byName("Elocutionist", "Mastery With Defense")!.system.tier).toBe(6);
  });
});
