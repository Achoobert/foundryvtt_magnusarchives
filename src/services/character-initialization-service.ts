import type {
  CoreCharacterSetupRequest,
  CoreCreationMode
} from "../creation/character-creation-types";

export type CharacterInitializationErrorCode =
  | "not-character"
  | "already-initialized"
  | "invalid-pools"
  | "state-not-persisted";

export class CharacterInitializationError extends Error {
  constructor(readonly code: CharacterInitializationErrorCode, message: string) {
    super(message);
    this.name = "CharacterInitializationError";
  }
}

export interface InitializationCharacterLike {
  readonly type: string;
  readonly system: {
    readonly creation: {readonly coreInitialized: boolean; readonly mode: CoreCreationMode};
  };
  readonly sheet?: {render(options?: boolean | Record<string, unknown>): Promise<unknown>} | null;
  update(changes: Record<string, unknown>): Promise<unknown>;
}

export class CharacterInitializationService {
  readonly #now: () => number;

  constructor(now: () => number = Date.now) {
    this.#now = now;
  }

  async setup(
    actor: InitializationCharacterLike,
    request: CoreCharacterSetupRequest
  ): Promise<void> {
    this.#assertAvailable(actor);
    const allocation = Object.values(request.pools);
    if (allocation.some((value) => !Number.isInteger(value) || value < 0)
      || allocation.reduce((sum, value) => sum + value, 0) !== 6) {
      throw new CharacterInitializationError("invalid-pools", "Core Setup must distribute exactly six Pool points.");
    }
    const descriptorLabel = request.descriptorLabel?.trim().replace(/\s+/g, " ") ?? "";
    const arcName = request.arc?.name.trim() ?? "";
    await actor.update({
      "system.tier": 1,
      "system.stats.might.value": 8 + request.pools.might,
      "system.stats.might.baseMax": 8 + request.pools.might,
      "system.stats.might.baseEdge": 0,
      "system.stats.speed.value": 8 + request.pools.speed,
      "system.stats.speed.baseMax": 8 + request.pools.speed,
      "system.stats.speed.baseEdge": 0,
      "system.stats.intellect.value": 8 + request.pools.intellect,
      "system.stats.intellect.baseMax": 8 + request.pools.intellect,
      "system.stats.intellect.baseEdge": 0,
      "system.stats.effortBase": 1,
      "system.cypherLimitBase": 2,
      "system.proficiencies.weaponCategories": ["light"],
      "system.proficiencies.armorCategories": [],
      "system.identity.descriptorLabel": descriptorLabel,
      ...(arcName ? {
        "system.arc.key": request.arc?.key ?? "",
        "system.arc.name": arcName,
        "system.arc.stage": "none",
        "system.arc.stepsCompleted": 0
      } : {}),
      "system.creation": {
        coreInitialized: true,
        mode: "completed",
        initializedAt: this.#now()
      }
    });
    if (!actor.system.creation.coreInitialized) {
      throw new CharacterInitializationError(
        "state-not-persisted",
        "Foundry did not expose the persisted Core initialization state after update."
      );
    }
  }

  async markInitialized(
    actor: InitializationCharacterLike,
    mode: "skipped" | "manual"
  ): Promise<void> {
    if (actor.type !== "character") {
      throw new CharacterInitializationError("not-character", "Core Setup requires a Character.");
    }
    if (actor.system.creation.coreInitialized) return;
    await actor.update({"system.creation": {
      coreInitialized: true,
      mode,
      initializedAt: this.#now()
    }});
    if (!actor.system.creation.coreInitialized) {
      throw new CharacterInitializationError(
        "state-not-persisted",
        "Foundry did not expose the persisted Core initialization state after update."
      );
    }
  }

  #assertAvailable(actor: InitializationCharacterLike): void {
    if (actor.type !== "character") {
      throw new CharacterInitializationError("not-character", "Core Setup requires a Character.");
    }
    if (actor.system.creation.coreInitialized) {
      throw new CharacterInitializationError("already-initialized", "Core Setup has already been finalized.");
    }
  }
}
