import {createdDocsTracker, requireSystemActive} from "../helpers.js";

export default function register(quench) {
  quench.registerBatch(
    "magnusarchives.actors",
    (context) => {
      const {describe, it, assert} = context;
      const docs = createdDocsTracker(context);

      describe("character actor", () => {
        it("creates with the three stat Pools", async () => {
          requireSystemActive();
          const actor = await docs.createActor({name: "Quench Investigator"});
          assert.isObject(actor.system.stats.might);
          assert.isObject(actor.system.stats.speed);
          assert.isObject(actor.system.stats.intellect);
        });

        it("derives Pool maximums and Edge", async () => {
          const actor = await docs.createActor({name: "Quench Derived"});
          for (const pool of ["might", "speed", "intellect"]) {
            assert.isNumber(actor.system.derived.pools[pool].max, `${pool} max`);
            assert.isNumber(actor.system.derived.pools[pool].edge, `${pool} edge`);
          }
        });

        it("starts at tier 1 with a recovery formula", async () => {
          const actor = await docs.createActor({name: "Quench Tier"});
          assert.equal(actor.system.derived.tier.value, 1);
          assert.isString(actor.system.derived.recovery.formula);
        });
      });

      describe("Stress and the damage track", () => {
        it("starts hale with no Stress", async () => {
          const actor = await docs.createActor({name: "Quench Conditions"});
          assert.equal(actor.system.stress.value, 0);
          assert.equal(actor.system.derived.stress.level, 0);
          assert.equal(actor.system.damageTrack.step, "hale");
          assert.isFalse(actor.system.derived.damageTrack.dead);
        });

        it("turns three points of Stress into one hindering level", async () => {
          const actor = await docs.createActor({name: "Quench Stress"});
          await game.magnusarchives.services.conditions.applyStress(actor, 3);
          assert.equal(actor.system.derived.stress.level, 1);
          assert.equal(actor.system.derived.totalHindrance, 1);
        });

        it("moves down the damage track on a serious injury", async () => {
          const actor = await docs.createActor({name: "Quench Injury"});
          await game.magnusarchives.services.conditions.applySeriousInjury(actor);
          assert.equal(actor.system.damageTrack.step, "impaired");
          assert.equal(actor.system.derived.damageTrack.effortSurcharge, 1);
        });

        it("omits the hurt step unless the Character has it", async () => {
          const actor = await docs.createActor({name: "Quench Hurt"});
          assert.deepEqual([...actor.system.derived.damageTrack.steps], ["hale", "impaired", "debilitated", "dead"]);
        });
      });

      describe("npc actor", () => {
        it("derives health and the level target number", async () => {
          const actor = await docs.createActor({
            name: "Quench Henchman",
            type: "npc",
            system: {level: 2}
          });
          assert.equal(actor.system.level, 2);
          assert.isNumber(actor.system.health.max);
          assert.isFalse(actor.system.dead);
        });
      });
    },
    {displayName: "Actors"}
  );
}
