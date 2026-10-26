import {describe, expect, it} from "vitest";

import type {CoreCharacterSetupRequest} from "../../src/creation/character-creation-types";
import {
  CharacterInitializationService,
  type InitializationCharacterLike
} from "../../src/services/character-initialization-service";

function setPath(target: Record<string, unknown>, path: string, value: unknown): void {
  const parts = path.split(".");
  let cursor = target;
  for (const part of parts.slice(0, -1)) {
    if (!cursor[part]) cursor[part] = {};
    cursor = cursor[part] as Record<string, unknown>;
  }
  cursor[parts.at(-1)!] = value;
}

class TestCharacter implements InitializationCharacterLike {
  readonly type = "character";
  readonly updates: Record<string, unknown>[] = [];
  failUpdate = false;
  system = {
    creation: {coreInitialized: false, mode: "uninitialized" as const, initializedAt: 0},
    identity: {descriptorLabel: ""},
    arc: {key: "", name: "", stage: "none", stepsCompleted: 0, notes: ""},
    marker: "preserve"
  };

  async update(changes: Record<string, unknown>): Promise<unknown> {
    if (this.failUpdate) throw new Error("Injected failure");
    this.updates.push(changes);
    for (const [path, value] of Object.entries(changes)) {
      setPath(this.system as unknown as Record<string, unknown>, path.replace(/^system\./, ""), value);
    }
    return this;
  }
}

const request: CoreCharacterSetupRequest = {pools: {might: 2, speed: 4, intellect: 0}};

describe("CharacterInitializationService", () => {
  it("finalizes base 8 Pools plus exactly six points and all Core defaults", async () => {
    const actor = new TestCharacter();
    await new CharacterInitializationService(() => 1234).setup(actor, request);
    expect(actor.updates[0]).toMatchObject({
      "system.tier": 1,
      "system.stats.might.value": 10,
      "system.stats.might.baseMax": 10,
      "system.stats.speed.value": 12,
      "system.stats.intellect.value": 8,
      "system.stats.might.baseEdge": 0,
      "system.stats.speed.baseEdge": 0,
      "system.stats.intellect.baseEdge": 0,
      "system.stats.effortBase": 1,
      "system.cypherLimitBase": 2,
      "system.proficiencies.weaponCategories": ["light"],
      "system.proficiencies.armorCategories": [],
      "system.creation": {coreInitialized: true, mode: "completed", initializedAt: 1234}
    });
  });

  it("blocks an invalid allocation before updating the Actor", async () => {
    const actor = new TestCharacter();
    await expect(
      new CharacterInitializationService().setup(actor, {
        pools: {might: 2, speed: 2, intellect: 1}
      })
    ).rejects.toMatchObject({code: "invalid-pools"});
    await expect(
      new CharacterInitializationService().setup(actor, {
        pools: {might: 7, speed: -1, intellect: 0}
      })
    ).rejects.toMatchObject({code: "invalid-pools"});
    expect(actor.updates).toEqual([]);
  });

  it("stores the custom Descriptor word, trimmed", async () => {
    const actor = new TestCharacter();
    await new CharacterInitializationService().setup(actor, {...request, descriptorLabel: "  Pretentious  "});
    expect(actor.system.identity.descriptorLabel).toBe("Pretentious");
  });

  it("stores the chosen Character Arc and resets its progress", async () => {
    const actor = new TestCharacter();
    actor.system.arc.stage = "climax";
    actor.system.arc.stepsCompleted = 3;
    await new CharacterInitializationService().setup(actor, {
      ...request,
      arc: {key: "solve-a-mystery", name: "Solve a Mystery"}
    });
    expect(actor.system.arc).toMatchObject({
      key: "solve-a-mystery",
      name: "Solve a Mystery",
      stage: "none",
      stepsCompleted: 0
    });
  });

  it("leaves the arc untouched when none is chosen", async () => {
    const actor = new TestCharacter();
    await new CharacterInitializationService().setup(actor, request);
    expect(Object.keys(actor.updates[0]!).some((key) => key.startsWith("system.arc"))).toBe(false);
  });

  it("is idempotent and never overwrites an initialized Character", async () => {
    const actor = new TestCharacter();
    const service = new CharacterInitializationService();
    await service.setup(actor, request);
    const snapshot = structuredClone(actor.system);
    await expect(service.setup(actor, request)).rejects.toMatchObject({code: "already-initialized"});
    expect(actor.system).toEqual(snapshot);
  });

  it("keeps coreInitialized after close/reopen and a serialized reload", async () => {
    const actor = new TestCharacter();
    await new CharacterInitializationService(() => 5678).setup(actor, request);

    const reopenedCreation = actor.system.creation;
    const reloadedSystem = structuredClone(actor.system);

    expect(reopenedCreation).toEqual({coreInitialized: true, mode: "completed", initializedAt: 5678});
    expect(reloadedSystem.creation).toEqual({coreInitialized: true, mode: "completed", initializedAt: 5678});
  });

  it("does not mark the Character initialized if the Actor update fails", async () => {
    const actor = new TestCharacter();
    actor.failUpdate = true;
    await expect(new CharacterInitializationService().setup(actor, request)).rejects.toThrow();
    expect(actor.system.creation.coreInitialized).toBe(false);
  });

  it.each(["skipped", "manual"] as const)("supports GM %s initialization without resetting data", async (mode) => {
    const actor = new TestCharacter();
    await new CharacterInitializationService(() => 99).markInitialized(actor, mode);
    expect(actor.system).toMatchObject({
      marker: "preserve",
      creation: {coreInitialized: true, mode, initializedAt: 99}
    });
  });
});
