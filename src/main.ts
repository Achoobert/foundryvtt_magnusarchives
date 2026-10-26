import "../styles/index.scss";

import {createMagnusArchivesApi} from "./api/magnusarchives-api";
import {registerDataModels} from "./config/data-models";
import {registerDocumentClasses} from "./config/documents";
import {registerSettings} from "./config/settings";
import {registerSheets} from "./config/sheets";
import {SYSTEM_ID} from "./constants/system";
import {registerCoreRuleModule} from "./rules/core-rule-module";
import {RuleRegistry} from "./rules/rule-registry";
import {createCoreServices} from "./services";
import {CORE_THEME} from "./themes/core-theme";
import {ThemeRegistry} from "./themes/theme-registry";
import {SETTING_KEYS} from "./config/settings";
import {registerGMIntrusionSceneControl} from "./intrusions/gm-intrusion-scene-control";
import {initializeGMIntrusionController} from "./intrusions/gm-intrusion-controller";
import {initializeCombatChatController} from "./combat/combat-chat-controller";
import {initializeNpcDeadStatusSynchronization} from "./services/combat-status-service";
import {initializeItemChatController} from "./items/item-chat-controller";
import {migrateLegacyTypeGenres} from "./genre/genre-migration";
import {initializeChatCardEntrance} from "./chat/chat-card-entrance";
import {initializePlayerIntrusionController} from "./intrusions/player-intrusion-controller";
import {initializeCombatTrackerDoneReset, registerCombatTracker} from "./applications/combat-tracker";
import {registerCombatTurnMarker, registerGamePause} from "./applications/game-pause";
import {initializeBlankCanvasBackground} from "./canvas/blank-canvas-background";
import {
  prepareCharacterGenreCompendiumIndexes,
  registerGenreCompendiumIndexFields
} from "./genre/genre-compendium-index";

Hooks.once("init", async () => {
  console.info(`${SYSTEM_ID} | Initializing`);

  const rules = new RuleRegistry();
  registerCoreRuleModule(rules);
  const themes = new ThemeRegistry();
  themes.register(CORE_THEME);

  registerGenreCompendiumIndexFields();

  game.magnusarchives = createMagnusArchivesApi(rules, createCoreServices(rules), themes);

  registerDocumentClasses();
  registerDataModels();
  registerSheets();
  registerCombatTracker();
  registerGamePause();
  registerCombatTurnMarker();
  registerGMIntrusionSceneControl();

  Hooks.callAll("magnusarchives.registerRules", rules);
  Hooks.callAll("magnusarchives.registerThemes", themes);
  registerSettings(themes);
  await foundry.applications.handlebars.loadTemplates(["systems/magnusarchives/templates/focus/focus-tree.hbs"]);
});

Hooks.once("ready", async () => {
  initializeBlankCanvasBackground();
  const selectedTheme = String(game.settings.get(SYSTEM_ID, SETTING_KEYS.theme));
  game.magnusarchives.themes.apply(game.magnusarchives.themes.has(selectedTheme) ? selectedTheme : "core");
  initializeGMIntrusionController(game.magnusarchives.services.intrusions, game.magnusarchives.services.intrusionChat);
  initializePlayerIntrusionController(
    game.magnusarchives.services.playerIntrusions,
    game.magnusarchives.services.playerIntrusionChat
  );
  initializeCombatChatController();
  initializeItemChatController();
  initializeChatCardEntrance();
  initializeNpcDeadStatusSynchronization(game.magnusarchives.services.combatStatuses);
  initializeCombatTrackerDoneReset();
  await prepareCharacterGenreCompendiumIndexes();
  await migrateLegacyTypeGenres();
  console.info(`${SYSTEM_ID} | Ready`);
});
