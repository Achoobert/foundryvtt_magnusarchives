import type {GenreDocumentLike} from "../../genre/genre-types";
import {GenreAssociationError, GenreChoiceError, type GenreCharacterLike} from "../../services/genre-service";
import {GrantConflictCancelledError} from "../../packages/grant-conflicts";
import {resolveGrantConflictWithDialog} from "./grant-conflict-dialog";

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      })[character]!
  );
}

function notify(error: unknown): void {
  if (error instanceof GrantConflictCancelledError) return;
  console.error(error);
  const key =
    error instanceof GenreAssociationError
      ? `MAGNUSARCHIVES.Genre.Errors.${error.code}`
      : error instanceof GenreChoiceError
        ? `MAGNUSARCHIVES.Genre.Errors.${error.code}`
        : "MAGNUSARCHIVES.Genre.Errors.unexpected";
  ui.notifications.error(game.i18n.localize(key));
}

export async function promptAttachGenre(
  actor: GenreCharacterLike,
  dropped?: GenreDocumentLike,
  provenance: "manual" | "typeSuggestion" | "migration" = "manual"
): Promise<void> {
  let genre = dropped;
  if (!genre) {
    const genres = [...game.items]
      .filter((item) => item.type === "genre")
      .sort((left, right) => left.name.localeCompare(right.name));
    if (!genres.length) {
      ui.notifications.warn(game.i18n.localize("MAGNUSARCHIVES.Genre.NoWorldGenres"));
      return;
    }
    const data = (await foundry.applications.api.DialogV2.input({
      window: {title: game.i18n.localize("MAGNUSARCHIVES.Genre.Add")},
      content: `<div class="magnusarchives-dialog-fields"><label>${game.i18n.localize("MAGNUSARCHIVES.Genre.Label")}<select name="uuid">${genres.map((item) => `<option value="${escapeHtml(item.uuid)}">${escapeHtml(item.name)}</option>`).join("")}</select></label></div>`,
      ok: {label: game.i18n.localize("MAGNUSARCHIVES.Actions.Add")}
    })) as Record<string, unknown> | null;
    if (!data) return;
    genre = ((await fromUuid(String(data.uuid ?? ""))) as GenreDocumentLike | null) ?? undefined;
  }
  if (!genre) return;
  if (actor.system.genre.sourceUuid && actor.system.genre.sourceUuid !== genre.uuid) {
    const replace = await foundry.applications.api.DialogV2.confirm({
      window: {title: game.i18n.localize("MAGNUSARCHIVES.Genre.Replace")},
      content: `<div class="magnusarchives magnusarchives-dialog"><p>${game.i18n.localize("MAGNUSARCHIVES.Genre.ReplaceConfirm")}</p></div>`,
      yes: {label: game.i18n.localize("MAGNUSARCHIVES.Packages.Replace")},
      no: {label: game.i18n.localize("MAGNUSARCHIVES.Actions.Cancel")}
    });
    if (!replace) return;
  }
  try {
    await game.magnusarchives.services.genres.attach(actor, genre, provenance);
    ui.notifications.info(game.i18n.localize("MAGNUSARCHIVES.Genre.Attached"));
  } catch (error) {
    notify(error);
  }
}

export async function promptRemoveGenre(actor: GenreCharacterLike): Promise<void> {
  const confirmed = await foundry.applications.api.DialogV2.confirm({
    window: {title: game.i18n.localize("MAGNUSARCHIVES.Genre.Remove")},
    content: `<div class="magnusarchives magnusarchives-dialog"><p>${game.i18n.localize("MAGNUSARCHIVES.Genre.RemoveConfirm")}</p></div>`,
    yes: {label: game.i18n.localize("MAGNUSARCHIVES.Actions.Remove")},
    no: {label: game.i18n.localize("MAGNUSARCHIVES.Actions.Cancel")}
  });
  if (!confirmed) return;
  try {
    await game.magnusarchives.services.genres.remove(actor);
    ui.notifications.info(game.i18n.localize("MAGNUSARCHIVES.Genre.Removed"));
  } catch (error) {
    notify(error);
  }
}

export async function promptGenreChoice(actor: GenreCharacterLike, choiceId: string): Promise<void> {
  try {
    const genre = await game.magnusarchives.services.genres.active(actor);
    if (!genre) throw new GenreChoiceError("genre-required", "Attach a Genre first.");
    const choice = actor.system.advancement.pendingGenreChoices.find((entry) => entry.id === choiceId);
    if (!choice) throw new GenreChoiceError("choice-missing", "Choice not found.");
    const entries = game.magnusarchives.services.genres.eligibleEntries(actor, genre, choice);
    if (!entries.length) throw new GenreChoiceError("entry-ineligible", "No eligible Genre Ability is available.");
    const data = (await foundry.applications.api.DialogV2.input({
      window: {title: game.i18n.localize("MAGNUSARCHIVES.Genre.ChooseAbility")},
      content: `<div class="magnusarchives-dialog-fields"><p><strong>${escapeHtml(genre.name)}</strong></p><label>${game.i18n.localize("MAGNUSARCHIVES.Genre.Ability")}<select name="entryId">${entries.map((entry) => `<option value="${escapeHtml(entry.id)}">${escapeHtml(entry.snapshot.name)} (${game.i18n.localize("MAGNUSARCHIVES.Focus.Tier")} ${entry.minimumTier})</option>`).join("")}</select></label></div>`,
      ok: {label: game.i18n.localize("MAGNUSARCHIVES.Genre.Acquire")}
    })) as Record<string, unknown> | null;
    if (!data) return;
    await game.magnusarchives.services.genres.acquire(
      actor,
      choice.id,
      String(data.entryId ?? ""),
      resolveGrantConflictWithDialog
    );
    ui.notifications.info(game.i18n.localize("MAGNUSARCHIVES.Genre.AbilityAcquired"));
  } catch (error) {
    notify(error);
  }
}

/** Character-facing permissive browser. It never reads or consumes pending choices. */
export async function promptGenreAbilityBrowser(actor: GenreCharacterLike): Promise<void> {
  try {
    const genre = await game.magnusarchives.services.genres.active(actor);
    if (!genre) throw new GenreChoiceError("genre-required", "Attach a Genre first.");
    const entries = game.magnusarchives.services.genres.manualCatalog(actor, genre);
    if (!entries.length) {
      ui.notifications.warn(game.i18n.localize("MAGNUSARCHIVES.Genre.NoCatalogAbilities"));
      return;
    }
    const content = `<div class="magnusarchives genre-ability-browser">
      <p class="genre-browser-source"><strong>${escapeHtml(genre.name)}</strong></p>
      <div class="genre-browser-list">${entries
        .map(
          (entry, index) => `
        <label class="genre-browser-entry${entry.owned ? " is-owned" : ""}${entry.normallyAvailable ? "" : " is-future"}">
          <input type="radio" name="entryId" value="${escapeHtml(entry.id)}"${index === 0 ? " checked" : ""}>
          <span><strong>${escapeHtml(entry.name)}</strong><small>${game.i18n.localize("MAGNUSARCHIVES.Genre.MinimumTier")} ${entry.minimumTier}</small></span>
          <em>${game.i18n.localize(
            entry.owned
              ? "MAGNUSARCHIVES.Genre.Browser.Owned"
              : entry.normallyAvailable
                ? "MAGNUSARCHIVES.Genre.Browser.Available"
                : "MAGNUSARCHIVES.Genre.Browser.HigherTier"
          )}</em>
        </label>`
        )
        .join("")}</div>
      <p class="hint">${game.i18n.localize("MAGNUSARCHIVES.Genre.Browser.GuidanceOnly")}</p>
    </div>`;
    const data = (await foundry.applications.api.DialogV2.input({
      window: {title: game.i18n.localize("MAGNUSARCHIVES.Genre.AddAbilities")},
      content,
      ok: {label: game.i18n.localize("MAGNUSARCHIVES.Actions.Confirm")}
    })) as Record<string, unknown> | null;
    if (!data) return;
    const entryId = String(data.entryId ?? "");
    const selected = entries.find((entry) => entry.id === entryId);
    if (!selected) return;
    if (!selected.owned) {
      await game.magnusarchives.services.genres.acquireManual(actor, entryId, resolveGrantConflictWithDialog);
      ui.notifications.info(game.i18n.localize("MAGNUSARCHIVES.Genre.AbilityAcquired"));
      return;
    }

    const undo = await foundry.applications.api.DialogV2.confirm({
      window: {title: game.i18n.localize("MAGNUSARCHIVES.Genre.Browser.Undo")},
      content: `<div class="magnusarchives magnusarchives-dialog"><p>${game.i18n.format("MAGNUSARCHIVES.Genre.Browser.UndoConfirm", {name: escapeHtml(selected.name)})}</p></div>`,
      yes: {label: game.i18n.localize("MAGNUSARCHIVES.Genre.Browser.Undo")},
      no: {label: game.i18n.localize("MAGNUSARCHIVES.Actions.Cancel")}
    });
    if (!undo) return;
    const deleteAbility = Boolean(
      await foundry.applications.api.DialogV2.confirm({
        window: {title: game.i18n.localize("MAGNUSARCHIVES.Genre.Browser.DeleteTitle")},
        content: `<div class="magnusarchives magnusarchives-dialog"><p>${game.i18n.localize("MAGNUSARCHIVES.Genre.Browser.DeletePrompt")}</p></div>`,
        yes: {label: game.i18n.localize("MAGNUSARCHIVES.Genre.Browser.DeleteAbility")},
        no: {label: game.i18n.localize("MAGNUSARCHIVES.Genre.Browser.KeepAbility")}
      })
    );
    await game.magnusarchives.services.genres.undoManual(actor, entryId, deleteAbility);
    ui.notifications.info(game.i18n.localize("MAGNUSARCHIVES.Genre.Browser.UndoCompleted"));
  } catch (error) {
    notify(error);
  }
}
