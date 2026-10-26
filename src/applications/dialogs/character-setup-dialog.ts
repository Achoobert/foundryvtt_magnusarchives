import {SYSTEM_ID} from "../../constants/system";
import {CHARACTER_ARCS, characterArc} from "../../creation/character-arcs";
import type {
  CharacterArcSelection,
  CoreCharacterSetupRequest
} from "../../creation/character-creation-types";
import type {FocusDocumentLike} from "../../focus/focus-types";
import type {PoolKey} from "../../rules/core/core-types";
import {
  CharacterInitializationError,
  type InitializationCharacterLike
} from "../../services/character-initialization-service";
import type {PackageCharacterLike, PackageSourceLike} from "../../services/character-package-service";
import {
  FocusAssociationError,
  type FocusAssociationCharacterLike
} from "../../services/focus-association-service";
import {promptAttachDescriptor, promptAttachType} from "./character-package-dialogs";

type DialogData = Record<string, unknown>;

/** Everything the wizard reads from the Character beyond the initialization contract. */
interface SetupCharacterLike extends InitializationCharacterLike {
  readonly name: string;
  readonly items: Iterable<{
    readonly name: string;
    readonly type: string;
    readonly system: Record<string, unknown>;
  }>;
  readonly system: InitializationCharacterLike["system"] & {
    readonly focusProgress: readonly {readonly focusUuid: string; readonly provenance?: string}[];
    readonly stats: Record<PoolKey, {readonly baseMax: number}>;
    readonly derived: {readonly pools: Record<PoolKey, {readonly max: number}>};
    readonly identity?: {readonly descriptorLabel: string};
    readonly arc?: {readonly key: string; readonly name: string};
  };
  update(changes: Record<string, unknown>): Promise<unknown>;
}

interface PackOption {
  readonly uuid: string;
  readonly name: string;
}

const POOLS: readonly PoolKey[] = ["might", "speed", "intellect"];
const POOL_BASE = 8;
const CUSTOM_ARC = "custom";

function number(data: DialogData, key: string): number {
  return Number(data[key] ?? 0);
}

function text(data: DialogData, key: string): string {
  return String(data[key] ?? "").trim();
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[character]!);
}

function poolLabel(pool: PoolKey): string {
  return game.i18n.localize(`MAGNUSARCHIVES.Pools.${pool[0]!.toUpperCase()}${pool.slice(1)}`);
}

async function input(
  title: string,
  content: string,
  render?: (root: HTMLElement) => void,
  okLabel = game.i18n.localize("MAGNUSARCHIVES.Actions.Next")
): Promise<DialogData | null> {
  return foundry.applications.api.DialogV2.input({
    window: {title},
    content: `<div class="magnusarchives-dialog-fields">${content}</div>`,
    rejectClose: false,
    render: render
      ? (_event: Event, dialog: {element: HTMLElement}) => render(dialog.element)
      : undefined,
    ok: {label: okLabel}
  }) as Promise<DialogData | null>;
}

/** System compendium entries of one Item type, falling back to world Items when the pack is missing. */
async function packOrWorldOptions(packName: string, itemType: string): Promise<PackOption[]> {
  const packId = `${SYSTEM_ID}.${packName}`;
  const options: PackOption[] = [];
  try {
    const index = await game.packs.get(packId)?.getIndex({fields: ["type"]}) as
      Iterable<{_id: string; uuid?: string; name: string; type?: string}> | undefined;
    for (const entry of index ?? []) {
      if (entry.type && entry.type !== itemType) continue;
      options.push({uuid: entry.uuid ?? `Compendium.${packId}.Item.${entry._id}`, name: entry.name});
    }
  } catch (error) {
    console.warn(`magnusarchives | Could not read Compendium ${packId}`, error);
  }
  if (!options.length) {
    for (const item of game.items) {
      if (item.type === itemType) options.push({uuid: item.uuid, name: item.name});
    }
  }
  return options.sort((left, right) => left.name.localeCompare(right.name));
}

function optionList(options: readonly PackOption[]): string {
  return options.map((entry) => `<option value="${escapeHtml(entry.uuid)}">${escapeHtml(entry.name)}</option>`).join("");
}

async function pickFromPack(
  title: string,
  label: string,
  packName: string,
  itemType: string,
  extra = ""
): Promise<{uuid: string; data: DialogData} | null> {
  const options = await packOrWorldOptions(packName, itemType);
  if (!options.length) {
    ui.notifications.warn(game.i18n.format("MAGNUSARCHIVES.Creation.NoneAvailable", {label}));
    return null;
  }
  const data = await input(title, `<label>${label}<select name="uuid">${optionList(options)}</select></label>${extra}`);
  if (!data) return null;
  return {uuid: text(data, "uuid"), data};
}

function primaryDescriptorName(actor: SetupCharacterLike): string | null {
  return [...actor.items].find((item) => item.type === "descriptor"
    && (item.system.instance as {role?: string} | undefined)?.role === "primary")?.name ?? null;
}

function typeName(actor: SetupCharacterLike): string | null {
  return [...actor.items].find((item) => item.type === "characterType")?.name ?? null;
}

function hasCreationFocus(actor: SetupCharacterLike): boolean {
  return actor.system.focusProgress.some((entry) => entry.provenance === "creation");
}

async function creationFocusName(actor: SetupCharacterLike): Promise<string> {
  const progress = actor.system.focusProgress.find((entry) => entry.provenance === "creation");
  if (!progress) return "";
  const focus = await fromUuid(progress.focusUuid) as {name?: string} | null;
  return focus?.name ?? "";
}

/** Step 1: a listed Descriptor gives the mechanics; the player may show a custom word in its place. */
async function descriptorStep(actor: SetupCharacterLike): Promise<string | null> {
  const wordField = (placeholder: string): string => `<label>${game.i18n.localize("MAGNUSARCHIVES.Creation.DescriptorWord")}
      <input name="descriptorLabel" type="text" placeholder="${escapeHtml(placeholder)}" value="${escapeHtml(actor.system.identity?.descriptorLabel ?? "")}">
    </label>
    <p class="hint">${game.i18n.localize("MAGNUSARCHIVES.Creation.DescriptorWordHint")}</p>`;
  const existing = primaryDescriptorName(actor);
  if (existing) {
    const data = await input(
      game.i18n.localize("MAGNUSARCHIVES.Creation.StepDescriptor"),
      `<p>${game.i18n.format("MAGNUSARCHIVES.Creation.AlreadyChosen", {name: escapeHtml(existing)})}</p>${wordField(existing)}`
    );
    return data ? text(data, "descriptorLabel") : null;
  }
  const picked = await pickFromPack(
    game.i18n.localize("MAGNUSARCHIVES.Creation.StepDescriptor"),
    game.i18n.localize("MAGNUSARCHIVES.Creation.Descriptor"),
    "descriptors",
    "descriptor",
    `<p>${game.i18n.localize("MAGNUSARCHIVES.Creation.DescriptorPrompt")}</p>${wordField("")}`
  );
  if (!picked) return null;
  const source = await fromUuid(picked.uuid) as PackageSourceLike | null;
  if (!source) return null;
  const attached = await promptAttachDescriptor(actor as unknown as PackageCharacterLike, source, "primary");
  return attached ? text(picked.data, "descriptorLabel") : null;
}

/** Step 2: the Type sets starting Pools, Edge, weapons and its own Skill choice. */
async function typeStep(actor: SetupCharacterLike): Promise<boolean> {
  if (typeName(actor)) return true;
  const picked = await pickFromPack(
    game.i18n.localize("MAGNUSARCHIVES.Creation.StepType"),
    game.i18n.localize("MAGNUSARCHIVES.Creation.Type"),
    "types",
    "characterType"
  );
  if (!picked) return false;
  const source = await fromUuid(picked.uuid) as PackageSourceLike | null;
  return source ? promptAttachType(actor as unknown as PackageCharacterLike, source) : false;
}

/** Step 3: the creation Focus. */
async function focusStep(actor: SetupCharacterLike): Promise<boolean> {
  if (hasCreationFocus(actor)) return true;
  const picked = await pickFromPack(
    game.i18n.localize("MAGNUSARCHIVES.Creation.StepFocus"),
    game.i18n.localize("MAGNUSARCHIVES.Creation.Focus"),
    "foci",
    "focus"
  );
  if (!picked) return false;
  const focus = await fromUuid(picked.uuid) as FocusDocumentLike | null;
  if (!focus) return false;
  try {
    await game.magnusarchives.services.focusAssociations.attach(
      actor as unknown as FocusAssociationCharacterLike,
      focus,
      "creation"
    );
    return true;
  } catch (error) {
    const key = error instanceof FocusAssociationError
      ? `MAGNUSARCHIVES.Focus.Association.Errors.${error.code}`
      : "MAGNUSARCHIVES.Focus.Errors.Unexpected";
    if (!(error instanceof FocusAssociationError)) console.error(error);
    ui.notifications.error(game.i18n.localize(key));
    return false;
  }
}

function bindPoolRemainder(root: HTMLElement): void {
  const inputs = [...root.querySelectorAll<HTMLInputElement>(
    'input[name="might"], input[name="speed"], input[name="intellect"]'
  )];
  const output = root.querySelector<HTMLOutputElement>('[data-core-points-remaining]');
  const submit = root.querySelector<HTMLButtonElement>('button[data-action="ok"]');
  const refresh = (): void => {
    const values = inputs.map((element) => Number(element.value));
    const valid = values.every((entry) => Number.isInteger(entry) && entry >= 0 && entry <= 6);
    const remaining = 6 - values.reduce((sum, entry) => sum + entry, 0);
    if (output) output.value = String(remaining);
    if (submit) submit.disabled = !valid || remaining !== 0;
  };
  inputs.forEach((element) => element.addEventListener("input", refresh));
  refresh();
}

/** Starting value before the six free points: base 8 plus Type and Descriptor bonuses. */
function startingPool(actor: SetupCharacterLike, pool: PoolKey): number {
  const bonus = actor.system.derived.pools[pool].max - actor.system.stats[pool].baseMax;
  return POOL_BASE + bonus;
}

/** Step 4: six free Pool points. */
async function poolStep(actor: SetupCharacterLike): Promise<CoreCharacterSetupRequest["pools"] | null> {
  const rows = POOLS.map((pool) => (
    `<label>${poolLabel(pool)} ${startingPool(actor, pool)} + <input name="${pool}" type="number" min="0" max="6" value="0"></label>`
  )).join("");
  const data = await input(
    game.i18n.localize("MAGNUSARCHIVES.Creation.StepPools"),
    `<p>${game.i18n.localize("MAGNUSARCHIVES.Creation.PoolsPrompt")}</p>${rows}
     <p>${game.i18n.localize("MAGNUSARCHIVES.Creation.PointsRemaining")}: <output data-core-points-remaining>6</output> / 6</p>`,
    bindPoolRemainder
  );
  if (!data) return null;
  const allocation = {might: number(data, "might"), speed: number(data, "speed"), intellect: number(data, "intellect")};
  if (Object.values(allocation).reduce((sum, value) => sum + value, 0) !== 6
    || Object.values(allocation).some((value) => !Number.isInteger(value) || value < 0)) {
    notify(new CharacterInitializationError("invalid-pools", "Invalid Pool allocation."));
    return null;
  }
  return allocation;
}

export function arcDetailsHtml(key: string): string {
  const definition = characterArc(key);
  if (!definition) return "";
  const beat = (label: string, value: string): string => (
    `<li><strong>${game.i18n.localize(`MAGNUSARCHIVES.Arc.Beat.${label}`)}:</strong> ${escapeHtml(value)}</li>`
  );
  return `<p>${escapeHtml(definition.summary)}</p><ul>
    ${beat("opening", definition.beats.opening)}
    ${definition.beats.steps.map((step) => beat("step", step)).join("")}
    ${beat("climax", definition.beats.climax)}
    ${beat("resolution", definition.beats.resolution)}
  </ul>`;
}

function bindArcPicker(root: HTMLElement): void {
  const select = root.querySelector<HTMLSelectElement>('select[name="arcKey"]');
  const details = root.querySelector<HTMLElement>("[data-arc-details]");
  const custom = root.querySelector<HTMLElement>("[data-arc-custom]");
  if (!select) return;
  const refresh = (): void => {
    if (details) details.innerHTML = arcDetailsHtml(select.value);
    if (custom) custom.hidden = select.value !== CUSTOM_ARC;
  };
  select.addEventListener("change", refresh);
  refresh();
}

/** Arc picker shared by Core Setup and the sheet. Returns undefined for "no arc yet", null on cancel. */
export async function promptArcSelection(
  current?: {key: string; name: string},
  okLabel?: string
): Promise<CharacterArcSelection | undefined | null> {
  const selected = current?.key || (current?.name ? CUSTOM_ARC : "");
  const option = (value: string, label: string): string => (
    `<option value="${escapeHtml(value)}"${value === selected ? " selected" : ""}>${escapeHtml(label)}</option>`
  );
  const data = await input(
    game.i18n.localize("MAGNUSARCHIVES.Creation.StepArc"),
    `<p>${game.i18n.localize("MAGNUSARCHIVES.Creation.ArcPrompt")}</p>
     <label>${game.i18n.localize("MAGNUSARCHIVES.Arc.Label")}<select name="arcKey">
       ${option("", game.i18n.localize("MAGNUSARCHIVES.Creation.NoArc"))}
       ${CHARACTER_ARCS.map((entry) => option(entry.key, entry.name)).join("")}
       ${option(CUSTOM_ARC, game.i18n.localize("MAGNUSARCHIVES.Creation.CustomArc"))}
     </select></label>
     <label data-arc-custom hidden>${game.i18n.localize("MAGNUSARCHIVES.Creation.CustomArcName")}
       <input name="arcName" type="text" value="${escapeHtml(current?.key ? "" : current?.name ?? "")}">
     </label>
     <div data-arc-details></div>`,
    bindArcPicker,
    okLabel
  );
  if (!data) return null;
  const key = text(data, "arcKey");
  if (!key) return undefined;
  if (key === CUSTOM_ARC) {
    const name = text(data, "arcName");
    return name ? {key: "", name} : undefined;
  }
  const definition = characterArc(key);
  return definition ? {key: definition.key, name: definition.name} : undefined;
}

/** Change the arc from the sheet, outside Core Setup. Picking a new arc restarts its progress. */
export async function promptChooseArc(actor: InitializationCharacterLike): Promise<void> {
  const current = (actor as unknown as SetupCharacterLike).system.arc;
  const arc = await promptArcSelection(current, game.i18n.localize("MAGNUSARCHIVES.Actions.Apply"));
  if (arc === null) return;
  const changed = (arc?.key ?? "") !== (current?.key ?? "") || (arc?.name ?? "") !== (current?.name ?? "");
  if (!changed) return;
  await actor.update({
    "system.arc.key": arc?.key ?? "",
    "system.arc.name": arc?.name ?? "",
    "system.arc.stage": "none",
    "system.arc.stepsCompleted": 0
  });
}

function notify(error: unknown): void {
  const key = error instanceof CharacterInitializationError
    ? `MAGNUSARCHIVES.Creation.Errors.${error.code}`
    : "MAGNUSARCHIVES.Creation.Errors.Unexpected";
  if (!(error instanceof CharacterInitializationError)) console.error(error);
  ui.notifications.error(game.i18n.localize(key));
}

/**
 * Magnus Archives Core Setup: Descriptor, Type and Focus first (they grant the
 * starting Skills and Pool bonuses), then six free Pool points, then a
 * Character Arc. Cancelling any step stops; packages already attached stay.
 */
export async function promptCoreCharacterSetup(target: InitializationCharacterLike): Promise<void> {
  const actor = target as unknown as SetupCharacterLike;
  const descriptorLabel = await descriptorStep(actor);
  if (descriptorLabel === null) return;
  if (!await typeStep(actor)) return;
  if (!await focusStep(actor)) return;
  const pools = await poolStep(actor);
  if (!pools) return;
  const arc = await promptArcSelection(actor.system.arc);
  if (arc === null) return;

  const descriptorWord = descriptorLabel || primaryDescriptorName(actor) || "";
  const identity = game.i18n.format("MAGNUSARCHIVES.Creation.ReviewIdentity", {
    descriptor: escapeHtml(descriptorWord),
    type: escapeHtml(typeName(actor) ?? ""),
    focus: escapeHtml(await creationFocusName(actor))
  });
  const skills = [...actor.items].filter((item) => item.type === "skill");
  const review = await foundry.applications.api.DialogV2.confirm({
    window: {title: game.i18n.localize("MAGNUSARCHIVES.Creation.StepReview")},
    content: `<div class="magnusarchives-dialog-fields">
      <p><strong>${identity}</strong></p>
      <p>${POOLS.map((pool) => `${poolLabel(pool)} ${startingPool(actor, pool) + pools[pool]}`).join(" · ")}</p>
      ${skills.length ? `<ul>${skills.map((item) => (
        `<li>${escapeHtml(item.name)} — ${game.i18n.localize(`MAGNUSARCHIVES.Skill.Ranks.${String(item.system.rank)}`)}</li>`
      )).join("")}</ul>` : ""}
      <p>${game.i18n.localize("MAGNUSARCHIVES.Arc.Label")}: ${escapeHtml(arc?.name ?? game.i18n.localize("MAGNUSARCHIVES.Creation.NoArc"))}</p>
    </div>`,
    yes: {label: game.i18n.localize("MAGNUSARCHIVES.Creation.Finalize")},
    no: {label: game.i18n.localize("MAGNUSARCHIVES.Actions.Cancel")}
  });
  if (!review) return;
  const request: CoreCharacterSetupRequest = {pools, descriptorLabel, ...(arc ? {arc} : {})};
  try {
    await game.magnusarchives.services.characterInitialization.setup(target, request);
    await target.sheet?.render({force: true});
    ui.notifications.info(game.i18n.localize("MAGNUSARCHIVES.Creation.Completed"));
  } catch (error) {
    notify(error);
  }
}

export async function markCoreInitialized(
  actor: InitializationCharacterLike,
  mode: "skipped" | "manual"
): Promise<void> {
  try {
    await game.magnusarchives.services.characterInitialization.markInitialized(actor, mode);
    await actor.sheet?.render({force: true});
    ui.notifications.info(game.i18n.localize(
      mode === "skipped" ? "MAGNUSARCHIVES.Creation.Skipped" : "MAGNUSARCHIVES.Creation.Marked"
    ));
  } catch (error) {
    notify(error);
  }
}
