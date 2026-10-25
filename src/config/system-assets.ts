import type {ActorType, ItemType} from "../constants/system";

const SYSTEM_ASSET_ROOT = "systems/magnusarchives/assets";

export const ACTOR_DEFAULT_ICONS: Readonly<Record<ActorType, string>> = {
  character: `${SYSTEM_ASSET_ROOT}/icons/magnuspc.png`,
  npc: `${SYSTEM_ASSET_ROOT}/icons/magnusnpc.png`
};

export const ITEM_DEFAULT_ICONS: Readonly<Record<ItemType, string>> = {
  ability: `${SYSTEM_ASSET_ROOT}/icons/magnusability.png`,
  armor: `${SYSTEM_ASSET_ROOT}/icons/magnusarmor.png`,
  artifact: `${SYSTEM_ASSET_ROOT}/icons/magnusartefact.png`,
  cypher: `${SYSTEM_ASSET_ROOT}/icons/magnuscypher.png`,
  descriptor: `${SYSTEM_ASSET_ROOT}/icons/magnusdescriptor.png`,
  equipment: `${SYSTEM_ASSET_ROOT}/icons/magnusequipment.png`,
  focus: `${SYSTEM_ASSET_ROOT}/icons/magnusfocus.png`,
  genre: `${SYSTEM_ASSET_ROOT}/icons/magnusgenre.png`,
  shield: `${SYSTEM_ASSET_ROOT}/icons/magnusshield.png`,
  skill: `${SYSTEM_ASSET_ROOT}/icons/magnusskill.png`,
  species: `${SYSTEM_ASSET_ROOT}/icons/magnusspecies.png`,
  characterType: `${SYSTEM_ASSET_ROOT}/icons/magnustype.png`,
  weapon: `${SYSTEM_ASSET_ROOT}/icons/magnusweapons.png`
};

export const SYSTEM_UI_ASSETS = {
  gamePaused: `${SYSTEM_ASSET_ROOT}/ui/magnusgamepaused.png`,
  lobby: `${SYSTEM_ASSET_ROOT}/magnuslobby.png`,
  turnMarker: `${SYSTEM_ASSET_ROOT}/ui/magnusturnmarker.png`
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
