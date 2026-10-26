import {readFile} from "node:fs/promises";
import path from "node:path";
import {describe, expect, it} from "vitest";

import {FocusEvaluator} from "../../src/focus/focus-evaluator";
import {validateFocusGraph} from "../../src/focus/focus-graph-validator";
import type {FocusGraph} from "../../src/focus/focus-types";

const projectRoot = path.resolve(import.meta.dirname, "../..");
const source = JSON.parse(await readFile(path.join(projectRoot, "content/core-items/reviewed-packs.json"), "utf8"));

interface ItemDocument {
  _id: string;
  _key: string;
  name: string;
  folder: string | null;
  system: Record<string, any>;
}

function items(packId: string): ItemDocument[] {
  return source.packs[packId].documents.filter((document: ItemDocument) => document._key.startsWith("!items!"));
}

const foci = items("foci");
const abilities = items("focus-abilities");
const abilityIds = new Set(abilities.map((document) => document._id));

function focus(name: string): ItemDocument {
  const found = foci.find((document) => document.name === name);
  if (!found) throw new Error(`Missing focus ${name}.`);
  return found;
}

describe("Magnus foci (chapter 4) and Avatars (p89)", () => {
  it("ships the 18 foci and one Avatar focus per Entity that has Avatars", () => {
    expect(foci.filter((document) => !document.system.tags.includes("avatar"))).toHaveLength(18);
    expect(foci.filter((document) => document.system.tags.includes("avatar"))).toHaveLength(14);
    expect(foci.map((document) => document.name)).not.toContain("Serves as an Avatar: The Extinction");
  });

  it("resolves every graph node to a focus-abilities document", () => {
    for (const document of foci) {
      for (const node of document.system.graph.nodes) {
        const match = node.abilityUuid.match(/^Compendium\.magnusarchives\.focus-abilities\.Item\.([a-f0-9]{16})$/);
        expect(match, `${document.name} / ${node.id}`).not.toBeNull();
        expect(abilityIds.has(match![1])).toBe(true);
      }
    }
  });

  it("passes the focus graph validator with no errors", () => {
    for (const document of foci) {
      const errors = validateFocusGraph(document.system.graph as FocusGraph).filter((entry) => entry.severity === "error");
      expect(errors, document.name).toEqual([]);
    }
  });

  it("unlocks tiers in order and offers both sides of an ability choice", () => {
    const graph = focus("Carries a Gun").system.graph as FocusGraph;
    const evaluator = new FocusEvaluator();
    const owned = ["t1-gunner", "t1-practiced-with-guns", "t2-careful-shot"];
    const states = new Map(evaluator.evaluate(graph, {tier: 3, ownedNodeIds: owned}).nodes.map((entry) => [entry.node.id, entry.state]));
    expect(states.get("t3-trained-gunner")).toBe("available");
    expect(states.get("t3-damage-dealer")).toBe("available");
    expect(states.get("t4-snap-shot")).toBe("locked");
  });

  it("keeps the book's tier placement and costs", () => {
    const leads = focus("Leads").system.graph.nodes.map((node: {id: string; tier: number}) => `${node.tier}:${node.id}`);
    expect(leads).toContain("2:t2-enhanced-potential");
    expect(leads).toContain("4:t4-captivate-or-inspire");

    const moves = focus("Moves Like a Cat").system.graph.nodes.filter((node: {tier: number}) => node.tier === 3);
    expect(moves.map((node: {id: string}) => node.id)).toEqual(["t3-enhanced-speed-edge", "t3-greater-enhanced-speed", "t3-hard-to-hit"]);

    const murderer = abilities.find((document) => document.system.slug === "fights-dirty-murderer")!;
    expect(murderer.system.cost).toEqual({amount: 8, scalable: true, ignoresEdge: false, allowedPools: ["might"]});
    expect(murderer.system.tier).toBe(6);
    expect(murderer.system.activation).toBe("action");
  });

  it("marks Avatar powers as supernatural with their Stress cost", () => {
    const sense = abilities.find((document) => document.system.slug === "avatar-sense-supernatural-activity")!;
    expect(sense.system.tags).toContain("supernatural");
    expect(sense.system.stressAmount).toBe(2);
    const avatar = focus("Serves as an Avatar: The Eye");
    expect(avatar.system.graph.nodes.filter((node: {tier: number}) => node.tier === 4)).toHaveLength(3);
    expect(avatar.system.graph.nodes[0].abilityUuid).toBe(focus("Serves as an Avatar: The Web").system.graph.nodes[0].abilityUuid);
  });
});
