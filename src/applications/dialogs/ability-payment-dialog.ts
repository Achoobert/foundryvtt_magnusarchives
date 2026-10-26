import {abilityAllowedPools} from "../../abilities/ability-cost";
import type {AbilityItemLike} from "../../abilities/ability-types";
import type {PoolKey} from "../../rules/core/core-types";
import type {CombatCharacterLike} from "../../services/combat-service";

function poolLabel(pool: PoolKey): string {
  return game.i18n.localize(`MAGNUSARCHIVES.Pools.${pool[0]!.toUpperCase()}${pool.slice(1)}`);
}

function selectedPool(data: Record<string, unknown>): PoolKey | null {
  const value = String(data.pool ?? "");
  return value === "might" || value === "speed" || value === "intellect" ? value : null;
}

export async function promptAbilityCostPayment(actor: CombatCharacterLike, ability: AbilityItemLike): Promise<void> {
  const pools = abilityAllowedPools(ability);
  if (ability.system.cost.amount <= 0 || pools.length === 0) {
    throw new Error(game.i18n.localize("MAGNUSARCHIVES.Ability.Payment.NoCost"));
  }

  let pool = pools.length === 1 ? pools[0]! : null;
  if (!pool) {
    const previews = pools.map((candidate) =>
      game.magnusarchives.services.abilities.previewPayment(actor, ability, candidate)
    );
    const choices = previews
      .map(
        (preview, index) => `
      <label class="ability-payment-choice">
        <input type="radio" name="pool" value="${preview.pool}" ${index === 0 ? "checked" : ""}>
        <strong>${poolLabel(preview.pool)}</strong>
        <span>${game.i18n.localize("MAGNUSARCHIVES.Ability.Payment.Current")}: ${preview.currentBefore}</span>
        <span>${game.i18n.localize("MAGNUSARCHIVES.Pools.Edge")}: ${preview.edge}</span>
        <span>${game.i18n.localize("MAGNUSARCHIVES.Ability.Payment.Pay")}: ${preview.costPaid}</span>
      </label>`
      )
      .join("");
    const data = (await foundry.applications.api.DialogV2.input({
      window: {title: game.i18n.format("MAGNUSARCHIVES.Ability.Payment.Title", {name: ability.name})},
      content: `<div class="magnusarchives magnusarchives-dialog ability-payment-dialog"><p>${game.i18n.localize("MAGNUSARCHIVES.Ability.Cost")}: <strong>${ability.system.cost.amount}</strong></p><div class="ability-payment-choices">${choices}</div><p class="ability-payment-whole-cost">${game.i18n.localize("MAGNUSARCHIVES.Ability.Payment.WholeCost")}</p></div>`,
      rejectClose: false,
      ok: {label: game.i18n.localize("MAGNUSARCHIVES.Ability.Payment.Pay")}
    })) as Record<string, unknown> | null;
    if (!data) return;
    pool = selectedPool(data);
    if (!pool || !pools.includes(pool)) throw new Error("Invalid Ability payment Pool.");
  }

  const outcome = await game.magnusarchives.services.abilities.payCost(actor, ability, pool);
  await game.magnusarchives.services.abilityChat.publishPayment(actor, outcome);
}
