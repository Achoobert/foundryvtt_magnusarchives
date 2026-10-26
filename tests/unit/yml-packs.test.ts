import {readFile} from "node:fs/promises";
import path from "node:path";
import {describe, expect, it} from "vitest";
import {loadYmlPack} from "../helpers/yml-packs";

const projectRoot = path.resolve(import.meta.dirname, "../..");
const manifest = JSON.parse(await readFile(path.join(projectRoot, "system.json"), "utf8"));
const packageJson = JSON.parse(await readFile(path.join(projectRoot, "package.json"), "utf8"));

describe("YAML compendium source", () => {
  it("compiles yml_source into packs as part of the build", () => {
    expect(packageJson.scripts["packs:build"]).toBe("node scripts/build-yml-packs.mjs");
    expect(packageJson.scripts.build).toContain("pnpm packs:build");
  });

  for (const pack of manifest.packs as Array<{name: string; path: string}>) {
    it(`has editable documents for the ${pack.name} pack`, () => {
      expect(pack.path).toBe(`packs/${pack.name}`);
      const documents = loadYmlPack(pack.name);
      expect(documents.length).toBeGreaterThan(0);
      const keys = documents.map((document) => document._key);
      expect(new Set(keys).size).toBe(keys.length);
      for (const document of documents) expect(document._id).toMatch(/^[A-Za-z0-9]{16}$/);
    });
  }
});
