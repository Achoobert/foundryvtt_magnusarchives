/* global cy, describe, expect, it, before, after */
import "cypress-if";

const PACK_ID = "magnusarchives.example-characters";
const ACTOR_NAME = "Scholarly Investigator";

// The imported Actor is reused across the tests in this spec, so the session is
// kept rather than reset between them.
describe("Example Characters compendium", {testIsolation: false}, () => {
  before(() => {
    cy.visit("/");
    cy.licenseAgreeAndClickAccept();
    cy.setupInputPasswordAndClickLogin();
    cy.closeTourOverlay();
    cy.launchTestWorldFromSetup();
    cy.loginAsGM();
  });

  after(() => {
    cy.window().then((win) => {
      const actor = win.game?.actors?.getName(ACTOR_NAME);
      if (actor) return actor.delete();
      return undefined;
    });
  });

  it("registers the pack and holds the sample Character", () => {
    cy.window({timeout: 120000}).should((win) => {
      const pack = win.game.packs.get(PACK_ID);
      expect(pack, "example-characters pack").to.exist;
      expect(pack.documentName, "pack document type").to.eq("Actor");
      expect(pack.index.getName(ACTOR_NAME), ACTOR_NAME).to.exist;
    });
  });

  it("imports into the World with its embedded Items intact", () => {
    cy.window()
      .then((win) => {
        const pack = win.game.packs.get(PACK_ID);
        return pack
          .getDocument(pack.index.getName(ACTOR_NAME)._id)
          .then((document) => win.Actor.create(document.toObject()));
      })
      .should((actor) => {
        expect(actor.type, "actor type").to.eq("character");
        expect(
          actor.items.filter((item) => item.type === "skill"),
          "skills"
        ).to.have.length(9);
        expect(
          actor.items.filter((item) => item.type === "ability"),
          "abilities"
        ).to.have.length(3);
        expect(
          actor.items.filter((item) => item.type === "cypher"),
          "cyphers"
        ).to.have.length(2);
        // Pools are the printed sheet's: 10 / 10 / 14 (p379).
        expect(actor.system.derived.pools.intellect.max, "Intellect Pool").to.eq(14);
        expect(actor.system.derived.cypherLimit.max, "cypher limit").to.eq(2);
      });
  });

  it("renders the imported Character on the sheet", () => {
    cy.window().then((win) => win.game.actors.getName(ACTOR_NAME).sheet.render(true));

    cy.get(".magnusarchives-character", {timeout: 30000}).should("exist");
    cy.get(".magnusarchives-character .character-hud-pool").should("have.length", 3);
    cy.get(".magnusarchives-character .character-hud-damage-step.is-current").should("contain.text", "Hale");
  });

  it("names the Focus in the identity line rather than showing [FOCUS]", () => {
    // Identity slots render uppercased, so assert on the text the DOM holds.
    cy.get(".magnusarchives-character .character-hud-sentence")
      .should("contain.text", "EXPLORES DARK PLACES")
      .and("not.contain.text", "[FOCUS]");
    cy.get(".magnusarchives-character .character-hud-sentence .is-missing").should("not.exist");
  });
});
