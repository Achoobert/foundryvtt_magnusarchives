import {
  DAMAGE_TRACK_STEPS,
  STRESS_POINTS_PER_LEVEL,
  type DamageTrackStep
} from "../../constants/system";

/**
 * The Magnus Archives condition rules: Stress and the damage track (p12, p132).
 *
 * PCs do not take Pool damage from attacks. They accumulate Stress, and serious
 * injuries move them down the damage track. Every 3 points of Stress is one
 * Stress Level, and each Stress Level hinders every task.
 */

/** Steps available to a Character who does not have the extra "hurt" step. */
export const BASE_DAMAGE_TRACK_STEPS: readonly DamageTrackStep[] = DAMAGE_TRACK_STEPS.filter(
  (step) => step !== "hurt"
);

export function damageTrackSteps(hurtAvailable: boolean): readonly DamageTrackStep[] {
  return hurtAvailable ? DAMAGE_TRACK_STEPS : BASE_DAMAGE_TRACK_STEPS;
}

export function stressLevel(points: number): number {
  return Math.floor(Math.max(0, points) / STRESS_POINTS_PER_LEVEL);
}

/** Points still needed before the next Stress Level lands. */
export function stressToNextLevel(points: number): number {
  const remainder = Math.max(0, points) % STRESS_POINTS_PER_LEVEL;
  return remainder === 0 ? STRESS_POINTS_PER_LEVEL : STRESS_POINTS_PER_LEVEL - remainder;
}

/** Resting reduces Stress by 3 points — one level — for each hour (p12). */
export function stressAfterRest(points: number, hours: number): number {
  return Math.max(0, Math.max(0, points) - Math.max(0, Math.floor(hours)) * STRESS_POINTS_PER_LEVEL);
}

export function normalizeDamageTrackStep(
  step: unknown,
  hurtAvailable: boolean
): DamageTrackStep {
  const available = damageTrackSteps(hurtAvailable);
  return available.includes(step as DamageTrackStep) ? (step as DamageTrackStep) : "hale";
}

/** Moves `steps` places down the track, clamped at dead. */
export function advanceDamageTrack(
  step: DamageTrackStep,
  hurtAvailable: boolean,
  steps = 1
): DamageTrackStep {
  const available = damageTrackSteps(hurtAvailable);
  const current = available.indexOf(normalizeDamageTrackStep(step, hurtAvailable));
  const next = Math.min(available.length - 1, current + Math.max(0, steps));
  return available[next] ?? "dead";
}

/** Moves `steps` places back up the track, clamped at hale. */
export function healDamageTrack(
  step: DamageTrackStep,
  hurtAvailable: boolean,
  steps = 1
): DamageTrackStep {
  const available = damageTrackSteps(hurtAvailable);
  const current = available.indexOf(normalizeDamageTrackStep(step, hurtAvailable));
  const next = Math.max(0, current - Math.max(0, steps));
  return available[next] ?? "hale";
}

export interface DamageTrackEffects {
  /** Extra Pool points every level of Effort costs (impaired and below). */
  readonly effortSurcharge: number;
  /** Impaired characters ignore minor and major effect results. */
  readonly ignoresSpecialEffects: boolean;
  /** Impaired characters deal only +1 damage on a combat roll of 17-20. */
  readonly reducedSpecialDamage: boolean;
  /** Debilitated characters may only move an immediate distance. */
  readonly moveOnly: boolean;
  readonly dead: boolean;
}

const HALE_EFFECTS: DamageTrackEffects = Object.freeze({
  effortSurcharge: 0,
  ignoresSpecialEffects: false,
  reducedSpecialDamage: false,
  moveOnly: false,
  dead: false
});

const IMPAIRED_EFFECTS: DamageTrackEffects = Object.freeze({
  effortSurcharge: 1,
  ignoresSpecialEffects: true,
  reducedSpecialDamage: true,
  moveOnly: false,
  dead: false
});

const DEBILITATED_EFFECTS: DamageTrackEffects = Object.freeze({
  ...IMPAIRED_EFFECTS,
  moveOnly: true
});

const DEAD_EFFECTS: DamageTrackEffects = Object.freeze({
  ...DEBILITATED_EFFECTS,
  dead: true
});

/** "There are no penalties associated with being hurt." (p12) */
export function damageTrackEffects(step: DamageTrackStep): DamageTrackEffects {
  switch (step) {
    case "impaired":
      return IMPAIRED_EFFECTS;
    case "debilitated":
      return DEBILITATED_EFFECTS;
    case "dead":
      return DEAD_EFFECTS;
    case "hurt":
    case "hale":
    default:
      return HALE_EFFECTS;
  }
}
