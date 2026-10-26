import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {describe, expect, it} from "vitest";

import {
  characterHeaderIdentity,
  headerPoolGauge,
  headerPips,
  headerRecoveries,
  headerWoundTracks,
  indefiniteArticle,
  orderedHeaderDescriptors
} from "../../src/applications/sheets/character-header";

const root = resolve(import.meta.dirname, "../..");
const template = readFileSync(resolve(root, "templates/actor/character-sheet.hbs"), "utf8");
const sheet = readFileSync(resolve(root, "src/applications/sheets/character-sheet.ts"), "utf8");
const styles = readFileSync(resolve(root, "styles/components/_character-header.scss"), "utf8");
const recoveryDialog = readFileSync(resolve(root, "src/applications/dialogs/character-core-dialogs.ts"), "utf8");
const taskDialog = readFileSync(resolve(root, "src/applications/dialogs/test-roll-dialog.ts"), "utf8");
const headerSource = readFileSync(resolve(root, "src/applications/sheets/character-header.ts"), "utf8");
const model = readFileSync(resolve(root, "src/data/actors/character.ts"), "utf8");
const lang = JSON.parse(readFileSync(resolve(root, "lang/en.json"), "utf8"));

describe("Character Header HUD V1.1", () => {
  it("builds the Descriptor / Type / Focus sentence and missing placeholders", () => {
    expect(characterHeaderIdentity({
      descriptors: [{id: "descriptor-1", name: "Fast", role: "primary"}],
      type: {id: "type-1", name: "Monk"},
      focus: {uuid: "Item.focus-1", name: "Abides in Stone"}
    }).sentence).toBe("I AM A FAST MONK WHO ABIDES IN STONE");

    const empty = characterHeaderIdentity();
    expect(empty.sentence).toBe("I AM A [DESCRIPTOR] [TYPE] WHO [FOCUS]");
    expect(empty.descriptors[0]).toMatchObject({missing: true, accepts: "descriptor"});
    expect(empty.species).toBeNull();
    expect(empty.type).toMatchObject({missing: true, accepts: "characterType"});
    expect(empty.focus).toMatchObject({missing: true, accepts: "focus"});
  });

  it("orders and deduplicates Descriptor instances before Species, Type, and Focus", () => {
    const descriptors = [
      {id: "rugged", instanceId: "rugged-instance", name: "Rugged", role: "speciesGranted" as const, attachedAt: 30},
      {id: "brash", instanceId: "brash-instance", name: "Brash", role: "primary" as const, attachedAt: 20},
      {id: "brash-copy", instanceId: "brash-instance", name: "Brash", role: "primary" as const, attachedAt: 20},
      {id: "daring", instanceId: "daring-instance", name: "Daring", role: "additional" as const, attachedAt: 25}
    ];
    expect(orderedHeaderDescriptors(descriptors).map(({name}) => name)).toEqual(["Brash", "Daring", "Rugged"]);
    expect(characterHeaderIdentity({
      descriptors,
      species: {id: "human", name: "Human"},
      type: {id: "fighter", name: "Fighter"},
      focus: {uuid: "Item.mastery", name: "Masters Weaponry"}
    }).sentence).toBe("I AM A BRASH AND DARING AND RUGGED HUMAN FIGHTER WHO MASTERS WEAPONRY");
    expect(characterHeaderIdentity({
      descriptors: [descriptors[1]!, descriptors[0]!],
      species: {id: "human", name: "Human"},
      type: {id: "fighter", name: "Fighter"},
      focus: {uuid: "Item.mastery", name: "Masters Weaponry"}
    }).sentence).toBe("I AM A BRASH AND RUGGED HUMAN FIGHTER WHO MASTERS WEAPONRY");
  });

  it("chooses A or AN from the first displayed Descriptor", () => {
    expect(indefiniteArticle("Honorable")).toBe("AN");
    expect(indefiniteArticle("Fast")).toBe("A");
    expect(characterHeaderIdentity({
      descriptors: [{id: "honorable", name: "Honorable", role: "primary"}],
      species: {id: "elf", name: "Elf"},
      type: {id: "mage", name: "Mage"},
      focus: {uuid: "Item.quells-evil", name: "Quells Evil"}
    }).sentence).toBe("I AM AN HONORABLE ELF MAGE WHO QUELLS EVIL");
  });

  it("can hide the complete Focus clause without discarding the Focus reference", () => {
    const identity = characterHeaderIdentity({
      descriptors: [{id: "clever", name: "Clever", role: "primary"}],
      type: {id: "warrior", name: "Warrior"},
      focus: {uuid: "Item.focus", name: "Commands Mental Powers"},
      hideFocus: true
    });
    expect(identity.sentence).toBe("I AM A CLEVER WARRIOR");
    expect(identity.showFocus).toBe(false);
    expect(identity.focus.uuid).toBe("Item.focus");
  });

  it("generates exactly the dynamic Wound capacity and fill count", () => {
    expect(headerPips(2, 5)).toHaveLength(5);
    expect(headerPips(2, 5).filter((pip) => pip.filled)).toHaveLength(2);
    const tracks = headerWoundTracks(
      {minor: 3, moderate: 1, major: 0},
      {minor: 4, moderate: 2, major: 1}
    );
    expect(tracks.map((track) => [track.severity, track.pips.length, track.count])).toEqual([
      ["minor", 4, 3],
      ["moderate", 2, 1],
      ["major", 1, 0]
    ]);
  });

  it("turns pips into contiguous count targets including highest-filled toggle-off", () => {
    expect(headerPips(0, 3).map((pip) => pip.targetCount)).toEqual([1, 2, 3]);
    expect(headerPips(3, 3).map((pip) => pip.targetCount)).toEqual([1, 2, 2]);
    expect(headerPips(2, 3).map((pip) => pip.targetCount)).toEqual([1, 1, 3]);
    expect(headerPips(1, 3).map((pip) => pip.targetCount)).toEqual([0, 2, 3]);
  });

  it("keeps all four Recoveries visible with independent used states", () => {
    const recoveries = headerRecoveries({
      oneAction: true,
      tenMinutes: false,
      oneHour: true,
      tenHours: false
    });
    expect(recoveries).toHaveLength(4);
    expect(recoveries.map(({type, available}) => [type, available])).toEqual([
      ["one-action", false],
      ["10-minutes", true],
      ["1-hour", false],
      ["10-hours", true]
    ]);
  });

  it("clamps Pool gauges against the effective displayed maximum", () => {
    expect(headerPoolGauge(9, 18)).toEqual({current: 9, max: 18, ratio: 0.5, percent: 50});
    expect(headerPoolGauge(30, 18)).toEqual({current: 18, max: 18, ratio: 1, percent: 100});
    expect(headerPoolGauge(-4, 18)).toEqual({current: 0, max: 18, ratio: 0, percent: 0});
    expect(headerPoolGauge(4, 0)).toEqual({current: 0, max: 0, ratio: 0, percent: 0});
    expect(sheet).toContain("headerPoolGauge(coreSystem.stats[pool].value, coreSystem.derived.pools[pool].max)");
    expect(template).toContain("--magnusarchives-pool-gauge-ratio: {{pool.gauge.ratio}}");
    expect(styles).toContain("var(--magnusarchives-pool-gauge-low)");
    expect(styles).toContain("var(--magnusarchives-pool-gauge-high)");
    expect(styles).toContain("--magnusarchives-pool-gauge-color: color-mix(");
    expect(styles).toContain("in hsl shorter hue");
    expect(styles).toContain(".character-hud-pool-gauge {\n    --magnusarchives-pool-gauge-color");
    expect(styles).toContain("position: absolute");
    expect(styles).toContain("background: transparent");
    expect(styles).toContain("pointer-events: none");
    expect(styles).not.toContain("var(--magnusarchives-character-accent) calc((1 - var(--magnusarchives-pool-gauge-ratio))");
  });

  it("wires identity inspection, placeholder drops, whole-card Pool rolls, and direct XP editing", () => {
    expect(template).toContain('data-action="inspectPackage"');
    expect(template).toContain('data-action="inspectHeaderFocus"');
    expect(template).toContain('data-hud-drop="descriptor"');
    expect(template).toContain('data-hud-drop="characterType"');
    expect(template).toContain('data-hud-drop="focus"');
    expect(sheet).toContain("POOL_KEYS.map((pool)");
    expect(sheet).toContain("promptTestRoll(this.actor as unknown as RollCharacterDocumentLike, pool)");
    expect(template).toContain('data-action="rollPool"');
    expect(template).toContain('data-pool="{{pool.key}}"');
    expect(template).toContain('role="button" tabindex="0"');
    expect(template).toContain('name="system.xp"');
    // Resource Points are a Cypher V2 concept with no Magnus equivalent.
    expect(template).not.toContain('system.resourcePoints');
    expect(template).not.toContain('data-action="editHeaderStats"');
    expect(template).not.toContain('data-action="testRoll"');
    expect(sheet).toContain('event.target.closest("input, button, select, textarea, a")');
    expect(sheet).toContain('event.key !== "Enter" && event.key !== " "');
    expect(sheet).toContain("card.click()");
    expect(sheet).toContain("expectedType && item?.type !== expectedType");
    expect(taskDialog).toContain('selectedPool: PoolKey = "might"');
    expect(taskDialog).toContain("poolOptions(selectedPool)");
  });

  it("places Rally inside Might without allowing the click to bubble into a Might roll", () => {
    const poolsStart = template.indexOf("character-hud-pools");
    const poolsEnd = template.indexOf("character-hud-lower");
    const pools = template.slice(poolsStart, poolsEnd);
    expect(pools).toContain("pool.isMight");
    expect(pools).toContain('data-action="rally"');
    expect(pools).toContain("pool.canRally");
    expect(sheet).toContain("game.magnusarchives.services.rally.canApply");
    expect(sheet).toContain("event?.stopPropagation()");
    expect(sheet).toContain('event.target.closest("input, button, select, textarea, a")');
  });

  it("renders compact Recovery controls", () => {
    expect(template).toContain('data-action="recoveryType"');
    expect(template).toContain("{{#if recovery.used}}disabled");
    expect(template).toContain('data-action="resetRecoveries"');
    expect(template).toContain('class="character-hud-recovery-formula">{{header.recoveryFormulaLabel}}');
    expect(sheet).toContain("recoveryFormulaLabel: coreSystem.derived.recovery.formula");
    expect(sheet).toContain("if (!game.user.isGM) return");
    expect(sheet).toContain('"system.recovery.slots": slots');
    expect(sheet).toContain('"system.recovery.used": recoveryUsageFromSlots(slots)');
    expect(recoveryDialog).toContain("selectedType?: RecoveryType");
    expect(recoveryDialog).toContain("selectedSlotId?: string");
    expect(template).toContain('data-recovery-slot-id="{{recovery.id}}"');
    expect(sheet).toContain("coreSystem.derived.pools[pool].max");
    expect(sheet).toContain("coreSystem.derived.pools[pool].edge");
  });

  it("renders the Magnus damage track and Stress cards in the HUD", () => {
    expect(template).toContain('class="character-hud-card character-hud-damage-track');
    expect(template).toContain('class="character-hud-card character-hud-stress"');
    expect(template).toContain('data-action="setDamageTrackStep"');
    expect(template).toContain('data-action="applySeriousInjury"');
    expect(template).toContain('data-action="healDamageTrack"');
    expect(template).toContain('data-action="adjustStress"');
    expect(template).toContain('name="system.stress.value"');
    expect(template).toContain("{{header.stress.level}}");
    expect(template).toContain("MAGNUSARCHIVES.DamageTrack.Label");
    expect(template).toContain("MAGNUSARCHIVES.Stress.Label");

    expect(sheet).toContain("headerDamageTrack(");
    expect(sheet).toContain("headerStress(coreSystem.stress.value, coreSystem.stress.supernatural)");
    expect(sheet).toContain("coreSystem.derived.damageTrack.hurtAvailable");
    expect(sheet).toContain("services.conditions.applySeriousInjury(");
    expect(sheet).toContain("services.conditions.setDamageTrackStep(");

    for (const declaration of [
      "flex: 0 0 0.58rem",
      "aspect-ratio: 1 / 1",
      "border-radius: 50%"
    ]) expect(styles).toContain(declaration);
    expect(styles).toContain("--magnusarchives-stress-pip");
    expect(styles).toContain("--magnusarchives-damage-track-reached");
    expect(styles).toContain(".character-hud-damage-track-steps");
  });

  it("prints the book's step penalties beside the damage track, as the sheet does (p381)", () => {
    expect(template).toContain('class="character-hud-damage-step-notes"');
    expect(template).toContain("{{#each entry.notes as |note|}}");
    expect(sheet).toContain("notes: entry.noteLabels.map(");
    expect(headerSource).toContain("DAMAGE_TRACK_NOTE_COUNT");
    expect(headerSource).toContain("hale: 0");
    expect(headerSource).toContain("impaired: 3");
    expect(headerSource).toContain("debilitated: 2");
    for (const key of [
      "MAGNUSARCHIVES.DamageTrack.Note.hurt.1",
      "MAGNUSARCHIVES.DamageTrack.Note.impaired.1",
      "MAGNUSARCHIVES.DamageTrack.Note.impaired.3",
      "MAGNUSARCHIVES.DamageTrack.Note.debilitated.2"
    ]) expect(lang).toHaveProperty(key);
    expect(styles).toContain(".character-hud-damage-step-notes");
  });

  it("boxes Stress Levels from supernatural sources separately", () => {
    expect(template).toContain('name="system.stress.supernatural"');
    expect(template).toContain("MAGNUSARCHIVES.Stress.Supernatural");
    expect(lang).toHaveProperty(
      "MAGNUSARCHIVES.Stress.SupernaturalHint",
      "Stress Levels acquired from supernatural sources"
    );
    expect(model).toContain("supernatural: integerField(0, 0)");
  });

  it("exposes compact manual Weapon and Armor familiarity actions without a multi-select", () => {
    expect(template).not.toContain('name="system.proficiencies.weaponCategories"');
    expect(template).not.toContain("multiple size=");
    expect(template).toContain('data-action="toggleFamiliarity"');
    expect(template).toContain('data-family="weapon"');
    expect(template).toContain('data-family="armor"');
    expect(template).toContain("entry.packageGranted");
    expect(sheet).toContain("coreSystem.derived.packages.weaponCategories");
    expect(sheet).toContain("coreSystem.derived.packages.armorCategories");
    expect(sheet).toContain("toggleManualFamiliarity(");
  });

  it("submits each current Pool value once as a Number", () => {
    expect(template.match(/name="system\.stats\.\{\{pool\.key\}\}\.value"/g)).toHaveLength(1);
    for (const pool of ["might", "speed", "intellect"]) {
      expect(template).not.toContain(`name="system.stats.${pool}.value"`);
    }
    expect(template).toContain('name="system.stats.{{pool.key}}.value" type="number" data-dtype="Number"');
  });

  it("keeps Recovery, the damage track, and Stress in one compact bottom HUD row", () => {
    expect(styles).toContain("grid-template-columns: 5.5rem minmax(0, 1fr) 5.5rem");
    expect(styles).toContain("padding-block: 0.25rem");
    const lowerStart = styles.indexOf(".character-hud-lower");
    const woundsStart = styles.indexOf(".character-hud-wounds", lowerStart);
    expect(styles.slice(lowerStart, woundsStart)).not.toContain("grid-column: 1 / -1");

    const recoveryHeading = template.indexOf("character-hud-recovery-heading");
    const recoveryButtons = template.indexOf("character-hud-recovery-buttons");
    expect(recoveryHeading).toBeGreaterThan(-1);
    expect(recoveryButtons).toBeGreaterThan(recoveryHeading);
    expect(template.slice(recoveryHeading, recoveryButtons)).toContain('data-action="resetRecoveries"');
  });

  it("uses the V1.1 hierarchy and container-responsive layout without Header color literals", () => {
    expect(styles).toContain("container-name: magnusarchives-character-sheet");
    expect(styles).toContain("grid-template-columns: repeat(3, minmax(0, 1fr))");
    expect(styles).toContain("grid-template-columns: 4.75rem minmax(0, 1fr)");
    expect(styles).toContain("height: 6rem");
    expect(styles).toContain("@container magnusarchives-character-sheet (max-width: 720px)");
    expect(styles).toContain("@container magnusarchives-character-sheet (max-width: 560px)");
    expect(styles).toContain("min-width: 0");
    expect(styles).not.toMatch(/#[0-9a-f]{3,8}/i);
    for (const token of [
      "--magnusarchives-surface-primary",
      "--magnusarchives-surface-secondary",
      "--magnusarchives-surface-raised",
      "--magnusarchives-text-primary",
      "--magnusarchives-text-muted",
      "--magnusarchives-accent",
      "--magnusarchives-accent-hover",
      "--magnusarchives-border",
      "--magnusarchives-danger"
    ]) expect(styles).toContain(`var(${token})`);
  });

  it("keeps base/source editing in Settings without the obsolete override notice", () => {
    expect(sheet).toContain('{id: "settings", icon: "fa-solid fa-sliders", label: "MAGNUSARCHIVES.Tabs.Settings"}');
    expect(template).toContain('data-tab="settings"');
    expect(template).not.toContain("MAGNUSARCHIVES.Settings.Character.Placeholder");
    expect(template).toContain("MAGNUSARCHIVES.Settings.Character.BaseValues");
    expect(template).toContain('name="system.stats.might.baseMax"');
    expect(template).not.toContain('name="system.stats.might.baseMax" type="number" value="{{header');
  });

  it("removes Main, defaults to Skills, and keeps package administration in Settings", () => {
    expect(sheet).not.toContain('{id: "main"');
    expect(sheet).toContain('initial: "skills"');
    expect(template).not.toContain('data-tab="main"');
    const settingsStart = template.indexOf('data-tab="settings"');
    const skillsStart = template.indexOf('data-tab="skills"');
    const settings = template.slice(settingsStart, skillsStart);
    expect(settings).toContain('data-action="addSpecies"');
    expect(settings).toContain('data-action="addType"');
    expect(settings).toContain('data-action="addDescriptor"');
    expect(settings).toContain('data-action="removePackage"');
    expect(settings).toContain('data-action="inspectGrantedItem"');
    expect(settings).toContain("additionalDescriptorItems");
    expect(settings).toContain("speciesDescriptorItems");
  });

  it("keeps every Character Sentence Item interactive and grammar fragments inert", () => {
    const sentenceStart = template.indexOf("character-hud-sentence");
    const sentenceEnd = template.indexOf("</p>", sentenceStart);
    const sentence = template.slice(sentenceStart, sentenceEnd);
    expect(sentence).toContain("header.identity.descriptors");
    expect(sentence).toContain("header.identity.species");
    expect(sentence.match(/data-action="inspectPackage"/g)).toHaveLength(3);
    expect(sentence).toContain('data-action="inspectHeaderFocus"');
    expect(sentence).toContain('data-hud-drop="descriptor"');
    expect(sentence).toContain('data-hud-drop="characterType"');
    expect(sentence).toContain('data-hud-drop="focus"');
    expect(sentence).toContain("MAGNUSARCHIVES.Hud.And");
  });
});
