import {readFile} from "node:fs/promises";
import path from "node:path";
import {describe, expect, it} from "vitest";

// Developer-only JavaScript module intentionally remains runnable without a build step.
// @ts-expect-error The reviewed content importer has no runtime TypeScript declaration.
const importer = await import("../../scripts/reviewed-core-pack-importer.mjs");

const projectRoot = path.resolve(import.meta.dirname, "../..");
const source = JSON.parse(await readFile(path.join(projectRoot, "content/core-items/reviewed-packs.json"), "utf8"));

function itemDocuments(packId: string) {
  return source.packs[packId].documents.filter((document: {_key: string}) => document._key.startsWith("!items!"));
}

function allStrings(value: unknown, strings: string[] = []): string[] {
  if (typeof value === "string") strings.push(value);
  else if (Array.isArray(value)) value.forEach((entry) => allStrings(entry, strings));
  else if (value && typeof value === "object") Object.values(value).forEach((entry) => allStrings(entry, strings));
  return strings;
}

describe("reviewed core compendium promotion", () => {
  it("preserves the exact reviewed document inventory and mixed equipment types", () => {
    expect(() => importer.validateReviewedCorePackSource(source)).not.toThrow();
    // 27 descriptors (p19-26), 47 skills (p16-17) plus the three defense tasks,
    // 21 weapons and 1 body armor (p100-104), and 56 other goods (p102-104).
    expect(importer.reviewedCorePackSummary(source)).toEqual({
      packs: {
        descriptors: {documents: 27, items: 27, folders: 0, itemTypes: {descriptor: 27}},
        skills: {documents: 50, items: 50, folders: 0, itemTypes: {skill: 50}},
        "weapons-and-armors": {
          documents: 24,
          items: 22,
          folders: 2,
          itemTypes: {armor: 1, weapon: 21}
        },
        equipment: {documents: 56, items: 56, folders: 0, itemTypes: {equipment: 56}},
        // Chapter 3: four types, their abilities in a Folder per type and tier.
        types: {documents: 4, items: 4, folders: 0, itemTypes: {characterType: 4}},
        "type-abilities": {documents: 214, items: 186, folders: 28, itemTypes: {ability: 186}},
        // Chapter 4: 18 foci plus 14 Avatar foci (p89-96).
        foci: {documents: 33, items: 32, folders: 1, itemTypes: {focus: 32}},
        "focus-abilities": {documents: 231, items: 212, folders: 19, itemTypes: {ability: 212}},
        // Chapter 13: 26 artefacts and 25 books.
        artefacts: {documents: 53, items: 51, folders: 2, itemTypes: {artifact: 51}}
      },
      referenceRewrites: {"descriptors->skills": 140}
    });
  });

  it("keeps the Magnus inventory and the equipment Folder structure", () => {
    expect(itemDocuments("descriptors")).toContainEqual(expect.objectContaining({name: "Bold", type: "descriptor"}));
    expect(itemDocuments("skills")).toContainEqual(expect.objectContaining({name: "Occultism", type: "skill"}));
    expect(itemDocuments("skills")).toContainEqual(expect.objectContaining({name: "Intellect defense", type: "skill"}));
    expect(itemDocuments("weapons-and-armors")).toContainEqual(expect.objectContaining({name: "Sawed-off shotgun", type: "weapon", folder: "oWd3bfXoYcGopdSV"}));
    expect(itemDocuments("equipment")).toContainEqual(expect.objectContaining({name: "EMF detector", type: "equipment"}));
    expect(source.packs["weapons-and-armors"].documents).toContainEqual(expect.objectContaining({_key: "!folders!oWd3bfXoYcGopdSV", name: "Weapons"}));
  });

  it("rewrites and resolves every Descriptor-to-Skill reference in structured data and prose", () => {
    const skillIds = new Set(itemDocuments("skills").map((document: {_id: string}) => document._id));
    const references = allStrings(source.packs.descriptors.documents)
      .flatMap((value) => [...value.matchAll(/Compendium\.magnusarchives\.skills\.Item\.([A-Za-z0-9]{16})/g)])
      .map((match) => match[1]);
    expect(references.length).toBeGreaterThan(0);
    expect(references.every((id) => skillIds.has(id))).toBe(true);
    expect(allStrings(source.packs).join("\n")).not.toMatch(/Compendium\.(?:cypher-v2-test|world\.)/);
    expect(allStrings(source.packs).join("\n")).not.toMatch(/@UUID\[Item\.[A-Za-z0-9]{16}\]/);
  });

  it("rejects World dependencies, duplicate keys, and dangling promoted UUIDs", () => {
    const world = structuredClone(source);
    world.packs.descriptors.documents[0].system.description = "@UUID[Compendium.cypher-v2-test.skills.Item.wdihgicI6leWDQsM]";
    expect(() => importer.validateReviewedCorePackSource(world)).toThrow(/World compendium dependency/);

    const duplicate = structuredClone(source);
    duplicate.packs.skills.documents[1]._key = duplicate.packs.skills.documents[0]._key;
    expect(() => importer.validateReviewedCorePackSource(duplicate)).toThrow(/duplicates LevelDB key/);

    const dangling = structuredClone(source);
    dangling.packs.descriptors.documents[0].system.description = "@UUID[Compendium.magnusarchives.skills.Item.aaaaaaaaaaaaaaaa]";
    expect(() => importer.validateReviewedCorePackSource(dangling)).toThrow(/unresolved system UUID/);
  });

  it("registers and packages the generated system packs", async () => {
    const manifest = JSON.parse(await readFile(path.join(projectRoot, "system.json"), "utf8"));
    const packageJson = JSON.parse(await readFile(path.join(projectRoot, "package.json"), "utf8"));
    const releaseScript = await readFile(path.join(projectRoot, "scripts/package-release.ps1"), "utf8");
    for (const packId of ["descriptors", "skills", "weapons-and-armors", "equipment", "types", "type-abilities", "foci", "focus-abilities", "artefacts"]) {
      expect(manifest.packs).toContainEqual(expect.objectContaining({name: packId, path: `packs/${packId}`, type: "Item", system: "magnusarchives"}));
      expect(releaseScript).toContain(`"packs/${packId}"`);
    }
    expect(packageJson.scripts["import:core-packs"]).toBe("node scripts/import-core-packs.mjs");
    expect(packageJson.scripts.build).toContain("pnpm import:core-packs");
  });
});
