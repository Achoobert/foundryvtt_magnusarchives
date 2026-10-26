import {describe, expect, it, vi} from "vitest";

import {registerCoreRuleModule} from "../../src/rules/core-rule-module";
import {RuleRegistry} from "../../src/rules/rule-registry";
import type {RollResult} from "../../src/rolls/roll-types";
import {CombatService, type CombatCharacterLike} from "../../src/services/combat-service";
import type {CombatFeedbackService} from "../../src/services/combat-feedback-service";
import {ConditionService} from "../../src/services/condition-service";
import {RollService} from "../../src/services/roll-service";
import {ShieldService, type ShieldItemLike} from "../../src/services/shield-service";
import {SkillService} from "../../src/services/skill-service";
import {TargetResolver} from "../../src/services/target-resolver";
import {WoundService} from "../../src/services/wound-service";
import {character, wounds} from "../helpers/core-fixtures";

function shield(equipped = true, major = 0): ShieldItemLike {
  return {
    id: "shield-1",
    name: "Round Shield",
    type: "shield",
    system: {
      equipped,
      wounds: wounds({major}),
      derived: {capacities: {minor: 3, moderate: 2, major: 1}, broken: major > 0},
      description: ""
    },
    async update(changes): Promise<unknown> {
      if (changes["system.wounds"]) {
        (this.system as {wounds: ReturnType<typeof wounds>}).wounds = changes["system.wounds"] as ReturnType<
          typeof wounds
        >;
      }
      if (typeof changes["system.equipped"] === "boolean") {
        (this.system as {equipped: boolean}).equipped = changes["system.equipped"] as boolean;
      }
      return this;
    }
  };
}

function result(success: boolean): RollResult {
  return {success} as RollResult;
}

function setup(items: ShieldItemLike[] = []) {
  const base = character();
  const actor = Object.assign(base, {
    items,
    tokenId: "character-token",
    tokenUuid: "Scene.scene.Token.character-token"
  }) as unknown as CombatCharacterLike;
  const rules = new RuleRegistry();
  registerCoreRuleModule(rules);
  const woundsService = new WoundService(() => "shield-wound");
  const shieldService = new ShieldService(woundsService);
  const shieldWound = vi.fn(async () => undefined);
  const feedback: CombatFeedbackService = {
    npcDamage: vi.fn(async () => undefined),
    characterWound: vi.fn(async () => undefined),
    shieldWound
  };
  const rolls = new RollService(rules, async () => ({naturalRoll: 12}));
  return {
    actor,
    shieldWound,
    combat: new CombatService(
      rules,
      rolls,
      new SkillService(rules),
      new TargetResolver(rules),
      woundsService,
      new ConditionService(),
      feedback,
      undefined,
      shieldService
    )
  };
}

describe("Block with Shield", () => {
  it("keeps normal Block and Dodge behavior unchanged", () => {
    const {actor, combat} = setup();
    expect(combat.damageAfterDefense(result(true), "seriousInjury")).toBe("none");
    expect(combat.damageAfterDefense(result(true), "stress")).toBe("none");
    expect(combat.damageAfterDefense(result(false), "seriousInjury")).toBe("seriousInjury");
    expect(actor.system.wounds.major).toHaveLength(0);
  });

  it("builds Block With Shield as a Might defense with Block contributions", () => {
    const item = shield();
    const {actor, combat} = setup([item]);
    const request = combat.buildDefenseRequest(actor, "blockWithShield", {
      difficulty: {mode: "hidden", value: 4}
    });
    expect(request.pool).toBe("might");
    expect(request.tags).toContain("defense.block");
    expect(request.origin).toMatchObject({kind: "defense", defenseType: "blockWithShield"});
  });

  it.each([
    ["stress", "minor"],
    ["seriousInjury", "major"]
  ] as const)("defers a %s to the Shield after a successful Block With Shield", async (effect, severity) => {
    const item = shield();
    const {actor, combat, shieldWound} = setup([item]);
    const before = structuredClone(actor.system.wounds);
    const resolution = await combat.resolveDefenseDamage(actor, result(true), "blockWithShield", effect, 3, {
      id: "npc-1",
      name: "Sentinel"
    });
    expect(resolution).toMatchObject({
      recipient: "shield",
      severity,
      shieldId: item.id,
      shieldName: item.name
    });
    expect(item.system.wounds[severity]).toHaveLength(0);
    expect(actor.system.wounds).toEqual(before);
    expect(shieldWound).not.toHaveBeenCalled();

    const applied = await combat.applyShieldWound(actor, item, severity, {id: "npc-1", name: "Sentinel"});
    expect(applied.requestedSeverity).toBe(severity);
    expect(item.system.wounds[severity]).toHaveLength(1);
    expect(actor.system.wounds).toEqual(before);
    expect(shieldWound).toHaveBeenCalledWith(actor, "Round Shield", severity, severity === "major");
  });

  it("applies the damage to the Character and nothing to the Shield after failure", async () => {
    const item = shield();
    const {actor, combat, shieldWound} = setup([item]);
    const resolution = await combat.resolveDefenseDamage(actor, result(false), "blockWithShield", "seriousInjury", 0, {
      id: "npc-1",
      name: "Sentinel"
    });
    expect(resolution).toEqual({recipient: "character", effect: "seriousInjury", stressAmount: 0});
    expect(item.system.wounds).toEqual(wounds());
    expect(shieldWound).not.toHaveBeenCalled();
  });

  it("resolves a successful normal Block and Dodge to no recipient", async () => {
    const {actor, combat} = setup();
    await expect(combat.resolveDefenseDamage(actor, result(true), "block", "seriousInjury", 0)).resolves.toEqual({
      recipient: "none"
    });
    await expect(combat.resolveDefenseDamage(actor, result(true), "dodge", "seriousInjury", 0)).resolves.toEqual({
      recipient: "none"
    });
    await expect(combat.resolveDefenseDamage(actor, result(false), "block", "stress", 2)).resolves.toEqual({
      recipient: "character",
      effect: "stress",
      stressAmount: 2
    });
  });

  it("rejects a successful Block With Shield without a functional equipped Shield", async () => {
    const broken = shield(true, 1);
    const brokenSetup = setup([broken]);
    await expect(
      brokenSetup.combat.resolveDefenseDamage(brokenSetup.actor, result(true), "blockWithShield", "stress", 1)
    ).rejects.toThrow("functional Shield");

    const stored = shield(false);
    const storedSetup = setup([stored]);
    await expect(
      storedSetup.combat.resolveDefenseDamage(storedSetup.actor, result(true), "blockWithShield", "stress", 1)
    ).rejects.toThrow("functional Shield");
  });
});
