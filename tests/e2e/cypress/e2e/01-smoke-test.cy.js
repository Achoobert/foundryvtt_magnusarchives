/* global cy, describe, expect, it */

describe('Smoke tests', () => {
  it('serves the Foundry home page', () => {
    cy.visit('/');
    cy.get('body', {timeout: 10000}).should('exist');
  });

  it('logs in as GM', () => {
    cy.visit('/');
    cy.licenseAgreeAndClickAccept();
    cy.setupInputPasswordAndClickLogin();
    cy.closeTourOverlay();
    cy.launchTestWorldFromSetup();
    cy.loginAsGM();
    cy.get('body', {timeout: 10000}).should('exist');
  });

  it('loads the Magnus Archives system', () => {
    cy.visit('/');
    cy.licenseAgreeAndClickAccept();
    cy.setupInputPasswordAndClickLogin();
    cy.closeTourOverlay();
    cy.launchTestWorldFromSetup();
    cy.loginAsGM();

    cy.window({timeout: 120000}).should((win) => {
      expect(win.game.system.id, 'game.system.id').to.eq('magnusarchives');
      expect(win.game.modules.get('quench')?.active, 'quench module active').to.eq(true);
      expect(
        win.game.modules.get('magnusarchives-quench-tests')?.active,
        'magnusarchives-quench-tests module active'
      ).to.eq(true);
    });
  });
});
