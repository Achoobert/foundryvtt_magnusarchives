import {spawn} from "node:child_process";
import {existsSync, watch} from "node:fs";
import path from "node:path";
import {ROOT} from "./lib/fvtt-config.mjs";

const DEBOUNCE_MS = 250;

// `dist` is the Vite bundle output; the rest are served raw by Foundry.
const WATCH_PATHS = ["dist", "templates", "lang", "assets", "system.json", "tests/quench", "yml_source"];

function run(script) {
  return new Promise((resolve, reject) => {
    const child = spawn("pnpm", ["run", script], {cwd: ROOT, stdio: "inherit", shell: true});
    child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`${script} exited ${code}`))));
    child.on("error", reject);
  });
}

async function runSafe(script) {
  try {
    await run(script);
  } catch (error) {
    console.error(error.message);
  }
}

function rel(filePath) {
  return path.relative(ROOT, filePath).split(path.sep).join("/");
}

let timer;
let running = false;
let pending = {sync: false, quench: false, packs: false};

function schedule(filePath) {
  const relative = rel(filePath);
  // Independent flags: a tests/quench change still needs the system synced if
  // anything else changed in the same debounce window.
  if (relative === "tests/quench" || relative.startsWith("tests/quench/")) {
    pending.quench = true;
  } else if (relative.startsWith("yml_source/")) {
    // Compendium YAML has to be compiled into packs/ before it can be synced.
    pending.packs = true;
    pending.sync = true;
  } else {
    pending.sync = true;
  }
  clearTimeout(timer);
  timer = setTimeout(flush, DEBOUNCE_MS);
}

async function flush() {
  if (running) {
    timer = setTimeout(flush, DEBOUNCE_MS);
    return;
  }
  const job = {...pending};
  pending = {sync: false, quench: false, packs: false};
  if (!job.sync && !job.quench) return;

  running = true;
  if (job.packs) await runSafe("packs:build");
  if (job.sync) await runSafe("dev:sync");
  if (job.quench) await runSafe("test:quench:sync");
  running = false;
}

console.log("Initial sync...");
pending = {sync: true, quench: existsSync(path.join(ROOT, "tests", "quench")), packs: true};
await flush();

const vite = spawn("pnpm", ["exec", "vite", "build", "--watch"], {
  cwd: ROOT,
  stdio: "inherit",
  shell: true
});

vite.on("exit", (code) => {
  if (code && code !== 0) process.exit(code);
});

for (const entry of WATCH_PATHS) {
  const target = path.join(ROOT, entry);
  if (!existsSync(target)) continue;
  watch(target, {recursive: true}, (_event, filename) => {
    schedule(filename ? path.join(target, filename) : target);
  });
  console.log(`Watching ${entry}`);
}

function shutdown() {
  vite.kill();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

console.log("Watching. Vite rebuild + pack build + Foundry sync + Quench sync.");
