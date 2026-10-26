import type {
  AbilityNoRollOutcome,
  AbilityPaymentOutcome,
  AbilityRollOutcome,
  AbilityTargetLike
} from "../abilities/ability-types";
import {actionTargetIdentity, type RollChatCombatPresentation} from "../combat/combat-chat-types";
import {combatTargetIdentity} from "../combat/combat-types";
import {targetIdentityFromDocument} from "../combat/combat-targets";
import type {CombatCharacterLike} from "./combat-service";
import type {DifficultyVisibility} from "./roll-chat-service";
import {RollChatService} from "./roll-chat-service";
import {chatCardActorImageData} from "./chat-card-presentation";

function targetIdentity(target: AbilityTargetLike) {
  return target.type === "npc" ? combatTargetIdentity(target) : targetIdentityFromDocument(target);
}

function consequence(
  outcome: Pick<AbilityRollOutcome, "target" | "grossDamage" | "damageEffect" | "stressAmount" | "ability">,
  sourceActorId: string
): RollChatCombatPresentation {
  const target = outcome.target;
  if (!target) return {};
  if (target.type === "npc" && outcome.grossDamage > 0) {
    return {
      damage: outcome.grossDamage,
      action: {
        kind: "npcDamage",
        ...actionTargetIdentity(targetIdentity(target)),
        requestedDamage: outcome.grossDamage,
        applied: false
      }
    };
  }
  if (target.type === "character" && outcome.damageEffect !== "none") {
    return {
      damageEffect: outcome.damageEffect,
      stressAmount: outcome.stressAmount,
      action: {
        kind: "characterDamage",
        ...actionTargetIdentity(targetIdentity(target)),
        effect: outcome.damageEffect,
        stressAmount: outcome.stressAmount,
        sourceActorId,
        sourceName: outcome.ability.name,
        applied: false
      }
    };
  }
  return {};
}

export class AbilityChatService {
  readonly #rollChat: RollChatService;

  constructor(rollChat: RollChatService) {
    this.#rollChat = rollChat;
  }

  async publishRoll(
    actor: CombatCharacterLike,
    outcome: AbilityRollOutcome,
    visibility: DifficultyVisibility,
    showGmAudit = false
  ): Promise<void> {
    const successful = outcome.execution.result.success === true;
    const damageCanBePresented = outcome.execution.result.success !== false;
    const consequenceData = successful ? consequence(outcome, actor.id) : {};
    const combat = {
      ...consequenceData,
      ...(damageCanBePresented && outcome.ability.system.roll === "attack"
        ? {
            damage: outcome.grossDamage,
            damageBreakdown: [
              {label: "MAGNUSARCHIVES.Ability.DamageBreakdown.Base", value: outcome.baseDamage},
              ...(outcome.effortDamage
                ? [{label: "MAGNUSARCHIVES.Combat.DamageBreakdown.Effort", value: outcome.effortDamage, additive: true}]
                : []),
              ...(outcome.naturalDamage
                ? [
                    {
                      label: "MAGNUSARCHIVES.Combat.DamageBreakdown.Natural",
                      value: outcome.naturalDamage,
                      additive: true
                    }
                  ]
                : [])
            ]
          }
        : {})
    };
    await this.#rollChat.publish(actor, outcome.execution, visibility, {combat, showGmAudit});
  }

  async publishNoRoll(actor: CombatCharacterLike, outcome: AbilityNoRollOutcome): Promise<void> {
    const targets: readonly (AbilityTargetLike | null)[] = outcome.targets.length ? outcome.targets : [null];
    for (const target of targets) {
      const combat = target
        ? consequence(
            {
              ability: outcome.ability,
              target,
              grossDamage: outcome.ability.system.damage,
              damageEffect: outcome.ability.system.damageEffect,
              stressAmount: outcome.ability.system.stressAmount
            },
            actor.id
          )
        : {};
      const action = combat.action;
      const content = await foundry.applications.handlebars.renderTemplate(
        "systems/magnusarchives/templates/chat/ability-card.hbs",
        {
          abilityName: outcome.ability.name,
          actorName: actor.name,
          ...chatCardActorImageData(actor as unknown as import("./chat-card-presentation").ChatCardActorLike),
          activation: game.i18n.localize(`MAGNUSARCHIVES.Ability.Activation.${outcome.ability.system.activation}`),
          poolLabel: outcome.pool
            ? game.i18n.localize(`MAGNUSARCHIVES.Pools.${outcome.pool[0]!.toUpperCase()}${outcome.pool.slice(1)}`)
            : "",
          costPaid: outcome.costPaid,
          targetName: target?.name ?? "",
          damage: combat.damage,
          damageEffect: combat.damageEffect
            ? game.i18n.localize(`MAGNUSARCHIVES.CharacterDamage.${combat.damageEffect}`)
            : "",
          stressAmount: combat.damageEffect === "stress" ? combat.stressAmount : 0,
          combatAction: Boolean(action),
          combatActionLabel: action
            ? game.i18n.localize(
                action.kind === "npcDamage"
                  ? "MAGNUSARCHIVES.Combat.ApplyDamage"
                  : "MAGNUSARCHIVES.Combat.ApplyCharacterDamage"
              )
            : ""
        }
      );
      const message: Record<string, unknown> = {
        speaker: ChatMessage.getSpeaker({actor: actor as unknown as Actor}),
        content
      };
      if (action) message.flags = {magnusarchives: {combatAction: action}};
      await ChatMessage.create(message);
    }
  }

  async publishPayment(actor: CombatCharacterLike, outcome: AbilityPaymentOutcome): Promise<void> {
    const poolLabel = game.i18n.localize(
      `MAGNUSARCHIVES.Pools.${outcome.pool[0]!.toUpperCase()}${outcome.pool.slice(1)}`
    );
    const content = await foundry.applications.handlebars.renderTemplate(
      "systems/magnusarchives/templates/chat/ability-payment-card.hbs",
      {
        abilityName: outcome.ability.name,
        actorName: actor.name,
        ...chatCardActorImageData(actor as unknown as import("./chat-card-presentation").ChatCardActorLike),
        poolLabel,
        listedCost: outcome.listedCost,
        ignoresEdge: outcome.ignoresEdge,
        edgeApplied: outcome.edgeApplied,
        costPaid: outcome.costPaid,
        currentBefore: outcome.currentBefore,
        currentAfter: outcome.currentAfter
      }
    );
    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({actor: actor as unknown as Actor}),
      content
    });
  }
}
