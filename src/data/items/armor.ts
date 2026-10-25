import {ARMOR_CATEGORIES, type ArmorCategory} from "../../constants/system";
import {depletionRuleField, fields, integerField} from "../common/schema";
import {ItemDataModelBase} from "./item-base";

/**
 * Body armor in The Magnus Archives has no damage-reduction value (p100).
 * Wearing it gives an extra step in the damage track, like the Tough ability,
 * and hinders every Speed-based task.
 */
export class ArmorDataModel extends ItemDataModelBase {
  declare category: ArmorCategory;

  static override defineSchema(): Record<string, unknown> {
    return {
      ...super.defineSchema(),
      category: new fields.StringField({
        required: true,
        nullable: false,
        initial: "light",
        choices: [...ARMOR_CATEGORIES]
      }),
      grantsHurtStep: new fields.BooleanField({required: true, nullable: false, initial: true}),
      speedTaskHindrance: integerField(1),
      // Legacy compatibility only. Effective Armor familiarity is derived from the Character.
      freelyUsed: new fields.BooleanField({required: true, nullable: false, initial: false}),
      depletion: depletionRuleField(),
      depleted: new fields.BooleanField({required: true, nullable: false, initial: false}),
      equipped: new fields.BooleanField({required: true, nullable: false, initial: false})
    };
  }
}
