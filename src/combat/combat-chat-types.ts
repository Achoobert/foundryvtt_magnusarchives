import type {CharacterDamageEffect, DefenseType, WoundSeverity} from "../constants/system";
import type {CombatTargetIdentity} from "./combat-types";

export type CombatOutcomeAction =
  | {
      readonly kind: "npcDamage";
      readonly targetActorId: string;
      readonly targetActorUuid?: string;
      readonly targetTokenId?: string;
      readonly targetTokenUuid?: string;
      readonly requestedDamage: number;
      readonly applied: boolean;
    }
  | {
      readonly kind: "characterDamage";
      readonly targetActorId: string;
      readonly targetActorUuid?: string;
      readonly targetTokenId?: string;
      readonly targetTokenUuid?: string;
      /** PCs take Stress or a serious injury, never Pool damage (p12). */
      readonly effect: Exclude<CharacterDamageEffect, "none">;
      readonly stressAmount: number;
      readonly sourceActorId?: string;
      readonly sourceName?: string;
      readonly applied: boolean;
    }
  | {
      readonly kind: "shieldWound";
      readonly targetActorId: string;
      readonly targetActorUuid?: string;
      readonly targetTokenId?: string;
      readonly targetTokenUuid?: string;
      readonly shieldId: string;
      readonly shieldName: string;
      readonly severity: WoundSeverity;
      readonly sourceActorId?: string;
      readonly sourceName?: string;
      readonly applied: boolean;
    };

export interface DefenseRequestData {
  readonly kind: "defenseRequest";
  readonly sourceActorId: string;
  readonly sourceActorUuid?: string;
  readonly sourceTokenId?: string;
  readonly sourceTokenUuid?: string;
  readonly sourceName: string;
  readonly targetActorId: string;
  readonly targetActorUuid?: string;
  readonly targetTokenId?: string;
  readonly targetTokenUuid?: string;
  readonly targetName: string;
  readonly effect: Exclude<CharacterDamageEffect, "none">;
  readonly stressAmount: number;
  readonly allowedDefenses: readonly DefenseType[];
  readonly resolved: boolean;
}

export function actionTargetIdentity(
  target: CombatTargetIdentity
): Pick<CombatOutcomeAction, "targetActorId"> & Record<string, string> {
  return {
    targetActorId: target.actorId,
    ...(target.actorUuid ? {targetActorUuid: target.actorUuid} : {}),
    ...(target.tokenId ? {targetTokenId: target.tokenId} : {}),
    ...(target.tokenUuid ? {targetTokenUuid: target.tokenUuid} : {})
  };
}

export interface RollChatCombatPresentation {
  readonly damage?: number;
  readonly damageBreakdown?: readonly {
    readonly label: string;
    readonly value: number;
    /** Present this resolved contribution as additive without changing its value. */
    readonly additive?: boolean;
  }[];
  readonly damageEffect?: Exclude<CharacterDamageEffect, "none">;
  readonly stressAmount?: number;
  readonly action?: CombatOutcomeAction;
  readonly shieldTransfer?: {
    readonly shieldName: string;
    readonly severity: WoundSeverity;
  };
}
