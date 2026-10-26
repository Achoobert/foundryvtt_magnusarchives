import type {ActorType, ItemType} from "../constants/system";

const SYSTEM_ASSET_ROOT = "systems/magnusarchives/assets";

export const ACTOR_DEFAULT_ICONS: Readonly<Record<ActorType, string>> = {
  character: `${SYSTEM_ASSET_ROOT}/icons/magnuspc.webp`,
  npc: `${SYSTEM_ASSET_ROOT}/icons/magnusnpc.webp`
};

export const ITEM_DEFAULT_ICONS: Readonly<Record<ItemType, string>> = {
  ability: `${SYSTEM_ASSET_ROOT}/icons/magnusability.webp`,
  armor: `${SYSTEM_ASSET_ROOT}/icons/magnusarmor.webp`,
  artifact: `${SYSTEM_ASSET_ROOT}/icons/magnusartefact.webp`,
  cypher: `${SYSTEM_ASSET_ROOT}/icons/magnuscypher.webp`,
  descriptor: `${SYSTEM_ASSET_ROOT}/icons/magnusdescriptor.webp`,
  equipment: `${SYSTEM_ASSET_ROOT}/icons/magnusequipment.webp`,
  focus: `${SYSTEM_ASSET_ROOT}/icons/magnusfocus.webp`,
  genre: `${SYSTEM_ASSET_ROOT}/icons/magnusgenre.webp`,
  shield: `${SYSTEM_ASSET_ROOT}/icons/magnusshield.webp`,
  skill: `${SYSTEM_ASSET_ROOT}/icons/magnusskill.webp`,
  species: `${SYSTEM_ASSET_ROOT}/icons/magnusspecies.webp`,
  characterType: `${SYSTEM_ASSET_ROOT}/icons/magnustype.webp`,
  weapon: `${SYSTEM_ASSET_ROOT}/icons/magnusweapons.webp`
};

export const SYSTEM_UI_ASSETS = {
  gamePaused: `${SYSTEM_ASSET_ROOT}/ui/magnusgamepaused.webp`,
  lobby: `${SYSTEM_ASSET_ROOT}/magnuslobby.webp`,
  turnMarker: `${SYSTEM_ASSET_ROOT}/ui/magnusturnmarker.webp`
} as const;

export function actorDefaultIcon(type: string): string | null {
  return type in ACTOR_DEFAULT_ICONS
    ? ACTOR_DEFAULT_ICONS[type as ActorType]
    : null;
}

export function itemDefaultIcon(type: string): string | null {
  return type in ITEM_DEFAULT_ICONS
    ? ITEM_DEFAULT_ICONS[type as ItemType]
    : null;
}

export function hasExplicitPrototypeActorLink(data: Record<string, unknown>): boolean {
  if ("prototypeToken.actorLink" in data) return true;
  const prototypeToken = data.prototypeToken;
  return Boolean(
    prototypeToken
    && typeof prototypeToken === "object"
    && "actorLink" in prototypeToken
  );
}

export function shouldDefaultPrototypeActorLink(type: string, data: Record<string, unknown>): boolean {
  return type === "character" && !hasExplicitPrototypeActorLink(data);
}
