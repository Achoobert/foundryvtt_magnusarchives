export const SYSTEM_ID = 'magnusarchives';

/** Fail loudly rather than silently passing against the wrong system. */
export function requireSystemActive() {
  if (game.system.id !== SYSTEM_ID) {
    throw new Error(`Expected system '${SYSTEM_ID}', but '${game.system.id}' is active.`);
  }
}

/**
 * Collects documents created during a batch and deletes them afterwards, so a
 * failing test cannot leave junk in the dev world.
 */
export function createdDocsTracker(context) {
  const created = [];
  context.after(async () => {
    for (const doc of created.reverse()) {
      try {
        await doc.delete();
      } catch (error) {
        console.warn(`Quench cleanup failed for ${doc?.uuid}:`, error);
      }
    }
    created.length = 0;
  });
  return {
    track(doc) {
      created.push(doc);
      return doc;
    },
    async createActor(data) {
      return this.track(await Actor.create({name: 'Quench Actor', type: 'character', ...data}));
    },
    async createItem(data) {
      return this.track(await Item.create({name: 'Quench Item', type: 'equipment', ...data}));
    }
  };
}
