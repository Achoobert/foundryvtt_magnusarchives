import type {
  CoreCharacterSetupRequest,
  StartingSkillSelection
} from "../../creation/character-creation-types";
import {
  CharacterInitializationError,
  type InitializationCharacterLike
} from "../../services/character-initialization-service";

type DialogData = Record<string, unknown>;

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

function skillOptions(): string {
  return [
    `<option value="custom">${game.i18n.localize("MAGNUSARCHIVES.Creation.CustomSkill")}</option>`,
    ...[...game.items]
      .filter((item) => item.type === "skill")
      .sort((left, right) => left.name.localeCompare(right.name))
      .map((item) => `<option value="${escapeHtml(item.uuid)}">${escapeHtml(item.name)}</option>`)
  ].join("");
}

function skillRow(index: number, label: string): string {
  return `<fieldset><legend>${label}</legend>
    <label>${game.i18n.localize("MAGNUSARCHIVES.Creation.SkillSource")}<select name="source${index}">${skillOptions()}</select></label>
    <label>${game.i18n.localize("MAGNUSARCHIVES.Creation.CustomSkillName")}<input name="name${index}" type="text"></label>
  </fieldset>`;
}

function selection(data: DialogData, index: number, rank: "trained" | "inability"): StartingSkillSelection {
  const source = text(data, `source${index}`);
  return source === "custom"
    ? {customName: text(data, `name${index}`), category: "general", rank}
    : {sourceUuid: source, rank};
}

async function input(
  title: string,
  content: string,
  render?: (root: HTMLElement) => void
): Promise<DialogData | null> {
  return foundry.applications.api.DialogV2.input({
    window: {title},
    content: `<div class="magnusarchives-dialog-fields">${content}</div>`,
    rejectClose: false,
    render: render
      ? (_event: Event, dialog: {element: HTMLElement}) => render(dialog.element)
      : undefined,
    ok: {label: game.i18n.localize("MAGNUSARCHIVES.Actions.Apply")}
  }) as Promise<DialogData | null>;
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

function notify(error: unknown): void {
  const key = error instanceof CharacterInitializationError
    ? `MAGNUSARCHIVES.Creation.Errors.${error.code}`
    : "MAGNUSARCHIVES.Creation.Errors.Unexpected";
  if (!(error instanceof CharacterInitializationError)) console.error(error);
  ui.notifications.error(game.i18n.localize(key));
}

export async function promptCoreCharacterSetup(actor: InitializationCharacterLike): Promise<void> {
  const pools = await input(
    game.i18n.localize("MAGNUSARCHIVES.Creation.StepPools"),
    `<p>${game.i18n.localize("MAGNUSARCHIVES.Creation.PoolsPrompt")}</p>
     <label>${game.i18n.localize("MAGNUSARCHIVES.Pools.Might")} 8 + <input name="might" type="number" min="0" max="6" value="0"></label>
     <label>${game.i18n.localize("MAGNUSARCHIVES.Pools.Speed")} 8 + <input name="speed" type="number" min="0" max="6" value="0"></label>
     <label>${game.i18n.localize("MAGNUSARCHIVES.Pools.Intellect")} 8 + <input name="intellect" type="number" min="0" max="6" value="0"></label>
     <p>${game.i18n.localize("MAGNUSARCHIVES.Creation.PointsRemaining")}: <output data-core-points-remaining>6</output> / 6</p>`,
    bindPoolRemainder
  );
  if (!pools) return;
  const allocation = {might: number(pools, "might"), speed: number(pools, "speed"), intellect: number(pools, "intellect")};
  if (Object.values(allocation).reduce((sum, value) => sum + value, 0) !== 6
    || Object.values(allocation).some((value) => !Number.isInteger(value) || value < 0)) {
    notify(new CharacterInitializationError("invalid-pools", "Invalid Pool allocation."));
    return;
  }

  const initial = await input(
    game.i18n.localize("MAGNUSARCHIVES.Creation.StepSkills"),
    skillRow(1, game.i18n.localize("MAGNUSARCHIVES.Creation.SkillOne"))
      + skillRow(2, game.i18n.localize("MAGNUSARCHIVES.Creation.SkillTwo"))
  );
  if (!initial) return;
  const skills: StartingSkillSelection[] = [selection(initial, 1, "trained"), selection(initial, 2, "trained")];
  const third = await foundry.applications.api.DialogV2.confirm({
    window: {title: game.i18n.localize("MAGNUSARCHIVES.Creation.OptionalThird")},
    content: `<div class="magnusarchives magnusarchives-dialog"><p>${game.i18n.localize("MAGNUSARCHIVES.Creation.OptionalThirdPrompt")}</p></div>`,
    yes: {label: game.i18n.localize("MAGNUSARCHIVES.Creation.AddThird")},
    no: {label: game.i18n.localize("MAGNUSARCHIVES.Creation.KeepTwo")}
  });
  if (third) {
    const optional = await input(
      game.i18n.localize("MAGNUSARCHIVES.Creation.OptionalThird"),
      skillRow(3, game.i18n.localize("MAGNUSARCHIVES.Creation.SkillThree"))
        + skillRow(4, game.i18n.localize("MAGNUSARCHIVES.Creation.Inability"))
    );
    if (!optional) return;
    skills.push(selection(optional, 3, "trained"), selection(optional, 4, "inability"));
  }
  const names = skills.map((entry) => entry.customName
    || [...game.items].find((item) => item.uuid === entry.sourceUuid)?.name
    || game.i18n.localize("MAGNUSARCHIVES.Creation.UnknownSkill"));
  const review = await foundry.applications.api.DialogV2.confirm({
    window: {title: game.i18n.localize("MAGNUSARCHIVES.Creation.StepReview")},
    content: `<div class="magnusarchives-dialog-fields">
      <p>${game.i18n.localize("MAGNUSARCHIVES.Pools.Might")} ${8 + allocation.might} · ${game.i18n.localize("MAGNUSARCHIVES.Pools.Speed")} ${8 + allocation.speed} · ${game.i18n.localize("MAGNUSARCHIVES.Pools.Intellect")} ${8 + allocation.intellect}</p>
      <ul>${names.map((name, index) => `<li>${escapeHtml(name)} — ${game.i18n.localize(`MAGNUSARCHIVES.Skill.Ranks.${skills[index]!.rank}`)}</li>`).join("")}</ul>
    </div>`,
    yes: {label: game.i18n.localize("MAGNUSARCHIVES.Creation.Finalize")},
    no: {label: game.i18n.localize("MAGNUSARCHIVES.Actions.Cancel")}
  });
  if (!review) return;
  const request: CoreCharacterSetupRequest = {pools: allocation, skills};
  try {
    await game.magnusarchives.services.characterInitialization.setup(actor, request);
    await actor.sheet?.render({force: true});
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
