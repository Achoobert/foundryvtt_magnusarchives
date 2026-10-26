import {readFile} from "node:fs/promises";
import path from "node:path";
import {describe, expect, it} from "vitest";

// The import pipeline deliberately remains plain Node.js so it can run before TypeScript/Vite.
// @ts-expect-error Developer-only JavaScript module has no runtime-facing TypeScript declaration.
const importer = await import("../../scripts/cypher-importer.mjs");

const projectRoot = path.resolve(import.meta.dirname, "../..");

async function sourceCatalog(): Promise<Record<string, any>> {
  return JSON.parse(await readFile(path.join(projectRoot, "content/cyphers/catalog.json"), "utf8"));
}

describe("Cypher compendium importer", () => {
  it("validates the canonical schema-shaped source and generates deterministic IDs", async () => {
    const catalog = await sourceCatalog();
    const first = importer.generateCypherImport(catalog);
    const second = importer.generateCypherImport(catalog);

    expect(first).toEqual(second);
    // 52 cyphers on the d00 Cypher Table (p107), plus the two sub-tables rolled by
    // Learn From The Web (p109) and Librarian's Pupil (p110).
    expect(first.cypherDocuments).toHaveLength(52);
    expect(first.tableDocuments).toHaveLength(3);
    expect(first.cypherDocuments.every((document: any) => document._id.length === 16)).toBe(true);
    expect(first.tableDocuments.every((document: any) => document._id.length === 16)).toBe(true);

    const categoryCounts = first.report.summary;
    // Magnus cyphers are all subtle: luck and inspiration, not objects.
    expect(categoryCounts.standard).toBe(52);
    expect(categoryCounts.manifest).toEqual({low: 0, medium: 0, advanced: 0, high: 0, ultra: 0});
    expect(categoryCounts.powerBoost).toBe(0);
  });

  it("keeps each cypher's level formula and instant flag", async () => {
    const generated = importer.generateCypherImport(await sourceCatalog());
    const byName = new Map(generated.cypherDocuments.map((document: any) => [document.name, document]));

    const binary: any = byName.get("Binary");
    expect(binary.flags.magnusarchives.cypherImport).toMatchObject({levelFormula: "1d6 + 2", instant: true});
    expect(binary.system.tags).toContain("instant");
    expect(binary.system.levelOverride).toBe(false);
    expect(binary.system.description).toContain("1d6 + 2");

    const bigPicture: any = byName.get("Big Picture");
    expect(bigPicture.system.tags).not.toContain("instant");

    // A fixed printed level is the cypher's level outright.
    const cheatingDeath: any = byName.get("Cheating Death");
    expect(cheatingDeath.system.levelOverride).toBe(true);
    expect(cheatingDeath.system.level).toBe(10);
    expect(generated.cypherDocuments.filter((document: any) => document.system.tags.includes("instant"))).toHaveLength(20);
  });

  it("generates unique Foundry document IDs and LevelDB keys", async () => {
    const generated = importer.generateCypherImport(await sourceCatalog());
    const documentIds = [...generated.cypherDocuments, ...generated.tableDocuments].map((document: any) => document._id);
    const keys = [...generated.cypherDocuments, ...generated.tableDocuments].flatMap((document: any) => [
      document._key,
      ...(document.results?.map((result: any) => result._key) ?? [])
    ]);

    expect(new Set(documentIds).size).toBe(documentIds.length);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("maps catalog entries to the existing descriptive Cypher DataModel without automation", async () => {
    const generated = importer.generateCypherImport(await sourceCatalog());
    for (const document of generated.cypherDocuments) {
      expect(document.type).toBe("cypher");
      expect(document.system.automation.mode).toBe("descriptive");
      expect(document.system.ruleElements).toEqual([]);
      expect(document.effects).toEqual([]);
      expect(document.system.manifestation).toBe("subtle");
      expect(document.system.uses).toBe(1);
      if (!document.system.levelOverride) expect(document.system.level).toBe(1);
    }
  });

  it("resolves every RollTable document result to a generated Cypher or RollTable", async () => {
    const generated = importer.generateCypherImport(await sourceCatalog());
    const cypherIds = new Set(generated.cypherDocuments.map((document: any) => document._id));
    const tableIds = new Set(generated.tableDocuments.map((document: any) => document._id));

    for (const table of generated.tableDocuments) {
      for (const result of table.results) {
        if (result.documentCollection === "magnusarchives.cyphers") expect(cypherIds.has(result.documentId)).toBe(true);
        if (result.documentCollection === "magnusarchives.cypher-tables") expect(tableIds.has(result.documentId)).toBe(true);
      }
    }
    expect(importer.cypherCompendiumUuid("another-twist")).toMatch(/^Compendium\.magnusarchives\.cyphers\.Item\.[a-f0-9]{16}$/);
    expect(importer.cypherTableCompendiumUuid("random-cyphers")).toMatch(/^Compendium\.magnusarchives\.cypher-tables\.RollTable\.[a-f0-9]{16}$/);
  });

  it("preserves complete, non-overlapping d00 coverage and source weights", async () => {
    const generated = importer.generateCypherImport(await sourceCatalog());
    for (const table of generated.tableDocuments) {
      const outcomes = Array.from({length: 100}, () => 0);
      for (const result of table.results) {
        expect(result.weight).toBe(result.range[1] - result.range[0] + 1);
        for (let value = result.range[0]; value <= result.range[1]; value += 1) {
          outcomes[value - 1] = (outcomes[value - 1] ?? 0) + 1;
        }
      }
      expect(outcomes).toEqual(Array.from({length: 100}, () => 1));
    }
  });

  it("rejects invalid ranges, duplicate IDs, and unresolved references", async () => {
    const catalog = await sourceCatalog();
    const duplicate = structuredClone(catalog);
    duplicate.cyphers.push(structuredClone(duplicate.cyphers[0]));
    expect(() => importer.generateCypherImport(duplicate)).toThrow(/Duplicate Cypher stable ID/);

    const overlap = structuredClone(catalog);
    overlap.tables[0].results[0].range = [1, 4];
    expect(() => importer.generateCypherImport(overlap)).toThrow(/overlaps d00 results/);

    const missing = structuredClone(catalog);
    missing.tables[0].results[0].cypherId = "missing-cypher";
    expect(() => importer.generateCypherImport(missing)).toThrow(/references missing Cypher/);
  });

  it("targets only the two system Cypher pack paths and rejects World or Focus packs", () => {
    const destinations = importer.cypherPackDestinations(projectRoot);
    expect(destinations).toEqual({
      cyphers: path.resolve(projectRoot, "packs/cyphers"),
      tables: path.resolve(projectRoot, "packs/cypher-tables")
    });
    expect(() => importer.assertCypherPackDestination(projectRoot, path.resolve(projectRoot, "packs/foci"))).toThrow(/Refusing/);
    expect(() => importer.assertCypherPackDestination(projectRoot, path.resolve(projectRoot, "packs/focus-abilities"))).toThrow(/Refusing/);
    expect(() => importer.assertCypherPackDestination(projectRoot, path.resolve(projectRoot, "worlds/example/packs/foci"))).toThrow(/Refusing/);
  });

  it("registers both system packs and integrates Cypher generation into the build", async () => {
    const manifest = JSON.parse(await readFile(path.join(projectRoot, "system.json"), "utf8"));
    const packageJson = JSON.parse(await readFile(path.join(projectRoot, "package.json"), "utf8"));
    const releaseScript = await readFile(path.join(projectRoot, "scripts/package-release.ps1"), "utf8");
    const schema = JSON.parse(await readFile(path.join(projectRoot, "content/cyphers/catalog.schema.json"), "utf8"));

    expect(manifest.packs).toContainEqual({name: "cyphers", label: "Cyphers", path: "packs/cyphers", type: "Item", system: "magnusarchives"});
    expect(manifest.packs).toContainEqual({name: "cypher-tables", label: "Cypher Tables", path: "packs/cypher-tables", type: "RollTable", system: "magnusarchives"});
    expect(packageJson.scripts["import:cyphers"]).toBe("node scripts/import-cyphers.mjs");
    expect(packageJson.scripts.build).toContain("pnpm import:cyphers");
    expect(releaseScript).toContain('"packs/cyphers"');
    expect(releaseScript).toContain('"packs/cypher-tables"');
    expect(schema.$id).toContain("content/cyphers/catalog.schema.json");
  });
});
