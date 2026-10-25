import type {WoundSeverity} from "../../constants/system";
import type {ShieldItemLike} from "../../services/shield-service";

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[character]!);
}

export async function promptEditShieldWound(
  shield: ShieldItemLike,
  severity: WoundSeverity,
  woundId: string
): Promise<void> {
  const wound = shield.system.wounds[severity].find((entry) => entry.id === woundId);
  if (!wound) throw new Error(`Shield Wound '${woundId}' was not found.`);
  const data = await foundry.applications.api.DialogV2.input({
    window: {title: game.i18n.localize("MAGNUSARCHIVES.Wounds.EditTitle")},
    content: `<div class="magnusarchives-dialog-fields">
      <label>${game.i18n.localize("MAGNUSARCHIVES.Wounds.Label")}<input name="label" type="text" value="${escapeHtml(wound.label)}"></label>
      <label>${game.i18n.localize("MAGNUSARCHIVES.Wounds.Description")}<textarea name="description">${escapeHtml(wound.description)}</textarea></label>
    </div>`,
    rejectClose: false,
    ok: {label: game.i18n.localize("MAGNUSARCHIVES.Actions.Save")}
  }) as Record<string, unknown> | null;
  if (!data) return;
  await game.magnusarchives.services.shields.edit(shield, severity, woundId, {
    label: String(data.label ?? ""),
    description: String(data.description ?? "")
  });
}

export async function promptDeleteShieldWound(
  shield: ShieldItemLike,
  severity: WoundSeverity,
  woundId: string
): Promise<void> {
  const confirmed = await foundry.applications.api.DialogV2.confirm({
    window: {title: game.i18n.localize("MAGNUSARCHIVES.Wounds.DeleteTitle")},
    content: `<div class="magnusarchives magnusarchives-dialog"><p>${game.i18n.localize("MAGNUSARCHIVES.Wounds.DeleteConfirm")}</p></div>`,
    rejectClose: false,
    modal: true,
    yes: {label: game.i18n.localize("MAGNUSARCHIVES.Actions.Delete")},
    no: {label: game.i18n.localize("MAGNUSARCHIVES.Actions.Cancel")}
  });
  if (!confirmed) return;
  await game.magnusarchives.services.shields.delete(shield, severity, woundId);
}
