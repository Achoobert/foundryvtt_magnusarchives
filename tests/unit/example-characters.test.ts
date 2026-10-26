import {readFile} from "node:fs/promises";
import path from "node:path";
import {describe, expect, it} from "vitest";
import {loadYmlPack} from "../helpers/yml-packs";

const EXAMPLE_CHARACTER_PACK_ID = "example-characters";
const EXAMPLE_CHARACTER_PACK_LABEL = "Example Characters";

const projectRoot = path.resolve(import.meta.dirname, "../..");
const manifest = JSON.parse(await readFile(path.join(projectRoot, "system.json"), "utf8"));
const packageJson = JSON.parse(await readFile(path.join(projectRoot, "package.json"), "utf8"));

const documents = loadYmlPack(EXAMPLE_CHARACTER_PACK_ID);
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

  it("is compiled from yml_source by the build", () => {
    expect(packageJson.scripts.build).toContain("pnpm packs:build");
  });

  it("builds the sample sheet's Character with its printed Pools and Edge (p379)", () => {
    expect(investigator.type).toBe("character");
    expect(investigator.system.tier).toBe(1);
    // Stored stats are the base before the Investigator type adds its Pool
    // bonuses and Intellect Edge, so base + type gives the printed 10 / 10 / 14.
    expect(investigator.system.stats).toMatchObject({
      effortBase: 1,
      might: {baseMax: 8, baseEdge: 0},
      speed: {baseMax: 9, baseEdge: 1},
      intellect: {baseMax: 13, baseEdge: 0}
    });
    const type = item("Investigator").system;
    const printed = {might: [10, 0], speed: [10, 1], intellect: [14, 1]} as const;
    for (const [pool, [max, edge]] of Object.entries(printed)) {
      const stat = investigator.system.stats[pool];
      expect(stat.baseMax + type.poolBonuses[pool], `${pool} Pool`).toBe(max);
      expect(stat.baseEdge + (type.edgeGrant.pool === pool ? type.edgeGrant.amount : 0), `${pool} Edge`).toBe(edge);
      expect(stat.value, `${pool} current`).toBe(max);
    }
    expect(investigator.system.cypherLimitBase).toBe(2);
    expect(investigator.system.damageTrack).toEqual({step: "hale", hurtAvailable: false});
    expect(investigator.system.stress).toEqual({value: 0, supernatural: 0});
  });

  it("reuses compendium Items by name and records where each came from", () => {
    expect(item("Scholarly")).toMatchObject({type: "descriptor"});
    expect(item("Scholarly")._stats.compendiumSource).toMatch(
      /^Compendium\.magnusarchives\.descriptors\.Item\.[A-Za-z0-9]{16}$/
    );
    expect(item("Laptop")._stats.compendiumSource).toMatch(
      /^Compendium\.magnusarchives\.equipment\.Item\.[A-Za-z0-9]{16}$/
    );
    expect(item("Investigator")._stats.compendiumSource).toMatch(
      /^Compendium\.magnusarchives\.types\.Item\.[A-Za-z0-9]{16}$/
    );
    expect(item("Explores Dark Places")._stats.compendiumSource).toMatch(
      /^Compendium\.magnusarchives\.foci\.Item\.[A-Za-z0-9]{16}$/
    );
    expect(item("Curiosity")._stats.compendiumSource).toMatch(
      /^Compendium\.magnusarchives\.cyphers\.Item\.[A-Za-z0-9]{16}$/
    );
    // Inline Items have no upstream document to point at.
    expect(item("Replica hieroglyph stamp set")._stats.compendiumSource).toBeNull();
  });

  it("carries the printed sheet's skill ranks", () => {
    const trained = [
      "History",
      "Psychology",
      "Researching",
      "Forensics",
      "Tracking",
      "Perception",
      "Endurance",
      "Gymnastics"
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
    expect(investigator.system.focusProgress).toEqual([
      {
        focusUuid: focus._id,
        ownedNodeIds: ["t1-superb-explorer"],
        provenance: "creation",
        initialChoicesGranted: true,
        attachedAt: 0
      }
    ]);
    // The full chapter 4 tree, not a placeholder: owning only its tier-1 node.
    expect(focus.system.graph.nodes.map((node: any) => node.id)).toContain("t1-superb-explorer");
    expect(focus.system.graph.nodes.length).toBeGreaterThan(1);
  });

  it("ties the Focus-granted Abilities back to their nodes", () => {
    const focusId = item("Explores Dark Places")._id;
    expect(item("Superb Explorer").system).toMatchObject({
      sourceFocusUuid: focusId,
      sourceNodeId: "t1-superb-explorer"
    });
    // Careful Observation and Operate in the Dark are Investigator choices (p29-30),
    // so they stay unattributed to the Focus.
    expect(item("Careful Observation").system.sourceFocusUuid).toBe("");
    expect(item("Operate in the Dark").system.sourceFocusUuid).toBe("");
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
