import type {CharacterDamageEffect, DefenseType} from "../constants/system";
import type {DefenseRequestData, RollChatCombatPresentation} from "../combat/combat-chat-types";
import {actionTargetIdentity} from "../combat/combat-chat-types";
import {combatTargetIdentity, type NpcTargetLike} from "../combat/combat-types";
import {targetIdentityFromDocument} from "../combat/combat-targets";
import type {RollExecution} from "../rolls/roll-types";
import type {CombatCharacterLike, DefenseWoundResolution, WeaponAttackOutcome} from "./combat-service";
import {ShieldService} from "./shield-service";
import type {DifficultyVisibility} from "./roll-chat-service";
import {RollChatService} from "./roll-chat-service";
import {chatCardActorImageData} from "./chat-card-presentation";

export class CombatChatService {
  readonly #rollChat: RollChatService;
  readonly #shields: ShieldService | undefined;

  constructor(rollChat: RollChatService, shields?: ShieldService) {
    this.#rollChat = rollChat;
    this.#shields = shields;
  }

  async publishWeaponAttack(
    actor: CombatCharacterLike,
    outcome: WeaponAttackOutcome,
    visibility: DifficultyVisibility,
    showGmAudit = false
  ): Promise<void> {
    const successful = outcome.execution.result.success === true;
    const damageCanBePresented = outcome.execution.result.success !== false;
    const combat: RollChatCombatPresentation = {
      ...(damageCanBePresented
        ? {
            damage: outcome.grossDamage,
            damageBreakdown: [
              {label: "MAGNUSARCHIVES.Combat.DamageBreakdown.Category", value: outcome.categoryDamage},
              ...(outcome.weaponBonusDamage === 0
                ? []
                : [
                    {
                      label: "MAGNUSARCHIVES.Combat.DamageBreakdown.WeaponBonus",
                      value: outcome.weaponBonusDamage,
                      additive: true
                    }
                  ]),
              ...(outcome.effortDamage === 0
                ? []
                : [
                    {
                      label: "MAGNUSARCHIVES.Combat.DamageBreakdown.Effort",
                      value: outcome.effortDamage,
                      additive: true
                    }
                  ]),
              ...(outcome.naturalDamage === 0
                ? []
                : [
                    {
                      label: "MAGNUSARCHIVES.Combat.DamageBreakdown.Natural",
                      value: outcome.naturalDamage,
                      additive: true
                    }
                  ])
            ]
          }
        : {}),
      ...(successful && outcome.target
        ? {
            action: {
              kind: "npcDamage",
              ...actionTargetIdentity(combatTargetIdentity(outcome.target)),
              requestedDamage: outcome.grossDamage,
              applied: false
            }
          }
        : {})
    };
    await this.#rollChat.publish(actor, outcome.execution, visibility, {combat, showGmAudit});
  }

  async publishDefense(
    actor: CombatCharacterLike,
    execution: RollExecution,
    resolution: DefenseWoundResolution,
    source: NpcTargetLike | null,
    visibility: DifficultyVisibility,
    showGmAudit = false
  ): Promise<void> {
    const targetIdentity = actionTargetIdentity(targetIdentityFromDocument(actor));
    const sourceData = source ? {sourceActorId: source.id, sourceName: source.name} : {};
    const combat: RollChatCombatPresentation = {
      ...(resolution.recipient === "character"
        ? {
            damageEffect: resolution.effect,
            stressAmount: resolution.stressAmount,
            action: {
              kind: "characterDamage" as const,
              ...targetIdentity,
              effect: resolution.effect,
              stressAmount: resolution.stressAmount,
              ...sourceData,
              applied: false
            }
          }
        : {}),
      ...(resolution.recipient === "shield"
        ? {
            shieldTransfer: {
              shieldName: resolution.shieldName,
              severity: resolution.severity
            },
            action: {
              kind: "shieldWound" as const,
              ...targetIdentity,
              shieldId: resolution.shieldId,
              shieldName: resolution.shieldName,
              severity: resolution.severity,
              ...sourceData,
              applied: false
            }
          }
        : {})
    };
    await this.#rollChat.publish(actor, execution, visibility, {combat, showGmAudit});
  }

  async createDefenseRequest(
    source: NpcTargetLike,
    target: CombatCharacterLike,
    effect: Exclude<CharacterDamageEffect, "none">,
    stressAmount: number,
    allowedDefenses: readonly DefenseType[]
  ): Promise<void> {
    const sourceIdentity = combatTargetIdentity(source);
    const targetIdentity = targetIdentityFromDocument(target);
    const defenses = [...allowedDefenses];
    if (this.#shields && defenses.includes("block") && !defenses.includes("blockWithShield")) {
      const shield = await this.#shields.normalizeEquipped(target);
      if (shield && !this.#shields.isBroken(shield)) defenses.push("blockWithShield");
    }
    const request: DefenseRequestData = {
      kind: "defenseRequest",
      sourceActorId: source.id,
      ...(sourceIdentity.actorUuid ? {sourceActorUuid: sourceIdentity.actorUuid} : {}),
      ...(sourceIdentity.tokenId ? {sourceTokenId: sourceIdentity.tokenId} : {}),
      ...(sourceIdentity.tokenUuid ? {sourceTokenUuid: sourceIdentity.tokenUuid} : {}),
      sourceName: source.name,
      targetActorId: target.id,
      ...(targetIdentity.actorUuid ? {targetActorUuid: targetIdentity.actorUuid} : {}),
      ...(targetIdentity.tokenId ? {targetTokenId: targetIdentity.tokenId} : {}),
      ...(targetIdentity.tokenUuid ? {targetTokenUuid: targetIdentity.tokenUuid} : {}),
      targetName: target.name,
      effect,
      stressAmount,
      allowedDefenses: defenses,
      resolved: false
    };
    const content = await foundry.applications.handlebars.renderTemplate(
      "systems/magnusarchives/templates/chat/defense-request-card.hbs",
      {
        sourceName: source.name,
        ...chatCardActorImageData(source as unknown as import("./chat-card-presentation").ChatCardActorLike),
        targetName: target.name,
        damageEffect: game.i18n.localize(`MAGNUSARCHIVES.CharacterDamage.${effect}`),
        stressAmount: effect === "stress" ? stressAmount : 0,
        allowBlock: defenses.includes("block"),
        allowBlockWithShield: defenses.includes("blockWithShield"),
        allowDodge: defenses.includes("dodge")
      }
    );
    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({actor: source as unknown as Actor}),
      content,
      flags: {magnusarchives: {defenseRequest: request}}
    });
  }
}
