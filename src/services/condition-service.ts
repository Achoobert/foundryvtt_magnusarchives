import {STRESS_POINTS_PER_LEVEL, type DamageTrackStep} from "../constants/system";
import {
  advanceDamageTrack,
  healDamageTrack,
  normalizeDamageTrackStep,
  stressAfterRest,
  stressLevel
} from "../rules/core/condition-track";
import {assertCharacter, type CharacterDocumentLike} from "../rules/core/core-types";

/**
 * Applies The Magnus Archives condition rules to a Character: Stress points and
 * movement along the damage track (p12, p132).
 *
 * PCs never take Pool damage from an attack. A minor wound or a shock is Stress;
 * a serious injury moves the Character one step down the damage track.
 */

export interface StressResult {
  previousValue: number;
  value: number;
  previousLevel: number;
  level: number;
  levelsGained: number;
}

export interface DamageTrackResult {
  previousStep: DamageTrackStep;
  step: DamageTrackStep;
  steps: number;
  dead: boolean;
}

function nonNegativeInteger(value: number, label: string): number {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`${label} must be a non-negative integer.`);
  }
  return value;
}

export class ConditionService {
  /** Adds Stress points. Returns the new total and any Stress Levels crossed. */
  async applyStress(actor: CharacterDocumentLike, points: number): Promise<StressResult> {
    assertCharacter(actor);
    nonNegativeInteger(points, "Stress");
    return this.#setStress(actor, actor.system.stress.value + points);
  }

  /** Removes Stress points, never dropping below zero. */
  async relieveStress(actor: CharacterDocumentLike, points: number): Promise<StressResult> {
    assertCharacter(actor);
    nonNegativeInteger(points, "Stress");
    return this.#setStress(actor, actor.system.stress.value - points);
  }

  /** Rest removes 3 points of Stress — one level — for each hour (p12). */
  async restStress(actor: CharacterDocumentLike, hours: number): Promise<StressResult> {
    assertCharacter(actor);
    nonNegativeInteger(hours, "Hours of rest");
    return this.#setStress(actor, stressAfterRest(actor.system.stress.value, hours));
  }

  async setStress(actor: CharacterDocumentLike, points: number): Promise<StressResult> {
    assertCharacter(actor);
    nonNegativeInteger(points, "Stress");
    return this.#setStress(actor, points);
  }

  /** A serious injury moves the Character down the damage track. */
  async applySeriousInjury(actor: CharacterDocumentLike, steps = 1): Promise<DamageTrackResult> {
    assertCharacter(actor);
    nonNegativeInteger(steps, "Damage track steps");
    const {step: previousStep, hurtAvailable} = this.#track(actor);
    return this.#setStep(actor, previousStep, advanceDamageTrack(previousStep, hurtAvailable, steps));
  }

  /** Recovery moves the Character back up the damage track. */
  async healDamageTrack(actor: CharacterDocumentLike, steps = 1): Promise<DamageTrackResult> {
    assertCharacter(actor);
    nonNegativeInteger(steps, "Damage track steps");
    const {step: previousStep, hurtAvailable} = this.#track(actor);
    return this.#setStep(actor, previousStep, healDamageTrack(previousStep, hurtAvailable, steps));
  }

  async setDamageTrackStep(actor: CharacterDocumentLike, step: DamageTrackStep): Promise<DamageTrackResult> {
    assertCharacter(actor);
    const {step: previousStep, hurtAvailable} = this.#track(actor);
    return this.#setStep(actor, previousStep, normalizeDamageTrackStep(step, hurtAvailable));
  }

  #track(actor: CharacterDocumentLike): {step: DamageTrackStep; hurtAvailable: boolean} {
    const hurtAvailable = actor.system.derived.damageTrack.hurtAvailable;
    return {
      step: normalizeDamageTrackStep(actor.system.damageTrack.step, hurtAvailable),
      hurtAvailable
    };
  }

  async #setStress(actor: CharacterDocumentLike, next: number): Promise<StressResult> {
    const previousValue = actor.system.stress.value;
    const value = Math.max(0, next);
    if (value !== previousValue) await actor.update({"system.stress.value": value});
    const previousLevel = stressLevel(previousValue);
    const level = stressLevel(value);
    return {
      previousValue,
      value,
      previousLevel,
      level,
      levelsGained: Math.max(0, level - previousLevel)
    };
  }

  async #setStep(
    actor: CharacterDocumentLike,
    previousStep: DamageTrackStep,
    step: DamageTrackStep
  ): Promise<DamageTrackResult> {
    if (step !== previousStep) await actor.update({"system.damageTrack.step": step});
    const available = actor.system.derived.damageTrack.steps;
    return {
      previousStep,
      step,
      steps: Math.abs(available.indexOf(step) - available.indexOf(previousStep)),
      dead: step === "dead"
    };
  }
}

export {STRESS_POINTS_PER_LEVEL};
