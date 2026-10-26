import {MagnusArchivesActor} from "../documents/actor";
import {MagnusArchivesItem} from "../documents/item";

export function registerDocumentClasses(): void {
  CONFIG.Actor.documentClass = MagnusArchivesActor;
  CONFIG.Item.documentClass = MagnusArchivesItem;
}
