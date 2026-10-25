import {existsSync, readFileSync, readdirSync} from "node:fs";
import {extname, join, resolve} from "node:path";
import {describe, expect, it} from "vitest";

import {
  ACTOR_TYPES,
  CYPHER_MANIFESTATIONS,
  CYPHER_POWERS,
  ITEM_TYPES,
  RECOVERY_KINDS,
  RECOVERY_TYPES,
  SKILL_RANKS,
  WOUND_SEVERITIES
} from "../../src/constants/system";

const root = resolve(process.cwd());
const catalogPath = join(root, "lang", "en.json");

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, {withFileTypes: true}).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? sourceFiles(path) : [path];
  });
}

function catalog(): Record<string, string> {
  return JSON.parse(readFileSync(catalogPath, "utf8")) as Record<string, string>;
}

describe("English localization catalog", () => {
  it("is the only language declared by the system manifest", () => {
    const manifest = JSON.parse(readFileSync(join(root, "system.json"), "utf8")) as {
      languages: Array<{lang: string; name: string; path: string}>;
    };

    expect(manifest.languages).toEqual([
      {lang: "en", name: "English", path: "lang/en.json"}
    ]);
    expect(existsSync(catalogPath)).toBe(true);
  });

  it("contains no leaf key that is also a localization namespace", () => {
    const keys = Object.keys(catalog());
    const collisions = keys.filter((key) => keys.some((candidate) => candidate.startsWith(`${key}.`)));
    expect(collisions).toEqual([]);
  });

  it("contains every literal key referenced by TypeScript and Handlebars", () => {
    const translations = catalog();
    const files = [
      ...sourceFiles(join(root, "src")).filter((path) => extname(path) === ".ts"),
      ...sourceFiles(join(root, "templates")).filter((path) => extname(path) === ".hbs")
    ];
    const referenced = new Set<string>();
    const literalKey = /["']((?:MAGNUSARCHIVES|TYPES)\.[A-Za-z0-9_.-]+)["']/g;
    for (const file of files) {
      const source = readFileSync(file, "utf8");
      for (const match of source.matchAll(literalKey)) referenced.add(match[1]!);
    }

    const missing = [...referenced].filter((key) => !(key in translations)).sort();
    expect(missing).toEqual([]);
  });

  it("contains every key generated dynamically by the current UI and manifest", () => {
    const translations = catalog();
    const dynamicKeys = [
      ...ACTOR_TYPES.map((type) => `TYPES.Actor.${type}`),
      ...ITEM_TYPES.map((type) => `TYPES.Item.${type}`),
      ...WOUND_SEVERITIES.map((severity) => `MAGNUSARCHIVES.Wounds.Severity.${severity}`),
      ...RECOVERY_KINDS.map((kind) => `MAGNUSARCHIVES.Recovery.Kind.${kind}`),
      ...RECOVERY_TYPES.map((type) => `MAGNUSARCHIVES.Recovery.${type}`),
      ...SKILL_RANKS.map((rank) => `MAGNUSARCHIVES.Skill.Ranks.${rank}`),
      ...CYPHER_MANIFESTATIONS.map((value) => `MAGNUSARCHIVES.Cypher.Manifestation.${value}`),
      ...CYPHER_POWERS.map((value) => `MAGNUSARCHIVES.Cypher.Power.${value}`),
      ...["applied", "available", "unresolved", "inapplicable"]
        .map((status) => `MAGNUSARCHIVES.Roll.NaturalEffects.Status.${status}`),
      ...["targeted", "group", "free"].map((mode) => `MAGNUSARCHIVES.Intrusion.Mode.${mode}`),
      ...["owned", "available", "locked", "future"]
        .map((state) => `MAGNUSARCHIVES.Focus.State.${state}`)
    ];

    expect(dynamicKeys.filter((key) => !(key in translations))).toEqual([]);
  });
});
