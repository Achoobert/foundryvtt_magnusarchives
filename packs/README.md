# Compendium packs

Every pack listed in `system.json` is compiled from editable YAML in `yml_source/<pack>/`. That YAML is the source of truth. The LevelDB directories here are build output and are gitignored.

Each document is one `.yml` file, nested by its Foundry folder. A folder's own document is the `_Folder.yml` inside it. To add or change content, edit the YAML and rebuild:

```bash
pnpm packs:build
```

`pnpm build` and `pnpm watch` both run it, and the watcher rebuilds whenever `yml_source/` changes.

To pull edits made in a running Foundry back into YAML, unlock the compendium in the world, edit it, copy the pack directory back into `packs/`, and run:

```bash
pnpm packs:extract            # every pack
pnpm packs:extract -- skills  # only the named packs
```

Extraction replaces `yml_source/<pack>/` wholesale, so commit or stash YAML edits first. Keep `_id` values stable: other documents reference them through `Compendium.magnusarchives.<pack>.Item.<id>` UUIDs.

Compendium content must comply with the current Cypher Open License and record provenance in `legal/CONTENT-SOURCES.md`. Source PDFs and scans must never be committed.
