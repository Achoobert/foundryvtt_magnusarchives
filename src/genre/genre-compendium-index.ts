import type {GenreAssociationData} from "./genre-types";

export const GENRE_COMPENDIUM_INDEX_FIELDS = ["system.options.totalEffortCapMode"] as const;

interface GenreIndexCharacterLike {
  readonly type: string;
  readonly system: {readonly genre: GenreAssociationData};
  reset(): void;
}

interface GenreIndexPackLike {
  getIndex(options: {fields: string[]}): Promise<unknown>;
}

interface GenreIndexPackCollectionLike {
  get(id: string): GenreIndexPackLike | undefined;
}

/** Ensure future Compendium indexes include the Genre option needed by synchronous Actor preparation. */
export function registerGenreCompendiumIndexFields(
  fields: string[] = CONFIG.Item.compendiumIndexFields
): void {
  for (const field of GENRE_COMPENDIUM_INDEX_FIELDS) {
    if (!fields.includes(field)) fields.push(field);
  }
}

/** Extract the Compendium collection ID from a canonical Foundry document UUID. */
export function genreCompendiumPackId(uuid: string): string | null {
  const parts = uuid.split(".");
  return parts.length >= 5 && parts[0] === "Compendium" && parts[3] === "Item"
    ? `${parts[1]}.${parts[2]}`
    : null;
}

/**
 * Enrich referenced Genre indexes, then reprepare affected Actors whose first
 * synchronous pass may only have seen Foundry's minimal Compendium index row.
 */
export async function prepareCharacterGenreCompendiumIndexes(
  actors: Iterable<GenreIndexCharacterLike> = game.actors as unknown as Iterable<GenreIndexCharacterLike>,
  packs: GenreIndexPackCollectionLike = game.packs,
  warn: (message: string, error: unknown) => void = (message, error) => console.warn(message, error)
): Promise<void> {
  const affected = [...actors].filter((actor) => (
    actor.type === "character" && genreCompendiumPackId(actor.system.genre.sourceUuid) !== null
  ));
  const packIds = new Set(affected.map((actor) => genreCompendiumPackId(actor.system.genre.sourceUuid)!));
  for (const packId of packIds) {
    try {
      await packs.get(packId)?.getIndex({fields: [...GENRE_COMPENDIUM_INDEX_FIELDS]});
    } catch (error) {
      warn(`magnusarchives | Could not enrich Genre Compendium index ${packId}`, error);
    }
  }
  for (const actor of affected) actor.reset();
}
