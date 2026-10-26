import {readdirSync, readFileSync} from "node:fs";
import path from "node:path";
import {load} from "js-yaml";

const SOURCE_DIR = path.resolve(import.meta.dirname, "../../yml_source");

/**
 * Every document (folders included) in yml_source/<packId>, the editable
 * source that `pnpm packs:build` compiles into packs/<packId>.
 */
export function loadYmlPack(packId: string): any[] {
  const documents: any[] = [];
  const walk = (directory: string) => {
    const entries = readdirSync(directory, {withFileTypes: true}).sort((left, right) =>
      left.name.localeCompare(right.name)
    );
    for (const entry of entries) {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) walk(entryPath);
      else if (entry.name.endsWith(".yml")) documents.push(load(readFileSync(entryPath, "utf8")));
    }
  };
  walk(path.join(SOURCE_DIR, packId));
  // Pack order, not file order: folders first, then by sort, name and _id.
  const kind = (document: any) => (String(document._key).startsWith("!folders!") ? 0 : 1);
  return documents.sort(
    (left, right) =>
      kind(left) - kind(right) ||
      Number(left.sort ?? 0) - Number(right.sort ?? 0) ||
      String(left.name ?? "").localeCompare(String(right.name ?? "")) ||
      String(left._id ?? "").localeCompare(String(right._id ?? ""))
  );
}
