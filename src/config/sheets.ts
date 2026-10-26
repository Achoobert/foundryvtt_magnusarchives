import {CharacterSheet} from "../applications/sheets/character-sheet";
import {MagnusArchivesItemSheet} from "../applications/sheets/item-sheet";
import {NpcSheet} from "../applications/sheets/npc-sheet";
import {SYSTEM_ID} from "../constants/system";

export function registerSheets(): void {
  const {DocumentSheetConfig} = foundry.applications.apps;

  DocumentSheetConfig.registerSheet(foundry.documents.Actor, SYSTEM_ID, CharacterSheet, {
    types: ["character"],
    makeDefault: true,
    label: "MAGNUSARCHIVES.Sheets.Character"
  });

  DocumentSheetConfig.registerSheet(foundry.documents.Actor, SYSTEM_ID, NpcSheet, {
    types: ["npc"],
    makeDefault: true,
    label: "MAGNUSARCHIVES.Sheets.Npc"
  });

  DocumentSheetConfig.registerSheet(foundry.documents.Item, SYSTEM_ID, MagnusArchivesItemSheet, {
    makeDefault: true,
    label: "MAGNUSARCHIVES.Sheets.Item"
  });
}
