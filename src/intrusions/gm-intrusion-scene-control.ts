import {promptManualGMIntrusion} from "../applications/dialogs/gm-intrusion-dialog";
import {promptHorrorMode} from "../applications/dialogs/horror-mode-dialog";

interface SceneControlToolLike {
  name: string;
  title: string;
  icon: string;
  order: number;
  button: boolean;
  visible: boolean;
  onChange: () => void;
}

interface SceneControlLike {
  tools?: Record<string, SceneControlToolLike>;
}

export function registerGMIntrusionSceneControl(): void {
  Hooks.on("getSceneControlButtons", (controls: Record<string, SceneControlLike>) => {
    const tokens = controls.tokens;
    if (!tokens) return;
    const tools = tokens.tools ?? (tokens.tools = {});
    const intrusionOrder = Object.keys(tools).length;
    tools.magnusarchivesGMIntrusion = {
      name: "magnusarchivesGMIntrusion",
      title: "MAGNUSARCHIVES.Intrusion.SceneControl",
      icon: "fa-solid fa-bolt",
      order: intrusionOrder,
      button: true,
      visible: game.user.isGM,
      onChange: () => void promptManualGMIntrusion()
    };
    tools.magnusarchivesHorrorMode = {
      name: "magnusarchivesHorrorMode",
      title: "MAGNUSARCHIVES.Horror.SceneControl",
      icon: "fa-solid fa-skull",
      order: intrusionOrder + 1,
      button: true,
      visible: game.user.isGM,
      onChange: () => void promptHorrorMode()
    };
  });
}
