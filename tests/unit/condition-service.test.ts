import {describe, expect, it} from "vitest";
import {ConditionService} from "../../src/services/condition-service";
import {character} from "../helpers/core-fixtures";

describe("ConditionService Stress", () => {
  it("accumulates Stress and reports the level crossed", async () => {
    const actor = character();
    const service = new ConditionService();

    const first = await service.applyStress(actor as never, 2);
    expect(first).toMatchObject({value: 2, level: 0, levelsGained: 0});

    const second = await service.applyStress(actor as never, 2);
    expect(second).toMatchObject({previousValue: 2, value: 4, level: 1, levelsGained: 1});
  });

  it("never drops below zero", async () => {
    const actor = character({stress: 2});
    const service = new ConditionService();
    expect(await service.relieveStress(actor as never, 5)).toMatchObject({value: 0, level: 0});
  });

  it("removes one Stress Level per hour of rest", async () => {
    const actor = character({stress: 8});
    const service = new ConditionService();
    expect(await service.restStress(actor as never, 2)).toMatchObject({value: 2, level: 0});
  });

  it("rejects a negative amount", async () => {
    const service = new ConditionService();
    await expect(service.applyStress(character() as never, -1)).rejects.toThrow("non-negative");
  });

  it("hinders every task once a level is reached", async () => {
    const actor = character();
    await new ConditionService().applyStress(actor as never, 6);
    expect(actor.system.derived.stress.level).toBe(2);
    expect(actor.system.derived.totalHindrance).toBe(2);
  });
});

describe("ConditionService damage track", () => {
  it("moves one step down per serious injury", async () => {
    const actor = character();
    const service = new ConditionService();
    expect(await service.applySeriousInjury(actor as never)).toMatchObject({
      previousStep: "hale",
      step: "impaired",
      dead: false
    });
    expect(await service.applySeriousInjury(actor as never)).toMatchObject({step: "debilitated"});
    expect(await service.applySeriousInjury(actor as never)).toMatchObject({step: "dead", dead: true});
  });

  it("uses the extra hurt step when the Character has it", async () => {
    const actor = character({hurtAvailable: true});
    const service = new ConditionService();
    expect(await service.applySeriousInjury(actor as never)).toMatchObject({step: "hurt"});
  });

  it("heals back up the track", async () => {
    const actor = character({damageTrackStep: "debilitated"});
    const service = new ConditionService();
    expect(await service.healDamageTrack(actor as never, 2)).toMatchObject({step: "hale"});
  });

  it("surcharges Effort once impaired", async () => {
    const actor = character();
    await new ConditionService().applySeriousInjury(actor as never);
    expect(actor.system.derived.damageTrack.effortSurcharge).toBe(1);
    expect(actor.system.derived.damageTrack.ignoresSpecialEffects).toBe(true);
  });
});

describe("Rest and Stress", () => {
  it("removes 3 points of Stress per hour of rest", async () => {
    const {RestService} = await import("../../src/services/rest-service");
    const service = new RestService();
    expect(service.stressRelief("10-minutes")).toBe(0);
    expect(service.stressRelief("1-hour")).toBe(3);
    expect(service.stressRelief("10-hours")).toBe(30);
  });

  it("applies the relief to the Character", async () => {
    const {RestService} = await import("../../src/services/rest-service");
    const actor = character({stress: 8});
    const result = await new RestService().apply(actor as never, "1-hour");
    expect(result).toMatchObject({stressBefore: 8, stress: 5});
    expect(actor.system.stress.value).toBe(5);
    expect(actor.system.derived.stress.level).toBe(1);
  });

  it("leaves Stress alone after a ten-minute break", async () => {
    const {RestService} = await import("../../src/services/rest-service");
    const actor = character({stress: 4});
    const result = await new RestService().apply(actor as never, "10-minutes");
    expect(result.stress).toBe(4);
  });
});
