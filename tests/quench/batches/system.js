import {SYSTEM_ID, requireSystemActive} from '../helpers.js';

export default function register(quench) {
  quench.registerBatch(
    'magnusarchives.system',
    (context) => {
      const {describe, it, assert} = context;

      describe('system registration', () => {
        it('is the active system', () => {
          requireSystemActive();
          assert.equal(game.system.id, SYSTEM_ID);
        });

        it('exposes the system API on game', () => {
          assert.isObject(game.magnusarchives, 'game.magnusarchives should be an object');
          assert.isObject(game.magnusarchives.services, 'services should be registered');
          assert.isObject(game.magnusarchives.rules, 'rules registry should be registered');
        });

        it('registers the core rule module', () => {
          const ids = game.magnusarchives.rules.list().map((module) => module.id);
          assert.include(ids, 'magnusarchives.core');
        });

        it('declares the expected document types', () => {
          assert.includeMembers(Object.keys(CONFIG.Actor.dataModels), ['character', 'npc']);
          assert.includeMembers(Object.keys(CONFIG.Item.dataModels), [
            'ability', 'skill', 'weapon', 'armor', 'equipment', 'cypher', 'artifact',
            'descriptor', 'characterType', 'focus'
          ]);
        });
      });
    },
    {displayName: 'System registration'}
  );
}
