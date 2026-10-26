import {createdDocsTracker, requireSystemActive} from "../helpers.js";

async function renderAndClose(document, assert) {
  const sheet = document.sheet;
  assert.isOk(sheet, `${document.documentName} should have a sheet`);
  await sheet.render(true);
  const element = sheet.element instanceof HTMLElement ? sheet.element : sheet.element?.[0];
  assert.isOk(element, "sheet should produce a DOM element");
  await sheet.close();
  return element;
}

export default function register(quench) {
  quench.registerBatch(
    "magnusarchives.sheets",
    (context) => {
      const {describe, it, assert} = context;
      const docs = createdDocsTracker(context);

      describe("sheet rendering", () => {
        it("renders the character sheet", async () => {
          requireSystemActive();
          const actor = await docs.createActor({name: "Quench Sheet PC"});
          const element = await renderAndClose(actor, assert);
          assert.isOk(element.querySelector(".magnusarchives-character"), "character sheet root");
        });

        it("renders the npc sheet", async () => {
          const actor = await docs.createActor({name: "Quench Sheet NPC", type: "npc"});
          const element = await renderAndClose(actor, assert);
          assert.isOk(element.querySelector(".magnusarchives-npc"), "npc sheet root");
        });

        it("renders an item sheet", async () => {
          const item = await docs.createItem({name: "Quench Sheet Item", type: "weapon"});
          await renderAndClose(item, assert);
        });
      });
    },
    {displayName: "Sheets"}
  );
}
