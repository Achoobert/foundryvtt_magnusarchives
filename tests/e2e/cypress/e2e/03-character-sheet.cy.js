/* global cy, describe, expect, it, before, after */
import 'cypress-if';

const ACTOR_NAME = 'Cypress Investigator';

/**
 * Objects built in the Cypress realm are rejected by Foundry's DataModel
 * ("must be constructed with a DataModel or Object"), so document payloads are
 * parsed inside the application window.
 */
function createActor(win, data) {
  return win.Actor.create(win.JSON.parse(JSON.stringify(data)));
}

// The sheet is opened once and then asserted on across several tests, so this
// spec keeps one browser session rather than resetting between tests.
describe('Character sheet', {testIsolation: false}, () => {
  before(() => {
    cy.visit('/');
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

  it('opens a character sheet with the three stat Pools', () => {
    cy.window({timeout: 120000})
      .then((win) => createActor(win, {name: ACTOR_NAME, type: 'character'}))
      .then((actor) => actor.sheet.render(true));

    cy.get('.magnusarchives-character', {timeout: 30000}).should('exist');
    cy.get('.magnusarchives-character .character-hud-pool').should('have.length', 3);
    cy.get('.magnusarchives-character .character-hud-recovery').should('exist');
  });

  it('shows the Magnus damage track and Stress cards', () => {
    cy.get('.magnusarchives-character .character-hud-damage-track').should('exist');
    // "hurt" is hidden until the Character gains that extra step.
    cy.get('.magnusarchives-character .character-hud-damage-step').should('have.length', 4);
    cy.get('.magnusarchives-character .character-hud-damage-step.is-current')
      .should('have.length', 1)
      .and('contain.text', 'Hale');
    cy.get('.magnusarchives-character .character-hud-stress input[name="system.stress.value"]')
      .should('have.value', '0');
  });

  it('applies a serious injury and Stress from the sheet', () => {
    cy.get('.magnusarchives-character [data-action="applySeriousInjury"]').click();
    cy.get('.magnusarchives-character .character-hud-damage-step.is-current')
      .should('contain.text', 'Impaired');

    // The sheet re-renders after each click, so re-query rather than chaining.
    for (let i = 0; i < 3; i += 1) {
      cy.get('.magnusarchives-character [data-action="adjustStress"][data-delta="1"]').click();
    }
    cy.get('.magnusarchives-character .character-hud-stress-level .character-hud-stat-value')
      .should('contain.text', '1');
  });
});
