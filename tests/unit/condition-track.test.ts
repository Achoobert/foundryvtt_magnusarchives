import {describe, expect, it} from "vitest";
import {
  advanceDamageTrack,
  damageTrackEffects,
  damageTrackSteps,
  healDamageTrack,
  normalizeDamageTrackStep,
  stressAfterRest,
  stressLevel,
  stressToNextLevel
} from "../../src/rules/core/condition-track";

describe("Stress", () => {
  it("is one level for every three points", () => {
    expect(stressLevel(0)).toBe(0);
    expect(stressLevel(2)).toBe(0);
    expect(stressLevel(3)).toBe(1);
    expect(stressLevel(8)).toBe(2);
  });

  it("never reports a negative level", () => {
    expect(stressLevel(-5)).toBe(0);
  });

  it("reports the points left before the next level", () => {
    expect(stressToNextLevel(0)).toBe(3);
    expect(stressToNextLevel(1)).toBe(2);
    expect(stressToNextLevel(3)).toBe(3);
  });

  it("drops one level per hour of rest", () => {
    expect(stressAfterRest(8, 1)).toBe(5);
    expect(stressAfterRest(8, 3)).toBe(0);
    expect(stressAfterRest(8, 0)).toBe(8);
  });
});

describe("damage track", () => {
  it("omits hurt unless the Character has that extra step", () => {
    expect(damageTrackSteps(false)).toEqual(["hale", "impaired", "debilitated", "dead"]);
    expect(damageTrackSteps(true)).toEqual(["hale", "hurt", "impaired", "debilitated", "dead"]);
  });

  it("falls back to hale for an unavailable step", () => {
    expect(normalizeDamageTrackStep("hurt", false)).toBe("hale");
    expect(normalizeDamageTrackStep("hurt", true)).toBe("hurt");
    expect(normalizeDamageTrackStep("nonsense", true)).toBe("hale");
  });

  it("moves down one step per serious injury", () => {
    expect(advanceDamageTrack("hale", false)).toBe("impaired");
    expect(advanceDamageTrack("hale", true)).toBe("hurt");
    expect(advanceDamageTrack("impaired", false, 2)).toBe("dead");
  });

  it("clamps at dead and at hale", () => {
    expect(advanceDamageTrack("dead", true, 3)).toBe("dead");
    expect(healDamageTrack("hale", true, 3)).toBe("hale");
    expect(healDamageTrack("debilitated", false)).toBe("impaired");
  });

  it("applies no penalty for being hurt", () => {
    expect(damageTrackEffects("hurt")).toEqual(damageTrackEffects("hale"));
  });

  it("surcharges Effort and suppresses special results when impaired", () => {
    const effects = damageTrackEffects("impaired");
    expect(effects.effortSurcharge).toBe(1);
    expect(effects.ignoresSpecialEffects).toBe(true);
    expect(effects.reducedSpecialDamage).toBe(true);
    expect(effects.moveOnly).toBe(false);
  });

  it("restricts a debilitated Character to movement, and reports dead", () => {
    expect(damageTrackEffects("debilitated").moveOnly).toBe(true);
    expect(damageTrackEffects("debilitated").dead).toBe(false);
    expect(damageTrackEffects("dead").dead).toBe(true);
  });
});
