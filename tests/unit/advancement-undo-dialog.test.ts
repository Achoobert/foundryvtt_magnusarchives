import {afterEach, describe, expect, it, vi} from "vitest";

import {promptUndoAdvancement} from "../../src/applications/dialogs/advancement-dialogs";
import type {AdvancementCharacterLike} from "../../src/services/advancement-service";

function setup(confirmed: boolean) {
  const undoPurchase = vi.fn(async (_actor: AdvancementCharacterLike, _purchaseId: string) => undefined);
  const wait = vi.fn(async (_options: Record<string, unknown>) => confirmed);
  const localize = vi.fn((key: string) => key);
  vi.stubGlobal("game", {
    i18n: {localize, format: vi.fn((key: string) => key)},
    magnusarchives: {services: {advancement: {undoPurchase}}}
  });
  vi.stubGlobal("foundry", {applications: {api: {DialogV2: {wait}}}});
  vi.stubGlobal("ui", {notifications: {info: vi.fn(), error: vi.fn()}});
  return {wait, undoPurchase};
}

describe("Advancement status-only Undo dialog", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("uses a safe-default confirmation and Cancel changes nothing", async () => {
    const {wait, undoPurchase} = setup(false);
    await expect(promptUndoAdvancement({} as AdvancementCharacterLike, "purchase-1")).resolves.toBe(false);

    expect(undoPurchase).not.toHaveBeenCalled();
    expect(wait).toHaveBeenCalledOnce();
    expect(wait.mock.calls[0]?.[0]).toMatchObject({
      defaultYes: false,
      buttons: [
        {
          action: "no",
          label: "MAGNUSARCHIVES.Actions.Cancel",
          icon: "fa-solid fa-xmark",
          default: true
        },
        {
          action: "yes",
          label: "MAGNUSARCHIVES.Advancement.Undo.Confirm",
          icon: "fa-solid fa-check"
        }
      ]
    });
    expect(String(wait.mock.calls[0]?.[0]?.content)).toContain("MAGNUSARCHIVES.Advancement.Undo.NoRollbackWarning");
  });

  it("passes the exact stable purchase ID only after confirmation", async () => {
    const {undoPurchase} = setup(true);
    const actor = {} as AdvancementCharacterLike;

    await expect(promptUndoAdvancement(actor, "purchase-exact")).resolves.toBe(true);

    expect(undoPurchase).toHaveBeenCalledOnce();
    expect(undoPurchase).toHaveBeenCalledWith(actor, "purchase-exact");
    expect(ui.notifications.info).toHaveBeenCalledWith("MAGNUSARCHIVES.Advancement.Undo.Success");
  });
});
