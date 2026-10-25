import {describe, expect, it, vi} from "vitest";

import {
  GENRE_COMPENDIUM_INDEX_FIELDS,
  genreCompendiumPackId,
  prepareCharacterGenreCompendiumIndexes,
  registerGenreCompendiumIndexFields
} from "../../src/genre/genre-compendium-index";

function actor(sourceUuid: string, type = "character") {
  return {
    type,
    system: {genre: {sourceUuid, instanceId: "genre", provenance: "manual" as const, attachedAt: 1}},
    reset: vi.fn()
  };
}

describe("Genre Compendium index preparation", () => {
  it("registers the required Genre option exactly once", () => {
    const fields = ["name"];
    registerGenreCompendiumIndexFields(fields);
    registerGenreCompendiumIndexFields(fields);
    expect(fields).toEqual(["name", ...GENRE_COMPENDIUM_INDEX_FIELDS]);
  });

  it("recognizes only canonical Compendium Item UUIDs", () => {
    expect(genreCompendiumPackId("Compendium.magnusarchives.genres.Item.superhero"))
      .toBe("magnusarchives.genres");
    expect(genreCompendiumPackId("Item.world-genre")).toBeNull();
    expect(genreCompendiumPackId("Compendium.magnusarchives.genres.Actor.superhero")).toBeNull();
  });

  it("enriches each referenced pack once and reprepares affected Characters", async () => {
    const first = actor("Compendium.magnusarchives.genres.Item.first");
    const second = actor("Compendium.magnusarchives.genres.Item.second");
    const world = actor("Item.world-genre");
    const npc = actor("Compendium.magnusarchives.genres.Item.npc", "npc");
    const getIndex = vi.fn(async () => undefined);
    const packs = {get: vi.fn(() => ({getIndex}))};

    await prepareCharacterGenreCompendiumIndexes([first, second, world, npc], packs);

    expect(packs.get).toHaveBeenCalledOnce();
    expect(packs.get).toHaveBeenCalledWith("magnusarchives.genres");
    expect(getIndex).toHaveBeenCalledWith({fields: [...GENRE_COMPENDIUM_INDEX_FIELDS]});
    expect(first.reset).toHaveBeenCalledOnce();
    expect(second.reset).toHaveBeenCalledOnce();
    expect(world.reset).not.toHaveBeenCalled();
    expect(npc.reset).not.toHaveBeenCalled();
  });

  it("still reprepares the Character safely when a player cannot index the source pack", async () => {
    const character = actor("Compendium.private.genres.Item.hidden");
    const error = new Error("permission denied");
    const warn = vi.fn();
    const packs = {get: vi.fn(() => ({getIndex: vi.fn(async () => { throw error; })}))};

    await prepareCharacterGenreCompendiumIndexes([character], packs, warn);

    expect(warn).toHaveBeenCalledWith(
      "magnusarchives | Could not enrich Genre Compendium index private.genres",
      error
    );
    expect(character.reset).toHaveBeenCalledOnce();
  });
});
