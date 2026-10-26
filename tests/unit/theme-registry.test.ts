import {describe, expect, it, vi} from "vitest";

import {CORE_THEME} from "../../src/themes/core-theme";
import {ThemeRegistry, type ThemeTarget} from "../../src/themes/theme-registry";

function target(): ThemeTarget & {values: Map<string, string>} {
  const values = new Map<string, string>();
  return {
    values,
    dataset: {},
    style: {
      setProperty: vi.fn((name: string, value: string) => values.set(name, value)),
      removeProperty: vi.fn((name: string) => (values.delete(name) ? "removed" : ""))
    }
  };
}

describe("ThemeRegistry", () => {
  it("registers and selects the Core theme", () => {
    const registry = new ThemeRegistry();
    registry.register(CORE_THEME);
    const root = target();

    const selected = registry.apply("core", root);

    expect(registry.has("core")).toBe(true);
    expect(registry.choices()).toEqual({core: "MAGNUSARCHIVES.Themes.Core"});
    expect(selected.id).toBe("core");
    expect(root.dataset.magnusarchivesTheme).toBe("core");
    expect(root.values.get("--magnusarchives-color-bg")).toBe("var(--magnusarchives-surface-primary)");
    expect(root.values.get("--magnusarchives-surface-primary")).toBe("#1b1c1f");
    expect(root.values.get("--magnusarchives-surface-secondary")).toBe("#25262a");
    expect(root.values.get("--magnusarchives-surface-raised")).toBe("#303136");
    expect(root.values.get("--magnusarchives-text-primary")).toBe("#f3f4f6");
    expect(root.values.get("--magnusarchives-text-muted")).toBe("#a9acb2");
    expect(root.values.get("--magnusarchives-accent")).toBe("#96082a");
    expect(root.values.get("--magnusarchives-accent-hover")).toBe("#bd123f");
    expect(root.values.get("--magnusarchives-border")).toBe("#484a50");
    expect(root.values.get("--magnusarchives-danger")).toBe("#d85b66");
    expect(root.values.get("--magnusarchives-success")).toBe("#5fa878");
    expect(root.values.get("--magnusarchives-wound-pip-character")).toBe("var(--magnusarchives-danger)");
    expect(root.values.get("--magnusarchives-wound-pip-shield")).toBe("#8fc7ea");
    expect(root.values.get("--magnusarchives-rank-expert")).toBe("#c4a7e7");
    expect(root.values.get("--magnusarchives-rank-specialized")).toBe("#8fc7ea");
    expect(root.values.get("--magnusarchives-rank-trained")).toBe("#85c99a");
    expect(root.values.get("--magnusarchives-rank-untrained")).toBe("#a9acb2");
    expect(root.values.get("--magnusarchives-rank-inability")).toBe("var(--magnusarchives-danger)");
    expect(root.values.get("--magnusarchives-cypher-power-low")).toBe("#a9acb2");
    expect(root.values.get("--magnusarchives-cypher-power-medium")).toBe("#85c99a");
    expect(root.values.get("--magnusarchives-cypher-power-advanced")).toBe("#8fc7ea");
    expect(root.values.get("--magnusarchives-cypher-power-high")).toBe("#c4a7e7");
    expect(root.values.get("--magnusarchives-cypher-power-ultra")).toBe("#e4a46d");
    expect(root.values.get("--magnusarchives-pool-gauge-low")).toBe("#8f4d55");
    expect(root.values.get("--magnusarchives-pool-gauge-high")).toBe("#567961");
    expect(root.values.get("--magnusarchives-scrollbar-thumb")).toBe("var(--magnusarchives-color-border)");
    expect(root.values.get("--magnusarchives-space")).toBe("0.65rem");
    expect(root.values.get("--magnusarchives-space-page")).toBe("0.85rem");
    expect(root.values.get("--magnusarchives-space-compact")).toBe("0.35rem");
    expect(root.values.get("--magnusarchives-space-tight")).toBe("0.2rem");
  });

  it("allows an extension to register and select another CSS-property theme", () => {
    const registry = new ThemeRegistry();
    registry.register(CORE_THEME);
    registry.register({
      id: "example",
      label: "Example",
      sourceId: "example.module",
      properties: {"--magnusarchives-color-accent": "#ffffff"}
    });
    const root = target();

    registry.apply("core", root);
    registry.apply("example", root);

    expect(root.dataset.magnusarchivesTheme).toBe("example");
    expect(root.values.get("--magnusarchives-color-accent")).toBe("#ffffff");
    expect(root.values.has("--magnusarchives-color-bg")).toBe(false);
  });

  it("rejects duplicate themes and unscoped custom properties", () => {
    const registry = new ThemeRegistry();
    registry.register(CORE_THEME);
    expect(() => registry.register(CORE_THEME)).toThrow("already registered");
    expect(() =>
      registry.register({
        id: "invalid",
        label: "Invalid",
        sourceId: "test",
        properties: {"--unscoped": "red"}
      })
    ).toThrow("--magnusarchives- prefix");
  });
});
