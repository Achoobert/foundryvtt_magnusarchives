import {describe, expect, it} from "vitest";

import {ARC_XP, CHARACTER_ARCS, characterArc} from "../../src/creation/character-arcs";

describe("Character Arc catalog", () => {
  it("lists every Magnus Archives arc once, by unique key", () => {
    const keys = CHARACTER_ARCS.map((arc) => arc.key);
    expect(new Set(keys).size).toBe(keys.length);
    expect(CHARACTER_ARCS).toHaveLength(37);
    expect(CHARACTER_ARCS.map((arc) => arc.name)).toEqual(
      expect.arrayContaining(["Aid a Friend", "Fall From Grace", "Solve a Mystery", "Undo a Wrong"])
    );
  });

  it("gives each arc a summary and every beat", () => {
    for (const arc of CHARACTER_ARCS) {
      expect(arc.key).toMatch(/^[a-z]+(?:-[a-z]+)*$/);
      expect(arc.summary.length).toBeGreaterThan(10);
      expect(arc.beats.opening).not.toBe("");
      expect(arc.beats.steps.length).toBeGreaterThan(0);
      expect(arc.beats.climax).not.toBe("");
      expect(arc.beats.resolution).not.toBe("");
    }
  });

  it("looks arcs up by key and records the arc XP rewards", () => {
    expect(characterArc("explore")?.name).toBe("Explore");
    expect(characterArc("missing")).toBeUndefined();
    expect(ARC_XP).toEqual({step: 2, climaxSuccess: 4, climaxFailure: 2, resolution: 1});
  });
});
