import {CORE_TOTAL_EFFORT_CAP} from "../rules/core/effort-rules";
import {
  GENRE_EFFORT_CAP_MODES,
  type GenreAssociationData,
  type GenreDocumentLike,
  type GenreEffortCapMode
} from "./genre-types";

export interface EffectiveGenreData {
  readonly sourceUuid: string;
  readonly name: string;
  readonly totalEffortCapMode: GenreEffortCapMode;
}

export function effectiveGenre(
  association: GenreAssociationData,
  resolve: (uuid: string) => GenreDocumentLike | null
): EffectiveGenreData | null {
  if (!association.sourceUuid) return null;
  const genre = resolve(association.sourceUuid);
  if (
    !genre ||
    genre.type !== "genre" ||
    !genre.system ||
    !genre.system.options ||
    !GENRE_EFFORT_CAP_MODES.includes(genre.system.options.totalEffortCapMode)
  )
    return null;
  return {
    sourceUuid: association.sourceUuid,
    name: genre.name,
    totalEffortCapMode: genre.system.options.totalEffortCapMode
  };
}

/** Null is the normalized runtime representation of an unlimited Core cap. */
export function totalEffortCap(mode: GenreEffortCapMode | undefined): number | null {
  return mode === "unlimited" ? null : CORE_TOTAL_EFFORT_CAP;
}
