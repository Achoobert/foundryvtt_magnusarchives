import type {FocusDocumentLike} from "../../focus/focus-types";
import {
  FocusAcquisitionError,
  type FocusCharacterLike
} from "../../services/focus-acquisition-service";

function nodeNames(focus: FocusDocumentLike, nodeIds: readonly string[]): string {
  return nodeIds.map((nodeId) => focus.system.graph.nodes.find((node) => node.id === nodeId)
    ?.abilitySnapshot.name || nodeId).join(", ");
}

async function deleteAbilityChoice(
  actor: FocusCharacterLike,
  focus: FocusDocumentLike,
  nodeId: string
): Promise<boolean> {
  if (!game.magnusarchives.services.focusAcquisition.hasEmbeddedAbility(actor, focus.uuid, nodeId)) {
    return false;
  }
  return Boolean(await foundry.applications.api.DialogV2.confirm({
    window: {title: game.i18n.localize("MAGNUSARCHIVES.Focus.UndoDeleteTitle")},
    content: `<div class="magnusarchives magnusarchives-dialog"><p>${game.i18n.localize("MAGNUSARCHIVES.Focus.UndoDeletePrompt")}</p></div>`,
    yes: {label: game.i18n.localize("MAGNUSARCHIVES.Focus.UndoDeleteAbility")},
    no: {label: game.i18n.localize("MAGNUSARCHIVES.Focus.UndoKeepAbility")}
  }));
}

export async function promptUndoFocusAcquisition(
  actor: FocusCharacterLike,
  focus: FocusDocumentLike,
  nodeId: string,
  force = false
): Promise<void> {
  const node = focus.system.graph.nodes.find((entry) => entry.id === nodeId);
  if (!node) return;
  const confirmed = await foundry.applications.api.DialogV2.confirm({
    window: {title: game.i18n.localize("MAGNUSARCHIVES.Focus.UndoAcquisition")},
    content: `<div class="magnusarchives magnusarchives-dialog"><p>${game.i18n.format("MAGNUSARCHIVES.Focus.UndoConfirm", {name: node.abilitySnapshot.name})}</p></div>`,
    yes: {label: game.i18n.localize("MAGNUSARCHIVES.Focus.UndoAcquisition")},
    no: {label: game.i18n.localize("MAGNUSARCHIVES.Actions.Cancel")}
  });
  if (!confirmed) return;
  const deleteAbility = await deleteAbilityChoice(actor, focus, nodeId);
  try {
    const result = await game.magnusarchives.services.focusAcquisition.undo(
      actor,
      focus,
      nodeId,
      {deleteAbility, force}
    );
    ui.notifications.info(game.i18n.localize(result.choiceRestored
      ? "MAGNUSARCHIVES.Focus.UndoChoiceRestored"
      : "MAGNUSARCHIVES.Focus.UndoCompleted"));
    if (result.invalidOwnedNodeIds.length > 0) {
      ui.notifications.warn(game.i18n.format("MAGNUSARCHIVES.Focus.ProgressionEdit.InvalidWarning", {
        nodes: nodeNames(focus, result.invalidOwnedNodeIds)
      }));
    }
  } catch (error) {
    if (error instanceof FocusAcquisitionError && error.code === "undo-dependent-nodes") {
      if (!game.user.isGM) {
        ui.notifications.error(game.i18n.format("MAGNUSARCHIVES.Focus.Errors.UndoDependencies", {
          nodes: nodeNames(focus, error.dependentNodeIds)
        }));
        return;
      }
      const forceConfirmed = await foundry.applications.api.DialogV2.confirm({
        window: {title: game.i18n.localize("MAGNUSARCHIVES.Focus.ProgressionEdit.ForceUndo")},
        content: `<div class="magnusarchives magnusarchives-dialog"><p>${game.i18n.format("MAGNUSARCHIVES.Focus.ProgressionEdit.ForceUndoWarning", {
          nodes: nodeNames(focus, error.dependentNodeIds)
        })}</p></div>`,
        yes: {label: game.i18n.localize("MAGNUSARCHIVES.Focus.ProgressionEdit.ForceUndo")},
        no: {label: game.i18n.localize("MAGNUSARCHIVES.Actions.Cancel")}
      });
      if (forceConfirmed) {
        const result = await game.magnusarchives.services.focusAcquisition.undo(
          actor, focus, nodeId, {deleteAbility, force: true}
        );
        ui.notifications.warn(game.i18n.format("MAGNUSARCHIVES.Focus.ProgressionEdit.InvalidWarning", {
          nodes: nodeNames(focus, result.invalidOwnedNodeIds)
        }));
      }
      return;
    }
    console.error(error);
    ui.notifications.error(game.i18n.localize("MAGNUSARCHIVES.Focus.Errors.Unexpected"));
  }
}

export async function promptGmMarkFocusOwned(
  actor: FocusCharacterLike,
  focus: FocusDocumentLike,
  nodeId: string
): Promise<void> {
  if (!game.user.isGM) return;
  const node = focus.system.graph.nodes.find((entry) => entry.id === nodeId);
  if (!node) return;
  const confirmed = await foundry.applications.api.DialogV2.confirm({
    window: {title: game.i18n.localize("MAGNUSARCHIVES.Focus.ProgressionEdit.MarkOwned")},
    content: `<div class="magnusarchives magnusarchives-dialog"><p>${game.i18n.format("MAGNUSARCHIVES.Focus.ProgressionEdit.MarkOwnedConfirm", {name: node.abilitySnapshot.name})}</p></div>`,
    yes: {label: game.i18n.localize("MAGNUSARCHIVES.Focus.ProgressionEdit.MarkOwned")},
    no: {label: game.i18n.localize("MAGNUSARCHIVES.Actions.Cancel")}
  });
  if (!confirmed) return;
  await game.magnusarchives.services.focusAcquisition.markOwnedWithGmOverride(actor, focus, nodeId);
  ui.notifications.info(game.i18n.localize("MAGNUSARCHIVES.Focus.ProgressionEdit.MarkedOwned"));
}
