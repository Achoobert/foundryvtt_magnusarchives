import registerSystemBatch from "./batches/system.js";
import registerActorsBatch from "./batches/actors.js";
import registerItemsBatch from "./batches/items.js";
import registerSheetsBatch from "./batches/sheets.js";

const BATCH_REGISTRARS = [registerSystemBatch, registerActorsBatch, registerItemsBatch, registerSheetsBatch];

Hooks.on("quenchReady", (quench) => {
  for (const register of BATCH_REGISTRARS) register(quench);
});
