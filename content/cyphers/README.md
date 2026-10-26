# Canonical Cypher catalog

`catalog.json` is the reviewable source for the system-level `Cyphers` Item pack and `Cypher Tables` RollTable pack. It holds the 52 cyphers from *The Magnus Archives Roleplaying Game*, chapter 6 (p105-113), the d00 Cypher Table (p107), and the two sub-tables rolled by Learn From The Web (p109) and Librarian's Pupil (p110). It replaces the Cypher V2 catalogue.

The catalog is generated, not hand-edited. The authored list is `scripts/content/magnus-cyphers.mjs`; rebuild the catalog and the packs with:

```bash
node scripts/build-magnus-cyphers.mjs
pnpm import:cyphers
```

Magnus cyphers roll their level (for example `1d6 + 2`). Each entry keeps that formula in `levelFormula`, shown at the top of the description and in `flags.magnusarchives.cypherImport`. A fixed printed level (Cheating Death, Lesson of The Boneturner: 10) also sets `level` with `levelOverride`. Cyphers marked "(instant)" in the book have `instant: true` and the `instant` tag.

The importer validates source IDs, source ordering, d00 coverage, references, deterministic document IDs, and LevelDB keys before replacing only `packs/cyphers/` and `packs/cypher-tables/`. It refuses every other destination.

Effect text is paraphrased; the mechanics are kept faithfully. Rusty Quill's IP is not covered by the Cypher Open License. Resolve the `source-license` review issue before publicly redistributing the generated text.
