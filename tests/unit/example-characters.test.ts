import {readFile} from "node:fs/promises";
import path from "node:path";
import {describe, expect, it} from "vitest";

// The import pipeline deliberately remains plain Node.js so it can run before TypeScript/Vite.
// @ts-expect-error Developer-only JavaScript module has no runtime-facing TypeScript declaration.
const importer = await import("../../scripts/example-character-importer.mjs");
const {
  buildExampleCharacterDocuments,
  EXAMPLE_CHARACTER_PACK_ID,
  EXAMPLE_CHARACTER_PACK_LABEL,
  validateExampleCharacterDocuments,
  validateExampleCharacterSource
} = importer;

const projectRoot = path.resolve(import.meta.dirname, "../..");
const source = validateExampleCharacterSource(JSON.parse(
  await readFile(path.join(projectRoot, "content/example-characters/characters.json"), "utf8")
));
const corePackSource = JSON.parse(
  await readFile(path.join(projectRoot, "content/core-items/reviewed-packs.json"), "utf8")
);
const manifest = JSON.parse(await readFile(path.join(projectRoot, "system.json"), "utf8"));
const packageJson = JSON.parse(await readFile(path.join(projectRoot, "package.json"), "utf8"));

const documents = validateExampleCharacterDocuments(
  buildExampleCharacterDocuments(source, corePackSource)
);
const investigator = documents.find((document: any) => document.name === "Scholarly Investigator");

function item(name: string): any {
  return investigator.items.find((entry: any) => entry.name === name);
}

describe("Example Characters compendium", () => {
  it("is declared as an Actor pack in the manifest", () => {
    const pack = manifest.packs.find((entry: any) => entry.name === EXAMPLE_CHARACTER_PACK_ID);
    expect(pack).toMatchObject({
      label: EXAMPLE_CHARACTER_PACK_LABEL,
      type: "Actor",
      path: `packs/${EXAMPLE_CHARACTER_PACK_ID}`,
      system: "magnusarchives"
    });
  });

  it("is built by the import script the build runs", () => {
    expect(packageJson.scripts["import:example-characters"]).toBe("node scripts/import-example-characters.mjs");
    expect(packageJson.scripts.build).toContain("pnpm import:example-characters");
  });

  it("builds the sample sheet's Character with its printed Pools and Edge (p379)", () => {
    expect(investigator.type).toBe("character");
    expect(investigator.system.tier).toBe(1);
    expect(investigator.system.stats).toMatchObject({
      effortBase: 1,
      might: {baseMax: 10, baseEdge: 0},
      speed: {baseMax: 10, baseEdge: 1},
      intellect: {baseMax: 14, baseEdge: 1}
    });
    expect(investigator.system.cypherLimitBase).toBe(2);
    expect(investigator.system.damageTrack).toEqual({step: "hale", hurtAvailable: false});
    expect(investigator.system.stress).toEqual({value: 0, supernatural: 0});
  });

  it("reuses compendium Items by name and records where each came from", () => {
    expect(item("Scholarly")).toMatchObject({type: "descriptor"});
    expect(item("Scholarly")._stats.compendiumSource)
      .toMatch(/^Compendium\.magnusarchives\.descriptors\.Item\.[A-Za-z0-9]{16}$/);
    expect(item("Laptop")._stats.compendiumSource)
      .toMatch(/^Compendium\.magnusarchives\.equipment\.Item\.[A-Za-z0-9]{16}$/);
    // Inline Items have no upstream document to point at.
    expect(item("Replica hieroglyph stamp set")._stats.compendiumSource).toBeNull();
  });

  it("carries the printed sheet's skill ranks", () => {
    const trained = [
      "History", "Psychology", "Researching", "Forensics",
      "Tracking", "Perception", "Endurance", "Gymnastics"
    ];
    for (const name of trained) expect(item(name)).toMatchObject({type: "skill", system: {rank: "trained"}});
    expect(item("Discerning motive")).toMatchObject({type: "skill", system: {rank: "inability"}});
    // The ref only overrides rank; the pack's own Pool assignment survives.
    expect(item("Endurance").system.defaultPool).toBe("might");
    expect(item("Gymnastics").system.defaultPool).toBe("speed");
  });

  it("registers the Focus so the Header names it instead of showing [FOCUS]", () => {
    const focus = item("Explores Dark Places");
    expect(focus.type).toBe("focus");
    // The Header reads system.focusProgress, not merely an owned Focus Item.
    expect(investigator.system.focusProgress).toEqual([{
      focusUuid: focus._id,
      ownedNodeIds: ["operate-in-the-dark", "superb-explorer"],
      provenance: "creation",
      initialChoicesGranted: true,
      attachedAt: 0
    }]);
    expect(focus.system.graph.nodes.map((node: any) => node.id))
      .toEqual(["operate-in-the-dark", "superb-explorer"]);
  });

  it("ties the Focus-granted Abilities back to their nodes", () => {
    const focusId = item("Explores Dark Places")._id;
    expect(item("Operate in the Dark").system)
      .toMatchObject({sourceFocusUuid: focusId, sourceNodeId: "operate-in-the-dark"});
    expect(item("Superb Explorer").system)
      .toMatchObject({sourceFocusUuid: focusId, sourceNodeId: "superb-explorer"});
    // Careful Observation comes from the Type, so it stays unattributed.
    expect(item("Careful Observation").system.sourceFocusUuid).toBeUndefined();
  });

  it("leaves no unresolved {{itemId:...}} tokens", () => {
    expect(JSON.stringify(investigator)).not.toContain("{{itemId:");
  });

  it("gives every embedded document the LevelDB key the compiler needs", () => {
    for (const entry of investigator.items) {
      expect(entry._key).toBe(`!actors.items!${investigator._id}.${entry._id}`);
    }
  });

  it("paraphrases rather than reprinting the book, and cites its pages", () => {
    for (const entry of investigator.items.filter((candidate: any) => candidate._stats.compendiumSource === null)) {
      expect(entry.system.source.book).toBe("The Magnus Archives Roleplaying Game");
      expect(entry.system.source.page).toMatch(/^\d+$/);
    }
    // Verbatim openings from the printed sheet must not appear.
    const text = JSON.stringify(investigator);
    expect(text).not.toContain("You take a minute to examine your surroundings");
    expect(text).not.toContain("Your mother was an Egyptologist and always brought");
  });
});
