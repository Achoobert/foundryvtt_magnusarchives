/**
 * Prepares the local dev world so the Cypress + Quench suite can run unattended:
 *   - enables the `quench` module and this system's Quench test module
 *   - sets a known Gamemaster password, so `cy.loginAsGM()` can sign in
 *
 * Foundry v14 rejects any join for a user whose stored password is null
 * (`testPassword` throws and the request 401s), so the password has to be a real
 * pbkdf2 hash rather than simply cleared.
 *
 * Dev-world only. Foundry must be stopped, because LevelDB is single-writer.
 */
import crypto from "node:crypto";
import path from "node:path";
import {existsSync} from "node:fs";
import {ClassicLevel} from "classic-level";
import {DATA_DIR, config} from "./lib/fvtt-config.mjs";
import {QUENCH_MODULE_ID, SYSTEM_ID} from "./lib/system-manifest.mjs";

const WORLD_DATA = path.join(DATA_DIR, "worlds", SYSTEM_ID, "data");
const MODULES_TO_ENABLE = ["quench", QUENCH_MODULE_ID];
const GM_PASSWORD = config.gmPassword ?? "quench-dev";

// Matches Foundry v14's own hashPassword().
function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
}

if (!existsSync(WORLD_DATA)) {
  console.error(`No world data at ${WORLD_DATA}. Run \`pnpm dev:world\` and launch the world once first.`);
  process.exit(1);
}

async function withDb(name, fn) {
  const db = new ClassicLevel(path.join(WORLD_DATA, name), {valueEncoding: "json"});
  try {
    await db.open();
  } catch (error) {
    console.error(`Could not open the ${name} database: ${error.message}`);
    console.error("Stop Foundry first (docker compose down), then re-run this script.");
    process.exit(1);
  }
  try {
    await fn(db);
  } finally {
    await db.close();
  }
}

await withDb("settings", async (db) => {
  const entries = await db.iterator().all();
  const entry = entries.find(([, value]) => value?.key === "core.moduleConfiguration");
  if (!entry) {
    console.error("core.moduleConfiguration is not set yet — launch the world once, then re-run.");
    process.exit(1);
  }
  const [key, value] = entry;
  const configuration = JSON.parse(value.value || "{}");
  for (const id of MODULES_TO_ENABLE) configuration[id] = true;
  value.value = JSON.stringify(configuration);
  await db.put(key, value);
  console.log(`Enabled modules: ${MODULES_TO_ENABLE.join(", ")}`);
});

await withDb("users", async (db) => {
  let updated = 0;
  for (const [key, user] of await db.iterator().all()) {
    if (user?.role !== 4) continue;
    const salt = crypto.randomBytes(32).toString("hex");
    user.passwordSalt = salt;
    user.password = hashPassword(GM_PASSWORD, salt);
    await db.put(key, user);
    console.log(`Set the dev password for Gamemaster "${user.name}".`);
    updated += 1;
  }
  if (!updated) console.warn("No Gamemaster user found — launch the world once, then re-run.");
});

console.log("Dev world seeded. Start Foundry again to pick it up.");
