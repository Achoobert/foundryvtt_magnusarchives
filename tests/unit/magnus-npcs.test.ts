import {readFile} from "node:fs/promises";
import path from "node:path";
import {describe, expect, it} from "vitest";

// The import pipeline deliberately remains plain Node.js so it can run before TypeScript/Vite.
// @ts-expect-error Developer-only JavaScript module has no runtime-facing TypeScript declaration.
const importer = await import("../../scripts/npc-importer.mjs");
const {buildNpcDocuments, NPC_PACK_ID, NPC_PACK_LABEL, stableNpcId, validateNpcDocuments} = importer;

const projectRoot = path.resolve(import.meta.dirname, "../..");
const manifest = JSON.parse(await readFile(path.join(projectRoot, "system.json"), "utf8"));
const packageJson = JSON.parse(await readFile(path.join(projectRoot, "package.json"), "utf8"));

const documents = validateNpcDocuments(buildNpcDocuments());
const folders = documents.filter((document: any) => document._key.startsWith("!folders!"));
const actors = documents.filter((document: any) => document._key.startsWith("!actors!"));

function actor(name: string): any {
  const found = actors.find((document: any) => document.name === name);
  if (!found) throw new Error(`Missing NPC ${name}`);
  return found;
}

function folderName(document: any): string {
  return folders.find((folder: any) => folder._id === document.folder)?.name;
}

describe("NPCs & Monsters compendium", () => {
  it("is declared as an Actor pack and built by the build script", () => {
    expect(manifest.packs).toContainEqual(expect.objectContaining({
      name: NPC_PACK_ID,
      label: NPC_PACK_LABEL,
      path: "packs/npcs",
      type: "Actor",
      system: "magnusarchives"
    }));
    expect(packageJson.scripts["import:npcs"]).toBe("node scripts/import-npcs.mjs");
    expect(packageJson.scripts.build).toContain("pnpm packs:build");
  });

  it("holds the 46 chapter 12 monsters, three sidebar stat lines and the 16 p195 encounters", () => {
    // 46 entries in Monsters by Level (p194); The Still and Lightless Beast,
    // the worm colony and the Artefact Dealer's bodyguard are margin notes.
    expect(actors).toHaveLength(46 + 3 + 16);
    expect(folders).toHaveLength(17);
    expect(actors.filter((document: any) => folderName(document) === "Animals")).toHaveLength(8);
    expect(actors.filter((document: any) => folderName(document) === "People")).toHaveLength(9);
  });

  it("gives every document a unique, stable ID and a resolvable Folder", () => {
    const ids = documents.map((document: any) => document._id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(validateNpcDocuments(buildNpcDocuments())).toEqual(documents);
    expect(actor("The Archivist")._id).toBe(stableNpcId("npc", "archivist"));
    for (const document of actors) expect(folderName(document)).toBeTruthy();
  });

  it("carries the stat block mechanics", () => {
    const anglerfish = actor("The Anglerfish");
    expect(anglerfish.system).toMatchObject({level: 7, health: {value: 23, baseMax: 23}});
    expect(anglerfish.system.damage).toMatchObject({effect: "seriousInjury"});
    expect(anglerfish.system.modifications.map((entry: any) => [entry.label, entry.value])).toEqual([["Stealth", 8], ["Persuasion", 2]]);
    expect(anglerfish.system.gmIntrusion).toContain("3 Stress");
    expect(folderName(anglerfish)).toBe("The Stranger");

    const archivist = actor("The Archivist");
    expect(archivist.system.damage).toMatchObject({effect: "stress", stressAmount: 3});
    expect(archivist.system.modifications[0]).toMatchObject({label: "Attacks", contexts: ["defense"], value: 3});

    const clown = actor("Clown Doll");
    expect(clown.system.modifications[0]).toMatchObject({label: "Speed defense", contexts: ["attack"], mode: "levelOverride", value: 5});

    expect(actor("Silver Worm").system).toMatchObject({level: 1, health: {baseMax: 3}, movement: {category: "immediate"}});
    expect(actor("Death").system.notes).toContain("Stress on first realizing its horror:</strong> 4");
  });

  it("derives health and damage from level for the simple encounters", () => {
    expect(actor("Cat").system).toMatchObject({level: 1, health: {baseMax: 3}, damage: {effect: "stress", stressAmount: 1}});
    expect(actor("Shark, great white").system).toMatchObject({health: {baseMax: 20}, damage: {effect: "seriousInjury"}});
    expect(actor("Mugger").system.damage).toMatchObject({effect: "stress", stressAmount: 3});
    expect(actor("Police officer").system.damage).toMatchObject({effect: "seriousInjury"});
    expect(actor("Cat").prototypeToken.disposition).toBe(0);
    expect(actor("The Weaver").prototypeToken).toMatchObject({actorLink: false, disposition: -1});
  });
});
