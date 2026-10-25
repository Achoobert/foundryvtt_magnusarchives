import {createdDocsTracker, requireSystemActive} from '../helpers.js';

export default function register(quench) {
  quench.registerBatch(
    'magnusarchives.items',
    (context) => {
      const {describe, it, assert} = context;
      const docs = createdDocsTracker(context);

      describe('weapon damage', () => {
        // The Magnus Archives Roleplaying Game, p100.
        const expected = {light: 2, medium: 4, heavy: 6};

        for (const [category, damage] of Object.entries(expected)) {
          it(`a ${category} weapon deals ${damage} points`, async () => {
            requireSystemActive();
            const item = await docs.createItem({
              name: `Quench ${category} weapon`,
              type: 'weapon',
              system: {category}
            });
            assert.equal(item.system.baseDamage, damage);
          });
        }

        it('adds bonus damage on top of the category damage', async () => {
          const item = await docs.createItem({
            name: 'Quench bonus weapon',
            type: 'weapon',
            system: {category: 'medium', bonusDamage: 2}
          });
          assert.equal(item.system.baseDamage, 6);
        });
      });

      describe('equipment', () => {
        it('creates with a quantity and a price', async () => {
          const item = await docs.createItem({name: 'Quench Torch', type: 'equipment'});
          assert.isNumber(item.system.quantity);
          assert.property(item.system, 'price');
        });
      });
    },
    {displayName: 'Items'}
  );
}
