import {readFile} from "node:fs/promises";
import path from "node:path";
import {describe, expect, it} from "vitest";
import {artifactLevelIsRollable} from "../../src/artifacts/artifact-rules";

const projectRoot = path.resolve(import.meta.dirname, "../..");
const source = JSON.parse(await readFile(path.join(projectRoot, "content/core-items/reviewed-packs.json"), "utf8"));
const documents = source.packs.artefacts.documents as Array<Record<string, any>>;
const folders = documents.filter((document) => document._key.startsWith("!folders!"));
const items = documents.filter((document) => document._key.startsWith("!items!"));

function item(name: string) {
  const found = items.find((document) => document.name === name);
  if (!found) throw new Error(`Missing artefact ${name}`);
  return found;
}

describe("Magnus artefacts and books (chapter 13)", () => {
  it("ships the 26 artefacts and 25 books in their two Folders", () => {
    expect(folders.map((folder) => folder.name)).toEqual(["Artefacts", "Books"]);
    const folderIds = new Map(folders.map((folder) => [folder.name, folder._id]));
    expect(items).toHaveLength(51);
    expect(items.filter((document) => document.folder === folderIds.get("Artefacts"))).toHaveLength(26);
    expect(items.filter((document) => document.folder === folderIds.get("Books"))).toHaveLength(25);
    expect(items.every((document) => document.type === "artifact")).toBe(true);
  });

  it("keeps identities unique and deterministic", () => {
    expect(new Set(documents.map((document) => document._id)).size).toBe(documents.length);
    expect(new Set(items.map((document) => document.system.slug)).size).toBe(items.length);
    for (const document of items) expect(document._key).toBe(`!items!${document._id}`);
  });

  it("has no depletion roll, since Magnus artefacts cost Stress instead", () => {
    for (const document of items) {
      expect(document.system.depletion).toEqual({enabled: false, die: "d6", formula: "1d6", threshold: 1});
      expect(document.system.depleted).toBe(false);
      expect(document.system.source).toMatchObject({book: "The Magnus Archives Roleplaying Game", license: "original"});
      expect(document.system.description).toContain("<strong>Fear:</strong>");
      expect(document.system.description).toContain("<strong>Stress:</strong>");
    }
  });

  it("keeps fixed and rolled levels from the stat blocks", () => {
    expect(item("Camera of occultation").system.level).toBe("8");
    expect(item("Death's game piece").system.level).toBe("1d6+2");
    expect(artifactLevelIsRollable(item("Web lighter").system)).toBe(true);
    expect(artifactLevelIsRollable(item("Dead Animals").system)).toBe(false);
    expect(item("Yushanka chatbot").system.tags).toEqual(["artefact", "the-spiral", "the-flesh"]);
    expect(item("Killer's Song").system.source.page).toBe("278");
  });
});
