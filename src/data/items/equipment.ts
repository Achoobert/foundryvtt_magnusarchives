import {PRICE_CATEGORIES} from "../../constants/system";
import {fields, integerField} from "../common/schema";
import {ItemDataModelBase} from "./item-base";

export class EquipmentDataModel extends ItemDataModelBase {
  static override defineSchema(): Record<string, unknown> {
    return {
      ...super.defineSchema(),
      // Mundane equipment is about level 4 (p99).
      level: integerField(4),
      quantity: integerField(1),
      equipped: new fields.BooleanField({required: true, nullable: false, initial: false}),
      // One of the six price categories (p98) rather than a currency amount.
      price: new fields.StringField({
        required: true,
        nullable: false,
        initial: "inexpensive",
        choices: [...PRICE_CATEGORIES]
      }),
      priceNote: new fields.StringField({required: true, nullable: false, initial: ""})
    };
  }

  static override migrateData(
    source: Record<string, unknown>,
    options: {readonly partial?: boolean} = {}
  ): Record<string, unknown> {
    const migrated = super.migrateData(source, options);
    // `price` was free text. Keep anything unrecognised as a note.
    if (
      typeof migrated.price === "string" &&
      !PRICE_CATEGORIES.includes(migrated.price as (typeof PRICE_CATEGORIES)[number])
    ) {
      if (migrated.priceNote === undefined && migrated.price !== "") migrated.priceNote = migrated.price;
      migrated.price = "inexpensive";
    }
    return migrated;
  }
}
