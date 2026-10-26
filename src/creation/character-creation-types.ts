export type CoreCreationMode = "uninitialized" | "completed" | "skipped" | "manual";

export type CharacterArcStage = "none" | "opening" | "steps" | "climax" | "resolution" | "complete";

export interface CharacterArcSelection {
  /** Catalog key from CHARACTER_ARCS, or "" for a custom arc. */
  readonly key: string;
  readonly name: string;
}

export interface CoreCharacterSetupRequest {
  readonly pools: {readonly might: number; readonly speed: number; readonly intellect: number};
  /** Custom header word for the primary Descriptor, such as "Pretentious". */
  readonly descriptorLabel?: string;
  readonly arc?: CharacterArcSelection;
}
