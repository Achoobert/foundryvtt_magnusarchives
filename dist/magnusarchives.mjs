const U = "magnusarchives", Pr = "0.1.0";
const ie = [
  "inability",
  "untrained",
  "trained",
  "specialized",
  "expert"
], Os = ["choose", "might", "speed", "intellect"], Le = ["light", "medium", "heavy"], Bs = ["melee", "ranged"], Gn = ["immediate", "short", "long", "very-long", "specified"], je = ["light", "medium", "heavy"], Ls = ["block", "blockWithShield", "dodge"], xr = ["d6", "d10", "d20"], Kn = ["subtle", "manifest"], Xn = ["low", "medium", "advanced", "high", "ultra"], ge = ["minor", "moderate", "major"], Bt = ["hale", "hurt", "impaired", "debilitated", "dead"], xi = ["none", "stress", "seriousInjury"];
const Un = [
  "inexpensive",
  "moderate",
  "expensive",
  "veryExpensive",
  "exorbitant",
  "priceless"
], js = [
  "action",
  "firstAction",
  "lastAction",
  "enabler",
  "reaction",
  "timed",
  "perpetual",
  "passive",
  "special"
], Ga = ["none", "might", "speed", "intellect", "choose"], Ws = ["none", "task", "attack", "defense"], _s = ["none", "single", "multiple"], ke = ["one-action", "10-minutes", "1-hour", "10-hours"], qr = ["normal", "nonRest"], Or = ["10-minutes", "1-hour", "10-hours"];
function Br(n, e, t) {
  return Object.freeze({
    version: Pr,
    rules: n,
    services: e,
    themes: t
  });
}
const Lr = Bt.filter(
  (n) => n !== "hurt"
);
function ti(n) {
  return n ? Bt : Lr;
}
function ki(n) {
  return Math.floor(Math.max(0, n) / 3);
}
function Ks(n) {
  const e = Math.max(0, n) % 3;
  return e === 0 ? 3 : 3 - e;
}
function Xs(n, e) {
  return Math.max(0, Math.max(0, n) - Math.max(0, Math.floor(e)) * 3);
}
function Et(n, e) {
  return ti(e).includes(n) ? n : "hale";
}
function jr(n, e, t = 1) {
  const i = ti(e), a = i.indexOf(Et(n, e)), s = Math.min(i.length - 1, a + Math.max(0, t));
  return i[s] ?? "dead";
}
function Wr(n, e, t = 1) {
  const i = ti(e), a = i.indexOf(Et(n, e)), s = Math.max(0, a - Math.max(0, t));
  return i[s] ?? "hale";
}
const _r = Object.freeze({
  effortSurcharge: 0,
  ignoresSpecialEffects: !1,
  reducedSpecialDamage: !1,
  moveOnly: !1,
  dead: !1
}), Ys = Object.freeze({
  effortSurcharge: 1,
  ignoresSpecialEffects: !0,
  reducedSpecialDamage: !0,
  moveOnly: !1,
  dead: !1
}), Js = Object.freeze({
  ...Ys,
  moveOnly: !0
}), Kr = Object.freeze({
  ...Js,
  dead: !0
});
function Xr(n) {
  switch (n) {
    case "impaired":
      return Ys;
    case "debilitated":
      return Js;
    case "dead":
      return Kr;
    default:
      return _r;
  }
}
const k = ["might", "speed", "intellect"], ii = {
  "one-action": "oneAction",
  "10-minutes": "tenMinutes",
  "1-hour": "oneHour",
  "10-hours": "tenHours"
};
function It(n = !1) {
  return { oneAction: n, tenMinutes: n, oneHour: n, tenHours: n };
}
function Qs(n) {
  return ke.filter((e) => !n[ii[e]]);
}
let Ua = 0;
const _e = () => {
  const n = globalThis.crypto?.randomUUID;
  return n ? n.call(globalThis.crypto) : (Ua += 1, `magnusarchives-${Date.now()}-${Ua}`);
};
function j(n) {
  if (n.type !== "character") throw new Error("Core Character services require a Character Actor.");
}
function qe(n) {
  if (j(n), n.system.derived.damageTrack.dead) throw new Error("A dead Character cannot use this service.");
}
function yt(n) {
  return {
    minor: n.minor.map((e) => ({ ...e })),
    moderate: n.moderate.map((e) => ({ ...e })),
    major: n.major.map((e) => ({ ...e }))
  };
}
const Zi = [
  "tier",
  "effort",
  "mightMax",
  "mightEdge",
  "speedMax",
  "speedEdge",
  "intellectMax",
  "intellectEdge"
];
function Yr() {
  return {
    tier: null,
    effort: null,
    stats: {
      might: { max: null, edge: null },
      speed: { max: null, edge: null },
      intellect: { max: null, edge: null }
    },
    wounds: { minor: 0, moderate: 0, major: 0 }
  };
}
function St(n, e) {
  return Number.isInteger(e) ? Number(e) : n;
}
function Yn(n) {
  return n.startsWith("might") ? "might" : n.startsWith("speed") ? "speed" : n.startsWith("intellect") ? "intellect" : null;
}
function vt(n) {
  return n === "tier" || n === "effort" ? `system.overrides.${n}` : `system.overrides.stats.${Yn(n)}.${n.endsWith("Max") ? "max" : "edge"}`;
}
function fi(n, e, t) {
  if (!Number.isFinite(t)) throw new Error("Character progression delta must be finite.");
  if (e === "tier") {
    const l = Number.isInteger(n.overrides?.tier);
    return {
      path: l ? vt(e) : "system.tier",
      value: (l ? Number(n.overrides.tier) : n.tier) + t,
      overrideActive: l
    };
  }
  if (e === "effort") {
    const l = Number.isInteger(n.overrides?.effort);
    return {
      path: l ? vt(e) : "system.stats.effortBase",
      value: (l ? Number(n.overrides.effort) : n.stats.effortBase) + t,
      overrideActive: l
    };
  }
  const i = Yn(e), a = e.endsWith("Max") ? "max" : "edge", s = n.overrides?.stats?.[i]?.[a], o = Number.isInteger(s), r = a === "max" ? n.stats[i].baseMax : n.stats[i].baseEdge;
  return {
    path: o ? vt(e) : `system.stats.${i}.${a === "max" ? "baseMax" : "baseEdge"}`,
    value: (o ? Number(s) : r) + t,
    overrideActive: o
  };
}
function L(n) {
  return n.derived?.tier?.value ?? St(n.tier, n.overrides?.tier);
}
function kn(n, e) {
  if (e === "tier") return {
    key: e,
    path: vt(e),
    calculated: n.derived.tier.calculated,
    override: n.overrides?.tier ?? null,
    effective: n.derived.tier.value,
    minimum: 1
  };
  if (e === "effort") return {
    key: e,
    path: vt(e),
    calculated: n.derived.effort.calculatedMax,
    override: n.overrides?.effort ?? null,
    effective: n.derived.effort.max,
    minimum: 0
  };
  const t = Yn(e), i = e.endsWith("Max") ? "max" : "edge", a = n.derived.pools[t];
  return {
    key: e,
    path: vt(e),
    calculated: i === "max" ? a.calculatedMax : a.calculatedEdge,
    override: n.overrides?.stats?.[t]?.[i] ?? null,
    effective: a[i],
    minimum: i === "max" ? 1 : -20
  };
}
const Jr = [
  { id: "core-recovery-action", type: "one-action" },
  { id: "core-recovery-ten-minutes", type: "10-minutes" },
  { id: "core-recovery-one-hour", type: "1-hour" },
  { id: "core-recovery-ten-hours", type: "10-hours" }
];
function lt(n = It(!1)) {
  return Jr.map((e) => ({
    ...e,
    used: n[ii[e.type]]
  }));
}
function Qr(n, e = It(!1)) {
  if (!Array.isArray(n) || n.length === 0) return lt(e);
  const t = /* @__PURE__ */ new Set(), i = [];
  for (const a of n) {
    if (!a || typeof a != "object") continue;
    const s = a, o = typeof s.id == "string" ? s.id.trim() : "", r = String(s.type ?? "");
    !o || t.has(o) || !ke.includes(r) || (t.add(o), i.push({ id: o, type: r, used: s.used === !0 }));
  }
  return i.length > 0 ? i : lt(e);
}
function Rt(n) {
  const e = It(!1);
  for (const t of ke) {
    const i = n.filter((a) => a.type === t);
    e[ii[t]] = i.length > 0 && i.every((a) => a.used);
  }
  return e;
}
function Lt(n) {
  return n.filter((e) => !e.used).map((e) => ({ ...e }));
}
function ka(n, e, t) {
  const i = n.find((a) => a.id === e && a.type === t);
  if (!i) throw new Error(`Recovery slot '${e}' is not available for '${t}'.`);
  if (i.used) throw new Error(`Recovery slot '${e}' has already been used today.`);
  return t === "10-hours" ? n.map((a) => ({ ...a, used: !1 })) : n.map((a) => a.id === e ? { ...a, used: !0 } : { ...a });
}
function Zr(n) {
  const e = It(!1);
  for (const t of ke)
    e[ii[t]] = n.some((i) => i.type === t && i.used);
  return lt(e);
}
const el = Object.freeze({
  stressPoints: 0,
  damageTrackStep: "hale",
  hurtAvailable: !1
}), en = Object.freeze({
  light: 1,
  medium: 2,
  heavy: 3
});
function be(n) {
  return n.reduce((e, t) => e + t.value, 0);
}
function we(n, e, t, i, a) {
  return { id: n, sourceId: e, sourceType: t, label: i, value: a };
}
function tl(n, e, t, i = {}, a = [], s = { armorCategories: [], freelyUse: [] }, o = 0, r = {
  weaponCategories: [],
  weaponFamilies: [],
  armorCategories: [],
  genre: "none",
  genreUuid: "",
  totalEffortCapMode: "core",
  typeNames: [],
  descriptorNames: [],
  speciesNames: [],
  characterSentence: ""
}, l = 2, u = 1, d = Yr(), p = 0, y = [], m = el) {
  const h = {};
  for (const N of k) {
    const S = [
      we(
        `pool.${N}.max.base`,
        `system.stats.${N}.baseMax`,
        "base",
        `${N} base maximum`,
        n[N].baseMax
      ),
      ...i.poolMax?.[N] ?? []
    ], J = [
      we(
        `pool.${N}.edge.base`,
        `system.stats.${N}.baseEdge`,
        "base",
        `${N} base Edge`,
        n[N].baseEdge
      ),
      ...i.poolEdge?.[N] ?? []
    ], Ke = be(S), mi = be(J);
    h[N] = {
      calculatedMax: Ke,
      calculatedEdge: mi,
      max: St(Ke, d.stats?.[N]?.max),
      edge: St(mi, d.stats?.[N]?.edge),
      maxContributions: S,
      edgeContributions: J
    };
  }
  const f = [
    we(
      "effort.max.base",
      "system.stats.effortBase",
      "base",
      "Base Effort",
      n.effortBase ?? 0
    ),
    ...i.effortMax ?? []
  ], A = Math.max(0, be(f)), v = [
    we(
      "recovery.bonus.base",
      "system.recovery.bonus",
      "base",
      "Permanent Recovery bonus",
      o
    ),
    ...i.recoveryBonus ?? []
  ], E = be(v), H = [
    we("cypher-limit.base", "system.cypherLimitBase", "base", "Base Cypher Limit", l),
    ...i.cypherLimit ?? []
  ], R = {}, G = {}, P = {};
  for (const N of ge) {
    const S = [
      we(
        `wound.${N}.capacity.core`,
        "magnusarchives.core",
        "core",
        `${N} Wound capacity`,
        3
      ),
      ...i.woundCapacity?.[N] ?? []
    ], J = Math.max(1, be(S)), Ke = d.wounds?.[N] ?? 0;
    G[N] = J, R[N] = Ke === 0 ? S : [...S, we(
      `wound.${N}.capacity.manual`,
      `system.overrides.wounds.${N}`,
      "base",
      `Manual ${N} Wound capacity modifier`,
      Ke
    )], P[N] = Math.max(1, J + Ke);
  }
  const X = [];
  e.moderate.length >= P.moderate && X.push(
    we(
      "wound.moderate.full.hindrance",
      "magnusarchives.core",
      "core",
      "Moderate Wounds full",
      1
    )
  );
  for (const N of e.major)
    X.push(
      we(
        `wound.major.${N.id}.hindrance`,
        N.id,
        "wound",
        N.label || "Major Wound",
        1
      )
    );
  const M = Math.max(0, m.stressPoints), D = ki(M);
  D > 0 && X.push(
    we(
      "stress.level.hindrance",
      "magnusarchives.core",
      "stress",
      `Stress Level ${D}`,
      D
    )
  ), X.push(...i.hindrance ?? []);
  const ne = [...a].filter((N) => N.type === "armor" && N.system.equipped).some((N) => N.system.grantsHurtStep !== !1), _ = m.hurtAvailable || ne || (i.hurtStep?.length ?? 0) > 0, He = Et(m.damageTrackStep, _), O = Xr(He), Q = [...a].filter((N) => N.type === "armor" && N.system.equipped).filter((N) => je.includes(N.system.category)).sort((N, S) => en[S.system.category] - en[N.system.category] || N.id.localeCompare(S.id))[0], $e = Q?.system.category ?? "none", Se = Q ? en[Q.system.category] : 0, Ie = Q ? s.armorCategories.includes(Q.system.category) : !0, ce = (N, S, J) => Q && J > 0 ? [we(
    `armor.${Q.id}.${N}`,
    Q.id,
    "item",
    S,
    J
  )] : [], Z = ce("block", "Armor: Block", Se), Ae = ce("dodge", "Armor: Dodge", Se), pe = ce(
    "speed-task",
    "Armor: Speed task",
    Math.max(Q?.system.speedTaskHindrance ?? 0, Ie ? 0 : Se)
  );
  return {
    tier: {
      calculated: u,
      value: St(u, d.tier)
    },
    pools: h,
    effort: {
      calculatedMax: A,
      max: Math.max(0, St(A, d.effort)),
      contributions: f
    },
    stress: {
      value: M,
      level: D,
      toNextLevel: Ks(M),
      hindrance: D
    },
    damageTrack: {
      step: He,
      hurtAvailable: _,
      steps: [...ti(_)],
      effortSurcharge: O.effortSurcharge,
      ignoresSpecialEffects: O.ignoresSpecialEffects,
      reducedSpecialDamage: O.reducedSpecialDamage,
      moveOnly: O.moveOnly,
      dead: O.dead
    },
    totalHindrance: be(X),
    wounds: {
      calculatedCapacities: G,
      capacities: P,
      capacityContributions: R,
      hindrance: be(X),
      hindranceContributions: X,
      dead: e.major.length >= P.major
    },
    recovery: {
      formula: Ha(E + p),
      calculatedFormula: Ha(E),
      calculatedBonus: E,
      manualModifier: p,
      bonus: E + p,
      bonusContributions: v,
      availableTypes: y.length > 0 ? [...new Set(Lt(y).map((N) => N.type))] : Qs(t)
    },
    cypherLimit: { max: Math.max(0, be(H)), contributions: H },
    combat: {
      armor: {
        itemId: Q?.id ?? "",
        category: $e,
        freelyUsed: Ie,
        blockEase: be(Z),
        dodgeHindrance: be(Ae),
        speedTaskHindrance: be(pe),
        blockContributions: Z,
        dodgeContributions: Ae,
        speedTaskContributions: pe
      }
    },
    packages: r
  };
}
function Ha(n) {
  return n === 0 ? "1d6 + Tier" : `1d6 + Tier ${n > 0 ? "+" : "-"} ${Math.abs(n)}`;
}
const {
  ArrayField: Jn,
  BooleanField: qi,
  HTMLField: Zs,
  NumberField: Nt,
  ObjectField: il,
  SchemaField: kt,
  StringField: he
} = foundry.data.fields, c = {
  ArrayField: Jn,
  BooleanField: qi,
  HTMLField: Zs,
  NumberField: Nt,
  ObjectField: il,
  SchemaField: kt,
  StringField: he
};
function w(n = 0, e = 0) {
  return new Nt({ required: !0, nullable: !1, integer: !0, min: e, initial: n });
}
function ee(n = []) {
  return new Jn(
    new he({ required: !0, nullable: !1, blank: !1 }),
    { required: !0, nullable: !1, initial: [...n] }
  );
}
function tn(n = 10) {
  return new kt({
    value: w(n),
    baseMax: w(n, 1),
    baseEdge: w(0, -20),
    max: new Nt({
      required: !0,
      nullable: !1,
      integer: !0,
      min: 1,
      initial: n,
      persisted: !1
    }),
    edge: new Nt({
      required: !0,
      nullable: !1,
      integer: !0,
      min: -20,
      initial: 0,
      persisted: !1
    })
  });
}
function Ct() {
  return new kt({
    id: new he({ required: !0, nullable: !1, blank: !1 }),
    label: new he({ required: !0, nullable: !1, initial: "" }),
    description: new Zs({ required: !0, nullable: !1, initial: "" }),
    sourceUuid: new he({ required: !0, nullable: !1, initial: "" }),
    treated: new qi({ required: !0, nullable: !1, initial: !1 })
  });
}
function nl() {
  return new kt({
    id: new he({ required: !0, nullable: !1, blank: !1 }),
    sourceId: new he({ required: !0, nullable: !1, blank: !1 }),
    sourceType: new he({
      required: !0,
      nullable: !1,
      choices: ["base", "core", "rule-module", "wound", "item"]
    }),
    label: new he({ required: !0, nullable: !1, initial: "" }),
    value: new Nt({ required: !0, nullable: !1, integer: !0, initial: 0 })
  });
}
function fe() {
  return new Jn(nl(), {
    required: !0,
    nullable: !1,
    initial: [],
    persisted: !1
  });
}
function al() {
  return new kt({
    enabled: new qi({ required: !0, nullable: !1, initial: !1 }),
    trigger: new he({
      required: !0,
      nullable: !1,
      initial: "recovery",
      choices: [
        "recovery",
        "10-minute-or-longer",
        "1-hour-or-longer",
        "10-hour",
        "non-rest-recovery"
      ]
    })
  });
}
function Oi(n = "") {
  return new kt({
    enabled: new qi({ required: !0, nullable: !1, initial: !1 }),
    die: new he({
      required: !0,
      nullable: !1,
      initial: "d6",
      validate: (e) => /^d(?:[2-9]|[1-9]\d{1,2}|1000)$/i.test(e)
    }),
    formula: new he({ required: !0, nullable: !1, initial: n }),
    threshold: new Nt({
      required: !0,
      nullable: !1,
      integer: !0,
      min: 1,
      initial: 1
    })
  });
}
class eo extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      schemaVersion: w(1, 1),
      description: new c.HTMLField({ required: !0, nullable: !1, initial: "" }),
      notes: new c.HTMLField({ required: !0, nullable: !1, initial: "" }),
      gmNotes: new c.HTMLField({ required: !0, nullable: !1, initial: "" })
    };
  }
}
const Qn = [
  "increaseCapabilities",
  "moveTowardPerfection",
  "extraEffort",
  "skillTraining"
], to = [
  "recovery",
  "focus",
  "armor",
  "weapons",
  "genre"
], sl = [...Qn, "other"], io = [
  "characterCreation",
  "additionalFocus",
  "otherAdvancement",
  "newTier"
], ol = ["otherAdvancement", "newTier"], no = Object.freeze({
  xpCost: 4,
  purchasesPerTier: 4,
  capabilityPoints: 4,
  effortMaximum: 6,
  recoveryBonus: 2,
  genreChoiceForTier: (n) => n >= 3 && n % 3 === 0,
  attackDefenseTrainingTier: 2,
  attackDefenseSpecializationTier: 4
}), ao = ["axes", "knives", "swords"];
function ct(n) {
  const e = String(n ?? "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").trim().toLocaleLowerCase("en-US").replace(/[^\p{Letter}\p{Number}]+/gu, "-").replace(/^-+|-+$/g, "");
  return e === "none" ? "" : e;
}
function le(n) {
  const e = Array.isArray(n) ? n : typeof n == "string" ? n.split(/[,;\n]/) : [];
  return [...new Set(e.map(ct).filter(Boolean))];
}
function At(n) {
  return ct(n).split("-").filter(Boolean).map((e) => `${e[0]?.toLocaleUpperCase("en-US") ?? ""}${e.slice(1)}`).join(" ");
}
function Bi(n) {
  return !n || typeof n != "object" || Array.isArray(n) ? [] : le(Object.entries(n).filter(([, e]) => e === !0).map(([e]) => e));
}
const rl = [
  "Accuracy",
  "Strength",
  "Dexterity",
  "Resilience",
  "Intelligence",
  "Single Attack",
  "Power",
  "Flight",
  "Healing",
  "Increased Range",
  "Prodigy",
  "Savant",
  "Custom"
];
function so(n) {
  if (!n || typeof n != "object" || Array.isArray(n)) return null;
  const e = n, t = String(e.id ?? "").trim(), i = String(e.category ?? "").trim(), a = Number(e.shifts);
  return !t || !i || !Number.isInteger(a) || a < 1 ? null : {
    id: t,
    category: i,
    shifts: a,
    specification: String(e.specification ?? e.label ?? "").trim(),
    description: String(e.description ?? "").trim()
  };
}
function oo(n) {
  if (!Array.isArray(n)) return [];
  const e = /* @__PURE__ */ new Set(), t = [];
  for (const i of n) {
    const a = so(i);
    !a || e.has(a.id) || (e.add(a.id), t.push(a));
  }
  return t;
}
function ll(n) {
  return n.filter((e) => e.type === "characterType").flatMap((e) => {
    const t = e.system.instance?.instanceId || e.id;
    return (e.system.instance?.selections?.powerShifts ?? []).flatMap((i, a) => {
      const s = String(i ?? "").trim();
      return s ? [{
        id: `legacy-${t}-${a}`,
        category: "Custom",
        shifts: 1,
        specification: s,
        description: ""
      }] : [];
    });
  });
}
function $a(n, e) {
  const t = oo(n);
  return t.length > 0 ? t : ll(e);
}
function cl(n) {
  return n.filter((e) => e.type === "characterType").reduce((e, t) => {
    const i = Number(t.system.superhero?.powerShiftCount ?? 0);
    return e + (Number.isInteger(i) && i > 0 ? i : 0);
  }, 0);
}
function dl(n, e) {
  const t = n.reduce((a, s) => a + s.shifts, 0), i = /* @__PURE__ */ new Map();
  for (const a of n) {
    const s = a.category.trim().toLocaleLowerCase("en-US");
    i.set(s, (i.get(s) ?? 0) + a.shifts);
  }
  return {
    allocated: t,
    available: Math.max(0, Math.trunc(e)),
    overBudget: t > e,
    categoryWarnings: new Set([...i].filter(([, a]) => a > 3).map(([a]) => a))
  };
}
function ul(n, e, t = _e) {
  const i = e.id?.trim() || t(), a = so({ ...e, id: i });
  if (!a) throw new Error("A Power Shift requires a category and a positive whole-number value.");
  const s = n.findIndex((o) => o.id === i);
  return s < 0 ? [...n, a] : n.map((o, r) => r === s ? a : o);
}
function ml(n, e) {
  return n.filter((t) => t.id !== e);
}
function gi(n, e) {
  return Number.isInteger(n) && Number(n) >= e ? Number(n) : null;
}
function Va(n, e = !1) {
  const t = {}, i = n.stats && typeof n.stats == "object" ? n.stats : {}, a = (s) => {
    const o = i[s] && typeof i[s] == "object" ? i[s] : {}, r = {};
    return (!e || T(o, "max")) && (r.max = gi(o.max, 1)), (!e || T(o, "edge")) && (r.edge = gi(o.edge, -20)), r;
  };
  if ((!e || T(n, "tier")) && (t.tier = gi(n.tier, 1)), (!e || T(n, "effort")) && (t.effort = gi(n.effort, 0)), !e || T(n, "stats")) {
    const s = {};
    for (const o of ["might", "speed", "intellect"])
      (!e || T(i, o)) && (s[o] = a(o));
    t.stats = s;
  }
  if (!e || T(n, "wounds")) {
    const s = n.wounds && typeof n.wounds == "object" ? n.wounds : {}, o = {};
    for (const r of ["minor", "moderate", "major"])
      (!e || T(s, r)) && (o[r] = Number.isInteger(s[r]) ? Number(s[r]) : 0);
    t.wounds = o;
  }
  return t;
}
function T(n, e) {
  return Object.prototype.hasOwnProperty.call(n, e);
}
function pl(n, e) {
  const t = { ...n };
  return (!e || T(n, "cycle")) && (t.cycle = Number.isInteger(n.cycle) ? n.cycle : 1), (!e || T(n, "purchases")) && (t.purchases = Array.isArray(n.purchases) ? n.purchases : []), (!e || T(n, "initializedFocusUuids")) && (t.initializedFocusUuids = Array.isArray(n.initializedFocusUuids) ? n.initializedFocusUuids : []), (!e || T(n, "pendingFocusChoices")) && (t.pendingFocusChoices = Array.isArray(n.pendingFocusChoices) ? n.pendingFocusChoices : []), (!e || T(n, "pendingGenreChoices")) && (t.pendingGenreChoices = Array.isArray(n.pendingGenreChoices) ? n.pendingGenreChoices : []), (!e || T(n, "guidanceCompletedTiers")) && (t.guidanceCompletedTiers = Array.isArray(n.guidanceCompletedTiers) ? [...new Set(n.guidanceCompletedTiers.filter((i) => Number.isInteger(i) && Number(i) >= 1).map(Number))].sort((i, a) => i - a) : []), (!e || T(n, "notes")) && (t.notes = typeof n.notes == "string" ? n.notes : ""), t;
}
function fl(n, e) {
  const t = { ...n };
  if ((!e || T(n, "coreInitialized")) && (t.coreInitialized = n.coreInitialized === !0), !e || T(n, "mode")) {
    const i = n.mode === "setup" ? "completed" : String(n.mode);
    t.mode = ["completed", "skipped", "manual"].includes(i) ? i : "uninitialized";
  }
  return (!e || T(n, "initializedAt")) && (t.initializedAt = Number.isInteger(n.initializedAt) ? n.initializedAt : 0), t;
}
function Da(n, e) {
  const t = {};
  if (!e || T(n, "backgroundMode")) {
    const i = String(n.backgroundMode ?? "theme");
    t.backgroundMode = ["theme", "portrait", "custom"].includes(i) ? i : "theme";
  }
  if ((!e || T(n, "customImage")) && (t.customImage = typeof n.customImage == "string" ? n.customImage : ""), !e || T(n, "color")) {
    const i = typeof n.color == "string" ? n.color.trim() : "";
    t.color = /^#(?:[\da-f]{3}|[\da-f]{6})$/i.test(i) ? i.toLocaleLowerCase("en-US") : "";
  }
  return t;
}
function gl(n, e = {}) {
  const t = e.partial === !0;
  if (t ? n.overrides && typeof n.overrides == "object" && (n.overrides = Va(n.overrides, !0)) : n.overrides = Va(
    n.overrides && typeof n.overrides == "object" ? n.overrides : {}
  ), !t && (!n.genre || typeof n.genre != "object") && (n.genre = { sourceUuid: "", instanceId: "", provenance: "manual", attachedAt: 0 }), t ? n.appearance && typeof n.appearance == "object" && (n.appearance = Da(n.appearance, !0)) : n.appearance = Da(
    n.appearance && typeof n.appearance == "object" ? n.appearance : {},
    !1
  ), Array.isArray(n.focusProgress) && (n.focusProgress = n.focusProgress.map((i) => {
    const a = i, s = Array.isArray(a.ownedNodeIds) ? a.ownedNodeIds : [], o = Array.isArray(a.acquisitions) ? a.acquisitions : s.map((r) => ({
      nodeId: r,
      mode: "legacy",
      choiceId: "",
      choiceSource: "none",
      choiceGrantTier: 1,
      choiceFocusUuid: "",
      acquiredAt: 0
    }));
    return {
      focusUuid: String(a.focusUuid ?? a.focusItemId ?? ""),
      ownedNodeIds: s,
      acquisitions: o,
      provenance: a.provenance === "creation" ? "creation" : "additional",
      initialChoicesGranted: a.initialChoicesGranted === !0,
      attachedAt: Number.isInteger(a.attachedAt) ? a.attachedAt : 0
    };
  })), n.advancement && typeof n.advancement == "object" && (n.advancement = pl(n.advancement, t)), !t || n.recovery && typeof n.recovery == "object") {
    const i = n.recovery && typeof n.recovery == "object" ? n.recovery : {}, a = i.used && typeof i.used == "object" ? { ...It(!1), ...i.used } : It(!1), s = { ...i };
    (!t || T(i, "bonus")) && (s.bonus = Number.isInteger(i.bonus) ? i.bonus : 0), (!t || T(i, "slots")) && (s.slots = Qr(i.slots, a), s.used = Rt(s.slots)), (!t || T(i, "customized")) && (s.customized = i.customized === !0), (!t || T(i, "rollModifier")) && (s.rollModifier = Number.isInteger(i.rollModifier) ? Number(i.rollModifier) : 0), (!t || T(i, "history")) && (s.history = Array.isArray(i.history) ? i.history.map((o) => o && typeof o == "object" ? { slotId: "", ...o } : o) : []), n.recovery = s;
  }
  if (t) {
    if (n.presentation && typeof n.presentation == "object") {
      const i = n.presentation, a = { ...i };
      T(i, "hideFocusInSentence") && (a.hideFocusInSentence = i.hideFocusInSentence === !0), T(i, "powerShiftsEnabled") && (a.powerShiftsEnabled = i.powerShiftsEnabled === !0), n.presentation = a;
    }
  } else {
    const i = n.presentation && typeof n.presentation == "object" ? n.presentation : {};
    n.presentation = {
      hideFocusInSentence: i.hideFocusInSentence === !0,
      powerShiftsEnabled: i.powerShiftsEnabled === !0
    };
  }
  if (!t || n.proficiencies && typeof n.proficiencies == "object") {
    const i = n.proficiencies && typeof n.proficiencies == "object" ? n.proficiencies : {}, a = { ...i };
    (!t || T(i, "weaponFamilies")) && (a.weaponFamilies = le(i.weaponFamilies)), n.proficiencies = a;
  }
  return (!t || T(n, "powerShifts")) && (n.powerShifts = oo(n.powerShifts)), n.creation && typeof n.creation == "object" && (n.creation = fl(n.creation, t)), n;
}
function pt(n, e, t) {
  return {
    id: `package.${n.system.instance.instanceId || n.id}.${e}`,
    sourceId: n.id,
    sourceType: "item",
    label: n.name,
    value: t
  };
}
function Xe(n) {
  return Number.isInteger(n) && Number(n) > 0 ? Number(n) : 0;
}
function ro(n) {
  if (n.type !== "descriptor") return [];
  const e = n.system, t = e.instance?.selections?.poolChoices ?? [];
  return (e.poolBonusChoiceGroups ?? []).flatMap((i) => {
    const a = Xe(i.amount), s = new Set(i.pools.filter((l) => k.includes(l))), o = t.find((l) => l.groupId === i.id)?.pools ?? [], r = [...new Set(o)].filter((l) => s.has(l)).slice(0, Xe(i.choose));
    return a ? r.map((l) => ({ groupId: i.id, pool: l, amount: a })) : [];
  });
}
function lo(n) {
  if (n.type !== "characterType") return null;
  const e = n.system;
  if (!e.superhero?.superheroics?.enabled) return null;
  const t = e.instance?.selections?.superheroicsPool, i = Xe(e.superhero.superheroics.poolBonus);
  return t && t !== "none" && k.includes(t) && i > 0 ? { pool: t, amount: i } : null;
}
function hl(n, e, t = []) {
  const i = [...n, ...e].join(" ").trim(), a = t.length > 0 ? `who ${t.join(" and ")}` : "";
  return [i, a].filter(Boolean).join(" ");
}
function yl(n, e = [], t = [], i = [], a = []) {
  const s = {}, o = {}, r = {}, l = new Set(e.filter((f) => Le.includes(f))), u = new Set(le(a)), d = new Set(t.filter((f) => je.includes(f))), p = [], y = [], m = [], h = [];
  for (const f of n) {
    if (f.type === "characterType" || f.type === "species") {
      const E = f.system;
      if (f.type === "characterType")
        p.push(f.name);
      else {
        m.push(f.name);
        const R = Xe(E.cypherLimitBonus);
        R && h.push(pt(f, "cypher-limit", R));
      }
      for (const R of le([
        ...E.weaponFamilies ?? [],
        ...Bi(E.weaponFamilyUse)
      ])) u.add(R);
      for (const R of ["minor", "moderate", "major"]) {
        const G = Xe(E.woundBonuses[R]);
        G && (r[R] ??= []).push(pt(f, `wound.${R}`, G));
      }
      const H = E.edgeGrant.mode === "choice" ? E.instance.selections.edgePool : E.edgeGrant.pool;
      if (H !== "none" && k.includes(H)) {
        const R = Xe(E.edgeGrant.amount);
        R && (o[H] ??= []).push(pt(f, `edge.${H}`, R));
      }
      for (const R of Le) E.weaponUse[R] && l.add(R);
      for (const R of je) E.armorUse[R] && d.add(R);
    } else
      y.push(f.name);
    const A = f.system.poolBonuses;
    for (const E of k) {
      const H = Xe(A[E]);
      H && (s[E] ??= []).push(pt(f, `pool.${E}`, H));
    }
    for (const E of ro(f))
      (s[E.pool] ??= []).push(pt(
        f,
        `pool-choice.${E.groupId}.${E.pool}`,
        E.amount
      ));
    const v = lo(f);
    v && (s[v.pool] ??= []).push(pt(
      f,
      `superheroics.${v.pool}`,
      v.amount
    ));
  }
  return {
    extensions: { poolMax: s, poolEdge: o, woundCapacity: r, cypherLimit: h },
    weaponCategories: [...l],
    weaponFamilies: [...u],
    armorCategories: [...d],
    typeNames: p,
    descriptorNames: y,
    speciesNames: m,
    characterSentence: hl(y, p, i)
  };
}
function nn(n) {
  const e = n.system, t = Object.fromEntries(k.map((a) => [a, Xe(e.poolBonuses[a])]));
  for (const a of ro(n)) t[a.pool] += a.amount;
  const i = lo(n);
  return i && (t[i.pool] += i.amount), t;
}
function co(n, e, t) {
  const i = Math.max(0, e - n);
  return Math.max(0, Math.min(t, t - i));
}
const uo = ["core", "unlimited"], Sl = ["manual", "typeSuggestion", "migration"], Al = ["progression", "origin"], bl = 6;
function wl(n, e) {
  if (!n.sourceUuid) return null;
  const t = e(n.sourceUuid);
  return !t || t.type !== "genre" || !t.system || !t.system.options || !uo.includes(t.system.options.totalEffortCapMode) ? null : {
    sourceUuid: n.sourceUuid,
    name: t.name,
    totalEffortCapMode: t.system.options.totalEffortCapMode
  };
}
function vl(n) {
  return n === "unlimited" ? null : bl;
}
const mo = ["theme", "portrait", "custom"], Cl = "#96082a", El = { r: 23, g: 24, b: 27 };
function Zn(n) {
  const e = n.trim().match(/^#([\da-f]{3}|[\da-f]{6})$/i);
  return e ? `#${(e[1].length === 3 ? [...e[1]].map((i) => `${i}${i}`).join("") : e[1]).toLocaleLowerCase("en-US")}` : null;
}
function po(n) {
  return {
    r: Number.parseInt(n.slice(1, 3), 16),
    g: Number.parseInt(n.slice(3, 5), 16),
    b: Number.parseInt(n.slice(5, 7), 16)
  };
}
function fo({ r: n, g: e, b: t }) {
  return `#${[n, e, t].map((i) => Math.max(0, Math.min(255, Math.round(i))).toString(16).padStart(2, "0")).join("")}`;
}
function go(n, e, t) {
  const i = 1 - t;
  return {
    r: n.r * t + e.r * i,
    g: n.g * t + e.g * i,
    b: n.b * t + e.b * i
  };
}
function Il(n) {
  const e = po(n);
  return Math.max(e.r, e.g, e.b) < 96 ? fo(go(e, { r: 255, g: 255, b: 255 }, 0.72)) : n;
}
function ho(n) {
  const e = Zn(n);
  return e ? fo(go(po(e), El, 0.2)) : null;
}
function yo(n) {
  const e = Zn(n);
  return e ? Il(e) : null;
}
function Rl(n) {
  return `url("${n.replaceAll("\\", "\\\\").replaceAll('"', '\\"').replace(/[\n\r\f;]/g, "")}")`;
}
function So(n, e = (t) => foundry.utils.getRoute(t)) {
  const t = n.trim();
  return t ? /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(t) ? t : e(t) : "";
}
function Nl(n, e, t) {
  const i = mo.includes(n.backgroundMode) ? n.backgroundMode : "theme", a = n.customImage.trim(), s = Zn(n.color), o = s ? yo(s) : null, r = s ? ho(s) : null, l = i === "portrait" ? e.trim() : i === "custom" ? a : "", u = So(l, t), d = [
    ...o ? [`--magnusarchives-character-accent: ${o}`] : [],
    ...r ? [`--magnusarchives-character-tint: ${r}`] : [],
    ...u ? [`--magnusarchives-character-background-image: ${Rl(u)}`] : []
  ];
  return {
    backgroundMode: i,
    customImage: a,
    color: s ?? "",
    backgroundImage: u,
    hasBackgroundImage: !!u,
    hasCharacterColor: !!s,
    accent: o,
    tint: r,
    colorInput: s ?? Cl,
    isTheme: i === "theme",
    isPortrait: i === "portrait",
    isCustom: i === "custom",
    style: d.join("; ")
  };
}
function Ml() {
  return new c.SchemaField({
    id: new c.StringField({ required: !0, nullable: !1, blank: !1 }),
    kind: new c.StringField({ required: !0, nullable: !1, choices: [...sl] }),
    otherKind: new c.StringField({
      required: !0,
      nullable: !1,
      initial: "none",
      choices: ["none", ...to]
    }),
    tier: w(1, 1),
    xpCost: w(),
    timestamp: w()
  });
}
function Gl() {
  return new c.SchemaField({
    id: new c.StringField({ required: !0, nullable: !1, blank: !1 }),
    source: new c.StringField({ required: !0, nullable: !1, choices: [...io] }),
    grantTier: w(1, 1),
    focusUuid: new c.StringField({ required: !0, nullable: !1, initial: "" })
  });
}
function Ul() {
  return new c.SchemaField({
    id: new c.StringField({ required: !0, nullable: !1, blank: !1 }),
    source: new c.StringField({ required: !0, nullable: !1, choices: [...ol] }),
    grantTier: w(1, 1)
  });
}
function kl() {
  return new c.SchemaField({
    nodeId: new c.StringField({ required: !0, nullable: !1, blank: !1 }),
    mode: new c.StringField({
      required: !0,
      nullable: !1,
      choices: ["choice", "manualOverride", "gmOverride", "gmManual", "legacy"]
    }),
    choiceId: new c.StringField({ required: !0, nullable: !1, initial: "" }),
    choiceSource: new c.StringField({
      required: !0,
      nullable: !1,
      initial: "none",
      choices: ["none", ...io]
    }),
    choiceGrantTier: w(1, 1),
    choiceFocusUuid: new c.StringField({ required: !0, nullable: !1, initial: "" }),
    acquiredAt: w()
  });
}
function Hl() {
  return new c.SchemaField({
    id: new c.StringField({ required: !0, nullable: !1, blank: !1 }),
    slotId: new c.StringField({ required: !0, nullable: !1, blank: !0, initial: "" }),
    kind: new c.StringField({
      required: !0,
      nullable: !1,
      initial: "normal",
      choices: [...qr]
    }),
    type: new c.StringField({ required: !0, nullable: !1, choices: [...ke] }),
    rolled: new c.BooleanField({ required: !0, nullable: !1, initial: !0 }),
    dieResult: w(),
    tier: w(1, 1),
    bonus: w(),
    total: w(),
    might: w(),
    speed: w(),
    intellect: w(),
    timestamp: w()
  });
}
function $l() {
  return new c.SchemaField({
    id: new c.StringField({ required: !0, nullable: !1, blank: !1 }),
    type: new c.StringField({ required: !0, nullable: !1, choices: [...ke] }),
    used: new c.BooleanField({ required: !0, nullable: !1, initial: !1 })
  });
}
function Vl() {
  return new c.SchemaField({
    id: new c.StringField({ required: !0, nullable: !1, blank: !1 }),
    type: new c.StringField({ required: !0, nullable: !1, choices: [...Or] }),
    choice: new c.StringField({ required: !0, nullable: !1, initial: "" }),
    majorTaskSucceeded: new c.BooleanField({ required: !0, nullable: !1, initial: !1 }),
    removedWoundIds: ee(),
    timestamp: w()
  });
}
function an() {
  return new c.SchemaField({
    calculatedMax: w(),
    calculatedEdge: w(0, -20),
    max: w(),
    edge: w(0, -20),
    maxContributions: fe(),
    edgeContributions: fe()
  });
}
class Dl extends eo {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      tier: w(1, 1),
      overrides: new c.SchemaField({
        tier: new c.NumberField({ required: !0, nullable: !0, integer: !0, min: 1, initial: null }),
        effort: new c.NumberField({ required: !0, nullable: !0, integer: !0, min: 0, initial: null }),
        stats: new c.SchemaField({
          might: new c.SchemaField({
            max: new c.NumberField({ required: !0, nullable: !0, integer: !0, min: 1, initial: null }),
            edge: new c.NumberField({ required: !0, nullable: !0, integer: !0, min: -20, initial: null })
          }),
          speed: new c.SchemaField({
            max: new c.NumberField({ required: !0, nullable: !0, integer: !0, min: 1, initial: null }),
            edge: new c.NumberField({ required: !0, nullable: !0, integer: !0, min: -20, initial: null })
          }),
          intellect: new c.SchemaField({
            max: new c.NumberField({ required: !0, nullable: !0, integer: !0, min: 1, initial: null }),
            edge: new c.NumberField({ required: !0, nullable: !0, integer: !0, min: -20, initial: null })
          })
        }),
        wounds: new c.SchemaField({
          minor: w(0, -20),
          moderate: w(0, -20),
          major: w(0, -20)
        })
      }),
      xp: w(),
      stats: new c.SchemaField({
        effortBase: w(1),
        might: tn(8),
        speed: tn(8),
        intellect: tn(8)
      }),
      recovery: new c.SchemaField({
        bonus: w(),
        used: new c.SchemaField({
          oneAction: new c.BooleanField({ required: !0, nullable: !1, initial: !1 }),
          tenMinutes: new c.BooleanField({ required: !0, nullable: !1, initial: !1 }),
          oneHour: new c.BooleanField({ required: !0, nullable: !1, initial: !1 }),
          tenHours: new c.BooleanField({ required: !0, nullable: !1, initial: !1 })
        }),
        slots: new c.ArrayField($l(), {
          required: !0,
          nullable: !1,
          initial: lt()
        }),
        customized: new c.BooleanField({ required: !0, nullable: !1, initial: !1 }),
        rollModifier: w(0, -20),
        history: new c.ArrayField(Hl(), {
          required: !0,
          nullable: !1,
          initial: []
        })
      }),
      rest: new c.SchemaField({
        lastType: new c.StringField({ required: !0, nullable: !1, initial: "" }),
        history: new c.ArrayField(Vl(), {
          required: !0,
          nullable: !1,
          initial: []
        })
      }),
      wounds: new c.SchemaField({
        minor: new c.ArrayField(Ct(), { required: !0, nullable: !1, initial: [] }),
        moderate: new c.ArrayField(Ct(), { required: !0, nullable: !1, initial: [] }),
        major: new c.ArrayField(Ct(), { required: !0, nullable: !1, initial: [] })
      }),
      stress: new c.SchemaField({
        value: w(0, 0),
        supernatural: w(0, 0)
      }),
      damageTrack: new c.SchemaField({
        step: new c.StringField({
          required: !0,
          nullable: !1,
          initial: "hale",
          choices: [...Bt]
        }),
        hurtAvailable: new c.BooleanField({ required: !0, nullable: !1, initial: !1 })
      }),
      cypherLimitBase: w(2),
      build: new c.SchemaField({
        descriptorIds: ee(),
        typeIds: ee(),
        speciesIds: ee()
      }),
      focusProgress: new c.ArrayField(
        new c.SchemaField({
          focusUuid: new c.StringField({ required: !0, nullable: !1, blank: !1 }),
          ownedNodeIds: ee(),
          acquisitions: new c.ArrayField(kl(), {
            required: !0,
            nullable: !1,
            initial: []
          }),
          provenance: new c.StringField({
            required: !0,
            nullable: !1,
            initial: "additional",
            choices: ["creation", "additional"]
          }),
          initialChoicesGranted: new c.BooleanField({
            required: !0,
            nullable: !1,
            initial: !1
          }),
          attachedAt: w()
        }),
        { required: !0, nullable: !1, initial: [] }
      ),
      genre: new c.SchemaField({
        sourceUuid: new c.StringField({ required: !0, nullable: !1, initial: "" }),
        instanceId: new c.StringField({ required: !0, nullable: !1, initial: "" }),
        provenance: new c.StringField({
          required: !0,
          nullable: !1,
          initial: "manual",
          choices: [...Sl]
        }),
        attachedAt: w()
      }),
      appearance: new c.SchemaField({
        backgroundMode: new c.StringField({
          required: !0,
          nullable: !1,
          initial: "theme",
          choices: [...mo]
        }),
        customImage: new c.StringField({
          required: !0,
          nullable: !1,
          blank: !0,
          initial: ""
        }),
        color: new c.StringField({
          required: !0,
          nullable: !1,
          blank: !0,
          initial: "",
          validate: (e) => e === "" || /^#(?:[\da-f]{3}|[\da-f]{6})$/i.test(e)
        })
      }),
      presentation: new c.SchemaField({
        hideFocusInSentence: new c.BooleanField({ required: !0, nullable: !1, initial: !1 }),
        powerShiftsEnabled: new c.BooleanField({ required: !0, nullable: !1, initial: !1 })
      }),
      powerShifts: new c.ArrayField(new c.SchemaField({
        id: new c.StringField({ required: !0, nullable: !1, blank: !1 }),
        category: new c.StringField({ required: !0, nullable: !1, blank: !1 }),
        shifts: w(1, 1),
        specification: new c.StringField({ required: !0, nullable: !1, initial: "" }),
        description: new c.StringField({ required: !0, nullable: !1, initial: "" })
      }), { required: !0, nullable: !1, initial: [] }),
      advancement: new c.SchemaField({
        cycle: w(1, 1),
        purchases: new c.ArrayField(Ml(), {
          required: !0,
          nullable: !1,
          initial: []
        }),
        initializedFocusUuids: ee(),
        pendingFocusChoices: new c.ArrayField(Gl(), {
          required: !0,
          nullable: !1,
          initial: []
        }),
        pendingGenreChoices: new c.ArrayField(Ul(), {
          required: !0,
          nullable: !1,
          initial: []
        }),
        guidanceCompletedTiers: new c.ArrayField(w(1, 1), {
          required: !0,
          nullable: !1,
          initial: []
        }),
        notes: new c.HTMLField({ required: !0, nullable: !1, initial: "" })
      }),
      creation: new c.SchemaField({
        coreInitialized: new c.BooleanField({ required: !0, nullable: !1, initial: !1 }),
        mode: new c.StringField({
          required: !0,
          nullable: !1,
          initial: "uninitialized",
          choices: ["uninitialized", "completed", "skipped", "manual"]
        }),
        initializedAt: w()
      }),
      identity: new c.SchemaField({
        descriptorLabel: new c.StringField({ required: !0, nullable: !1, initial: "" })
      }),
      arc: new c.SchemaField({
        key: new c.StringField({ required: !0, nullable: !1, initial: "" }),
        name: new c.StringField({ required: !0, nullable: !1, initial: "" }),
        stage: new c.StringField({
          required: !0,
          nullable: !1,
          initial: "none",
          choices: ["none", "opening", "steps", "climax", "resolution", "complete"]
        }),
        stepsCompleted: w(),
        notes: new c.HTMLField({ required: !0, nullable: !1, initial: "" })
      }),
      proficiencies: new c.SchemaField({
        weaponCategories: ee(["light"]),
        weaponFamilies: ee(),
        armorCategories: ee(),
        freelyUse: ee()
      }),
      derived: new c.SchemaField(
        {
          tier: new c.SchemaField({
            calculated: w(1, 1),
            value: w(1, 1)
          }),
          pools: new c.SchemaField({
            might: an(),
            speed: an(),
            intellect: an()
          }),
          effort: new c.SchemaField({
            calculatedMax: w(),
            max: w(),
            contributions: fe()
          }),
          stress: new c.SchemaField({
            value: w(),
            level: w(),
            toNextLevel: w(3),
            hindrance: w()
          }),
          damageTrack: new c.SchemaField({
            step: new c.StringField({
              required: !0,
              nullable: !1,
              initial: "hale",
              choices: [...Bt]
            }),
            hurtAvailable: new c.BooleanField({ required: !0, nullable: !1, initial: !1 }),
            steps: new c.ArrayField(
              new c.StringField({ required: !0, nullable: !1, choices: [...Bt] }),
              { required: !0, nullable: !1, initial: [] }
            ),
            effortSurcharge: w(),
            ignoresSpecialEffects: new c.BooleanField({ required: !0, nullable: !1, initial: !1 }),
            reducedSpecialDamage: new c.BooleanField({ required: !0, nullable: !1, initial: !1 }),
            moveOnly: new c.BooleanField({ required: !0, nullable: !1, initial: !1 }),
            dead: new c.BooleanField({ required: !0, nullable: !1, initial: !1 })
          }),
          totalHindrance: w(),
          wounds: new c.SchemaField({
            calculatedCapacities: new c.SchemaField({
              minor: w(3, 1),
              moderate: w(3, 1),
              major: w(3, 1)
            }),
            capacities: new c.SchemaField({
              minor: w(3, 1),
              moderate: w(3, 1),
              major: w(3, 1)
            }),
            capacityContributions: new c.SchemaField({
              minor: fe(),
              moderate: fe(),
              major: fe()
            }),
            hindrance: w(),
            hindranceContributions: fe(),
            dead: new c.BooleanField({ required: !0, nullable: !1, initial: !1 })
          }),
          recovery: new c.SchemaField({
            formula: new c.StringField({ required: !0, nullable: !1, initial: "1d6 + Tier" }),
            calculatedFormula: new c.StringField({ required: !0, nullable: !1, initial: "1d6 + Tier" }),
            calculatedBonus: w(0, -20),
            manualModifier: w(0, -20),
            bonus: w(),
            bonusContributions: fe(),
            availableTypes: new c.ArrayField(
              new c.StringField({ required: !0, nullable: !1, choices: [...ke] }),
              { required: !0, nullable: !1, initial: [] }
            )
          }),
          cypherLimit: new c.SchemaField({ max: w(), contributions: fe() }),
          combat: new c.SchemaField({
            armor: new c.SchemaField({
              itemId: new c.StringField({ required: !0, nullable: !1, initial: "" }),
              category: new c.StringField({
                required: !0,
                nullable: !1,
                initial: "none",
                choices: ["none", "light", "medium", "heavy"]
              }),
              freelyUsed: new c.BooleanField({ required: !0, nullable: !1, initial: !0 }),
              blockEase: w(),
              dodgeHindrance: w(),
              speedTaskHindrance: w(),
              blockContributions: fe(),
              dodgeContributions: fe(),
              speedTaskContributions: fe()
            })
          }),
          packages: new c.SchemaField({
            weaponCategories: ee(),
            weaponFamilies: ee(),
            armorCategories: ee(),
            genre: new c.StringField({ required: !0, nullable: !1, initial: "none" }),
            genreUuid: new c.StringField({ required: !0, nullable: !1, initial: "" }),
            totalEffortCapMode: new c.StringField({
              required: !0,
              nullable: !1,
              initial: "core",
              choices: ["core", "unlimited"]
            }),
            typeNames: ee(),
            descriptorNames: ee(),
            speciesNames: ee(),
            characterSentence: new c.StringField({ required: !0, nullable: !1, initial: "" })
          })
        },
        { required: !0, nullable: !1, persisted: !1 }
      )
    };
  }
  static migrateData(e, t = {}) {
    return gl(super.migrateData(e), t);
  }
  prepareDerivedData() {
    super.prepareDerivedData();
    const e = [...this.parent.items ?? []], t = e.filter((l) => l.type === "armor").map((l) => ({
      id: l.id,
      type: l.type,
      system: l.system
    })), i = this.proficiencies, a = yl(
      e.filter((l) => l.type === "characterType" || l.type === "descriptor" || l.type === "species"),
      i.weaponCategories,
      i.armorCategories,
      [],
      le(i.weaponFamilies)
    ), s = wl(this.genre, (l) => typeof fromUuidSync != "function" ? null : fromUuidSync(l)), o = {
      armorCategories: a.armorCategories,
      freelyUse: i.freelyUse
    }, r = tl(
      this.stats,
      this.wounds,
      this.recovery.used,
      a.extensions,
      t,
      o,
      this.recovery.bonus,
      {
        weaponCategories: [...a.weaponCategories],
        weaponFamilies: [...a.weaponFamilies],
        armorCategories: [...a.armorCategories],
        genre: s?.name ?? "none",
        genreUuid: s?.sourceUuid ?? "",
        totalEffortCapMode: s?.totalEffortCapMode ?? "core",
        typeNames: [...a.typeNames],
        descriptorNames: [...a.descriptorNames],
        speciesNames: [...a.speciesNames],
        characterSentence: a.characterSentence
      },
      this.cypherLimitBase,
      this.tier,
      this.overrides,
      this.recovery.rollModifier,
      this.recovery.slots,
      {
        stressPoints: this.stress.value,
        damageTrackStep: this.damageTrack.step,
        hurtAvailable: this.damageTrack.hurtAvailable
      }
    );
    Object.assign(this.derived.tier, r.tier), Object.assign(this.derived.pools.might, r.pools.might), Object.assign(this.derived.pools.speed, r.pools.speed), Object.assign(this.derived.pools.intellect, r.pools.intellect), Object.assign(this.derived.effort, r.effort), Object.assign(this.derived.stress, r.stress), Object.assign(this.derived.damageTrack, r.damageTrack), this.derived.totalHindrance = r.totalHindrance, Object.assign(this.derived.wounds.calculatedCapacities, r.wounds.calculatedCapacities), Object.assign(this.derived.wounds.capacities, r.wounds.capacities), Object.assign(this.derived.wounds.capacityContributions, r.wounds.capacityContributions), this.derived.wounds.hindrance = r.wounds.hindrance, this.derived.wounds.hindranceContributions = r.wounds.hindranceContributions, this.derived.wounds.dead = r.wounds.dead, Object.assign(this.derived.recovery, r.recovery), Object.assign(this.derived.cypherLimit, r.cypherLimit), Object.assign(this.derived.combat.armor, r.combat.armor), Object.assign(this.derived.packages, r.packages);
    for (const l of ["might", "speed", "intellect"])
      this.stats[l].max = r.pools[l].max, this.stats[l].edge = r.pools[l].edge;
  }
}
class Fl extends eo {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      level: w(1, 0),
      health: new c.SchemaField({
        value: w(3),
        baseMax: w(3, 1),
        max: new c.NumberField({
          required: !0,
          nullable: !1,
          integer: !0,
          min: 1,
          initial: 3,
          persisted: !1
        })
      }),
      dead: new c.BooleanField({
        required: !0,
        nullable: !1,
        initial: !1,
        persisted: !1
      }),
      // GM-facing reference only. NPC combat intentionally continues to use
      // the legacy armorBase field where that older automation is required.
      armor: w(),
      armorBase: w(),
      damage: new c.SchemaField({
        amount: w(1),
        // What this NPC's attack does to a PC. The book writes these as, for
        // example, "Knife deals 3 points of Stress" or "short-range firearm
        // attack deals serious injury".
        effect: new c.StringField({
          required: !0,
          nullable: !1,
          initial: "stress",
          choices: [...xi]
        }),
        stressAmount: w(3),
        defense: new c.SchemaField({
          allowBlock: new c.BooleanField({ required: !0, nullable: !1, initial: !0 }),
          allowDodge: new c.BooleanField({ required: !0, nullable: !1, initial: !0 })
        }),
        notes: new c.StringField({ required: !0, nullable: !1, initial: "" })
      }),
      movement: new c.SchemaField({
        category: new c.StringField({ required: !0, nullable: !1, initial: "short" }),
        distance: new c.StringField({ required: !0, nullable: !1, initial: "" }),
        notes: new c.StringField({ required: !0, nullable: !1, initial: "" })
      }),
      modifications: new c.ArrayField(
        new c.SchemaField({
          id: new c.StringField({ required: !0, nullable: !1, blank: !1 }),
          label: new c.StringField({ required: !0, nullable: !1, initial: "" }),
          contexts: new c.ArrayField(
            new c.StringField({ required: !0, nullable: !1, blank: !1 }),
            { required: !0, nullable: !1, initial: [] }
          ),
          mode: new c.StringField({
            required: !0,
            nullable: !1,
            initial: "levelOverride",
            choices: ["levelOverride", "levelDelta", "ease", "hinder"]
          }),
          value: new c.NumberField({ required: !0, nullable: !1, integer: !0, initial: 0 }),
          visibility: new c.StringField({
            required: !0,
            nullable: !1,
            initial: "gm",
            choices: ["public", "gm"]
          }),
          predicate: new c.ObjectField({ required: !0, nullable: !1, initial: {} }),
          description: new c.HTMLField({ required: !0, nullable: !1, initial: "" })
        }),
        { required: !0, nullable: !1, initial: [] }
      ),
      gmIntrusion: new c.HTMLField({ required: !0, nullable: !1, initial: "" })
    };
  }
  static migrateData(e, t = {}) {
    const i = super.migrateData(e, t), a = i.damage;
    return a && a.effect === void 0 && typeof a.woundSeverity == "string" && (a.effect = a.woundSeverity === "minor" ? "stress" : "seriousInjury", delete a.woundSeverity), i;
  }
  prepareDerivedData() {
    super.prepareDerivedData(), this.health.max = this.health.baseMax, this.dead = this.health.value <= 0;
  }
}
const Tl = ["none", "fantasy", "scienceFiction", "superhero", "custom"], zl = ["primary", "additional", "speciesGranted", "custom"], Ao = ["none", "fixed", "choice"], Pl = ["type", "descriptor", "focus", "genre", "species", "other"], xl = ["active", "retained"], ql = ["fixed", "catalog"], Ol = ["none", "descriptor"];
function Ht() {
  return new c.SchemaField({
    name: new c.StringField({ required: !0, nullable: !1, initial: "" }),
    img: new c.StringField({ required: !0, nullable: !1, initial: "" }),
    system: new c.ObjectField({ required: !0, nullable: !1, initial: {} })
  });
}
function bo() {
  return new c.SchemaField({
    kind: new c.StringField({ required: !0, nullable: !1, initial: "other", choices: [...Pl] }),
    sourceUuid: new c.StringField({ required: !0, nullable: !1, initial: "" }),
    instanceId: new c.StringField({ required: !0, nullable: !1, initial: "" }),
    grantId: new c.StringField({ required: !0, nullable: !1, initial: "" }),
    status: new c.StringField({ required: !0, nullable: !1, initial: "active", choices: [...xl] }),
    contentUuid: new c.StringField({ required: !0, nullable: !1, initial: "" }),
    contentKey: new c.StringField({ required: !0, nullable: !1, initial: "" }),
    replacement: new c.SchemaField({
      active: new c.BooleanField({ required: !0, nullable: !1, initial: !1 }),
      originalName: new c.StringField({ required: !0, nullable: !1, initial: "" }),
      originalContentUuid: new c.StringField({ required: !0, nullable: !1, initial: "" }),
      originalContentKey: new c.StringField({ required: !0, nullable: !1, initial: "" }),
      replacementName: new c.StringField({ required: !0, nullable: !1, initial: "" }),
      replacementContentUuid: new c.StringField({ required: !0, nullable: !1, initial: "" }),
      replacementContentKey: new c.StringField({ required: !0, nullable: !1, initial: "" }),
      selectionKind: new c.StringField({ required: !0, nullable: !1, initial: "none", choices: ["none", "suggested", "world", "compendium", "custom"] })
    })
  });
}
function wo() {
  return new c.SchemaField({
    id: new c.StringField({ required: !0, nullable: !1, blank: !1 }),
    itemUuid: new c.StringField({ required: !0, nullable: !1, initial: "" }),
    customName: new c.StringField({ required: !0, nullable: !1, initial: "" }),
    snapshot: Ht()
  });
}
function sn() {
  return new c.SchemaField({
    groupId: new c.StringField({ required: !0, nullable: !1, blank: !1 }),
    optionIds: new c.ArrayField(new c.StringField({ required: !0, nullable: !1, blank: !1 }), { required: !0, nullable: !1, initial: [] })
  });
}
function Bl() {
  return new c.SchemaField({
    groupId: new c.StringField({ required: !0, nullable: !1, blank: !1 }),
    pools: new c.ArrayField(
      new c.StringField({ required: !0, nullable: !1, blank: !1, choices: [...k] }),
      { required: !0, nullable: !1, initial: [] }
    )
  });
}
function ea() {
  return new c.SchemaField({
    sourceUuid: new c.StringField({ required: !0, nullable: !1, initial: "" }),
    instanceId: new c.StringField({ required: !0, nullable: !1, initial: "" }),
    role: new c.StringField({ required: !0, nullable: !1, initial: "primary", choices: [...zl] }),
    attachedAt: w(),
    selections: new c.SchemaField({
      edgePool: new c.StringField({ required: !0, nullable: !1, initial: "none", choices: ["none", "might", "speed", "intellect"] }),
      superheroicsPool: new c.StringField({ required: !0, nullable: !1, initial: "none", choices: ["none", ...k] }),
      powerShifts: new c.ArrayField(
        new c.StringField({ required: !0, nullable: !1, initial: "" }),
        { required: !0, nullable: !1, initial: [] }
      ),
      poolChoices: new c.ArrayField(Bl(), { required: !0, nullable: !1, initial: [] }),
      skillChoices: new c.ArrayField(sn(), { required: !0, nullable: !1, initial: [] }),
      abilityChoices: new c.ArrayField(sn(), { required: !0, nullable: !1, initial: [] }),
      descriptorChoices: new c.ArrayField(sn(), { required: !0, nullable: !1, initial: [] }),
      suppressedGrantIds: new c.ArrayField(new c.StringField({ required: !0, nullable: !1, blank: !1 }), { required: !0, nullable: !1, initial: [] })
    }),
    parent: bo()
  });
}
function Ll() {
  return new c.SchemaField({
    id: new c.StringField({ required: !0, nullable: !1, blank: !1 }),
    amount: w(1, 1),
    choose: w(1, 1),
    pools: new c.ArrayField(
      new c.StringField({ required: !0, nullable: !1, blank: !1, choices: [...k] }),
      { required: !0, nullable: !1, initial: [] }
    )
  });
}
function ta() {
  return new c.SchemaField({
    id: new c.StringField({ required: !0, nullable: !1, blank: !1 }),
    abilityUuid: new c.StringField({ required: !0, nullable: !1, initial: "" }),
    notes: new c.StringField({ required: !0, nullable: !1, initial: "" }),
    snapshot: Ht(),
    alternatives: new c.ArrayField(wo(), { required: !0, nullable: !1, initial: [] })
  });
}
function jl() {
  return new c.SchemaField({
    id: new c.StringField({ required: !0, nullable: !1, blank: !1 }),
    skillUuid: new c.StringField({ required: !0, nullable: !1, initial: "" }),
    customName: new c.StringField({ required: !0, nullable: !1, initial: "" }),
    notes: new c.HTMLField({ required: !0, nullable: !1, initial: "" }),
    snapshot: Ht()
  });
}
function ia() {
  return new c.SchemaField({
    id: new c.StringField({ required: !0, nullable: !1, blank: !1 }),
    skillUuid: new c.StringField({ required: !0, nullable: !1, initial: "" }),
    customName: new c.StringField({ required: !0, nullable: !1, initial: "" }),
    notes: new c.HTMLField({ required: !0, nullable: !1, initial: "" }),
    rank: new c.StringField({ required: !0, nullable: !1, initial: "trained", choices: [...ie] }),
    snapshot: Ht(),
    alternatives: new c.ArrayField(wo(), { required: !0, nullable: !1, initial: [] })
  });
}
function na() {
  return new c.SchemaField({
    id: new c.StringField({ required: !0, nullable: !1, blank: !1 }),
    choose: w(1, 1),
    rank: new c.StringField({ required: !0, nullable: !1, initial: "trained", choices: [...ie] }),
    options: new c.ArrayField(jl(), { required: !0, nullable: !1, initial: [] })
  });
}
function vo() {
  return new c.SchemaField({
    id: new c.StringField({ required: !0, nullable: !1, blank: !1 }),
    choose: w(1, 1),
    options: new c.ArrayField(ta(), { required: !0, nullable: !1, initial: [] })
  });
}
function Co() {
  return new c.SchemaField({
    id: new c.StringField({ required: !0, nullable: !1, blank: !1 }),
    descriptorUuid: new c.StringField({ required: !0, nullable: !1, initial: "" }),
    snapshot: Ht()
  });
}
function Wl() {
  return new c.SchemaField({
    id: new c.StringField({ required: !0, nullable: !1, blank: !1 }),
    choose: w(1, 1),
    sourceMode: new c.StringField({
      required: !0,
      nullable: !1,
      initial: "fixed",
      choices: [...ql]
    }),
    catalogItemType: new c.StringField({
      required: !0,
      nullable: !1,
      initial: "none",
      choices: [...Ol]
    }),
    options: new c.ArrayField(Co(), { required: !0, nullable: !1, initial: [] })
  });
}
function Hi() {
  return new c.SchemaField({
    light: new c.BooleanField({ required: !0, nullable: !1, initial: !1 }),
    medium: new c.BooleanField({ required: !0, nullable: !1, initial: !1 }),
    heavy: new c.BooleanField({ required: !0, nullable: !1, initial: !1 })
  });
}
class me extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      schemaVersion: w(1, 1),
      slug: new c.StringField({ required: !0, nullable: !1, initial: "" }),
      description: new c.StringField({ required: !1, nullable: !1, initial: "" }),
      source: new c.SchemaField({
        uuid: new c.StringField({ required: !0, nullable: !1, initial: "" }),
        book: new c.StringField({ required: !0, nullable: !1, initial: "" }),
        page: new c.StringField({ required: !0, nullable: !1, initial: "" }),
        license: new c.StringField({ required: !0, nullable: !1, initial: "original" })
      }),
      automation: new c.SchemaField({
        mode: new c.StringField({
          required: !0,
          nullable: !1,
          initial: "descriptive",
          choices: ["descriptive", "assisted", "automatic"]
        }),
        duration: al(),
        rollDefaults: new c.ObjectField({ required: !0, nullable: !1, initial: {} })
      }),
      ruleElements: new c.ArrayField(
        new c.ObjectField({ required: !0, nullable: !1 }),
        { required: !0, nullable: !1, initial: [] }
      ),
      tags: new c.ArrayField(
        new c.StringField({ required: !0, nullable: !1, blank: !1 }),
        { required: !0, nullable: !1, initial: [] }
      ),
      grantedBy: bo()
    };
  }
}
const _l = [...k];
function Hn(n, e = "none") {
  return Array.isArray(n) ? k.filter((t) => n.includes(t)) : e === "choose" || e === "any" ? [...k] : k.includes(e) ? [e] : [];
}
function Ye(n) {
  return Hn(n.system.cost.allowedPools, n.system.pool);
}
function Kl(n, e, t) {
  const i = k.filter((a) => n.includes(a));
  return i.length === 0 ? "" : i.length === 1 ? e(i[0]) : i.length === 2 ? `${e(i[0])}${t.pair}${e(i[1])}` : `${e(i[0])}${t.middle}${e(i[1])}${t.final}${e(i[2])}`;
}
function Eo(n, e, t, i, a = !1) {
  return !Number.isInteger(n) || n <= 0 || e.length === 0 ? "" : `${n}${a ? "+" : ""} ${Kl(e, t, i)}`;
}
class Xl extends me {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      tier: w(1, 0),
      category: new c.StringField({ required: !0, nullable: !1, initial: "general" }),
      archived: new c.BooleanField({ required: !0, nullable: !1, initial: !1 }),
      activation: new c.StringField({
        required: !0,
        nullable: !1,
        initial: "action",
        choices: [...js]
      }),
      // Legacy V1 single-Pool source retained for safe document migration.
      // Runtime and UI use cost.allowedPools as the normalized authority.
      pool: new c.StringField({
        required: !0,
        nullable: !1,
        initial: "none",
        choices: [...Ga]
      }),
      cost: new c.SchemaField({
        amount: w(),
        scalable: new c.BooleanField({ required: !0, nullable: !1, initial: !1 }),
        ignoresEdge: new c.BooleanField({ required: !0, nullable: !1, initial: !1 }),
        allowedPools: new c.ArrayField(
          new c.StringField({ required: !0, nullable: !1, choices: [...k] }),
          { required: !0, nullable: !1, initial: [] }
        )
      }),
      roll: new c.StringField({
        required: !0,
        nullable: !1,
        initial: "none",
        choices: [...Ws]
      }),
      rollModifier: new c.NumberField({
        required: !0,
        nullable: !1,
        integer: !0,
        min: -10,
        max: 10,
        initial: 0
      }),
      attackModifier: new c.NumberField({
        required: !0,
        nullable: !1,
        integer: !0,
        min: -10,
        max: 10,
        initial: 0
      }),
      damage: w(),
      damageEffect: new c.StringField({
        required: !0,
        nullable: !1,
        initial: "none",
        choices: [...xi]
      }),
      stressAmount: w(3),
      range: new c.StringField({ required: !0, nullable: !1, initial: "" }),
      targetMode: new c.StringField({
        required: !0,
        nullable: !1,
        initial: "none",
        choices: [..._s]
      }),
      // Reserved for the later Focus acquisition workflow. Phase 1 never writes these fields.
      sourceFocusUuid: new c.StringField({ required: !0, nullable: !1, initial: "" }),
      sourceNodeId: new c.StringField({ required: !0, nullable: !1, initial: "" })
    };
  }
  static migrateData(e, t = {}) {
    const i = super.migrateData(e, t);
    i.damageEffect === void 0 && typeof i.woundSeverity == "string" && (i.damageEffect = i.woundSeverity === "none" ? "none" : i.woundSeverity === "minor" ? "stress" : "seriousInjury", delete i.woundSeverity);
    const a = i.cost && typeof i.cost == "object" ? i.cost : {};
    if (t.partial) {
      Object.hasOwn(i, "archived") && (i.archived = !!i.archived);
      const s = Object.hasOwn(a, "allowedPools"), o = Object.hasOwn(i, "pool") || Object.hasOwn(a, "pool");
      return (s || o) && (i.cost = {
        ...a,
        allowedPools: Hn(
          s ? a.allowedPools : void 0,
          i.pool ?? a.pool
        )
      }), i;
    }
    if (i.pool === void 0) {
      const s = String(a.pool ?? "none");
      i.pool = Ga.includes(s) ? s : "none";
    }
    return i.archived = !!(i.archived ?? !1), i.cost = {
      amount: Number(a.amount ?? 0),
      scalable: !!(a.scalable ?? !1),
      ignoresEdge: !!(a.ignoresEdge ?? !1),
      allowedPools: Hn(
        a.allowedPools,
        i.pool ?? a.pool
      )
    }, i.roll === void 0 && (i.roll = "none"), i.targetMode === void 0 && (i.targetMode = "none"), i;
  }
}
const nt = Object.freeze({
  minor: 3,
  moderate: 2,
  major: 1
});
class Yl extends me {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      equipped: new c.BooleanField({ required: !0, nullable: !1, initial: !1 }),
      depletion: Oi(),
      depleted: new c.BooleanField({ required: !0, nullable: !1, initial: !1 }),
      woundCapacities: new c.SchemaField({
        minor: w(nt.minor),
        moderate: w(nt.moderate),
        major: w(nt.major)
      }),
      wounds: new c.SchemaField({
        minor: new c.ArrayField(Ct(), { required: !0, nullable: !1, initial: [] }),
        moderate: new c.ArrayField(Ct(), { required: !0, nullable: !1, initial: [] }),
        major: new c.ArrayField(Ct(), { required: !0, nullable: !1, initial: [] })
      }),
      derived: new c.SchemaField({
        capacities: new c.SchemaField({
          minor: w(nt.minor),
          moderate: w(nt.moderate),
          major: w(nt.major)
        }),
        broken: new c.BooleanField({ required: !0, nullable: !1, initial: !1 })
      }, { required: !0, nullable: !1, persisted: !1 })
    };
  }
  prepareDerivedData() {
    super.prepareDerivedData(), Object.assign(this.derived.capacities, this.woundCapacities), this.derived.broken = this.wounds.major.length >= this.derived.capacities.major;
  }
}
class Jl extends me {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      category: new c.StringField({
        required: !0,
        nullable: !1,
        initial: "light",
        choices: [...je]
      }),
      grantsHurtStep: new c.BooleanField({ required: !0, nullable: !1, initial: !0 }),
      speedTaskHindrance: w(1),
      // Legacy compatibility only. Effective Armor familiarity is derived from the Character.
      freelyUsed: new c.BooleanField({ required: !0, nullable: !1, initial: !1 }),
      depletion: Oi(),
      depleted: new c.BooleanField({ required: !0, nullable: !1, initial: !1 }),
      equipped: new c.BooleanField({ required: !0, nullable: !1, initial: !1 })
    };
  }
}
class Ql extends me {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      level: new c.StringField({ required: !0, nullable: !1, initial: "1", blank: !1 }),
      identified: new c.BooleanField({ required: !0, nullable: !1, initial: !0 }),
      depletion: Oi("1d6"),
      depleted: new c.BooleanField({ required: !0, nullable: !1, initial: !1 }),
      uses: w()
    };
  }
  static migrateData(e, t = {}) {
    const i = super.migrateData(e, t);
    if (Object.hasOwn(i, "level") && (i.level = String(i.level || "1")), typeof i.depletion == "string") {
      const a = i.depletion.match(/(\d+)\s*(?:in|on)\s*(\d*d\d+(?:\s*[+-]\s*\d+)?)/i), s = a?.[2] ?? "1d6", o = s.match(/^1?d(6|10|20)$/i)?.[1];
      i.depletion = a ? { enabled: !0, die: o ? `d${o}` : "d6", formula: s, threshold: Number(a[1]) } : { enabled: !1, die: "d6", formula: "1d6", threshold: 1 };
    } else if (!t.partial && i.depletion && typeof i.depletion == "object") {
      const a = i.depletion;
      i.depletion = {
        ...a,
        formula: String(a.formula ?? `1${String(a.die ?? "d6")}`)
      };
    }
    return i;
  }
}
class Zl extends me {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      poolBonuses: new c.SchemaField({ might: w(), speed: w(), intellect: w() }),
      woundBonuses: new c.SchemaField({ minor: w(), moderate: w(), major: w() }),
      edgeGrant: new c.SchemaField({
        mode: new c.StringField({ required: !0, nullable: !1, initial: "none", choices: [...Ao] }),
        pool: new c.StringField({ required: !0, nullable: !1, initial: "none", choices: ["none", "might", "speed", "intellect"] }),
        amount: w(1)
      }),
      weaponUse: Hi(),
      weaponFamilies: new c.ArrayField(
        new c.StringField({ required: !0, nullable: !1, blank: !1 }),
        { required: !0, nullable: !1, initial: [] }
      ),
      armorUse: Hi(),
      superhero: new c.SchemaField({
        rank: new c.NumberField({ required: !0, nullable: !1, integer: !0, min: 0, max: 5, initial: 0 }),
        powerShiftCount: new c.NumberField({ required: !0, nullable: !1, integer: !0, min: 0, max: 10, initial: 0 }),
        superheroics: new c.SchemaField({
          enabled: new c.BooleanField({ required: !0, nullable: !1, initial: !1 }),
          poolBonus: w()
        })
      }),
      abilityGrants: new c.ArrayField(ta(), { required: !0, nullable: !1, initial: [] }),
      abilityChoiceGroups: new c.ArrayField(vo(), { required: !0, nullable: !1, initial: [] }),
      skillGrants: new c.ArrayField(ia(), { required: !0, nullable: !1, initial: [] }),
      choiceGroups: new c.ArrayField(na(), { required: !0, nullable: !1, initial: [] }),
      genre: new c.StringField({ required: !0, nullable: !1, initial: "none", choices: [...Tl] }),
      customGenreId: new c.StringField({ required: !0, nullable: !1, initial: "" }),
      backgroundOptions: new c.HTMLField({ required: !0, nullable: !1, initial: "" }),
      equipmentNotes: new c.HTMLField({ required: !0, nullable: !1, initial: "" }),
      equipmentBundleUuid: new c.StringField({ required: !0, nullable: !1, initial: "" }),
      instance: ea()
    };
  }
  static migrateData(e, t = {}) {
    const i = Bi(e.weaponFamilyUse), a = super.migrateData(e, t);
    return (!t.partial || Object.hasOwn(e, "weaponFamilies") || i.length > 0) && (a.weaponFamilies = le([
      ...Array.isArray(e.weaponFamilies) ? e.weaponFamilies : [],
      ...i
    ])), delete a.weaponFamilyUse, a;
  }
}
class ec extends me {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      level: w(1, 1),
      levelOverride: new c.BooleanField({ required: !0, nullable: !1, initial: !1 }),
      category: new c.StringField({ required: !0, nullable: !1, initial: "general" }),
      manifest: new c.BooleanField({ required: !0, nullable: !1, initial: !1 }),
      manifestation: new c.StringField({
        required: !0,
        nullable: !1,
        initial: "subtle",
        choices: [...Kn]
      }),
      form: new c.StringField({ required: !0, nullable: !1, initial: "" }),
      power: new c.StringField({
        required: !0,
        nullable: !1,
        initial: "low",
        choices: [...Xn]
      }),
      identified: new c.BooleanField({ required: !0, nullable: !1, initial: !0 }),
      uses: w(1)
    };
  }
  static migrateData(e, t = {}) {
    const i = super.migrateData(e, t), a = Object.hasOwn(i, "manifestation"), s = Object.hasOwn(i, "manifest");
    if (a ? i.manifest = i.manifestation === "manifest" : (!t.partial || s) && (i.manifestation = i.manifest === !0 ? "manifest" : "subtle"), !t.partial && !Object.hasOwn(i, "levelOverride")) {
      const o = Number(i.level);
      i.levelOverride = Object.hasOwn(i, "level") && Number.isInteger(o) && o > 1;
    }
    return i;
  }
}
class tc extends me {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      poolBonuses: new c.SchemaField({ might: w(), speed: w(), intellect: w() }),
      poolBonusChoiceGroups: new c.ArrayField(Ll(), { required: !0, nullable: !1, initial: [] }),
      skillGrants: new c.ArrayField(ia(), { required: !0, nullable: !1, initial: [] }),
      choiceGroups: new c.ArrayField(na(), { required: !0, nullable: !1, initial: [] }),
      instance: ea()
    };
  }
}
class ic extends me {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      // Mundane equipment is about level 4 (p99).
      level: w(4),
      quantity: w(1),
      equipped: new c.BooleanField({ required: !0, nullable: !1, initial: !1 }),
      // One of the six price categories (p98) rather than a currency amount.
      price: new c.StringField({
        required: !0,
        nullable: !1,
        initial: "inexpensive",
        choices: [...Un]
      }),
      priceNote: new c.StringField({ required: !0, nullable: !1, initial: "" })
    };
  }
  static migrateData(e, t = {}) {
    const i = super.migrateData(e, t);
    return typeof i.price == "string" && !Un.includes(i.price) && (i.priceNote === void 0 && i.price !== "" && (i.priceNote = i.price), i.price = "inexpensive"), i;
  }
}
function nc() {
  return new c.SchemaField({
    id: new c.StringField({ required: !0, nullable: !1, blank: !1 }),
    abilityUuid: new c.StringField({ required: !0, nullable: !1, initial: "" }),
    abilitySnapshot: new c.SchemaField({
      name: new c.StringField({ required: !0, nullable: !1, initial: "" }),
      description: new c.StringField({ required: !1, nullable: !1, initial: "" })
    }),
    tier: new c.NumberField({
      required: !0,
      nullable: !1,
      integer: !0,
      min: 1,
      max: 6,
      initial: 1
    }),
    position: new c.SchemaField({
      x: new c.NumberField({ required: !0, nullable: !0, initial: null }),
      y: new c.NumberField({ required: !0, nullable: !0, initial: null })
    })
  });
}
function ac() {
  return new c.SchemaField({
    id: new c.StringField({ required: !0, nullable: !1, blank: !1 }),
    from: new c.StringField({ required: !0, nullable: !1, blank: !1 }),
    to: new c.StringField({ required: !0, nullable: !1, blank: !1 })
  });
}
class sc extends me {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      graph: new c.SchemaField({
        version: w(1, 1),
        nodes: new c.ArrayField(nc(), { required: !0, nullable: !1, initial: [] }),
        connections: new c.ArrayField(ac(), {
          required: !0,
          nullable: !1,
          initial: []
        })
      })
    };
  }
  static migrateData(e, t = {}) {
    const i = super.migrateData(e, t);
    if (t.partial || i.graph && typeof i.graph == "object") return i;
    const a = Array.isArray(i.nodes) ? i.nodes : [], s = Array.isArray(i.connections) ? i.connections : [];
    return i.graph = {
      version: Number(i.graphVersion ?? 1),
      nodes: a.map((o) => {
        const r = o, l = r.abilitySnapshot && typeof r.abilitySnapshot == "object" ? r.abilitySnapshot : {}, u = r.position && typeof r.position == "object" ? r.position : {};
        return {
          id: String(r.id ?? ""),
          abilityUuid: String(r.abilitySourceUuid ?? ""),
          abilitySnapshot: {
            name: String(l.name ?? r.title ?? ""),
            description: String(l.description ?? "")
          },
          tier: Number(r.tierRequired ?? 1),
          position: {
            x: typeof u.x == "number" ? u.x : null,
            y: typeof u.y == "number" ? u.y : null
          }
        };
      }),
      connections: s.map((o) => {
        const r = o;
        return {
          id: String(r.id ?? ""),
          from: String(r.from ?? ""),
          to: String(r.to ?? "")
        };
      })
    }, delete i.graphVersion, delete i.startNodeIds, delete i.nodes, delete i.connections, i;
  }
}
const ot = 1, Yt = 6;
class aa extends Error {
  constructor(e, t) {
    super(t), this.code = e, this.name = "GenreCatalogError";
  }
  code;
}
function Io(n) {
  const e = Number(n);
  if (!Number.isInteger(e) || e < ot || e > Yt)
    throw new aa(
      "invalid-minimum-tier",
      `Genre Ability Minimum Tier must be an integer from ${ot} to ${Yt}.`
    );
  return e;
}
function oc(n, e, t) {
  const i = Io(t);
  let a = !1;
  const s = n.map((o) => o.id !== e ? o : (a = !0, { ...o, minimumTier: i }));
  if (!a) throw new aa("entry-missing", "Genre Ability catalog entry not found.");
  return s;
}
function rc(n, e, t) {
  let i = !1;
  const a = n.map((s) => s.id !== e ? s : (i = !0, { ...s, snapshot: t }));
  if (!i) throw new aa("entry-missing", "Genre Ability catalog entry not found.");
  return a;
}
function lc(n, e) {
  return n.filter((t) => t.id !== e);
}
function cc() {
  return new c.SchemaField({
    id: new c.StringField({ required: !0, nullable: !1, blank: !1 }),
    abilityUuid: new c.StringField({ required: !0, nullable: !1, initial: "" }),
    minimumTier: new c.NumberField({
      required: !0,
      nullable: !1,
      integer: !0,
      min: ot,
      max: Yt,
      initial: ot
    }),
    catalog: new c.StringField({
      required: !0,
      nullable: !1,
      initial: "progression",
      choices: [...Al]
    }),
    minimumSuperheroRank: new c.NumberField({
      required: !0,
      nullable: !1,
      integer: !0,
      min: 0,
      max: 5,
      initial: 0
    }),
    snapshot: Ht()
  });
}
class dc extends me {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      abilityCatalog: new c.ArrayField(cc(), {
        required: !0,
        nullable: !1,
        initial: []
      }),
      options: new c.SchemaField({
        totalEffortCapMode: new c.StringField({
          required: !0,
          nullable: !1,
          initial: "core",
          choices: [...uo]
        })
      }),
      legacyKey: new c.StringField({ required: !0, nullable: !1, initial: "" })
    };
  }
}
class uc extends me {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      rank: new c.StringField({
        required: !0,
        nullable: !1,
        initial: "untrained",
        choices: [...ie]
      }),
      defaultPool: new c.StringField({
        required: !0,
        nullable: !1,
        initial: "choose",
        choices: [...Os]
      }),
      category: new c.StringField({ required: !0, nullable: !1, initial: "general" }),
      contexts: new c.ArrayField(
        new c.StringField({ required: !0, nullable: !1, blank: !1 }),
        { required: !0, nullable: !1, initial: [] }
      ),
      initiative: new c.BooleanField({ required: !0, nullable: !1, initial: !1 }),
      acquisition: new c.SchemaField({
        minimumTier: w(1, 1),
        grantedByUuid: new c.StringField({ required: !0, nullable: !1, initial: "" }),
        notes: new c.HTMLField({ required: !0, nullable: !1, initial: "" })
      })
    };
  }
  static migrateData(e, t = {}) {
    const i = super.migrateData(e, t), a = Object.hasOwn(i, "defaultPool");
    return (!t.partial || a) && (i.defaultPool === "" || i.defaultPool === null || i.defaultPool === void 0) && (i.defaultPool = "choose"), i;
  }
}
class mc extends me {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      poolBonuses: new c.SchemaField({ might: w(), speed: w(), intellect: w() }),
      woundBonuses: new c.SchemaField({ minor: w(), moderate: w(), major: w() }),
      edgeGrant: new c.SchemaField({
        mode: new c.StringField({ required: !0, nullable: !1, initial: "none", choices: [...Ao] }),
        pool: new c.StringField({ required: !0, nullable: !1, initial: "none", choices: ["none", "might", "speed", "intellect"] }),
        amount: w(1)
      }),
      weaponUse: Hi(),
      weaponFamilies: new c.ArrayField(
        new c.StringField({ required: !0, nullable: !1, blank: !1 }),
        { required: !0, nullable: !1, initial: [] }
      ),
      armorUse: Hi(),
      cypherLimitBonus: w(),
      skillGrants: new c.ArrayField(ia(), { required: !0, nullable: !1, initial: [] }),
      choiceGroups: new c.ArrayField(na(), { required: !0, nullable: !1, initial: [] }),
      abilityGrants: new c.ArrayField(ta(), { required: !0, nullable: !1, initial: [] }),
      abilityChoiceGroups: new c.ArrayField(vo(), { required: !0, nullable: !1, initial: [] }),
      descriptorGrants: new c.ArrayField(Co(), { required: !0, nullable: !1, initial: [] }),
      descriptorChoiceGroups: new c.ArrayField(Wl(), { required: !0, nullable: !1, initial: [] }),
      instance: ea()
    };
  }
  static migrateData(e, t = {}) {
    const i = Bi(e.weaponFamilyUse), a = super.migrateData(e, t);
    return (!t.partial || Object.hasOwn(e, "weaponFamilies") || i.length > 0) && (a.weaponFamilies = le([
      ...Array.isArray(e.weaponFamilies) ? e.weaponFamilies : [],
      ...i
    ])), delete a.weaponFamilyUse, a;
  }
}
class pc extends me {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      category: new c.StringField({
        required: !0,
        nullable: !1,
        initial: "medium",
        choices: [...Le]
      }),
      family: new c.StringField({ required: !0, nullable: !1, blank: !0, initial: "" }),
      attackType: new c.StringField({
        required: !0,
        nullable: !1,
        initial: "melee",
        choices: [...Bs]
      }),
      rangeCategory: new c.StringField({
        required: !0,
        nullable: !1,
        initial: "immediate",
        choices: [...Gn]
      }),
      rangeNotes: new c.StringField({ required: !0, nullable: !1, initial: "" }),
      skillLevel: new c.StringField({
        required: !0,
        nullable: !1,
        initial: "untrained",
        choices: [...ie]
      }),
      defaultPool: new c.StringField({
        required: !0,
        nullable: !1,
        initial: "none",
        choices: ["none", ...k]
      }),
      damageOverride: new c.NumberField({
        required: !0,
        nullable: !0,
        integer: !0,
        min: 0,
        initial: null
      }),
      attackModifier: new c.NumberField({
        required: !0,
        nullable: !1,
        integer: !0,
        min: -2,
        max: 2,
        initial: 0
      }),
      bonusDamage: new c.NumberField({
        required: !0,
        nullable: !1,
        integer: !0,
        min: 0,
        initial: 0
      }),
      baseDamage: new c.NumberField({
        required: !0,
        nullable: !1,
        integer: !0,
        min: 0,
        initial: 4,
        persisted: !1
      }),
      // Legacy compatibility only. Effective Weapon familiarity is derived from the Character.
      freelyUsed: new c.BooleanField({ required: !0, nullable: !1, initial: !1 }),
      ammo: new c.SchemaField({
        enabled: new c.BooleanField({ required: !0, nullable: !1, initial: !1 }),
        value: w(),
        max: w(),
        perAttack: w(1, 1)
      }),
      // Assault rifles and submachine guns are rapid-fire weapons (p103-104).
      rapidFire: new c.BooleanField({ required: !0, nullable: !1, initial: !1 }),
      // Explosives hit every target in an area and always leave a mark (p100).
      explosive: new c.BooleanField({ required: !0, nullable: !1, initial: !1 }),
      depletion: Oi(),
      depleted: new c.BooleanField({ required: !0, nullable: !1, initial: !1 }),
      equipped: new c.BooleanField({ required: !0, nullable: !1, initial: !1 })
    };
  }
  static migrateData(e, t = {}) {
    const i = super.migrateData(e, t);
    (!t.partial || Object.hasOwn(i, "family")) && (i.family = ct(i.family));
    const a = Object.hasOwn(i, "defaultPool");
    (!t.partial || a) && i.defaultPool !== "none" && !k.includes(i.defaultPool) && (i.defaultPool = "none");
    const s = Le.includes(i.category) ? i.category : "medium", o = { light: 2, medium: 4, heavy: 6 }, r = typeof i.damageOverride == "number" ? i.damageOverride : typeof i.damage == "number" ? i.damage : null;
    if (i.bonusDamage === void 0 && r !== null && (i.bonusDamage = Math.max(0, r - o[s])), i.damageOverride = null, i.rangeCategory === void 0 && typeof i.range == "string") {
      const l = i.range;
      i.rangeCategory = Gn.includes(l) ? l : "specified", i.rangeCategory === "specified" && i.rangeNotes === void 0 && (i.rangeNotes = i.range);
    }
    return i;
  }
  prepareDerivedData() {
    super.prepareDerivedData();
    const e = { light: 2, medium: 4, heavy: 6 };
    this.baseDamage = Math.max(0, e[this.category] + this.bonusDamage);
  }
}
function fc() {
  Object.assign(CONFIG.Actor.dataModels, {
    character: Dl,
    npc: Fl
  }), Object.assign(CONFIG.Item.dataModels, {
    ability: Xl,
    skill: uc,
    weapon: pc,
    armor: Jl,
    shield: Yl,
    equipment: ic,
    cypher: ec,
    artifact: Ql,
    descriptor: tc,
    characterType: Zl,
    focus: sc,
    genre: dc,
    species: mc
  }), CONFIG.Actor.trackableAttributes = {
    character: {
      bar: ["stats.might", "stats.speed", "stats.intellect"],
      value: ["xp"]
    },
    npc: {
      bar: ["health"],
      value: ["level"]
    }
  };
}
const Y = "systems/magnusarchives/assets", Fa = {
  character: `${Y}/icons/magnuspc.webp`,
  npc: `${Y}/icons/magnusnpc.webp`
}, Ta = {
  ability: `${Y}/icons/magnusability.webp`,
  armor: `${Y}/icons/magnusarmor.webp`,
  artifact: `${Y}/icons/magnusartefact.webp`,
  cypher: `${Y}/icons/magnuscypher.webp`,
  descriptor: `${Y}/icons/magnusdescriptor.webp`,
  equipment: `${Y}/icons/magnusequipment.webp`,
  focus: `${Y}/icons/magnusfocus.webp`,
  genre: `${Y}/icons/magnusgenre.webp`,
  shield: `${Y}/icons/magnusshield.webp`,
  skill: `${Y}/icons/magnusskill.webp`,
  species: `${Y}/icons/magnusspecies.webp`,
  characterType: `${Y}/icons/magnustype.webp`,
  weapon: `${Y}/icons/magnusweapons.webp`
}, sa = {
  gamePaused: `${Y}/ui/magnusgamepaused.webp`,
  lobby: `${Y}/magnuslobby.webp`,
  turnMarker: `${Y}/ui/magnusturnmarker.webp`
};
function gc(n) {
  return n in Fa ? Fa[n] : null;
}
function hc(n) {
  return n in Ta ? Ta[n] : null;
}
function yc(n) {
  if ("prototypeToken.actorLink" in n) return !0;
  const e = n.prototypeToken;
  return !!(e && typeof e == "object" && "actorLink" in e);
}
function Sc(n, e) {
  return n === "character" && !yc(e);
}
class Ac extends Actor {
  static getDefaultArtwork(e) {
    const t = gc(String(e.type ?? ""));
    return t ? { img: t, texture: { src: t } } : super.getDefaultArtwork(e);
  }
  async _preCreate(e, t, i) {
    const a = await super._preCreate(e, t, i);
    return a === !1 ? !1 : (Sc(this.type, e) && this.prototypeToken.updateSource({ actorLink: !0 }), a);
  }
  /**
   * Rule actions will be delegated to services in later phases.
   * The document shell intentionally contains no roll or wound logic.
   */
}
function bc(n) {
  return Object.keys(n).some((e) => e === "system.poolBonuses" || e.startsWith("system.poolBonuses.") || e === "system.poolBonusChoiceGroups" || e.startsWith("system.poolBonusChoiceGroups.") || e === "system.instance.selections.poolChoices" || e.startsWith("system.instance.selections.poolChoices.") || e === "system.instance.selections.superheroicsPool" || e === "system.superhero.superheroics.poolBonus" || e === "system" && typeof n.system == "object" && n.system !== null && ("poolBonuses" in n.system || "poolBonusChoiceGroups" in n.system || "superhero" in n.system || "instance" in n.system && typeof n.system.instance == "object" && n.system.instance !== null && "selections" in n.system.instance && typeof n.system.instance.selections == "object" && n.system.instance.selections !== null && ("poolChoices" in n.system.instance.selections || "superheroicsPool" in n.system.instance.selections)));
}
function wc(n) {
  if (n["system.equipped"] === !0) return !0;
  const e = n.system;
  return !!(e && typeof e == "object" && e.equipped === !0);
}
class vc extends Item {
  static getDefaultArtwork(e) {
    const t = hc(String(e.type ?? ""));
    return t ? { img: t } : super.getDefaultArtwork(e);
  }
  async update(e, t = {}) {
    const i = this.actor?.type === "character" ? this.actor : null, a = i && (this.type === "characterType" || this.type === "descriptor" || this.type === "species") && bc(e), s = a ? Object.fromEntries(k.map((l) => [
      l,
      Number(i.system.derived.pools[l].max)
    ])) : null, o = a ? Object.fromEntries(k.map((l) => [
      l,
      Number(i.system.stats[l].value)
    ])) : null, r = await super.update(e, t);
    if (i && (this.type === "shield" || this.type === "armor") && wc(e) && t.magnusarchivesCombatEquipmentSync !== !0 && t.magnusarchivesShieldEquipmentSync !== !0)
      for (const l of i.items)
        l.id === this.id || l.type !== this.type || l.system.equipped && await l.update(
          { "system.equipped": !1 },
          { magnusarchivesCombatEquipmentSync: !0 }
        );
    if (i && s && o) {
      const l = {};
      for (const u of k) {
        const d = Number(i.system.derived.pools[u].max);
        l[`system.stats.${u}.value`] = co(o[u], s[u], d);
      }
      await i.update(l, { magnusarchivesPackagePoolSync: !0 });
    }
    return r;
  }
}
function Cc() {
  CONFIG.Actor.documentClass = Ac, CONFIG.Item.documentClass = vc;
}
const dt = 1, ni = 20, oa = 1;
function $t(n) {
  const e = Number(n);
  return Number.isFinite(e) ? Math.min(
    ni,
    Math.max(dt, Math.trunc(e))
  ) : oa;
}
function Ec(n) {
  return Number.isInteger(n) && Number(n) >= dt && Number(n) <= ni;
}
function Ro(n) {
  const e = $t(n);
  return e === 1 ? "neutral" : e <= 3 ? "low" : e <= 5 ? "elevated" : e <= 8 ? "severe" : e <= 12 ? "extreme" : e <= 16 ? "catastrophic" : "maximum";
}
function No(n) {
  return ($t(n) - dt) / (ni - dt) * 100;
}
const B = {
  difficultyVisibility: "difficultyVisibility",
  showGmRollAudit: "showGmRollAudit",
  defaultDifficultyCeiling: "defaultDifficultyCeiling",
  enabledRuleModules: "enabledRuleModules",
  interfaceHiddenDifficulty: "interfaceHiddenDifficulty",
  debugRules: "debugRules",
  worldSchemaVersion: "worldSchemaVersion",
  theme: "theme",
  horrorIntrusionRange: "horrorIntrusionRange",
  pendingIntrusionXP: "gmIntrusions"
};
function Ic(n) {
  game.settings.register(U, B.difficultyVisibility, {
    name: "MAGNUSARCHIVES.Settings.DifficultyVisibility.Name",
    hint: "MAGNUSARCHIVES.Settings.DifficultyVisibility.Hint",
    scope: "world",
    // Legacy compatibility only. Roll cards now have fixed, unambiguous disclosure rules.
    config: !1,
    type: String,
    choices: {
      full: "MAGNUSARCHIVES.Settings.DifficultyVisibility.Full",
      resultOnly: "MAGNUSARCHIVES.Settings.DifficultyVisibility.ResultOnly",
      rollOnly: "MAGNUSARCHIVES.Settings.DifficultyVisibility.RollOnly"
    },
    default: "full"
  }), game.settings.register(U, B.showGmRollAudit, {
    name: "MAGNUSARCHIVES.Settings.ShowGmRollAudit.Name",
    hint: "MAGNUSARCHIVES.Settings.ShowGmRollAudit.Hint",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1
  }), game.settings.register(U, B.defaultDifficultyCeiling, {
    name: "MAGNUSARCHIVES.Settings.DifficultyCeiling.Name",
    hint: "MAGNUSARCHIVES.Settings.DifficultyCeiling.Hint",
    scope: "world",
    config: !0,
    type: Number,
    default: 10,
    range: { min: 0, max: 15, step: 1 }
  }), game.settings.register(U, B.interfaceHiddenDifficulty, {
    name: "MAGNUSARCHIVES.Settings.HiddenDifficulty.Name",
    hint: "MAGNUSARCHIVES.Settings.HiddenDifficulty.Hint",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  }), game.settings.register(U, B.enabledRuleModules, {
    scope: "world",
    config: !1,
    type: Array,
    default: []
  }), game.settings.register(U, B.debugRules, {
    name: "MAGNUSARCHIVES.Settings.DebugRules.Name",
    hint: "MAGNUSARCHIVES.Settings.DebugRules.Hint",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1
  }), game.settings.register(U, B.worldSchemaVersion, {
    scope: "world",
    config: !1,
    type: Number,
    default: 1
  }), game.settings.register(U, B.theme, {
    name: "MAGNUSARCHIVES.Settings.Theme.Name",
    hint: "MAGNUSARCHIVES.Settings.Theme.Hint",
    scope: "world",
    config: !0,
    type: String,
    choices: n.choices(),
    default: "core",
    onChange: (e) => n.apply(e)
  }), game.settings.register(U, B.horrorIntrusionRange, {
    name: "MAGNUSARCHIVES.Horror.SettingName",
    hint: "MAGNUSARCHIVES.Horror.SettingHint",
    scope: "world",
    config: !1,
    type: Number,
    default: oa,
    range: {
      min: dt,
      max: ni,
      step: 1
    },
    onChange: (e) => Hooks.callAll(
      "magnusarchivesHorrorIntrusionRangeChanged",
      $t(e)
    )
  }), game.settings.register(U, B.pendingIntrusionXP, {
    scope: "world",
    config: !1,
    type: Array,
    default: [],
    onChange: (e) => Hooks.callAll("magnusarchivesIntrusionPendingChanged", e)
  });
}
function Oe() {
  const n = rt();
  return {
    base: {
      difficultyCeiling: Number(
        game.settings.get(U, B.defaultDifficultyCeiling)
      ),
      assetLimit: 0
    },
    enabledRuleModuleIds: n
  };
}
function rt() {
  const n = game.settings.get(U, B.enabledRuleModules);
  return Array.isArray(n) ? n.filter((e) => typeof e == "string") : [];
}
function Li() {
  const n = game.settings.get(U, B.difficultyVisibility);
  return n === "resultOnly" || n === "rollOnly" ? n : "full";
}
function Mo() {
  return game.settings.get(U, B.interfaceHiddenDifficulty) === !0;
}
function ji() {
  return game.settings.get(U, B.showGmRollAudit) === !0;
}
function $n() {
  return typeof game > "u" ? oa : $t(
    game.settings.get(U, B.horrorIntrusionRange)
  );
}
async function Rc(n) {
  if (!game.user.isGM) throw new Error(game.i18n.localize("MAGNUSARCHIVES.Horror.Errors.GMOnly"));
  if (!Ec(n))
    throw new Error(game.i18n.localize("MAGNUSARCHIVES.Horror.Errors.InvalidRange"));
  return await game.settings.set(U, B.horrorIntrusionRange, n), n;
}
const ra = {
  tag: "form",
  form: {
    closeOnSubmit: !1,
    submitOnChange: !0
  }
};
function la(n) {
  return n.system.schema.fields;
}
function ca(n, e) {
  return Object.fromEntries(Object.entries(n).map(([t, i]) => [
    t,
    e.has(t) ? function(...s) {
      if (this.isEditable)
        return i.apply(this, s);
    } : i
  ]));
}
function da(n, e, t) {
  if (!e) {
    for (const i of n.querySelectorAll(
      "input[name], select[name], textarea[name]"
    )) i.disabled = !0;
    for (const i of n.querySelectorAll("[data-edit]"))
      i.removeAttribute("data-edit");
    for (const i of n.querySelectorAll("[data-action]"))
      t.has(i.dataset.action ?? "") && (i.setAttribute("aria-disabled", "true"), i instanceof HTMLButtonElement ? i.disabled = !0 : (i.removeAttribute("tabindex"), i.setAttribute("inert", "")));
  }
}
const Nc = Object.freeze({ minor: 2, moderate: 5 }), Go = 10;
class Mc {
  #e;
  constructor(e) {
    this.#e = e;
  }
  costFor(e) {
    return Nc[e];
  }
  canApply(e) {
    try {
      qe(e);
    } catch {
      return !1;
    }
    const { wounds: t, stats: i } = e.system;
    return this.rally(t, i.might.value, "minor").success || this.rally(t, i.might.value, "moderate").success;
  }
  preview(e, t, i = this.costFor(t)) {
    try {
      qe(e);
    } catch {
      return {
        success: !1,
        severity: t,
        cost: i,
        mightValue: e.system.stats.might.value,
        wounds: e.system.wounds,
        removed: null,
        failure: "no-wound"
      };
    }
    return this.rally(
      e.system.wounds,
      e.system.stats.might.value,
      t,
      void 0,
      i
    );
  }
  rally(e, t, i, a, s) {
    if (i === "major")
      return {
        success: !1,
        severity: i,
        cost: 0,
        mightValue: t,
        wounds: e,
        removed: null,
        failure: "major-not-rallyable"
      };
    const o = s ?? this.costFor(i);
    if (!Number.isInteger(o) || o < 0 || o > Go)
      return {
        success: !1,
        severity: i,
        cost: o,
        mightValue: t,
        wounds: e,
        removed: null,
        failure: "invalid-cost"
      };
    const r = this.#e.removeOne(e, i, a);
    return r.removed ? t < o ? {
      success: !1,
      severity: i,
      cost: o,
      mightValue: t,
      wounds: e,
      removed: null,
      failure: "insufficient-might"
    } : {
      success: !0,
      severity: i,
      cost: o,
      mightValue: t - o,
      wounds: r.wounds,
      removed: r.removed,
      failure: null
    } : {
      success: !1,
      severity: i,
      cost: o,
      mightValue: t,
      wounds: r.wounds,
      removed: null,
      failure: "no-wound"
    };
  }
  async apply(e, t, i, a) {
    qe(e);
    const s = this.rally(
      e.system.wounds,
      e.system.stats.might.value,
      t,
      i,
      a
    );
    return s.success && await e.update({
      "system.stats.might.value": s.mightValue,
      "system.wounds": s.wounds
    }), s;
  }
}
function Uo(n) {
  return n === "one-action" ? ["normal", "lastAction", "nonRest"] : ["normal", "nonRest"];
}
function Gc(n, e) {
  if (!Uo(n).includes(e))
    throw new Error(`Recovery mode '${e}' is not available for '${n}'.`);
  return e === "nonRest" ? { kind: "nonRest", lastAction: !1 } : { kind: "normal", lastAction: e === "lastAction" };
}
function jt(n, e) {
  return Number(n[e] ?? 0);
}
function Be(n, e) {
  return String(n[e] ?? "");
}
function za(n, e) {
  const t = n[e];
  return t === !0 || t === "true" || t === "on";
}
function Je(n) {
  const e = n instanceof Error ? n.message : String(n);
  ui.notifications.error(e);
}
async function ua(n, e, t = game.i18n.localize("MAGNUSARCHIVES.Actions.Apply")) {
  return foundry.applications.api.DialogV2.input({
    window: { title: n },
    content: e,
    rejectClose: !1,
    ok: { label: t }
  });
}
function $i(n) {
  return n.replace(/[&<>"']/g, (e) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[e]);
}
async function Uc(n, e, t) {
  const i = n.system.wounds[e].find((s) => s.id === t);
  if (!i) {
    Je(new Error(`Wound '${t}' was not found in ${e} Wounds.`));
    return;
  }
  const a = await foundry.applications.api.DialogV2.input({
    window: { title: game.i18n.localize("MAGNUSARCHIVES.Wounds.EditTitle") },
    content: `<div class="magnusarchives-dialog-fields">
      <label>${game.i18n.localize("MAGNUSARCHIVES.Wounds.Label")}
        <input name="label" type="text" value="${$i(i.label)}">
      </label>
      <label>${game.i18n.localize("MAGNUSARCHIVES.Wounds.Description")}
        <textarea name="description">${$i(i.description)}</textarea>
      </label>
    </div>`,
    rejectClose: !1,
    ok: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Save") }
  });
  if (a)
    try {
      await game.magnusarchives.services.wounds.edit(n, e, t, {
        label: Be(a, "label"),
        description: Be(a, "description")
      }), ui.notifications.info(game.i18n.localize("MAGNUSARCHIVES.Wounds.Updated"));
    } catch (s) {
      Je(s);
    }
}
async function kc(n, e, t) {
  if (await foundry.applications.api.DialogV2.confirm({
    window: { title: game.i18n.localize("MAGNUSARCHIVES.Wounds.DeleteTitle") },
    content: `<div class="magnusarchives magnusarchives-dialog"><p>${game.i18n.localize("MAGNUSARCHIVES.Wounds.DeleteConfirm")}</p></div>`,
    rejectClose: !1,
    modal: !0,
    yes: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Delete") },
    no: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Cancel") }
  }))
    try {
      await game.magnusarchives.services.wounds.delete(n, e, t), ui.notifications.info(game.i18n.localize("MAGNUSARCHIVES.Wounds.Deleted"));
    } catch (a) {
      Je(a);
    }
}
async function Hc(n) {
  const e = await ua(
    game.i18n.localize("MAGNUSARCHIVES.Actions.ApplyWound"),
    `<div class="magnusarchives-dialog-fields">
      <label>${game.i18n.localize("MAGNUSARCHIVES.Wounds.SeverityLabel")}
        <select name="severity">
          ${ge.map((t) => `<option value="${t}">${game.i18n.localize(`MAGNUSARCHIVES.Wounds.Severity.${t}`)}</option>`).join("")}
        </select>
      </label>
      <label>${game.i18n.localize("MAGNUSARCHIVES.Wounds.Label")}
        <input name="label" type="text">
      </label>
    </div>`
  );
  if (e)
    try {
      const t = Be(e, "label"), i = await game.magnusarchives.services.wounds.apply(
        n,
        Be(e, "severity"),
        t ? { label: t } : {}
      ), a = i.applied ? `${i.appliedSeverity}${i.dead ? ` — ${game.i18n.localize("MAGNUSARCHIVES.Wounds.Dead")}` : ""}` : game.i18n.localize("MAGNUSARCHIVES.Wounds.NoFourthMajor");
      ui.notifications.info(a);
    } catch (t) {
      Je(t);
    }
}
async function $c(n) {
  const e = await ua(
    game.i18n.localize("MAGNUSARCHIVES.Actions.PoolDamage"),
    `<div class="magnusarchives-dialog-fields">
      <label>${game.i18n.localize("MAGNUSARCHIVES.Pools.Pool")}
        <select name="pool">
          <option value="might">${game.i18n.localize("MAGNUSARCHIVES.Pools.Might")}</option>
          <option value="speed">${game.i18n.localize("MAGNUSARCHIVES.Pools.Speed")}</option>
          <option value="intellect">${game.i18n.localize("MAGNUSARCHIVES.Pools.Intellect")}</option>
        </select>
      </label>
      <label>${game.i18n.localize("MAGNUSARCHIVES.Pools.Damage")}
        <input name="damage" type="number" value="1" min="0" step="1">
      </label>
    </div>`
  );
  if (e)
    try {
      const t = await game.magnusarchives.services.wounds.damagePool(
        n,
        Be(e, "pool"),
        jt(e, "damage")
      );
      ui.notifications.info(
        t.overflowSeverity ? `${t.pool}: ${t.value}; ${t.overflowSeverity} Wound` : `${t.pool}: ${t.value}`
      );
    } catch (t) {
      Je(t);
    }
}
async function Pa(n, e, t) {
  const i = n.system.recovery.slots?.length ? n.system.recovery.slots : lt(n.system.recovery.used), a = Lt(i);
  if (a.length === 0) {
    ui.notifications.warn(game.i18n.localize("MAGNUSARCHIVES.Recovery.NoneAvailable"));
    return;
  }
  if (t && !a.some((u) => u.id === t && u.type === e)) {
    ui.notifications.warn(game.i18n.localize("MAGNUSARCHIVES.Recovery.AlreadyUsed"));
    return;
  }
  let s = e, o = t;
  if (!s || !o) {
    const u = await foundry.applications.api.DialogV2.input({
      window: { title: game.i18n.localize("MAGNUSARCHIVES.Recovery.Choose") },
      content: `<div class="magnusarchives magnusarchives-dialog magnusarchives-recovery-dialog">
        <section class="magnusarchives-dialog-section">
          <span class="magnusarchives-dialog-section-heading">${game.i18n.localize("MAGNUSARCHIVES.Recovery.Available")}</span>
          <label class="magnusarchives-dialog-field">${game.i18n.localize("MAGNUSARCHIVES.Recovery.Choose")}
            <select name="slotId">${a.map((d) => `<option value="${d.id}">${game.i18n.localize(`MAGNUSARCHIVES.Recovery.${d.type}`)}</option>`).join("")}</select>
          </label>
        </section>
      </div>`,
      rejectClose: !1,
      ok: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Next") }
    });
    if (!u) return;
    if (o = Be(u, "slotId"), s = a.find((d) => d.id === o)?.type, !s || !o) {
      ui.notifications.warn(game.i18n.localize("MAGNUSARCHIVES.Recovery.AlreadyUsed"));
      return;
    }
  }
  const r = Uo(s), l = await foundry.applications.api.DialogV2.input({
    window: { title: `${game.i18n.localize("MAGNUSARCHIVES.Actions.Recovery")} — ${game.i18n.localize(`MAGNUSARCHIVES.Recovery.${s}`)}` },
    content: `<div class="magnusarchives magnusarchives-dialog magnusarchives-recovery-dialog">
      <header class="magnusarchives-dialog-heading">
        <span>${game.i18n.localize("MAGNUSARCHIVES.Actions.Recovery")}</span>
        <strong>${game.i18n.localize(`MAGNUSARCHIVES.Recovery.${s}`)}</strong>
      </header>
      <section class="magnusarchives-dialog-section magnusarchives-recovery-formula">
        <span class="magnusarchives-dialog-section-heading">${game.i18n.localize("MAGNUSARCHIVES.Recovery.Roll")}</span>
        <strong class="magnusarchives-dialog-value">${$i(n.system.derived.recovery.formula)}</strong>
      </section>
      <section class="magnusarchives-dialog-section">
        <span class="magnusarchives-dialog-section-heading">${game.i18n.localize("MAGNUSARCHIVES.Recovery.KindLabel")}</span>
        <div class="magnusarchives-dialog-button-group recovery-mode-buttons" role="radiogroup" aria-label="${game.i18n.localize("MAGNUSARCHIVES.Recovery.KindLabel")}">
          ${r.map((u) => `<label class="magnusarchives-dialog-toggle"><input name="mode" type="radio" value="${u}"${u === "normal" ? " checked" : ""}><span>${game.i18n.localize(`MAGNUSARCHIVES.Recovery.Kind.${u}`)}</span></label>`).join("")}
        </div>
      </section>
    </div>`,
    rejectClose: !1,
    ok: { label: game.i18n.localize("MAGNUSARCHIVES.Recovery.Recover") }
  });
  if (l)
    try {
      const u = Gc(s, Be(l, "mode"));
      if (u.kind === "nonRest") {
        await game.magnusarchives.services.recovery.completeNonRest(n, s, o), ui.notifications.info(game.i18n.localize("MAGNUSARCHIVES.Recovery.NonRestCompleted"));
        return;
      }
      const d = await game.magnusarchives.services.recovery.rollNormal(
        n,
        s,
        u.lastAction,
        o
      ), p = s === "1-hour" ? `<label>${game.i18n.localize("MAGNUSARCHIVES.Rest.OneHourChoice")}
          <select name="oneHourChoice">
            <option value="remove-moderate">${game.i18n.localize("MAGNUSARCHIVES.Rest.RemoveModerate")}</option>
            <option value="remove-minors">${game.i18n.localize("MAGNUSARCHIVES.Rest.RemoveMinors")}</option>
          </select>
        </label>` : s === "10-hours" ? `<label><input name="exchange" type="checkbox"> ${game.i18n.localize("MAGNUSARCHIVES.Rest.ExchangeMinor")}</label>
          <label><input name="majorSuccess" type="checkbox"> ${game.i18n.localize("MAGNUSARCHIVES.Rest.MajorTaskSuccess")}</label>` : s === "10-minutes" ? `<p>${game.i18n.localize("MAGNUSARCHIVES.Recovery.TenMinuteBenefit")}</p>` : "", y = await ua(
        `${game.i18n.localize("MAGNUSARCHIVES.Actions.Recovery")} — ${d.total}`,
        `<div class="magnusarchives magnusarchives-dialog magnusarchives-recovery-dialog magnusarchives-recovery-allocation-dialog">
        <section class="magnusarchives-dialog-section">
          <span class="magnusarchives-dialog-section-heading">${game.i18n.localize("MAGNUSARCHIVES.Recovery.Result")}</span>
          <div class="magnusarchives-dialog-summary-row"><span>${$i(n.system.derived.recovery.formula)}</span><strong>${d.total}</strong></div>
          ${d.lastAction ? `<div class="magnusarchives-dialog-summary-row"><span>${game.i18n.localize("MAGNUSARCHIVES.Recovery.Kind.lastAction")}</span><strong>+2</strong></div>` : ""}
        </section>
        <section class="magnusarchives-dialog-section magnusarchives-dialog-field-grid">
          <label class="magnusarchives-dialog-field">${game.i18n.localize("MAGNUSARCHIVES.Pools.Might")} <input name="might" type="number" value="0" min="0" max="${d.total}" step="1"></label>
          <label class="magnusarchives-dialog-field">${game.i18n.localize("MAGNUSARCHIVES.Pools.Speed")} <input name="speed" type="number" value="0" min="0" max="${d.total}" step="1"></label>
          <label class="magnusarchives-dialog-field">${game.i18n.localize("MAGNUSARCHIVES.Pools.Intellect")} <input name="intellect" type="number" value="0" min="0" max="${d.total}" step="1"></label>
        </section>
        ${p ? `<section class="magnusarchives-dialog-section magnusarchives-dialog-fields">${p}</section>` : ""}
      </div>`,
        game.i18n.localize("MAGNUSARCHIVES.Recovery.Recover")
      );
      if (!y) return;
      const m = await game.magnusarchives.services.recovery.completeNormal(
        n,
        d,
        {
          might: jt(y, "might"),
          speed: jt(y, "speed"),
          intellect: jt(y, "intellect")
        },
        {
          oneHourChoice: Be(y, "oneHourChoice"),
          removeMinorsInsteadOfOneModerate: za(y, "exchange"),
          majorTaskSucceeded: za(y, "majorSuccess")
        }
      ), h = d.total - m.recovery.unspent, f = m.rest?.result.removed.length ?? 0;
      ui.notifications.info(
        `${game.i18n.localize("MAGNUSARCHIVES.Recovery.Restored")}: ${h}; ${game.i18n.localize("MAGNUSARCHIVES.Rest.Removed")}: ${f}`
      );
    } catch (u) {
      Je(u);
    }
}
async function Vc(n) {
  const e = game.magnusarchives.services.rally, t = n.system.stats.might.value, i = n.system.derived.pools.might.max, a = e.costFor("minor"), s = e.costFor("moderate"), o = e.preview(n, "minor", a), r = await foundry.applications.api.DialogV2.input({
    window: { title: game.i18n.localize("MAGNUSARCHIVES.Actions.Rally") },
    content: Dc(
      t,
      i,
      a,
      s,
      o.success ? o.mightValue : null
    ),
    rejectClose: !1,
    ok: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Rally") },
    render: (l, u) => Fc(u.element, n)
  });
  if (r)
    try {
      const l = await game.magnusarchives.services.rally.apply(
        n,
        Be(r, "severity"),
        void 0,
        jt(r, "cost")
      );
      if (!l.success) throw new Error(l.failure ?? "Rally failed.");
      ui.notifications.info(`${game.i18n.localize("MAGNUSARCHIVES.Actions.Rally")}: -${l.cost} Might`);
    } catch (l) {
      Je(l);
    }
}
function Dc(n, e, t = 2, i = 5, a = null) {
  const s = game.i18n.localize("MAGNUSARCHIVES.Wounds.Severity.minor"), o = game.i18n.localize("MAGNUSARCHIVES.Wounds.Severity.moderate");
  return `<div class="magnusarchives magnusarchives-dialog magnusarchives-rally-dialog" data-current-might="${n}" data-max-might="${e}">
    <header class="magnusarchives-dialog-heading"><span>${game.i18n.localize("MAGNUSARCHIVES.Actions.Rally")}</span><strong data-rally-heading>${s}</strong></header>
    <section class="magnusarchives-dialog-section">
      <div class="magnusarchives-dialog-button-group" role="radiogroup" aria-label="${game.i18n.localize("MAGNUSARCHIVES.Wounds.SeverityLabel")}">
        <label class="magnusarchives-dialog-toggle"><input type="radio" name="severity" value="minor" data-default-cost="${t}" checked><span>${s}</span></label>
        <label class="magnusarchives-dialog-toggle"><input type="radio" name="severity" value="moderate" data-default-cost="${i}"><span>${o}</span></label>
      </div>
      <label class="magnusarchives-dialog-field">${game.i18n.localize("MAGNUSARCHIVES.Rally.Cost")}
        <input name="cost" type="number" min="0" max="${Go}" step="1" value="${t}">
      </label>
    </section>
    <section class="magnusarchives-dialog-section" aria-label="${game.i18n.localize("MAGNUSARCHIVES.Roll.Summary")}">
      <div class="magnusarchives-dialog-summary-row"><span>${game.i18n.localize("MAGNUSARCHIVES.Rally.Cost")}</span><strong><span data-rally-cost>${t}</span> Might</strong></div>
      <div class="magnusarchives-dialog-summary-row"><span>${game.i18n.localize("MAGNUSARCHIVES.Rally.CurrentMight")}</span><strong>${n} / ${e}</strong></div>
      <div class="magnusarchives-dialog-summary-row"><span>${game.i18n.localize("MAGNUSARCHIVES.Rally.AfterRally")}</span><strong><span data-rally-after>${a ?? "—"}</span> / ${e}</strong></div>
      <p class="magnusarchives-dialog-callout is-danger" data-rally-error ${a === null ? "" : "hidden"}>${game.i18n.localize("MAGNUSARCHIVES.Rally.Unavailable")}</p>
    </section>
  </div>`;
}
function Fc(n, e) {
  const t = n.querySelector('input[name="cost"]'), i = [...n.querySelectorAll('input[name="severity"]')], a = n.querySelector("[data-rally-cost]"), s = n.querySelector("[data-rally-after]"), o = n.querySelector("[data-rally-heading]"), r = n.querySelector("[data-rally-error]"), l = n.querySelector('button[data-action="ok"]');
  if (!t) return;
  const u = () => {
    const d = Number(t.value), p = i.find((m) => m.checked)?.value, y = p ? game.magnusarchives.services.rally.preview(e, p, d) : null;
    a && (a.textContent = Number.isInteger(d) ? String(d) : "—"), s && (s.textContent = y?.success ? String(y.mightValue) : "—"), r && (r.hidden = y?.success === !0, r.textContent = game.i18n.localize(y?.failure === "insufficient-might" ? "MAGNUSARCHIVES.Rally.InsufficientMight" : y?.failure === "invalid-cost" ? "MAGNUSARCHIVES.Rally.InvalidCost" : "MAGNUSARCHIVES.Rally.NoWound")), l && (l.disabled = y?.success !== !0);
  };
  for (const d of i) d.addEventListener("change", () => {
    d.checked && (t.value = String(Number(d.dataset.defaultCost ?? 0)), o && (o.textContent = d.nextElementSibling?.textContent ?? d.value), u());
  });
  t.addEventListener("input", u), u();
}
async function Tc(n, e) {
  const t = kn(n.system, e), i = await foundry.applications.api.DialogV2.input({
    window: { title: game.i18n.localize("MAGNUSARCHIVES.Overrides.Edit") },
    content: `<div class="magnusarchives magnusarchives-dialog magnusarchives-override-dialog">
      <section class="magnusarchives-dialog-section">
        <div class="magnusarchives-dialog-summary-row"><span>${game.i18n.localize("MAGNUSARCHIVES.Overrides.Calculated")}</span><strong>${t.calculated}</strong></div>
        <label class="magnusarchives-dialog-field">${game.i18n.localize("MAGNUSARCHIVES.Overrides.Override")}
          <input name="value" type="number" min="${t.minimum}" step="1" value="${t.override ?? t.effective}">
        </label>
        <div class="magnusarchives-dialog-summary-row"><span>${game.i18n.localize("MAGNUSARCHIVES.Overrides.Effective")}</span><strong>${t.effective}</strong></div>
      </section>
    </div>`,
    rejectClose: !1,
    ok: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Apply") }
  });
  if (!i) return;
  const a = Number(i.value);
  if (!Number.isInteger(a) || a < t.minimum) {
    Je(new Error(game.i18n.localize("MAGNUSARCHIVES.Overrides.Invalid")));
    return;
  }
  await n.update({ [t.path]: a });
}
function xa(n) {
  return n.replace(/[&<>"']/g, (e) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[e]);
}
function Ri(n, e) {
  const t = Number(n);
  if (!Number.isInteger(t)) throw new Error(`${e} must be a whole number.`);
  return t;
}
function ko(n) {
  ui.notifications.error(n instanceof Error ? n.message : String(n));
}
function zc(n, e) {
  for (const t of ge) {
    if (!Number.isInteger(e[t])) throw new Error(`${t} modifier must be a whole number.`);
    if (n[t] + e[t] < 1)
      throw new Error(`${t} Wound capacity must remain at least 1.`);
  }
  return { ...e };
}
async function Pc(n) {
  const e = n.system.derived.wounds.calculatedCapacities, t = n.system.overrides.wounds ?? { minor: 0, moderate: 0, major: 0 }, i = await foundry.applications.api.DialogV2.input({
    window: { title: game.i18n.localize("MAGNUSARCHIVES.Overrides.WoundsEdit") },
    content: `<div class="magnusarchives magnusarchives-dialog magnusarchives-wound-override-dialog">
      <section class="magnusarchives-dialog-section">
        <span class="magnusarchives-dialog-section-heading">${game.i18n.localize("MAGNUSARCHIVES.Overrides.WoundModifiers")}</span>
        <div class="magnusarchives-dialog-field-grid">
          ${ge.map((a) => `<label class="magnusarchives-dialog-field">${game.i18n.localize(`MAGNUSARCHIVES.Wounds.Severity.${a}`)}
            <input name="${a}" type="number" step="1" value="${t[a]}">
            <small>${game.i18n.localize("MAGNUSARCHIVES.Overrides.Calculated")}: ${e[a]}</small>
          </label>`).join("")}
        </div>
      </section>
    </div>`,
    rejectClose: !1,
    ok: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Save") }
  });
  if (i)
    try {
      const a = zc(e, {
        minor: Ri(i.minor, "Minor"),
        moderate: Ri(i.moderate, "Moderate"),
        major: Ri(i.major, "Major")
      });
      await n.update({ "system.overrides.wounds": a });
    } catch (a) {
      ko(a);
    }
}
function xc(n) {
  return ke.map((e) => `<option value="${e}"${e === n ? " selected" : ""}>${game.i18n.localize(`MAGNUSARCHIVES.Recovery.${e}`)}</option>`).join("");
}
function Ho(n) {
  return `<div class="recovery-override-slot" data-recovery-slot-id="${xa(n.id)}">
    <i class="fa-solid fa-grip-lines" aria-hidden="true"></i>
    <select name="slotType__${xa(n.id)}" aria-label="${game.i18n.localize("MAGNUSARCHIVES.Overrides.RecoverySlotType")}">${xc(n.type)}</select>
    <span class="recovery-slot-state">${n.used ? game.i18n.localize("MAGNUSARCHIVES.Overrides.Used") : game.i18n.localize("MAGNUSARCHIVES.Overrides.Available")}</span>
    <span class="character-settings-row-actions">
      <button type="button" class="magnusarchives-icon-action" data-recovery-slot-move="up" title="${game.i18n.localize("MAGNUSARCHIVES.Actions.MoveUp")}"><i class="fa-solid fa-arrow-up"></i></button>
      <button type="button" class="magnusarchives-icon-action" data-recovery-slot-move="down" title="${game.i18n.localize("MAGNUSARCHIVES.Actions.MoveDown")}"><i class="fa-solid fa-arrow-down"></i></button>
      <button type="button" class="magnusarchives-icon-action" data-recovery-slot-remove title="${game.i18n.localize("MAGNUSARCHIVES.Actions.Remove")}"><i class="fa-solid fa-trash"></i></button>
    </span>
  </div>`;
}
function qc(n, e) {
  return `<div class="magnusarchives magnusarchives-dialog magnusarchives-recovery-override-dialog">
    <section class="magnusarchives-dialog-section">
      <span class="magnusarchives-dialog-section-heading">${game.i18n.localize("MAGNUSARCHIVES.Overrides.RecoveryTrack")}</span>
      <input type="hidden" name="slotOrder" value="${n.map((t) => t.id).join(",")}">
      <div class="recovery-override-slots">${n.map(Ho).join("")}</div>
      <button type="button" class="compact-inline-action recovery-slot-add" data-recovery-slot-add><i class="fa-solid fa-plus"></i> ${game.i18n.localize("MAGNUSARCHIVES.Overrides.AddRecoverySlot")}</button>
    </section>
    <section class="magnusarchives-dialog-section">
      <label class="magnusarchives-dialog-field">${game.i18n.localize("MAGNUSARCHIVES.Overrides.RecoveryRollModifier")}
        <input name="rollModifier" type="number" min="-20" max="20" step="1" value="${e}">
      </label>
    </section>
  </div>`;
}
function on(n) {
  const e = [...n.querySelectorAll("[data-recovery-slot-id]")], t = n.querySelector('input[name="slotOrder"]');
  t && (t.value = e.map((i) => i.dataset.recoverySlotId ?? "").filter(Boolean).join(","));
  for (const [i, a] of e.entries()) {
    const s = a.querySelector('[data-recovery-slot-move="up"]'), o = a.querySelector('[data-recovery-slot-move="down"]'), r = a.querySelector("[data-recovery-slot-remove]");
    s && (s.disabled = i === 0), o && (o.disabled = i === e.length - 1), r && (r.disabled = e.length <= 1);
  }
}
function Oc(n) {
  on(n), n.addEventListener("click", (e) => {
    const t = e.target instanceof Element ? e.target.closest("button") : null;
    if (!t) return;
    const i = t.closest("[data-recovery-slot-id]"), a = n.querySelector(".recovery-override-slots");
    if (t.hasAttribute("data-recovery-slot-add") && a) {
      const s = { id: _e(), type: "one-action", used: !1 };
      a.insertAdjacentHTML("beforeend", Ho(s)), on(n);
      return;
    }
    !i || !a || (t.hasAttribute("data-recovery-slot-remove") && i.remove(), t.dataset.recoverySlotMove === "up" && i.previousElementSibling && a.insertBefore(i, i.previousElementSibling), t.dataset.recoverySlotMove === "down" && i.nextElementSibling && a.insertBefore(i.nextElementSibling, i), on(n));
  });
}
function Bc(n, e) {
  const t = String(n.slotOrder ?? "").split(",").filter(Boolean);
  if (t.length === 0 || new Set(t).size !== t.length) throw new Error("Recovery track must contain unique slots.");
  const i = new Map(e.map((o) => [o.id, o])), a = t.map((o) => {
    const r = String(n[`slotType__${o}`] ?? "");
    if (!ke.includes(r)) throw new Error(`Invalid Recovery type '${r}'.`);
    return { id: o, type: r, used: i.get(o)?.used ?? !1 };
  }), s = Ri(n.rollModifier, "Recovery roll modifier");
  if (s < -20 || s > 20) throw new Error("Recovery roll modifier must be between -20 and 20.");
  return { slots: a, rollModifier: s };
}
async function Lc(n) {
  const e = n.system.recovery.slots, t = await foundry.applications.api.DialogV2.input({
    window: { title: game.i18n.localize("MAGNUSARCHIVES.Overrides.RecoveryEdit") },
    content: qc(e, n.system.recovery.rollModifier),
    rejectClose: !1,
    ok: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Save") },
    render: (i, a) => Oc(a.element)
  });
  if (t)
    try {
      const i = Bc(t, e);
      await n.update({
        "system.recovery.slots": i.slots,
        "system.recovery.used": Rt(i.slots),
        "system.recovery.customized": !0,
        "system.recovery.rollModifier": i.rollModifier
      });
    } catch (i) {
      ko(i);
    }
}
async function jc(n) {
  await n.update({ "system.overrides.wounds": { minor: 0, moderate: 0, major: 0 } });
}
async function Wc(n) {
  const e = Zr(n.system.recovery.slots);
  await n.update({
    "system.recovery.slots": e,
    "system.recovery.used": Rt(e),
    "system.recovery.customized": !1,
    "system.recovery.rollModifier": 0
  });
}
function _c(n) {
  const e = n?.token?.texture?.src;
  if (typeof e == "string" && e.trim()) return e;
  const t = n?.img;
  return typeof t == "string" ? t.trim() : "";
}
function Ue(n) {
  const e = _c(n), t = n?.system && typeof n.system == "object" ? n.system : null, i = t?.appearance && typeof t.appearance == "object" ? t.appearance : null, a = typeof i?.color == "string" ? i.color : "", s = yo(a), o = ho(a), r = [
    ...s ? [`--magnusarchives-chat-accent: ${s}`] : [],
    ...o ? [`--magnusarchives-chat-tint: ${o}`] : []
  ].join("; ");
  return {
    ...e ? { actorImage: e } : {},
    ...r ? { chatCardStyle: r } : {}
  };
}
function Kc(n, e = []) {
  return {
    kind: "gm-intrusion",
    intrusionId: n.id,
    mode: n.mode,
    sourceActorId: n.targets[0]?.actorId ?? "",
    sourceActorName: n.targets[0]?.actorName ?? "",
    targetXp: n.targetXp,
    sharedXp: n.sharedXp,
    status: n.mode === "targeted" && n.sharedXp > 0 ? "pending" : "resolved",
    recipients: [...e],
    affectedCharacters: n.targets.map((t) => ({
      actorId: t.actorId,
      actorName: t.actorName,
      actorImage: t.actorImage ?? ""
    }))
  };
}
function Xc(n) {
  const e = n.affectedCharacters ?? [], t = e.find((i) => i.actorId === n.sourceActorId) ?? (n.sourceActorId ? {
    actorId: n.sourceActorId,
    actorName: n.sourceActorName,
    actorImage: ""
  } : void 0);
  return {
    mode: n.mode,
    isTargeted: n.mode === "targeted",
    isGroup: n.mode === "group",
    isFree: n.mode === "free",
    sourceActorName: n.sourceActorName,
    targetXp: n.targetXp,
    sharedXp: n.sharedXp,
    pending: n.status === "pending",
    resolving: n.status === "resolving",
    resolved: n.status === "resolved",
    recipients: n.recipients,
    hasRecipients: n.recipients.length > 0,
    affectedCharacters: e,
    hasAffectedCharacters: e.length > 0,
    ...t ? { sourceCharacter: t } : {},
    ...n.resolvedRecipient ? { resolvedRecipient: n.resolvedRecipient } : {}
  };
}
function rn(n) {
  if (!n || typeof n != "object") return !1;
  const e = n;
  return e.kind === "gm-intrusion" && typeof e.intrusionId == "string" && typeof e.sourceActorId == "string" && (e.mode === "targeted" || e.mode === "group" || e.mode === "free") && (e.status === "pending" || e.status === "resolving" || e.status === "resolved") && Array.isArray(e.recipients);
}
class Yc {
  async publish(e, t, i = []) {
    const a = Kc(e, i), s = await this.render(a, t);
    return await ChatMessage.create({
      speaker: ChatMessage.getSpeaker(
        t ? { actor: t } : void 0
      ),
      content: s,
      flags: { magnusarchives: { gmIntrusion: a } }
    });
  }
  async update(e, t, i) {
    const a = await this.render(t, i);
    await e.update({ content: a, "flags.magnusarchives.gmIntrusion": t });
  }
  async render(e, t) {
    return foundry.applications.handlebars.renderTemplate(
      "systems/magnusarchives/templates/chat/gm-intrusion-card.hbs",
      {
        ...Xc(e),
        ...Ue(t)
      }
    );
  }
}
const Ft = "system." + U;
function Jt() {
  return [...game.users];
}
function $o() {
  return Jt().filter((n) => n.active);
}
function hi() {
  return [...game.actors].filter((n) => n.type === "character").map((n) => n);
}
function De(n) {
  const e = game.actors.get(n);
  return e?.type === "character" ? e : null;
}
function ln() {
  return $o().filter((n) => n.isGM).sort((n, e) => n.id.localeCompare(e.id))[0] ?? null;
}
function Tt(n, e) {
  return Jt().filter((t) => !t.isGM && (!e || t.active)).filter((t) => n.testUserPermission(t, CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER)).sort((t, i) => t.id.localeCompare(i.id));
}
function cn(n) {
  const e = n.filter((t) => !t.isGM).sort((t, i) => t.id.localeCompare(i.id));
  return e.find((t) => t.active) ?? e[0] ?? null;
}
function yi(n, e) {
  const t = new Set(Jt().filter((a) => !a.isGM).map((a) => a.character?.id).filter((a) => typeof a == "string" && a.length > 0));
  return [...new Map(n.filter((a) => a.type === "character").map((a) => [a.id, a])).values()].filter((a) => a.id !== e).filter((a) => t.has(a.id)).map((a) => ({ actorId: a.id, actorName: a.name, actorImage: a.img ?? "" })).sort((a, s) => a.actorName.localeCompare(s.actorName));
}
function qa(n) {
  if (!n || typeof n != "object") return !1;
  const e = n;
  return typeof e.intrusionId == "string" && e.intrusionId.length > 0 && typeof e.messageId == "string" && e.messageId.length > 0 && typeof e.sourceActorId == "string" && e.sourceActorId.length > 0 && Number.isInteger(e.amount) && Number(e.amount) > 0 && (e.responderUserId === void 0 || typeof e.responderUserId == "string");
}
function Jc(n) {
  if (!n || typeof n != "object") return !1;
  const e = n;
  return typeof e.intrusionId == "string" && e.intrusionId.length > 0 && e.messageId === void 0 && typeof e.sourceActorId == "string" && e.sourceActorId.length > 0 && Number.isInteger(e.amount) && Number(e.amount) > 0 && (e.responderUserId === void 0 || typeof e.responderUserId == "string");
}
function Qc(n, e) {
  return JSON.stringify(n) === JSON.stringify(e);
}
class Zc {
  #e;
  #t;
  #i = /* @__PURE__ */ new Set();
  #n = /* @__PURE__ */ new Map();
  #a = !1;
  constructor(e, t) {
    this.#e = e, this.#t = t;
  }
  initialize() {
    game.socket.on(Ft, (e) => {
      this.#d(e).catch((t) => {
        console.error(U + " | GM Intrusion socket error", t), game.user.isGM && ui.notifications.error(t instanceof Error ? t.message : String(t));
      });
    }), Hooks.on("renderChatMessageHTML", (e, t) => {
      this.#r(e, t);
    }), Hooks.on("updateUser", () => {
      this.#m() && this.retryPendingDistributions();
    }), Hooks.on("createActor", () => {
      this.#m() && this.retryPendingDistributions();
    }), Hooks.on("deleteActor", () => {
      this.#m() && setTimeout(() => {
        this.#h();
      }, 0);
    }), Hooks.on("updateActor", () => {
      this.#m() && this.retryPendingDistributions();
    }), Hooks.on("magnusarchivesIntrusionPendingChanged", () => {
      this.#m() && this.retryPendingDistributions();
    }), this.#m() && setTimeout(() => {
      this.#h().then(() => this.retryPendingDistributions());
    }, 1e3);
  }
  async createManual(e) {
    if (!game.user.isGM) throw new Error(game.i18n.localize("MAGNUSARCHIVES.Intrusion.Errors.GMOnly"));
    if (this.#a) throw new Error(game.i18n.localize("MAGNUSARCHIVES.Intrusion.Errors.AlreadyCreating"));
    this.#a = !0;
    try {
      const t = e.actorIds.map(De).filter((o) => o !== null), i = Oe();
      let a;
      if (e.mode === "group")
        a = await this.#e.createGroup(t, i.enabledRuleModuleIds ?? []);
      else {
        const o = t[0];
        if (!o) throw new Error(game.i18n.localize("MAGNUSARCHIVES.Intrusion.Errors.ChooseCharacter"));
        a = e.mode === "free" ? await this.#e.createFree(o, 0, i.enabledRuleModuleIds ?? []) : await this.#e.createTargeted(o, i.enabledRuleModuleIds ?? []);
      }
      const s = t[0];
      if (a.mode !== "targeted" || a.sharedXp <= 0 || !s)
        await this.#t.publish(a, s);
      else {
        const o = cn(Tt(s, !1)), r = yi(hi(), s.id), l = await this.#t.publish(a, s, r), u = {
          intrusionId: a.id,
          messageId: l.id,
          sourceActorId: s.id,
          amount: a.sharedXp,
          ...o ? { responderUserId: o.id } : {}
        };
        await this.#f(u), await this.#c(u, !0);
      }
      return Hooks.callAll("magnusarchivesGMIntrusionCreated", a), a;
    } finally {
      this.#a = !1;
    }
  }
  async requestFreeFromNaturalResult(e, t) {
    if (!(!t.naturalEffects.some(
      (a) => a.status === "applied" && a.triggersGMIntrusion === !0
    ) || t.naturalRoll === null)) {
      if (this.#m()) {
        await this.#l(e.id, t.naturalRoll);
        return;
      }
      if (!ln()) {
        ui.notifications.warn(game.i18n.localize("MAGNUSARCHIVES.Intrusion.NoActiveGM"));
        return;
      }
      game.socket.emit(Ft, { type: "create-free", actorId: e.id, naturalRoll: t.naturalRoll });
    }
  }
  async retryPendingDistributions() {
    if (this.#m())
      for (const e of this.#u()) await this.#c(e);
  }
  async requestDistribution(e, t) {
    const i = this.#A(e), a = De(i.sourceActorId);
    if (!a || !this.#s(a, i))
      throw new Error(game.i18n.localize("MAGNUSARCHIVES.Intrusion.Errors.NotAuthorized"));
    if (this.#m()) {
      await this.#o(e, t, game.user.id);
      return;
    }
    if (!ln()) throw new Error(game.i18n.localize("MAGNUSARCHIVES.Intrusion.Errors.NoActiveGM"));
    const s = _e();
    await new Promise((o, r) => {
      const l = setTimeout(() => {
        this.#n.delete(s), r(new Error(game.i18n.localize("MAGNUSARCHIVES.Intrusion.Errors.RequestTimeout")));
      }, 1e4);
      this.#n.set(s, { resolve: o, reject: r, timeout: l }), game.socket.emit(Ft, {
        type: "distribution-choice",
        intrusionId: e,
        recipientActorId: t,
        requesterUserId: game.user.id,
        requestId: s
      });
    });
  }
  async #l(e, t) {
    const i = De(e);
    if (!i) throw new Error(game.i18n.localize("MAGNUSARCHIVES.Intrusion.Errors.CharacterMissing"));
    const a = Oe(), s = await this.#e.createFree(i, t, a.enabledRuleModuleIds ?? []);
    Hooks.callAll("magnusarchivesGMIntrusionCreated", s);
  }
  #r(e, t) {
    const i = e.getFlag(U, "gmIntrusion");
    if (!rn(i)) return;
    const a = this.#u().find((r) => r.intrusionId === i.intrusionId), s = a ? De(a.sourceActorId) : null, o = i.status === "pending" && (game.user.isGM || !!(a && s && this.#s(s, a)));
    for (const r of t.querySelectorAll("[data-action='assignSharedIntrusionXp']")) {
      if (!o) {
        r.remove();
        continue;
      }
      r.dataset.magnusarchivesIntrusionBound !== "true" && (r.dataset.magnusarchivesIntrusionBound = "true", r.addEventListener("click", (l) => {
        l.preventDefault(), l.stopPropagation();
        const u = r.dataset.recipientActorId;
        !u || r.disabled || (r.disabled = !0, this.requestDistribution(i.intrusionId, u).catch((d) => {
          r.disabled = !1, ui.notifications.error(d instanceof Error ? d.message : String(d));
        }));
      }));
    }
  }
  #s(e, t) {
    return game.user.isGM ? !0 : game.user.id === t.responderUserId && e.testUserPermission(game.user, CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER);
  }
  async #c(e, t = !1) {
    const i = De(e.sourceActorId), a = game.messages.get(e.messageId);
    if (!i || !a) {
      await this.#p(e.intrusionId);
      return;
    }
    let s = e.responderUserId ? Jt().find((l) => l.id === e.responderUserId) ?? null : null;
    (!s || !Tt(i, !1).some((l) => l.id === s?.id)) && (s = cn(Tt(i, !1)), s && (e = { ...e, responderUserId: s.id }, await this.#f(e)));
    const o = a.getFlag(U, "gmIntrusion");
    if (!rn(o) || o.status !== "pending") return;
    const r = yi(hi(), i.id);
    (t || !Qc(o.recipients, r)) && await this.#t.update(a, { ...o, recipients: r }, i);
  }
  async #o(e, t, i) {
    if (this.#i.has(e))
      throw new Error(game.i18n.localize("MAGNUSARCHIVES.Intrusion.Errors.AlreadyResolved"));
    this.#i.add(e);
    let a = !1, s = null, o = null, r = null;
    try {
      const l = this.#A(e);
      r = De(l.sourceActorId);
      const u = De(t);
      if (o = game.messages.get(l.messageId) ?? null, !r || !u || !o)
        throw new Error(game.i18n.localize("MAGNUSARCHIVES.Intrusion.Errors.CharacterMissing"));
      const d = o.getFlag(U, "gmIntrusion");
      if (!rn(d) || d.intrusionId !== e || d.status !== "pending")
        throw new Error(game.i18n.localize("MAGNUSARCHIVES.Intrusion.Errors.AlreadyResolved"));
      s = d;
      const p = $o().find((f) => f.id === i);
      if (!(p?.isGM === !0 || !!(p && p.id === l.responderUserId && Tt(r, !0).some((f) => f.id === p.id)))) throw new Error(game.i18n.localize("MAGNUSARCHIVES.Intrusion.Errors.NotAuthorized"));
      const h = yi(hi(), r.id).find((f) => f.actorId === u.id);
      if (!h) throw new Error(game.i18n.localize("MAGNUSARCHIVES.Intrusion.Errors.RecipientUnavailable"));
      await this.#t.update(o, { ...d, status: "resolving" }, r), await this.#e.distributeSecondXp(r, u, l.amount), a = !0, await this.#p(e), await this.#t.update(o, {
        ...d,
        status: "resolved",
        recipients: [],
        resolvedRecipient: h
      }, r), Hooks.callAll("magnusarchivesGMIntrusionXPDistributed", e, r, u);
    } catch (l) {
      throw !a && s && o && r && await this.#t.update(o, s, r), l;
    } finally {
      this.#i.delete(e);
    }
  }
  async #d(e) {
    if (e.type === "distribution-result") {
      if (e.recipientUserId !== game.user.id) return;
      const t = this.#n.get(e.requestId);
      if (!t) return;
      clearTimeout(t.timeout), this.#n.delete(e.requestId), e.success ? t.resolve() : t.reject(new Error(e.error ?? game.i18n.localize("MAGNUSARCHIVES.Intrusion.Errors.RecipientUnavailable")));
      return;
    }
    if (this.#m()) {
      if (e.type === "create-free") await this.#l(e.actorId, e.naturalRoll);
      else if (e.type === "distribution-choice")
        try {
          await this.#o(e.intrusionId, e.recipientActorId, e.requesterUserId), game.socket.emit(Ft, {
            type: "distribution-result",
            requestId: e.requestId,
            recipientUserId: e.requesterUserId,
            success: !0
          });
        } catch (t) {
          throw game.socket.emit(Ft, {
            type: "distribution-result",
            requestId: e.requestId,
            recipientUserId: e.requesterUserId,
            success: !1,
            error: t instanceof Error ? t.message : String(t)
          }), t;
        }
    }
  }
  #u() {
    const e = game.settings.get(U, B.pendingIntrusionXP);
    return Array.isArray(e) ? e.filter(qa).map((t) => ({
      intrusionId: t.intrusionId,
      messageId: t.messageId,
      sourceActorId: t.sourceActorId,
      amount: t.amount,
      ...t.responderUserId ? { responderUserId: t.responderUserId } : {}
    })) : [];
  }
  #A(e) {
    const t = this.#u().find((i) => i.intrusionId === e);
    if (!t) throw new Error(game.i18n.localize("MAGNUSARCHIVES.Intrusion.Errors.AlreadyResolved"));
    return t;
  }
  async #f(e) {
    const t = this.#u(), i = t.findIndex((a) => a.intrusionId === e.intrusionId);
    i < 0 ? t.push(e) : t[i] = e, await game.settings.set(U, B.pendingIntrusionXP, t);
  }
  async #p(e) {
    await game.settings.set(
      U,
      B.pendingIntrusionXP,
      this.#u().filter((t) => t.intrusionId !== e)
    );
  }
  async #h() {
    const e = game.settings.get(U, B.pendingIntrusionXP), t = [];
    for (const i of Array.isArray(e) ? e : []) {
      if (qa(i)) {
        De(i.sourceActorId) && game.messages.get(i.messageId) && t.push({
          intrusionId: i.intrusionId,
          messageId: i.messageId,
          sourceActorId: i.sourceActorId,
          amount: i.amount,
          ...i.responderUserId ? { responderUserId: i.responderUserId } : {}
        });
        continue;
      }
      if (!Jc(i)) continue;
      const a = De(i.sourceActorId), s = [...game.messages].find(
        (u) => u.getFlag(U, "gmIntrusionId") === i.intrusionId
      );
      if (!a || !s) continue;
      const o = i.responderUserId ? Jt().find((u) => u.id === i.responderUserId) : cn(Tt(a, !1)), r = this.#e.policy(Oe().enabledRuleModuleIds ?? []), l = {
        kind: "gm-intrusion",
        intrusionId: i.intrusionId,
        mode: "targeted",
        sourceActorId: a.id,
        sourceActorName: a.name,
        targetXp: r.targetedXpToTarget,
        sharedXp: i.amount,
        status: "pending",
        recipients: yi(hi(), a.id)
      };
      await this.#t.update(s, l, a), t.push({
        intrusionId: i.intrusionId,
        messageId: s.id,
        sourceActorId: i.sourceActorId,
        amount: i.amount,
        ...o ? { responderUserId: o.id } : {}
      });
    }
    (!Array.isArray(e) || JSON.stringify(e) !== JSON.stringify(t)) && await game.settings.set(U, B.pendingIntrusionXP, t);
  }
  #m() {
    return game.user.isGM && ln()?.id === game.user.id;
  }
}
let Wt = null;
function ed(n, e) {
  return Wt = new Zc(n, e), Wt.initialize(), Wt;
}
function ai() {
  if (!Wt) throw new Error("GM Intrusion controller is not ready.");
  return Wt;
}
async function ma(n, e) {
  await game.magnusarchives.services.rollChat.publish(n, e, Li(), {
    showGmAudit: ji()
  }), await ai().requestFreeFromNaturalResult(n, e.result);
}
function Ee(n, e) {
  if (!Number.isFinite(e)) throw new Error("Step modifier amount must be finite.");
  const t = Math.abs(Math.trunc(e));
  return t === 0 ? "0" : `${n === "ease" ? "+" : "-"}${t}`;
}
function td(n) {
  if (!Number.isFinite(n)) throw new Error("Net step modifier must be finite.");
  return n === 0 ? "0" : Ee(n > 0 ? "ease" : "hinder", n);
}
const Oa = /* @__PURE__ */ new Set([
  "manual.skill",
  "manual.other-ease",
  "manual.other-hindrance",
  "core.assets",
  "core.effort.paid",
  "core.effort.free"
]);
function ut(n) {
  return String(n).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function pa(n) {
  return game.i18n.localize(n);
}
function fa(n, e) {
  return e(`MAGNUSARCHIVES.Pools.${n[0].toUpperCase()}${n.slice(1)}`);
}
function Ba(n, e) {
  return e.context.difficulty.mode === "hidden" && n.id.startsWith("npc-modification.");
}
function La(n, e) {
  return {
    id: n.id,
    label: e(n.label),
    modifier: Ee(n.direction, n.steps),
    direction: n.direction
  };
}
function id(n, e, t) {
  const i = n.breakdown.filter((d) => Ba(d, n)), a = n.breakdown.filter((d) => !Ba(d, n)), s = a.filter((d) => Oa.has(d.id)).map((d) => La(d, t)), o = a.filter((d) => !Oa.has(d.id)).map((d) => La(d, t)), r = n.context.difficulty.mode === "known", l = n.context.pool;
  if (l === null) throw new Error("Configured rolls require a Pool.");
  const u = e.system.stats[l].value;
  return {
    rollLabel: t(n.context.label),
    pool: l,
    poolLabel: fa(l, t),
    modifiers: s,
    automaticModifiers: o,
    netModifier: i.length === 0 ? td(n.netSteps) : null,
    hiddenModifierCount: i.length,
    difficultyMode: n.context.difficulty.mode,
    baseDifficulty: r ? n.context.difficulty.value : null,
    finalDifficulty: r ? n.finalDifficulty : null,
    targetNumber: r ? n.targetNumber : null,
    automaticSuccess: r && n.finalDifficulty === 0,
    actionCost: n.actionCostBeforeEdge,
    effortCost: n.effortCostBeforeEdge,
    edgeApplied: n.edgeApplied,
    totalCost: n.poolCost,
    poolValue: u,
    poolAfter: Math.max(0, u - n.poolCost),
    effortUsed: n.paidEffortApplied,
    effortMaximum: n.context.limits.paidEffortMaximum,
    totalEffortApplied: n.totalEffortApplied,
    totalEffortMaximum: n.totalEffortMaximum,
    paidEffortApplied: n.paidEffortApplied,
    freeEffortApplied: n.freeEffortApplied
  };
}
function ja(n) {
  const e = {};
  for (const t of n.querySelectorAll("[name]"))
    e[t.name] = t instanceof HTMLInputElement && t.type === "checkbox" ? t.checked : t.value;
  return e;
}
function re(n, e) {
  return String(n[e] ?? "");
}
function W(n, e) {
  return Number(n[e] ?? 0);
}
function nd(n, e) {
  const t = n[e];
  return t === !0 || t === "true" || t === "on";
}
function si(n, e) {
  const t = re(n, "difficulty").trim();
  return t ? {
    mode: nd(n, "hidden") ? "hidden" : "known",
    value: Number(t)
  } : { mode: "unknown" };
}
function oi(n) {
  const e = W(n, "situationalSteps");
  return re(n, "situationalDirection") === "hinder" ? { otherEase: 0, otherHindrance: e } : { otherEase: e, otherHindrance: 0 };
}
function ye(n, e = 0) {
  return Array.from({ length: n + 1 }, (t, i) => `<option value="${i}"${i === e ? " selected" : ""}>${i}</option>`).join("");
}
function Vo(n) {
  return ["might", "speed", "intellect"].map((e) => `<option value="${e}"${e === n ? " selected" : ""}>${ut(fa(e, pa))}</option>`).join("");
}
const ad = Object.freeze({
  inability: -1,
  untrained: 0,
  trained: 1,
  specialized: 2,
  expert: 3
});
function bt(n) {
  return ad[n];
}
function ga(n = 0, e = "") {
  return ie.map((t) => {
    const i = bt(t), a = game.i18n.localize(`MAGNUSARCHIVES.Skill.Ranks.${t}`), s = i === 0 ? game.i18n.localize("MAGNUSARCHIVES.Roll.Unmodified") : Ee(i > 0 ? "ease" : "hinder", i);
    return `<option value="${e}${i}"${n !== null && i === n ? " selected" : ""}>${ut(a)} · ${s}</option>`;
  }).join("");
}
function ri() {
  return `<div class="roll-dialog-inline-field roll-dialog-situational">
    <span class="roll-dialog-field-label">${game.i18n.localize("MAGNUSARCHIVES.Roll.SituationalModifier")}</span>
    <select name="situationalDirection" aria-label="${game.i18n.localize("MAGNUSARCHIVES.Roll.ModifierDirection")}">
      <option value="ease">${game.i18n.localize("MAGNUSARCHIVES.Roll.Ease")}</option>
      <option value="hinder">${game.i18n.localize("MAGNUSARCHIVES.Roll.Hinder")}</option>
    </select>
    <input name="situationalSteps" type="number" value="0" min="0" max="10" step="1" aria-label="${game.i18n.localize("MAGNUSARCHIVES.Roll.ModifierSteps")}">
  </div>`;
}
function li(n, e) {
  return `<div class="roll-dialog-inline-field roll-dialog-difficulty-field">
    <label>${game.i18n.localize("MAGNUSARCHIVES.Roll.BaseDifficulty")}
      <input name="difficulty" type="number" min="0" max="${n}" step="1" placeholder="${game.i18n.localize("MAGNUSARCHIVES.Roll.Optional")}">
    </label>
    ${e ? `<label class="roll-dialog-checkbox"><input name="hidden" type="checkbox"> ${game.i18n.localize("MAGNUSARCHIVES.Roll.HiddenDifficulty")}</label>` : ""}
  </div>`;
}
function ci(n) {
  return `<div class="magnusarchives magnusarchives-dialog magnusarchives-dialog-fields magnusarchives-roll-dialog">
    <div class="roll-dialog-layout">
      <section class="roll-dialog-settings" aria-labelledby="magnusarchives-roll-settings-heading">
        <header class="roll-dialog-panel-header">
          <span class="roll-dialog-kicker" id="magnusarchives-roll-settings-heading">${game.i18n.localize("MAGNUSARCHIVES.Roll.Settings")}</span>
          <strong>${ut(n.identity)}</strong>
        </header>
        <div class="roll-dialog-settings-grid">${n.settings}</div>
      </section>
      <aside class="roll-dialog-summary" aria-labelledby="magnusarchives-roll-summary-heading" aria-live="polite">
        <header class="roll-dialog-panel-header">
          <span class="roll-dialog-kicker" id="magnusarchives-roll-summary-heading">${game.i18n.localize("MAGNUSARCHIVES.Roll.Summary")}</span>
          <strong data-roll-summary="label">${ut(n.identity)}</strong>
          <span data-roll-summary="pool"></span>
        </header>
        <section class="roll-summary-section" data-roll-summary-section="automatic" hidden>
          <h4>${game.i18n.localize("MAGNUSARCHIVES.Roll.AutomaticModifiers")}</h4>
          <div class="roll-summary-rows" data-roll-summary="automatic"></div>
        </section>
        <section class="roll-summary-section" data-roll-summary-section="modifiers">
          <h4>${game.i18n.localize("MAGNUSARCHIVES.Roll.Modifiers")}</h4>
          <div class="roll-summary-rows" data-roll-summary="modifiers"></div>
          <div class="roll-summary-total"><span>${game.i18n.localize("MAGNUSARCHIVES.Roll.NetSteps")}</span><strong data-roll-summary="net">0</strong></div>
        </section>
        <section class="roll-summary-section" data-roll-summary-section="effort" hidden>
          <h4>${game.i18n.localize("MAGNUSARCHIVES.Roll.Effort")}</h4>
          <div class="roll-summary-rows" data-roll-summary="effort"></div>
        </section>
        <section class="roll-summary-section" data-roll-summary-section="difficulty">
          <h4>${game.i18n.localize("MAGNUSARCHIVES.Roll.Difficulty")}</h4>
          <div class="roll-summary-rows" data-roll-summary="difficulty"></div>
        </section>
        <section class="roll-summary-section" data-roll-summary-section="attack"${n.attackSummary ? "" : " hidden"}>
          <h4>${game.i18n.localize("MAGNUSARCHIVES.Combat.Attack")}</h4>
          <div class="roll-summary-rows" data-roll-summary="attack">${n.attackSummary ?? ""}</div>
        </section>
        <section class="roll-summary-section" data-roll-summary-section="cost">
          <h4>${game.i18n.localize("MAGNUSARCHIVES.Roll.Cost")}</h4>
          <div class="roll-summary-rows" data-roll-summary="cost"></div>
        </section>
        <section class="roll-summary-section roll-summary-character">
          <h4>${game.i18n.localize("MAGNUSARCHIVES.Roll.Character")}</h4>
          <div class="roll-summary-pools" data-roll-summary="character"></div>
        </section>
        <p class="roll-preview-error" data-roll-summary="error"></p>
      </aside>
    </div>
  </div>`;
}
function oe(n, e, t = "") {
  return `<div class="roll-summary-row ${t}"><span>${ut(n)}</span><strong>${ut(e)}</strong></div>`;
}
function Wa(n) {
  return n.length === 0 ? `<p class="roll-summary-empty">${game.i18n.localize("MAGNUSARCHIVES.Common.None")}</p>` : n.map((e) => oe(
    e.label,
    e.modifier,
    e.direction === "ease" ? "is-ease" : "is-hindrance"
  )).join("");
}
function Qe(n, e, t) {
  const i = n.querySelector(`[data-roll-summary="${e}"]`);
  i && (i.innerHTML = t);
}
function Pt(n, e, t) {
  const i = n.querySelector(`[data-roll-summary="${e}"]`);
  i && (i.textContent = t);
}
function sd(n, e, t) {
  Pt(n, "label", e.rollLabel), Pt(n, "pool", e.poolLabel), Qe(n, "modifiers", Wa(e.modifiers)), Pt(n, "net", e.netModifier ?? game.i18n.localize("MAGNUSARCHIVES.Roll.HiddenValue"));
  const i = n.querySelector('[data-roll-summary-section="automatic"]');
  i && (i.hidden = e.automaticModifiers.length === 0), Qe(n, "automatic", Wa(e.automaticModifiers));
  const a = n.querySelector('[data-roll-summary-section="effort"]');
  a && (a.hidden = e.totalEffortApplied === 0), Qe(n, "effort", [
    oe(
      game.i18n.localize("MAGNUSARCHIVES.Roll.PaidAppliedEffort"),
      `${e.paidEffortApplied} / ${e.effortMaximum}`
    ),
    oe(game.i18n.localize("MAGNUSARCHIVES.Roll.FreeAppliedEffort"), String(e.freeEffortApplied)),
    oe(
      game.i18n.localize("MAGNUSARCHIVES.Roll.TotalAppliedEffort"),
      e.totalEffortMaximum === null ? `${e.totalEffortApplied} / ${game.i18n.localize("MAGNUSARCHIVES.Genre.Unlimited")}` : `${e.totalEffortApplied} / ${e.totalEffortMaximum}`,
      e.totalEffortMaximum !== null && e.totalEffortApplied === e.totalEffortMaximum ? "is-total" : ""
    )
  ].join(""));
  const s = e.difficultyMode === "hidden" ? oe(game.i18n.localize("MAGNUSARCHIVES.Roll.BaseDifficulty"), game.i18n.localize("MAGNUSARCHIVES.Roll.HiddenValue")) : e.difficultyMode === "unknown" ? oe(game.i18n.localize("MAGNUSARCHIVES.Roll.BaseDifficulty"), game.i18n.localize("MAGNUSARCHIVES.Roll.NotProvided")) : [
    oe(game.i18n.localize("MAGNUSARCHIVES.Roll.BaseDifficulty"), String(e.baseDifficulty)),
    oe(
      game.i18n.localize("MAGNUSARCHIVES.Roll.FinalDifficulty"),
      e.automaticSuccess ? game.i18n.localize("MAGNUSARCHIVES.Roll.AutomaticSuccess") : String(e.finalDifficulty)
    ),
    oe(game.i18n.localize("MAGNUSARCHIVES.Roll.TargetNumber"), String(e.targetNumber))
  ].join("");
  Qe(n, "difficulty", s);
  const o = n.querySelector('[data-roll-summary-section="attack"]');
  o && t !== void 0 && (o.hidden = !t, Qe(n, "attack", t));
  const r = [
    ...e.actionCost > 0 ? [oe(game.i18n.localize("MAGNUSARCHIVES.Roll.ActionCost"), String(e.actionCost))] : [],
    ...e.effortCost > 0 ? [oe(game.i18n.localize("MAGNUSARCHIVES.Roll.EffortCost"), String(e.effortCost))] : [],
    ...e.edgeApplied > 0 ? [oe(game.i18n.localize("MAGNUSARCHIVES.Roll.EdgeApplied"), `-${e.edgeApplied}`)] : [],
    oe(game.i18n.localize("MAGNUSARCHIVES.Roll.TotalCost"), `${e.totalCost} ${e.poolLabel}`, "is-total"),
    oe(game.i18n.localize("MAGNUSARCHIVES.Roll.PoolAfterRoll"), `${e.poolValue} → ${e.poolAfter}`)
  ];
  Qe(n, "cost", r.join(""));
  const l = ["might", "speed", "intellect"].map((u) => {
    const d = e.pool === u ? e.poolAfter : null, p = e.pool === u ? e.poolValue : null, y = n.dataset[`pool${u[0].toUpperCase()}${u.slice(1)}`], m = n.dataset[`pool${u[0].toUpperCase()}${u.slice(1)}Max`], h = n.dataset[`pool${u[0].toUpperCase()}${u.slice(1)}Edge`];
    return `<div class="roll-summary-pool${e.pool === u ? " is-selected" : ""}">
      <span>${ut(fa(u, pa))}</span>
      <strong>${p === null ? y : `${p} → ${d}`} / ${m}</strong>
      <small>${game.i18n.localize("MAGNUSARCHIVES.Pools.Edge")} ${h}</small>
    </div>`;
  }).join("");
  Qe(n, "character", `${l}<div class="roll-summary-effort"><span>${game.i18n.localize("MAGNUSARCHIVES.Character.Effort")}</span><strong>${e.effortUsed} / ${e.effortMaximum}</strong></div>`), Pt(n, "error", e.poolValue < e.totalCost ? game.i18n.localize("MAGNUSARCHIVES.Roll.InsufficientPool") : "");
}
function di(n, e) {
  for (const i of ["might", "speed", "intellect"]) {
    const a = `pool${i[0].toUpperCase()}${i.slice(1)}`;
    n.dataset[a] = String(e.actor.system.stats[i].value), n.dataset[`${a}Max`] = String(e.actor.system.derived.pools[i].max), n.dataset[`${a}Edge`] = String(e.actor.system.derived.pools[i].edge);
  }
  const t = () => {
    try {
      const i = e.buildRequest(ja(n)), a = game.magnusarchives.services.rolls.preview(e.actor, i, e.policyRequest);
      sd(
        n,
        id(a, e.actor, pa),
        e.attackSummary?.(ja(n), a)
      );
    } catch (i) {
      Pt(n, "error", i instanceof Error ? i.message : String(i));
    }
  };
  return n.addEventListener("input", t), n.addEventListener("change", t), t(), t;
}
function _a(n) {
  return {
    label: "MAGNUSARCHIVES.Roll.TaskRoll",
    pool: re(n, "pool"),
    difficulty: si(n),
    skillSteps: W(n, "skillSteps"),
    assets: W(n, "assets"),
    paidEffort: W(n, "paidEffort"),
    freeEffort: W(n, "freeEffort"),
    ...oi(n),
    purpose: "task"
  };
}
function od(n) {
  ui.notifications.error(n instanceof Error ? n.message : String(n));
}
async function rd(n, e = "might") {
  const t = Oe(), i = game.magnusarchives.rules.resolveDifficultyPolicy(
    t.base,
    t.enabledRuleModuleIds ?? []
  ), a = `
    ${li(i.difficultyCeiling, Mo())}
    <label>${game.i18n.localize("MAGNUSARCHIVES.Pools.Pool")}
      <select name="pool">${Vo(e)}</select>
    </label>
    <label>${game.i18n.localize("MAGNUSARCHIVES.Roll.SkillLevel")}
      <select name="skillSteps">${ga()}</select>
    </label>
    <label>${game.i18n.localize("MAGNUSARCHIVES.Roll.Assets")}
      <select name="assets">${ye(i.assetLimit)}</select>
    </label>
    <label>${game.i18n.localize("MAGNUSARCHIVES.Roll.EffortToEase")}
      <select name="paidEffort">${ye(n.system.derived.effort.max)}</select>
    </label>
    <label>${game.i18n.localize("MAGNUSARCHIVES.Roll.FreeEffort")}
      <input name="freeEffort" type="number" value="0" min="0" step="1">
    </label>
    ${ri()}`, s = await foundry.applications.api.DialogV2.input({
    window: { title: game.i18n.localize("MAGNUSARCHIVES.Roll.TaskRoll"), resizable: !0 },
    position: { width: 800 },
    content: ci({
      identity: `${n.name} · ${game.i18n.localize("MAGNUSARCHIVES.Roll.Task")}`,
      settings: a
    }),
    rejectClose: !1,
    ok: { label: game.i18n.localize("MAGNUSARCHIVES.Roll.Roll") },
    render: (o, r) => {
      di(r.element, {
        actor: n,
        policyRequest: t,
        buildRequest: _a
      });
    }
  });
  if (s)
    try {
      const o = await game.magnusarchives.services.rolls.execute(
        n,
        _a(s),
        t
      );
      await ma(n, o);
    } catch (o) {
      od(o);
    }
}
function dn(n, e) {
  return n === e ? " selected" : "";
}
function ld(n, e) {
  const t = re(n, "skillRank");
  return ie.includes(t) ? t : e;
}
function Ka(n, e, t) {
  const i = re(e, "pool");
  return game.magnusarchives.services.skills.buildRollRequest(n, {
    ...i === "might" || i === "speed" || i === "intellect" ? { pool: i } : {},
    rankOverride: ld(e, n.system.rank),
    difficulty: si(e),
    assets: W(e, "assets"),
    paidEffort: W(e, "paidEffort"),
    freeEffort: W(e, "freeEffort"),
    ...oi(e),
    enabledRuleModuleIds: t
  });
}
async function cd(n, e) {
  const t = Oe(), i = t.enabledRuleModuleIds ?? [], a = game.magnusarchives.rules.resolveDifficultyPolicy(t.base, i), s = game.magnusarchives.services.skills.configuredPool(e) ?? "choose", o = `
    ${s === "choose" ? `<option value="" selected disabled>${game.i18n.localize("MAGNUSARCHIVES.Skill.ChoosePool")}</option>` : ""}
    <option value="might"${dn(s, "might")}>${game.i18n.localize("MAGNUSARCHIVES.Pools.Might")}</option>
    <option value="speed"${dn(s, "speed")}>${game.i18n.localize("MAGNUSARCHIVES.Pools.Speed")}</option>
    <option value="intellect"${dn(s, "intellect")}>${game.i18n.localize("MAGNUSARCHIVES.Pools.Intellect")}</option>`, r = ie.map((d) => `<option value="${d}"${d === e.system.rank ? " selected" : ""}>${game.i18n.localize(`MAGNUSARCHIVES.Skill.Ranks.${d}`)} · ${bt(d) === 0 ? game.i18n.localize("MAGNUSARCHIVES.Roll.Unmodified") : bt(d) > 0 ? `+${bt(d)}` : bt(d)}</option>`).join(""), l = `
    ${li(a.difficultyCeiling, Mo())}
    <label>${game.i18n.localize("MAGNUSARCHIVES.Pools.Pool")}<select name="pool">${o}</select></label>
    <label>${game.i18n.localize("MAGNUSARCHIVES.Roll.SkillLevel")}<select name="skillRank">${r}</select></label>
    <label>${game.i18n.localize("MAGNUSARCHIVES.Roll.Assets")}<select name="assets">${ye(a.assetLimit)}</select></label>
    <label>${game.i18n.localize("MAGNUSARCHIVES.Roll.EffortToEase")}<select name="paidEffort">${ye(n.system.derived.effort.max)}</select></label>
    <label>${game.i18n.localize("MAGNUSARCHIVES.Roll.FreeEffort")}<input name="freeEffort" type="number" value="0" min="0" step="1"></label>
    ${ri()}`, u = await foundry.applications.api.DialogV2.input({
    window: { title: `${game.i18n.localize("MAGNUSARCHIVES.Skill.Roll")}: ${e.name}`, resizable: !0 },
    position: { width: 800 },
    content: ci({ identity: e.name, settings: l }),
    rejectClose: !1,
    ok: { label: game.i18n.localize("MAGNUSARCHIVES.Roll.Roll") },
    render: (d, p) => {
      di(p.element, {
        actor: n,
        policyRequest: t,
        buildRequest: (y) => Ka(e, y, i)
      });
    }
  });
  if (u)
    try {
      const d = Ka(e, u, i), p = await game.magnusarchives.services.rolls.execute(n, d, t);
      await ma(n, p);
    } catch (d) {
      ui.notifications.error(d instanceof Error ? d.message : String(d));
    }
}
function Vi(n) {
  const e = n.token, t = n.tokenId ?? e?.id, i = n.tokenUuid ?? e?.uuid;
  return {
    actorId: n.id,
    ...n.actorUuid ?? n.uuid ? { actorUuid: n.actorUuid ?? n.uuid } : {},
    ...t ? { tokenId: t } : {},
    ...i ? { tokenUuid: i } : {}
  };
}
function Qt(n, e) {
  return Object.assign(Object.create(n), {
    ...e.actorUuid ? { actorUuid: e.actorUuid } : {},
    ...e.tokenId ? { tokenId: e.tokenId } : {},
    ...e.tokenUuid ? { tokenUuid: e.tokenUuid } : {},
    update: n.update.bind(n),
    testUserPermission: n.testUserPermission.bind(n)
  });
}
function Do(n) {
  const e = n.document ?? n, t = n.actor ?? e.actor ?? null;
  return !(t instanceof Actor) || t.type !== "npc" ? null : Qt(t, {
    actorId: t.id,
    actorUuid: t.uuid,
    ...e.id ? { tokenId: e.id } : {},
    ...e.uuid ? { tokenUuid: e.uuid } : {}
  });
}
function Fo(n) {
  const e = n.document ?? n, t = n.actor ?? e.actor ?? null;
  return !(t instanceof Actor) || t.type !== "character" ? null : Qt(t, {
    actorId: t.id,
    actorUuid: t.uuid,
    ...e.id ? { tokenId: e.id } : {},
    ...e.uuid ? { tokenUuid: e.uuid } : {}
  });
}
function Vn(n) {
  if (n.tokenId) {
    const e = canvas.tokens?.get(n.tokenId)?.actor;
    return e instanceof Actor ? e : null;
  }
  return n.tokenUuid ? null : game.actors.get(n.actorId) ?? null;
}
async function Dn(n) {
  if (n.tokenUuid)
    try {
      const e = await fromUuid(n.tokenUuid);
      if (e?.actor instanceof Actor) return e.actor;
    } catch {
    }
  if (n.tokenId) {
    const e = canvas.tokens?.get(n.tokenId)?.actor;
    if (e instanceof Actor) return e;
  }
  return n.tokenId || n.tokenUuid ? null : Vn(n);
}
function dd(n, e) {
  return String(n[e] ?? "");
}
function To(n) {
  return [...n.items].filter((e) => e instanceof Item && e.type === "skill").map((e) => e).sort((e, t) => e.name.localeCompare(t.name));
}
function zo(n, e = "manual:0") {
  const t = e.startsWith("manual:") ? Number(e.slice(7)) : null;
  return [
    `<optgroup label="${game.i18n.localize("MAGNUSARCHIVES.Roll.ManualSkillLevel")}">${ga(t, "manual:")}</optgroup>`,
    `<optgroup label="${game.i18n.localize("MAGNUSARCHIVES.Skill.Title")}">`,
    ...To(n).map((i) => `<option value="${i.id}"${i.id === e ? " selected" : ""}>${i.name} — ${game.i18n.localize(`MAGNUSARCHIVES.Skill.Ranks.${i.system.rank}`)}</option>`),
    "</optgroup>"
  ].join("");
}
function Po(n, e) {
  return To(n).find((t) => t.id === e);
}
function xo(n) {
  const e = re(n, "skillId");
  return e.startsWith("manual:") ? Number(e.slice(7)) : 0;
}
function ud(n, e) {
  const t = e === "dodge";
  return {
    pool: t ? "speed" : "might",
    armorDirection: t ? "hinder" : "ease",
    armorSteps: t ? n.system.derived.combat.armor.dodgeHindrance : n.system.derived.combat.armor.blockEase
  };
}
async function qo(n) {
  if (!n.flatMap((a) => a.execution.result.naturalEffects).find((a) => a.status === "available")) return null;
  const t = n[0]?.execution.result.naturalRoll ?? 19, i = await foundry.applications.api.DialogV2.input({
    window: { title: game.i18n.localize("MAGNUSARCHIVES.Combat.NaturalChoice.Title") },
    content: `<div class="magnusarchives-dialog-fields">
      <p>${game.i18n.format("MAGNUSARCHIVES.Combat.NaturalChoice.Prompt", { natural: t })}</p>
      <label>${game.i18n.localize("MAGNUSARCHIVES.Combat.NaturalChoice.Label")}
        <select name="choice">
          <option value="damage">${game.i18n.localize(t === 19 ? "MAGNUSARCHIVES.Roll.NaturalEffects.Damage19" : "MAGNUSARCHIVES.Roll.NaturalEffects.Damage20")}</option>
          <option value="effect">${game.i18n.localize(t === 19 ? "MAGNUSARCHIVES.Roll.NaturalEffects.Minor" : "MAGNUSARCHIVES.Roll.NaturalEffects.Major")}</option>
        </select>
      </label>
    </div>`,
    rejectClose: !1,
    ok: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Apply") }
  });
  return i && dd(i, "choice") === "damage" ? "damage" : "effect";
}
async function md(n, e) {
  const t = Oe(), i = t.enabledRuleModuleIds ?? [], a = game.magnusarchives.rules.resolveDifficultyPolicy(t.base, i), s = game.magnusarchives.services.combat.policy(i), o = game.magnusarchives.services.targets.nativeNpcTargets(), l = o.length > 0 ? `<div class="roll-dialog-context"><strong>${game.i18n.localize("MAGNUSARCHIVES.Combat.Targets")}</strong><span>${o.map((A) => A.name).join(", ")}</span><small>${game.i18n.localize("MAGNUSARCHIVES.Combat.HiddenTargetDifficulty")}</small></div>` : li(a.difficultyCeiling, !0), u = game.magnusarchives.services.combat.weaponAttackPool(e), d = `manual:${bt(e.system.skillLevel ?? "untrained")}`, p = (A) => {
    const v = Po(n, re(A, "skillId"));
    return {
      pool: re(A, "pool"),
      targets: o,
      difficulty: si(A),
      ...v ? { skill: v } : {},
      skillSteps: xo(A),
      assets: W(A, "assets"),
      paidEffort: W(A, "paidEffort"),
      damageEffort: W(A, "damageEffort"),
      freeDamageEffort: W(A, "freeDamageEffort"),
      freeEffort: W(A, "freeEffort"),
      ...oi(A),
      extremeRange: re(A, "extremeRange") === "true" || A.extremeRange === !0 || A.extremeRange === "on",
      enabledRuleModuleIds: i
    };
  }, y = (A) => {
    const v = game.magnusarchives.services.combat.buildWeaponAttackPlan(n, e, p(A)).requests[0];
    if (!v) throw new Error("Weapon attack preview did not produce a roll request.");
    return v;
  }, m = game.magnusarchives.services.combat.weaponBaseDamage(e, s), h = `
    ${l}
    <label>${game.i18n.localize("MAGNUSARCHIVES.Pools.Pool")}<select name="pool">${Vo(u)}</select></label>
    <label>${game.i18n.localize("MAGNUSARCHIVES.Roll.SkillLevel")}<select name="skillId">${zo(n, d)}</select></label>
    <label>${game.i18n.localize("MAGNUSARCHIVES.Roll.Assets")}<select name="assets">${ye(a.assetLimit)}</select></label>
    <label>${game.i18n.localize("MAGNUSARCHIVES.Roll.EffortToEase")}<select name="paidEffort">${ye(n.system.derived.effort.max)}</select></label>
    <label>${game.i18n.localize("MAGNUSARCHIVES.Combat.DamageEffort")}<select name="damageEffort">${ye(n.system.derived.effort.max)}</select></label>
    <label>${game.i18n.localize("MAGNUSARCHIVES.Roll.FreeDamageEffort")}<input name="freeDamageEffort" type="number" value="0" min="0" step="1"></label>
    <label>${game.i18n.localize("MAGNUSARCHIVES.Roll.FreeEffort")}<input name="freeEffort" type="number" value="0" min="0" step="1"></label>
    ${ri()}
    ${e.system.attackType === "ranged" ? `<label class="roll-dialog-checkbox"><input name="extremeRange" type="checkbox"> ${game.i18n.localize("MAGNUSARCHIVES.Combat.Weapon.ExtremeRange")}</label>` : ""}`, f = await foundry.applications.api.DialogV2.input({
    window: { title: `${game.i18n.localize("MAGNUSARCHIVES.Combat.Attack")}: ${e.name}`, resizable: !0 },
    position: { width: 800 },
    content: ci({ identity: e.name, settings: h, attackSummary: " " }),
    rejectClose: !1,
    ok: { label: game.i18n.localize("MAGNUSARCHIVES.Combat.Attack") },
    render: (A, v) => {
      di(v.element, {
        actor: n,
        policyRequest: t,
        buildRequest: y,
        attackSummary: (E, H) => [
          `<div class="roll-summary-row"><span>${game.i18n.localize("MAGNUSARCHIVES.Combat.BaseDamage")}</span><strong>${m}</strong></div>`,
          `<div class="roll-summary-row"><span>${game.i18n.localize("MAGNUSARCHIVES.Roll.PaidDamageEffort")}</span><strong>${H.context.damageEffort ?? 0}</strong></div>`,
          ...(H.context.freeDamageEffort ?? 0) > 0 ? [`<div class="roll-summary-row"><span>${game.i18n.localize("MAGNUSARCHIVES.Roll.FreeDamageEffort")}</span><strong>${H.context.freeDamageEffort}</strong></div>`] : [],
          `<div class="roll-summary-row"><span>${game.i18n.localize("MAGNUSARCHIVES.Roll.TotalDamageEffort")}</span><strong>${H.damageEffortApplied}</strong></div>`,
          `<div class="roll-summary-row"><span>${game.i18n.localize("MAGNUSARCHIVES.Combat.DamagePerEffort")}</span><strong>${s.damageEffortBonus}</strong></div>`,
          ...e.system.rangeCategory !== "immediate" ? [`<div class="roll-summary-row"><span>${game.i18n.localize("MAGNUSARCHIVES.Combat.Range.Label")}</span><strong>${game.i18n.localize(`MAGNUSARCHIVES.Combat.Range.${e.system.rangeCategory}`)}</strong></div>`] : [],
          ...re(E, "extremeRange") === "true" || E.extremeRange === !0 ? [`<div class="roll-summary-row is-hindrance"><span>${game.i18n.localize("MAGNUSARCHIVES.Combat.Weapon.ExtremeRange")}</span><strong>-1</strong></div>`] : []
        ].join("")
      });
    }
  });
  if (f)
    try {
      let A = await game.magnusarchives.services.combat.executeWeaponAttack(
        n,
        e,
        p(f),
        t
      );
      const v = await qo(A);
      v && (A = game.magnusarchives.services.combat.chooseAttackOutcomes(
        A,
        v,
        i
      ));
      for (const H of A)
        await game.magnusarchives.services.combatChat.publishWeaponAttack(
          n,
          H,
          Li(),
          ji()
        );
      const E = A[0];
      E && await ai().requestFreeFromNaturalResult(n, E.execution.result);
    } catch (A) {
      ui.notifications.error(A instanceof Error ? A.message : String(A));
    }
}
async function Fn(n, e, t) {
  if (e === "blockWithShield")
    try {
      const m = await game.magnusarchives.services.shields.normalizeEquipped(n);
      if (!m || game.magnusarchives.services.shields.isBroken(m))
        return ui.notifications.warn(game.i18n.localize("MAGNUSARCHIVES.Shield.BlockUnavailable")), !1;
    } catch (m) {
      return ui.notifications.error(m instanceof Error ? m.message : String(m)), !1;
    }
  const i = Oe(), a = i.enabledRuleModuleIds ?? [], s = game.magnusarchives.rules.resolveDifficultyPolicy(i.base, a), o = t ? `<div class="roll-dialog-context"><strong>${t.source.name} → ${n.name}</strong><small>${game.i18n.localize("MAGNUSARCHIVES.Combat.HiddenTargetDifficulty")}</small></div>` : li(s.difficultyCeiling, !0), r = game.magnusarchives.services.combat.applicableDefenseSkills(
    n,
    e,
    a
  )[0], l = ud(n, e), u = (m) => {
    const h = Po(n, re(m, "skillId"));
    return {
      ...h ? { skill: h } : {},
      skillSteps: xo(m),
      assets: W(m, "assets"),
      paidEffort: W(m, "paidEffort"),
      freeEffort: W(m, "freeEffort"),
      ...oi(m),
      enabledRuleModuleIds: a
    };
  }, d = (m) => t ? game.magnusarchives.services.combat.buildDefenseAgainstNpcRequest(
    n,
    t.source,
    e,
    u(m)
  ) : game.magnusarchives.services.combat.buildDefenseRequest(n, e, {
    ...u(m),
    difficulty: si(m)
  }), p = `
    ${o}
    <div class="roll-dialog-context roll-dialog-fixed-pool"><strong>${game.i18n.localize("MAGNUSARCHIVES.Pools.Pool")}</strong><span>${game.i18n.localize(`MAGNUSARCHIVES.Pools.${l.pool === "speed" ? "Speed" : "Might"}`)}</span></div>
    <label>${game.i18n.localize("MAGNUSARCHIVES.Roll.SkillLevel")}<select name="skillId">${zo(n, r?.id)}</select></label>
    <label>${game.i18n.localize("MAGNUSARCHIVES.Roll.Assets")}<select name="assets">${ye(s.assetLimit)}</select></label>
    <label>${game.i18n.localize("MAGNUSARCHIVES.Roll.EffortToEase")}<select name="paidEffort">${ye(n.system.derived.effort.max)}</select></label>
    <label>${game.i18n.localize("MAGNUSARCHIVES.Roll.FreeEffort")}<input name="freeEffort" type="number" value="0" min="0" step="1"></label>
    ${ri()}`, y = await foundry.applications.api.DialogV2.input({
    window: { title: game.i18n.localize(`MAGNUSARCHIVES.Combat.Defense.${e}`), resizable: !0 },
    position: { width: 800 },
    content: ci({
      identity: game.i18n.localize(`MAGNUSARCHIVES.Combat.Defense.${e}`),
      settings: p
    }),
    rejectClose: !1,
    ok: { label: game.i18n.localize("MAGNUSARCHIVES.Roll.Roll") },
    render: (m, h) => {
      di(h.element, { actor: n, policyRequest: i, buildRequest: d });
    }
  });
  if (!y) return !1;
  try {
    const m = d(y), h = await game.magnusarchives.services.rolls.execute(n, m, i), A = (t ? await game.magnusarchives.services.combat.resolveDefenseDamage(
      n,
      h.result,
      e,
      t.effect,
      t.stressAmount,
      t.source,
      a
    ) : null) ?? { recipient: "none" };
    return await game.magnusarchives.services.combatChat.publishDefense(
      n,
      h,
      A,
      t?.source ?? null,
      Li(),
      ji()
    ), await ai().requestFreeFromNaturalResult(n, h.result), !0;
  } catch (m) {
    return ui.notifications.error(m instanceof Error ? m.message : String(m)), !1;
  }
}
async function pd(n) {
  if (!game.user.isGM) return;
  const e = [...game.user.targets ?? []].map((i) => Fo(i)).filter((i) => i !== null).map((i) => i);
  if (e.length === 0) {
    ui.notifications.warn(game.i18n.localize("MAGNUSARCHIVES.Combat.NoCharacterTargets"));
    return;
  }
  const t = [];
  if (n.system.damage.defense.allowBlock && t.push("block"), n.system.damage.defense.allowDodge && t.push("dodge"), t.length === 0) {
    ui.notifications.warn(game.i18n.localize("MAGNUSARCHIVES.Combat.NoDefenseAllowed"));
    return;
  }
  for (const i of e)
    await game.magnusarchives.services.combatChat.createDefenseRequest(
      n,
      i,
      n.system.damage.effect === "none" ? "stress" : n.system.damage.effect,
      n.system.damage.stressAmount,
      t
    );
}
async function Di(n) {
  try {
    const e = await game.magnusarchives.services.depletion.roll(n);
    await game.magnusarchives.services.depletionChat.publish(n, e);
  } catch (e) {
    ui.notifications.error(e instanceof Error ? e.message : String(e));
  }
}
const Xa = 2, Ya = 1e3;
function Zt(n) {
  const e = String(n.die).trim().match(/^d(\d+)$/i), t = Number(e?.[1]);
  if (!Number.isInteger(t) || t < Xa || t > Ya)
    throw new Error(`Depletion die must have ${Xa} to ${Ya} sides.`);
  return t;
}
function fd(n) {
  return `1d${Zt(n)}`;
}
function un(n) {
  const e = Zt(n), t = Number(n.threshold);
  if (!Number.isInteger(t) || t < 1 || t > e)
    throw new Error(`Depletion threshold must be between 1 and ${e}.`);
  return `${Oo(t)} in 1d${e}`;
}
function Oo(n) {
  return n === 1 ? "1" : `1-${n}`;
}
function gd(n) {
  const e = [...n.querySelectorAll(
    ".magnusarchives-sheet.magnusarchives-character > .tab[data-tab]"
  )], t = e.find((a) => a.classList.contains("active")), i = [...n.querySelectorAll(
    "details[data-persistent-disclosure]"
  )];
  return {
    activeTab: t?.dataset.tab ?? "skills",
    tabScroll: Object.fromEntries(e.map((a) => [a.dataset.tab ?? "", a.scrollTop])),
    disclosures: Object.fromEntries(i.map((a) => [
      a.dataset.persistentDisclosure ?? "",
      a.open
    ]))
  };
}
function hd(n, e) {
  for (const t of n.querySelectorAll(
    ".magnusarchives-sheet.magnusarchives-character > .tab[data-tab]"
  ))
    t.scrollTop = e.tabScroll[t.dataset.tab ?? ""] ?? 0;
  for (const t of n.querySelectorAll(
    "details[data-persistent-disclosure]"
  )) {
    const i = t.dataset.persistentDisclosure ?? "";
    Object.hasOwn(e.disclosures, i) && (t.open = e.disclosures[i] ?? !1);
  }
}
function yd(n) {
  return n.replace(/[&<>'"]/g, (e) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;"
  })[e]);
}
async function Bo(n, e) {
  const t = n.system.graph.nodes.find((o) => o.id === e);
  if (!t) throw new Error(`Focus node '${e}' was not found.`);
  if (t.abilityUuid)
    try {
      const o = await fromUuid(t.abilityUuid);
      if (o?.sheet) {
        await o.sheet.render(!0);
        return;
      }
    } catch {
    }
  const i = t.abilitySnapshot.name || t.id, a = yd(i), s = t.abilitySnapshot.description || game.i18n.localize("MAGNUSARCHIVES.Focus.MissingAbility");
  await foundry.applications.api.DialogV2.input({
    window: { title: i },
    content: `<div class="magnusarchives magnusarchives-dialog magnusarchives-focus-snapshot"><h3>${a}</h3><div>${s}</div></div>`,
    rejectClose: !1,
    ok: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Close") }
  });
}
function Ja(n, e) {
  return {
    left: n.left - e.left,
    top: n.top - e.top,
    width: n.width,
    height: n.height
  };
}
function Sd(n, e) {
  const t = {
    x: n.left + n.width / 2,
    y: n.top + n.height / 2
  }, i = {
    x: e.left + e.width / 2,
    y: e.top + e.height / 2
  }, a = i.x - t.x, s = i.y - t.y;
  if (a === 0 && s === 0) return {
    x1: t.x,
    y1: t.y,
    x2: i.x,
    y2: i.y
  };
  const o = (u) => Math.min(
    a === 0 ? Number.POSITIVE_INFINITY : u.width / 2 / Math.abs(a),
    s === 0 ? Number.POSITIVE_INFINITY : u.height / 2 / Math.abs(s)
  ), r = o(n), l = o(e);
  return {
    x1: t.x + a * r,
    y1: t.y + s * r,
    x2: i.x - a * l,
    y2: i.y - s * l
  };
}
function Ad(n) {
  const e = n.querySelector(".focus-tree-canvas"), t = e?.querySelector(".focus-tree-connections");
  if (!e || !t) return;
  const i = e.getBoundingClientRect(), a = i.width, s = i.height;
  if (a <= 0 || s <= 0) return;
  t.setAttribute("width", String(a)), t.setAttribute("height", String(s)), t.setAttribute("viewBox", `0 0 ${a} ${s}`);
  const o = /* @__PURE__ */ new Map();
  for (const r of e.querySelectorAll(".focus-tree-node[data-node-id]")) {
    const l = r.dataset.nodeId;
    l && o.set(l, r);
  }
  for (const r of t.querySelectorAll("line[data-from][data-to]")) {
    const l = o.get(r.dataset.from ?? ""), u = o.get(r.dataset.to ?? "");
    if (!l || !u) continue;
    const d = Sd(
      Ja(l.getBoundingClientRect(), i),
      Ja(u.getBoundingClientRect(), i)
    );
    r.setAttribute("x1", String(d.x1)), r.setAttribute("y1", String(d.y1)), r.setAttribute("x2", String(d.x2)), r.setAttribute("y2", String(d.y2));
  }
}
class Lo {
  #e = null;
  #t = null;
  #i = [];
  bind(e) {
    if (this.disconnect(), this.#i = [...e.querySelectorAll(".magnusarchives-focus-tree-section")], this.#i.length !== 0) {
      this.#e = new ResizeObserver(() => this.scheduleRefresh());
      for (const t of this.#i) {
        this.#e.observe(t);
        for (const i of t.querySelectorAll(
          ".focus-tree-scroll, .focus-tree-canvas, .focus-tree-node"
        )) this.#e.observe(i);
      }
      this.scheduleRefresh();
    }
  }
  /** Public refresh point for future node movement and editor interactions. */
  refresh() {
    for (const e of this.#i) Ad(e);
  }
  scheduleRefresh() {
    this.#t === null && (this.#t = requestAnimationFrame(() => {
      this.#t = null, this.refresh();
    }));
  }
  disconnect() {
    this.#e?.disconnect(), this.#e = null, this.#t !== null && cancelAnimationFrame(this.#t), this.#t = null, this.#i = [];
  }
}
function bd(n, e, t, i = 8) {
  const a = n.right + i, s = a + e.width <= t.width - i ? a : n.left - e.width - i;
  return {
    left: Math.max(i, Math.min(s, t.width - e.width - i)),
    top: Math.max(i, Math.min(n.top, t.height - e.height - i))
  };
}
class jo {
  #e = null;
  #t = null;
  #i = null;
  bind(e) {
    this.disconnect();
    const t = new AbortController();
    this.#e = t;
    const i = (s) => {
      const o = s.target;
      if (!(o instanceof Element)) return;
      const r = o.closest("[data-magnusarchives-tooltip]");
      !r || !e.contains(r) || this.#n(r);
    }, a = (s) => {
      if (!(s instanceof PointerEvent) || !this.#i) return;
      const o = s.relatedTarget;
      o instanceof Node && this.#i.contains(o) || this.hide();
    };
    e.addEventListener("pointerover", i, { signal: t.signal }), e.addEventListener("pointerout", a, { signal: t.signal }), e.addEventListener("focusin", i, { signal: t.signal }), e.addEventListener("focusout", () => this.hide(), { signal: t.signal }), e.addEventListener("scroll", () => this.hide(), { capture: !0, signal: t.signal }), e.addEventListener("click", () => this.hide(), { signal: t.signal }), e.ownerDocument.addEventListener("visibilitychange", () => this.hide(), {
      signal: t.signal
    }), e.ownerDocument.defaultView?.addEventListener("blur", () => this.hide(), {
      signal: t.signal
    });
  }
  hide() {
    this.#t?.remove(), this.#t = null, this.#i = null;
  }
  disconnect() {
    this.#e?.abort(), this.#e = null, this.hide();
  }
  #n(e) {
    if (this.#i === e && this.#t) return;
    this.hide();
    const t = e.parentElement?.querySelector(
      ":scope > .magnusarchives-tooltip-template"
    );
    if (!t) return;
    const i = e.ownerDocument.createElement("div");
    i.className = "magnusarchives-system-tooltip", i.id = e.getAttribute("aria-describedby") ?? `magnusarchives-tooltip-${crypto.randomUUID()}`, i.role = "tooltip", i.append(t.content.cloneNode(!0)), e.ownerDocument.body.append(i);
    const a = e.getBoundingClientRect(), s = i.getBoundingClientRect(), o = e.ownerDocument.defaultView, r = bd(a, s, {
      width: o?.innerWidth ?? e.ownerDocument.documentElement.clientWidth,
      height: o?.innerHeight ?? e.ownerDocument.documentElement.clientHeight
    });
    i.style.left = `${r.left}px`, i.style.top = `${r.top}px`, this.#i = e, this.#t = i;
  }
}
class Mt extends Error {
  diagnostics;
  constructor(e) {
    super(e.map((t) => t.message).join("; ")), this.name = "FocusGraphValidationError", this.diagnostics = e;
  }
}
function wd(n, e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e) t.set(r, []);
  for (const r of n.connections)
    r.from !== r.to && t.get(r.from)?.push(r.to);
  const i = /* @__PURE__ */ new Map(), a = [], s = /* @__PURE__ */ new Set(), o = (r) => {
    const l = i.get(r);
    if (l !== void 0) return a.length - l > 2;
    if (s.has(r)) return !1;
    i.set(r, a.length), a.push(r);
    for (const u of t.get(r) ?? []) if (o(u)) return !0;
    return a.pop(), i.delete(r), s.add(r), !1;
  };
  return [...e].some((r) => o(r));
}
function Tn(n) {
  const e = [];
  (!Number.isInteger(n.version) || n.version < 1) && e.push({ severity: "error", code: "invalid-version", message: "Focus graph version must be at least 1." });
  const t = /* @__PURE__ */ new Set();
  for (const s of n.nodes) {
    if (!s.id.trim()) {
      e.push({ severity: "error", code: "blank-node-id", message: "Focus node IDs cannot be blank." });
      continue;
    }
    t.has(s.id) && e.push({ severity: "error", code: "duplicate-node-id", nodeId: s.id, message: `Duplicate Focus node ID '${s.id}'.` }), t.add(s.id), (!Number.isInteger(s.tier) || s.tier < 1 || s.tier > 6) && e.push({ severity: "error", code: "invalid-tier", nodeId: s.id, message: `Focus node '${s.id}' must use a Tier from 1 to 6.` });
    for (const [o, r] of Object.entries(s.position ?? {}))
      r !== null && !Number.isFinite(r) && e.push({ severity: "error", code: "invalid-position", nodeId: s.id, message: `Focus node '${s.id}' has an invalid ${o} position.` });
  }
  const i = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Set();
  for (const s of n.connections) {
    (!s.id.trim() || i.has(s.id)) && e.push({ severity: "error", code: "duplicate-connection-id", connectionId: s.id, message: `Duplicate or blank Focus connection ID '${s.id}'.` }), i.add(s.id);
    const o = `${s.from}\0${s.to}`;
    a.has(o) && e.push({ severity: "error", code: "duplicate-connection", connectionId: s.id, message: `Duplicate Focus connection '${s.from}' -> '${s.to}'.` }), a.add(o), (!t.has(s.from) || !t.has(s.to)) && e.push({ severity: "error", code: "missing-connection-node", connectionId: s.id, message: `Focus connection '${s.id}' references a missing node.` }), s.from === s.to && e.push({ severity: "error", code: "self-connection", connectionId: s.id, message: `Focus connection '${s.id}' cannot target itself.` });
  }
  return !e.some((s) => s.severity === "error") && wd(n, t) && e.push({
    severity: "warning",
    code: "directed-cycle",
    message: "Focus graph contains a directed cycle; evaluation remains direct and deterministic."
  }), e;
}
function vd(n) {
  const e = Tn(n), t = e.filter((i) => i.severity === "error");
  if (t.length > 0) throw new Mt(t);
  return e;
}
class ha {
  evaluate(e, t) {
    if (!Number.isInteger(t.tier) || t.tier < 1)
      throw new Error("Character Tier must be an integer of at least 1.");
    const i = [...vd(e)], a = new Set(e.nodes.map((d) => d.id)), s = new Set(t.ownedNodeIds);
    for (const d of s)
      a.has(d) || i.push({
        severity: "warning",
        code: "unknown-owned-node",
        nodeId: d,
        message: `Focus progression references unknown node '${d}'.`
      });
    const o = /* @__PURE__ */ new Map();
    for (const d of e.nodes) o.set(d.id, []);
    for (const d of e.connections)
      o.get(d.to).push(d.from);
    const r = new Set(e.nodes.filter((d) => d.tier === 1 && s.has(d.id)).map((d) => d.id));
    let l = !0;
    for (; l; ) {
      l = !1;
      for (const d of e.connections)
        r.has(d.from) && s.has(d.to) && !r.has(d.to) && (r.add(d.to), l = !0);
    }
    for (const d of e.nodes)
      d.tier > 1 && s.has(d.id) && !r.has(d.id) && i.push({
        severity: "warning",
        code: "invalid-owned-progression",
        nodeId: d.id,
        message: `Owned node '${d.abilitySnapshot.name || d.id}' is no longer connected to an owned Tier 1 path.`
      });
    const u = e.nodes.map((d) => {
      const p = [...new Set((o.get(d.id) ?? []).filter((y) => r.has(y)))].sort((y, m) => y.localeCompare(m));
      return s.has(d.id) ? {
        node: d,
        state: "owned",
        reason: "owned",
        requiredTier: d.tier,
        reachableFrom: p
      } : d.tier === 1 ? {
        node: d,
        state: "available",
        reason: "tier-one-choice",
        requiredTier: d.tier,
        reachableFrom: []
      } : p.length > 0 && d.tier > t.tier ? {
        node: d,
        state: "future",
        reason: "tier-too-low",
        requiredTier: d.tier,
        reachableFrom: p
      } : p.length > 0 ? {
        node: d,
        state: "available",
        reason: "connected-from-owned",
        requiredTier: d.tier,
        reachableFrom: p
      } : {
        node: d,
        state: "locked",
        reason: "no-owned-prerequisite",
        requiredTier: d.tier,
        reachableFrom: []
      };
    }).sort((d, p) => d.node.tier - p.node.tier || d.node.id.localeCompare(p.node.id));
    return {
      characterTier: t.tier,
      ownedNodeIds: [...s].sort((d, p) => d.localeCompare(p)),
      nodes: u,
      diagnostics: i
    };
  }
  evaluateProgress(e, t, i) {
    return this.evaluate(e, { tier: t, ownedNodeIds: i.ownedNodeIds });
  }
  evaluateCharacterFocus(e, t, i) {
    const a = t.focusProgress.find((s) => s.focusUuid === i);
    return this.evaluate(e, {
      tier: t.tier,
      ownedNodeIds: a?.ownedNodeIds ?? []
    });
  }
  invalidOwnedNodeIds(e, t, i) {
    return this.evaluate(e, { tier: t, ownedNodeIds: i }).diagnostics.filter((a) => a.code === "invalid-owned-progression" && a.nodeId).map((a) => a.nodeId);
  }
}
class We extends Error {
  constructor() {
    super("Grant conflict resolution was cancelled."), this.name = "GrantConflictCancelledError";
  }
}
function Wo(n, e) {
  return `${n}:${String(e ?? "").trim().toLocaleLowerCase().replace(/\s+/g, " ")}`;
}
function Ge(n, e, t = "") {
  return { type: n, contentUuid: t, contentKey: Wo(n, e) };
}
function Cd(n) {
  if (n.type !== "ability" && n.type !== "skill") return null;
  const e = n.system.grantedBy ?? {};
  return {
    type: n.type,
    contentUuid: String(e.contentUuid ?? ""),
    contentKey: String(e.contentKey || Wo(n.type, n.name))
  };
}
function Ed(n, e) {
  return n.type !== e.type ? !1 : n.contentUuid && e.contentUuid ? n.contentUuid === e.contentUuid : n.contentKey === e.contentKey;
}
function _o(n, e) {
  return !!Wi(n, e);
}
function Wi(n, e) {
  return [...n].find((t) => {
    const i = Cd(t);
    return i ? Ed(i, e) : !1;
  }) ?? null;
}
class ue extends Error {
  code;
  dependentNodeIds;
  constructor(e, t, i = []) {
    super(t), this.name = "FocusAcquisitionError", this.code = e, this.dependentNodeIds = i;
  }
}
const Id = async (n) => {
  if (!n) return null;
  try {
    const e = await fromUuid(n);
    if (!e || typeof e != "object" || !("type" in e)) return null;
    const t = e;
    return t.type === "ability" ? t : null;
  } catch {
    return null;
  }
};
function Si(n, e) {
  return n.focusUuid === e.uuid || n.focusUuid === e.id;
}
function Qa(n, e, t) {
  return n.type === "ability" && n.system.sourceFocusUuid === e && n.system.sourceNodeId === t;
}
function mn(n, e) {
  const t = `${n}\0${e}`;
  let i = 2166136261, a = 2654435769;
  for (let s = 0; s < t.length; s += 1) {
    const o = t.charCodeAt(s);
    i = Math.imul(i ^ o, 16777619) >>> 0, a = Math.imul(a ^ o + s, 2246822507) >>> 0;
  }
  return `${i.toString(16).padStart(8, "0")}${a.toString(16).padStart(8, "0")}`;
}
class Rd {
  #e;
  #t;
  #i;
  #n = /* @__PURE__ */ new Map();
  constructor(e = new ha(), t = Id, i = Date.now) {
    this.#e = e, this.#t = t, this.#i = i;
  }
  missingOwnedNodeIds(e, t, i) {
    const a = [...e.items];
    return new Set(i.ownedNodeIds.filter((s) => !a.some((o) => Qa(o, t.uuid, s))));
  }
  async acquire(e, t, i, a) {
    return this.#w(this.#S(e), () => this.#a(e, t, i, !1, !0, a));
  }
  /** Character-facing permissive acquisition. Pending choices remain untouched. */
  async acquireManual(e, t, i, a) {
    return this.#w(this.#S(e), () => this.#a(e, t, i, !1, !1, a));
  }
  /** Explicit GM-only sheet action; callers must enforce GM authorization. */
  async acquireWithGmOverride(e, t, i) {
    return this.#w(this.#S(e), () => this.#a(e, t, i, !0, !1));
  }
  /** GM repair/import action. It intentionally bypasses both eligibility and choices. */
  async markOwnedWithGmOverride(e, t, i) {
    return this.#w(this.#S(e), () => this.#l(e, t, i));
  }
  async undo(e, t, i, a = {}) {
    return this.#w(this.#S(e), () => this.#r(e, t, i, a));
  }
  hasEmbeddedAbility(e, t, i) {
    return !!this.#d(e, t, i);
  }
  async restoreAbility(e, t, i) {
    return this.#w(this.#S(e), () => this.#c(e, t, i));
  }
  async #a(e, t, i, a, s, o) {
    this.#m(e);
    const r = this.#h(t, i), l = this.#p(e, t);
    if (l.ownedNodeIds.includes(i))
      return { status: "already-owned", abilityCreated: !1 };
    let u;
    try {
      u = this.#e.evaluateProgress(t.system.graph, L(e.system), l).nodes.find((A) => A.node.id === i);
    } catch (A) {
      if (!(A instanceof Mt)) throw A;
    }
    const d = e.system.advancement.pendingFocusChoices.find((A) => A.focusUuid === "" || A.focusUuid === t.uuid || A.focusUuid === t.id), p = s && !a && u?.state === "available" && !!d;
    let y = !1, m = !1, h = null;
    if (!this.#d(e, t.uuid, i)) {
      const A = await this.#o(t, r);
      if (!this.#d(e, t.uuid, i)) {
        const v = this.#A(e, t, r, A);
        if (v) {
          if (!o)
            throw new ue(
              "duplicate-grant",
              `Focus node '${i}' grants an Ability already present on this Character; choose a replacement with the GM.`
            );
          const E = await o(v);
          if (E.action === "cancel") throw new We();
          if (E.action !== "gmOverride")
            throw new ue(
              "duplicate-grant",
              "A Focus node cannot be replaced by an arbitrary Ability. Choose another valid node or use an explicit GM Override."
            );
          m = !0;
        } else
          h = await this.#f(e, t, i, A), y = !!h;
      }
    }
    if (!this.#p(e, t).ownedNodeIds.includes(i)) {
      const A = e.system.focusProgress.map((v) => Si(v, t) ? {
        ...v,
        ownedNodeIds: [...v.ownedNodeIds, i],
        acquisitions: [
          ...v.acquisitions ?? [],
          this.#u(
            i,
            a || m ? "gmOverride" : p ? "choice" : "manualOverride",
            p ? d : null
          )
        ]
      } : { ...v, ownedNodeIds: [...v.ownedNodeIds], acquisitions: [...v.acquisitions ?? []] });
      try {
        await e.update({
          "system.focusProgress": A,
          ...p && !m && d ? {
            "system.advancement.pendingFocusChoices": e.system.advancement.pendingFocusChoices.filter((v) => v.id !== d.id)
          } : {}
        });
      } catch (v) {
        throw h?.delete && await h.delete(), v;
      }
    }
    return { status: "acquired", abilityCreated: y };
  }
  async #l(e, t, i) {
    this.#m(e);
    const a = this.#h(t, i);
    if (this.#p(e, t).ownedNodeIds.includes(i))
      return { status: "already-owned", abilityCreated: !1 };
    let o = null;
    if (!this.#d(e, t.uuid, i)) {
      const l = await this.#o(t, a);
      this.#d(e, t.uuid, i) || (o = await this.#f(e, t, i, l));
    }
    const r = e.system.focusProgress.map((l) => Si(l, t) ? {
      ...l,
      ownedNodeIds: [...l.ownedNodeIds, i],
      acquisitions: [
        ...l.acquisitions ?? [],
        this.#u(i, "gmManual", null)
      ]
    } : { ...l, ownedNodeIds: [...l.ownedNodeIds], acquisitions: [...l.acquisitions ?? []] });
    try {
      await e.update({ "system.focusProgress": r });
    } catch (l) {
      throw o?.delete && await o.delete(), l;
    }
    return { status: "acquired", abilityCreated: !!o };
  }
  async #r(e, t, i, a) {
    this.#m(e), this.#h(t, i);
    const s = this.#p(e, t);
    if (!s.ownedNodeIds.includes(i))
      throw new ue("undo-not-owned", `Focus node '${i}' is not owned.`);
    const o = s.ownedNodeIds.filter((f) => f !== i), r = new Set(this.#s(
      t,
      L(e.system),
      s.ownedNodeIds
    )), l = this.#s(t, L(e.system), o), u = l.filter((f) => !r.has(f));
    if (u.length > 0 && !a.force)
      throw new ue(
        "undo-dependent-nodes",
        `Undo would invalidate acquired descendant nodes: ${u.join(", ")}.`,
        u
      );
    const d = (s.acquisitions ?? []).find((f) => f.nodeId === i), p = d && d.choiceSource !== "none" && d.choiceId ? {
      id: d.choiceId,
      source: d.choiceSource,
      grantTier: d.choiceGrantTier,
      focusUuid: d.choiceFocusUuid
    } : null, y = e.system.focusProgress.map((f) => Si(f, t) ? {
      ...f,
      ownedNodeIds: o,
      acquisitions: (f.acquisitions ?? []).filter((A) => A.nodeId !== i)
    } : { ...f, ownedNodeIds: [...f.ownedNodeIds], acquisitions: [...f.acquisitions ?? []] }), m = p && !e.system.advancement.pendingFocusChoices.some((f) => f.id === p.id) ? [...e.system.advancement.pendingFocusChoices, p] : [...e.system.advancement.pendingFocusChoices];
    await e.update({
      "system.focusProgress": y,
      "system.advancement.pendingFocusChoices": m
    });
    let h = !1;
    if (a.deleteAbility) {
      const f = this.#d(e, t.uuid, i);
      f?.delete && (await f.delete(), h = !0);
    }
    return { choiceRestored: p, abilityDeleted: h, invalidOwnedNodeIds: l };
  }
  #s(e, t, i) {
    try {
      return this.#e.invalidOwnedNodeIds(e.system.graph, t, i);
    } catch (a) {
      if (a instanceof Mt) return [];
      throw a;
    }
  }
  async #c(e, t, i) {
    this.#m(e);
    const a = this.#h(t, i);
    if (!this.#p(e, t).ownedNodeIds.includes(i))
      throw new ue(
        "restore-not-owned",
        `Focus node '${i}' is not owned and cannot be restored.`
      );
    if (this.#d(e, t.uuid, i))
      return { status: "already-present", abilityCreated: !1 };
    const o = await this.#o(t, a);
    if (this.#d(e, t.uuid, i))
      return { status: "already-present", abilityCreated: !1 };
    const r = !!await this.#f(e, t, i, o);
    return {
      status: r ? "restored" : "already-present",
      abilityCreated: r
    };
  }
  async #o(e, t) {
    const i = await this.#t(t.abilityUuid);
    if (i?.type === "ability" && i.name.trim()) {
      const s = i.toObject?.() ?? {}, o = s.system && typeof s.system == "object" ? s.system : i.system;
      return {
        _id: mn(e.uuid, t.id),
        name: i.name,
        type: "ability",
        ...typeof i.img == "string" ? { img: i.img } : {},
        system: {
          ...structuredClone(o),
          sourceFocusUuid: e.uuid,
          sourceNodeId: t.id,
          grantedBy: { kind: "focus", sourceUuid: e.uuid, instanceId: e.uuid, grantId: t.id, status: "active", contentUuid: t.abilityUuid, contentKey: `ability:${i.name.trim().toLocaleLowerCase()}` }
        }
      };
    }
    const a = t.abilitySnapshot.name.trim();
    if (!a)
      throw new ue(
        "ability-data-unavailable",
        `Focus node '${t.id}' has neither a valid source Ability nor a usable snapshot.`
      );
    return {
      _id: mn(e.uuid, t.id),
      name: a,
      type: "ability",
      system: {
        tier: t.tier,
        description: t.abilitySnapshot.description ?? "",
        sourceFocusUuid: e.uuid,
        sourceNodeId: t.id,
        grantedBy: { kind: "focus", sourceUuid: e.uuid, instanceId: e.uuid, grantId: t.id, status: "active", contentUuid: t.abilityUuid, contentKey: `ability:${a.toLocaleLowerCase()}` }
      }
    };
  }
  #d(e, t, i) {
    return [...e.items].find((a) => Qa(a, t, i)) ?? null;
  }
  #u(e, t, i) {
    return {
      nodeId: e,
      mode: t,
      choiceId: i?.id ?? "",
      choiceSource: i?.source ?? "none",
      choiceGrantTier: i?.grantTier ?? 1,
      choiceFocusUuid: i?.focusUuid ?? "",
      acquiredAt: this.#i()
    };
  }
  #A(e, t, i, a) {
    const o = (a.system ?? {}).grantedBy ?? {}, r = Ge("ability", String(a.name ?? i.abilitySnapshot.name), String(o.contentUuid ?? i.abilityUuid)), l = Wi(e.items, r);
    if (!l) return null;
    const d = (l.system ?? {}).grantedBy ?? {}, p = Ge("ability", l.name ?? "", String(d.contentUuid ?? ""));
    return {
      id: `${t.uuid}:${i.id}`,
      type: "ability",
      packageName: t.name,
      packageSourceUuid: t.uuid,
      grantId: i.id,
      existing: {
        id: String(l.id ?? p.contentKey),
        name: String(l.name ?? ""),
        type: "ability",
        rank: "",
        contentUuid: String(d.contentUuid ?? p.contentUuid),
        contentKey: String(d.contentKey ?? p.contentKey)
      },
      proposed: {
        id: mn(t.uuid, i.id),
        name: String(a.name ?? i.abilitySnapshot.name),
        type: "ability",
        rank: "",
        contentUuid: r.contentUuid,
        contentKey: r.contentKey
      },
      suggestions: [],
      allowCustom: !1,
      allowSuppress: !1,
      allowGmOverride: !0,
      context: "focus"
    };
  }
  async #f(e, t, i, a) {
    const o = (a.system ?? {}).grantedBy ?? {};
    if (_o(e.items, {
      type: "ability",
      contentUuid: String(o.contentUuid ?? ""),
      contentKey: String(o.contentKey ?? `ability:${String(a.name ?? "").trim().toLocaleLowerCase()}`)
    }))
      throw new ue(
        "duplicate-grant",
        `Focus node '${i}' grants an Ability already present on this Character; choose a replacement with the GM.`
      );
    try {
      return (await e.createEmbeddedDocuments("Item", [a], { keepId: !0 }))[0] ?? null;
    } catch (r) {
      if (this.#d(e, t.uuid, i)) return null;
      throw r;
    }
  }
  #p(e, t) {
    const i = e.system.focusProgress.filter((a) => Si(a, t));
    if (i.length === 0)
      throw new ue(
        "progress-missing",
        `Character has no progression entry for Focus '${t.uuid}'.`
      );
    if (i.length > 1)
      throw new ue(
        "progress-duplicated",
        `Character has duplicate progression entries for Focus '${t.uuid}'.`
      );
    return i[0];
  }
  #h(e, t) {
    const i = e.system.graph.nodes.find((a) => a.id === t);
    if (!i)
      throw new ue("node-not-found", `Focus node '${t}' was not found.`);
    return i;
  }
  #m(e) {
    if (e.type !== "character")
      throw new ue("not-character", "Focus acquisition requires a Character.");
  }
  #S(e) {
    return e.uuid;
  }
  async #w(e, t) {
    const a = (this.#n.get(e) ?? Promise.resolve()).catch(() => {
    }).then(t);
    this.#n.set(e, a);
    try {
      return await a;
    } finally {
      this.#n.get(e) === a && this.#n.delete(e);
    }
  }
}
class K extends Error {
  constructor(e, t) {
    super(t), this.code = e, this.name = "AdvancementError";
  }
  code;
}
const Nd = async (n) => {
  try {
    const e = await fromUuid(n);
    if (!e || typeof e != "object" || !("type" in e)) return null;
    const t = e;
    return t.type === "skill" ? t : null;
  } catch {
    return null;
  }
}, Md = () => globalThis.crypto?.randomUUID?.() ?? `adv-${Date.now()}-${Math.random().toString(36).slice(2)}`;
function Gd(n) {
  return n.system.category === "attack" || n.system.category === "defense" || n.system.contexts.some((e) => e === "attack" || e.startsWith("attack.") || e === "defense" || e.startsWith("defense."));
}
function Ud(n) {
  return n === "inability" ? "untrained" : n === "untrained" ? "trained" : n === "trained" ? "specialized" : null;
}
function Za(n) {
  return [...new Set(n)];
}
class kd {
  #e;
  #t;
  #i;
  #n;
  #a = /* @__PURE__ */ new Map();
  constructor(e, t = Md, i = Date.now, a = Nd) {
    this.#e = e, this.#t = t, this.#i = i, this.#n = a;
  }
  policy(e = []) {
    return this.#e.resolveAdvancementPolicy(no, e);
  }
  view(e, t = []) {
    const i = this.policy(t), a = e.system.advancement.purchases, s = a.length >= i.purchasesPerTier;
    return {
      policy: i,
      purchasedCount: a.length,
      remainingCount: Math.max(0, i.purchasesPerTier - a.length),
      canAdvanceTier: a.length === i.purchasesPerTier,
      options: Qn.map((o) => {
        const r = a.some((u) => u.kind === o), l = o === "extraEffort" ? this.#o(e) < i.effortMaximum : !0;
        return { kind: o, purchased: r, available: !s && !r && l };
      }),
      other: {
        purchased: a.some((o) => o.kind === "other"),
        available: !s && !a.some((o) => o.kind === "other")
      }
    };
  }
  progressionGuidance(e, t = []) {
    const i = L(e.system);
    return {
      tier: i,
      completed: (e.system.advancement.guidanceCompletedTiers ?? []).includes(i),
      focusAbilityCount: i === 1 ? 2 : 1,
      includesGenreAbility: this.policy(t).genreChoiceForTier(i)
    };
  }
  async completeProgressionGuidance(e) {
    return this.#u(e, async () => {
      this.#c(e);
      const t = new Set(e.system.advancement.guidanceCompletedTiers ?? []);
      t.add(L(e.system)), await e.update({
        "system.advancement.guidanceCompletedTiers": [...t].sort((i, a) => i - a)
      });
    });
  }
  async resetProgressionGuidance(e) {
    return this.#u(e, async () => {
      this.#c(e), await e.update({
        "system.advancement.guidanceCompletedTiers": (e.system.advancement.guidanceCompletedTiers ?? []).filter((t) => t !== L(e.system))
      });
    });
  }
  skillTrainingOptions(e, t = []) {
    const i = this.policy(t);
    return [...e.items].filter((a) => a.type === "skill" && ie.includes(a.system.rank)).map((a) => {
      const s = Ud(a.system.rank), o = s === "trained" ? i.attackDefenseTrainingTier : s === "specialized" ? i.attackDefenseSpecializationTier : 0, r = !!(s && Gd(a) && L(e.system) < o);
      return {
        id: a.id,
        name: a.name,
        currentRank: a.system.rank,
        nextRank: s,
        eligible: !!(s && !r),
        reason: s ? r ? "tier" : "eligible" : "maximum",
        abilityLinked: !!a.system.acquisition?.grantedByUuid
      };
    }).sort((a, s) => a.name.localeCompare(s.name));
  }
  async purchase(e, t, i = []) {
    return this.#u(e, () => this.#l(e, t, i, !1));
  }
  /** Explicit integration point for GM tooling; Core slot and benefit validation still applies. */
  async purchaseWithGmOverride(e, t, i = []) {
    return this.#u(e, () => this.#l(e, t, i, !0));
  }
  /**
   * Reopens an Advancement slot without attempting to reverse any benefit or payment.
   * Only the exact, uniquely identified current-cycle purchase record is removed.
   */
  async undoPurchase(e, t) {
    return this.#u(e, async () => {
      this.#c(e);
      const i = typeof t == "string" ? t.trim() : "", a = e.system.advancement.purchases, s = i ? a.filter((r) => r.id === i) : [];
      if (s.length !== 1)
        throw new K(
          "purchase-not-found",
          "That current-cycle Advancement purchase is unavailable."
        );
      const o = s[0];
      if (o.tier !== L(e.system))
        throw new K(
          "purchase-not-current",
          "Only an Advancement purchase from the current Tier can be undone."
        );
      return await e.update({
        "system.advancement.purchases": a.filter((r) => r.id !== i)
      }), o;
    });
  }
  async advanceTier(e, t = []) {
    return this.#u(e, async () => {
      this.#c(e);
      const i = this.policy(t);
      if (e.system.advancement.purchases.length !== i.purchasesPerTier)
        throw new K("tier-not-ready", "Four Advancements are required before advancing Tier.");
      const a = fi(e.system, "tier", 1), s = a.value, o = {
        id: this.#t(),
        source: "newTier",
        grantTier: s,
        focusUuid: ""
      }, r = i.genreChoiceForTier(s) ? {
        id: this.#t(),
        source: "newTier",
        grantTier: s
      } : null;
      return await e.update({
        [a.path]: s,
        "system.advancement.cycle": e.system.advancement.cycle + 1,
        "system.advancement.purchases": [],
        "system.advancement.pendingFocusChoices": [
          ...e.system.advancement.pendingFocusChoices,
          o
        ],
        ...r ? {
          "system.advancement.pendingGenreChoices": [
            ...e.system.advancement.pendingGenreChoices,
            r
          ]
        } : {}
      }), { tier: s, focusChoice: o, genreChoice: r };
    });
  }
  async #l(e, t, i, a) {
    this.#c(e);
    const s = this.policy(i), o = e.system.advancement.purchases;
    if (o.length >= s.purchasesPerTier)
      throw new K("cycle-complete", "This advancement cycle is complete.");
    if (t.kind === "other") {
      if (o.some((h) => h.kind === "other"))
        throw new K("other-already-purchased", "Other Advancement is unique per cycle.");
    } else if (o.some((h) => h.kind === t.kind))
      throw new K("already-purchased", "That Advancement was already purchased this cycle.");
    const r = a ? 0 : s.xpCost;
    if (e.system.xp < r)
      throw new K("insufficient-xp", "This Character does not have enough XP.");
    const l = L(e.system), u = {};
    let d = null, p = null, y;
    if (t.kind === "increaseCapabilities") {
      const h = Object.values(t.allocation);
      if (h.some((f) => !Number.isInteger(f) || f < 0) || h.reduce((f, A) => f + A, 0) !== s.capabilityPoints)
        throw new K("invalid-allocation", "Pool allocation must distribute exactly four points.");
      for (const f of ["might", "speed", "intellect"]) {
        const A = t.allocation[f], v = fi(
          e.system,
          `${f}Max`,
          A
        );
        u[v.path] = v.value;
        const E = v.overrideActive ? v.value : e.system.derived.pools[f].max + A;
        u[`system.stats.${f}.value`] = Math.min(
          e.system.stats[f].value + A,
          E
        );
      }
    } else if (t.kind === "moveTowardPerfection") {
      const h = fi(
        e.system,
        `${t.pool}Edge`,
        1
      );
      u[h.path] = h.value;
    } else if (t.kind === "extraEffort") {
      if (this.#o(e) >= s.effortMaximum)
        throw new K("effort-maximum", "Core Effort is already at its maximum.");
      const h = fi(e.system, "effort", 1);
      u[h.path] = h.value;
    } else if (t.kind === "skillTraining")
      if (t.mode === "improve") {
        const h = this.skillTrainingOptions(e, i).find((A) => A.id === t.skillId), f = [...e.items].find((A) => A.id === t.skillId && A.type === "skill");
        if (!h || !f) throw new K("skill-not-found", "Skill Item not found.");
        if (h.reason === "maximum" || !h.nextRank)
          throw new K("skill-maximum", "This Skill cannot be improved by Core Advancement.");
        if (h.reason === "tier")
          throw new K("skill-tier", "Attack and defense training is not available at this Tier.");
        d = { skill: f, rank: f.system.rank }, y = h.nextRank;
      } else {
        const h = await this.#r(e, t, s);
        if (p = (await e.createEmbeddedDocuments("Item", [h]))[0] ?? null, !p) throw new Error("Foundry did not create the learned Skill Item.");
        y = "trained";
      }
    else
      this.#s(e, t.otherKind, s, u);
    const m = {
      id: this.#t(),
      kind: t.kind,
      otherKind: t.kind === "other" ? t.otherKind : "none",
      tier: l,
      xpCost: r,
      timestamp: this.#i()
    };
    Object.assign(u, {
      "system.xp": e.system.xp - r,
      "system.advancement.purchases": [...o, m]
    }), d && y && await d.skill.update({ "system.rank": y });
    try {
      await e.update(u);
    } catch (h) {
      throw d && await d.skill.update({ "system.rank": d.rank }), p?.delete && await p.delete(), h;
    }
    return { ...y ? { skillRank: y } : {}, record: m };
  }
  async #r(e, t, i) {
    const a = t.sourceUuid ? await this.#n(t.sourceUuid) : null;
    if (t.sourceUuid && !a)
      throw new K("skill-not-found", "The selected Skill source is unavailable.");
    const s = a?.name.trim() || t.customName?.trim() || "";
    if (!s) throw new K("skill-not-found", "A new custom Skill requires a name.");
    if ([...e.items].some((d) => d.type === "skill" && (d.name.trim().toLocaleLowerCase() === s.toLocaleLowerCase() || !!(a?.uuid && d.system.acquisition?.grantedByUuid === a.uuid))))
      throw new K("duplicate-skill", "This Character already owns that Skill.");
    const r = a?.system.category ?? t.customCategory ?? "general", l = a?.system.contexts ?? (r === "general" ? [] : [r]), u = r === "attack" || r === "defense" || l.some((d) => d === "attack" || d.startsWith("attack.") || d === "defense" || d.startsWith("defense."));
    if (u && L(e.system) < i.attackDefenseTrainingTier)
      throw new K("skill-tier", "Attack and defense training is not available at this Tier.");
    return {
      name: s,
      type: "skill",
      system: {
        ...a ? structuredClone(a.system) : {},
        rank: "trained",
        category: r,
        contexts: l,
        acquisition: {
          ...a?.system.acquisition ?? {},
          minimumTier: u ? i.attackDefenseTrainingTier : 1,
          grantedByUuid: a?.uuid ?? "",
          notes: ""
        }
      }
    };
  }
  #s(e, t, i, a) {
    if (t === "recovery")
      a["system.recovery.bonus"] = e.system.recovery.bonus + i.recoveryBonus;
    else if (t === "focus") {
      const s = {
        id: this.#t(),
        source: "otherAdvancement",
        grantTier: L(e.system),
        focusUuid: ""
      };
      a["system.advancement.pendingFocusChoices"] = [
        ...e.system.advancement.pendingFocusChoices,
        s
      ];
    } else if (t === "armor")
      a["system.proficiencies.armorCategories"] = Za([
        ...e.system.proficiencies.armorCategories,
        ...je
      ]);
    else if (t === "weapons")
      a["system.proficiencies.weaponCategories"] = Za([
        ...e.system.proficiencies.weaponCategories,
        ...Le
      ]);
    else {
      if (L(e.system) < 3)
        throw new K("genre-tier", "Genre Advancement requires Tier 3 or higher.");
      const s = {
        id: this.#t(),
        source: "otherAdvancement",
        grantTier: L(e.system)
      };
      a["system.advancement.pendingGenreChoices"] = [
        ...e.system.advancement.pendingGenreChoices,
        s
      ];
    }
  }
  #c(e) {
    if (e.type !== "character")
      throw new K("not-character", "Advancement requires a Character.");
  }
  #o(e) {
    return e.system.derived.effort?.max ?? St(e.system.stats.effortBase, e.system.overrides?.effort);
  }
  #d(e) {
    return e.uuid ?? e.id;
  }
  async #u(e, t) {
    const i = this.#d(e), s = (this.#a.get(i) ?? Promise.resolve()).catch(() => {
    }).then(t);
    this.#a.set(i, s);
    try {
      return await s;
    } finally {
      this.#a.get(i) === s && this.#a.delete(i);
    }
  }
}
function Ai(n) {
  return n.replace(/[&<>"']/g, (e) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[e]);
}
const Hd = {
  "not-character": "MAGNUSARCHIVES.Advancement.Errors.NotCharacter",
  "cycle-complete": "MAGNUSARCHIVES.Advancement.Errors.CycleComplete",
  "already-purchased": "MAGNUSARCHIVES.Advancement.Errors.AlreadyPurchased",
  "other-already-purchased": "MAGNUSARCHIVES.Advancement.Errors.OtherAlreadyPurchased",
  "insufficient-xp": "MAGNUSARCHIVES.Advancement.Errors.InsufficientXP",
  "invalid-allocation": "MAGNUSARCHIVES.Advancement.Errors.InvalidAllocation",
  "effort-maximum": "MAGNUSARCHIVES.Advancement.Errors.EffortMaximum",
  "skill-not-found": "MAGNUSARCHIVES.Advancement.Errors.SkillNotFound",
  "duplicate-skill": "MAGNUSARCHIVES.Advancement.Errors.DuplicateSkill",
  "skill-maximum": "MAGNUSARCHIVES.Advancement.Errors.SkillMaximum",
  "skill-tier": "MAGNUSARCHIVES.Advancement.Errors.SkillTier",
  "genre-tier": "MAGNUSARCHIVES.Advancement.Errors.GenreTier",
  "tier-not-ready": "MAGNUSARCHIVES.Advancement.Errors.TierNotReady",
  "purchase-not-found": "MAGNUSARCHIVES.Advancement.Errors.PurchaseNotFound",
  "purchase-not-current": "MAGNUSARCHIVES.Advancement.Errors.PurchaseNotCurrent"
};
function Ze(n, e) {
  return String(n[e] ?? "");
}
function pn(n, e) {
  return Number(n[e] ?? 0);
}
function $d() {
  return ["might", "speed", "intellect"].map((n) => `<option value="${n}">${game.i18n.localize(`MAGNUSARCHIVES.Pools.${n[0].toUpperCase()}${n.slice(1)}`)}</option>`).join("");
}
async function ft(n, e) {
  return foundry.applications.api.DialogV2.input({
    window: { title: n },
    content: `<div class="magnusarchives-dialog-fields">${e}</div>`,
    rejectClose: !1,
    ok: { label: game.i18n.localize("MAGNUSARCHIVES.Advancement.Purchase") }
  });
}
function ya(n) {
  n instanceof K ? ui.notifications.error(game.i18n.localize(Hd[n.code])) : (console.error(n), ui.notifications.error(game.i18n.localize("MAGNUSARCHIVES.Advancement.Errors.Unexpected")));
}
async function Vd(n, e) {
  const t = game.i18n.localize(`MAGNUSARCHIVES.Advancement.Option.${e}`);
  if (e === "increaseCapabilities") {
    const i = await ft(t, `
      <p>${game.i18n.localize("MAGNUSARCHIVES.Advancement.CapabilitiesPrompt")}</p>
      <label>${game.i18n.localize("MAGNUSARCHIVES.Pools.Might")}<input name="might" type="number" min="0" max="4" value="0"></label>
      <label>${game.i18n.localize("MAGNUSARCHIVES.Pools.Speed")}<input name="speed" type="number" min="0" max="4" value="0"></label>
      <label>${game.i18n.localize("MAGNUSARCHIVES.Pools.Intellect")}<input name="intellect" type="number" min="0" max="4" value="0"></label>`);
    return i ? { kind: e, allocation: {
      might: pn(i, "might"),
      speed: pn(i, "speed"),
      intellect: pn(i, "intellect")
    } } : null;
  }
  if (e === "moveTowardPerfection") {
    const i = await ft(t, `<label>${game.i18n.localize("MAGNUSARCHIVES.Advancement.ChoosePool")}<select name="pool">${$d()}</select></label>`);
    return i ? { kind: e, pool: Ze(i, "pool") } : null;
  }
  if (e === "skillTraining") {
    const i = await ft(t, `<label>${game.i18n.localize("MAGNUSARCHIVES.Advancement.SkillMode")}<select name="mode">
      <option value="learn">${game.i18n.localize("MAGNUSARCHIVES.Advancement.LearnNewSkill")}</option>
      <option value="improve">${game.i18n.localize("MAGNUSARCHIVES.Advancement.ImproveExistingSkill")}</option>
    </select></label>`);
    if (!i) return null;
    if (Ze(i, "mode") === "learn") {
      const r = [...game.items].filter((d) => d.type === "skill").sort((d, p) => d.name.localeCompare(p.name)), l = await ft(t, `
        <label>${game.i18n.localize("MAGNUSARCHIVES.Advancement.SkillSource")}<select name="sourceUuid">
          <option value="custom">${game.i18n.localize("MAGNUSARCHIVES.Advancement.CustomSkill")}</option>
          ${r.map((d) => `<option value="${Ai(d.uuid)}">${Ai(d.name)}</option>`).join("")}
        </select></label>
        <label>${game.i18n.localize("MAGNUSARCHIVES.Advancement.CustomSkillName")}<input name="customName" type="text"></label>
        <label>${game.i18n.localize("MAGNUSARCHIVES.Skill.Category")}<select name="customCategory">
          <option value="general">${game.i18n.localize("MAGNUSARCHIVES.Advancement.SkillCategory.general")}</option>
          <option value="attack">${game.i18n.localize("MAGNUSARCHIVES.Advancement.SkillCategory.attack")}</option>
          <option value="defense">${game.i18n.localize("MAGNUSARCHIVES.Advancement.SkillCategory.defense")}</option>
        </select></label>`);
      if (!l) return null;
      const u = Ze(l, "sourceUuid");
      return u === "custom" ? {
        kind: e,
        mode: "learn",
        customName: Ze(l, "customName"),
        customCategory: Ze(l, "customCategory")
      } : { kind: e, mode: "learn", sourceUuid: u };
    }
    const s = game.magnusarchives.services.advancement.skillTrainingOptions(
      n,
      rt()
    ).filter((r) => r.eligible);
    if (s.length === 0)
      return ui.notifications.warn(game.i18n.localize("MAGNUSARCHIVES.Advancement.NoEligibleSkills")), null;
    const o = await ft(t, `<label>${game.i18n.localize("MAGNUSARCHIVES.Advancement.ChooseSkill")}<select name="skillId">${s.map((r) => `<option value="${Ai(r.id)}">${Ai(r.name)} — ${game.i18n.localize(`MAGNUSARCHIVES.Skill.Ranks.${r.currentRank}`)} → ${game.i18n.localize(`MAGNUSARCHIVES.Skill.Ranks.${r.nextRank}`)}</option>`).join("")}</select></label>`);
    return o ? { kind: e, mode: "improve", skillId: Ze(o, "skillId") } : null;
  }
  if (e === "other") {
    const i = to.filter((s) => s !== "genre" || L(n.system) >= 3), a = await ft(t, `<label>${game.i18n.localize("MAGNUSARCHIVES.Advancement.OtherType")}<select name="otherKind">${i.map((s) => `<option value="${s}">${game.i18n.localize(`MAGNUSARCHIVES.Advancement.Other.${s}`)}</option>`).join("")}</select></label>`);
    return a ? { kind: e, otherKind: Ze(a, "otherKind") } : null;
  }
  return { kind: e };
}
async function Dd(n, e) {
  const t = await Vd(n, e);
  if (t)
    try {
      await game.magnusarchives.services.advancement.purchase(
        n,
        t,
        rt()
      ), ui.notifications.info(game.i18n.localize("MAGNUSARCHIVES.Advancement.PurchasedNotice"));
    } catch (i) {
      ya(i);
    }
}
async function Fd(n, e) {
  if (!await foundry.applications.api.DialogV2.wait({
    window: { title: game.i18n.localize("MAGNUSARCHIVES.Advancement.Undo.Title") },
    content: `<div class="magnusarchives magnusarchives-dialog advancement-undo-dialog">
      <p>${game.i18n.localize("MAGNUSARCHIVES.Advancement.Undo.ReopenWarning")}</p>
      <p>${game.i18n.localize("MAGNUSARCHIVES.Advancement.Undo.NoRollbackWarning")}</p>
      <p>${game.i18n.localize("MAGNUSARCHIVES.Advancement.Undo.ManualReviewWarning")}</p>
    </div>`,
    rejectClose: !1,
    modal: !0,
    defaultYes: !1,
    buttons: [
      {
        action: "no",
        label: game.i18n.localize("MAGNUSARCHIVES.Actions.Cancel"),
        icon: "fa-solid fa-xmark",
        default: !0,
        callback: () => !1
      },
      {
        action: "yes",
        label: game.i18n.localize("MAGNUSARCHIVES.Advancement.Undo.Confirm"),
        icon: "fa-solid fa-check",
        callback: () => !0
      }
    ]
  })) return !1;
  try {
    return await game.magnusarchives.services.advancement.undoPurchase(n, e), ui.notifications.info(game.i18n.localize("MAGNUSARCHIVES.Advancement.Undo.Success")), !0;
  } catch (i) {
    return ya(i), !1;
  }
}
async function Td(n) {
  try {
    const e = await game.magnusarchives.services.advancement.advanceTier(
      n,
      rt()
    );
    ui.notifications.info(game.i18n.format("MAGNUSARCHIVES.Advancement.TierAdvancedNotice", { tier: e.tier }));
  } catch (e) {
    ya(e);
  }
}
class ve extends Error {
  constructor(e, t) {
    super(t), this.code = e, this.name = "FocusAssociationError";
  }
  code;
}
const zd = () => globalThis.crypto?.randomUUID?.() ?? `focus-${Date.now()}-${Math.random().toString(36).slice(2)}`;
class Pd {
  #e;
  #t;
  #i = /* @__PURE__ */ new Map();
  constructor(e = zd, t = Date.now) {
    this.#e = e, this.#t = t;
  }
  async attach(e, t, i) {
    return this.#r(e, async () => {
      if (this.#n(e, t), e.system.focusProgress.some((l) => this.#a(l, t)))
        throw new ve("duplicate", "This Focus is already attached.");
      if (i === "creation") {
        if (L(e.system) !== 1)
          throw new ve("creation-tier", "A creation Focus requires a Tier 1 Character.");
        if (e.system.focusProgress.some((l) => l.provenance === "creation"))
          throw new ve("creation-focus-exists", "This Character already has a creation Focus.");
      }
      const a = e.system.advancement.initializedFocusUuids.includes(t.uuid), s = {
        focusUuid: t.uuid,
        ownedNodeIds: [],
        acquisitions: [],
        provenance: i,
        initialChoicesGranted: !a,
        attachedAt: this.#t()
      }, o = i === "creation" ? "characterCreation" : "additionalFocus", r = a ? [] : Array.from({ length: 2 }, () => ({
        id: this.#e(),
        source: o,
        grantTier: 1,
        focusUuid: t.uuid
      }));
      return await e.update({
        "system.focusProgress": [...e.system.focusProgress, s],
        "system.advancement.pendingFocusChoices": [
          ...e.system.advancement.pendingFocusChoices,
          ...r
        ],
        "system.advancement.initializedFocusUuids": a ? [...e.system.advancement.initializedFocusUuids] : [...e.system.advancement.initializedFocusUuids, t.uuid]
      }), { progress: s, choicesGranted: r };
    });
  }
  async remove(e, t) {
    return this.#r(e, async () => {
      if (e.type !== "character")
        throw new ve("not-character", "Focus association requires a Character.");
      const i = e.system.focusProgress.find((s) => s.focusUuid === t);
      if (!i) throw new ve("progress-missing", "Focus progression was not found.");
      const a = e.system.advancement.pendingFocusChoices.filter((s) => s.focusUuid === t).map((s) => s.id);
      return await e.update({
        "system.focusProgress": e.system.focusProgress.filter((s) => s !== i),
        "system.advancement.pendingFocusChoices": e.system.advancement.pendingFocusChoices.filter((s) => s.focusUuid !== t)
      }), { progress: i, removedPendingChoiceIds: a };
    });
  }
  #n(e, t) {
    if (e.type !== "character")
      throw new ve("not-character", "Focus association requires a Character.");
    if (t.type !== "focus" || !t.uuid)
      throw new ve("not-focus", "Only a Focus Item can be attached.");
  }
  #a(e, t) {
    return e.focusUuid === t.uuid || e.focusUuid === t.id;
  }
  #l(e) {
    return e.uuid ?? e.id;
  }
  async #r(e, t) {
    const i = this.#l(e), s = (this.#i.get(i) ?? Promise.resolve()).catch(() => {
    }).then(t);
    this.#i.set(i, s);
    try {
      return await s;
    } finally {
      this.#i.get(i) === s && this.#i.delete(i);
    }
  }
}
function fn(n) {
  return n.replace(/[&<>"']/g, (e) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[e]);
}
function Ko(n) {
  const e = n instanceof ve ? `MAGNUSARCHIVES.Focus.Association.Errors.${n.code}` : "MAGNUSARCHIVES.Focus.Errors.Unexpected";
  n instanceof ve || console.error(n), ui.notifications.error(game.i18n.localize(e));
}
async function es(n, e) {
  let t = e;
  if (!t) {
    const s = [...game.items].filter((r) => r.type === "focus").sort((r, l) => r.name.localeCompare(l.name));
    if (s.length === 0) {
      ui.notifications.warn(game.i18n.localize("MAGNUSARCHIVES.Focus.Association.NoWorldFoci"));
      return;
    }
    const o = await foundry.applications.api.DialogV2.input({
      window: { title: game.i18n.localize("MAGNUSARCHIVES.Focus.Association.Add") },
      content: `<div class="magnusarchives-dialog-fields"><label>${game.i18n.localize("MAGNUSARCHIVES.Focus.Association.Focus")}
        <select name="focusUuid">${s.map((r) => `<option value="${fn(r.uuid)}">${fn(r.name)}</option>`).join("")}</select></label></div>`,
      ok: { label: game.i18n.localize("MAGNUSARCHIVES.Focus.Association.Add") }
    });
    if (!o) return;
    t = await fromUuid(String(o.focusUuid ?? "")) ?? void 0;
  }
  if (!t) return;
  const i = L(n.system) === 1 && !n.system.focusProgress.some((s) => s.provenance === "creation"), a = await foundry.applications.api.DialogV2.input({
    window: { title: game.i18n.localize("MAGNUSARCHIVES.Focus.Association.Add") },
    content: `<div class="magnusarchives-dialog-fields">
      <p><strong>${fn(t.name)}</strong></p>
      <label>${game.i18n.localize("MAGNUSARCHIVES.Focus.Association.Provenance")}
        <select name="provenance">
          ${i ? `<option value="creation">${game.i18n.localize("MAGNUSARCHIVES.Focus.Association.Creation")}</option>` : ""}
          <option value="additional">${game.i18n.localize("MAGNUSARCHIVES.Focus.Association.Additional")}</option>
        </select>
      </label>
    </div>`,
    ok: { label: game.i18n.localize("MAGNUSARCHIVES.Focus.Association.Add") }
  });
  if (a)
    try {
      const s = await game.magnusarchives.services.focusAssociations.attach(
        n,
        t,
        String(a.provenance)
      );
      ui.notifications.info(game.i18n.localize(
        s.choicesGranted.length > 0 ? "MAGNUSARCHIVES.Focus.Association.Added" : "MAGNUSARCHIVES.Focus.Association.Reattached"
      ));
    } catch (s) {
      Ko(s);
    }
}
async function xd(n, e) {
  const t = n.system.focusProgress.find((s) => s.focusUuid === e);
  if (!t) return;
  const i = t.ownedNodeIds.length > 0 ? game.i18n.format("MAGNUSARCHIVES.Focus.Association.RemoveOwnedWarning", { count: t.ownedNodeIds.length }) : game.i18n.localize("MAGNUSARCHIVES.Focus.Association.RemoveWarning");
  if (await foundry.applications.api.DialogV2.confirm({
    window: { title: game.i18n.localize("MAGNUSARCHIVES.Focus.Association.Remove") },
    content: `<div class="magnusarchives magnusarchives-dialog"><p>${i}</p></div>`,
    yes: { label: game.i18n.localize("MAGNUSARCHIVES.Focus.Association.Remove") },
    no: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Cancel") }
  }))
    try {
      await game.magnusarchives.services.focusAssociations.remove(n, e), ui.notifications.info(game.i18n.localize("MAGNUSARCHIVES.Focus.Association.Removed"));
    } catch (s) {
      Ko(s);
    }
}
const V = (n, e, t, i, a, s, o) => ({ key: n, name: e, summary: t, beats: { opening: i, steps: a, climax: s, resolution: o } }), Xo = [
  V(
    "aid-a-friend",
    "Aid a Friend",
    "Help another character, PC or NPC, with an arc of their own.",
    "Answering the call",
    ["Depends on the friend's arc"],
    "Depends on the friend's arc",
    "Talk it over with your friend"
  ),
  V(
    "assist-an-organization",
    "Assist an Organization",
    "Take on one clear task that moves a group you are tied to forward.",
    "Responding to the call",
    ["Sizing up the task", "Undertaking the task"],
    "Completing the task",
    "Collecting your reward"
  ),
  V(
    "avenge",
    "Avenge",
    "Someone close to you was wronged, and you mean to make the guilty party answer for it.",
    "Declaration",
    ["Tracking the guilty", "Finding the guilty"],
    "Confrontation",
    "Deal with the aftermath"
  ),
  V(
    "birth",
    "Birth",
    "You are becoming a parent and must see the pregnancy safely through.",
    "Impregnation",
    ["Finding a caretaker", "Complication", "Preparation"],
    "Delivery",
    "Settle in with the baby"
  ),
  V(
    "build",
    "Build",
    "Put up or rebuild a physical structure, such as a house, workshop or lab.",
    "Make a plan",
    ["Find a site", "Gather materials", "Construction"],
    "Completion",
    "Put the structure to use"
  ),
  V(
    "cleanse",
    "Cleanse",
    "Rid a person, place or thing of a supernatural taint, curse or infestation.",
    "Analyze the threat",
    ["Find the solution", "Getting ready"],
    "The cleansing",
    "Reflect on what happened"
  ),
  V(
    "creation",
    "Creation",
    "Make something: a painting, a novel, a machine, or even an artefact.",
    "Make a plan",
    ["Gather materials", "Progress"],
    "Completion",
    "Enjoy what you made"
  ),
  V(
    "defeat-a-foe",
    "Defeat a Foe",
    "Overcome a rival who stands in your way. It need not mean a fight.",
    "Sizing up the competition",
    ["Investigation", "Diving in"],
    "Confrontation",
    "Reflect on the outcome"
  ),
  V(
    "defense",
    "Defense",
    "Protect a threatened person, place or thing from the danger coming for it.",
    "Analyze the situation",
    ["Account for your resources", "Fend off danger"],
    "Protect",
    "Assess its safety going forward"
  ),
  V(
    "develop-a-bond",
    "Develop a Bond",
    "Grow closer to another character as a friend, mentor or something more.",
    "Getting to know you",
    ["Initial attempt", "Building a relationship"],
    "Bond",
    "Enjoy the new relationship"
  ),
  V(
    "enterprise",
    "Enterprise",
    "Start and run a business or organization of your own.",
    "Drawing up a plan",
    ["Account for your resources", "Finding a location", "Building the enterprise"],
    "Profit and loss",
    "Reflect on how to move forward"
  ),
  V(
    "establishment",
    "Establishment",
    "Prove yourself as someone who matters, socially, professionally or otherwise.",
    "Assessment",
    ["Appearances matter", "Self-aggrandizement"],
    "Grabbing attention",
    "Reflect on where you go next"
  ),
  V(
    "explore",
    "Explore",
    "Uncover the secrets of an unknown place, from a lost ruin to a twisted dimension.",
    "Make a plan",
    ["Gather resources", "Travel", "Exploration"],
    "Conquest",
    "Return home and share findings"
  ),
  V(
    "fall-from-grace",
    "Fall From Grace",
    "A chosen downward spiral of your own making, often setting up a later Redemption.",
    "The descent",
    ["Further descent", "Lashing out"],
    "Rock bottom",
    "Wallow in your own misery"
  ),
  V(
    "finish-a-great-work",
    "Finish a Great Work",
    "Complete something someone else began long ago.",
    "Assessing the past",
    ["Conceive a plan", "Progress"],
    "Completion",
    "Reflect on what you did"
  ),
  V(
    "growth",
    "Growth",
    "Change who you are inside, becoming braver, kinder or more of a leader.",
    "The beginning",
    ["Change", "Overcoming an obstacle"],
    "Self-evident change",
    "Recognize the change in yourself"
  ),
  V(
    "instruction",
    "Instruction",
    "Teach a pupil a skill, a body of lore or a special ability.",
    "Taking on the student",
    ["Getting to know them", "The lessons", "Breakdown"],
    "Graduation",
    "Say your goodbyes"
  ),
  V(
    "join-an-organization",
    "Join an Organization",
    "Become a member of a company, cult, secret society or similar group.",
    "Getting the details",
    ["Making a contact", "Performing a deed"],
    "Proving your worth",
    "Assess what membership gets you"
  ),
  V(
    "justice",
    "Justice",
    "Right a wrong or bring a wrongdoer to justice.",
    "Declaration",
    ["Tracking the guilty", "Helping the victim"],
    "Confrontation",
    "Resolve the outcome"
  ),
  V(
    "learn",
    "Learn",
    "Gain a new skill or field of knowledge, such as a language or an instrument.",
    "Focusing on the problem",
    ["Finding a teacher", "Learn"],
    "The test",
    "Relax and decide what's next"
  ),
  V(
    "master-a-skill",
    "Master a Skill",
    "Go from skilled to the very best, often after a Learn arc.",
    "Finding the path",
    ["Discovering a master", "Learn", "The last step"],
    "The test",
    "Relax and decide what's next"
  ),
  V(
    "mysterious-background",
    "Mysterious Background",
    "Dig into a mystery in your own past, such as unknown parents or a strange mark.",
    "Beginning the search",
    ["Research", "Investigation"],
    "Discovery",
    "Consider what you now know"
  ),
  V(
    "new-discovery",
    "New Discovery",
    "Invent a device, process or ritual nobody has made before.",
    "The idea",
    ["Research", "Trial and error"],
    "Eureka!",
    "Write it all down"
  ),
  V(
    "raise-a-child",
    "Raise a Child",
    "Bring up a child to adulthood, by birth, adoption or as a protege.",
    "Sharing your home",
    ["Care and feeding", "Basic instruction", "The rewards are many", "Ethical instruction"],
    "Adulthood",
    "Reflect on the memories"
  ),
  V(
    "recover-from-a-wound",
    "Recover From a Wound (or Trauma)",
    "Heal from a major injury, illness, loss or emotional trauma.",
    "Rest",
    ["Self-care", "Getting aid", "Medicine", "Therapy"],
    "Acceptance or recovery",
    "Get on with your life"
  ),
  V(
    "redemption",
    "Redemption",
    "You did something very wrong and want to atone for it.",
    "Regret",
    ["Forgiveness", "Identifying the needs"],
    "Making good",
    "Look to the future"
  ),
  V(
    "repay-a-debt",
    "Repay a Debt",
    "Make good on something you owe, through money or a deed.",
    "Debts come due",
    ["Talking it over"],
    "Repayment",
    "Relax knowing the debt is paid"
  ),
  V(
    "rescue",
    "Rescue",
    "Someone or something important was taken, and you will get them back.",
    "Heeding the call",
    ["Tracking", "Travel"],
    "Rescue operation",
    "Return them home"
  ),
  V(
    "restoration",
    "Restoration",
    "Rebuild your good name, home or fortune after losing it.",
    "Vow to yourself",
    ["Work"],
    "The final act",
    "Enjoy a return to how things were"
  ),
  V(
    "revenge",
    "Revenge",
    "Someone harmed you personally, and you want them to pay.",
    "Vow",
    ["Finding a clue"],
    "Confrontation",
    "Deal with the aftermath"
  ),
  V(
    "romance",
    "Romance",
    "Start a relationship with a romantic partner.",
    "Caught someone's eye",
    ["Courtship"],
    "Commitment",
    "Think about the future"
  ),
  V(
    "solve-a-mystery",
    "Solve a Mystery",
    "Find out the truth behind a recent crime or strange event.",
    "Pledging to solve the mystery",
    ["Research", "Investigation"],
    "Discovery",
    "Act on what you found"
  ),
  V(
    "theft",
    "Theft",
    "Steal something you want, or something someone shouldn't have.",
    "Setting your sights",
    ["Casing the joint", "Getting to the object"],
    "The attempt",
    "Decide what to do with it"
  ),
  V(
    "train-a-creature",
    "Train a Creature",
    "Tame and train an animal that isn't already domesticated.",
    "Getting acquainted",
    ["Research", "Domestication", "Training"],
    "Completion",
    "Reflect on the experience"
  ),
  V(
    "transformation",
    "Transformation",
    "Change yourself in a specific outward way, often with real risk.",
    "Deciding on the transformation",
    ["Research", "Investigation"],
    "Change",
    "Consider how it affects you"
  ),
  V(
    "uncover-a-secret",
    "Uncover a Secret",
    "Seek out hidden knowledge, a lost formula or a cult's true leader.",
    "Naming the secret",
    ["Research", "Investigation", "Tracking"],
    "Revelation",
    "Consider how it affects you and the world"
  ),
  V(
    "undo-a-wrong",
    "Undo a Wrong",
    "Reverse lasting damage from something horrible done in the past.",
    "Vowing to put right what once went wrong",
    ["Make a plan", "Progress"],
    "Change",
    "Reflect on what you did"
  )
];
function Yo(n) {
  return Xo.find((e) => e.key === n);
}
class Pe extends Error {
  constructor(e, t) {
    super(t), this.code = e, this.name = "CharacterInitializationError";
  }
  code;
}
class qd {
  #e;
  constructor(e = Date.now) {
    this.#e = e;
  }
  async setup(e, t) {
    this.#t(e);
    const i = Object.values(t.pools);
    if (i.some((o) => !Number.isInteger(o) || o < 0) || i.reduce((o, r) => o + r, 0) !== 6)
      throw new Pe("invalid-pools", "Core Setup must distribute exactly six Pool points.");
    const a = t.descriptorLabel?.trim().replace(/\s+/g, " ") ?? "", s = t.arc?.name.trim() ?? "";
    if (await e.update({
      "system.tier": 1,
      "system.stats.might.value": 8 + t.pools.might,
      "system.stats.might.baseMax": 8 + t.pools.might,
      "system.stats.might.baseEdge": 0,
      "system.stats.speed.value": 8 + t.pools.speed,
      "system.stats.speed.baseMax": 8 + t.pools.speed,
      "system.stats.speed.baseEdge": 0,
      "system.stats.intellect.value": 8 + t.pools.intellect,
      "system.stats.intellect.baseMax": 8 + t.pools.intellect,
      "system.stats.intellect.baseEdge": 0,
      "system.stats.effortBase": 1,
      "system.cypherLimitBase": 2,
      "system.proficiencies.weaponCategories": ["light"],
      "system.proficiencies.armorCategories": [],
      "system.identity.descriptorLabel": a,
      ...s ? {
        "system.arc.key": t.arc?.key ?? "",
        "system.arc.name": s,
        "system.arc.stage": "none",
        "system.arc.stepsCompleted": 0
      } : {},
      "system.creation": {
        coreInitialized: !0,
        mode: "completed",
        initializedAt: this.#e()
      }
    }), !e.system.creation.coreInitialized)
      throw new Pe(
        "state-not-persisted",
        "Foundry did not expose the persisted Core initialization state after update."
      );
  }
  async markInitialized(e, t) {
    if (e.type !== "character")
      throw new Pe("not-character", "Core Setup requires a Character.");
    if (!e.system.creation.coreInitialized && (await e.update({ "system.creation": {
      coreInitialized: !0,
      mode: t,
      initializedAt: this.#e()
    } }), !e.system.creation.coreInitialized))
      throw new Pe(
        "state-not-persisted",
        "Foundry did not expose the persisted Core initialization state after update."
      );
  }
  #t(e) {
    if (e.type !== "character")
      throw new Pe("not-character", "Core Setup requires a Character.");
    if (e.system.creation.coreInitialized)
      throw new Pe("already-initialized", "Core Setup has already been finalized.");
  }
}
function Re(n) {
  return n.replace(/[&<>"']/g, (e) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[e]);
}
function ts(n) {
  return n ? game.i18n.localize(`MAGNUSARCHIVES.Skill.Ranks.${n}`) : "";
}
function Od(n) {
  const e = n.toObject();
  return {
    name: n.name,
    ...e.img ? { img: e.img } : {},
    system: structuredClone(e.system ?? {})
  };
}
async function is(n, e, t) {
  const i = e ? await fromUuid(e) : null;
  return !(i instanceof Item) || i.type !== n.type ? (ui.notifications.warn(game.i18n.localize("MAGNUSARCHIVES.GrantConflict.InvalidReplacement")), null) : {
    action: "replace",
    selectionKind: t,
    replacement: {
      id: i.uuid,
      type: n.type,
      name: i.name,
      itemUuid: i.uuid,
      snapshot: Od(i),
      reason: game.i18n.localize(t === "compendium" ? "MAGNUSARCHIVES.GrantConflict.CompendiumItem" : "MAGNUSARCHIVES.GrantConflict.WorldItem"),
      reasonSourceUuid: i.uuid
    }
  };
}
async function Vt(n) {
  const e = [...game.items].filter((u) => u.type === n.type).filter((u) => u.uuid !== n.existing.contentUuid && u.uuid !== n.proposed.contentUuid).sort((u, d) => u.name.localeCompare(d.name)), t = n.suggestions.length ? n.suggestions.map((u) => `
      <label class="grant-conflict-option">
        <input type="radio" name="resolution" value="suggestion:${Re(u.id)}">
        <span><strong>${Re(u.name)}</strong><small>${Re(u.reason)}</small></span>
      </label>`).join("") : `<p class="empty-list">${game.i18n.localize("MAGNUSARCHIVES.GrantConflict.NoSuggestions")}</p>`, i = game.i18n.localize(n.type === "skill" ? "MAGNUSARCHIVES.GrantConflict.Skill" : "MAGNUSARCHIVES.GrantConflict.Ability"), a = n.existing.rank ? ` — ${Re(ts(n.existing.rank))}` : "", s = n.proposed.rank ? ` — ${Re(ts(n.proposed.rank))}` : "", o = game.user.isGM ? `
      <label class="grant-conflict-option"><input type="radio" name="resolution" value="world"><span>${game.i18n.localize("MAGNUSARCHIVES.GrantConflict.WorldItem")}</span></label>
      <select name="worldUuid">${e.map((u) => `<option value="${Re(u.uuid)}">${Re(u.name)}</option>`).join("")}</select>
      <label class="grant-conflict-option"><input type="radio" name="resolution" value="uuid"><span>${game.i18n.localize("MAGNUSARCHIVES.GrantConflict.CompendiumUuid")}</span></label>
      <input name="documentUuid" type="text" placeholder="Compendium.world.pack.Item.id">` : `<p class="hint">${game.i18n.localize("MAGNUSARCHIVES.GrantConflict.GmExternalOnly")}</p>`, r = n.context === "package" ? `<fieldset><legend>${game.i18n.format("MAGNUSARCHIVES.GrantConflict.ChooseAnother", { type: i })}</legend>
      ${o}
      ${n.allowCustom ? `<label class="grant-conflict-option"><input type="radio" name="resolution" value="custom"><span>${game.i18n.localize("MAGNUSARCHIVES.GrantConflict.CustomSkill")}</span></label><input name="customName" type="text" placeholder="${game.i18n.localize("MAGNUSARCHIVES.GrantConflict.CustomSkillName")}">` : `<p class="hint">${game.i18n.localize("MAGNUSARCHIVES.GrantConflict.NoCustomAbility")}</p>`}
    </fieldset>` : `<p class="hint">${game.i18n.localize("MAGNUSARCHIVES.GrantConflict.FocusRestriction")}</p>`, l = `<div class="magnusarchives magnusarchives-dialog grant-conflict-dialog">
    <div class="grant-conflict-comparison">
      <p><span>${game.i18n.localize("MAGNUSARCHIVES.GrantConflict.AlreadyHave")}</span><strong>${Re(n.existing.name)}${a}</strong></p>
      <p><span>${game.i18n.format("MAGNUSARCHIVES.GrantConflict.WouldGrant", { source: Re(n.packageName) })}</span><strong>${Re(n.proposed.name)}${s}</strong></p>
    </div>
    <fieldset><legend>${game.i18n.localize("MAGNUSARCHIVES.GrantConflict.Suggested")}</legend>${t}</fieldset>
    ${r}
    ${n.allowSuppress ? `<label class="grant-conflict-option suppress"><input type="radio" name="resolution" value="suppress" checked><span>${game.i18n.localize("MAGNUSARCHIVES.GrantConflict.Suppress")}</span></label>` : ""}
    ${n.allowGmOverride && game.user.isGM ? `<label class="grant-conflict-option"><input type="radio" name="resolution" value="gmOverride"><span>${game.i18n.localize("MAGNUSARCHIVES.GrantConflict.GmOverride")}</span></label>` : ""}
  </div>`;
  for (; ; ) {
    const u = await foundry.applications.api.DialogV2.input({
      window: { title: game.i18n.localize("MAGNUSARCHIVES.GrantConflict.Title") },
      content: l,
      ok: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Confirm") }
    });
    if (!u) return { action: "cancel" };
    const d = String(u.resolution ?? "");
    if (d === "suppress" && n.allowSuppress) return { action: "suppress" };
    if (d === "gmOverride" && n.allowGmOverride && game.user.isGM) return { action: "gmOverride" };
    if (d.startsWith("suggestion:")) {
      const p = n.suggestions.find((y) => y.id === d.slice(11));
      if (p) return { action: "replace", replacement: p, selectionKind: "suggested" };
    }
    if (d === "world") {
      const p = await is(n, String(u.worldUuid ?? ""), "world");
      if (p) return p;
    }
    if (d === "uuid") {
      const p = String(u.documentUuid ?? "").trim(), y = await is(n, p, p.startsWith("Compendium.") ? "compendium" : "world");
      if (y) return y;
    }
    if (d === "custom" && n.type === "skill" && n.allowCustom) {
      const p = String(u.customName ?? "").trim();
      if (p) return {
        action: "replace",
        selectionKind: "custom",
        replacement: {
          id: `custom:${p.toLocaleLowerCase()}`,
          type: "skill",
          name: p,
          itemUuid: "",
          snapshot: { name: p, system: {} },
          reason: game.i18n.localize("MAGNUSARCHIVES.GrantConflict.CustomSkill"),
          reasonSourceUuid: "",
          custom: !0
        }
      };
    }
    ui.notifications.warn(game.i18n.localize("MAGNUSARCHIVES.GrantConflict.SelectResolution"));
  }
}
function gt(n) {
  return n.trim().toLocaleLowerCase().replace(/[^a-z0-9]+/g, "");
}
function Bd(n, e) {
  const t = n.genre === "custom" ? String(n.customGenreId ?? "") : String(n.genre ?? "");
  if (!t || t === "none") return null;
  const i = [...e].sort((a, s) => a.uuid.localeCompare(s.uuid));
  return i.find((a) => a.uuid === t) ?? i.find((a) => gt(a.system.legacyKey) === gt(t)) ?? i.find((a) => gt(String(a.system.slug ?? "")) === gt(t)) ?? i.find((a) => gt(a.name) === gt(t)) ?? null;
}
async function Jo(n, e, t) {
  if (n.genre === "custom" && n.customGenreId) {
    const i = await t(n.customGenreId);
    if (i?.type === "genre") return i;
  }
  return Bd(n, e);
}
class xt extends Error {
  constructor(e, t) {
    super(t), this.code = e, this.name = "GenreAssociationError";
  }
  code;
}
class q extends Error {
  constructor(e, t) {
    super(t), this.code = e, this.name = "GenreChoiceError";
  }
  code;
}
function Ld() {
  return {
    active: !1,
    originalName: "",
    originalContentUuid: "",
    originalContentKey: "",
    replacementName: "",
    replacementContentUuid: "",
    replacementContentKey: "",
    selectionKind: "none"
  };
}
function ns(n) {
  return structuredClone(n);
}
class jd {
  #e;
  #t;
  #i;
  #n;
  #a = /* @__PURE__ */ new Map();
  constructor(e = async (s) => await fromUuid(s), t = async (s) => await fromUuid(s), i = () => globalThis.crypto?.randomUUID?.() ?? `genre-${Date.now()}-${Math.random()}`, a = Date.now) {
    this.#e = e, this.#t = t, this.#i = i, this.#n = a;
  }
  async attach(e, t, i = "manual") {
    return this.#o(e, async () => {
      if (this.#c(e), t.type !== "genre" || !t.uuid)
        throw new xt("not-genre", "Only a Genre Item can be attached.");
      if (e.system.genre.sourceUuid === t.uuid)
        throw new xt("duplicate", "This Genre is already attached.");
      const a = {
        sourceUuid: t.uuid,
        instanceId: this.#i(),
        provenance: i,
        attachedAt: this.#n()
      };
      return await e.update({ "system.genre": a }), a;
    });
  }
  async remove(e) {
    return this.#o(e, async () => {
      this.#c(e);
      const t = ns(e.system.genre);
      if (!t.sourceUuid) throw new xt("missing", "No Genre is attached.");
      return await e.update({
        "system.genre.sourceUuid": "",
        "system.genre.instanceId": "",
        "system.genre.provenance": "manual",
        "system.genre.attachedAt": 0
      }), t;
    });
  }
  async active(e) {
    return e.system.genre.sourceUuid ? this.#e(e.system.genre.sourceUuid) : null;
  }
  eligibleEntries(e, t, i) {
    return t.system.abilityCatalog.filter((a) => (a.catalog ?? "progression") === "progression" && a.minimumTier <= L(e.system) && a.minimumTier <= i.grantTier);
  }
  manualCatalog(e, t) {
    return t.system.abilityCatalog.filter((i) => (i.catalog ?? "progression") === "progression").map((i) => ({
      id: i.id,
      name: i.snapshot.name || i.id,
      minimumTier: i.minimumTier,
      normallyAvailable: i.minimumTier <= L(e.system),
      owned: !!this.#r(e, t, e.system.genre, i, "active")
    })).sort((i, a) => i.minimumTier - a.minimumTier || i.name.localeCompare(a.name));
  }
  async acquireManual(e, t, i) {
    return this.#o(e, async () => {
      this.#c(e);
      const a = e.system.genre;
      if (!a.sourceUuid) throw new q("genre-required", "Attach a Genre before acquiring an Ability.");
      const s = await this.#e(a.sourceUuid);
      if (!s || s.type !== "genre") throw new q("genre-unavailable", "The active Genre source is unavailable.");
      const o = s.system.abilityCatalog.find((m) => m.id === t);
      if (!o) throw new q("entry-missing", "The Genre Ability is no longer in the active Genre catalog.");
      if ((o.catalog ?? "progression") !== "progression")
        throw new q("entry-ineligible", "Origin Abilities are not part of Genre progression.");
      if (this.#r(e, s, a, o, "active")) return { entry: o, abilityCreated: !1, conflictOverridden: !1 };
      const l = this.#r(e, s, a, o, "retained");
      if (l?.update)
        return await l.update({ "system.grantedBy.status": "active" }), { entry: o, abilityCreated: !1, conflictOverridden: !1 };
      const u = await this.#l(s, a, o), d = this.#s(e, s, o, u);
      let p = !1;
      if (d) {
        if (!i) throw new q("duplicate-grant", "This Ability is already present on the Character.");
        const m = await i(d);
        if (m.action === "cancel") throw new We();
        if (m.action !== "gmOverride")
          throw new q("duplicate-grant", "A Genre acquisition must use an Ability from its Genre catalog.");
        p = !0;
      }
      const y = d ? void 0 : (await e.createEmbeddedDocuments("Item", [u]))[0];
      return { entry: o, abilityCreated: !!y, conflictOverridden: p };
    });
  }
  async undoManual(e, t, i) {
    return this.#o(e, async () => {
      this.#c(e);
      const a = e.system.genre;
      if (!a.sourceUuid) throw new q("genre-required", "No active Genre is attached.");
      const s = await this.#e(a.sourceUuid);
      if (!s || s.type !== "genre") throw new q("genre-unavailable", "The active Genre source is unavailable.");
      const o = s.system.abilityCatalog.find((l) => l.id === t);
      if (!o) throw new q("entry-missing", "The Genre Ability is no longer in the active Genre catalog.");
      const r = this.#r(e, s, a, o, "active");
      if (!r) throw new q("entry-missing", "This Genre Ability is not currently owned.");
      if (i) {
        if (!r.delete) throw new q("ability-unavailable", "The embedded Genre Ability cannot be deleted.");
        return await r.delete(), { abilityDeleted: !0, abilityRetained: !1 };
      }
      if (!r.update) throw new q("ability-unavailable", "The embedded Genre Ability cannot be retained.");
      return await r.update({ "system.grantedBy.status": "retained" }), { abilityDeleted: !1, abilityRetained: !0 };
    });
  }
  async acquire(e, t, i, a) {
    return this.#o(e, async () => {
      this.#c(e);
      const s = e.system.genre;
      if (!s.sourceUuid) throw new q("genre-required", "Attach a Genre before spending this choice.");
      const o = await this.#e(s.sourceUuid);
      if (!o || o.type !== "genre") throw new q("genre-unavailable", "The active Genre source is unavailable.");
      const r = e.system.advancement.pendingGenreChoices.find((m) => m.id === t);
      if (!r) throw new q("choice-missing", "The pending Genre Choice no longer exists.");
      const l = o.system.abilityCatalog.find((m) => m.id === i);
      if (!l) throw new q("entry-missing", "The Genre Ability is no longer in the active Genre catalog.");
      if (!this.eligibleEntries(e, o, r).some((m) => m.id === l.id))
        throw new q("entry-ineligible", "This Genre Ability is not eligible for the selected choice.");
      const u = await this.#l(o, s, l), d = this.#s(e, o, l, u);
      let p = !1;
      if (d) {
        if (!a) throw new q("duplicate-grant", "This Ability is already present on the Character.");
        const m = await a(d);
        if (m.action === "cancel") throw new We();
        if (m.action !== "gmOverride")
          throw new q("duplicate-grant", "A Genre choice must grant an Ability from its Genre catalog.");
        p = !0;
      }
      let y;
      d || (y = (await e.createEmbeddedDocuments("Item", [u]))[0]);
      try {
        await e.update({
          "system.advancement.pendingGenreChoices": e.system.advancement.pendingGenreChoices.filter((m) => m.id !== r.id)
        });
      } catch (m) {
        throw await y?.delete?.(), m;
      }
      return { entry: l, abilityCreated: !!y, conflictOverridden: p };
    });
  }
  async #l(e, t, i) {
    const a = i.abilityUuid ? await this.#t(i.abilityUuid) : null, s = a?.type === "ability" ? a : null, o = i.snapshot;
    if (!s && (!o.name || !o.system))
      throw new q("ability-unavailable", "The Genre Ability source and snapshot are unavailable.");
    const r = s?.name ?? o.name, l = s?.img ?? o.img ?? "", u = s?.system ?? o.system, d = Ge("ability", r, i.abilityUuid || s?.uuid || ""), p = {
      kind: "genre",
      sourceUuid: e.uuid,
      instanceId: t.instanceId,
      grantId: i.id,
      status: "active",
      contentUuid: d.contentUuid,
      contentKey: d.contentKey,
      replacement: Ld()
    };
    return { name: r, img: l, type: "ability", system: { ...ns(u), grantedBy: p } };
  }
  #r(e, t, i, a, s) {
    return [...e.items].find((o) => {
      if (o.type !== "ability") return !1;
      const r = o.system.grantedBy ?? {};
      return r.kind === "genre" && r.sourceUuid === t.uuid && r.instanceId === i.instanceId && r.grantId === a.id && r.status === s;
    }) ?? null;
  }
  #s(e, t, i, a) {
    const o = a.system.grantedBy, r = Ge("ability", String(a.name), o.contentUuid), l = Wi(e.items, r);
    if (!l) return null;
    const u = l.system.grantedBy ?? {}, d = Ge("ability", l.name, String(u.contentUuid ?? "")), p = (y, m, h) => ({
      id: m,
      name: y.name,
      type: "ability",
      rank: "",
      contentUuid: h.contentUuid,
      contentKey: h.contentKey
    });
    return {
      id: `${t.uuid}:${i.id}`,
      type: "ability",
      packageName: t.name,
      packageSourceUuid: t.uuid,
      grantId: i.id,
      existing: p(l, String(l.id ?? d.contentKey), d),
      proposed: p({ name: String(a.name) }, i.id, r),
      suggestions: [],
      allowCustom: !1,
      allowSuppress: !1,
      allowGmOverride: !0,
      context: "genre"
    };
  }
  #c(e) {
    if (e.type !== "character") throw new xt("not-character", "Genre association requires a Character.");
  }
  async #o(e, t) {
    const i = e.uuid ?? e.id, s = (this.#a.get(i) ?? Promise.resolve()).catch(() => {
    }).then(t);
    this.#a.set(i, s);
    try {
      return await s;
    } finally {
      this.#a.get(i) === s && this.#a.delete(i);
    }
  }
}
function xe(n) {
  return n.replace(/[&<>"']/g, (e) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[e]);
}
function _i(n) {
  if (n instanceof We) return;
  console.error(n);
  const e = n instanceof xt ? `MAGNUSARCHIVES.Genre.Errors.${n.code}` : n instanceof q ? `MAGNUSARCHIVES.Genre.Errors.${n.code}` : "MAGNUSARCHIVES.Genre.Errors.unexpected";
  ui.notifications.error(game.i18n.localize(e));
}
async function zn(n, e, t = "manual") {
  let i = e;
  if (!i) {
    const a = [...game.items].filter((o) => o.type === "genre").sort((o, r) => o.name.localeCompare(r.name));
    if (!a.length) {
      ui.notifications.warn(game.i18n.localize("MAGNUSARCHIVES.Genre.NoWorldGenres"));
      return;
    }
    const s = await foundry.applications.api.DialogV2.input({
      window: { title: game.i18n.localize("MAGNUSARCHIVES.Genre.Add") },
      content: `<div class="magnusarchives-dialog-fields"><label>${game.i18n.localize("MAGNUSARCHIVES.Genre.Label")}<select name="uuid">${a.map((o) => `<option value="${xe(o.uuid)}">${xe(o.name)}</option>`).join("")}</select></label></div>`,
      ok: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Add") }
    });
    if (!s) return;
    i = await fromUuid(String(s.uuid ?? "")) ?? void 0;
  }
  if (i && !(n.system.genre.sourceUuid && n.system.genre.sourceUuid !== i.uuid && !await foundry.applications.api.DialogV2.confirm({
    window: { title: game.i18n.localize("MAGNUSARCHIVES.Genre.Replace") },
    content: `<div class="magnusarchives magnusarchives-dialog"><p>${game.i18n.localize("MAGNUSARCHIVES.Genre.ReplaceConfirm")}</p></div>`,
    yes: { label: game.i18n.localize("MAGNUSARCHIVES.Packages.Replace") },
    no: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Cancel") }
  })))
    try {
      await game.magnusarchives.services.genres.attach(n, i, t), ui.notifications.info(game.i18n.localize("MAGNUSARCHIVES.Genre.Attached"));
    } catch (a) {
      _i(a);
    }
}
async function Wd(n) {
  if (await foundry.applications.api.DialogV2.confirm({
    window: { title: game.i18n.localize("MAGNUSARCHIVES.Genre.Remove") },
    content: `<div class="magnusarchives magnusarchives-dialog"><p>${game.i18n.localize("MAGNUSARCHIVES.Genre.RemoveConfirm")}</p></div>`,
    yes: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Remove") },
    no: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Cancel") }
  }))
    try {
      await game.magnusarchives.services.genres.remove(n), ui.notifications.info(game.i18n.localize("MAGNUSARCHIVES.Genre.Removed"));
    } catch (t) {
      _i(t);
    }
}
async function _d(n, e) {
  try {
    const t = await game.magnusarchives.services.genres.active(n);
    if (!t) throw new q("genre-required", "Attach a Genre first.");
    const i = n.system.advancement.pendingGenreChoices.find((o) => o.id === e);
    if (!i) throw new q("choice-missing", "Choice not found.");
    const a = game.magnusarchives.services.genres.eligibleEntries(n, t, i);
    if (!a.length) throw new q("entry-ineligible", "No eligible Genre Ability is available.");
    const s = await foundry.applications.api.DialogV2.input({
      window: { title: game.i18n.localize("MAGNUSARCHIVES.Genre.ChooseAbility") },
      content: `<div class="magnusarchives-dialog-fields"><p><strong>${xe(t.name)}</strong></p><label>${game.i18n.localize("MAGNUSARCHIVES.Genre.Ability")}<select name="entryId">${a.map((o) => `<option value="${xe(o.id)}">${xe(o.snapshot.name)} (${game.i18n.localize("MAGNUSARCHIVES.Focus.Tier")} ${o.minimumTier})</option>`).join("")}</select></label></div>`,
      ok: { label: game.i18n.localize("MAGNUSARCHIVES.Genre.Acquire") }
    });
    if (!s) return;
    await game.magnusarchives.services.genres.acquire(
      n,
      i.id,
      String(s.entryId ?? ""),
      Vt
    ), ui.notifications.info(game.i18n.localize("MAGNUSARCHIVES.Genre.AbilityAcquired"));
  } catch (t) {
    _i(t);
  }
}
async function Kd(n) {
  try {
    const e = await game.magnusarchives.services.genres.active(n);
    if (!e) throw new q("genre-required", "Attach a Genre first.");
    const t = game.magnusarchives.services.genres.manualCatalog(n, e);
    if (!t.length) {
      ui.notifications.warn(game.i18n.localize("MAGNUSARCHIVES.Genre.NoCatalogAbilities"));
      return;
    }
    const i = `<div class="magnusarchives genre-ability-browser">
      <p class="genre-browser-source"><strong>${xe(e.name)}</strong></p>
      <div class="genre-browser-list">${t.map((u, d) => `
        <label class="genre-browser-entry${u.owned ? " is-owned" : ""}${u.normallyAvailable ? "" : " is-future"}">
          <input type="radio" name="entryId" value="${xe(u.id)}"${d === 0 ? " checked" : ""}>
          <span><strong>${xe(u.name)}</strong><small>${game.i18n.localize("MAGNUSARCHIVES.Genre.MinimumTier")} ${u.minimumTier}</small></span>
          <em>${game.i18n.localize(u.owned ? "MAGNUSARCHIVES.Genre.Browser.Owned" : u.normallyAvailable ? "MAGNUSARCHIVES.Genre.Browser.Available" : "MAGNUSARCHIVES.Genre.Browser.HigherTier")}</em>
        </label>`).join("")}</div>
      <p class="hint">${game.i18n.localize("MAGNUSARCHIVES.Genre.Browser.GuidanceOnly")}</p>
    </div>`, a = await foundry.applications.api.DialogV2.input({
      window: { title: game.i18n.localize("MAGNUSARCHIVES.Genre.AddAbilities") },
      content: i,
      ok: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Confirm") }
    });
    if (!a) return;
    const s = String(a.entryId ?? ""), o = t.find((u) => u.id === s);
    if (!o) return;
    if (!o.owned) {
      await game.magnusarchives.services.genres.acquireManual(
        n,
        s,
        Vt
      ), ui.notifications.info(game.i18n.localize("MAGNUSARCHIVES.Genre.AbilityAcquired"));
      return;
    }
    if (!await foundry.applications.api.DialogV2.confirm({
      window: { title: game.i18n.localize("MAGNUSARCHIVES.Genre.Browser.Undo") },
      content: `<div class="magnusarchives magnusarchives-dialog"><p>${game.i18n.format("MAGNUSARCHIVES.Genre.Browser.UndoConfirm", { name: xe(o.name) })}</p></div>`,
      yes: { label: game.i18n.localize("MAGNUSARCHIVES.Genre.Browser.Undo") },
      no: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Cancel") }
    })) return;
    const l = !!await foundry.applications.api.DialogV2.confirm({
      window: { title: game.i18n.localize("MAGNUSARCHIVES.Genre.Browser.DeleteTitle") },
      content: `<div class="magnusarchives magnusarchives-dialog"><p>${game.i18n.localize("MAGNUSARCHIVES.Genre.Browser.DeletePrompt")}</p></div>`,
      yes: { label: game.i18n.localize("MAGNUSARCHIVES.Genre.Browser.DeleteAbility") },
      no: { label: game.i18n.localize("MAGNUSARCHIVES.Genre.Browser.KeepAbility") }
    });
    await game.magnusarchives.services.genres.undoManual(n, s, l), ui.notifications.info(game.i18n.localize("MAGNUSARCHIVES.Genre.Browser.UndoCompleted"));
  } catch (e) {
    _i(e);
  }
}
function _t(n) {
  return n.replace(/[&<>"']/g, (e) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[e]);
}
function Xd(n, e, t) {
  return n.includes(e) ? n.filter((i) => i !== e) : n.length >= t ? [...n] : [...n, e];
}
function Yd() {
  let n = !1;
  return () => n ? !1 : (n = !0, !0);
}
function Jd(n, e) {
  return n.map((t, i) => `<button type="button" class="package-choice-option"${e ? ` data-action="package-choice-${i}"` : ""} data-package-choice-option data-option-id="${_t(t.id)}" aria-pressed="false"><i class="fa-solid fa-check package-choice-check" aria-hidden="true"></i><span>${_t(t.label)}</span></button>`).join("");
}
async function Ki(n) {
  const e = n.options.filter((l, u, d) => l.id && d.findIndex((p) => p.id === l.id) === u);
  if (!Number.isInteger(n.choose) || n.choose < 1 || n.choose > e.length) return null;
  const t = n.choose === 1, i = Yd();
  let a = [];
  const s = `<div class="magnusarchives magnusarchives-dialog package-choice-dialog ${t ? "package-choice-single" : "package-choice-multiple"}" data-package-choice-required="${n.choose}">
    <header class="magnusarchives-dialog-heading package-choice-heading"><strong>${_t(n.title)}</strong></header>
    <p class="magnusarchives-dialog-help package-choice-prompt">${_t(n.prompt)}</p>
    <div class="package-choice-options" role="group" aria-label="${_t(n.ariaLabel)}">${Jd(e, t)}</div>
    ${t ? "" : `<div class="package-choice-selection-status" aria-live="polite"><span data-package-choice-count>0 / ${n.choose} ${game.i18n.localize("MAGNUSARCHIVES.Packages.Selected")}</span></div>`}
  </div>`, o = t ? e.map((l, u) => ({
    action: `package-choice-${u}`,
    label: l.label,
    callback: () => i() ? [l.id] : []
  })) : [{
    action: "confirm-package-choice",
    label: game.i18n.localize("MAGNUSARCHIVES.Actions.Confirm"),
    icon: "fa-solid fa-check",
    disabled: !0,
    callback: () => i() ? [...a] : []
  }], r = await foundry.applications.api.DialogV2.wait({
    window: { title: n.title },
    position: { width: 430 },
    content: s,
    buttons: o,
    close: () => null,
    render: t ? void 0 : (l, u) => {
      const d = [...u.element.querySelectorAll("button[data-package-choice-option]")], p = u.element.querySelector('button[data-action="confirm-package-choice"]'), y = u.element.querySelector("[data-package-choice-count]"), m = () => {
        for (const h of d) {
          const f = a.includes(h.dataset.optionId ?? "");
          h.classList.toggle("is-selected", f), h.setAttribute("aria-pressed", String(f));
        }
        p && (p.disabled = a.length !== n.choose), y && (y.textContent = game.i18n.format("MAGNUSARCHIVES.Packages.SelectionCount", {
          selected: a.length,
          required: n.choose
        }));
      };
      for (const h of d)
        h.addEventListener("click", () => {
          a = Xd(a, h.dataset.optionId ?? "", n.choose), m();
        });
      m();
    }
  });
  return Array.isArray(r) && r.length === n.choose ? r : null;
}
const Qd = "magnusarchives.descriptors";
function Zd(n) {
  return structuredClone(n);
}
function eu(n) {
  const e = n.toObject?.() ?? {};
  return {
    name: String(e.name ?? n.name),
    ...String(e.img ?? n.img ?? "") ? { img: String(e.img ?? n.img) } : {},
    system: Zd(e.system ?? n.system)
  };
}
function tu(n, e) {
  const t = n.name.toLocaleLowerCase(), i = e.name.toLocaleLowerCase();
  return t < i ? -1 : t > i ? 1 : n.uuid < e.uuid ? -1 : n.uuid > e.uuid ? 1 : 0;
}
function iu(n, e) {
  const t = /* @__PURE__ */ new Map();
  for (const a of e)
    a.type !== "descriptor" || !a.uuid || t.has(a.uuid) || t.set(a.uuid, a);
  const i = [...t.values()].sort(tu).map((a) => ({
    id: a.uuid,
    descriptorUuid: a.uuid,
    snapshot: eu(a)
  }));
  return n.map((a) => (a.sourceMode ?? "fixed") !== "catalog" ? a : {
    ...a,
    options: a.catalogItemType === "descriptor" ? i : []
  });
}
async function nu() {
  const n = game, e = n.packs?.get(Qd), t = e ? await e.getDocuments() : [], i = [...n.items].filter((a) => a.type === "descriptor");
  return [...t, ...i];
}
async function au(n) {
  return n.some((e) => (e.sourceMode ?? "fixed") === "catalog") ? iu(n, await nu()) : [...n];
}
function Gt(n) {
  return n.replace(/[&<>"']/g, (e) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[e]);
}
function Xi(n) {
  return [...n.items].filter((e) => e.type === "characterType" || e.type === "descriptor" || e.type === "species");
}
async function Sa(n) {
  const e = [...game.items].filter((i) => i.type === n).sort((i, a) => i.name.localeCompare(a.name));
  if (!e.length)
    return ui.notifications.warn(game.i18n.localize(`MAGNUSARCHIVES.Packages.NoWorld${n === "characterType" ? "Types" : n === "descriptor" ? "Descriptors" : "Species"}`)), null;
  const t = await foundry.applications.api.DialogV2.input({
    window: { title: game.i18n.localize(n === "characterType" ? "MAGNUSARCHIVES.Packages.AddType" : n === "descriptor" ? "MAGNUSARCHIVES.Packages.AddDescriptor" : "MAGNUSARCHIVES.Packages.AddSpecies") },
    content: `<div class="magnusarchives-dialog-fields"><label>${game.i18n.localize("MAGNUSARCHIVES.Packages.Source")}
      <select name="uuid">${e.map((i) => `<option value="${Gt(i.uuid)}">${Gt(i.name)}</option>`).join("")}</select>
    </label></div>`,
    ok: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Add") }
  });
  return t ? await fromUuid(String(t.uuid ?? "")) : null;
}
async function Aa(n) {
  const e = await foundry.applications.api.DialogV2.input({
    window: { title: game.i18n.localize("MAGNUSARCHIVES.Packages.Remove") },
    content: `<div class="magnusarchives-dialog-fields"><p>${game.i18n.format("MAGNUSARCHIVES.Packages.RemoveConfirm", { name: Gt(n) })}</p>
      <label>${game.i18n.localize("MAGNUSARCHIVES.Packages.GrantedItems")}
        <select name="mode"><option value="delete">${game.i18n.localize("MAGNUSARCHIVES.Packages.RemoveWithGrants")}</option><option value="keep">${game.i18n.localize("MAGNUSARCHIVES.Packages.KeepGrants")}</option></select>
      </label></div>`,
    ok: { label: game.i18n.localize("MAGNUSARCHIVES.Packages.Remove") }
  });
  return e && (e.mode === "delete" || e.mode === "keep") ? e.mode : null;
}
function Yi(n) {
  console.error(n), ui.notifications.error(n instanceof Error ? n.message : String(n));
}
function ba(n) {
  return n.map((e) => ({
    id: e,
    label: game.i18n.localize(`MAGNUSARCHIVES.Pools.${e[0].toUpperCase()}${e.slice(1)}`)
  }));
}
async function Qo(n) {
  const t = (await Ki({
    title: n,
    prompt: game.i18n.format("MAGNUSARCHIVES.Packages.ChooseOne", {
      label: game.i18n.localize("MAGNUSARCHIVES.Packages.EdgeChoice")
    }),
    ariaLabel: game.i18n.localize("MAGNUSARCHIVES.Packages.EdgeChoice"),
    choose: 1,
    options: ba(k)
  }))?.[0];
  return k.includes(t) ? t : null;
}
async function su(n) {
  const t = (await Ki({
    title: n,
    prompt: game.i18n.localize("MAGNUSARCHIVES.Packages.SuperheroicsPoolPrompt"),
    ariaLabel: game.i18n.localize("MAGNUSARCHIVES.Packages.SuperheroicsPool"),
    choose: 1,
    options: ba(k)
  }))?.[0];
  return k.includes(t) ? t : null;
}
async function Pn(n, e) {
  const t = e ?? await Sa("characterType");
  if (!t) return !1;
  const i = Xi(n).find((y) => y.type === "characterType");
  let a, s;
  if (i && (!await foundry.applications.api.DialogV2.confirm({
    window: { title: game.i18n.localize("MAGNUSARCHIVES.Packages.ReplaceType") },
    content: `<div class="magnusarchives magnusarchives-dialog"><p>${game.i18n.format("MAGNUSARCHIVES.Packages.ReplaceTypeConfirm", { name: Gt(i.name) })}</p></div>`,
    yes: { label: game.i18n.localize("MAGNUSARCHIVES.Packages.Replace") },
    no: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Cancel") }
  }) || (a = i.id, s = await Aa(i.name) ?? void 0, !s)))
    return !1;
  const o = t.system;
  let r = !1, l;
  if (o.edgeGrant.mode === "choice" && (l = await Qo(t.name) ?? void 0, !l))
    return !1;
  let u;
  if (o.genre === "superhero" && o.superhero?.superheroics?.enabled && (u = await su(t.name) ?? void 0, !u))
    return !1;
  const d = await at(t.name, o.choiceGroups ?? [], game.i18n.localize("MAGNUSARCHIVES.Packages.SkillChoice"));
  if (d === null) return !1;
  const p = await at(t.name, o.abilityChoiceGroups ?? [], game.i18n.localize("MAGNUSARCHIVES.Species.AbilityChoice"));
  if (p === null) return !1;
  try {
    await game.magnusarchives.services.characterPackages.attachType(n, t, {
      conflictResolver: Vt,
      skillChoices: d,
      abilityChoices: p,
      ...l ? { edgePool: l } : {},
      ...u ? { superheroicsPool: u } : {},
      ...a ? { replaceItemId: a } : {},
      ...s ? { replaceGrantedItemsMode: s } : {}
    }), ui.notifications.info(game.i18n.localize("MAGNUSARCHIVES.Packages.TypeAttached")), r = !0;
    const y = n;
    if (!y.system.genre.sourceUuid) {
      const m = [...game.items].filter((f) => f.type === "genre"), h = await Jo(
        o,
        m,
        async (f) => await fromUuid(f)
      );
      h && await foundry.applications.api.DialogV2.confirm({
        window: { title: game.i18n.localize("MAGNUSARCHIVES.Genre.TypeSuggestion") },
        content: `<div class="magnusarchives magnusarchives-dialog"><p>${game.i18n.format("MAGNUSARCHIVES.Genre.TypeSuggestionPrompt", { genre: Gt(h.name) })}</p></div>`,
        yes: { label: game.i18n.localize("MAGNUSARCHIVES.Genre.AttachSuggestion") },
        no: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Cancel") }
      }) && await zn(y, h, "typeSuggestion");
    }
  } catch (y) {
    y instanceof We || Yi(y);
  }
  return r;
}
async function xn(n, e, t) {
  const i = e ?? await Sa("descriptor");
  if (!i) return !1;
  const a = Xi(n).some((u) => u.type === "descriptor" && u.system.instance.role === "primary"), s = t ? { role: t } : await foundry.applications.api.DialogV2.input({
    window: { title: i.name },
    content: `<div class="magnusarchives-dialog-fields"><label>${game.i18n.localize("MAGNUSARCHIVES.Packages.DescriptorRole")}
      <select name="role">${a ? "" : `<option value="primary">${game.i18n.localize("MAGNUSARCHIVES.Packages.Role.primary")}</option>`}<option value="additional">${game.i18n.localize("MAGNUSARCHIVES.Packages.Role.additional")}</option><option value="custom">${game.i18n.localize("MAGNUSARCHIVES.Packages.Role.custom")}</option></select>
    </label></div>`,
    ok: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Next") }
  });
  if (!s) return !1;
  const o = i.system, r = await Zo(i.name, o.poolBonusChoiceGroups ?? []);
  if (r === null) return !1;
  const l = await at(
    i.name,
    o.choiceGroups ?? [],
    game.i18n.localize("MAGNUSARCHIVES.Packages.SkillChoice")
  );
  if (l === null) return !1;
  try {
    return await game.magnusarchives.services.characterPackages.attachDescriptor(n, i, {
      role: String(s.role),
      poolChoices: r,
      skillChoices: l,
      conflictResolver: Vt
    }), ui.notifications.info(game.i18n.localize("MAGNUSARCHIVES.Packages.DescriptorAttached")), !0;
  } catch (u) {
    u instanceof We || Yi(u);
  }
  return !1;
}
async function Zo(n, e) {
  const t = {};
  for (const i of e) {
    const a = [...new Set(i.pools)].filter((o) => k.includes(o));
    if (i.choose < 1 || i.choose > a.length)
      return ui.notifications.error(game.i18n.localize("MAGNUSARCHIVES.Packages.InvalidPoolBonusChoice")), null;
    const s = await Ki({
      title: n,
      prompt: i.choose === 1 ? game.i18n.localize("MAGNUSARCHIVES.Packages.ChooseOnePool") : game.i18n.format("MAGNUSARCHIVES.Packages.ChooseManyPools", { count: i.choose }),
      ariaLabel: game.i18n.localize("MAGNUSARCHIVES.Packages.AllowedPools"),
      choose: i.choose,
      options: ba(a)
    });
    if (!s) return null;
    t[i.id] = s.filter((o) => k.includes(o));
  }
  return t;
}
async function at(n, e, t) {
  const i = {};
  for (const a of e) {
    const s = a.rank ? game.i18n.format("MAGNUSARCHIVES.Packages.ChooseSkills", {
      count: a.choose,
      rank: game.i18n.localize(`MAGNUSARCHIVES.Skill.Ranks.${a.rank}`)
    }) : game.i18n.format(
      a.choose === 1 ? "MAGNUSARCHIVES.Packages.ChooseOne" : "MAGNUSARCHIVES.Packages.ChooseMany",
      { count: a.choose, label: t }
    ), o = await Ki({
      title: n,
      prompt: s,
      ariaLabel: t,
      choose: a.choose,
      options: a.options.map((r) => ({
        id: r.id,
        label: r.snapshot?.name || r.customName || r.id
      }))
    });
    if (!o) return null;
    i[a.id] = o;
  }
  return i;
}
async function as(n, e) {
  const t = e ?? await Sa("species");
  if (!t) return;
  const i = Xi(n).find((f) => f.type === "species");
  let a, s;
  if (i && (!await foundry.applications.api.DialogV2.confirm({
    window: { title: game.i18n.localize("MAGNUSARCHIVES.Species.Replace") },
    content: `<div class="magnusarchives magnusarchives-dialog"><p>${game.i18n.format("MAGNUSARCHIVES.Species.ReplaceConfirm", { name: Gt(i.name) })}</p></div>`,
    yes: { label: game.i18n.localize("MAGNUSARCHIVES.Packages.Replace") },
    no: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Cancel") }
  }) || (a = i.id, s = await Aa(i.name) ?? void 0, !s)))
    return;
  const o = t.system;
  let r;
  if (o.edgeGrant.mode === "choice" && (r = await Qo(t.name) ?? void 0, !r))
    return;
  const l = await at(t.name, o.choiceGroups ?? [], game.i18n.localize("MAGNUSARCHIVES.Packages.SkillChoice"));
  if (l === null) return;
  const u = await at(t.name, o.abilityChoiceGroups ?? [], game.i18n.localize("MAGNUSARCHIVES.Species.AbilityChoice"));
  if (u === null) return;
  const d = await au(o.descriptorChoiceGroups ?? []), p = await at(
    t.name,
    d,
    game.i18n.localize("MAGNUSARCHIVES.Species.DescriptorChoice")
  );
  if (p === null) return;
  const y = d.flatMap((f) => f.options.filter((A) => p[f.id]?.includes(A.id)).map((A) => ({ ...A, id: `${f.id}:${A.id}` }))), m = {}, h = {};
  for (const f of [...o.descriptorGrants ?? [], ...y]) {
    const A = f.descriptorUuid ? await fromUuid(f.descriptorUuid) : null, v = A?.system ?? f.snapshot.system, E = await Zo(
      f.snapshot.name || A?.name || t.name,
      v.poolBonusChoiceGroups ?? []
    );
    if (E === null) return;
    const H = await at(f.snapshot.name || A?.name || t.name, v.choiceGroups ?? [], game.i18n.localize("MAGNUSARCHIVES.Packages.SkillChoice"));
    if (H === null) return;
    m[f.id] = H, h[f.id] = E;
  }
  try {
    await game.magnusarchives.services.characterPackages.attachSpecies(n, t, {
      ...r ? { edgePool: r } : {},
      skillChoices: l,
      abilityChoices: u,
      descriptorChoices: p,
      resolvedDescriptorChoiceGroups: d,
      descriptorSkillChoices: m,
      descriptorPoolChoices: h,
      conflictResolver: Vt,
      ...a ? { replaceItemId: a } : {},
      ...s ? { replaceGrantedItemsMode: s } : {}
    }), ui.notifications.info(game.i18n.localize("MAGNUSARCHIVES.Species.Attached"));
  } catch (f) {
    f instanceof We || Yi(f);
  }
}
async function ou(n, e) {
  const t = Xi(n).find((a) => a.id === e);
  if (!t) return;
  const i = await Aa(t.name);
  if (i)
    try {
      await game.magnusarchives.services.characterPackages.remove(n, e, i), ui.notifications.info(game.i18n.localize("MAGNUSARCHIVES.Packages.Removed"));
    } catch (a) {
      Yi(a);
    }
}
const er = ["might", "speed", "intellect"], ru = 8, Ni = "custom";
function gn(n, e) {
  return Number(n[e] ?? 0);
}
function ei(n, e) {
  return String(n[e] ?? "").trim();
}
function se(n) {
  return n.replace(/[&<>"']/g, (e) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[e]);
}
function tr(n) {
  return game.i18n.localize(`MAGNUSARCHIVES.Pools.${n[0].toUpperCase()}${n.slice(1)}`);
}
async function Ji(n, e, t, i = game.i18n.localize("MAGNUSARCHIVES.Actions.Next")) {
  return foundry.applications.api.DialogV2.input({
    window: { title: n },
    content: `<div class="magnusarchives-dialog-fields">${e}</div>`,
    rejectClose: !1,
    render: t ? (a, s) => t(s.element) : void 0,
    ok: { label: i }
  });
}
async function lu(n, e) {
  const t = `${U}.${n}`, i = [];
  try {
    const a = await game.packs.get(t)?.getIndex({ fields: ["type"] });
    for (const s of a ?? [])
      s.type && s.type !== e || i.push({ uuid: s.uuid ?? `Compendium.${t}.Item.${s._id}`, name: s.name });
  } catch (a) {
    console.warn(`magnusarchives | Could not read Compendium ${t}`, a);
  }
  if (!i.length)
    for (const a of game.items)
      a.type === e && i.push({ uuid: a.uuid, name: a.name });
  return i.sort((a, s) => a.name.localeCompare(s.name));
}
function cu(n) {
  return n.map((e) => `<option value="${se(e.uuid)}">${se(e.name)}</option>`).join("");
}
async function wa(n, e, t, i, a = "") {
  const s = await lu(t, i);
  if (!s.length)
    return ui.notifications.warn(game.i18n.format("MAGNUSARCHIVES.Creation.NoneAvailable", { label: e })), null;
  const o = await Ji(n, `<label>${e}<select name="uuid">${cu(s)}</select></label>${a}`);
  return o ? { uuid: ei(o, "uuid"), data: o } : null;
}
function ir(n) {
  return [...n.items].find((e) => e.type === "descriptor" && e.system.instance?.role === "primary")?.name ?? null;
}
function nr(n) {
  return [...n.items].find((e) => e.type === "characterType")?.name ?? null;
}
function du(n) {
  return n.system.focusProgress.some((e) => e.provenance === "creation");
}
async function uu(n) {
  const e = n.system.focusProgress.find((i) => i.provenance === "creation");
  return e ? (await fromUuid(e.focusUuid))?.name ?? "" : "";
}
async function mu(n) {
  const e = (o) => `<label>${game.i18n.localize("MAGNUSARCHIVES.Creation.DescriptorWord")}
      <input name="descriptorLabel" type="text" placeholder="${se(o)}" value="${se(n.system.identity?.descriptorLabel ?? "")}">
    </label>
    <p class="hint">${game.i18n.localize("MAGNUSARCHIVES.Creation.DescriptorWordHint")}</p>`, t = ir(n);
  if (t) {
    const o = await Ji(
      game.i18n.localize("MAGNUSARCHIVES.Creation.StepDescriptor"),
      `<p>${game.i18n.format("MAGNUSARCHIVES.Creation.AlreadyChosen", { name: se(t) })}</p>${e(t)}`
    );
    return o ? ei(o, "descriptorLabel") : null;
  }
  const i = await wa(
    game.i18n.localize("MAGNUSARCHIVES.Creation.StepDescriptor"),
    game.i18n.localize("MAGNUSARCHIVES.Creation.Descriptor"),
    "descriptors",
    "descriptor",
    `<p>${game.i18n.localize("MAGNUSARCHIVES.Creation.DescriptorPrompt")}</p>${e("")}`
  );
  if (!i) return null;
  const a = await fromUuid(i.uuid);
  return a && await xn(n, a, "primary") ? ei(i.data, "descriptorLabel") : null;
}
async function pu(n) {
  if (nr(n)) return !0;
  const e = await wa(
    game.i18n.localize("MAGNUSARCHIVES.Creation.StepType"),
    game.i18n.localize("MAGNUSARCHIVES.Creation.Type"),
    "types",
    "characterType"
  );
  if (!e) return !1;
  const t = await fromUuid(e.uuid);
  return t ? Pn(n, t) : !1;
}
async function fu(n) {
  if (du(n)) return !0;
  const e = await wa(
    game.i18n.localize("MAGNUSARCHIVES.Creation.StepFocus"),
    game.i18n.localize("MAGNUSARCHIVES.Creation.Focus"),
    "foci",
    "focus"
  );
  if (!e) return !1;
  const t = await fromUuid(e.uuid);
  if (!t) return !1;
  try {
    return await game.magnusarchives.services.focusAssociations.attach(
      n,
      t,
      "creation"
    ), !0;
  } catch (i) {
    const a = i instanceof ve ? `MAGNUSARCHIVES.Focus.Association.Errors.${i.code}` : "MAGNUSARCHIVES.Focus.Errors.Unexpected";
    return i instanceof ve || console.error(i), ui.notifications.error(game.i18n.localize(a)), !1;
  }
}
function gu(n) {
  const e = [...n.querySelectorAll(
    'input[name="might"], input[name="speed"], input[name="intellect"]'
  )], t = n.querySelector("[data-core-points-remaining]"), i = n.querySelector('button[data-action="ok"]'), a = () => {
    const s = e.map((l) => Number(l.value)), o = s.every((l) => Number.isInteger(l) && l >= 0 && l <= 6), r = 6 - s.reduce((l, u) => l + u, 0);
    t && (t.value = String(r)), i && (i.disabled = !o || r !== 0);
  };
  e.forEach((s) => s.addEventListener("input", a)), a();
}
function ar(n, e) {
  const t = n.system.derived.pools[e].max - n.system.stats[e].baseMax;
  return ru + t;
}
async function hu(n) {
  const e = er.map((a) => `<label>${tr(a)} ${ar(n, a)} + <input name="${a}" type="number" min="0" max="6" value="0"></label>`).join(""), t = await Ji(
    game.i18n.localize("MAGNUSARCHIVES.Creation.StepPools"),
    `<p>${game.i18n.localize("MAGNUSARCHIVES.Creation.PoolsPrompt")}</p>${e}
     <p>${game.i18n.localize("MAGNUSARCHIVES.Creation.PointsRemaining")}: <output data-core-points-remaining>6</output> / 6</p>`,
    gu
  );
  if (!t) return null;
  const i = { might: gn(t, "might"), speed: gn(t, "speed"), intellect: gn(t, "intellect") };
  return Object.values(i).reduce((a, s) => a + s, 0) !== 6 || Object.values(i).some((a) => !Number.isInteger(a) || a < 0) ? (va(new Pe("invalid-pools", "Invalid Pool allocation.")), null) : i;
}
function sr(n) {
  const e = Yo(n);
  if (!e) return "";
  const t = (i, a) => `<li><strong>${game.i18n.localize(`MAGNUSARCHIVES.Arc.Beat.${i}`)}:</strong> ${se(a)}</li>`;
  return `<p>${se(e.summary)}</p><ul>
    ${t("opening", e.beats.opening)}
    ${e.beats.steps.map((i) => t("step", i)).join("")}
    ${t("climax", e.beats.climax)}
    ${t("resolution", e.beats.resolution)}
  </ul>`;
}
function yu(n) {
  const e = n.querySelector('select[name="arcKey"]'), t = n.querySelector("[data-arc-details]"), i = n.querySelector("[data-arc-custom]");
  if (!e) return;
  const a = () => {
    t && (t.innerHTML = sr(e.value)), i && (i.hidden = e.value !== Ni);
  };
  e.addEventListener("change", a), a();
}
async function or(n, e) {
  const t = n?.key || (n?.name ? Ni : ""), i = (r, l) => `<option value="${se(r)}"${r === t ? " selected" : ""}>${se(l)}</option>`, a = await Ji(
    game.i18n.localize("MAGNUSARCHIVES.Creation.StepArc"),
    `<p>${game.i18n.localize("MAGNUSARCHIVES.Creation.ArcPrompt")}</p>
     <label>${game.i18n.localize("MAGNUSARCHIVES.Arc.Label")}<select name="arcKey">
       ${i("", game.i18n.localize("MAGNUSARCHIVES.Creation.NoArc"))}
       ${Xo.map((r) => i(r.key, r.name)).join("")}
       ${i(Ni, game.i18n.localize("MAGNUSARCHIVES.Creation.CustomArc"))}
     </select></label>
     <label data-arc-custom hidden>${game.i18n.localize("MAGNUSARCHIVES.Creation.CustomArcName")}
       <input name="arcName" type="text" value="${se(n?.key ? "" : n?.name ?? "")}">
     </label>
     <div data-arc-details></div>`,
    yu,
    e
  );
  if (!a) return null;
  const s = ei(a, "arcKey");
  if (!s) return;
  if (s === Ni) {
    const r = ei(a, "arcName");
    return r ? { key: "", name: r } : void 0;
  }
  const o = Yo(s);
  return o ? { key: o.key, name: o.name } : void 0;
}
async function Su(n) {
  const e = n.system.arc, t = await or(e, game.i18n.localize("MAGNUSARCHIVES.Actions.Apply"));
  t === null || !((t?.key ?? "") !== (e?.key ?? "") || (t?.name ?? "") !== (e?.name ?? "")) || await n.update({
    "system.arc.key": t?.key ?? "",
    "system.arc.name": t?.name ?? "",
    "system.arc.stage": "none",
    "system.arc.stepsCompleted": 0
  });
}
function va(n) {
  const e = n instanceof Pe ? `MAGNUSARCHIVES.Creation.Errors.${n.code}` : "MAGNUSARCHIVES.Creation.Errors.Unexpected";
  n instanceof Pe || console.error(n), ui.notifications.error(game.i18n.localize(e));
}
async function Au(n) {
  const e = n, t = await mu(e);
  if (t === null || !await pu(e) || !await fu(e)) return;
  const i = await hu(e);
  if (!i) return;
  const a = await or(e.system.arc);
  if (a === null) return;
  const s = t || ir(e) || "", o = game.i18n.format("MAGNUSARCHIVES.Creation.ReviewIdentity", {
    descriptor: se(s),
    type: se(nr(e) ?? ""),
    focus: se(await uu(e))
  }), r = [...e.items].filter((d) => d.type === "skill");
  if (!await foundry.applications.api.DialogV2.confirm({
    window: { title: game.i18n.localize("MAGNUSARCHIVES.Creation.StepReview") },
    content: `<div class="magnusarchives-dialog-fields">
      <p><strong>${o}</strong></p>
      <p>${er.map((d) => `${tr(d)} ${ar(e, d) + i[d]}`).join(" · ")}</p>
      ${r.length ? `<ul>${r.map((d) => `<li>${se(d.name)} — ${game.i18n.localize(`MAGNUSARCHIVES.Skill.Ranks.${String(d.system.rank)}`)}</li>`).join("")}</ul>` : ""}
      <p>${game.i18n.localize("MAGNUSARCHIVES.Arc.Label")}: ${se(a?.name ?? game.i18n.localize("MAGNUSARCHIVES.Creation.NoArc"))}</p>
    </div>`,
    yes: { label: game.i18n.localize("MAGNUSARCHIVES.Creation.Finalize") },
    no: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Cancel") }
  })) return;
  const u = { pools: i, descriptorLabel: t, ...a ? { arc: a } : {} };
  try {
    await game.magnusarchives.services.characterInitialization.setup(n, u), await n.sheet?.render({ force: !0 }), ui.notifications.info(game.i18n.localize("MAGNUSARCHIVES.Creation.Completed"));
  } catch (d) {
    va(d);
  }
}
async function ss(n, e) {
  try {
    await game.magnusarchives.services.characterInitialization.markInitialized(n, e), await n.sheet?.render({ force: !0 }), ui.notifications.info(game.i18n.localize(
      e === "skipped" ? "MAGNUSARCHIVES.Creation.Skipped" : "MAGNUSARCHIVES.Creation.Marked"
    ));
  } catch (t) {
    va(t);
  }
}
function bi(n, e) {
  return e.map((t) => n.system.graph.nodes.find((i) => i.id === t)?.abilitySnapshot.name || t).join(", ");
}
async function bu(n, e, t) {
  return game.magnusarchives.services.focusAcquisition.hasEmbeddedAbility(n, e.uuid, t) ? !!await foundry.applications.api.DialogV2.confirm({
    window: { title: game.i18n.localize("MAGNUSARCHIVES.Focus.UndoDeleteTitle") },
    content: `<div class="magnusarchives magnusarchives-dialog"><p>${game.i18n.localize("MAGNUSARCHIVES.Focus.UndoDeletePrompt")}</p></div>`,
    yes: { label: game.i18n.localize("MAGNUSARCHIVES.Focus.UndoDeleteAbility") },
    no: { label: game.i18n.localize("MAGNUSARCHIVES.Focus.UndoKeepAbility") }
  }) : !1;
}
async function os(n, e, t, i = !1) {
  const a = e.system.graph.nodes.find((r) => r.id === t);
  if (!a || !await foundry.applications.api.DialogV2.confirm({
    window: { title: game.i18n.localize("MAGNUSARCHIVES.Focus.UndoAcquisition") },
    content: `<div class="magnusarchives magnusarchives-dialog"><p>${game.i18n.format("MAGNUSARCHIVES.Focus.UndoConfirm", { name: a.abilitySnapshot.name })}</p></div>`,
    yes: { label: game.i18n.localize("MAGNUSARCHIVES.Focus.UndoAcquisition") },
    no: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Cancel") }
  })) return;
  const o = await bu(n, e, t);
  try {
    const r = await game.magnusarchives.services.focusAcquisition.undo(
      n,
      e,
      t,
      { deleteAbility: o, force: i }
    );
    ui.notifications.info(game.i18n.localize(r.choiceRestored ? "MAGNUSARCHIVES.Focus.UndoChoiceRestored" : "MAGNUSARCHIVES.Focus.UndoCompleted")), r.invalidOwnedNodeIds.length > 0 && ui.notifications.warn(game.i18n.format("MAGNUSARCHIVES.Focus.ProgressionEdit.InvalidWarning", {
      nodes: bi(e, r.invalidOwnedNodeIds)
    }));
  } catch (r) {
    if (r instanceof ue && r.code === "undo-dependent-nodes") {
      if (!game.user.isGM) {
        ui.notifications.error(game.i18n.format("MAGNUSARCHIVES.Focus.Errors.UndoDependencies", {
          nodes: bi(e, r.dependentNodeIds)
        }));
        return;
      }
      if (await foundry.applications.api.DialogV2.confirm({
        window: { title: game.i18n.localize("MAGNUSARCHIVES.Focus.ProgressionEdit.ForceUndo") },
        content: `<div class="magnusarchives magnusarchives-dialog"><p>${game.i18n.format("MAGNUSARCHIVES.Focus.ProgressionEdit.ForceUndoWarning", {
          nodes: bi(e, r.dependentNodeIds)
        })}</p></div>`,
        yes: { label: game.i18n.localize("MAGNUSARCHIVES.Focus.ProgressionEdit.ForceUndo") },
        no: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Cancel") }
      })) {
        const u = await game.magnusarchives.services.focusAcquisition.undo(
          n,
          e,
          t,
          { deleteAbility: o, force: !0 }
        );
        ui.notifications.warn(game.i18n.format("MAGNUSARCHIVES.Focus.ProgressionEdit.InvalidWarning", {
          nodes: bi(e, u.invalidOwnedNodeIds)
        }));
      }
      return;
    }
    console.error(r), ui.notifications.error(game.i18n.localize("MAGNUSARCHIVES.Focus.Errors.Unexpected"));
  }
}
async function wu(n, e, t) {
  if (!game.user.isGM) return;
  const i = e.system.graph.nodes.find((s) => s.id === t);
  !i || !await foundry.applications.api.DialogV2.confirm({
    window: { title: game.i18n.localize("MAGNUSARCHIVES.Focus.ProgressionEdit.MarkOwned") },
    content: `<div class="magnusarchives magnusarchives-dialog"><p>${game.i18n.format("MAGNUSARCHIVES.Focus.ProgressionEdit.MarkOwnedConfirm", { name: i.abilitySnapshot.name })}</p></div>`,
    yes: { label: game.i18n.localize("MAGNUSARCHIVES.Focus.ProgressionEdit.MarkOwned") },
    no: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Cancel") }
  }) || (await game.magnusarchives.services.focusAcquisition.markOwnedWithGmOverride(n, e, t), ui.notifications.info(game.i18n.localize("MAGNUSARCHIVES.Focus.ProgressionEdit.MarkedOwned")));
}
function rr(n) {
  return [...n.items].filter((e) => e instanceof Item && e.type === "skill").map((e) => e).sort((e, t) => e.name.localeCompare(t.name));
}
function vu() {
  return [...game.user.targets ?? []].flatMap((n) => {
    const e = Do(n);
    if (e) return [e];
    const t = Fo(n);
    return t ? [t] : [];
  });
}
function rs(n, e) {
  const t = Ye(n);
  if (t.length === 1) {
    const a = t[0];
    return `<input type="hidden" name="pool" value="${a}"><div class="roll-dialog-context roll-dialog-fixed-pool"><strong>${game.i18n.localize("MAGNUSARCHIVES.Pools.Pool")}</strong><span>${game.i18n.localize(`MAGNUSARCHIVES.Pools.${a[0].toUpperCase()}${a.slice(1)}`)}</span></div>`;
  }
  if (!e && t.length === 0) return "";
  const i = t.length > 1 ? t : _l;
  return `<label>${game.i18n.localize("MAGNUSARCHIVES.Pools.Pool")}<select name="pool">${i.map((a) => `<option value="${a}">${game.i18n.localize(`MAGNUSARCHIVES.Pools.${a[0].toUpperCase()}${a.slice(1)}`)}</option>`).join("")}</select></label>`;
}
function Cu(n) {
  return [
    `<optgroup label="${game.i18n.localize("MAGNUSARCHIVES.Roll.ManualSkillLevel")}">${ga(0, "manual:")}</optgroup>`,
    `<optgroup label="${game.i18n.localize("MAGNUSARCHIVES.Skill.Title")}">`,
    ...rr(n).map((e) => `<option value="${e.id}">${e.name} — ${game.i18n.localize(`MAGNUSARCHIVES.Skill.Ranks.${e.system.rank}`)}</option>`),
    "</optgroup>"
  ].join("");
}
function Eu(n, e) {
  const t = re(e, "skillId");
  return rr(n).find((i) => i.id === t);
}
function Iu(n) {
  const e = re(n, "skillId");
  return e.startsWith("manual:") ? Number(e.slice(7)) : 0;
}
function ls(n) {
  const e = re(n, "pool");
  return e === "might" || e === "speed" || e === "intellect" ? e : void 0;
}
async function Ru(n, e) {
  if (!game.magnusarchives.services.abilities.canUse(e)) return;
  const t = Oe(), i = t.enabledRuleModuleIds ?? [], a = game.magnusarchives.rules.resolveDifficultyPolicy(t.base, i), s = e.system.targetMode === "none" ? [] : vu(), o = s.filter((f) => f.type === "npc"), r = e.system.roll !== "none", l = e.system.targetMode === "none" ? "" : `<div class="roll-dialog-context"><strong>${game.i18n.localize("MAGNUSARCHIVES.Combat.Targets")}</strong><span>${s.length ? s.map((f) => f.name).join(", ") : game.i18n.localize("MAGNUSARCHIVES.Common.None")}</span></div>`;
  if (!r) {
    const f = await foundry.applications.api.DialogV2.input({
      window: { title: `${game.i18n.localize("MAGNUSARCHIVES.Ability.Use")}: ${e.name}` },
      content: `<div class="magnusarchives magnusarchives-dialog-fields"><p><strong>${e.name}</strong></p>${l}${rs(e, !1)}</div>`,
      rejectClose: !1,
      ok: { label: game.i18n.localize("MAGNUSARCHIVES.Ability.Use") }
    });
    if (!f) return;
    try {
      const A = ls(f), v = await game.magnusarchives.services.abilities.executeNoRoll(n, e, {
        ...A ? { pool: A } : {},
        targets: s,
        enabledRuleModuleIds: i
      });
      await game.magnusarchives.services.abilityChat.publishNoRoll(n, v);
    } catch (A) {
      ui.notifications.error(A instanceof Error ? A.message : String(A));
    }
    return;
  }
  const u = o.length > 0 ? `<div class="roll-dialog-context"><strong>${game.i18n.localize("MAGNUSARCHIVES.Roll.Difficulty")}</strong><span>${game.i18n.localize("MAGNUSARCHIVES.Roll.HiddenValue")}</span></div>` : li(a.difficultyCeiling, !0), d = (f) => {
    const A = Eu(n, f), v = ls(f);
    return {
      ...v ? { pool: v } : {},
      targets: s,
      difficulty: si(f),
      ...A ? { skill: A } : {},
      skillSteps: Iu(f),
      assets: W(f, "assets"),
      paidEffort: W(f, "paidEffort"),
      damageEffort: W(f, "damageEffort"),
      freeDamageEffort: W(f, "freeDamageEffort"),
      freeEffort: W(f, "freeEffort"),
      ...oi(f),
      enabledRuleModuleIds: i
    };
  }, p = (f) => {
    const A = game.magnusarchives.services.abilities.buildRollPlan(n, e, d(f)).requests[0];
    if (!A) throw new Error("Ability preview did not produce a roll request.");
    return A;
  }, y = `
    ${l}
    ${u}
    ${rs(e, !0)}
    <label>${game.i18n.localize("MAGNUSARCHIVES.Roll.SkillLevel")}<select name="skillId">${Cu(n)}</select></label>
    <label>${game.i18n.localize("MAGNUSARCHIVES.Roll.Assets")}<select name="assets">${ye(a.assetLimit)}</select></label>
    <label>${game.i18n.localize("MAGNUSARCHIVES.Roll.EffortToEase")}<select name="paidEffort">${ye(n.system.derived.effort.max)}</select></label>
    ${e.system.roll === "attack" ? `<label>${game.i18n.localize("MAGNUSARCHIVES.Combat.DamageEffort")}<select name="damageEffort">${ye(n.system.derived.effort.max)}</select></label>
    <label>${game.i18n.localize("MAGNUSARCHIVES.Roll.FreeDamageEffort")}<input name="freeDamageEffort" type="number" value="0" min="0" step="1"></label>` : ""}
    <label>${game.i18n.localize("MAGNUSARCHIVES.Roll.FreeEffort")}<input name="freeEffort" type="number" value="0" min="0" step="1"></label>
    ${ri()}`, m = game.magnusarchives.services.combat.policy(i), h = await foundry.applications.api.DialogV2.input({
    window: { title: `${game.i18n.localize("MAGNUSARCHIVES.Ability.Use")}: ${e.name}`, resizable: !0 },
    position: { width: 800 },
    content: ci({
      identity: e.name,
      settings: y,
      ...e.system.roll === "attack" ? { attackSummary: " " } : {}
    }),
    rejectClose: !1,
    ok: { label: game.i18n.localize("MAGNUSARCHIVES.Roll.Roll") },
    render: (f, A) => {
      di(A.element, {
        actor: n,
        policyRequest: t,
        buildRequest: p,
        ...e.system.roll === "attack" ? {
          attackSummary: (v, E) => [
            `<div class="roll-summary-row"><span>${game.i18n.localize("MAGNUSARCHIVES.Combat.BaseDamage")}</span><strong>${e.system.damage}</strong></div>`,
            `<div class="roll-summary-row"><span>${game.i18n.localize("MAGNUSARCHIVES.Roll.PaidDamageEffort")}</span><strong>${E.context.damageEffort ?? 0}</strong></div>`,
            ...(E.context.freeDamageEffort ?? 0) > 0 ? [`<div class="roll-summary-row"><span>${game.i18n.localize("MAGNUSARCHIVES.Roll.FreeDamageEffort")}</span><strong>${E.context.freeDamageEffort}</strong></div>`] : [],
            `<div class="roll-summary-row"><span>${game.i18n.localize("MAGNUSARCHIVES.Roll.TotalDamageEffort")}</span><strong>${E.damageEffortApplied}</strong></div>`,
            `<div class="roll-summary-row"><span>${game.i18n.localize("MAGNUSARCHIVES.Combat.DamagePerEffort")}</span><strong>${m.damageEffortBonus}</strong></div>`,
            ...e.system.damageEffect !== "none" ? [`<div class="roll-summary-row"><span>${game.i18n.localize("MAGNUSARCHIVES.Npc.DamageEffect")}</span><strong>${game.i18n.localize(`MAGNUSARCHIVES.CharacterDamage.${e.system.damageEffect}`)}${e.system.damageEffect === "stress" ? ` (${e.system.stressAmount})` : ""}</strong></div>`] : [],
            ...e.system.range ? [`<div class="roll-summary-row"><span>${game.i18n.localize("MAGNUSARCHIVES.Combat.Range.Label")}</span><strong>${e.system.range}</strong></div>`] : []
          ].join("")
        } : {}
      });
    }
  });
  if (h)
    try {
      let f = await game.magnusarchives.services.abilities.executeRoll(
        n,
        e,
        d(h),
        t
      );
      if (e.system.roll === "attack") {
        const v = await qo(f);
        v && (f = game.magnusarchives.services.abilities.chooseAttackOutcomes(f, v));
      }
      for (const v of f)
        await game.magnusarchives.services.abilityChat.publishRoll(
          n,
          v,
          Li(),
          ji()
        );
      const A = f[0];
      A && await ai().requestFreeFromNaturalResult(n, A.execution.result);
    } catch (f) {
      ui.notifications.error(f instanceof Error ? f.message : String(f));
    }
}
function Nu(n) {
  return game.i18n.localize(`MAGNUSARCHIVES.Pools.${n[0].toUpperCase()}${n.slice(1)}`);
}
function Mu(n) {
  const e = String(n.pool ?? "");
  return e === "might" || e === "speed" || e === "intellect" ? e : null;
}
async function Gu(n, e) {
  const t = Ye(e);
  if (e.system.cost.amount <= 0 || t.length === 0)
    throw new Error(game.i18n.localize("MAGNUSARCHIVES.Ability.Payment.NoCost"));
  let i = t.length === 1 ? t[0] : null;
  if (!i) {
    const o = t.map(
      (l) => game.magnusarchives.services.abilities.previewPayment(n, e, l)
    ).map((l, u) => `
      <label class="ability-payment-choice">
        <input type="radio" name="pool" value="${l.pool}" ${u === 0 ? "checked" : ""}>
        <strong>${Nu(l.pool)}</strong>
        <span>${game.i18n.localize("MAGNUSARCHIVES.Ability.Payment.Current")}: ${l.currentBefore}</span>
        <span>${game.i18n.localize("MAGNUSARCHIVES.Pools.Edge")}: ${l.edge}</span>
        <span>${game.i18n.localize("MAGNUSARCHIVES.Ability.Payment.Pay")}: ${l.costPaid}</span>
      </label>`).join(""), r = await foundry.applications.api.DialogV2.input({
      window: { title: game.i18n.format("MAGNUSARCHIVES.Ability.Payment.Title", { name: e.name }) },
      content: `<div class="magnusarchives magnusarchives-dialog ability-payment-dialog"><p>${game.i18n.localize("MAGNUSARCHIVES.Ability.Cost")}: <strong>${e.system.cost.amount}</strong></p><div class="ability-payment-choices">${o}</div><p class="ability-payment-whole-cost">${game.i18n.localize("MAGNUSARCHIVES.Ability.Payment.WholeCost")}</p></div>`,
      rejectClose: !1,
      ok: { label: game.i18n.localize("MAGNUSARCHIVES.Ability.Payment.Pay") }
    });
    if (!r) return;
    if (i = Mu(r), !i || !t.includes(i)) throw new Error("Invalid Ability payment Pool.");
  }
  const a = await game.magnusarchives.services.abilities.payCost(n, e, i);
  await game.magnusarchives.services.abilityChat.publishPayment(n, a);
}
const Uu = {
  descriptor: { accepts: "descriptor", placeholder: "[DESCRIPTOR]" },
  species: { accepts: "species", placeholder: "[SPECIES]" },
  type: { accepts: "characterType", placeholder: "[TYPE]" },
  focus: { accepts: "focus", placeholder: "[FOCUS]" }
}, ku = {
  "one-action": "MAGNUSARCHIVES.Hud.Recovery.Action",
  "10-minutes": "MAGNUSARCHIVES.Hud.Recovery.TenMinutes",
  "1-hour": "MAGNUSARCHIVES.Hud.Recovery.OneHour",
  "10-hours": "MAGNUSARCHIVES.Hud.Recovery.TenHours"
};
function zt(n, e) {
  const t = Uu[n];
  return {
    kind: n,
    accepts: t.accepts,
    missing: !e,
    displayName: e?.name.toLocaleUpperCase("en-US") ?? t.placeholder,
    name: e?.name ?? t.placeholder,
    ...e?.id ? { id: e.id } : {},
    ...e?.uuid ? { uuid: e.uuid } : {},
    ...e?.role ? { role: e.role } : {},
    ...e?.instanceId ? { instanceId: e.instanceId } : {},
    ...e?.attachedAt !== void 0 ? { attachedAt: e.attachedAt } : {}
  };
}
const cs = {
  primary: 0,
  additional: 1,
  custom: 1,
  speciesGranted: 2
};
function hn(n) {
  return n.instanceId || n.id || n.uuid || `${n.role ?? "custom"}:${n.name.trim().toLocaleLowerCase("en-US")}`;
}
function Hu(n = []) {
  const e = /* @__PURE__ */ new Map();
  for (const t of n) {
    const i = hn(t);
    e.has(i) || e.set(i, t);
  }
  return [...e.values()].sort((t, i) => cs[t.role ?? "custom"] - cs[i.role ?? "custom"] || (t.attachedAt ?? 0) - (i.attachedAt ?? 0) || t.name.localeCompare(i.name, "en-US") || hn(t).localeCompare(hn(i), "en-US"));
}
function $u(n) {
  const e = n.trim().replace(/^[^a-z]+/i, "").toLocaleLowerCase("en-US");
  return /^(honest|honor|hour|heir)/.test(e) ? "AN" : /^(one|once|euro|user|use|uni(?:t|v|q))/.test(e) ? "A" : /^[aeiou]/.test(e) ? "AN" : "A";
}
function Vu(n = {}) {
  const e = Hu(n.descriptors), t = n.descriptorLabel?.trim() ?? "", i = e.map((p) => {
    const y = zt("descriptor", p);
    return t && p.role === "primary" ? { ...y, displayName: t.toLocaleUpperCase("en-US") } : y;
  });
  e.some((p) => p.role === "primary") || i.unshift(zt("descriptor"));
  const a = n.species ? zt("species", n.species) : null, s = zt("type", n.type), o = zt("focus", n.focus), r = n.hideFocus !== !0, l = $u(i[0].displayName), d = [i.map((p) => p.displayName).join(" AND "), a?.displayName, s.displayName].filter(Boolean).join(" ");
  return {
    article: l,
    descriptors: i,
    species: a,
    type: s,
    focus: o,
    showFocus: r,
    sentence: r ? `I AM ${l} ${d} WHO ${o.displayName}` : `I AM ${l} ${d}`
  };
}
function lr(n, e) {
  const t = Math.max(0, Math.trunc(e)), i = Math.max(0, Math.min(t, Math.trunc(n)));
  return Array.from({ length: t }, (a, s) => ({
    index: s,
    filled: s < i,
    targetCount: s + 1 === i ? i - 1 : s + 1
  }));
}
function Mi(n, e) {
  return ["minor", "moderate", "major"].map((t) => ({
    severity: t,
    count: n[t],
    capacity: e[t],
    overCapacity: Math.max(0, n[t] - e[t]),
    pips: lr(n[t], e[t])
  }));
}
const Du = {
  hale: 0,
  hurt: 1,
  impaired: 3,
  debilitated: 2,
  dead: 0
};
function Fu(n, e) {
  const t = ti(e), i = Et(n, e), a = t.indexOf(i);
  return t.map((s, o) => ({
    step: s,
    label: `MAGNUSARCHIVES.DamageTrack.${s}`,
    hintLabel: `MAGNUSARCHIVES.DamageTrack.Hint.${s}`,
    noteLabels: Array.from(
      { length: Du[s] },
      (r, l) => `MAGNUSARCHIVES.DamageTrack.Note.${s}.${l + 1}`
    ),
    current: s === i,
    reached: o <= a
  }));
}
function Tu(n, e = 0) {
  const t = Math.max(0, Math.trunc(n)), i = ki(t);
  return {
    value: t,
    level: i,
    toNextLevel: Ks(t),
    supernatural: Math.max(0, Math.trunc(e)),
    pips: lr(t - i * 3, 3)
  };
}
function zu(n) {
  return (Array.isArray(n) ? n : lt(n)).map((t) => {
    const i = t.used;
    return { id: t.id, type: t.type, used: i, available: !i, shortLabel: ku[t.type] };
  });
}
function cr(n, e) {
  const t = Number.isFinite(e) ? Math.max(0, e) : 0, i = Number.isFinite(n) ? Math.max(0, Math.min(t, n)) : 0, a = t > 0 ? i / t : 0;
  return { current: i, max: t, ratio: a, percent: a * 100 };
}
const Pu = ["name", "rank"], ds = {
  expert: 0,
  specialized: 1,
  trained: 2,
  untrained: 3,
  inability: 4
};
function xu(n) {
  return Pu.includes(n);
}
function qu(n, e) {
  return [...n].sort((t, i) => (e === "rank" ? ds[t.rank] - ds[i.rank] : 0) || t.name.localeCompare(i.name, "en-US"));
}
function Ou(n) {
  const e = n.system.grantedBy;
  return !e || e.status === "retained" ? !0 : !e.sourceUuid && !e.instanceId && !e.grantId;
}
function us(n) {
  const e = Ye(n), t = Number.isInteger(n.system.cost.amount) && n.system.cost.amount > 0 ? n.system.cost.amount : 0;
  return {
    archived: n.system.archived === !0,
    cost: {
      amount: t,
      scalable: n.system.cost.scalable === !0,
      pools: e,
      payable: t > 0 && e.length > 0
    },
    description: n.system.description.trim(),
    canDelete: Ou(n)
  };
}
function Bu(n) {
  const e = new Intl.Collator("en-US", { sensitivity: "base", numeric: !0 });
  return n.map((t, i) => ({ ability: t, index: i })).sort((t, i) => +(t.ability.system.archived === !0) - +(i.ability.system.archived === !0) || e.compare(t.ability.name, i.ability.name) || t.index - i.index).map(({ ability: t }) => t);
}
class Lu {
  #e = /* @__PURE__ */ new Set();
  isExpanded(e) {
    return this.#e.has(e);
  }
  toggle(e) {
    return this.#e.delete(e) ? !1 : (this.#e.add(e), !0);
  }
  remove(e) {
    this.#e.delete(e);
  }
  retain(e) {
    const t = new Set(e);
    for (const i of this.#e)
      t.has(i) || this.#e.delete(i);
  }
}
function Qi(n) {
  return String(n.level ?? "1").trim() || "1";
}
function Fi(n) {
  return !/^\d+$/.test(Qi(n));
}
function qn(n) {
  return n.depleted !== !0;
}
function dr(n) {
  return Kn.includes(n) ? n : "subtle";
}
function ur(n) {
  return Xn.includes(n) ? n : "low";
}
function Ca(n) {
  const e = Number(n.level);
  return n.levelOverride === !0 && Number.isInteger(e) && e >= 1 ? e : dr(n.manifestation) === "manifest" ? 6 : 4;
}
const On = ["equipment", "cypher", "artifact"];
function ms(n, e) {
  const t = Number(n);
  return Number.isInteger(t) && t >= 0 ? t : e;
}
function Gi(n) {
  return On.includes(n);
}
function ju(n) {
  if (!Gi(n.type)) return null;
  const e = n.system.depletion && typeof n.system.depletion == "object" ? n.system.depletion : null;
  return {
    id: n.id,
    name: n.name,
    type: n.type,
    level: n.type === "cypher" ? Ca(n.system) : n.type === "artifact" ? Qi(n.system) : null,
    levelRollable: n.type === "artifact" && Fi(n.system),
    power: n.type === "cypher" ? ur(n.system.power) : null,
    quantity: n.type === "equipment" ? ms(n.system.quantity, 1) : null,
    equipped: n.type === "equipment" && typeof n.system.equipped == "boolean" ? n.system.equipped : null,
    description: typeof n.system.description == "string" ? n.system.description.trim() : "",
    depleted: n.type === "artifact" && n.system.depleted === !0,
    usable: n.type !== "artifact" || qn(n.system),
    depletion: n.type === "artifact" && e ? {
      enabled: !!e.enabled,
      formula: String(e.formula || `1${String(e.die ?? "d6")}`),
      threshold: ms(e.threshold, 1)
    } : null
  };
}
class ps {
  #e = /* @__PURE__ */ new Set();
  isExpanded(e) {
    return this.#e.has(e);
  }
  toggle(e) {
    return this.#e.delete(e) ? !1 : (this.#e.add(e), !0);
  }
  remove(e) {
    this.#e.delete(e);
  }
  retain(e) {
    const t = new Set(e);
    for (const i of this.#e)
      t.has(i) || this.#e.delete(i);
  }
}
function Bn(n) {
  const e = n.track, t = n.severity, i = n.count, a = i === void 0 || i.trim() === "" ? Number.NaN : Number(i);
  if (e !== "character" && e !== "shield" || !ge.includes(t) || !Number.isInteger(a) || a < 0) throw new Error("Invalid Wound count action data.");
  if (e === "shield") {
    const s = n.shieldId?.trim();
    if (!s) throw new Error("Invalid Wound count action data.");
    return { track: e, shieldId: s, severity: t, count: a };
  }
  return { track: e, severity: t, count: a };
}
async function Wu(n, e) {
  const t = ct(e);
  if (!t) throw new Error("Weapon family must not be blank.");
  const i = le([...n.system.proficiencies.weaponFamilies, t]);
  return await n.update({ "system.proficiencies.weaponFamilies": i }), i;
}
async function _u(n, e) {
  const t = ct(e), i = le(n.system.proficiencies.weaponFamilies).filter((a) => a !== t);
  return await n.update({ "system.proficiencies.weaponFamilies": i }), i;
}
async function Ku(n) {
  const e = await foundry.applications.api.DialogV2.input({
    window: { title: game.i18n.localize("MAGNUSARCHIVES.Settings.Character.AddWeaponFamily") },
    content: `<div class="magnusarchives magnusarchives-dialog"><label class="magnusarchives-dialog-field">${game.i18n.localize("MAGNUSARCHIVES.Settings.Character.WeaponFamily")}
      <input name="family" type="text" list="magnusarchives-character-weapon-families" required autofocus>
      <datalist id="magnusarchives-character-weapon-families">${ao.map((t) => `<option value="${At(t)}"></option>`).join("")}</datalist>
    </label></div>`,
    rejectClose: !1,
    ok: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Add") }
  });
  e && await Wu(n, e.family);
}
function Xu(n) {
  const e = n.family, t = n.category;
  if (e !== "weapon" && e !== "armor") throw new Error("Invalid familiarity action data.");
  if (!t || !(e === "weapon" ? Le : je).includes(t)) throw new Error("Invalid familiarity action data.");
  return { family: e, category: t };
}
function Yu(n, e) {
  const t = /* @__PURE__ */ new Set([...Le, ...je]), i = new Set(n.filter((a) => t.has(a)));
  return i.has(e) ? i.delete(e) : i.add(e), [...i];
}
async function Ju(n, e, t) {
  const i = e === "weapon" ? "weaponCategories" : "armorCategories", a = Yu(n.system.proficiencies[i], t);
  return await n.update({ [`system.proficiencies.${i}`]: a }), a;
}
function wi(n) {
  return n.replace(/[&<>"']/g, (e) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[e]);
}
function Qu(n) {
  const e = n ?? { category: "Accuracy", shifts: 1, specification: "", description: "" };
  return `<div class="magnusarchives magnusarchives-dialog magnusarchives-power-shift-dialog">
    <label class="magnusarchives-dialog-field">${game.i18n.localize("MAGNUSARCHIVES.PowerShifts.Category")}
      <input name="category" type="text" value="${wi(e.category)}" list="magnusarchives-power-shift-categories" required>
      <datalist id="magnusarchives-power-shift-categories">${rl.map((t) => `<option value="${wi(t)}"></option>`).join("")}</datalist>
    </label>
    <label class="magnusarchives-dialog-field">${game.i18n.localize("MAGNUSARCHIVES.PowerShifts.Shifts")}
      <input name="shifts" type="number" min="1" step="1" value="${e.shifts}" required>
    </label>
    <label class="magnusarchives-dialog-field">${game.i18n.localize("MAGNUSARCHIVES.PowerShifts.Specification")}
      <input name="specification" type="text" value="${wi(e.specification)}">
    </label>
    <label class="magnusarchives-dialog-field">${game.i18n.localize("MAGNUSARCHIVES.PowerShifts.Description")}
      <textarea name="description" rows="3">${wi(e.description)}</textarea>
    </label>
  </div>`;
}
async function fs(n, e, t) {
  const i = await foundry.applications.api.DialogV2.input({
    window: { title: game.i18n.localize(t ? "MAGNUSARCHIVES.PowerShifts.Edit" : "MAGNUSARCHIVES.PowerShifts.Add") },
    content: Qu(t),
    rejectClose: !1,
    ok: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Save") }
  });
  if (!i) return;
  const a = ul(e, {
    ...t ? { id: t.id } : {},
    category: String(i.category ?? ""),
    shifts: Number(i.shifts),
    specification: String(i.specification ?? ""),
    description: String(i.description ?? "")
  });
  await n.update({ "system.powerShifts": a });
}
async function Zu(n, e, t) {
  await n.update({ "system.powerShifts": ml(e, t) });
}
const vi = "system." + U;
function mr() {
  return [...game.users];
}
function gs() {
  return mr().filter((n) => n.active && n.isGM).sort((n, e) => n.id.localeCompare(e.id))[0] ?? null;
}
function hs(n, e) {
  return e.isGM || n.testUserPermission(e, CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER);
}
function em(n) {
  return [...game.messages].some((e) => {
    const t = e.getFlag(U, "playerIntrusion");
    return !!(t && typeof t == "object" && t.requestId === n);
  });
}
class tm {
  #e;
  #t;
  #i = /* @__PURE__ */ new Set();
  #n = /* @__PURE__ */ new Set();
  constructor(e, t) {
    this.#e = e, this.#t = t;
  }
  initialize() {
    game.socket.on(vi, (e) => {
      this.#l(e);
    });
  }
  async activate(e) {
    if (!hs(e, game.user))
      throw new Error(game.i18n.localize("MAGNUSARCHIVES.Intrusion.Player.NotAuthorized"));
    if (!this.#e.canUse(e))
      throw new Error(game.i18n.localize("MAGNUSARCHIVES.Intrusion.Player.RequiresXP"));
    if (this.#i.has(e.uuid)) return !1;
    this.#i.add(e.uuid);
    try {
      if (!await foundry.applications.api.DialogV2.confirm({
        window: { title: game.i18n.localize("MAGNUSARCHIVES.Intrusion.Player.Title") },
        content: '<div class="magnusarchives magnusarchives-dialog player-intrusion-dialog"><p>' + game.i18n.localize("MAGNUSARCHIVES.Intrusion.Player.ConfirmPrompt") + "</p></div>",
        yes: { label: game.i18n.localize("MAGNUSARCHIVES.Intrusion.Player.Confirm") },
        no: { label: game.i18n.localize("MAGNUSARCHIVES.Intrusion.Player.Cancel") }
      })) return !1;
      const i = _e(), a = gs();
      return a && a.id !== game.user.id ? game.socket.emit(vi, {
        type: "player-intrusion-request",
        requestId: i,
        actorUuid: e.uuid,
        requesterUserId: game.user.id
      }) : await this.#a(i, e.uuid, game.user.id), !0;
    } finally {
      this.#i.delete(e.uuid);
    }
  }
  async #a(e, t, i) {
    if (!(this.#n.has(e) || em(e))) {
      this.#n.add(e);
      try {
        const s = await fromUuid(t);
        if (!s || s.type !== "character" || s.uuid !== t)
          throw new Error(game.i18n.localize("MAGNUSARCHIVES.Intrusion.Player.CharacterMissing"));
        const o = mr().find((l) => l.id === i && l.active);
        if (!o || !hs(s, o))
          throw new Error(game.i18n.localize("MAGNUSARCHIVES.Intrusion.Player.NotAuthorized"));
        const r = await this.#e.spend(s, e);
        await this.#t.publish(r, s), Hooks.callAll("magnusarchivesPlayerIntrusionCreated", r, s);
      } finally {
        this.#n.delete(e);
      }
    }
  }
  async #l(e) {
    if (!e || typeof e != "object") return;
    const t = e.type;
    if (t !== "player-intrusion-request" && t !== "player-intrusion-result") return;
    const i = e;
    if (i.type === "player-intrusion-result") {
      i.recipientUserId === game.user.id && !i.success && i.error && ui.notifications.error(i.error);
      return;
    }
    const a = gs();
    if (!(!game.user.isGM || a?.id !== game.user.id))
      try {
        await this.#a(i.requestId, i.actorUuid, i.requesterUserId), game.socket.emit(vi, {
          type: "player-intrusion-result",
          requestId: i.requestId,
          recipientUserId: i.requesterUserId,
          success: !0
        });
      } catch (s) {
        game.socket.emit(vi, {
          type: "player-intrusion-result",
          requestId: i.requestId,
          recipientUserId: i.requesterUserId,
          success: !1,
          error: s instanceof Error ? s.message : String(s)
        });
      }
  }
}
let Kt = null;
function im(n, e) {
  return Kt = new tm(n, e), Kt.initialize(), Kt;
}
function nm() {
  if (!Kt) throw new Error("Player Intrusion controller is not ready.");
  return Kt;
}
const yn = "is-quick-roll-pulse";
function am(n) {
  n.classList.remove(yn), n.offsetWidth, n.classList.add(yn), n.addEventListener("animationend", () => {
    n.classList.remove(yn);
  }, { once: !0 });
}
const sm = foundry.applications.api.HandlebarsApplicationMixin(
  foundry.applications.sheets.ActorSheetV2
);
function ys(n) {
  const e = n.dataset.severity, t = n.dataset.woundId;
  if (!ge.includes(e) || !t)
    throw new Error("Invalid Wound action data.");
  return { severity: e, woundId: t };
}
function x(n) {
  const e = n.dataset.itemId;
  if (!e) throw new Error("Missing Item ID.");
  return e;
}
function om(n) {
  return game.i18n.localize(`MAGNUSARCHIVES.Pools.${n[0].toUpperCase()}${n.slice(1)}`);
}
function Sn(n) {
  return n > 0 ? `+${n}` : String(n);
}
function et(n) {
  const e = n.dataset.focusUuid, t = n.dataset.nodeId;
  if (!e || !t) throw new Error("Missing Focus node action data.");
  return { focusUuid: e, nodeId: t };
}
const rm = {
  "not-character": "MAGNUSARCHIVES.Focus.Errors.NotCharacter",
  "node-not-found": "MAGNUSARCHIVES.Focus.Errors.NodeNotFound",
  "progress-missing": "MAGNUSARCHIVES.Focus.Errors.ProgressMissing",
  "progress-duplicated": "MAGNUSARCHIVES.Focus.Errors.ProgressDuplicated",
  "not-eligible": "MAGNUSARCHIVES.Focus.Errors.NotEligible",
  "choice-required": "MAGNUSARCHIVES.Focus.Errors.ChoiceRequired",
  "restore-not-owned": "MAGNUSARCHIVES.Focus.Errors.RestoreNotOwned",
  "undo-not-owned": "MAGNUSARCHIVES.Focus.Errors.UndoNotOwned",
  "undo-dependent-nodes": "MAGNUSARCHIVES.Focus.Errors.UndoDependencies",
  "duplicate-grant": "MAGNUSARCHIVES.Focus.Errors.DuplicateGrant",
  "ability-data-unavailable": "MAGNUSARCHIVES.Focus.Errors.AbilityDataUnavailable"
};
async function Fe(n, e) {
  try {
    const i = await fromUuid(e);
    if (i?.type === "focus") return i;
  } catch {
  }
  const t = n.items.get(e);
  return t?.type === "focus" ? t : null;
}
const Ss = /* @__PURE__ */ new Set([
  "applyWound",
  "setCharacterWoundCount",
  "setShieldWoundCount",
  "toggleFamiliarity",
  "addWeaponFamily",
  "removeWeaponFamily",
  "adjustStress",
  "setDamageTrackStep",
  "applySeriousInjury",
  "healDamageTrack",
  "editWound",
  "deleteWound",
  "poolDamage",
  "recovery",
  "recoveryType",
  "resetRecoveries",
  "rally",
  "editCharacterOverride",
  "clearCharacterOverride",
  "rollPool",
  "editWoundCapacityOverride",
  "resetWoundCapacityOverride",
  "editRecoveryOverride",
  "resetRecoveryOverride",
  "createSkill",
  "rollSkill",
  "configureSkillRoll",
  "deleteSkill",
  "resetHeaderAppearance",
  "createWeapon",
  "createArmor",
  "createShield",
  "attackWeapon",
  "rollCombatDepletion",
  "reloadWeapon",
  "toggleShieldEquipped",
  "toggleArmorEquipped",
  "deleteCombatItem",
  "block",
  "dodge",
  "acquireFocusNode",
  "gmAcquireFocusNode",
  "purchaseAdvancement",
  "undoAdvancement",
  "advanceTier",
  "completeProgressionGuidance",
  "resetProgressionGuidance",
  "addFocus",
  "removeFocus",
  "toggleGmProgressionEdit",
  "undoFocusAcquisition",
  "gmMarkFocusOwned",
  "gmRemoveFocusOwned",
  "beginCoreSetup",
  "skipCoreSetup",
  "markCoreInitialized",
  "chooseArc",
  "restoreFocusAbility",
  "addType",
  "addDescriptor",
  "addSpecies",
  "addGenre",
  "removeGenre",
  "acquireGenreAbility",
  "browseGenreAbilities",
  "removePackage",
  "createAbility",
  "useAbility",
  "payAbilityCost",
  "toggleAbilityArchived",
  "deleteAbility",
  "addPowerShift",
  "editPowerShift",
  "deletePowerShift",
  "sendItemToChat",
  "createInventoryItem",
  "deleteInventoryItem",
  "rollInventoryDepletion",
  "rollArtifactLevel",
  "playerIntrusion"
]), lm = ["none", "opening", "steps", "climax", "resolution", "complete"];
function cm(n) {
  const e = n?.stage ?? "none";
  return {
    chosen: !!n?.name,
    name: n?.name ?? "",
    details: n?.key ? sr(n.key) : "",
    stage: e,
    stepsCompleted: n?.stepsCompleted ?? 0,
    notes: n?.notes ?? "",
    stages: lm.map((t) => ({
      value: t,
      label: game.i18n.localize(`MAGNUSARCHIVES.Arc.StageName.${t}`),
      selected: t === e
    }))
  };
}
class C extends sm {
  #e = new Lo();
  #t = new jo();
  #i = null;
  #n = !1;
  #a = "name";
  #l = new Lu();
  #r = new ps();
  #s = new ps();
  #c = null;
  #o = null;
  #d = "skills";
  static DEFAULT_OPTIONS = {
    ...ra,
    classes: ["magnusarchives", "sheet", "actor", "character-sheet"],
    actions: ca({
      applyWound: C.#J,
      adjustStress: C.#Q,
      setDamageTrackStep: C.#Z,
      applySeriousInjury: C.#ee,
      healDamageTrack: C.#te,
      setCharacterWoundCount: C.#ie,
      setShieldWoundCount: C.#ne,
      toggleFamiliarity: C.#ae,
      addWeaponFamily: C.#se,
      removeWeaponFamily: C.#oe,
      editWound: C.#de,
      deleteWound: C.#ue,
      poolDamage: C.#me,
      recovery: C.#pe,
      recoveryType: C.#fe,
      resetRecoveries: C.#ge,
      rally: C.#he,
      editCharacterOverride: C.#M,
      clearCharacterOverride: C.#y,
      editWoundCapacityOverride: C.#G,
      resetWoundCapacityOverride: C.#Se,
      editRecoveryOverride: C.#U,
      resetRecoveryOverride: C.#b,
      rollPool: C.#k,
      inspectHeaderFocus: C.#C,
      createSkill: C.#Ae,
      setSkillSort: C.#E,
      rollSkill: C.#R,
      configureSkillRoll: C.#$,
      editSkill: C.#g,
      deleteSkill: C.#we,
      resetHeaderAppearance: C.#v,
      createWeapon: C.#ve,
      createArmor: C.#Ce,
      createShield: C.#Ee,
      attackWeapon: C.#Ie,
      toggleCombatDetails: C.#Re,
      rollCombatDepletion: C.#Ne,
      reloadWeapon: C.#Me,
      toggleShieldEquipped: C.#Ge,
      toggleArmorEquipped: C.#Ue,
      editCombatItem: C.#ke,
      deleteCombatItem: C.#He,
      block: C.#$e,
      dodge: C.#Ve,
      openFocusNode: C.#De,
      acquireFocusNode: C.#Fe,
      gmAcquireFocusNode: C.#Te,
      purchaseAdvancement: C.#ze,
      undoAdvancement: C.#Pe,
      advanceTier: C.#xe,
      completeProgressionGuidance: C.#qe,
      resetProgressionGuidance: C.#Oe,
      addFocus: C.#Be,
      removeFocus: C.#Le,
      toggleGmProgressionEdit: C.#je,
      undoFocusAcquisition: C.#We,
      gmMarkFocusOwned: C.#_e,
      gmRemoveFocusOwned: C.#Ke,
      beginCoreSetup: C.#Xe,
      skipCoreSetup: C.#Je,
      markCoreInitialized: C.#Qe,
      chooseArc: C.#Ye,
      restoreFocusAbility: C.#Ze,
      addType: C.#A,
      addDescriptor: C.#f,
      addSpecies: C.#p,
      addGenre: C.#h,
      inspectGenre: C.#m,
      removeGenre: C.#S,
      acquireGenreAbility: C.#w,
      browseGenreAbilities: C.#V,
      inspectPackage: C.#D,
      removePackage: C.#F,
      inspectGrantedItem: C.#T,
      createAbility: C.#P,
      useAbility: C.#z,
      payAbilityCost: C.#O,
      toggleAbilityArchived: C.#B,
      toggleAbilityDetails: C.#x,
      inspectAbility: C.#q,
      deleteAbility: C.#L,
      addPowerShift: C.#re,
      editPowerShift: C.#le,
      deletePowerShift: C.#ce,
      sendItemToChat: C.#Y,
      createInventoryItem: C.#j,
      openInventoryItem: C.#W,
      deleteInventoryItem: C.#K,
      toggleInventoryDetails: C.#_,
      rollInventoryDepletion: C.#N,
      rollArtifactLevel: C.#X,
      playerIntrusion: C.#ye
    }, Ss),
    position: { width: 760, height: 760 },
    window: { resizable: !0 }
  };
  static PARTS = {
    main: { template: "systems/magnusarchives/templates/actor/character-sheet.hbs" }
  };
  static TABS = {
    primary: {
      tabs: [
        { id: "skills", icon: "fa-solid fa-graduation-cap", label: "MAGNUSARCHIVES.Tabs.Skills" },
        { id: "abilities", icon: "fa-solid fa-bolt", label: "MAGNUSARCHIVES.Tabs.Abilities" },
        { id: "combat", icon: "fa-solid fa-swords", label: "MAGNUSARCHIVES.Tabs.Combat" },
        { id: "inventory", icon: "fa-solid fa-backpack", label: "MAGNUSARCHIVES.Tabs.Inventory" },
        { id: "advancement", icon: "fa-solid fa-arrow-up-right-dots", label: "MAGNUSARCHIVES.Tabs.Advancement" },
        { id: "notes", icon: "fa-solid fa-book-open", label: "MAGNUSARCHIVES.Tabs.Notes" },
        { id: "settings", icon: "fa-solid fa-sliders", label: "MAGNUSARCHIVES.Tabs.Settings" }
      ],
      initial: "skills"
    }
  };
  async _onRender(e, t) {
    if (await super._onRender(e, t), da(this.element, this.isEditable, Ss), this.#o) {
      this.#d = this.#o.activeTab;
      const i = this.changeTab;
      typeof i == "function" && i.call(this, this.#d, "primary"), hd(this.element, this.#o), this.#o = null;
    }
    this.#e.bind(this.element), this.#t.bind(this.element), this.#H(), this.#u();
  }
  _onClose(e) {
    this.#i?.abort(), this.#i = null, this.#e.disconnect(), this.#t.disconnect(), this.#c?.abort(), this.#c = null, super._onClose(e);
  }
  #u() {
    this.#c?.abort(), this.#c = null;
    const e = [...this.element.querySelectorAll("input[data-inventory-quantity]")], t = [...this.element.querySelectorAll(
      ".combat-weapon-row[data-action], .combat-shield-row[data-action], .combat-armor-row[data-action]"
    )];
    if (!e.length && !t.length) return;
    const i = new AbortController();
    this.#c = i;
    for (const a of t)
      a.addEventListener("keydown", (s) => {
        s.target !== a || s.key !== "Enter" && s.key !== " " || (s.preventDefault(), a.click());
      }, { signal: i.signal });
    if (this.isEditable)
      for (const a of e)
        a.addEventListener("change", async (s) => {
          s.stopPropagation();
          const o = a.dataset.itemId, r = o ? this.actor.items.get(o) : null, l = Number(a.value);
          if (!r || r.type !== "equipment" || !Number.isInteger(l) || l < 0) {
            await this.render({ force: !0 });
            return;
          }
          await r.update({ "system.quantity": l });
        }, { signal: i.signal });
  }
  _canDragDrop(e) {
    return this.isEditable;
  }
  async _onDropDocument(e, t) {
    if (!this.isEditable) return null;
    const i = t, s = (e.target instanceof Element ? e.target.closest("[data-hud-drop]") : null)?.dataset.hudDrop;
    return s && i?.type !== s ? (ui.notifications.warn(game.i18n.localize("MAGNUSARCHIVES.Hud.InvalidIdentityDrop")), null) : i?.type === "focus" ? (await es(this.actor, i), i) : i?.type === "characterType" ? (await Pn(this.actor, i), i) : i?.type === "descriptor" ? (await xn(this.actor, i), i) : i?.type === "species" ? (await as(this.actor, i), i) : i?.type === "genre" ? (await zn(this.actor, i), i) : super._onDropDocument(e, t);
  }
  static async #A() {
    await Pn(this.actor);
  }
  static async #f() {
    await xn(this.actor);
  }
  static async #p() {
    await as(this.actor);
  }
  static async #h() {
    await zn(this.actor);
  }
  static async #m() {
    await (await game.magnusarchives.services.genres.active(this.actor))?.sheet?.render(!0);
  }
  static async #S() {
    await Wd(this.actor);
  }
  static async #w(e, t) {
    const i = t.dataset.choiceId;
    i && await _d(this.actor, i);
  }
  static async #V() {
    await Kd(this.actor), await this.render({ force: !0 });
  }
  static async #D(e, t) {
    const i = this.actor.items.get(x(t));
    i?.type !== "characterType" && i?.type !== "descriptor" && i?.type !== "species" || await i.sheet?.render(!0);
  }
  static async #F(e, t) {
    await ou(this.actor, x(t));
  }
  static async #T(e, t) {
    await this.actor.items.get(x(t))?.sheet?.render(!0);
  }
  static async #z(e, t) {
    const i = this.actor.items.get(x(t));
    if (!i || i.type !== "ability") throw new Error("Ability Item not found.");
    await Ru(
      this.actor,
      i
    );
  }
  static async #P() {
    await (await this.actor.createEmbeddedDocuments("Item", [{
      name: game.i18n.localize("MAGNUSARCHIVES.Ability.New"),
      type: "ability"
    }]))[0]?.sheet?.render(!0);
  }
  static #x(e, t) {
    e.preventDefault(), e.stopPropagation();
    const i = x(t), a = this.#l.toggle(i), s = t.closest(".compact-ability");
    if (!s) return;
    s.classList.toggle("is-expanded", a);
    const o = s.querySelector(".compact-ability-details");
    o && (o.hidden = !a);
    for (const r of s.querySelectorAll("[data-action='toggleAbilityDetails']"))
      r.setAttribute("aria-expanded", String(a));
  }
  static async #q(e, t) {
    e.preventDefault(), e.stopPropagation();
    const i = this.actor.items.get(x(t));
    if (!i || i.type !== "ability") throw new Error("Ability Item not found.");
    await i.sheet?.render(!0);
  }
  static async #O(e, t) {
    e.preventDefault(), e.stopPropagation();
    const i = this.actor.items.get(x(t));
    if (!i || i.type !== "ability") throw new Error("Ability Item not found.");
    try {
      await Gu(
        this.actor,
        i
      );
    } catch (a) {
      ui.notifications.error(a instanceof Error ? a.message : String(a));
    }
  }
  static async #B(e, t) {
    e.preventDefault(), e.stopPropagation();
    const i = this.actor.items.get(x(t));
    if (!i || i.type !== "ability") throw new Error("Ability Item not found.");
    const a = i.system.archived === !0;
    await i.update({ "system.archived": !a });
  }
  static async #L(e, t) {
    e.preventDefault(), e.stopPropagation();
    const i = this.actor.items.get(x(t));
    if (!i || i.type !== "ability") throw new Error("Ability Item not found.");
    if (!us(i).canDelete) {
      ui.notifications.warn(game.i18n.localize("MAGNUSARCHIVES.Ability.DeleteGranted"));
      return;
    }
    await foundry.applications.api.DialogV2.confirm({
      window: { title: game.i18n.localize("MAGNUSARCHIVES.Ability.DeleteTitle") },
      content: `<div class="magnusarchives magnusarchives-dialog"><p>${game.i18n.format("MAGNUSARCHIVES.Ability.DeleteConfirm", { name: i.name })}</p></div>`,
      yes: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Delete") },
      no: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Cancel") }
    }) && (this.#l.remove(i.id), await i.delete());
  }
  static async #j(e, t) {
    const i = t.dataset.itemType;
    if (!Gi(i)) throw new Error("Invalid Inventory Item type.");
    await (await this.actor.createEmbeddedDocuments("Item", [{
      name: game.i18n.localize(`MAGNUSARCHIVES.Inventory.New.${i}`),
      type: i
    }]))[0]?.sheet?.render(!0);
  }
  static async #W(e, t) {
    const i = this.actor.items.get(x(t));
    if (!i || !Gi(i.type)) throw new Error("Inventory Item not found.");
    await i.sheet?.render(!0);
  }
  static #_(e, t) {
    e.preventDefault(), e.stopPropagation();
    const i = x(t), a = this.#r.toggle(i), s = t.closest(".compact-inventory-item");
    if (!s) return;
    s.classList.toggle("is-expanded", a);
    const o = s.querySelector(".compact-inventory-details");
    o && (o.hidden = !a), t.setAttribute("aria-expanded", String(a));
  }
  static async #K(e, t) {
    const i = this.actor.items.get(x(t));
    if (!i || !Gi(i.type)) throw new Error("Inventory Item not found.");
    await foundry.applications.api.DialogV2.confirm({
      window: { title: game.i18n.localize("MAGNUSARCHIVES.Inventory.DeleteTitle") },
      content: `<div class="magnusarchives magnusarchives-dialog"><p>${game.i18n.format("MAGNUSARCHIVES.Inventory.DeleteConfirm", { name: i.name })}</p></div>`,
      yes: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Delete") },
      no: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Cancel") }
    }) && (this.#r.remove(i.id), await i.delete());
  }
  static async #N(e, t) {
    const i = this.actor.items.get(x(t));
    if (!i || i.type !== "artifact") throw new Error("Artifact Item not found.");
    await Di(i);
  }
  static async #X(e, t) {
    const i = this.actor.items.get(x(t));
    if (!i || i.type !== "artifact") throw new Error("Artifact Item not found.");
    try {
      const a = await game.magnusarchives.services.artifacts.rollLevel(i);
      await game.magnusarchives.services.itemChat.publishArtifactLevelRoll(i, a);
    } catch (a) {
      ui.notifications.error(a instanceof Error ? a.message : String(a));
    }
  }
  static async #Y(e, t) {
    e.preventDefault(), e.stopPropagation();
    const i = this.actor.items.get(x(t));
    if (!i || !["ability", "weapon", "shield", "armor", ...On].includes(i.type))
      throw new Error("Chat Item not found.");
    await game.magnusarchives.services.itemChat.publish(i);
  }
  static async #J() {
    await Hc(this.actor);
  }
  static async #Q(e, t) {
    const i = Number(t.dataset.delta ?? "0");
    if (!Number.isFinite(i) || i === 0) return;
    const a = this.actor, s = game.magnusarchives.services.conditions;
    i > 0 ? await s.applyStress(a, i) : await s.relieveStress(a, Math.abs(i));
  }
  static async #Z(e, t) {
    const i = t.dataset.step;
    i && await game.magnusarchives.services.conditions.setDamageTrackStep(
      this.actor,
      i
    );
  }
  static async #ee() {
    await game.magnusarchives.services.conditions.applySeriousInjury(
      this.actor
    );
  }
  static async #te() {
    await game.magnusarchives.services.conditions.healDamageTrack(
      this.actor
    );
  }
  static async #ie(e, t) {
    if (e.preventDefault(), e.stopPropagation(), !this.isEditable || !game.user.isGM && !this.actor.testUserPermission(
      game.user,
      CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER
    )) return;
    const i = Bn(t.dataset);
    if (i.track !== "character") throw new Error("Invalid Character Wound count action data.");
    await game.magnusarchives.services.wounds.setCount(
      this.actor,
      i.severity,
      i.count
    ), await this.render({ force: !0 });
  }
  static async #ne(e, t) {
    if (e.preventDefault(), e.stopPropagation(), !this.isEditable || !game.user.isGM && !this.actor.testUserPermission(
      game.user,
      CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER
    )) return;
    const i = Bn(t.dataset);
    if (i.track !== "shield") throw new Error("Invalid Shield Wound count action data.");
    const a = this.actor.items.get(i.shieldId);
    if (!a || a.type !== "shield") throw new Error("Shield Item not found.");
    await game.magnusarchives.services.shields.setCount(
      a,
      i.severity,
      i.count
    ), await this.render({ force: !0 });
  }
  static async #ae(e, t) {
    if (e.preventDefault(), e.stopPropagation(), !this.isEditable || !game.user.isGM && !this.actor.testUserPermission(
      game.user,
      CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER
    )) return;
    const { family: i, category: a } = Xu(t.dataset);
    await Ju(this.actor, i, a), await this.render({ force: !0 });
  }
  static async #se() {
    await Ku(this.actor), await this.render({ force: !0 });
  }
  static async #oe(e, t) {
    e.preventDefault(), e.stopPropagation(), await _u(
      this.actor,
      t.dataset.weaponFamily
    ), await this.render({ force: !0 });
  }
  static #I(e) {
    const t = e.actor.system, i = [...e.actor.items].filter((a) => a.type === "characterType");
    return $a(t.powerShifts ?? [], i);
  }
  static async #re() {
    await fs(
      this.actor,
      C.#I(this)
    );
  }
  static async #le(e, t) {
    const i = C.#I(this), a = i.find((s) => s.id === t.dataset.powerShiftId);
    a && await fs(this.actor, i, a);
  }
  static async #ce(e, t) {
    const i = t.dataset.powerShiftId;
    i && await Zu(
      this.actor,
      C.#I(this),
      i
    );
  }
  static async #de(e, t) {
    const { severity: i, woundId: a } = ys(t);
    await Uc(this.actor, i, a);
  }
  static async #ue(e, t) {
    const { severity: i, woundId: a } = ys(t);
    await kc(this.actor, i, a);
  }
  static async #me() {
    await $c(this.actor);
  }
  static async #pe() {
    await Pa(this.actor);
  }
  static async #fe(e, t) {
    const i = t.dataset.recoveryType, a = t.dataset.recoverySlotId;
    !i || !ke.includes(i) || await Pa(this.actor, i, a);
  }
  static async #ge() {
    if (!game.user.isGM || !await foundry.applications.api.DialogV2.confirm({
      window: { title: game.i18n.localize("MAGNUSARCHIVES.Hud.ResetRecoveries") },
      content: `<div class="magnusarchives magnusarchives-dialog"><p>${game.i18n.localize("MAGNUSARCHIVES.Hud.ResetRecoveriesConfirm")}</p></div>`,
      yes: { label: game.i18n.localize("MAGNUSARCHIVES.Hud.ResetRecoveries") },
      no: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Cancel") }
    })) return;
    const t = this.actor.system.recovery.slots.map((i) => ({ ...i, used: !1 }));
    await this.actor.update({
      "system.recovery.slots": t,
      "system.recovery.used": Rt(t)
    }), ui.notifications.info(game.i18n.localize("MAGNUSARCHIVES.Hud.RecoveriesReset"));
  }
  static async #he(e) {
    e?.stopPropagation(), await Vc(this.actor);
  }
  static async #ye(e, t) {
    e.preventDefault(), e.stopPropagation(), t instanceof HTMLButtonElement && (t.disabled = !0);
    try {
      await nm().activate(
        this.actor
      );
    } catch (i) {
      ui.notifications.error(i instanceof Error ? i.message : String(i));
    } finally {
      t instanceof HTMLButtonElement && this.actor.system.xp >= 1 && (t.disabled = !1);
    }
  }
  static async #M(e, t) {
    e.preventDefault(), e.stopPropagation();
    const i = t.dataset.overrideKey;
    !i || !Zi.includes(i) || await Tc(this.actor, i);
  }
  static async #y(e, t) {
    e.preventDefault(), e.stopPropagation();
    const i = t.dataset.overrideKey;
    if (!i || !Zi.includes(i)) return;
    const a = kn(
      this.actor.system,
      i
    );
    await this.actor.update({ [a.path]: null });
  }
  static async #G(e) {
    e.preventDefault(), e.stopPropagation(), await Pc(this.actor);
  }
  static async #Se(e) {
    e.preventDefault(), e.stopPropagation(), await jc(this.actor);
  }
  static async #U(e) {
    e.preventDefault(), e.stopPropagation(), await Lc(this.actor);
  }
  static async #b(e) {
    e.preventDefault(), e.stopPropagation(), await Wc(this.actor);
  }
  static async #k(e, t) {
    if (e.target instanceof Element && e.target.closest("input, button, select, textarea, a")) return;
    const i = t.dataset.pool;
    !i || !k.includes(i) || await rd(this.actor, i);
  }
  #H() {
    this.#i?.abort(), this.#i = new AbortController();
    const { signal: e } = this.#i;
    for (const i of this.element.querySelectorAll(".character-hud-pool[data-action='rollPool']"))
      i.addEventListener("keydown", (a) => {
        a.target !== i || a.key !== "Enter" && a.key !== " " || (a.preventDefault(), i.click());
      }, { signal: e });
    const t = this.element.querySelector("input[data-header-color]");
    t && this.isEditable && t.addEventListener("change", async (i) => {
      i.stopPropagation(), await this.actor.update({ "system.appearance.color": t.value });
    }, { signal: e });
  }
  static async #C(e, t) {
    const i = t.dataset.focusUuid;
    if (!i) return;
    await (await Fe(this.actor, i))?.sheet?.render(!0);
  }
  static async #Ae() {
    await this.actor.createEmbeddedDocuments("Item", [{
      name: game.i18n.localize("MAGNUSARCHIVES.Skill.New"),
      type: "skill"
    }]);
  }
  static #E(e, t) {
    const i = t.dataset.sortMode;
    !xu(i) || i === this.#a || (this.#a = i, this.render({ force: !0 }));
  }
  static async #R(e, t) {
    e.stopPropagation();
    const i = this.actor.items.get(x(t));
    if (!i || i.type !== "skill") throw new Error("Skill Item not found.");
    am(t);
    try {
      const a = rt(), s = game.magnusarchives.services.skills.buildQuickRollRequest(
        i,
        { enabledRuleModuleIds: a }
      ), o = await game.magnusarchives.services.rolls.execute(
        this.actor,
        s,
        Oe()
      );
      await ma(this.actor, o);
    } catch (a) {
      ui.notifications.error(a instanceof Error ? a.message : String(a));
    }
  }
  static async #$(e, t) {
    e.stopPropagation();
    const i = this.actor.items.get(x(t));
    if (!i || i.type !== "skill") throw new Error("Skill Item not found.");
    await cd(
      this.actor,
      i
    );
  }
  static async #v(e) {
    e.preventDefault(), e.stopPropagation(), await this.actor.update({
      "system.appearance.backgroundMode": "theme",
      "system.appearance.customImage": "",
      "system.appearance.color": ""
    });
  }
  static async #g(e, t) {
    const i = this.actor.items.get(x(t));
    if (!i || i.type !== "skill") throw new Error("Skill Item not found.");
    await i.sheet?.render(!0);
  }
  static async #we(e, t) {
    const i = this.actor.items.get(x(t));
    if (!i || i.type !== "skill") throw new Error("Skill Item not found.");
    await foundry.applications.api.DialogV2.confirm({
      window: { title: game.i18n.localize("MAGNUSARCHIVES.Skill.DeleteTitle") },
      content: `<div class="magnusarchives magnusarchives-dialog"><p>${game.i18n.format("MAGNUSARCHIVES.Skill.DeleteConfirm", { name: i.name })}</p></div>`,
      yes: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Delete") },
      no: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Cancel") }
    }) && await i.delete();
  }
  static async #ve() {
    await this.actor.createEmbeddedDocuments("Item", [{ name: game.i18n.localize("MAGNUSARCHIVES.Combat.Weapon.New"), type: "weapon" }]);
  }
  static async #Ce() {
    await this.actor.createEmbeddedDocuments("Item", [{ name: game.i18n.localize("MAGNUSARCHIVES.Combat.Armor.New"), type: "armor" }]);
  }
  static async #Ee() {
    await this.actor.createEmbeddedDocuments("Item", [{
      name: game.i18n.localize("MAGNUSARCHIVES.Shield.New"),
      type: "shield"
    }]);
  }
  static async #Ie(e, t) {
    e.preventDefault(), e.stopPropagation();
    const i = this.actor.items.get(x(t));
    if (!i || i.type !== "weapon") throw new Error("Weapon Item not found.");
    if (!game.magnusarchives.services.weapons.ammunition(i).canAttack) {
      ui.notifications.warn(game.i18n.localize("MAGNUSARCHIVES.Combat.Weapon.InsufficientAmmo"));
      return;
    }
    await md(
      this.actor,
      i
    );
  }
  static #Re(e, t) {
    e.preventDefault(), e.stopPropagation();
    const i = x(t), a = this.#s.toggle(i), s = t.closest(".compact-combat-item");
    if (!s) return;
    s.classList.toggle("is-expanded", a);
    const o = s.querySelector(".compact-combat-details");
    o && (o.hidden = !a), t.setAttribute("aria-expanded", String(a));
  }
  static async #Ne(e, t) {
    e.preventDefault(), e.stopPropagation();
    const i = this.actor.items.get(x(t));
    if (!i || !["weapon", "shield", "armor"].includes(i.type))
      throw new Error("Combat Item not found.");
    await Di(i);
  }
  static async #Me(e, t) {
    if (e.preventDefault(), e.stopPropagation(), !this.isEditable) return;
    const i = this.actor.items.get(x(t));
    if (!i || i.type !== "weapon") throw new Error("Weapon Item not found.");
    await game.magnusarchives.services.weapons.reload(i);
  }
  static async #Ge(e, t) {
    if (e.preventDefault(), e.stopPropagation(), !this.isEditable) return;
    const i = this.actor.items.get(x(t));
    if (!i || i.type !== "shield") throw new Error("Shield Item not found.");
    await game.magnusarchives.services.shields.setEquipped(
      this.actor,
      i,
      !i.system.equipped
    );
  }
  static async #Ue(e, t) {
    if (e.preventDefault(), e.stopPropagation(), !this.isEditable) return;
    const i = this.actor.items.get(x(t));
    if (!i || i.type !== "armor") throw new Error("Armor Item not found.");
    await i.update({ "system.equipped": !i.system.equipped });
  }
  static async #ke(e, t) {
    e.preventDefault(), e.stopPropagation();
    const i = this.actor.items.get(x(t));
    if (!i || i.type !== "weapon" && i.type !== "armor" && i.type !== "shield")
      throw new Error("Combat Item not found.");
    await i.sheet?.render(!0);
  }
  static async #He(e, t) {
    e.preventDefault(), e.stopPropagation();
    const i = this.actor.items.get(x(t));
    if (!i || i.type !== "weapon" && i.type !== "armor" && i.type !== "shield")
      throw new Error("Combat Item not found.");
    await foundry.applications.api.DialogV2.confirm({
      window: { title: game.i18n.localize("MAGNUSARCHIVES.Combat.DeleteItem") },
      content: `<div class="magnusarchives magnusarchives-dialog"><p>${game.i18n.format("MAGNUSARCHIVES.Combat.DeleteItemConfirm", { name: i.name })}</p></div>`,
      yes: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Delete") },
      no: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Cancel") }
    }) && (this.#s.remove(i.id), await i.delete());
  }
  static async #$e() {
    await Fn(this.actor, "block");
  }
  static async #Ve() {
    await Fn(this.actor, "dodge");
  }
  static async #De(e, t) {
    const { focusUuid: i, nodeId: a } = et(t), s = await Fe(this.actor, i);
    if (!s) throw new Error("Focus Item not found.");
    await Bo(s, a);
  }
  static async #Fe(e, t) {
    const { focusUuid: i, nodeId: a } = et(t), s = await Fe(this.actor, i);
    if (!s) {
      ui.notifications.error(game.i18n.localize("MAGNUSARCHIVES.Focus.Errors.FocusUnavailable"));
      return;
    }
    try {
      const o = await game.magnusarchives.services.focusAcquisition.acquireManual(
        this.actor,
        s,
        a,
        Vt
      );
      ui.notifications.info(game.i18n.localize(
        o.status === "acquired" ? "MAGNUSARCHIVES.Focus.Acquired" : "MAGNUSARCHIVES.Focus.AlreadyOwned"
      )), o.status === "acquired" && await this.actor.sheet?.render(!0);
    } catch (o) {
      C.#be(o);
    }
  }
  static async #Te(e, t) {
    if (!game.user.isGM) return;
    const { focusUuid: i, nodeId: a } = et(t), s = await Fe(this.actor, i);
    if (!(!s || !await foundry.applications.api.DialogV2.confirm({
      window: { title: game.i18n.localize("MAGNUSARCHIVES.Focus.GmOverrideAcquire") },
      content: `<div class="magnusarchives magnusarchives-dialog"><p>${game.i18n.localize("MAGNUSARCHIVES.Focus.GmOverrideConfirm")}</p></div>`,
      yes: { label: game.i18n.localize("MAGNUSARCHIVES.Focus.GmOverrideAcquire") },
      no: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Cancel") }
    })))
      try {
        await game.magnusarchives.services.focusAcquisition.acquireWithGmOverride(
          this.actor,
          s,
          a
        ), ui.notifications.info(game.i18n.localize("MAGNUSARCHIVES.Focus.Acquired")), await this.actor.sheet?.render(!0);
      } catch (r) {
        C.#be(r);
      }
  }
  static async #ze(e, t) {
    const i = t.dataset.kind;
    i !== "other" && !Qn.includes(i) || await Dd(
      this.actor,
      i
    );
  }
  static async #Pe(e, t) {
    const i = t.dataset.purchaseId;
    i && await Fd(
      this.actor,
      i
    );
  }
  static async #xe() {
    await Td(this.actor);
  }
  static async #qe() {
    await game.magnusarchives.services.advancement.completeProgressionGuidance(
      this.actor
    ), await this.render({ force: !0 });
  }
  static async #Oe() {
    await game.magnusarchives.services.advancement.resetProgressionGuidance(
      this.actor
    ), await this.render({ force: !0 });
  }
  static async #Be() {
    await es(this.actor);
  }
  static async #Le(e, t) {
    const i = t.dataset.focusUuid;
    i && await xd(this.actor, i);
  }
  static async #je() {
    game.user.isGM && (this.#n = !this.#n, await this.render({ force: !0 }));
  }
  static async #We(e, t) {
    const { focusUuid: i, nodeId: a } = et(t), s = await Fe(this.actor, i);
    s && (await os(
      this.actor,
      s,
      a
    ), await this.render({ force: !0 }));
  }
  static async #_e(e, t) {
    if (!game.user.isGM || !this.#n) return;
    const { focusUuid: i, nodeId: a } = et(t), s = await Fe(this.actor, i);
    s && (await wu(
      this.actor,
      s,
      a
    ), await this.render({ force: !0 }));
  }
  static async #Ke(e, t) {
    if (!game.user.isGM || !this.#n) return;
    const { focusUuid: i, nodeId: a } = et(t), s = await Fe(this.actor, i);
    s && (await os(
      this.actor,
      s,
      a
    ), await this.render({ force: !0 }));
  }
  static async #Xe() {
    await Au(this.actor);
  }
  static async #Ye() {
    await Su(this.actor);
  }
  static async #Je() {
    game.user.isGM && await ss(this.actor, "skipped");
  }
  static async #Qe() {
    game.user.isGM && await ss(this.actor, "manual");
  }
  static async #Ze(e, t) {
    const { focusUuid: i, nodeId: a } = et(t), s = await Fe(this.actor, i);
    if (!s) {
      ui.notifications.error(game.i18n.localize("MAGNUSARCHIVES.Focus.Errors.FocusUnavailable"));
      return;
    }
    try {
      const o = await game.magnusarchives.services.focusAcquisition.restoreAbility(
        this.actor,
        s,
        a
      );
      ui.notifications.info(game.i18n.localize(
        o.status === "restored" ? "MAGNUSARCHIVES.Focus.AbilityRestored" : "MAGNUSARCHIVES.Focus.AbilityAlreadyPresent"
      )), o.status === "restored" && await this.actor.sheet?.render(!0);
    } catch (o) {
      C.#be(o);
    }
  }
  static #be(e) {
    if (!(e instanceof We)) {
      if (e instanceof ue) {
        ui.notifications.error(game.i18n.localize(rm[e.code]));
        return;
      }
      console.error(e), ui.notifications.error(game.i18n.localize("MAGNUSARCHIVES.Focus.Errors.Unexpected"));
    }
  }
  async _prepareContext(e) {
    this.element?.isConnected && (this.#o = gd(this.element), this.#d = this.#o.activeTab);
    const t = await super._prepareContext(e), i = qu([...this.actor.items].filter((g) => g.type === "skill").map((g) => {
      const b = g, F = game.magnusarchives.services.skills.configuredPool(b);
      return {
        id: b.id,
        name: b.name,
        rank: b.system.rank,
        rankLabel: game.i18n.localize(`MAGNUSARCHIVES.Skill.Ranks.${b.system.rank}`),
        poolLabel: F ? game.i18n.localize(`MAGNUSARCHIVES.Pools.${F[0].toUpperCase()}${F.slice(1)}`) : game.i18n.localize("MAGNUSARCHIVES.Skill.ChoosePool")
      };
    }), this.#a), a = Bu([...this.actor.items].filter((g) => g.type === "ability").map((g) => g));
    this.#l.retain(a.map((g) => g.id));
    const s = await Promise.all(a.map(async (g, b) => {
      const F = g, z = us(g), de = this.#l.isExpanded(g.id), Ve = Eo(
        z.cost.amount,
        z.cost.pools,
        om,
        {
          pair: game.i18n.localize("MAGNUSARCHIVES.Ability.CostDisplay.Or"),
          middle: game.i18n.localize("MAGNUSARCHIVES.Ability.CostDisplay.Separator"),
          final: game.i18n.localize("MAGNUSARCHIVES.Ability.CostDisplay.FinalOr")
        },
        z.cost.scalable
      ), mt = z.description ? await foundry.applications.ux.TextEditor.implementation.enrichHTML(
        z.description,
        { async: !0, relativeTo: F }
      ) : "";
      return {
        id: g.id,
        name: g.name,
        archived: z.archived,
        startsArchivedGroup: z.archived && (b === 0 || a[b - 1].system.archived !== !0),
        canPay: this.isEditable && z.cost.payable,
        canDelete: this.isEditable && z.canDelete,
        expanded: de,
        costLabel: Ve,
        enrichedDescription: mt,
        hasDescription: !!z.description
      };
    })), o = this.actor, r = [...this.actor.items].filter((g) => g.type === "weapon" || g.type === "shield" || g.type === "armor");
    r.filter((g) => g.type === "shield" && !!g.system.equipped).length > 1 && this.isEditable && await game.magnusarchives.services.shields.normalizeEquipped(
      o
    ), this.#s.retain(r.map((g) => g.id));
    const u = async (g, b) => b ? foundry.applications.ux.TextEditor.implementation.enrichHTML(b, { async: !0, relativeTo: g }) : "", d = (await Promise.all(r.filter((g) => g.type === "weapon").map(async (g) => {
      const b = g, F = b.system.description.trim();
      return {
        id: b.id,
        name: b.name,
        category: game.i18n.localize(`MAGNUSARCHIVES.Combat.Weapon.Category.${b.system.category}`),
        attackType: game.i18n.localize(`MAGNUSARCHIVES.Combat.Weapon.AttackType.${b.system.attackType}`),
        range: game.i18n.localize(`MAGNUSARCHIVES.Combat.Range.${b.system.rangeCategory}`),
        damage: game.magnusarchives.services.combat.weaponBaseDamage(b),
        depletionEnabled: b.system.depletion.enabled,
        depletionLabel: b.system.depletion.enabled ? un(b.system.depletion) : "",
        ammoEnabled: b.system.ammo.enabled,
        ammoLabel: b.system.ammo.enabled ? `${b.system.ammo.value} / ${b.system.ammo.max}` : "",
        canAttack: game.magnusarchives.services.weapons.ammunition(b).canAttack,
        depleted: !!b.system.depleted,
        freelyUsed: game.magnusarchives.services.combat.weaponFreelyUsed(o, b),
        expanded: this.#s.isExpanded(b.id),
        hasDescription: !!F,
        enrichedDescription: await u(g, F)
      };
    }))).sort((g, b) => g.name.localeCompare(b.name)), p = (await Promise.all(r.filter((g) => g.type === "armor").map(async (g) => {
      const b = g, F = b.system.description.trim(), z = b.system.depletion;
      return {
        id: b.id,
        name: b.name,
        category: game.i18n.localize(`MAGNUSARCHIVES.Combat.Armor.Category.${b.system.category}`),
        equipped: b.system.equipped,
        freelyUsed: game.magnusarchives.services.combat.armorFreelyUsed(o, b),
        depletionEnabled: !!z?.enabled,
        depletionLabel: z?.enabled ? un(z) : "",
        depleted: !!b.system.depleted,
        expanded: this.#s.isExpanded(b.id),
        hasDescription: !!F,
        enrichedDescription: await u(g, F)
      };
    }))).sort((g, b) => g.name.localeCompare(b.name)), y = (await Promise.all(r.filter((g) => g.type === "shield").map(async (g) => {
      const b = g, F = b.system.description.trim(), z = b.system.depletion, de = Mi({
        minor: b.system.wounds.minor.length,
        moderate: b.system.wounds.moderate.length,
        major: b.system.wounds.major.length
      }, b.system.derived.capacities).map((Ve) => ({
        ...Ve,
        label: game.i18n.localize(`MAGNUSARCHIVES.Wounds.Severity.${Ve.severity}`),
        shortLabel: game.i18n.localize(`MAGNUSARCHIVES.Hud.Wounds.${Ve.severity}`)
      }));
      return {
        id: b.id,
        name: b.name,
        equipped: b.system.equipped,
        broken: game.magnusarchives.services.shields.isBroken(b),
        minor: b.system.wounds.minor.length,
        moderate: b.system.wounds.moderate.length,
        major: b.system.wounds.major.length,
        capacities: b.system.derived.capacities,
        woundTracks: de,
        depletionEnabled: !!z?.enabled,
        depletionLabel: z?.enabled ? un(z) : "",
        depleted: !!b.system.depleted,
        expanded: this.#s.isExpanded(b.id),
        hasDescription: !!F,
        enrichedDescription: await u(g, F)
      };
    }))).sort((g, b) => g.name.localeCompare(b.name)), m = y.filter((g) => g.equipped).length > 1, h = this.actor.system, f = [], A = [], v = [];
    for (const g of h.focusProgress ?? []) {
      const b = await Fe(this.actor, g.focusUuid);
      if (!b || b.type !== "focus") {
        A.push(g.focusUuid);
        continue;
      }
      v.push({
        uuid: g.focusUuid,
        name: b.name,
        provenance: g.provenance ?? "additional"
      });
      const F = await game.magnusarchives.services.focusTrees.prepare(b, {
        characterTier: L(this.actor.system),
        progress: g,
        editable: this.isEditable,
        missingOwnedNodeIds: game.magnusarchives.services.focusAcquisition.missingOwnedNodeIds(
          this.actor,
          b,
          g
        ),
        gmOverrideAllowed: game.user.isGM,
        gmProgressionEdit: this.#n
      });
      f.push({
        ...F,
        provenance: g.provenance ?? "additional",
        provenanceLabel: `MAGNUSARCHIVES.Focus.Association.${g.provenance === "creation" ? "Creation" : "Additional"}`,
        ownedCount: g.ownedNodeIds.length
      });
    }
    const E = game.magnusarchives.services.advancement.view(
      this.actor,
      rt()
    ), H = game.magnusarchives.services.advancement.progressionGuidance(
      this.actor,
      rt()
    ), R = [...this.actor.items].filter((g) => g.type === "characterType"), G = R.map((g) => ({ id: g.id, name: g.name })), P = [...this.actor.items].filter((g) => g.type === "species").map((g) => ({ id: g.id, name: g.name })), X = [...this.actor.items].filter((g) => g.type === "descriptor").map((g) => {
      const b = g.system.instance, F = b?.role ?? "custom";
      return {
        id: g.id,
        name: g.name,
        role: F,
        instanceId: b?.instanceId ?? g.id,
        attachedAt: b?.attachedAt ?? 0,
        roleLabel: game.i18n.localize(`MAGNUSARCHIVES.Packages.Role.${F}`)
      };
    }), M = new Map([...this.actor.items].filter((g) => g.type === "characterType" || g.type === "descriptor" || g.type === "species").map((g) => [g.system.instance?.instanceId ?? "", g.name])), D = [...this.actor.items].filter((g) => {
      const b = g.system.grantedBy;
      return b?.instanceId && (b.kind === "type" || b.kind === "descriptor" || b.kind === "species");
    }).map((g) => {
      const b = g.system.grantedBy;
      return {
        id: g.id,
        name: g.name,
        type: g.type,
        sourceName: M.get(b.instanceId) ?? game.i18n.localize("MAGNUSARCHIVES.Packages.Retained"),
        grantId: b.grantId,
        status: b.status,
        replacementLabel: b.replacement?.active ? `${b.replacement.originalName} → ${b.replacement.replacementName}` : ""
      };
    }), I = this.actor.system, ne = $a(
      I.powerShifts ?? [],
      R
    ), _ = dl(
      ne,
      cl(R)
    ), He = {
      enabled: I.presentation.powerShiftsEnabled,
      allocated: _.allocated,
      available: _.available,
      overBudget: _.overBudget,
      legacy: (I.powerShifts ?? []).length === 0 && ne.some((g) => g.id.startsWith("legacy-")),
      entries: ne.map((g) => ({
        ...g,
        categoryWarning: _.categoryWarnings.has(g.category.trim().toLocaleLowerCase("en-US"))
      }))
    }, O = await game.magnusarchives.services.genres.active(
      this.actor
    ), Q = O ? {
      attached: !0,
      available: !0,
      name: O.name,
      uuid: O.uuid,
      img: O.img,
      provenance: I.genre.provenance,
      totalEffortCapMode: O.system.options.totalEffortCapMode,
      totalEffortCapLabel: game.i18n.localize(
        `MAGNUSARCHIVES.Genre.EffortCap.${O.system.options.totalEffortCapMode}`
      )
    } : {
      attached: !!I.genre.sourceUuid,
      available: !1,
      name: I.genre.sourceUuid,
      uuid: I.genre.sourceUuid,
      img: "",
      provenance: I.genre.provenance,
      totalEffortCapMode: "core",
      totalEffortCapLabel: game.i18n.localize("MAGNUSARCHIVES.Genre.EffortCap.core")
    }, $e = [...this.actor.items].filter((g) => On.includes(g.type)).sort((g, b) => g.name.localeCompare(b.name, "en-US"));
    this.#r.retain($e.map((g) => g.id));
    const Se = (await Promise.all($e.map(async (g) => {
      const b = ju(g);
      if (!b) return null;
      const F = this.#r.isExpanded(g.id), z = b.description ? await foundry.applications.ux.TextEditor.implementation.enrichHTML(
        b.description,
        { async: !0, relativeTo: g }
      ) : "";
      return {
        ...b,
        expanded: F,
        hasDescription: !!b.description,
        enrichedDescription: z,
        depletionLabel: b.depletion?.enabled ? b.depletion.formula : "",
        powerLabel: b.power ? game.i18n.localize(`MAGNUSARCHIVES.Cypher.Power.${b.power}`) : "",
        canRollLevel: b.levelRollable && b.usable,
        canRollDepletion: !!(b.depletion?.enabled && b.usable)
      };
    }))).filter((g) => g !== null), Ie = {
      cypherLimit: I.derived.cypherLimit.max,
      equipment: Se.filter((g) => g.type === "equipment"),
      cyphers: Se.filter((g) => g.type === "cypher"),
      artifacts: Se.filter((g) => g.type === "artifact")
    }, ce = v.find((g) => g.provenance === "creation") ?? v[0], Z = Vu({
      descriptors: X,
      ...P[0] ? { species: { id: P[0].id, name: P[0].name } } : {},
      ...G[0] ? { type: { id: G[0].id, name: G[0].name } } : {},
      ...ce ? { focus: { uuid: ce.uuid, name: ce.name } } : {},
      hideFocus: I.presentation.hideFocusInSentence,
      descriptorLabel: I.identity?.descriptorLabel ?? ""
    }), Ae = {
      ...Z,
      descriptors: Z.descriptors.map((g) => ({
        ...g,
        displayName: g.missing ? game.i18n.localize("MAGNUSARCHIVES.Hud.Placeholder.Descriptor") : g.displayName
      })),
      type: {
        ...Z.type,
        displayName: Z.type.missing ? game.i18n.localize("MAGNUSARCHIVES.Hud.Placeholder.Type") : Z.type.displayName
      },
      focus: {
        ...Z.focus,
        displayName: Z.focus.missing ? game.i18n.localize("MAGNUSARCHIVES.Hud.Placeholder.Focus") : Z.focus.displayName
      }
    }, pe = Mi({
      minor: I.wounds.minor.length,
      moderate: I.wounds.moderate.length,
      major: I.wounds.major.length
    }, I.derived.wounds.capacities).map((g) => ({
      ...g,
      shortLabel: game.i18n.localize(`MAGNUSARCHIVES.Hud.Wounds.${g.severity}`),
      pips: g.pips.map((b) => ({
        ...b,
        tooltip: game.i18n.format("MAGNUSARCHIVES.Hud.SetWoundCount", {
          severity: game.i18n.localize(`MAGNUSARCHIVES.Wounds.Severity.${g.severity}`),
          count: b.targetCount
        })
      })),
      tooltip: game.i18n.format("MAGNUSARCHIVES.Hud.CharacterWoundTooltip", {
        severity: game.i18n.localize(`MAGNUSARCHIVES.Wounds.Severity.${g.severity}`),
        count: g.count,
        capacity: g.capacity
      })
    })), N = y.filter((g) => g.equipped), S = N.find((g) => !g.broken) ?? N[0], J = S ? {
      ...S,
      tracks: Mi({
        minor: S.minor,
        moderate: S.moderate,
        major: S.major
      }, S.capacities).map((g) => ({
        ...g,
        itemId: S.id,
        shortLabel: game.i18n.localize(`MAGNUSARCHIVES.Hud.Wounds.${g.severity}`),
        pips: g.pips.map((b) => ({
          ...b,
          tooltip: game.i18n.format("MAGNUSARCHIVES.Hud.SetShieldWoundCount", {
            shield: S.name,
            severity: game.i18n.localize(`MAGNUSARCHIVES.Wounds.Severity.${g.severity}`),
            count: b.targetCount
          })
        })),
        tooltip: game.i18n.format("MAGNUSARCHIVES.Hud.ShieldWoundTooltip", {
          shield: S.name,
          severity: game.i18n.localize(`MAGNUSARCHIVES.Wounds.Severity.${g.severity}`),
          count: g.count,
          capacity: g.capacity
        })
      }))
    } : null, Ke = pe.map((g, b) => ({
      character: g,
      shield: J?.tracks[b] ?? null
    })), mi = {
      appearance: Nl(I.appearance, this.actor.img),
      identity: Ae,
      stats: {
        tier: I.derived.tier.value,
        effort: I.derived.effort.max,
        xp: I.xp
      },
      playerIntrusion: {
        visible: this.isEditable,
        canUse: this.isEditable && game.magnusarchives.services.playerIntrusions.canUse(
          this.actor
        ),
        tooltip: game.i18n.localize(I.xp >= 1 ? "MAGNUSARCHIVES.Intrusion.Player.Tooltip" : "MAGNUSARCHIVES.Intrusion.Player.RequiresTooltip")
      },
      pools: k.map((g) => ({
        key: g,
        isMight: g === "might",
        canRally: g === "might" && game.magnusarchives.services.rally.canApply(this.actor),
        label: game.i18n.localize(`MAGNUSARCHIVES.Pools.${g[0].toUpperCase()}${g.slice(1)}`),
        value: I.stats[g].value,
        max: I.derived.pools[g].max,
        edge: I.derived.pools[g].edge,
        gauge: cr(I.stats[g].value, I.derived.pools[g].max)
      })),
      wounds: {
        tracks: pe,
        rows: Ke,
        hindrance: I.derived.wounds.hindrance,
        hindranceModifier: Ee("hinder", I.derived.wounds.hindrance),
        dead: I.derived.wounds.dead
      },
      stress: {
        ...Tu(I.stress.value, I.stress.supernatural),
        hindranceModifier: Ee("hinder", I.derived.stress.level),
        canEdit: this.isEditable
      },
      damageTrack: {
        hurtAvailable: I.derived.damageTrack.hurtAvailable,
        dead: I.derived.damageTrack.dead,
        canEdit: this.isEditable,
        steps: Fu(
          I.damageTrack.step,
          I.derived.damageTrack.hurtAvailable
        ).map((g) => ({
          ...g,
          label: game.i18n.localize(g.label),
          hint: game.i18n.localize(g.hintLabel),
          notes: g.noteLabels.map((b) => game.i18n.localize(b))
        }))
      },
      recoveries: zu(I.recovery.slots).map((g) => ({
        ...g,
        label: game.i18n.localize(`MAGNUSARCHIVES.Recovery.${g.type}`)
      })),
      recoveryFormulaLabel: I.derived.recovery.formula,
      canResetRecoveries: game.user.isGM,
      shield: J
    }, Ur = (g, b) => [
      ...this.actor.items
    ].filter((F) => F.type !== "characterType" && F.type !== "species" ? !1 : F.system[g === "weapon" ? "weaponUse" : "armorUse"]?.[b] === !0).map((F) => F.name), Ra = (g, b, F, z) => b.map((de) => {
      const Ve = Ur(g, de), mt = F.includes(de), pi = Ve.length > 0, Tr = z.includes(de), zr = mt && pi ? game.i18n.format("MAGNUSARCHIVES.Settings.Character.FamiliarityManualAndGranted", { sources: Ve.join(", ") }) : mt ? game.i18n.localize("MAGNUSARCHIVES.Settings.Character.FamiliarityManual") : pi ? game.i18n.format("MAGNUSARCHIVES.Settings.Character.FamiliarityGranted", { sources: Ve.join(", ") }) : game.i18n.localize("MAGNUSARCHIVES.Settings.Character.FamiliarityAbsent");
      return {
        family: g,
        category: de,
        label: game.i18n.localize(`MAGNUSARCHIVES.Combat.${g === "weapon" ? "Weapon" : "Armor"}.Category.${de}`),
        manual: mt,
        packageGranted: pi,
        effective: Tr,
        canToggle: this.isEditable && (mt || !pi),
        sourceHint: zr
      };
    }), kr = {
      weapons: Ra(
        "weapon",
        Le,
        I.proficiencies.weaponCategories,
        I.derived.packages.weaponCategories
      ),
      armor: Ra(
        "armor",
        je,
        I.proficiencies.armorCategories,
        I.derived.packages.armorCategories
      ),
      weaponFamilies: le([
        ...I.proficiencies.weaponFamilies,
        ...I.derived.packages.weaponFamilies ?? []
      ]).map((g) => {
        const b = [...this.actor.items].filter((z) => z.type === "characterType").filter((z) => {
          const de = z.system;
          return le([
            ...de.weaponFamilies ?? [],
            ...Bi(de.weaponFamilyUse)
          ]).includes(g);
        }).map((z) => z.name), F = I.proficiencies.weaponFamilies.includes(g);
        return {
          id: g,
          label: At(g),
          manual: F,
          packageGranted: b.length > 0,
          canRemove: this.isEditable && F,
          sourceHint: b.length > 0 ? game.i18n.format("MAGNUSARCHIVES.Settings.Character.FamiliarityGranted", { sources: b.join(", ") }) : game.i18n.localize("MAGNUSARCHIVES.Settings.Character.FamiliarityManual")
        };
      })
    }, Hr = {
      tier: "MAGNUSARCHIVES.Character.Tier",
      effort: "MAGNUSARCHIVES.Character.Effort",
      mightMax: "MAGNUSARCHIVES.Overrides.MightMax",
      mightEdge: "MAGNUSARCHIVES.Overrides.MightEdge",
      speedMax: "MAGNUSARCHIVES.Overrides.SpeedMax",
      speedEdge: "MAGNUSARCHIVES.Overrides.SpeedEdge",
      intellectMax: "MAGNUSARCHIVES.Overrides.IntellectMax",
      intellectEdge: "MAGNUSARCHIVES.Overrides.IntellectEdge"
    }, $r = Zi.map((g) => {
      const b = kn(I, g);
      return { ...b, label: game.i18n.localize(Hr[g]), hasOverride: b.override !== null };
    }), Dt = I.overrides.wounds ?? { minor: 0, moderate: 0, major: 0 }, Vr = {
      hasOverride: Object.values(Dt).some((g) => g !== 0),
      calculated: I.derived.wounds.calculatedCapacities,
      modifiers: Dt,
      modifierLabels: {
        minor: Sn(Dt.minor),
        moderate: Sn(Dt.moderate),
        major: Sn(Dt.major)
      },
      effective: I.derived.wounds.capacities
    }, Dr = {
      hasOverride: I.recovery.customized || I.recovery.rollModifier !== 0,
      calculatedSlots: 4,
      calculatedFormula: I.derived.recovery.calculatedFormula,
      effectiveSlots: I.recovery.slots.length,
      effectiveFormula: I.derived.recovery.formula,
      modifier: I.recovery.rollModifier
    }, Na = [game.i18n.localize(H.focusAbilityCount === 2 ? "MAGNUSARCHIVES.Advancement.Guidance.TwoFocusAbilities" : "MAGNUSARCHIVES.Advancement.Guidance.FocusAbility")];
    H.includesGenreAbility && Na.push(game.i18n.localize("MAGNUSARCHIVES.Advancement.Guidance.GenreAbility"));
    const Ma = typeof this.actor._source?.system?.notes == "string" ? this.actor._source.system.notes : "", Fr = Ma ? await foundry.applications.ux.TextEditor.implementation.enrichHTML(Ma, {
      async: !0,
      relativeTo: this.actor
    }) : "";
    return {
      ...t,
      actor: this.actor,
      system: this.actor.system,
      systemFields: la(this.actor),
      editable: this.isEditable,
      enriched: { notes: Fr },
      arc: cm(I.arc),
      familiarities: kr,
      powerShifts: He,
      characterOverrides: $r,
      woundOverride: Vr,
      recoveryOverride: Dr,
      genre: Q,
      woundHindranceModifier: Ee("hinder", I.derived.wounds.hindrance),
      header: mi,
      skillItems: i,
      skillSort: {
        mode: this.#a,
        nameActive: this.#a === "name",
        rankActive: this.#a === "rank"
      },
      abilityItems: s,
      inventory: Ie,
      weaponItems: d,
      armorItems: p,
      shieldItems: y,
      multipleShieldsEquipped: m,
      focusTrees: f,
      missingFoci: A,
      advancement: {
        ...E,
        options: E.options.map((g) => ({
          ...g,
          label: `MAGNUSARCHIVES.Advancement.Option.${g.kind}`,
          shortLabel: `MAGNUSARCHIVES.Advancement.Short.${g.kind}`,
          xpCost: E.policy.xpCost
        })),
        other: {
          ...E.other,
          label: "MAGNUSARCHIVES.Advancement.OtherAdvancement",
          shortLabel: "MAGNUSARCHIVES.Advancement.Short.other",
          xpCost: E.policy.xpCost
        },
        purchases: h.advancement.purchases.map((g) => ({
          ...g,
          label: g.kind === "other" ? `MAGNUSARCHIVES.Advancement.Other.${g.otherKind}` : `MAGNUSARCHIVES.Advancement.Option.${g.kind}`
        })),
        guidance: {
          ...H,
          title: game.i18n.format("MAGNUSARCHIVES.Advancement.Guidance.Title", { tier: H.tier }),
          reminder: Na.join(" · ")
        }
      },
      isGM: game.user.isGM,
      gmProgressionEdit: game.user.isGM && this.#n,
      typeItems: G,
      speciesItems: P,
      descriptorItems: X,
      primaryDescriptorItems: X.filter((g) => g.role === "primary"),
      additionalDescriptorItems: X.filter((g) => g.role === "additional" || g.role === "custom"),
      speciesDescriptorItems: X.filter((g) => g.role === "speciesGranted"),
      packageGrantedItems: D,
      coreCreation: this.actor.system.creation,
      activeArmorCategoryLabel: game.i18n.localize(
        `MAGNUSARCHIVES.Combat.Armor.Category.${o.system.derived.combat.armor.category}`
      ),
      recoveryAvailableLabels: this.actor.system.derived.recovery.availableTypes.map((g) => game.i18n.localize(`MAGNUSARCHIVES.Recovery.${g}`)).join(", "),
      phase: "0.1.0"
    };
  }
}
class Ce extends Error {
  constructor(e, t) {
    super(t), this.code = e, this.name = "FocusTreeEditorError";
  }
  code;
}
class dm {
  #e = null;
  #t = null;
  get selectedNodeId() {
    return this.#e;
  }
  get connectionSourceNodeId() {
    return this.#t;
  }
  select(e) {
    this.#e = e;
  }
  clearSelection(e) {
    (e === void 0 || this.#e === e) && (this.#e = null), (e === void 0 || this.#t === e) && (this.#t = null);
  }
  startConnection() {
    if (!this.#e)
      throw new Ce("node-not-selected", "Select a Focus node before connecting.");
    return this.#t = this.#e, this.#t;
  }
  connectionTo(e) {
    if (!this.#t)
      throw new Ce("node-not-selected", "No source node is selected for the connection.");
    return { from: this.#t, to: e };
  }
  finishConnection(e) {
    this.#e = e, this.#t = null;
  }
  cancelConnection() {
    this.#t = null;
  }
  reset() {
    this.#e = null, this.#t = null;
  }
}
function um() {
  return globalThis.crypto?.randomUUID?.().replaceAll("-", "") ?? `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
}
function Te(n) {
  return {
    version: n.version,
    nodes: n.nodes.map((e) => ({
      id: e.id,
      abilityUuid: e.abilityUuid,
      abilitySnapshot: {
        name: e.abilitySnapshot.name,
        ...e.abilitySnapshot.description !== void 0 ? { description: e.abilitySnapshot.description } : {}
      },
      tier: e.tier,
      position: { x: e.position.x, y: e.position.y }
    })),
    connections: n.connections.map((e) => ({ ...e }))
  };
}
function As(n) {
  const e = n._source?.system?.description ?? n.system?.description;
  return {
    name: n.name,
    description: typeof e == "string" ? e : ""
  };
}
function bs(n) {
  if (n.type !== "ability")
    throw new Ce("not-ability", "Only Ability Items can be added to a Focus Tree.");
  if (!n.uuid.trim())
    throw new Ce("ability-uuid-missing", "The Ability must have a resolvable UUID.");
}
function ws(n) {
  if (!Number.isInteger(n) || n < 1 || n > 6)
    throw new Ce("invalid-tier", "Focus node Tier must be an integer from 1 to 6.");
}
function vs(n, e) {
  return n.nodes.filter((t) => t.tier === e).sort((t, i) => {
    const a = t.position.x ?? Number.MAX_SAFE_INTEGER, s = i.position.x ?? Number.MAX_SAFE_INTEGER;
    return a - s || t.id.localeCompare(i.id);
  });
}
class mm {
  #e;
  #t;
  #i;
  #n = !1;
  constructor(e, t = um) {
    this.#e = t, this.#t = Te(e), this.#i = Te(e);
  }
  get graph() {
    return Te(this.#i);
  }
  get dirty() {
    return this.#n;
  }
  diagnostics() {
    return Tn(this.#i);
  }
  addAbility(e, t = 1) {
    bs(e), ws(t);
    const a = vs(this.#i, t).reduce((o, r) => Math.max(o, r.position.x ?? -1), -1), s = {
      id: this.#r("node", new Set(this.#i.nodes.map((o) => o.id))),
      abilityUuid: e.uuid,
      abilitySnapshot: As(e),
      tier: t,
      position: { x: a + 1, y: null }
    };
    return this.#i = { ...this.#i, nodes: [...this.#i.nodes, s] }, this.#n = !0, Te({ ...this.#i, nodes: [s] }).nodes[0];
  }
  setTier(e, t) {
    return ws(t), this.#l(e, (i) => ({ ...i, tier: t }));
  }
  moveNode(e, t) {
    const i = this.#a(e), a = vs(this.#i, i.tier), s = a.findIndex((y) => y.id === e), o = t === "left" ? s - 1 : s + 1;
    if (o < 0 || o >= a.length) return Te({
      version: this.#i.version,
      nodes: [i],
      connections: []
    }).nodes[0];
    const r = a[o], l = a[t === "left" ? o - 1 : o + 1], u = r.position.x ?? o, d = l?.position.x, p = t === "left" ? d == null ? u - 1 : (d + u) / 2 : d == null ? u + 1 : (u + d) / 2;
    return this.#l(e, (y) => ({
      ...y,
      position: { ...y.position, x: p }
    }));
  }
  deleteNode(e) {
    const t = this.#a(e), i = this.#i.connections.filter((s) => s.from !== e && s.to !== e), a = this.#i.connections.length - i.length;
    return this.#i = {
      ...this.#i,
      nodes: this.#i.nodes.filter((s) => s.id !== e),
      connections: i
    }, this.#n = !0, { node: t, removedConnections: a };
  }
  connect(e, t) {
    if (this.#a(e), this.#a(t), e === t)
      throw new Ce("self-connection", "A Focus node cannot connect to itself.");
    if (this.#i.connections.some((a) => a.from === e && a.to === t))
      throw new Ce(
        "duplicate-connection",
        `Focus connection '${e}' -> '${t}' already exists.`
      );
    const i = {
      id: this.#r(
        "connection",
        new Set(this.#i.connections.map((a) => a.id))
      ),
      from: e,
      to: t
    };
    return this.#i = {
      ...this.#i,
      connections: [...this.#i.connections, i]
    }, this.#n = !0, { ...i };
  }
  deleteConnection(e) {
    const t = this.#i.connections.find((i) => i.id === e);
    if (!t)
      throw new Ce(
        "connection-not-found",
        `Focus connection '${e}' was not found.`
      );
    return this.#i = {
      ...this.#i,
      connections: this.#i.connections.filter((i) => i.id !== e)
    }, this.#n = !0, { ...t };
  }
  clearConnections() {
    const e = this.#i.connections.length;
    return e === 0 ? 0 : (this.#i = { ...this.#i, connections: [] }, this.#n = !0, e);
  }
  refreshSnapshot(e, t) {
    bs(t);
    const i = this.#a(e);
    if (t.uuid !== i.abilityUuid)
      throw new Ce(
        "ability-source-mismatch",
        "The refreshed Ability does not match the node source UUID."
      );
    return this.#l(e, (a) => ({
      ...a,
      abilitySnapshot: As(t)
    }));
  }
  cancel() {
    return this.#i = Te(this.#t), this.#n = !1, this.graph;
  }
  async save(e) {
    const t = Tn(this.#i), i = t.filter((s) => s.severity === "error");
    if (i.length > 0) throw new Mt(i);
    const a = this.graph;
    return await e(a), this.#t = Te(a), this.#i = Te(a), this.#n = !1, { graph: a, diagnostics: t };
  }
  #a(e) {
    const t = this.#i.nodes.find((i) => i.id === e);
    if (!t)
      throw new Ce("node-not-found", `Focus node '${e}' was not found.`);
    return t;
  }
  #l(e, t) {
    const i = this.#a(e), a = t(i);
    return this.#i = {
      ...this.#i,
      nodes: this.#i.nodes.map((s) => s.id === e ? a : s)
    }, this.#n = !0, Te({ version: this.#i.version, nodes: [a], connections: [] }).nodes[0];
  }
  #r(e, t) {
    for (let i = 0; i < 100; i += 1) {
      const a = this.#e().replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 24), s = `${e}-${a}`;
      if (a && !t.has(s)) return s;
    }
    throw new Ce(
      "unique-id-unavailable",
      `Unable to generate a unique ${e} ID.`
    );
  }
}
function pm(n) {
  const e = n.querySelector(".magnusarchives-sheet.magnusarchives-item"), t = n.querySelector(".window-content"), i = [...n.querySelectorAll(
    ".magnusarchives-focus-tree-section[data-focus-uuid]"
  )].map((a) => {
    const s = a.querySelector(".focus-tree-scroll");
    return {
      focusUuid: a.dataset.focusUuid ?? "",
      left: s?.scrollLeft ?? 0,
      top: s?.scrollTop ?? 0
    };
  });
  return {
    vertical: e?.scrollTop ?? 0,
    windowVertical: t?.scrollTop ?? 0,
    trees: i
  };
}
function fm(n, e) {
  const t = n.querySelector(".magnusarchives-sheet.magnusarchives-item");
  t && (t.scrollTop = e.vertical);
  const i = n.querySelector(".window-content");
  i && (i.scrollTop = e.windowVertical);
  const a = [...n.querySelectorAll(
    ".magnusarchives-focus-tree-section[data-focus-uuid]"
  )];
  for (const s of e.trees) {
    const r = a.find((l) => l.dataset.focusUuid === s.focusUuid)?.querySelector(".focus-tree-scroll");
    r && (r.scrollLeft = s.left, r.scrollTop = s.top);
  }
}
class gm extends Error {
  constructor(e) {
    super("Only one Shield may be equipped at a time."), this.shieldIds = e, this.name = "MultipleEquippedShieldsError";
  }
  shieldIds;
}
class pr extends Error {
  constructor(e, t, i) {
    super(`Shield ${e} capacity cannot be lower than its current Wound count (${i}).`), this.severity = e, this.requested = t, this.current = i, this.name = "ShieldCapacityBelowWoundsError";
  }
  severity;
  requested;
  current;
}
class fr {
  #e;
  constructor(e) {
    this.#e = e;
  }
  shields(e) {
    return [...e.items].filter((t) => {
      const i = t;
      return i?.type === "shield" && !!i.system;
    });
  }
  equipped(e) {
    const t = this.shields(e).filter((i) => i.system.equipped);
    if (t.length > 1) throw new gm(t.map((i) => i.id));
    return t[0] ?? null;
  }
  async normalizeEquipped(e) {
    const t = this.shields(e).filter((s) => s.system.equipped);
    if (t.length <= 1) return t[0] ?? null;
    const [i, ...a] = [...t].sort((s, o) => Number(this.isBroken(s)) - Number(this.isBroken(o)) || s.name.localeCompare(o.name) || s.id.localeCompare(o.id));
    return await Promise.all(a.map((s) => s.update(
      { "system.equipped": !1 },
      { magnusarchivesShieldEquipmentSync: !0 }
    ))), i ?? null;
  }
  async setEquipped(e, t, i) {
    if (!this.shields(e).some((a) => a.id === t.id))
      throw new Error("Shield does not belong to this Character.");
    return i ? (await t.update({ "system.equipped": !0 }, { magnusarchivesShieldEquipmentSync: !0 }), await Promise.all(this.shields(e).filter((a) => a.id !== t.id && a.system.equipped).map((a) => a.update(
      { "system.equipped": !1 },
      { magnusarchivesShieldEquipmentSync: !0 }
    ))), t) : (await t.update({ "system.equipped": !1 }, { magnusarchivesShieldEquipmentSync: !0 }), null);
  }
  isBroken(e) {
    return e.system.wounds.major.length >= this.capacities(e).major;
  }
  capacities(e) {
    return e.system.derived?.capacities ?? e.system.woundCapacities ?? nt;
  }
  async setCapacity(e, t, i) {
    if (!Number.isInteger(i) || i < 0)
      throw new RangeError("Shield Wound capacity must be a non-negative whole number.");
    const a = e.system.wounds[t].length;
    if (i < a) throw new pr(t, i, a);
    await e.update({ [`system.woundCapacities.${t}`]: i });
  }
  canAbsorb(e) {
    const t = this.equipped(e);
    return !!(t && !this.isBroken(t));
  }
  async apply(e, t, i, a = {}) {
    const s = this.equipped(e);
    if (!s || s.id !== t.id) throw new Error("The Shield is not the equipped Shield.");
    return this.applyResolved(e, t, i, a);
  }
  /** Apply a deferred consequence to the exact Shield captured when the defense resolved. */
  async applyResolved(e, t, i, a = {}) {
    if (!this.shields(e).some((u) => u.id === t.id))
      throw new Error("Shield does not belong to this Character.");
    if (this.isBroken(t)) throw new Error("A Broken Shield cannot absorb another Wound.");
    const s = this.capacities(t), o = await this.#e.applyTrack(t, i, s, {
      ...a,
      label: a.label ?? `${i[0].toUpperCase()}${i.slice(1)} Shield Wound`,
      sourceUuid: a.sourceUuid ?? "magnusarchives.shield"
    }), { dead: r, ...l } = o;
    return {
      ...l,
      shield: t,
      broken: o.wounds.major.length >= s.major
    };
  }
  async edit(e, t, i, a) {
    return this.#e.editTrack(e, t, i, a);
  }
  async setCount(e, t, i) {
    return this.#e.setTrackCount(
      e,
      t,
      i,
      this.capacities(e)[t],
      { sourceUuid: "magnusarchives.manual.shield" }
    );
  }
  async delete(e, t, i) {
    const a = await this.#e.deleteTrack(e, t, i);
    return { ...a, broken: a.wounds.major.length >= this.capacities(e).major };
  }
}
function Cs(n) {
  return n.replace(/[&<>"']/g, (e) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[e]);
}
async function hm(n, e, t) {
  const i = n.system.wounds[e].find((s) => s.id === t);
  if (!i) throw new Error(`Shield Wound '${t}' was not found.`);
  const a = await foundry.applications.api.DialogV2.input({
    window: { title: game.i18n.localize("MAGNUSARCHIVES.Wounds.EditTitle") },
    content: `<div class="magnusarchives-dialog-fields">
      <label>${game.i18n.localize("MAGNUSARCHIVES.Wounds.Label")}<input name="label" type="text" value="${Cs(i.label)}"></label>
      <label>${game.i18n.localize("MAGNUSARCHIVES.Wounds.Description")}<textarea name="description">${Cs(i.description)}</textarea></label>
    </div>`,
    rejectClose: !1,
    ok: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Save") }
  });
  a && await game.magnusarchives.services.shields.edit(n, e, t, {
    label: String(a.label ?? ""),
    description: String(a.description ?? "")
  });
}
async function ym(n, e, t) {
  await foundry.applications.api.DialogV2.confirm({
    window: { title: game.i18n.localize("MAGNUSARCHIVES.Wounds.DeleteTitle") },
    content: `<div class="magnusarchives magnusarchives-dialog"><p>${game.i18n.localize("MAGNUSARCHIVES.Wounds.DeleteConfirm")}</p></div>`,
    rejectClose: !1,
    modal: !0,
    yes: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Delete") },
    no: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Cancel") }
  }) && await game.magnusarchives.services.shields.delete(n, e, t);
}
function Sm(n) {
  const e = n.roll === "attack", t = n.roll === "task", i = n.roll === "defense", a = t || i || n.rollModifier !== 0, s = e || n.attackModifier !== 0, o = e || n.damage !== 0, r = e || n.damageEffect !== "none", l = e || n.range.trim() !== "", u = e || n.targetMode !== "none";
  return {
    showIgnoresEdge: n.cost.amount > 0 && !!n.cost.allowedPools?.length || n.cost.ignoresEdge,
    showRollModifier: a,
    rollModifierLabel: t ? "task" : i ? "defense" : "general",
    showAttackModifier: s,
    showDamage: o,
    showDamageEffect: r,
    showRange: l,
    showTargetMode: u,
    hasConditionalFields: a || s || o || r || l || u
  };
}
function Am(n) {
  return n.defaultPool !== "choose" || n.category !== "general" || n.contexts.length > 0 || n.initiative;
}
function bm(n) {
  const e = n.querySelector("[data-item-sheet-scroll]"), t = n.querySelector("[data-item-focus-key]:focus"), i = t?.dataset.itemFocusKey;
  if (!t || !i) return { scrollTop: e?.scrollTop ?? 0 };
  let a = null, s = null, o = null;
  try {
    a = t.selectionStart, s = t.selectionEnd, o = t.selectionDirection;
  } catch {
  }
  return {
    scrollTop: e?.scrollTop ?? 0,
    focusedInput: {
      key: i,
      ...a === null ? {} : { selectionStart: a },
      ...s === null ? {} : { selectionEnd: s },
      ...o === null ? {} : { selectionDirection: o }
    }
  };
}
function wm(n, e) {
  const t = n.querySelector("[data-item-sheet-scroll]");
  if (t && (t.scrollTop = e.scrollTop), !e.focusedInput) return;
  const i = [...n.querySelectorAll("[data-item-focus-key]")].find((r) => r.dataset.itemFocusKey === e.focusedInput?.key);
  if (!i) return;
  i.focus({ preventScroll: !0 });
  const { selectionStart: a, selectionEnd: s, selectionDirection: o } = e.focusedInput;
  if (!(a === void 0 || s === void 0))
    try {
      i.setSelectionRange(a, s, o);
    } catch {
    }
}
function Ne(n) {
  return n.replace(/[&<>"']/g, (e) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[e]);
}
function ae(n) {
  ui.notifications.error(n instanceof Error ? n.message : String(n));
}
const vm = foundry.applications.api.HandlebarsApplicationMixin(
  foundry.applications.sheets.ItemSheetV2
), Es = /* @__PURE__ */ new Set([
  "rollDepletion",
  "reloadWeapon",
  "editFocusTree",
  "addFocusAbility",
  "saveFocusTree",
  "cancelFocusTree",
  "selectFocusEditorNode",
  "moveFocusNode",
  "setFocusNodeTier",
  "startFocusConnection",
  "completeFocusConnection",
  "cancelFocusConnection",
  "deleteFocusConnection",
  "clearFocusConnections",
  "refreshFocusSnapshot",
  "deleteFocusNode",
  "addPackageGrant",
  "addChoiceGroup",
  "addChoiceOption",
  "editSkillGrantNote",
  "refreshPackageGrant",
  "removePackageGrant",
  "addPoolBonusChoiceGroup",
  "editPoolBonusChoiceGroup",
  "removePoolBonusChoiceGroup",
  "setShieldWoundCount",
  "editShieldWound",
  "deleteShieldWound",
  "addGenreAbility",
  "refreshGenreAbility",
  "removeGenreAbility"
]);
class $ extends vm {
  #e = new Lo();
  #t = new dm();
  #i = new jo();
  #n = null;
  #a = null;
  #l = null;
  #r = null;
  #s = null;
  #c = null;
  #o = null;
  #d = /* @__PURE__ */ new Set();
  #u = /* @__PURE__ */ new Set();
  #A = null;
  #f = null;
  #p = null;
  #h = null;
  static #m(e) {
    const t = e.dataset.severity, i = e.dataset.woundId;
    if (!ge.includes(t) || !i)
      throw new Error("Invalid Shield Wound action data.");
    return { severity: t, woundId: i };
  }
  static async #S(e, t) {
    if (e.preventDefault(), e.stopPropagation(), !this.isEditable || this.item.actor && !game.user.isGM && !this.item.actor.testUserPermission(
      game.user,
      CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER
    )) return;
    const i = Bn(t.dataset);
    if (i.track !== "shield" || i.shieldId !== this.item.id)
      throw new Error("Invalid Shield Wound count action data.");
    await game.magnusarchives.services.shields.setCount(
      this.item,
      i.severity,
      i.count
    ), await this.render({ force: !0 });
  }
  static async #w(e, t) {
    const i = $.#m(t);
    await hm(this.item, i.severity, i.woundId);
  }
  static async #V(e, t) {
    const i = $.#m(t);
    await ym(this.item, i.severity, i.woundId);
  }
  static async #D() {
    !this.isEditable || this.item.type !== "weapon" || (await game.magnusarchives.services.weapons.reload(this.item), await this.render({ force: !0 }));
  }
  static DEFAULT_OPTIONS = {
    ...ra,
    classes: ["magnusarchives", "sheet", "item", "item-sheet"],
    actions: ca({
      rollDepletion: $.#ne,
      reloadWeapon: $.#D,
      openFocusNode: $.#ae,
      editFocusTree: $.#se,
      addFocusAbility: $.#oe,
      saveFocusTree: $.#I,
      cancelFocusTree: $.#re,
      selectFocusEditorNode: $.#le,
      moveFocusNode: $.#ce,
      setFocusNodeTier: $.#de,
      startFocusConnection: $.#ue,
      completeFocusConnection: $.#me,
      cancelFocusConnection: $.#pe,
      deleteFocusConnection: $.#fe,
      clearFocusConnections: $.#ge,
      refreshFocusSnapshot: $.#he,
      deleteFocusNode: $.#ye,
      addPackageGrant: $.#B,
      addChoiceGroup: $.#K,
      addChoiceOption: $.#Q,
      editSkillGrantNote: $.#Z,
      inspectPackageGrant: $.#ee,
      refreshPackageGrant: $.#te,
      removePackageGrant: $.#ie,
      addPoolBonusChoiceGroup: $.#X,
      editPoolBonusChoiceGroup: $.#Y,
      removePoolBonusChoiceGroup: $.#J,
      setShieldWoundCount: $.#S,
      editShieldWound: $.#w,
      deleteShieldWound: $.#V,
      addGenreAbility: $.#L,
      inspectGenreAbility: $.#j,
      refreshGenreAbility: $.#W,
      removeGenreAbility: $.#_
    }, Es),
    position: { width: 620, height: 680 },
    window: { resizable: !0 }
  };
  static PARTS = {
    main: { template: "systems/magnusarchives/templates/item/item-sheet.hbs" }
  };
  async _onRender(e, t) {
    if (await super._onRender(e, t), da(this.element, this.isEditable, Es), this.#o?.abort(), this.#o = null, this.#c && (fm(this.element, this.#c), this.#c = null), this.#A && (wm(this.element, this.#A), this.#A = null), this.#t.connectionSourceNodeId) {
      const i = new AbortController();
      this.#o = i, this.element.addEventListener("keydown", (a) => {
        a.key === "Escape" && (a.preventDefault(), a.stopPropagation(), this.#t.cancelConnection(), this.#g());
      }, { signal: i.signal }), this.element.querySelector(".focus-tree-node-editor")?.focus({ preventScroll: !0 });
    }
    this.#e.bind(this.element), this.#i.bind(this.element), this.#P(), this.#x(), this.#q(), this.#O(), this.#F(), this.#T(), this.#z();
  }
  _onClose(e) {
    this.#e.disconnect(), this.#i.disconnect(), this.#n?.abort(), this.#n = null, this.#a?.abort(), this.#a = null, this.#l?.abort(), this.#l = null, this.#r?.abort(), this.#r = null, this.#f?.abort(), this.#f = null, this.#p?.abort(), this.#p = null, this.#h?.abort(), this.#h = null, this.#s?.cancel(), this.#s = null, this.#t.reset(), this.#c = null, this.#o?.abort(), this.#o = null, super._onClose(e);
  }
  #F() {
    this.#f?.abort();
    const e = new AbortController();
    this.#f = e;
    const t = [...this.element.querySelectorAll("details")];
    for (const [i, a] of t.entries()) {
      const s = a.dataset.persistentDisclosure ?? `item-details-${i}`;
      this.#d.has(s) ? a.open = !0 : this.#u.has(s) && (a.open = !1), a.addEventListener("toggle", () => {
        a.open ? (this.#d.add(s), this.#u.delete(s)) : (this.#d.delete(s), this.#u.add(s));
      }, { signal: e.signal });
    }
  }
  #T() {
    if (this.#p?.abort(), this.#p = null, !this.isEditable) return;
    const e = this.element.querySelector("[data-depletion-sides]"), t = this.element.querySelector("[data-depletion-threshold]");
    if (!e && !t || !["weapon", "shield", "armor"].includes(this.item.type)) return;
    const i = new AbortController();
    this.#p = i, e?.addEventListener("change", async () => {
      const a = Number(e.value), s = Number(this.item.system.depletion.threshold);
      if (!Number.isInteger(a) || a < 2 || a > 1e3 || s > a) {
        ui.notifications.error(game.i18n.localize("MAGNUSARCHIVES.Depletion.InvalidDie")), await this.render({ force: !0 });
        return;
      }
      await this.item.update({ "system.depletion.die": `d${a}` });
    }, { signal: i.signal }), t?.addEventListener("change", async () => {
      const a = t.value.trim().match(/^1(?:-(\d+))?$/), s = Number(a?.[1] ?? (a ? 1 : Number.NaN)), o = Zt(this.item.system.depletion);
      if (!Number.isInteger(s) || s < 1 || s > o) {
        ui.notifications.error(game.i18n.format("MAGNUSARCHIVES.Depletion.InvalidThreshold", { sides: o })), await this.render({ force: !0 });
        return;
      }
      await this.item.update({ "system.depletion.threshold": s });
    }, { signal: i.signal });
  }
  #z() {
    if (this.#h?.abort(), this.#h = null, this.item.type !== "shield" || !this.isEditable) return;
    const e = [...this.element.querySelectorAll("input[data-shield-capacity]")];
    if (!e.length) return;
    const t = new AbortController();
    this.#h = t;
    for (const i of e)
      i.addEventListener("change", async (a) => {
        a.preventDefault(), a.stopPropagation();
        const s = i.dataset.severity;
        if (ge.includes(s))
          try {
            await game.magnusarchives.services.shields.setCapacity(
              this.item,
              s,
              Number(i.value)
            );
          } catch (o) {
            o instanceof pr ? ui.notifications.warn(game.i18n.format("MAGNUSARCHIVES.Shield.CapacityTooLow", {
              severity: game.i18n.localize(`MAGNUSARCHIVES.Wounds.Severity.${o.severity}`),
              count: o.current
            })) : ae(o), await this.render({ force: !0 });
          }
      }, { signal: t.signal });
  }
  #P() {
    if (this.#n?.abort(), this.#n = null, this.item.type !== "ability" || !this.isEditable) return;
    const e = [...this.element.querySelectorAll(
      "input[data-ability-allowed-pool]"
    )];
    if (!e.length) return;
    const t = new AbortController();
    this.#n = t;
    for (const i of e)
      i.addEventListener("change", async (a) => {
        a.stopPropagation();
        const s = e.filter((o) => o.checked).map((o) => o.value).filter((o) => k.includes(o));
        try {
          await this.item.update({ "system.cost.allowedPools": s });
        } catch (o) {
          ae(o), await this.render({ force: !0 });
        }
      }, { signal: t.signal });
  }
  #x() {
    if (this.#a?.abort(), this.#a = null, this.item.type !== "genre" || !this.isEditable) return;
    const e = [...this.element.querySelectorAll(
      "input[data-genre-minimum-tier]"
    )];
    if (!e.length) return;
    const t = new AbortController();
    this.#a = t;
    for (const i of e)
      i.addEventListener("change", async (a) => {
        a.preventDefault(), a.stopPropagation();
        const s = i.dataset.entryId ?? "", o = this.item.system.abilityCatalog;
        try {
          const r = oc(o, s, Number(i.value));
          await this.item.update({ "system.abilityCatalog": r });
        } catch (r) {
          ae(r), await this.render({ force: !0 });
        }
      }, { signal: t.signal });
  }
  #q() {
    if (this.#l?.abort(), this.#l = null, this.item.type !== "characterType") return;
    const e = this.element.querySelector("select[data-type-genre-select]"), t = this.element.querySelector("[data-type-custom-genre]"), i = this.element.querySelector("[data-type-superhero]");
    if (!e || !t) return;
    const a = new AbortController();
    this.#l = a;
    const s = () => {
      t.hidden = e.value !== "custom", i && (i.hidden = e.value !== "superhero");
    };
    e.addEventListener("change", s, { signal: a.signal }), s();
  }
  #O() {
    if (this.#r?.abort(), this.#r = null, this.item.type !== "characterType" && this.item.type !== "species" || !this.isEditable) return;
    const e = this.element.querySelector("input[data-package-weapon-families]");
    if (!e) return;
    const t = new AbortController();
    this.#r = t, e.addEventListener("change", async (i) => {
      i.preventDefault(), i.stopPropagation();
      try {
        await this.item.update({ "system.weaponFamilies": le(e.value) });
      } catch (a) {
        ae(a), await this.render({ force: !0 });
      }
    }, { signal: t.signal });
  }
  _canDragDrop(e) {
    return this.item.type !== "focus" ? this.isEditable : !!(this.isEditable && game.user.isGM && this.#s);
  }
  async _onDropDocument(e, t) {
    if (!this.isEditable) return null;
    if (this.item.type === "genre" && t?.type === "ability")
      return await this.#H(t), t;
    if (this.item.type === "characterType" && ["ability", "skill"].includes(t?.type))
      return await this.#E(t, "fixed"), t;
    if (this.item.type === "descriptor" && t?.type === "skill")
      return await this.#E(t, "fixed"), t;
    if (this.item.type === "species" && ["ability", "skill", "descriptor"].includes(t?.type))
      return await this.#E(t, "fixed"), t;
    if (this.item.type !== "focus" || !this.#s)
      return super._onDropDocument(e, t);
    const i = e.target;
    if (i instanceof Element && !i.closest(".focus-item-tree"))
      return super._onDropDocument(e, t);
    try {
      return await this.#Se(t), t;
    } catch (a) {
      return ae(a), null;
    }
  }
  static async #B(e, t) {
    const i = this.item.type === "characterType" ? t.dataset.grantTarget ?? "ability" : this.item.type === "descriptor" ? "skill" : t.dataset.grantTarget;
    if (this.item.type !== "characterType" && this.item.type !== "descriptor" && this.item.type !== "species" || i !== "ability" && i !== "skill" && i !== "descriptor") return;
    const a = [...game.items].filter((r) => r.type === i).sort((r, l) => r.name.localeCompare(l.name)), s = i === "skill" ? `<option value="custom">${game.i18n.localize("MAGNUSARCHIVES.Packages.CustomSkill")}</option>` : "";
    if (!a.length && i === "ability") {
      ui.notifications.warn(game.i18n.localize("MAGNUSARCHIVES.Packages.NoWorldAbilities"));
      return;
    }
    const o = await foundry.applications.api.DialogV2.input({
      window: { title: game.i18n.localize(i === "ability" ? "MAGNUSARCHIVES.Packages.AddAbility" : i === "skill" ? "MAGNUSARCHIVES.Packages.AddFixedSkill" : "MAGNUSARCHIVES.Species.AddDescriptorGrant") },
      content: `<div class="magnusarchives-dialog-fields"><label>${game.i18n.localize("MAGNUSARCHIVES.Packages.Source")}<select name="uuid">${s}${a.map((r) => `<option value="${Ne(r.uuid)}">${Ne(r.name)}</option>`).join("")}</select></label>${i === "skill" ? `<label>${game.i18n.localize("MAGNUSARCHIVES.Packages.CustomSkillName")}<input name="customName" type="text"></label><label>${game.i18n.localize("MAGNUSARCHIVES.Skill.Rank")}<select name="rank">${ie.map((r) => `<option value="${r}" ${r === "trained" ? "selected" : ""}>${game.i18n.localize(`MAGNUSARCHIVES.Skill.Ranks.${r}`)}</option>`).join("")}</select></label><label>${game.i18n.localize("MAGNUSARCHIVES.Packages.SkillContextNote")}<textarea name="notes" rows="2"></textarea></label>` : ""}</div>`,
      ok: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Add") }
    });
    if (o)
      if (o.uuid === "custom") {
        const r = String(o.customName ?? "").trim();
        if (!r) return;
        await this.#Ae(r, String(o.rank ?? "trained"), String(o.notes ?? ""));
      } else {
        const r = await fromUuid(String(o.uuid ?? ""));
        r && await this.#E(r, "fixed", String(o.rank ?? "trained"), String(o.notes ?? ""));
      }
  }
  static async #L() {
    if (this.item.type !== "genre") return;
    const e = [...game.items].filter((a) => a.type === "ability").sort((a, s) => a.name.localeCompare(s.name));
    if (!e.length) {
      ui.notifications.warn(game.i18n.localize("MAGNUSARCHIVES.Genre.NoWorldAbilities"));
      return;
    }
    const t = await foundry.applications.api.DialogV2.input({
      window: { title: game.i18n.localize("MAGNUSARCHIVES.Genre.AddAbility") },
      content: `<div class="magnusarchives-dialog-fields"><label>${game.i18n.localize("MAGNUSARCHIVES.Genre.Ability")}
        <select name="uuid">${e.map((a) => `<option value="${Ne(a.uuid)}">${Ne(a.name)}</option>`).join("")}</select></label>
        <label>${game.i18n.localize("MAGNUSARCHIVES.Genre.MinimumTier")}<input name="minimumTier" type="number" min="${ot}" max="${Yt}" value="${ot}"></label></div>`,
      ok: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Add") }
    });
    if (!t) return;
    const i = await fromUuid(String(t.uuid ?? ""));
    i && await this.#H(i, Number(t.minimumTier ?? 1));
  }
  static async #j(e, t) {
    const i = this.#k(t.dataset.entryId);
    if (!i) return;
    const a = i.abilityUuid ? await fromUuid(i.abilityUuid) : null;
    if (a) {
      await a.sheet?.render(!0);
      return;
    }
    await foundry.applications.api.DialogV2.confirm({
      window: { title: i.snapshot.name },
      content: `<div class="magnusarchives magnusarchives-dialog package-snapshot">${String(i.snapshot.system.description ?? "")}</div>`,
      yes: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Close") },
      no: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Close") }
    });
  }
  static async #W(e, t) {
    const i = this.#k(t.dataset.entryId);
    if (!i) return;
    const a = i.abilityUuid ? await fromUuid(i.abilityUuid) : null;
    if (!a) {
      ui.notifications.warn(game.i18n.localize("MAGNUSARCHIVES.Packages.SourceUnavailable"));
      return;
    }
    const s = this.item.system.abilityCatalog;
    await this.item.update({
      "system.abilityCatalog": rc(s, i.id, this.#b(a))
    });
  }
  static async #_(e, t) {
    const i = t.dataset.entryId;
    if (!i || this.item.type !== "genre") return;
    const a = this.item.system.abilityCatalog;
    await this.item.update({ "system.abilityCatalog": lc(a, i) });
  }
  static async #K(e, t) {
    if (this.item.type !== "characterType" && this.item.type !== "descriptor" && this.item.type !== "species") return;
    const i = t.dataset.choiceKind ?? "skill", a = this.item.type !== "descriptor" && i === "ability", s = this.item.type === "species" && i === "descriptor", o = await foundry.applications.api.DialogV2.input({
      window: { title: game.i18n.localize("MAGNUSARCHIVES.Packages.AddChoiceGroup") },
      content: `<div class="magnusarchives-dialog-fields"><label>${game.i18n.localize("MAGNUSARCHIVES.Packages.ChooseCount")}<input name="choose" type="number" min="1" value="1"></label>${s ? `<label>${game.i18n.localize("MAGNUSARCHIVES.Packages.ChoiceSource")}<select name="sourceMode"><option value="fixed">${game.i18n.localize("MAGNUSARCHIVES.Packages.FixedOptions")}</option><option value="catalog">${game.i18n.localize("MAGNUSARCHIVES.Packages.AllAvailableDescriptors")}</option></select></label>` : a ? "" : `<label>${game.i18n.localize("MAGNUSARCHIVES.Skill.Rank")}<select name="rank">${ie.map((l) => `<option value="${l}" ${l === "trained" ? "selected" : ""}>${game.i18n.localize(`MAGNUSARCHIVES.Skill.Ranks.${l}`)}</option>`).join("")}</select></label>`}</div>`,
      ok: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Add") }
    });
    if (!o) return;
    const r = this.item.system;
    if (a) {
      const l = { id: crypto.randomUUID(), choose: Math.max(1, Number(o.choose) || 1), options: [] };
      await this.item.update({ "system.abilityChoiceGroups": [...r.abilityChoiceGroups, l] });
    } else if (s) {
      const l = o.sourceMode === "catalog", u = {
        id: crypto.randomUUID(),
        choose: Math.max(1, Number(o.choose) || 1),
        sourceMode: l ? "catalog" : "fixed",
        catalogItemType: l ? "descriptor" : "none",
        options: []
      }, d = r.descriptorChoiceGroups ?? [];
      await this.item.update({ "system.descriptorChoiceGroups": [...d, u] });
    } else {
      const l = { id: crypto.randomUUID(), choose: Math.max(1, Number(o.choose) || 1), rank: String(o.rank), options: [] };
      await this.item.update({ "system.choiceGroups": [...r.choiceGroups, l] });
    }
  }
  async #N(e) {
    const t = await foundry.applications.api.DialogV2.input({
      window: { title: game.i18n.localize(e ? "MAGNUSARCHIVES.Packages.EditPoolBonusChoiceGroup" : "MAGNUSARCHIVES.Packages.AddPoolBonusChoiceGroup") },
      content: `<div class="magnusarchives magnusarchives-dialog package-pool-choice-authoring">
        <div class="magnusarchives-dialog-section magnusarchives-dialog-field-grid">
          <label class="magnusarchives-dialog-field">${game.i18n.localize("MAGNUSARCHIVES.Packages.Amount")}<input name="amount" type="number" min="1" value="${e?.amount ?? 1}"></label>
          <label class="magnusarchives-dialog-field">${game.i18n.localize("MAGNUSARCHIVES.Packages.ChooseCount")}<input name="choose" type="number" min="1" value="${e?.choose ?? 1}"></label>
        </div>
        <span class="magnusarchives-dialog-section-heading">${game.i18n.localize("MAGNUSARCHIVES.Packages.AllowedPools")}</span>
        <div class="package-pool-choice-options">
          ${k.map((o) => `<label class="magnusarchives-dialog-toggle"><input name="pool_${o}" type="checkbox" ${e?.pools.includes(o) ? "checked" : ""}><span>${game.i18n.localize(`MAGNUSARCHIVES.Pools.${o[0].toUpperCase()}${o.slice(1)}`)}</span></label>`).join("")}
        </div>
      </div>`,
      ok: { label: game.i18n.localize(e ? "MAGNUSARCHIVES.Actions.Save" : "MAGNUSARCHIVES.Actions.Add") }
    });
    if (!t) return null;
    const i = Math.trunc(Number(t.amount)), a = Math.trunc(Number(t.choose)), s = k.filter((o) => !!t[`pool_${o}`]);
    return !Number.isInteger(i) || i < 1 || !Number.isInteger(a) || a < 1 || a > s.length ? (ui.notifications.error(game.i18n.localize("MAGNUSARCHIVES.Packages.InvalidPoolBonusChoice")), null) : { amount: i, choose: a, pools: s };
  }
  static async #X() {
    if (this.item.type !== "descriptor") return;
    const e = await this.#N();
    if (!e) return;
    const t = this.item.system.poolBonusChoiceGroups ?? [];
    await this.item.update({ "system.poolBonusChoiceGroups": [...t, { id: crypto.randomUUID(), ...e }] });
  }
  static async #Y(e, t) {
    if (this.item.type !== "descriptor") return;
    const i = this.item.system.poolBonusChoiceGroups ?? [], a = i.find((o) => o.id === t.dataset.groupId);
    if (!a) return;
    const s = await this.#N(a);
    s && await this.item.update({
      "system.poolBonusChoiceGroups": i.map((o) => o.id === a.id ? { ...o, ...s } : o)
    });
  }
  static async #J(e, t) {
    if (this.item.type !== "descriptor") return;
    const i = this.item.system.poolBonusChoiceGroups ?? [];
    await this.item.update({
      "system.poolBonusChoiceGroups": i.filter((a) => a.id !== t.dataset.groupId)
    });
  }
  static async #Q(e, t) {
    if (this.item.type !== "characterType" && this.item.type !== "descriptor" && this.item.type !== "species") return;
    const i = t.dataset.groupId, a = this.item.system, s = t.dataset.choiceKind ?? "skill", o = this.item.type !== "descriptor" && s === "ability", r = this.item.type === "species" && s === "descriptor";
    if (!(o ? a.abilityChoiceGroups.find((m) => m.id === i) : r ? a.descriptorChoiceGroups.find((m) => m.id === i) : a.choiceGroups.find((m) => m.id === i))) return;
    const u = o ? "ability" : r ? "descriptor" : "skill", d = [...game.items].filter((m) => m.type === u).sort((m, h) => m.name.localeCompare(h.name)), p = await foundry.applications.api.DialogV2.input({
      window: { title: game.i18n.localize(o ? "MAGNUSARCHIVES.Species.AddAbilityOption" : r ? "MAGNUSARCHIVES.Species.AddDescriptorOption" : "MAGNUSARCHIVES.Packages.AddSkillOption") },
      content: `<div class="magnusarchives-dialog-fields"><label>${game.i18n.localize("MAGNUSARCHIVES.Packages.Source")}<select name="uuid">${o || r ? "" : `<option value="custom">${game.i18n.localize("MAGNUSARCHIVES.Packages.CustomSkill")}</option>`}${d.map((m) => `<option value="${Ne(m.uuid)}">${Ne(m.name)}</option>`).join("")}</select></label>${o || r ? "" : `<label>${game.i18n.localize("MAGNUSARCHIVES.Packages.CustomSkillName")}<input name="customName" type="text"></label><label>${game.i18n.localize("MAGNUSARCHIVES.Packages.SkillContextNote")}<textarea name="notes" rows="2"></textarea></label>`}</div>`,
      ok: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Add") }
    });
    if (!p) return;
    const y = p.uuid === "custom" ? null : await fromUuid(String(p.uuid ?? ""));
    if (o) {
      if (!y) return;
      const m = { id: crypto.randomUUID(), abilityUuid: y.uuid, snapshot: this.#b(y) }, h = a.abilityChoiceGroups;
      await this.item.update({ "system.abilityChoiceGroups": h.map((f) => f.id === i ? { ...f, options: [...f.options, m] } : f) });
    } else if (r) {
      if (!y) return;
      const m = { id: crypto.randomUUID(), descriptorUuid: y.uuid, snapshot: this.#b(y) }, h = a.descriptorChoiceGroups;
      await this.item.update({ "system.descriptorChoiceGroups": h.map((f) => f.id === i ? { ...f, options: [...f.options, m] } : f) });
    } else {
      const m = this.#C(y, String(p.customName ?? ""), String(p.notes ?? ""));
      if (!m) return;
      await this.item.update({ "system.choiceGroups": a.choiceGroups.map((h) => h.id === i ? { ...h, options: [...h.options, m] } : h) });
    }
  }
  static async #Z(e, t) {
    const i = this.#R(t);
    if (!i || !("skillUuid" in i)) return;
    const a = await foundry.applications.api.DialogV2.input({
      window: { title: game.i18n.localize("MAGNUSARCHIVES.Packages.EditSkillContextNote") },
      content: `<div class="magnusarchives-dialog-fields"><label>${game.i18n.localize("MAGNUSARCHIVES.Packages.SkillContextNote")}<textarea name="notes" rows="3">${Ne(String(i.notes ?? ""))}</textarea></label></div>`,
      ok: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Save") }
    });
    a && await this.#$(t, { ...i, notes: String(a.notes ?? "") });
  }
  static async #ee(e, t) {
    const i = this.#R(t);
    if (!i) return;
    const a = "abilityUuid" in i ? i.abilityUuid : "skillUuid" in i ? i.skillUuid : i.descriptorUuid, s = a ? await fromUuid(a) : null;
    if (s) {
      await s.sheet?.render(!0);
      return;
    }
    await foundry.applications.api.DialogV2.confirm({
      window: { title: i.snapshot?.name || ("customName" in i ? i.customName : "") },
      content: `<div class="magnusarchives magnusarchives-dialog package-snapshot"><p>${String(i.snapshot?.system?.description ?? "")}</p></div>`,
      yes: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Close") },
      no: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Close") }
    });
  }
  static async #te(e, t) {
    const i = this.#R(t);
    if (!i) return;
    const a = "abilityUuid" in i ? i.abilityUuid : "skillUuid" in i ? i.skillUuid : i.descriptorUuid, s = a ? await fromUuid(a) : null;
    if (!s) {
      ui.notifications.warn(game.i18n.localize("MAGNUSARCHIVES.Packages.SourceUnavailable"));
      return;
    }
    await this.#$(t, { ...i, snapshot: this.#b(s) });
  }
  static async #ie(e, t) {
    const i = t.dataset.grantKind, a = t.dataset.grantId;
    if (a) {
      if (i === "ability") {
        const s = this.item.system.abilityGrants;
        await this.item.update({ "system.abilityGrants": s.filter((o) => o.id !== a) });
      } else if (i === "skill") {
        const s = this.item.system.skillGrants;
        await this.item.update({ "system.skillGrants": s.filter((o) => o.id !== a) });
      } else if (i === "option") {
        const s = t.dataset.groupId, o = this.item.system.choiceGroups;
        await this.item.update({ "system.choiceGroups": o.map((r) => r.id === s ? { ...r, options: r.options.filter((l) => l.id !== a) } : r) });
      } else if (i === "group") {
        const s = this.item.system.choiceGroups;
        await this.item.update({ "system.choiceGroups": s.filter((o) => o.id !== a) });
      } else if (i === "abilityOption") {
        const s = t.dataset.groupId, o = this.item.system.abilityChoiceGroups;
        await this.item.update({ "system.abilityChoiceGroups": o.map((r) => r.id === s ? { ...r, options: r.options.filter((l) => l.id !== a) } : r) });
      } else if (i === "abilityGroup") {
        const s = this.item.system.abilityChoiceGroups;
        await this.item.update({ "system.abilityChoiceGroups": s.filter((o) => o.id !== a) });
      } else if (i === "descriptor") {
        const s = this.item.system.descriptorGrants;
        await this.item.update({ "system.descriptorGrants": s.filter((o) => o.id !== a) });
      } else if (i === "descriptorOption") {
        const s = t.dataset.groupId, o = this.item.system.descriptorChoiceGroups;
        await this.item.update({ "system.descriptorChoiceGroups": o.map((r) => r.id === s ? { ...r, options: r.options.filter((l) => l.id !== a) } : r) });
      } else if (i === "descriptorGroup") {
        const s = this.item.system.descriptorChoiceGroups;
        await this.item.update({ "system.descriptorChoiceGroups": s.filter((o) => o.id !== a) });
      }
    }
  }
  static async #ne() {
    await Di(this.item);
  }
  static async #ae(e, t) {
    const i = t.dataset.nodeId;
    if (!i) throw new Error("Missing Focus node ID.");
    await Bo(this.#G(), i);
  }
  static async #se() {
    try {
      this.#M(), this.#s = new mm(
        this.item.system.graph
      ), this.#t.reset(), await this.#g();
    } catch (e) {
      ae(e);
    }
  }
  static async #oe() {
    try {
      const e = this.#y(), t = [...game.items].filter((o) => o.type === "ability").sort((o, r) => o.name.localeCompare(r.name));
      if (t.length === 0) {
        ui.notifications.warn(game.i18n.localize("MAGNUSARCHIVES.Focus.Editor.NoWorldAbilities"));
        return;
      }
      const i = await foundry.applications.api.DialogV2.input({
        window: { title: game.i18n.localize("MAGNUSARCHIVES.Focus.Editor.AddAbility") },
        content: `<div class="magnusarchives-dialog-fields">
          <label>${game.i18n.localize("MAGNUSARCHIVES.Focus.Editor.Ability")}
            <select name="abilityUuid">${t.map((o) => `<option value="${Ne(o.uuid)}">${Ne(o.name)}</option>`).join("")}</select>
          </label>
          ${this.#U()}
        </div>`,
        rejectClose: !1,
        ok: { label: game.i18n.localize("MAGNUSARCHIVES.Focus.Editor.AddAbility") }
      });
      if (!i) return;
      const a = await fromUuid(String(i.abilityUuid ?? ""));
      if (!a) throw new Error(game.i18n.localize("MAGNUSARCHIVES.Focus.Editor.AbilityUnavailable"));
      const s = e.addAbility(
        a,
        Number(i.tier ?? 1)
      );
      this.#t.select(s.id), await this.#g();
    } catch (e) {
      ae(e);
    }
  }
  static async #I() {
    try {
      const e = this.#y(), t = e.diagnostics().filter((i) => i.severity === "warning");
      t.length > 0 && ui.notifications.warn(t.map((i) => i.message).join(`
`)), await e.save((i) => this.item.update({ "system.graph": i })), this.#s = null, this.#t.reset(), ui.notifications.info(game.i18n.localize("MAGNUSARCHIVES.Focus.Editor.Saved")), await this.#g();
    } catch (e) {
      if (e instanceof Mt) {
        ui.notifications.error(e.diagnostics.map((t) => t.message).join(`
`));
        return;
      }
      ae(e);
    }
  }
  static async #re() {
    this.#s?.cancel(), this.#s = null, this.#t.reset(), await this.#g();
  }
  static async #le(e, t) {
    e.preventDefault(), e.stopPropagation(), this.#y(), this.#t.select(this.#v(t)), await this.#g();
  }
  static async #ce(e, t) {
    try {
      const i = t.dataset.direction;
      if (i !== "left" && i !== "right") throw new Error("Missing movement direction.");
      this.#y().moveNode(this.#v(t), i), await this.#g();
    } catch (i) {
      ae(i);
    }
  }
  static async #de(e, t) {
    try {
      this.#y().setTier(this.#v(t), Number(t.dataset.tier)), await this.#g();
    } catch (i) {
      ae(i);
    }
  }
  static async #ue(e, t) {
    this.#y(), this.#t.startConnection(), await this.#g();
  }
  static async #me(e, t) {
    try {
      const i = this.#v(t), a = this.#t.connectionTo(i);
      this.#y().connect(a.from, a.to), this.#t.finishConnection(i), await this.#g();
    } catch (i) {
      ae(i);
    }
  }
  static async #pe() {
    this.#t.cancelConnection(), await this.#g();
  }
  static async #fe(e, t) {
    try {
      const i = t.dataset.connectionId;
      if (!i) throw new Error("Missing Focus connection ID.");
      this.#y().deleteConnection(i), await this.#g();
    } catch (i) {
      ae(i);
    }
  }
  static async #ge() {
    try {
      const e = this.#y();
      if (!await foundry.applications.api.DialogV2.confirm({
        window: { title: game.i18n.localize("MAGNUSARCHIVES.Focus.Editor.ClearConnections") },
        content: `<div class="magnusarchives magnusarchives-dialog"><p>${game.i18n.localize("MAGNUSARCHIVES.Focus.Editor.ClearConnectionsConfirm")}</p></div>`,
        rejectClose: !1,
        modal: !0,
        yes: { label: game.i18n.localize("MAGNUSARCHIVES.Focus.Editor.ClearConnections") },
        no: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Cancel") }
      })) return;
      e.clearConnections(), this.#t.cancelConnection(), await this.#g();
    } catch (e) {
      ae(e);
    }
  }
  static async #he(e, t) {
    try {
      const i = this.#v(t), a = this.#y().graph.nodes.find((o) => o.id === i);
      if (!a) throw new Error(`Focus node '${i}' was not found.`);
      const s = await fromUuid(a.abilityUuid);
      if (!s) throw new Error(game.i18n.localize("MAGNUSARCHIVES.Focus.Editor.AbilityUnavailable"));
      this.#y().refreshSnapshot(i, s), await this.#g();
    } catch (i) {
      ae(i);
    }
  }
  static async #ye(e, t) {
    try {
      const i = this.#v(t), a = this.#y().graph.nodes.find((o) => o.id === i);
      if (!a) throw new Error(`Focus node '${i}' was not found.`);
      if (!await foundry.applications.api.DialogV2.confirm({
        window: { title: game.i18n.localize("MAGNUSARCHIVES.Focus.Editor.DeleteNode") },
        content: `<div class="magnusarchives magnusarchives-dialog"><p>${game.i18n.format("MAGNUSARCHIVES.Focus.Editor.DeleteNodeConfirm", {
          name: Ne(a.abilitySnapshot.name || a.id)
        })}</p></div>`,
        rejectClose: !1,
        modal: !0,
        yes: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Delete") },
        no: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Cancel") }
      })) return;
      this.#y().deleteNode(i), this.#t.clearSelection(i), await this.#g();
    } catch (i) {
      ae(i);
    }
  }
  #M() {
    if (this.item.type !== "focus" || !game.user.isGM || !this.isEditable)
      throw new Error(game.i18n.localize("MAGNUSARCHIVES.Focus.Editor.GmOnly"));
  }
  #y() {
    if (this.#M(), !this.#s) throw new Error("Focus Tree editing is not active.");
    return this.#s;
  }
  #G() {
    const e = this.#s?.graph ?? this.item.system.graph;
    return {
      id: this.item.id,
      uuid: this.item.uuid,
      name: this.item.name,
      type: this.item.type,
      system: { graph: e }
    };
  }
  async #Se(e) {
    const t = this.#y();
    if (e.type !== "ability")
      throw new Error(game.i18n.localize("MAGNUSARCHIVES.Focus.Editor.DropAbilityOnly"));
    const i = await foundry.applications.api.DialogV2.input({
      window: { title: game.i18n.localize("MAGNUSARCHIVES.Focus.Editor.ChooseTier") },
      content: `<div class="magnusarchives-dialog-fields">${this.#U()}</div>`,
      rejectClose: !1,
      ok: { label: game.i18n.localize("MAGNUSARCHIVES.Focus.Editor.AddAbility") }
    });
    if (!i) return;
    const a = t.addAbility(e, Number(i.tier ?? 1));
    this.#t.select(a.id), await this.#g();
  }
  #U() {
    return `<label>${game.i18n.localize("MAGNUSARCHIVES.Focus.Tier")}
      <select name="tier">${[1, 2, 3, 4, 5, 6].map((e) => `<option value="${e}">${e}</option>`).join("")}</select>
    </label>`;
  }
  #b(e) {
    const t = e.img;
    return { name: e.name, ...t ? { img: t } : {}, system: structuredClone(e.system) };
  }
  #k(e) {
    return !e || this.item.type !== "genre" ? null : this.item.system.abilityCatalog.find((t) => t.id === e) ?? null;
  }
  async #H(e, t = 1) {
    if (this.item.type !== "genre" || e.type !== "ability")
      throw new Error(game.i18n.localize("MAGNUSARCHIVES.Genre.DropAbilityOnly"));
    const i = this.item.system;
    if (i.abilityCatalog.some((s) => s.abilityUuid === e.uuid)) {
      ui.notifications.warn(game.i18n.localize("MAGNUSARCHIVES.Genre.DuplicateAbility"));
      return;
    }
    const a = {
      id: crypto.randomUUID(),
      abilityUuid: e.uuid,
      minimumTier: Io(t),
      catalog: "progression",
      minimumSuperheroRank: 0,
      snapshot: this.#b(e)
    };
    await this.item.update({ "system.abilityCatalog": [...i.abilityCatalog, a] });
  }
  #C(e, t = "", i = "") {
    const a = t.trim();
    return !e && !a ? null : {
      id: crypto.randomUUID(),
      skillUuid: e?.uuid ?? "",
      customName: e ? "" : a,
      notes: i.trim(),
      snapshot: e ? this.#b(e) : { name: a, system: {} }
    };
  }
  async #Ae(e, t, i = "") {
    const a = this.item.system, s = this.#C(null, e, i);
    if (!s) return;
    const o = { ...s, rank: t };
    await this.item.update({ "system.skillGrants": [...a.skillGrants, o] });
  }
  async #E(e, t, i = "trained", a = "") {
    if (this.item.type === "characterType" && e.type === "ability") {
      const s = this.item.system, o = { id: crypto.randomUUID(), abilityUuid: e.uuid, snapshot: this.#b(e) };
      await this.item.update({ "system.abilityGrants": [...s.abilityGrants, o] });
      return;
    }
    if (this.item.type === "characterType" && e.type === "skill") {
      const s = this.item.system, o = this.#C(e, "", a);
      if (!o) return;
      await this.item.update({ "system.skillGrants": [...s.skillGrants, { ...o, rank: i }] });
      return;
    }
    if (this.item.type === "descriptor" && e.type === "skill") {
      const s = this.item.system, o = this.#C(e, "", a);
      if (!o) return;
      await this.item.update({ "system.skillGrants": [...s.skillGrants, { ...o, rank: i }] });
      return;
    }
    if (this.item.type === "species") {
      const s = this.item.system;
      if (e.type === "ability") {
        const o = { id: crypto.randomUUID(), abilityUuid: e.uuid, snapshot: this.#b(e) };
        await this.item.update({ "system.abilityGrants": [...s.abilityGrants, o] });
        return;
      }
      if (e.type === "skill") {
        const o = this.#C(e, "", a);
        if (!o) return;
        await this.item.update({ "system.skillGrants": [...s.skillGrants, { ...o, rank: i }] });
        return;
      }
      if (e.type === "descriptor") {
        const o = { id: crypto.randomUUID(), descriptorUuid: e.uuid, snapshot: this.#b(e) };
        await this.item.update({ "system.descriptorGrants": [...s.descriptorGrants, o] });
        return;
      }
    }
    throw new Error(game.i18n.localize("MAGNUSARCHIVES.Packages.InvalidDrop"));
  }
  #R(e) {
    const t = e.dataset.grantKind, i = e.dataset.grantId;
    if (!i) return null;
    if (t === "ability") return this.item.system.abilityGrants.find((s) => s.id === i) ?? null;
    const a = this.item.system;
    return t === "skill" ? a.skillGrants.find((s) => s.id === i) ?? null : t === "option" ? a.choiceGroups.find((s) => s.id === e.dataset.groupId)?.options.find((s) => s.id === i) ?? null : t === "abilityOption" ? this.item.system.abilityChoiceGroups.find((s) => s.id === e.dataset.groupId)?.options.find((s) => s.id === i) ?? null : t === "descriptor" ? this.item.system.descriptorGrants.find((s) => s.id === i) ?? null : t === "descriptorOption" ? this.item.system.descriptorChoiceGroups.find((s) => s.id === e.dataset.groupId)?.options.find((s) => s.id === i) ?? null : null;
  }
  async #$(e, t) {
    const i = e.dataset.grantKind, a = e.dataset.grantId;
    if (i === "ability") {
      const s = this.item.system.abilityGrants;
      await this.item.update({ "system.abilityGrants": s.map((o) => o.id === a ? t : o) });
    } else if (i === "skill") {
      const s = this.item.system.skillGrants;
      await this.item.update({ "system.skillGrants": s.map((o) => o.id === a ? t : o) });
    } else if (i === "option") {
      const s = e.dataset.groupId, o = this.item.system.choiceGroups;
      await this.item.update({ "system.choiceGroups": o.map((r) => r.id === s ? { ...r, options: r.options.map((l) => l.id === a ? t : l) } : r) });
    } else if (i === "abilityOption") {
      const s = e.dataset.groupId, o = this.item.system.abilityChoiceGroups;
      await this.item.update({ "system.abilityChoiceGroups": o.map((r) => r.id === s ? { ...r, options: r.options.map((l) => l.id === a ? t : l) } : r) });
    } else if (i === "descriptor") {
      const s = this.item.system.descriptorGrants;
      await this.item.update({ "system.descriptorGrants": s.map((o) => o.id === a ? t : o) });
    } else if (i === "descriptorOption") {
      const s = e.dataset.groupId, o = this.item.system.descriptorChoiceGroups;
      await this.item.update({ "system.descriptorChoiceGroups": o.map((r) => r.id === s ? { ...r, options: r.options.map((l) => l.id === a ? t : l) } : r) });
    }
  }
  #v(e) {
    const t = e.dataset.nodeId;
    if (!t) throw new Error("Missing Focus node ID.");
    return t;
  }
  async #g() {
    this.#c = pm(this.element), await this.render({ force: !0 });
  }
  async _prepareContext(e) {
    this.element?.isConnected && (this.#A = bm(this.element));
    const t = await super._prepareContext(e), i = this.item.system, a = this.item.type === "skill", s = this.item.type === "ability", o = this.item.type === "weapon", r = this.item.type === "armor", l = this.item.type === "shield", u = this.item.type === "equipment", d = this.item.type === "cypher", p = this.item.type === "artifact", y = this.item.type === "focus", m = this.item.type === "genre", h = this.item.type === "characterType", f = this.item.type === "descriptor", A = this.item.type === "species", v = h && String(i.genre ?? "none") === "superhero", E = h ? i.instance : void 0, H = ["ability", "focus", "genre", "skill", "weapon", "armor", "shield", "equipment", "cypher", "artifact", "characterType", "descriptor", "species"].includes(this.item.type), R = typeof this.item._source?.system?.description == "string" ? this.item._source.system.description : "", G = H ? await foundry.applications.ux.TextEditor.implementation.enrichHTML(R, {
      async: !0,
      relativeTo: this.item
    }) : "", P = h ? await foundry.applications.ux.TextEditor.implementation.enrichHTML(String(this.item._source.system.backgroundOptions ?? ""), { async: !0, relativeTo: this.item }) : "", X = h ? await foundry.applications.ux.TextEditor.implementation.enrichHTML(String(this.item._source.system.equipmentNotes ?? ""), { async: !0, relativeTo: this.item }) : "", M = String(i.rank ?? "untrained"), D = String(i.defaultPool ?? "choose"), I = Array.isArray(i.contexts) ? i.contexts : [], ne = s ? Ye(this.item) : [], _ = s ? Sm(i) : null, He = _ ? {
      ..._,
      rollModifierLabel: game.i18n.localize(
        _.rollModifierLabel === "task" ? "MAGNUSARCHIVES.Ability.TaskModifier" : _.rollModifierLabel === "defense" ? "MAGNUSARCHIVES.Ability.DefenseModifier" : "MAGNUSARCHIVES.Ability.RollModifier"
      )
    } : null, O = s ? this.item.flags?.magnusarchives?.genreAbility : void 0, Q = O ? {
      catalogLabel: game.i18n.localize(`MAGNUSARCHIVES.Genre.CatalogKind.${O.catalog ?? "progression"}`),
      genresLabel: (O.genres ?? []).map((S) => game.i18n.localize(`MAGNUSARCHIVES.Packages.Genre.${S}`)).join(" · "),
      progressionBandLabel: O.progressionBand === "origin" ? game.i18n.localize("MAGNUSARCHIVES.Genre.CatalogKind.origin") : game.i18n.localize(`MAGNUSARCHIVES.Genre.ProgressionBand.${O.progressionBand ?? "mid-tier"}`),
      minimumSuperheroRank: Number(O.minimumSuperheroRank ?? 0)
    } : null, $e = m ? i.abilityCatalog.map((S) => ({
      ...S,
      catalogLabel: game.i18n.localize(`MAGNUSARCHIVES.Genre.CatalogKind.${S.catalog ?? "progression"}`),
      progressionBandLabel: (S.catalog ?? "progression") === "progression" ? S.minimumTier === 3 ? game.i18n.localize("MAGNUSARCHIVES.Genre.ProgressionBand.mid-tier") : S.minimumTier === 6 ? game.i18n.localize("MAGNUSARCHIVES.Genre.ProgressionBand.high-tier") : "" : "",
      minimumSuperheroRank: Number(S.minimumSuperheroRank ?? 0)
    })) : [], Se = a && Am({
      defaultPool: D,
      category: String(i.category ?? "general"),
      contexts: I,
      initiative: !!i.initiative
    }), Ie = i.grantedBy, ce = !!(Ie?.sourceUuid || Ie?.instanceId || Ie?.grantId), Z = y ? this.#G() : null, Ae = Z?.system.graph, pe = Ae?.nodes.find((S) => S.id === this.#t.selectedNodeId), N = new Map(Ae?.nodes.map((S) => [
      S.id,
      S.abilitySnapshot.name || S.id
    ]) ?? []);
    return {
      ...t,
      item: this.item,
      system: this.item.system,
      systemFields: la(this.item),
      enriched: { description: G, backgroundOptions: P, equipmentNotes: X },
      usesRichDescription: H,
      isSkill: a,
      isAbility: s,
      isWeapon: o,
      isArmor: r,
      isShield: l,
      isEquipment: u,
      isCypher: d,
      isArtifact: p,
      isFocus: y,
      isGenre: m,
      isCharacterType: h,
      typeCustomGenreSelected: h && String(i.genre ?? "none") === "custom",
      typeSuperheroSelected: v,
      typeSuperheroAttached: v && !!E?.instanceId,
      typeSuperheroicsPoolLabel: E?.selections?.superheroicsPool && E.selections.superheroicsPool !== "none" ? game.i18n.localize(`MAGNUSARCHIVES.Pools.${E.selections.superheroicsPool[0].toUpperCase()}${E.selections.superheroicsPool.slice(1)}`) : game.i18n.localize("MAGNUSARCHIVES.Common.None"),
      typeWeaponFamiliesValue: h ? le(i.weaponFamilies).map(At).join(", ") : "",
      speciesWeaponFamiliesValue: A ? le(i.weaponFamilies).map(At).join(", ") : "",
      weaponFamilySuggestions: ao.map((S) => ({ value: At(S) })),
      isDescriptor: f,
      isSpecies: A,
      isCompactRuleItem: s || a || o || r || l || u || d || p || m || h || A,
      usesCleanItemHeader: s || a || o || r || l || u || d || p || y || m || f || h || A,
      hideNormalItemFooter: s || a || o || r || l || u || d || p || y || m || f || h || A,
      genreEffortCapOptions: m ? ["core", "unlimited"].map((S) => ({
        value: S,
        label: game.i18n.localize(`MAGNUSARCHIVES.Genre.EffortCap.${S}`),
        selected: i.options?.totalEffortCapMode === S
      })) : [],
      genreMinimumTierMin: ot,
      genreMinimumTierMax: Yt,
      genreCatalogEntries: $e,
      abilityMechanics: He,
      abilityGenreReview: Q,
      skillOptionalMechanics: Se,
      hasGrantProvenance: ce,
      packagePoolOptions: ["none", ...k].map((S) => ({
        value: S,
        label: S === "none" ? game.i18n.localize("MAGNUSARCHIVES.Common.None") : game.i18n.localize(`MAGNUSARCHIVES.Pools.${S[0].toUpperCase()}${S.slice(1)}`),
        selected: i.edgeGrant?.pool === S
      })),
      packageGenreOptions: ["none", "fantasy", "scienceFiction", "superhero", "custom"].map((S) => ({
        value: S,
        label: game.i18n.localize(`MAGNUSARCHIVES.Packages.Genre.${S}`),
        selected: i.genre === S
      })),
      edgeModeOptions: ["none", "fixed", "choice"].map((S) => ({
        value: S,
        label: game.i18n.localize(S === "none" ? "MAGNUSARCHIVES.Common.None" : S === "fixed" ? "MAGNUSARCHIVES.Packages.FixedPool" : "MAGNUSARCHIVES.Packages.ChoicePool"),
        selected: i.edgeGrant?.mode === S
      })),
      descriptorSkillGrants: f ? i.skillGrants.map((S) => ({
        ...S,
        rankLabel: game.i18n.localize(`MAGNUSARCHIVES.Skill.Ranks.${S.rank}`)
      })) : [],
      descriptorPoolBonusChoiceGroups: f ? (i.poolBonusChoiceGroups ?? []).map((S) => ({
        ...S,
        poolsLabel: S.pools.map((J) => game.i18n.localize(
          `MAGNUSARCHIVES.Pools.${J[0].toUpperCase()}${J.slice(1)}`
        )).join(" · ")
      })) : [],
      descriptorChoiceGroups: f ? i.choiceGroups.map((S) => ({
        ...S,
        rankLabel: game.i18n.localize(`MAGNUSARCHIVES.Skill.Ranks.${S.rank}`)
      })) : [],
      typeSkillGrants: h ? i.skillGrants.map((S) => ({
        ...S,
        rankLabel: game.i18n.localize(`MAGNUSARCHIVES.Skill.Ranks.${S.rank}`)
      })) : [],
      typeSkillChoiceGroups: h ? i.choiceGroups.map((S) => ({
        ...S,
        rankLabel: game.i18n.localize(`MAGNUSARCHIVES.Skill.Ranks.${S.rank}`)
      })) : [],
      typeAbilityChoiceGroups: h ? i.abilityChoiceGroups : [],
      speciesSkillGrants: A ? i.skillGrants.map((S) => ({ ...S, rankLabel: game.i18n.localize(`MAGNUSARCHIVES.Skill.Ranks.${S.rank}`) })) : [],
      speciesSkillChoiceGroups: A ? i.choiceGroups.map((S) => ({ ...S, rankLabel: game.i18n.localize(`MAGNUSARCHIVES.Skill.Ranks.${S.rank}`) })) : [],
      speciesAbilityChoiceGroups: A ? i.abilityChoiceGroups : [],
      speciesDescriptorChoiceGroups: A ? i.descriptorChoiceGroups.map((S) => ({
        ...S,
        catalogMode: (S.sourceMode ?? "fixed") === "catalog",
        catalogLabel: game.i18n.localize("MAGNUSARCHIVES.Packages.AllAvailableDescriptors")
      })) : [],
      canEditFocusTree: !!(y && game.user.isGM && this.isEditable && !this.#s),
      focusTreeEditing: !!this.#s,
      focusEditor: this.#s ? {
        dirty: this.#s.dirty,
        tierOptions: [1, 2, 3, 4, 5, 6],
        connecting: !!this.#t.connectionSourceNodeId,
        connectionSourceName: this.#t.connectionSourceNodeId ? N.get(this.#t.connectionSourceNodeId) : "",
        selectedNode: pe ? {
          ...pe,
          canMoveLeft: !0,
          canMoveRight: !0
        } : null,
        connections: Ae?.connections.map((S) => ({
          ...S,
          fromName: N.get(S.from) ?? S.from,
          toName: N.get(S.to) ?? S.to
        })) ?? []
      } : null,
      focusTrees: y ? [await game.magnusarchives.services.focusTrees.prepare(Z, this.#s ? {
        editor: {
          selectedNodeId: this.#t.selectedNodeId,
          connectionSourceNodeId: this.#t.connectionSourceNodeId
        }
      } : {})] : [],
      isHeavyWeapon: o && i.category === "heavy",
      abilityActivationOptions: s ? js.map((S) => ({
        value: S,
        label: game.i18n.localize(`MAGNUSARCHIVES.Ability.Activation.${S}`),
        selected: i.activation === S
      })) : [],
      abilityAllowedPoolOptions: s ? k.map((S) => ({
        value: S,
        label: game.i18n.localize(`MAGNUSARCHIVES.Pools.${S[0].toUpperCase()}${S.slice(1)}`),
        selected: ne.includes(S)
      })) : [],
      abilityRollOptions: s ? Ws.map((S) => ({
        value: S,
        label: game.i18n.localize(`MAGNUSARCHIVES.Ability.Roll.${S}`),
        selected: i.roll === S
      })) : [],
      priceCategoryOptions: u ? Un.map((S) => ({
        value: S,
        label: game.i18n.localize(`MAGNUSARCHIVES.Price.${S}`),
        selected: i.price === S
      })) : [],
      abilityDamageEffectOptions: s ? xi.map((S) => ({
        value: S,
        label: game.i18n.localize(`MAGNUSARCHIVES.CharacterDamage.${S}`),
        selected: i.damageEffect === S
      })) : [],
      abilityTargetOptions: s ? _s.map((S) => ({
        value: S,
        label: game.i18n.localize(`MAGNUSARCHIVES.Ability.TargetMode.${S}`),
        selected: i.targetMode === S
      })) : [],
      cypherManifestationOptions: d ? Kn.map((S) => ({
        value: S,
        label: game.i18n.localize(`MAGNUSARCHIVES.Cypher.Manifestation.${S}`),
        selected: i.manifestation === S
      })) : [],
      cypherPowerOptions: d ? Xn.map((S) => ({
        value: S,
        label: game.i18n.localize(`MAGNUSARCHIVES.Cypher.Power.${S}`),
        selected: i.power === S
      })) : [],
      cypherEffectiveLevel: d ? Ca(i) : 0,
      artifactLevelRollable: p ? Fi(i) : !1,
      skillRankOptions: a ? ie.map((S) => ({
        value: S,
        label: game.i18n.localize(`MAGNUSARCHIVES.Skill.Ranks.${S}`),
        selected: S === M
      })) : [],
      skillPoolOptions: a ? [
        { value: "choose", label: game.i18n.localize("MAGNUSARCHIVES.Skill.ChoosePool"), selected: D === "choose" },
        ...k.map((S) => ({
          value: S,
          label: game.i18n.localize(`MAGNUSARCHIVES.Pools.${S[0].toUpperCase()}${S.slice(1)}`),
          selected: S === D
        }))
      ] : [],
      skillContextOptions: a ? [
        "attack",
        "attack.weapon",
        "attack.melee",
        "attack.ranged",
        "weapon.light",
        "weapon.medium",
        "weapon.heavy",
        "defense",
        "defense.block",
        "defense.dodge",
        "perception"
      ].map((S) => ({
        value: S,
        label: game.i18n.localize(
          S === "attack" ? "MAGNUSARCHIVES.Combat.Context.AnyAttack" : S === "defense" ? "MAGNUSARCHIVES.Combat.Context.AnyDefense" : `MAGNUSARCHIVES.Combat.Context.${S}`
        ),
        selected: I.includes(S)
      })) : [],
      weaponCategoryOptions: o ? Le.map((S) => ({
        value: S,
        label: game.i18n.localize(`MAGNUSARCHIVES.Combat.Weapon.Category.${S}`),
        selected: i.category === S
      })) : [],
      weaponFamilyDisplay: o ? At(i.family) : "",
      weaponDefaultPoolOptions: o ? ["none", ...k].map((S) => ({
        value: S,
        label: S === "none" ? game.i18n.localize("MAGNUSARCHIVES.Common.None") : game.i18n.localize(`MAGNUSARCHIVES.Pools.${S[0].toUpperCase()}${S.slice(1)}`),
        selected: i.defaultPool === S
      })) : [],
      weaponAttackTypeOptions: o ? Bs.map((S) => ({
        value: S,
        label: game.i18n.localize(`MAGNUSARCHIVES.Combat.Weapon.AttackType.${S}`),
        selected: i.attackType === S
      })) : [],
      rangeOptions: o ? Gn.map((S) => ({
        value: S,
        label: game.i18n.localize(`MAGNUSARCHIVES.Combat.Range.${S}`),
        selected: i.rangeCategory === S
      })) : [],
      weaponAttackModifierOptions: o ? [-2, -1, 0, 1, 2].map((S) => ({
        value: S,
        label: S > 0 ? `+${S}` : String(S),
        selected: i.attackModifier === S
      })) : [],
      weaponSkillLevelOptions: o ? ie.map((S) => ({
        value: S,
        label: game.i18n.localize(`MAGNUSARCHIVES.Skill.Ranks.${S}`),
        selected: i.skillLevel === S
      })) : [],
      combatResourcesExpanded: (o || r || l) && this.#d.has("combat-resources"),
      advancedExpanded: this.#d.has("advanced"),
      shieldWoundsExpanded: l && this.#d.has("shield-wounds"),
      combatDepletionSides: o || r || l ? Zt(i.depletion ?? { die: "d6" }) : 0,
      combatDepletionThreshold: o || r || l ? Oo(Number(i.depletion?.threshold ?? 1)) : "",
      depletionDieOptions: o || p ? xr.map((S) => ({
        value: S,
        label: `1 in 1${S}`,
        selected: i.depletion?.die === S
      })) : [],
      armorCategoryOptions: r ? je.map((S) => ({
        value: S,
        label: game.i18n.localize(`MAGNUSARCHIVES.Combat.Armor.Category.${S}`),
        selected: i.category === S
      })) : [],
      shieldWoundTracks: l ? Mi({
        minor: i.wounds.minor.length,
        moderate: i.wounds.moderate.length,
        major: i.wounds.major.length
      }, i.derived.capacities).map((S) => ({
        ...S,
        label: game.i18n.localize(`MAGNUSARCHIVES.Wounds.Severity.${S.severity}`),
        pips: S.pips.map((J) => ({
          ...J,
          tooltip: game.i18n.format("MAGNUSARCHIVES.Hud.SetWoundCount", {
            severity: game.i18n.localize(`MAGNUSARCHIVES.Wounds.Severity.${S.severity}`),
            count: J.targetCount
          })
        }))
      })) : []
    };
  }
}
function tt(n, e) {
  return String(n[e] ?? "");
}
function Ci(n) {
  return n.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
async function gr(n) {
  const e = await foundry.applications.api.DialogV2.input({
    window: { title: game.i18n.localize(n ? "MAGNUSARCHIVES.Combat.Modification.Edit" : "MAGNUSARCHIVES.Combat.Modification.Create") },
    content: `<div class="magnusarchives-dialog-fields">
      <label>${game.i18n.localize("MAGNUSARCHIVES.Common.Name")} <input name="label" type="text" value="${Ci(n?.label ?? "")}"></label>
      <label>${game.i18n.localize("MAGNUSARCHIVES.Combat.Modification.Contexts")} <input name="contexts" type="text" value="${Ci(n?.contexts.join(", ") ?? "defense.speed")}"></label>
      <label>${game.i18n.localize("MAGNUSARCHIVES.Combat.Modification.ModeLabel")}
        <select name="mode">
          ${["levelOverride", "levelDelta", "ease", "hinder"].map((a) => `<option value="${a}"${n?.mode === a ? " selected" : ""}>${game.i18n.localize(`MAGNUSARCHIVES.Combat.Modification.Mode.${a}`)}</option>`).join("")}
        </select>
      </label>
      <label>${game.i18n.localize("MAGNUSARCHIVES.Combat.Modification.Value")} <input name="value" type="number" step="1" value="${n?.value ?? 0}"></label>
      <label>${game.i18n.localize("MAGNUSARCHIVES.Combat.Modification.Predicate")} <textarea name="predicate">${Ci(JSON.stringify(n?.predicate ?? {}))}</textarea></label>
      <label>${game.i18n.localize("MAGNUSARCHIVES.Combat.Modification.Visibility")}
        <select name="visibility"><option value="gm">${game.i18n.localize("MAGNUSARCHIVES.Combat.Modification.Gm")}</option><option value="public"${n?.visibility === "public" ? " selected" : ""}>${game.i18n.localize("MAGNUSARCHIVES.Combat.Modification.Public")}</option></select>
      </label>
      <label>${game.i18n.localize("MAGNUSARCHIVES.Common.Description")} <textarea name="description">${Ci(n?.description ?? "")}</textarea></label>
    </div>`,
    rejectClose: !1,
    ok: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Save") }
  });
  if (!e) return null;
  const t = JSON.parse(tt(e, "predicate") || "{}");
  if (!t || typeof t != "object" || Array.isArray(t))
    throw new Error("NPC modification predicate must be a JSON object.");
  const i = tt(e, "mode");
  return {
    id: n?.id ?? _e(),
    label: tt(e, "label"),
    contexts: tt(e, "contexts").split(",").map((a) => a.trim()).filter(Boolean),
    mode: i,
    value: Number(tt(e, "value")),
    visibility: tt(e, "visibility") === "public" ? "public" : "gm",
    predicate: t,
    description: tt(e, "description")
  };
}
async function Cm(n) {
  try {
    const e = await gr();
    if (!e) return;
    await n.update({ "system.modifications": [...n.system.modifications, e] });
  } catch (e) {
    ui.notifications.error(e instanceof Error ? e.message : String(e));
  }
}
async function Em(n, e) {
  try {
    const t = n.system.modifications.find((a) => a.id === e);
    if (!t) throw new Error(`NPC modification '${e}' was not found.`);
    const i = await gr(t);
    if (!i) return;
    await n.update({
      "system.modifications": n.system.modifications.map((a) => a.id === e ? i : a)
    });
  } catch (t) {
    ui.notifications.error(t instanceof Error ? t.message : String(t));
  }
}
async function Im(n, e) {
  const t = n.system.modifications.find((a) => a.id === e);
  if (!t) throw new Error(`NPC modification '${e}' was not found.`);
  await foundry.applications.api.DialogV2.confirm({
    window: { title: game.i18n.localize("MAGNUSARCHIVES.Combat.Modification.Delete") },
    content: `<div class="magnusarchives magnusarchives-dialog"><p>${game.i18n.format("MAGNUSARCHIVES.Combat.Modification.DeleteConfirm", { name: t.label })}</p></div>`,
    yes: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Delete") },
    no: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Cancel") }
  }) && await n.update({
    "system.modifications": n.system.modifications.filter((a) => a.id !== e)
  });
}
function Rm(n) {
  const e = typeof n == "number" ? n : typeof n == "string" && n.trim() !== "" ? Number(n) : Number.NaN;
  return Number.isInteger(e) && e >= 0 ? e * 3 : null;
}
function Nm(n, e) {
  const t = cr(n, e), i = t.ratio > 0.5 ? "healthy" : t.ratio > 0.25 ? "intermediate" : "low";
  return { ...t, state: i };
}
const Mm = foundry.applications.api.HandlebarsApplicationMixin(
  foundry.applications.sheets.ActorSheetV2
), Is = /* @__PURE__ */ new Set([
  "requestDefense",
  "createModification",
  "editModification",
  "deleteModification"
]);
class wt extends Mm {
  static DEFAULT_OPTIONS = {
    ...ra,
    classes: ["magnusarchives", "sheet", "actor", "npc-sheet"],
    actions: ca({
      requestDefense: wt.#e,
      createModification: wt.#t,
      editModification: wt.#i,
      deleteModification: wt.#n
    }, Is),
    position: { width: 680, height: 700 },
    window: { resizable: !0 }
  };
  static PARTS = {
    main: { template: "systems/magnusarchives/templates/actor/npc-sheet.hbs" }
  };
  static async #e() {
    await pd(this.actor);
  }
  static async #t() {
    await Cm(this.actor);
  }
  static async #i(e, t) {
    const i = t.dataset.modificationId;
    if (!i) throw new Error("Missing NPC modification ID.");
    await Em(this.actor, i);
  }
  static async #n(e, t) {
    const i = t.dataset.modificationId;
    if (!i) throw new Error("Missing NPC modification ID.");
    await Im(this.actor, i);
  }
  async _onRender(e, t) {
    await super._onRender(e, t), da(this.element, this.isEditable, Is);
  }
  _onClose(e) {
    super._onClose(e);
  }
  async _prepareContext(e) {
    const t = await super._prepareContext(e), i = this.actor.system, a = this.actor._source?.system, s = typeof a?.notes == "string" ? a.notes : "", o = s ? await foundry.applications.ux.TextEditor.implementation.enrichHTML(s, {
      async: !0,
      relativeTo: this.actor
    }) : "";
    return {
      ...t,
      actor: this.actor,
      system: this.actor.system,
      systemFields: la(this.actor),
      editable: this.isEditable,
      isGM: game.user.isGM,
      enriched: { notes: o },
      targetNumber: Rm(i.level) ?? "—",
      healthGauge: Nm(
        i.health.value,
        i.health.max ?? i.health.baseMax
      ),
      damageEffectOptions: xi.map((r) => ({
        value: r,
        label: game.i18n.localize(`MAGNUSARCHIVES.CharacterDamage.${r}`),
        selected: i.damage.effect === r
      })),
      showStressAmount: i.damage.effect === "stress",
      modifications: i.modifications.map((r) => ({
        ...r,
        contextsLabel: r.contexts.join(", "),
        modeLabel: game.i18n.localize(`MAGNUSARCHIVES.Combat.Modification.Mode.${r.mode}`)
      }))
    };
  }
}
function Gm() {
  const { DocumentSheetConfig: n } = foundry.applications.apps;
  n.registerSheet(foundry.documents.Actor, U, C, {
    types: ["character"],
    makeDefault: !0,
    label: "MAGNUSARCHIVES.Sheets.Character"
  }), n.registerSheet(foundry.documents.Actor, U, wt, {
    types: ["npc"],
    makeDefault: !0,
    label: "MAGNUSARCHIVES.Sheets.Npc"
  }), n.registerSheet(foundry.documents.Item, U, $, {
    makeDefault: !0,
    label: "MAGNUSARCHIVES.Sheets.Item"
  });
}
function te(n, e, t = 0) {
  if (!Number.isInteger(n) || n < t)
    throw new Error(`${e} must be an integer of at least ${t}.`);
  return n;
}
function hr(n, e, t) {
  return Math.min(t, Math.max(e, n));
}
function Um(n, e = 0) {
  const t = te(n, "Paid Effort");
  if (t === 0) return 0;
  const i = Math.max(0, Math.trunc(e));
  return 3 + (t - 1) * 2 + t * i;
}
function Ln(n, e, t, i = !1) {
  const a = te(n, "Action cost"), s = te(e, "Effort cost"), o = a + s, r = s + (i ? 0 : a), l = Math.min(r, Math.max(0, Math.trunc(t)));
  return {
    actionCostBeforeEdge: a,
    effortCostBeforeEdge: s,
    totalCostBeforeEdge: o,
    edgeApplied: l,
    poolCost: Math.max(0, o - l)
  };
}
function yr(n) {
  if (te(n, "Natural d20 result", 1), n > 20) throw new Error("Natural d20 result cannot exceed 20.");
  return [1, 17, 18, 19, 20].includes(n) ? [`natural-${n}`] : [];
}
function km(n) {
  return yr(n), Math.floor(n / 3);
}
function An(n, e, t, i, a) {
  return { id: n, label: e, direction: t, steps: i, source: a };
}
function Hm(n) {
  const e = te(n.limits.difficultyCeiling, "Difficulty ceiling"), t = te(n.limits.assetLimit, "Asset limit"), i = te(n.limits.paidEffortMaximum, "Maximum Effort"), a = te(n.assets, "Assets"), s = te(n.paidEffort, "Paid Effort"), o = te(n.damageEffort ?? 0, "Damage Effort"), r = te(n.freeDamageEffort ?? 0, "Free Damage Effort"), l = te(n.freeEffort, "Free Effort"), u = n.limits.totalEffortMaximum === null ? null : te(n.limits.totalEffortMaximum, "Maximum total Effort");
  if (te(n.poolValue, "Pool value"), a > t) throw new Error(`Assets cannot exceed the current limit of ${t}.`);
  const d = o + r, p = s + d + l, y = s + o, m = l + r;
  if (u !== null && p > u)
    throw new Error(`Maximum total Effort: ${u}.`);
  if (y > i)
    throw new Error(`Paid Effort cannot exceed the Character maximum of ${i}.`);
  const h = [];
  a > 0 && h.push(An(
    "core.assets",
    "MAGNUSARCHIVES.Roll.Breakdown.Assets",
    "ease",
    a,
    "asset"
  )), s > 0 && h.push(An(
    "core.effort.paid",
    "MAGNUSARCHIVES.Roll.Breakdown.PaidEffort",
    "ease",
    s,
    "effort"
  )), l > 0 && h.push(An(
    "core.effort.free",
    "MAGNUSARCHIVES.Roll.Breakdown.FreeEffort",
    "ease",
    l,
    "free-effort"
  ));
  for (const G of n.contributions)
    te(G.steps, `Steps for '${G.id}'`), G.steps > 0 && h.push({ ...G });
  const f = h.filter((G) => G.direction === "ease").reduce((G, P) => G + P.steps, 0), A = h.filter((G) => G.direction === "hinder").reduce((G, P) => G + P.steps, 0), v = f - A, E = Ln(
    n.actionCost ?? 0,
    Um(y, n.effortSurcharge ?? 0),
    n.edge,
    n.actionCostIgnoresEdge ?? !1
  );
  let H = null, R = null;
  if (n.difficulty.mode !== "unknown") {
    const G = te(n.difficulty.value, "Difficulty");
    if (G > e)
      throw new Error(`Difficulty cannot exceed the current ceiling of ${e}.`);
    H = hr(G - v, 0, e), R = H * 3;
  }
  return {
    context: n,
    breakdown: h,
    totalEase: f,
    totalHindrance: A,
    netSteps: v,
    damageEffortApplied: d,
    totalEffortApplied: p,
    paidEffortApplied: y,
    freeEffortApplied: m,
    totalEffortMaximum: u,
    ...E,
    finalDifficulty: H,
    targetNumber: R
  };
}
function $m(n, e) {
  if (n.finalDifficulty === 0) return Sr(n);
  const t = yr(e), i = n.targetNumber === null ? null : e >= n.targetNumber, a = km(e), s = hr(
    a + n.netSteps,
    0,
    n.context.limits.difficultyCeiling
  );
  return {
    prepared: n,
    naturalRoll: e,
    naturalDifficulty: a,
    automaticSuccess: !1,
    naturalMarkers: t,
    naturalEffects: [],
    success: i,
    beatsDifficulty: s,
    poolCostPaid: n.poolCost,
    poolCostRefunded: 0
  };
}
function Sr(n) {
  if (n.finalDifficulty !== 0 || n.targetNumber !== 0)
    throw new Error("Automatic success requires a known final difficulty of 0.");
  return {
    prepared: n,
    naturalRoll: null,
    naturalDifficulty: null,
    automaticSuccess: !0,
    naturalMarkers: [],
    naturalEffects: [],
    success: !0,
    beatsDifficulty: null,
    poolCostPaid: n.poolCost,
    poolCostRefunded: 0
  };
}
function bn(n) {
  return n === null ? "unresolved" : n ? "applied" : "inapplicable";
}
function Vm(n, e = 1) {
  const t = n.naturalRoll;
  if (t === null) return [];
  const i = { sourceId: "magnusarchives.core", naturalRoll: t }, a = $t(e);
  if (t === 1)
    return [{
      ...i,
      id: "core.natural-1.intrusion",
      kind: "gm-intrusion",
      status: "applied",
      label: "MAGNUSARCHIVES.Roll.NaturalEffects.GMIntrusion",
      triggersGMIntrusion: !0,
      intrusionProvenance: "natural-1"
    }];
  const s = t <= a ? [{
    id: `core.horror-mode.natural-${t}.intrusion`,
    sourceId: "magnusarchives.horror-mode",
    naturalRoll: t,
    kind: "gm-intrusion",
    status: "applied",
    label: "MAGNUSARCHIVES.Roll.NaturalEffects.GMIntrusion",
    triggersGMIntrusion: !0,
    intrusionProvenance: "horror-mode",
    horrorIntrusionRange: a
  }] : [];
  if (t === 17 || t === 18) {
    const o = n.prepared.context.purpose === "damage";
    return [...s, {
      ...i,
      id: `core.natural-${t}.damage`,
      kind: "damage-bonus",
      status: o ? bn(n.success) : "inapplicable",
      label: `MAGNUSARCHIVES.Roll.NaturalEffects.Damage${t}`,
      damageBonus: t === 17 ? 1 : 2
    }];
  }
  if (t === 19) {
    const o = bn(n.success);
    if (n.prepared.context.purpose === "damage") {
      const r = o === "applied" ? "available" : o;
      return [...s, {
        ...i,
        id: "core.natural-19.damage",
        kind: "damage-bonus",
        status: r,
        label: "MAGNUSARCHIVES.Roll.NaturalEffects.Damage19",
        damageBonus: 3,
        choiceGroup: "core.natural-19.choice"
      }, {
        ...i,
        id: "core.natural-19.minor",
        kind: "minor-effect",
        status: r,
        label: "MAGNUSARCHIVES.Roll.NaturalEffects.Minor",
        choiceGroup: "core.natural-19.choice"
      }];
    }
    return [...s, {
      ...i,
      id: "core.natural-19.minor",
      kind: "minor-effect",
      status: o,
      label: "MAGNUSARCHIVES.Roll.NaturalEffects.Minor"
    }];
  }
  if (t === 20) {
    const o = bn(n.success), r = n.prepared.context.purpose === "damage" ? [{
      ...i,
      id: "core.natural-20.damage",
      kind: "damage-bonus",
      status: o === "applied" ? "available" : o,
      label: "MAGNUSARCHIVES.Roll.NaturalEffects.Damage20",
      damageBonus: 4,
      choiceGroup: "core.natural-20.choice"
    }, {
      ...i,
      id: "core.natural-20.major",
      kind: "major-effect",
      status: o === "applied" ? "available" : o,
      label: "MAGNUSARCHIVES.Roll.NaturalEffects.Major",
      choiceGroup: "core.natural-20.choice"
    }] : [{
      ...i,
      id: "core.natural-20.major",
      kind: "major-effect",
      status: o,
      label: "MAGNUSARCHIVES.Roll.NaturalEffects.Major"
    }];
    return n.prepared.poolCost > 0 && r.push({
      ...i,
      id: "core.natural-20.refund",
      kind: "pool-cost-refund",
      status: "applied",
      label: "MAGNUSARCHIVES.Roll.NaturalEffects.Refund",
      refundsPoolCost: !0
    }), [...s, ...r];
  }
  return s;
}
const it = {
  id: "magnusarchives.core",
  title: "MAGNUSARCHIVES.Rules.Core",
  version: "0.1.0",
  core: !0,
  priority: -1e3,
  extensionPoints: [
    "actorDerivedData",
    "rollModifiers",
    "recoveryRules",
    "restRules",
    "woundRules",
    "poolRules",
    "rallyRules",
    "durationTriggers",
    "difficultyPolicies",
    "skillRules",
    "naturalResultRules",
    "gmIntrusionRules",
    "combatRules",
    "targetRules",
    "damageRules",
    "advancementRules",
    "focusBehaviors"
  ]
};
function Dm(n) {
  n.register(it), n.registerDifficultyPolicy(it.id, (e) => ({
    ...e,
    assetLimit: 2
  })), n.registerSkillRankRule(it.id, zm), n.registerNaturalResultRule(it.id, (e, t) => [
    ...t,
    ...Vm(e, e.prepared.context.horrorIntrusionRange)
  ]), n.registerGMIntrusionPolicy(it.id, (e) => ({
    ...e,
    targetedXpToTarget: 1,
    targetedXpToShare: 1,
    groupXpPerTarget: 1,
    freeXp: 0
  })), n.registerCombatPolicy(it.id, () => Fm), n.registerAdvancementPolicy(it.id, () => no);
}
const Fm = Object.freeze({
  weaponDamage: Object.freeze({ light: 2, medium: 4, heavy: 6 }),
  lightWeaponEase: 1,
  unfamiliarWeaponHindrance: 1,
  armorDefenseSteps: Object.freeze({ light: 1, medium: 2, heavy: 3 }),
  blockSeverityReduction: 1,
  damageEffortBonus: 3
}), Tm = Object.freeze({
  inability: -1,
  untrained: 0,
  trained: 1,
  specialized: 2,
  expert: 3
});
function zm(n, e) {
  const t = Tm[n];
  return t === 0 ? null : {
    id: `core.skill.${e.id}.rank`,
    label: `MAGNUSARCHIVES.Skill.Ranks.${n}`,
    direction: t > 0 ? "ease" : "hinder",
    steps: Math.abs(t),
    source: "skill",
    sourceId: e.id
  };
}
class Pm {
  #e = /* @__PURE__ */ new Map();
  #t = /* @__PURE__ */ new Map();
  #i = /* @__PURE__ */ new Map();
  #n = /* @__PURE__ */ new Map();
  #a = /* @__PURE__ */ new Map();
  #l = /* @__PURE__ */ new Map();
  #r = /* @__PURE__ */ new Map();
  #s = /* @__PURE__ */ new Map();
  #c = /* @__PURE__ */ new Map();
  register(e) {
    const t = e.id.trim();
    if (!t) throw new Error("Rule module IDs cannot be blank.");
    if (this.#e.has(t)) throw new Error(`Rule module '${t}' is already registered.`);
    const i = Object.freeze({
      ...e,
      id: t,
      priority: e.priority ?? 0,
      dependencies: Object.freeze([...e.dependencies ?? []]),
      conflicts: Object.freeze([...e.conflicts ?? []]),
      extensionPoints: Object.freeze([...e.extensionPoints ?? []])
    });
    return this.#e.set(t, i), i;
  }
  get(e) {
    return this.#e.get(e);
  }
  has(e) {
    return this.#e.has(e);
  }
  list() {
    return [...this.#e.values()].sort(
      (e, t) => (e.priority ?? 0) - (t.priority ?? 0) || e.id.localeCompare(t.id)
    );
  }
  active(e) {
    const t = new Set(e);
    return this.list().filter((i) => i.core === !0 || t.has(i.id));
  }
  diagnostics(e) {
    const t = this.active(e), i = new Set(t.map((s) => s.id)), a = [];
    for (const s of t) {
      for (const o of s.dependencies ?? [])
        i.has(o) || a.push({
          severity: "error",
          moduleId: s.id,
          message: `Missing active dependency '${o}'.`
        });
      for (const o of s.conflicts ?? [])
        i.has(o) && a.push({
          severity: "error",
          moduleId: s.id,
          message: `Conflicts with active module '${o}'.`
        });
    }
    return a;
  }
  registerDifficultyPolicy(e, t) {
    this.#o(e, "difficultyPolicies");
    const i = this.#t.get(e) ?? [];
    i.push(t), this.#t.set(e, i);
  }
  resolveDifficultyPolicy(e, t = []) {
    let i = { ...e };
    for (const a of this.active(t))
      for (const s of this.#t.get(a.id) ?? [])
        i = { ...s(Object.freeze({ ...i })) };
    if (!Number.isInteger(i.difficultyCeiling) || i.difficultyCeiling < 0)
      throw new Error("Difficulty policies must provide a non-negative integer ceiling.");
    if (!Number.isInteger(i.assetLimit) || i.assetLimit < 0)
      throw new Error("Difficulty policies must provide a non-negative integer Asset limit.");
    return Object.freeze(i);
  }
  registerRollContextEnricher(e, t) {
    this.#o(e, "rollModifiers");
    const i = this.#i.get(e) ?? [];
    i.push(t), this.#i.set(e, i);
  }
  enrichRollContext(e, t = []) {
    let i = e;
    for (const a of this.active(t))
      for (const s of this.#i.get(a.id) ?? [])
        i = s(Object.freeze(i));
    return i;
  }
  registerSkillRankRule(e, t) {
    this.#o(e, "skillRules");
    const i = this.#n.get(e) ?? [];
    i.push(t), this.#n.set(e, i);
  }
  resolveSkillRankContribution(e, t, i = []) {
    let a = null;
    for (const s of this.active(i))
      for (const o of this.#n.get(s.id) ?? [])
        a = o(e, t) ?? a;
    return a;
  }
  registerNaturalResultRule(e, t) {
    this.#o(e, "naturalResultRules");
    const i = this.#a.get(e) ?? [];
    i.push(t), this.#a.set(e, i);
  }
  resolveNaturalEffects(e, t = []) {
    let i = [];
    for (const a of this.active(t))
      for (const s of this.#a.get(a.id) ?? [])
        i = s(Object.freeze(e), Object.freeze([...i]));
    return Object.freeze([...i]);
  }
  registerGMIntrusionPolicy(e, t) {
    this.#o(e, "gmIntrusionRules");
    const i = this.#l.get(e) ?? [];
    i.push(t), this.#l.set(e, i);
  }
  resolveGMIntrusionPolicy(e, t = []) {
    let i = { ...e };
    for (const a of this.active(t))
      for (const s of this.#l.get(a.id) ?? [])
        i = { ...s(Object.freeze({ ...i })) };
    return Object.freeze(i);
  }
  registerCombatPolicy(e, t) {
    this.#o(e, "combatRules");
    const i = this.#r.get(e) ?? [];
    i.push(t), this.#r.set(e, i);
  }
  resolveCombatPolicy(e, t = []) {
    let i = { ...e };
    for (const a of this.active(t))
      for (const s of this.#r.get(a.id) ?? [])
        i = { ...s(Object.freeze({ ...i })) };
    return Object.freeze(i);
  }
  registerTargetResolutionRule(e, t) {
    this.#o(e, "targetRules");
    const i = this.#s.get(e) ?? [];
    i.push(t), this.#s.set(e, i);
  }
  enrichTargetResolution(e, t, i, a = []) {
    let s = e;
    for (const o of this.active(a))
      for (const r of this.#s.get(o.id) ?? [])
        s = r(Object.freeze(s), Object.freeze(t), Object.freeze(i));
    return Object.freeze(s);
  }
  registerAdvancementPolicy(e, t) {
    this.#o(e, "advancementRules");
    const i = this.#c.get(e) ?? [];
    i.push(t), this.#c.set(e, i);
  }
  resolveAdvancementPolicy(e, t = []) {
    let i = { ...e };
    for (const a of this.active(t))
      for (const s of this.#c.get(a.id) ?? [])
        i = { ...s(Object.freeze({ ...i })) };
    for (const [a, s] of Object.entries({
      xpCost: i.xpCost,
      purchasesPerTier: i.purchasesPerTier,
      capabilityPoints: i.capabilityPoints,
      effortMaximum: i.effortMaximum,
      recoveryBonus: i.recoveryBonus,
      attackDefenseTrainingTier: i.attackDefenseTrainingTier,
      attackDefenseSpecializationTier: i.attackDefenseSpecializationTier
    }))
      if (!Number.isInteger(s) || s < 0)
        throw new Error(`Advancement policy '${a}' must be a non-negative integer.`);
    return Object.freeze(i);
  }
  #o(e, t) {
    const i = this.#e.get(e);
    if (!i) throw new Error(`Rule module '${e}' must be registered before its behaviors.`);
    if (!i.extensionPoints?.includes(t))
      throw new Error(`Rule module '${e}' does not declare '${t}'.`);
  }
}
async function xm() {
  const n = await new Roll("1d6").evaluate();
  return Number(n.total);
}
function Ei(n, e, t, i) {
  if (!Number.isInteger(n) || n < e || n > t)
    throw new Error(`${i} must be an integer from ${e} to ${t}.`);
  return n;
}
class qm {
  #e;
  #t;
  #i;
  constructor(e = xm, t = _e, i = Date.now) {
    this.#e = e, this.#t = t, this.#i = i;
  }
  calculateRoll(e, t, i, a = !1, s = 0, o = "") {
    Ei(i, 1, 6, "Recovery die"), Ei(t, 1, Number.MAX_SAFE_INTEGER, "Tier"), Ei(s, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, "Recovery bonus");
    const r = s + (e === "one-action" && a ? 2 : 0);
    return { slotId: o, type: e, dieResult: i, tier: t, bonus: r, total: Math.max(0, i + t + r), lastAction: a };
  }
  availableTypes(e) {
    return Qs(e);
  }
  isAvailable(e, t) {
    return !e[ii[t]];
  }
  slots(e) {
    return e.system.recovery.slots?.length ? e.system.recovery.slots.map((t) => ({ ...t })) : lt(e.system.recovery.used);
  }
  availableSlots(e) {
    return Lt(this.slots(e));
  }
  async roll(e, t, i = !1, a) {
    qe(e);
    const s = this.availableSlots(e).find((o) => o.type === t && (!a || o.id === a));
    if (!s)
      throw new Error(`The '${t}' Core Recovery has already been used today.`);
    return this.calculateRoll(
      t,
      L(e.system),
      await this.#e(),
      i,
      e.system.derived.recovery.bonus,
      s.id
    );
  }
  distribute(e, t, i) {
    const a = k.reduce((r, l) => r + Ei(i[l], 0, Number.MAX_SAFE_INTEGER, `${l} allocation`), 0);
    if (a > t.total) throw new Error("Recovery allocations exceed the Recovery result.");
    const s = {}, o = {};
    for (const r of k) {
      const l = e.system.stats[r].value, u = e.system.derived.pools[r].max, d = Math.max(0, u - l);
      if (i[r] > d)
        throw new Error(`${r} allocation exceeds the Pool's missing points.`);
      o[r] = i[r], s[r] = l + o[r];
    }
    return {
      roll: t,
      requested: { ...i },
      restored: o,
      values: s,
      unspent: t.total - a
    };
  }
  prepareNormal(e, t, i) {
    qe(e);
    const a = this.slots(e), s = t.slotId || Lt(a).find((d) => d.type === t.type)?.id || "", o = ka(a, s, t.type), r = this.distribute(e, t, i), l = Rt(o), u = {
      id: this.#t(),
      slotId: s,
      kind: "normal",
      type: t.type,
      rolled: !0,
      dieResult: t.dieResult,
      tier: t.tier,
      bonus: t.bonus,
      total: t.total,
      might: r.restored.might,
      speed: r.restored.speed,
      intellect: r.restored.intellect,
      timestamp: this.#i()
    };
    return { ...r, kind: "normal", used: l, slots: o, historyEntry: u };
  }
  prepareNonRest(e, t, i) {
    qe(e);
    const a = this.slots(e), s = Lt(a).find((d) => d.type === t && (!i || d.id === i));
    if (!s)
      throw new Error(`The '${t}' Core Recovery has already been used today.`);
    const o = ka(a, s.id, t), r = Rt(o), l = { might: 0, speed: 0, intellect: 0 }, u = {
      id: this.#t(),
      slotId: s.id,
      kind: "nonRest",
      type: t,
      rolled: !1,
      dieResult: 0,
      tier: L(e.system),
      bonus: 0,
      total: 0,
      ...l,
      timestamp: this.#i()
    };
    return {
      kind: "nonRest",
      roll: null,
      requested: { ...l },
      restored: { ...l },
      values: {
        might: e.system.stats.might.value,
        speed: e.system.stats.speed.value,
        intellect: e.system.stats.intellect.value
      },
      unspent: 0,
      used: r,
      slots: o,
      historyEntry: u
    };
  }
}
const Om = {
  beforeComplete(n) {
    Hooks.callAll("magnusarchives.preRecoveryWorkflow", n);
  },
  processDurations(n) {
    Hooks.callAll("magnusarchives.processRecoveryDurations", n);
  },
  afterComplete(n) {
    Hooks.callAll("magnusarchives.recoveryCompleted", n), n.kind === "normal" && n.rest && Hooks.callAll("magnusarchives.restCompleted", n), n.kind === "nonRest" && Hooks.callAll("magnusarchives.nonRestRecoveryCompleted", n);
  },
  refresh(n) {
    Hooks.callAll("magnusarchives.recoveryRefresh", n);
  }
};
function Bm(n) {
  return n === "one-action" ? null : n;
}
function Rs(n, e) {
  const t = [n === "normal" ? "recovery" : "non-rest-recovery"];
  return e !== "one-action" && t.push("10-minute-or-longer"), (e === "1-hour" || e === "10-hours") && t.push("1-hour-or-longer"), e === "10-hours" && t.push("10-hour"), t;
}
class Lm {
  #e;
  #t;
  #i;
  constructor(e, t, i = Om) {
    this.#e = e, this.#t = t, this.#i = i;
  }
  async rollNormal(e, t, i = !1, a) {
    return this.#e.roll(e, t, i, a);
  }
  async completeNormal(e, t, i, a = {}) {
    qe(e);
    const s = Bm(t.type), o = s ? this.#t.prepare(e, s, a) : null, r = this.#e.prepareNormal(e, t, i), l = {
      kind: "normal",
      type: t.type,
      recovery: r,
      rest: o,
      durationTriggers: Rs("normal", t.type)
    };
    await this.#i.beforeComplete(l);
    const u = {
      "system.stats.might.value": r.values.might,
      "system.stats.speed.value": r.values.speed,
      "system.stats.intellect.value": r.values.intellect
    };
    return o && (u["system.wounds"] = o.result.wounds, u["system.rest.lastType"] = o.result.type, u["system.rest.history"] = [...e.system.rest.history, o.historyEntry]), u["system.recovery.used"] = r.used, u["system.recovery.slots"] = r.slots, u["system.recovery.history"] = [...e.system.recovery.history, r.historyEntry], await e.update(u), await this.#i.processDurations(l), await this.#i.afterComplete(l), await this.#i.refresh(l), l;
  }
  async completeNonRest(e, t, i) {
    qe(e);
    const a = this.#e.prepareNonRest(e, t, i), s = {
      kind: "nonRest",
      type: t,
      recovery: a,
      rest: null,
      durationTriggers: Rs("nonRest", t)
    };
    return await this.#i.beforeComplete(s), await e.update({
      "system.recovery.used": a.used,
      "system.recovery.slots": a.slots,
      "system.recovery.history": [...e.system.recovery.history, a.historyEntry]
    }), await this.#i.processDurations(s), await this.#i.afterComplete(s), await this.#i.refresh(s), s;
  }
}
const Ns = Object.freeze({
  "10-minutes": 0,
  "1-hour": 1,
  "10-hours": 10
});
class jm {
  #e;
  #t;
  constructor(e = _e, t = Date.now) {
    this.#e = e, this.#t = t;
  }
  /** Points of Stress a rest of this type removes (p12). */
  stressRelief(e) {
    return Ns[e] * 3;
  }
  rest(e, t, i = {}, a = 0) {
    const s = yt(e), o = [];
    let r = "";
    if (t === "10-minutes")
      o.push(...s.minor), s.minor = [], r = "remove-minors";
    else if (t === "1-hour")
      if (r = i.oneHourChoice ?? "remove-moderate", r === "remove-minors")
        o.push(...s.minor), s.minor = [];
      else {
        const l = s.moderate.pop();
        l && o.push(l);
      }
    else if (t === "10-hours") {
      const l = i.removeMinorsInsteadOfOneModerate === !0 && s.minor.length > 0 && s.moderate.length > 0;
      if (r = l ? "remove-minors-instead-of-one-moderate" : "remove-all-moderate", l ? (o.push(...s.minor), s.minor = [], o.push(...s.moderate.slice(1)), s.moderate = s.moderate.slice(0, 1)) : (o.push(...s.moderate), s.moderate = []), i.majorTaskSucceeded === !0) {
        const u = s.major.pop();
        u && o.push(u);
      }
    }
    return {
      type: t,
      stressBefore: a,
      stress: Xs(a, Ns[t]),
      wounds: s,
      removed: o,
      choice: r,
      majorTaskSucceeded: i.majorTaskSucceeded === !0
    };
  }
  prepare(e, t, i = {}) {
    qe(e);
    const a = this.rest(e.system.wounds, t, i, e.system.stress.value);
    return {
      result: a,
      historyEntry: {
        id: this.#e(),
        type: t,
        choice: a.choice,
        majorTaskSucceeded: a.majorTaskSucceeded,
        removedWoundIds: a.removed.map((s) => s.id),
        timestamp: this.#t()
      }
    };
  }
  async apply(e, t, i = {}) {
    const { result: a, historyEntry: s } = this.prepare(e, t, i);
    return await e.update({
      "system.wounds": a.wounds,
      "system.stress.value": a.stress,
      "system.rest.lastType": t,
      "system.rest.history": [...e.system.rest.history, s]
    }), a;
  }
}
function ht(n, e) {
  if (!Number.isInteger(n) || n < 0)
    throw new Error(`${e} must be a non-negative integer.`);
  return n;
}
class Ar {
  /** Adds Stress points. Returns the new total and any Stress Levels crossed. */
  async applyStress(e, t) {
    return j(e), ht(t, "Stress"), this.#t(e, e.system.stress.value + t);
  }
  /** Removes Stress points, never dropping below zero. */
  async relieveStress(e, t) {
    return j(e), ht(t, "Stress"), this.#t(e, e.system.stress.value - t);
  }
  /** Rest removes 3 points of Stress — one level — for each hour (p12). */
  async restStress(e, t) {
    return j(e), ht(t, "Hours of rest"), this.#t(e, Xs(e.system.stress.value, t));
  }
  async setStress(e, t) {
    return j(e), ht(t, "Stress"), this.#t(e, t);
  }
  /** A serious injury moves the Character down the damage track. */
  async applySeriousInjury(e, t = 1) {
    j(e), ht(t, "Damage track steps");
    const { step: i, hurtAvailable: a } = this.#e(e);
    return this.#i(e, i, jr(i, a, t));
  }
  /** Recovery moves the Character back up the damage track. */
  async healDamageTrack(e, t = 1) {
    j(e), ht(t, "Damage track steps");
    const { step: i, hurtAvailable: a } = this.#e(e);
    return this.#i(e, i, Wr(i, a, t));
  }
  async setDamageTrackStep(e, t) {
    j(e);
    const { step: i, hurtAvailable: a } = this.#e(e);
    return this.#i(e, i, Et(t, a));
  }
  #e(e) {
    const t = e.system.derived.damageTrack.hurtAvailable;
    return {
      step: Et(e.system.damageTrack.step, t),
      hurtAvailable: t
    };
  }
  async #t(e, t) {
    const i = e.system.stress.value, a = Math.max(0, t);
    a !== i && await e.update({ "system.stress.value": a });
    const s = ki(i), o = ki(a);
    return {
      previousValue: i,
      value: a,
      previousLevel: s,
      level: o,
      levelsGained: Math.max(0, o - s)
    };
  }
  async #i(e, t, i) {
    i !== t && await e.update({ "system.damageTrack.step": i });
    const a = e.system.derived.damageTrack.steps;
    return {
      previousStep: t,
      step: i,
      steps: Math.abs(a.indexOf(i) - a.indexOf(t)),
      dead: i === "dead"
    };
  }
}
const Ms = { minor: 3, moderate: 3, major: 3 };
function qt(n, e) {
  if (!Number.isInteger(n) || n < 0)
    throw new Error(`${e} must be a non-negative integer.`);
  return n;
}
function Wm(n) {
  return qt(n, "Pool damage overflow"), n === 0 ? null : n <= 4 ? "minor" : n <= 8 ? "moderate" : "major";
}
class _m {
  #e;
  constructor(e = _e) {
    this.#e = e;
  }
  applyWound(e, t, i = Ms, a = {}) {
    const s = yt(e), o = {
      id: a.id ?? this.#e(),
      label: a.label ?? `${t[0]?.toUpperCase()}${t.slice(1)} Wound`,
      description: a.description ?? "",
      sourceUuid: a.sourceUuid ?? "magnusarchives.core",
      treated: a.treated ?? !1
    }, r = ge.indexOf(t);
    if (r < 0) throw new Error(`Unsupported Wound severity '${t}'.`);
    for (let l = r; l < ge.length; l += 1) {
      const u = ge[l];
      if (!(s[u].length >= i[u]))
        return s[u].push(o), {
          wounds: s,
          requestedSeverity: t,
          appliedSeverity: u,
          overflowSteps: l - r,
          record: o,
          applied: !0,
          dead: s.major.length >= i.major
        };
    }
    return {
      wounds: s,
      requestedSeverity: t,
      appliedSeverity: null,
      overflowSteps: ge.length - r,
      record: null,
      applied: !1,
      dead: s.major.length >= i.major
    };
  }
  removeOne(e, t, i) {
    const a = yt(e), s = i ? a[t].findIndex((r) => r.id === i) : a[t].length - 1;
    if (s < 0) return { wounds: a, removed: null };
    const [o] = a[t].splice(s, 1);
    return { wounds: a, removed: o ?? null };
  }
  updateWound(e, t, i, a) {
    if (typeof a.label != "string" || typeof a.description != "string")
      throw new Error("Wound label and description must be strings.");
    const s = yt(e), o = s[t].findIndex((u) => u.id === i);
    if (o < 0) throw new Error(`Wound '${i}' was not found in ${t} Wounds.`);
    const l = { ...s[t][o], label: a.label, description: a.description };
    return s[t][o] = l, { wounds: s, updated: l };
  }
  removeAll(e, t) {
    const i = yt(e), a = i[t];
    return i[t] = [], { wounds: i, removed: a };
  }
  setWoundCount(e, t, i, a, s = {}) {
    const o = qt(i, "Wound count"), r = qt(a, "Wound capacity");
    if (o > r) throw new Error("Wound count cannot exceed its capacity.");
    const l = yt(e), u = l[t], d = u.length, p = o < d ? u.splice(o) : [], y = [];
    for (; u.length < o; ) {
      const m = {
        id: this.#e(),
        label: s.label ?? `${t[0]?.toUpperCase()}${t.slice(1)} Wound`,
        description: s.description ?? "",
        sourceUuid: s.sourceUuid ?? "magnusarchives.manual",
        treated: s.treated ?? !1
      };
      u.push(m), y.push(m);
    }
    return { wounds: l, severity: t, previousCount: d, count: o, added: y, removed: p };
  }
  applyPoolDamage(e, t, i, a, s = Ms, o = {}) {
    const r = qt(i, "Pool value"), l = qt(a, "Pool damage"), u = Math.min(r, l), d = r - u, p = l - u, y = Wm(p), m = y ? this.applyWound(e, y, s, {
      ...o,
      label: o.label ?? `${t} Pool overflow`
    }) : null;
    return {
      pool: t,
      damage: l,
      previousValue: r,
      value: d,
      absorbed: u,
      overflow: p,
      overflowSeverity: y,
      wound: m
    };
  }
  async apply(e, t, i = {}) {
    return j(e), this.applyTrack(e, t, e.system.derived.wounds.capacities, i);
  }
  async applyTrack(e, t, i, a = {}) {
    const s = this.applyWound(e.system.wounds, t, i, a);
    return s.applied && await e.update({ "system.wounds": s.wounds }), s;
  }
  async edit(e, t, i, a) {
    return j(e), this.editTrack(e, t, i, a);
  }
  async editTrack(e, t, i, a) {
    const s = this.updateWound(e.system.wounds, t, i, a);
    return await e.update({ "system.wounds": s.wounds }), s;
  }
  async setCount(e, t, i, a = {}) {
    return j(e), this.setTrackCount(
      e,
      t,
      i,
      e.system.derived.wounds.capacities[t],
      a
    );
  }
  async setTrackCount(e, t, i, a, s = {}) {
    const o = this.setWoundCount(e.system.wounds, t, i, a, s);
    return o.count !== o.previousCount && await e.update({ "system.wounds": o.wounds }), o;
  }
  async delete(e, t, i) {
    return j(e), this.deleteTrack(e, t, i);
  }
  async deleteTrack(e, t, i) {
    const a = this.removeOne(e.system.wounds, t, i);
    if (!a.removed) throw new Error(`Wound '${i}' was not found in ${t} Wounds.`);
    return await e.update({ "system.wounds": a.wounds }), { wounds: a.wounds, removed: a.removed };
  }
  async damagePool(e, t, i, a = {}) {
    j(e);
    const s = this.applyPoolDamage(
      e.system.wounds,
      t,
      e.system.stats[t].value,
      i,
      e.system.derived.wounds.capacities,
      a
    ), o = { [`system.stats.${t}.value`]: s.value };
    return s.wound?.applied && (o["system.wounds"] = s.wound.wounds), await e.update(o), s;
  }
}
function Km(n, e) {
  return n.naturalEffects.filter((t) => t.status !== "inapplicable").map((t) => ({
    kind: t.kind,
    label: e(t.label),
    status: e(`MAGNUSARCHIVES.Roll.NaturalEffects.Status.${t.status}`),
    isIntrusion: t.kind === "gm-intrusion",
    ...t.damageBonus === void 0 ? {} : { damageBonus: t.damageBonus }
  }));
}
function Xm(n, e) {
  const t = n.naturalEffects.filter((l) => l.status !== "inapplicable");
  if (t.some((l) => l.kind === "gm-intrusion"))
    return { label: e("MAGNUSARCHIVES.Roll.NaturalEffects.GMIntrusion") };
  const i = t.find((l) => l.kind === "damage-bonus"), a = i?.damageBonus === void 0 ? void 0 : `+${i.damageBonus} ${e("MAGNUSARCHIVES.Roll.NaturalEffects.Damage")}`, s = t.some((l) => l.kind === "minor-effect") || n.naturalRoll === 19 && i !== void 0, o = t.some((l) => l.kind === "major-effect") || n.naturalRoll === 20 && i !== void 0;
  if (s)
    return {
      label: e("MAGNUSARCHIVES.Roll.SpecialRoll.MinorEffect"),
      ...a ? { damage: a } : {}
    };
  if (o)
    return {
      label: e("MAGNUSARCHIVES.Roll.SpecialRoll.MajorEffect"),
      ...a ? { damage: a } : {}
    };
  if (i)
    return {
      label: e("MAGNUSARCHIVES.Roll.SpecialRoll.DamageBonus"),
      ...a ? { damage: a } : {}
    };
  const r = t[0];
  return r ? { label: e(r.label) } : null;
}
function Gs(n, e, t) {
  return `${Ee(e, n)} ${t(e === "ease" ? n === 1 ? "MAGNUSARCHIVES.Roll.EaseStep" : "MAGNUSARCHIVES.Roll.EaseSteps" : n === 1 ? "MAGNUSARCHIVES.Roll.HindranceStep" : "MAGNUSARCHIVES.Roll.HindranceSteps")}`;
}
function Ym(n, e) {
  return n.breakdown.map((t) => ({
    label: e(t.label),
    value: Ee(t.direction, t.steps)
  }));
}
function Jm(n, e) {
  return n.breakdown.length === 0 && n.totalEase === 0 && n.totalHindrance === 0 ? [] : [{
    label: e("MAGNUSARCHIVES.Roll.TotalEase"),
    value: n.totalEase === 0 ? 0 : Ee("ease", n.totalEase)
  }, {
    label: e("MAGNUSARCHIVES.Roll.TotalHindrance"),
    value: n.totalHindrance === 0 ? 0 : Ee("hinder", n.totalHindrance)
  }];
}
function Qm(n, e) {
  const t = n.prepared, i = t.context;
  return [
    ...i.paidEffort > 0 ? [{
      label: e("MAGNUSARCHIVES.Roll.PaidEffort"),
      value: i.paidEffort
    }] : [],
    ...(i.damageEffort ?? 0) > 0 ? [{
      label: e("MAGNUSARCHIVES.Roll.PaidDamageEffort"),
      value: i.damageEffort ?? 0
    }] : [],
    ...i.freeEffort > 0 ? [{
      label: e("MAGNUSARCHIVES.Roll.FreeEffort"),
      value: i.freeEffort
    }] : [],
    ...(i.freeDamageEffort ?? 0) > 0 ? [{
      label: e("MAGNUSARCHIVES.Roll.FreeDamageEffort"),
      value: i.freeDamageEffort ?? 0
    }] : [],
    ...t.totalEffortApplied > 0 ? [{
      label: e("MAGNUSARCHIVES.Roll.TotalAppliedEffort"),
      value: t.totalEffortMaximum === null ? String(t.totalEffortApplied) : `${t.totalEffortApplied} / ${t.totalEffortMaximum}`
    }] : []
  ];
}
function Zm(n, e) {
  const t = n.prepared, i = t.actionCostBeforeEdge > 0 || t.effortCostBeforeEdge > 0 || n.poolCostPaid > 0;
  return [
    ...t.actionCostBeforeEdge > 0 ? [{
      label: e("MAGNUSARCHIVES.Ability.Cost"),
      value: t.actionCostBeforeEdge
    }] : [],
    ...t.edgeApplied > 0 ? [{
      label: e("MAGNUSARCHIVES.Pools.Edge"),
      value: t.edgeApplied
    }] : [],
    ...i ? [{
      label: e("MAGNUSARCHIVES.Roll.CostPaid"),
      value: n.poolCostPaid
    }] : [],
    ...n.poolCostRefunded > 0 ? [{
      label: e("MAGNUSARCHIVES.Roll.NaturalEffects.Refunded"),
      value: n.poolCostRefunded
    }] : []
  ];
}
function ep(n, e) {
  const t = n.naturalEffects.find((i) => i.kind === "gm-intrusion" && i.status === "applied" && i.intrusionProvenance === "horror-mode" && i.horrorIntrusionRange !== void 0);
  return t?.horrorIntrusionRange === void 0 ? [] : [{
    label: e("MAGNUSARCHIVES.Horror.Title"),
    value: `1–${t.horrorIntrusionRange}`
  }];
}
function br(n, e) {
  const t = n.prepared, i = t.context.pool ? `${t.context.pool[0].toUpperCase()}${t.context.pool.slice(1)}` : null, a = Km(n, e), s = a.filter((r) => !r.isIntrusion), o = [
    ...t.totalEase > 0 ? [Gs(t.totalEase, "ease", e)] : [],
    ...t.totalHindrance > 0 ? [Gs(t.totalHindrance, "hinder", e)] : []
  ].join(" · ");
  return {
    actorName: t.context.actor.name,
    rollLabel: e(t.context.label),
    ...i ? { poolLabel: e(`MAGNUSARCHIVES.Pools.${i}`) } : {},
    naturalRoll: n.naturalRoll,
    naturalDifficulty: n.naturalDifficulty,
    showNaturalRoll: n.naturalRoll !== null,
    showNaturalDifficulty: n.naturalDifficulty !== null,
    breakdown: t.breakdown.map((r) => ({
      label: e(r.label),
      direction: e(
        r.direction === "ease" ? "MAGNUSARCHIVES.Roll.Ease" : "MAGNUSARCHIVES.Roll.Hinder"
      ),
      steps: r.steps,
      isEase: r.direction === "ease",
      modifier: Ee(r.direction, r.steps)
    })),
    modifierDetails: Ym(t, e),
    modifierTotalDetails: Jm(t, e),
    effortDetails: Qm(n, e),
    costDetails: Zm(n, e),
    stepSummary: o,
    showStepSummary: o.length > 0,
    paidEffort: t.context.paidEffort,
    damageEffort: t.damageEffortApplied,
    freeEffort: t.context.freeEffort,
    poolCost: n.poolCostPaid,
    poolCostRefunded: n.poolCostRefunded,
    actionCost: t.actionCostBeforeEdge,
    totalEase: t.totalEase,
    totalHindrance: t.totalHindrance,
    netSteps: t.netSteps,
    naturalEffects: a,
    specialRoll: Xm(n, e),
    hasNaturalResult: n.naturalMarkers.length > 0,
    hasNaturalEffectDisclosure: s.length > 0,
    gmIntrusion: a.some((r) => r.isIntrusion),
    hasExceptionalResult: a.length > 0,
    ...t.context.origin?.kind === "skill" ? {
      skillName: t.context.origin.name,
      skillRank: e(`MAGNUSARCHIVES.Skill.Ranks.${t.context.origin.rank}`),
      skillRankClass: t.context.origin.rank
    } : {},
    ...t.context.target ? { targetName: t.context.target.name } : {},
    ...t.context.origin?.kind === "weapon" ? {
      weaponName: t.context.origin.name,
      weaponCategory: e(`MAGNUSARCHIVES.Combat.Weapon.Category.${t.context.origin.category}`)
    } : {},
    ...t.context.origin?.kind === "defense" ? {
      defenseType: e(`MAGNUSARCHIVES.Combat.Defense.${t.context.origin.defenseType}`)
    } : {},
    ...t.context.origin?.kind === "ability" ? {
      abilityName: t.context.origin.name,
      abilityActivation: e(`MAGNUSARCHIVES.Ability.Activation.${t.context.origin.activation}`)
    } : {}
  };
}
function tp(n, e) {
  return n ? { outcome: e("MAGNUSARCHIVES.Roll.Success"), outcomeIcon: "✓", outcomeClass: "success" } : { outcome: e("MAGNUSARCHIVES.Roll.Failure"), outcomeIcon: "✕", outcomeClass: "failure" };
}
function jn(n, e, t = !0) {
  return n.automaticSuccess && t ? { outcome: e("MAGNUSARCHIVES.Roll.AutomaticSuccess"), outcomeIcon: "✓", outcomeClass: "success" } : tp(n.success === !0, e);
}
function ip(n, e, t = (i) => i) {
  const i = br(n, t), a = n.beatsDifficulty === null ? {} : {
    beatsDifficulty: n.beatsDifficulty,
    showBeatsDifficulty: !0
  }, s = ep(n, t), o = n.prepared.context.difficulty;
  if (o.mode === "unknown")
    return {
      ...i,
      ...a,
      presentation: "unknown",
      resolutionDetails: s,
      hasDetails: s.length > 0 || i.modifierDetails.length > 0 || i.modifierTotalDetails.length > 0 || i.effortDetails.length > 0 || i.costDetails.length > 0
    };
  if (o.mode === "known") {
    const r = [{
      label: t("MAGNUSARCHIVES.Roll.Difficulty"),
      value: n.prepared.finalDifficulty ?? 0
    }, {
      label: t("MAGNUSARCHIVES.Roll.TargetNumber"),
      value: n.prepared.targetNumber ?? 0
    }, ...s];
    return {
      ...i,
      ...a,
      presentation: "known",
      ...jn(n, t),
      finalDifficulty: n.prepared.finalDifficulty ?? 0,
      targetNumber: n.prepared.targetNumber ?? 0,
      showKnownDifficulty: !0,
      resolutionDetails: r,
      hasDetails: !0
    };
  }
  return {
    ...i,
    ...a,
    presentation: "concealed",
    ...jn(n, t, !1),
    resolutionDetails: s,
    hasDetails: s.length > 0 || i.modifierDetails.length > 0 || i.modifierTotalDetails.length > 0 || i.effortDetails.length > 0 || i.costDetails.length > 0
  };
}
function np(n, e = (t) => t) {
  return n?.damage === void 0 ? { showFinalDamage: !1, damageDetails: [], damageTotalDetails: [] } : {
    showFinalDamage: !0,
    finalDamage: n.damage,
    damageDetails: [
      ...(n.damageBreakdown ?? []).map((t) => ({
        label: e(t.label),
        value: t.additive && t.value > 0 ? `+${t.value}` : t.value
      }))
    ],
    damageTotalDetails: [{ label: e("MAGNUSARCHIVES.Combat.FinalDamage"), value: n.damage }]
  };
}
function ap(n, e = (t) => t) {
  const t = n.prepared.context.difficulty;
  if (t.mode !== "hidden") throw new Error("Only hidden-difficulty rolls require an audit card.");
  return {
    ...br(n, e),
    originalDifficulty: t.value,
    finalDifficulty: n.prepared.finalDifficulty ?? 0,
    targetNumber: n.prepared.targetNumber ?? 0,
    ...jn(n, e)
  };
}
class sp {
  async publish(e, t, i, a = {}) {
    const s = (h) => game.i18n.localize(h), o = ip(t.result, i, s), r = np(a.combat, s), l = {
      ...o,
      ...r,
      hasDetails: o.hasDetails || r.damageDetails.length > 0 || r.damageTotalDetails.length > 0,
      ...Ue(e),
      ...a.combat?.damageEffect === void 0 ? {} : {
        combatDamageEffect: s(`MAGNUSARCHIVES.CharacterDamage.${a.combat.damageEffect}`),
        ...a.combat.damageEffect === "stress" ? { combatStressAmount: a.combat.stressAmount ?? 0 } : {}
      },
      ...a.combat?.shieldTransfer === void 0 ? {} : {
        shieldTransfer: !0,
        shieldName: a.combat.shieldTransfer.shieldName,
        shieldSeverity: s(`MAGNUSARCHIVES.Wounds.Severity.${a.combat.shieldTransfer.severity}`)
      },
      ...a.combat?.action ? {
        combatAction: !0,
        combatActionLabel: s(
          a.combat.action.kind === "npcDamage" ? "MAGNUSARCHIVES.Combat.ApplyDamage" : a.combat.action.kind === "shieldWound" ? "MAGNUSARCHIVES.Combat.ApplyWoundToShield" : "MAGNUSARCHIVES.Combat.ApplyWound"
        )
      } : {}
    }, u = await foundry.applications.handlebars.renderTemplate(
      "systems/magnusarchives/templates/chat/roll-card.hbs",
      l
    ), d = {
      speaker: ChatMessage.getSpeaker({ actor: e }),
      content: u
    };
    if (a.combat?.action && (d.flags = { magnusarchives: { combatAction: a.combat.action } }), t.chatRoll !== void 0 && (d.rolls = [t.chatRoll]), await ChatMessage.create(d), t.result.prepared.context.difficulty.mode !== "hidden") return;
    const p = ap(t.result, s);
    if (Hooks.callAll("magnusarchivesHiddenRollAudit", p, e, t), a.showGmAudit !== !0) return;
    const y = await foundry.applications.handlebars.renderTemplate(
      "systems/magnusarchives/templates/chat/roll-audit-card.hbs",
      {
        ...p,
        ...r,
        ...Ue(e)
      }
    ), m = {
      speaker: ChatMessage.getSpeaker({ actor: e }),
      content: y,
      whisper: ChatMessage.getWhisperRecipients("GM").map((h) => h.id),
      blind: !0
    };
    await ChatMessage.create(m);
  }
}
const op = async () => {
  const n = await new Roll("1d20").evaluate();
  if (n.total === null) throw new Error("The d20 roll did not produce a total.");
  return { naturalRoll: n.total, chatRoll: n };
}, rp = (n) => n.system.derived.packages?.totalEffortCapMode === "unlimited" ? "unlimited" : "core", lp = () => $n();
function Us(n, e) {
  if (!Number.isInteger(n) || n < 0)
    throw new Error(`${e} must be a non-negative integer.`);
  return n;
}
function wn(n, e, t, i) {
  if (!Number.isInteger(t)) throw new Error(`${e} steps must be an integer.`);
  return t === 0 ? null : {
    id: n,
    label: e,
    direction: t > 0 ? "ease" : "hinder",
    steps: Math.abs(t),
    source: i
  };
}
class cp {
  #e;
  #t;
  #i;
  #n;
  constructor(e, t = op, i = rp, a = lp) {
    this.#e = e, this.#t = t, this.#i = i, this.#n = a;
  }
  preview(e, t, i) {
    j(e), Us(t.otherEase, "Other Ease"), Us(t.otherHindrance, "Other Hindrance");
    const a = [], s = wn(
      "manual.skill",
      "MAGNUSARCHIVES.Roll.Breakdown.Skill",
      t.skillSteps,
      "skill"
    );
    s && a.push(s);
    const o = wn(
      "manual.other-ease",
      "MAGNUSARCHIVES.Roll.Breakdown.OtherEase",
      t.otherEase,
      "other"
    );
    o && a.push(o);
    const r = wn(
      "manual.other-hindrance",
      "MAGNUSARCHIVES.Roll.Breakdown.OtherHindrance",
      -t.otherHindrance,
      "other"
    );
    r && a.push(r);
    const l = e.system.derived.totalHindrance;
    l > 0 && a.push({
      id: "core.conditions.hindrance",
      label: "MAGNUSARCHIVES.Roll.Breakdown.Conditions",
      direction: "hinder",
      steps: l,
      source: "condition",
      sourceId: "system.derived.totalHindrance"
    });
    const u = t.tags ?? [], d = e.system.derived.combat?.armor, p = u.includes("defense.dodge") || t.origin?.kind === "defense" && t.origin.defenseType === "dodge";
    if (t.pool === "speed" && !p)
      for (const A of d?.speedTaskContributions ?? [])
        a.push({
          id: A.id,
          label: `MAGNUSARCHIVES.Combat.Armor.Unfamiliar.${d?.category ?? "light"}`,
          direction: "hinder",
          steps: A.value,
          source: "other",
          sourceId: A.sourceId
        });
    if (a.push(...t.contributions ?? []), t.pool === null && (t.paidEffort > 0 || (t.damageEffort ?? 0) > 0 || (t.actionCost ?? 0) > 0))
      throw new Error("A Pool-less roll cannot pay Effort or an action cost.");
    const y = i.enabledRuleModuleIds ?? [], m = this.#e.resolveDifficultyPolicy(i.base, y), h = {
      actor: { id: e.id, name: e.name },
      label: t.label ?? "MAGNUSARCHIVES.Roll.TestRoll",
      pool: t.pool,
      difficulty: t.difficulty,
      assets: t.assets,
      paidEffort: t.paidEffort,
      damageEffort: t.damageEffort ?? 0,
      freeDamageEffort: t.freeDamageEffort ?? 0,
      freeEffort: t.freeEffort,
      edge: t.pool === null ? 0 : e.system.derived.pools[t.pool].edge,
      effortSurcharge: e.system.derived.damageTrack.effortSurcharge,
      poolValue: t.pool === null ? 0 : e.system.stats[t.pool].value,
      actionCost: t.actionCost ?? 0,
      actionCostIgnoresEdge: t.actionCostIgnoresEdge ?? !1,
      limits: {
        ...m,
        paidEffortMaximum: e.system.derived.effort.max,
        totalEffortMaximum: vl(this.#i(e))
      },
      contributions: a,
      horrorIntrusionRange: $t(this.#n()),
      tags: u,
      ...t.target ? { target: t.target } : {},
      ...t.purpose ? { purpose: t.purpose } : {},
      ...t.origin ? { origin: t.origin } : {}
    }, f = this.#e.enrichRollContext(h, y);
    return Hm(f);
  }
  async execute(e, t, i) {
    const [a] = await this.executeBatch(e, [t], i);
    if (!a) throw new Error("Roll execution did not produce a result.");
    return a;
  }
  async executeBatch(e, t, i) {
    if (t.length === 0) return [];
    const a = t.map((m) => this.preview(e, m, i)), s = a[0];
    if (a.some((m) => m.context.pool !== s.context.pool || m.poolCost !== s.poolCost))
      throw new Error("Batch rolls must use one Pool and one shared action cost.");
    const o = s.context.pool, r = o === null ? 0 : e.system.stats[o].value;
    if (r < s.poolCost)
      throw new Error(
        `${o ?? "No Pool"} has ${r} points but this action costs ${s.poolCost}.`
      );
    s.poolCost > 0 && o !== null && await e.update({ [`system.stats.${o}.value`]: r - s.poolCost });
    const u = a.some((m) => m.finalDifficulty !== 0) ? await this.#t() : null, d = a.map((m) => {
      const h = m.finalDifficulty === 0 ? Sr(m) : $m(m, u.naturalRoll), f = this.#e.resolveNaturalEffects(
        h,
        i.enabledRuleModuleIds ?? []
      );
      return { ...h, naturalEffects: f };
    }), p = d.some((m) => m.naturalEffects.some(
      (h) => h.status === "applied" && h.refundsPoolCost === !0
    )) ? s.poolCost : 0;
    p > 0 && o !== null && await e.update({ [`system.stats.${o}.value`]: r });
    let y = !1;
    return d.map((m) => {
      const h = {
        ...m,
        poolCostPaid: s.poolCost - p,
        poolCostRefunded: p
      };
      return u?.chatRoll === void 0 || m.automaticSuccess || y ? { result: h } : (y = !0, { result: h, chatRoll: u.chatRoll });
    });
  }
}
function dp(n) {
  return k.includes(n);
}
class up {
  #e;
  constructor(e) {
    this.#e = e;
  }
  configuredPool(e) {
    if (!Os.includes(e.system.defaultPool))
      throw new Error(`Unknown Skill default Pool '${e.system.defaultPool}'.`);
    return dp(e.system.defaultPool) ? e.system.defaultPool : null;
  }
  rankContribution(e, t = []) {
    if (e.type !== "skill") throw new Error("Skill contributions require a Skill Item.");
    if (!ie.includes(e.system.rank)) throw new Error(`Unknown Skill rank '${e.system.rank}'.`);
    return this.#e.resolveSkillRankContribution(
      e.system.rank,
      { id: e.id, name: e.name },
      t
    );
  }
  buildRollRequest(e, t) {
    if (e.type !== "skill") throw new Error("Skill rolls require a Skill Item.");
    if (!ie.includes(e.system.rank)) throw new Error(`Unknown Skill rank '${e.system.rank}'.`);
    const i = t.pool ?? this.configuredPool(e);
    if (!i) throw new Error("Choose a Pool for this Skill roll.");
    const a = t.rankOverride ? { ...e, system: { ...e.system, rank: t.rankOverride } } : e;
    if (!ie.includes(a.system.rank))
      throw new Error(`Unknown Skill rank '${a.system.rank}'.`);
    const s = this.rankContribution(a, t.enabledRuleModuleIds ?? []);
    return {
      label: e.name,
      pool: i,
      difficulty: t.difficulty,
      skillSteps: 0,
      assets: t.assets ?? 0,
      paidEffort: t.paidEffort ?? 0,
      freeEffort: t.freeEffort ?? 0,
      otherEase: t.otherEase ?? 0,
      otherHindrance: t.otherHindrance ?? 0,
      contributions: [
        ...s ? [s] : [],
        ...t.contributions ?? []
      ],
      purpose: "task",
      origin: {
        kind: "skill",
        itemId: e.id,
        name: e.name,
        rank: a.system.rank
      }
    };
  }
  buildQuickRollRequest(e, t = {}) {
    if (e.type !== "skill") throw new Error("Skill rolls require a Skill Item.");
    if (!ie.includes(e.system.rank)) throw new Error(`Unknown Skill rank '${e.system.rank}'.`);
    const i = this.rankContribution(e, t.enabledRuleModuleIds ?? []);
    return {
      label: e.name,
      pool: this.configuredPool(e),
      difficulty: t.difficulty ?? { mode: "unknown" },
      skillSteps: 0,
      assets: 0,
      paidEffort: 0,
      freeEffort: 0,
      otherEase: 0,
      otherHindrance: 0,
      contributions: [
        ...i ? [i] : [],
        ...t.contributions ?? []
      ],
      purpose: "task",
      origin: {
        kind: "skill",
        itemId: e.id,
        name: e.name,
        rank: e.system.rank
      }
    };
  }
}
const mp = Object.freeze({
  targetedXpToTarget: 0,
  targetedXpToShare: 0,
  groupXpPerTarget: 0,
  freeXp: 0
});
function pp(n) {
  return {
    actorId: n.id,
    actorName: n.name,
    ...n.img ? { actorImage: n.img } : {}
  };
}
class fp {
  #e;
  #t;
  constructor(e, t = _e) {
    this.#e = e, this.#t = t;
  }
  policy(e = []) {
    return this.#e.resolveGMIntrusionPolicy(mp, e);
  }
  async createTargeted(e, t = []) {
    j(e);
    const i = this.policy(t);
    return await this.#i(e, i.targetedXpToTarget), this.#n(
      "targeted",
      [e],
      i.targetedXpToTarget,
      i.targetedXpToShare
    );
  }
  async createGroup(e, t = []) {
    const i = [...new Map(e.map((s) => [s.id, s])).values()];
    if (i.length === 0) throw new Error("Choose at least one Character for a Group Intrusion.");
    i.forEach(j);
    const a = this.policy(t);
    return await Promise.all(i.map((s) => this.#i(s, a.groupXpPerTarget))), this.#n(
      "group",
      i,
      a.groupXpPerTarget,
      0
    );
  }
  async createFreeFromNaturalResult(e, t, i = []) {
    return !t.naturalEffects.some(
      (s) => s.status === "applied" && s.triggersGMIntrusion === !0
    ) || t.naturalRoll === null ? null : this.createFree(e, t.naturalRoll, i);
  }
  async createFree(e, t = 0, i = []) {
    j(e);
    const a = this.policy(i);
    return await this.#i(e, a.freeXp), this.#n(
      "free",
      [e],
      a.freeXp,
      0,
      t
    );
  }
  async distributeSecondXp(e, t, i) {
    if (j(e), j(t), t.id === e.id)
      throw new Error("The targeted Character cannot receive their own shared XP.");
    await this.#i(t, i);
  }
  async #i(e, t) {
    if (!Number.isInteger(t) || t < 0) throw new Error("GM Intrusion XP must be non-negative.");
    t > 0 && await e.update({ "system.xp": e.system.xp + t });
  }
  #n(e, t, i, a, s = 0) {
    return {
      id: this.#t(),
      mode: e,
      targets: t.map(pp),
      targetXp: i,
      sharedXp: a,
      naturalRoll: s
    };
  }
}
function Ut(n) {
  const e = n.tokenId ?? n.token?.id, t = n.tokenUuid ?? n.token?.uuid;
  return {
    actorId: n.id,
    ...n.actorUuid ?? n.uuid ? { actorUuid: n.actorUuid ?? n.uuid } : {},
    ...e ? { tokenId: e } : {},
    ...t ? { tokenUuid: t } : {}
  };
}
function Ui(n, e, t) {
  if (!Number.isInteger(n) || t !== void 0 && n < t)
    throw new Error(`${e} must be an integer${t === void 0 ? "" : ` of at least ${t}`}.`);
  return n;
}
function gp(n, e) {
  return n.contexts.every((t) => e.tags.includes(t));
}
function hp(n, e) {
  for (const [t, i] of Object.entries(n)) {
    if (t === "tagsAll") {
      if (!Array.isArray(i) || !i.every((s) => typeof s == "string" && e.tags.includes(s))) return !1;
      continue;
    }
    if (t === "tagsAny") {
      if (!Array.isArray(i) || !i.some((s) => typeof s == "string" && e.tags.includes(s))) return !1;
      continue;
    }
    const a = t === "pool" ? e.pool : t === "attackType" ? e.attackType : t === "weaponCategory" ? e.weaponCategory : t === "defenseType" ? e.defenseType : void 0;
    if (a === void 0) return !1;
    if (Array.isArray(i)) {
      if (!i.includes(a)) return !1;
    } else if (i !== a) return !1;
  }
  return !0;
}
function ks(n) {
  return n.contexts.length + Object.keys(n.predicate).length;
}
function yp(n) {
  return Ui(n.value, `NPC modification '${n.id}'`, 0), {
    id: `npc-modification.${n.id}`,
    label: "MAGNUSARCHIVES.Combat.TargetModification",
    direction: n.mode === "ease" ? "ease" : "hinder",
    steps: n.value,
    source: "other",
    sourceId: n.id
  };
}
class Sp {
  #e;
  constructor(e) {
    this.#e = e;
  }
  resolve(e, t, i = []) {
    if (e.type !== "npc") throw new Error("Combat targets must be NPC Actors.");
    const a = Ui(e.system.level, "NPC Level", 0), s = e.system.modifications.map((d, p) => ({ modification: d, index: p })).filter(({ modification: d }) => gp(d, t) && hp(d.predicate, t)), o = s.filter(({ modification: d }) => d.mode === "levelOverride").sort((d, p) => ks(p.modification) - ks(d.modification) || p.index - d.index)[0]?.modification;
    let r = o ? Ui(o.value, `NPC modification '${o.id}'`, 0) : a;
    const l = o ? [o.id] : [];
    for (const { modification: d } of s)
      d.mode === "levelDelta" && (r += Ui(d.value, `NPC modification '${d.id}'`), l.push(d.id));
    r = Math.max(0, r);
    const u = s.map(({ modification: d }) => d).filter((d) => d.mode === "ease" || d.mode === "hinder").map((d) => (l.push(d.id), yp(d)));
    return this.#e.enrichTargetResolution({
      targetId: e.id,
      targetIdentity: Ut(e),
      targetName: e.name,
      baseLevel: a,
      difficulty: r,
      contributions: u,
      appliedModificationIds: l
    }, e, t, i);
  }
  nativeNpcTargets() {
    return [...game.user.targets ?? []].map((e) => Do(e)).filter((e) => e !== null);
  }
}
class Ap {
  async npcDamage() {
  }
  async characterWound() {
  }
}
async function bp(n) {
  if (n.tokenId) {
    const e = canvas.tokens?.get(n.tokenId);
    if (e?.center) return { center: e.center };
  }
  if (n.tokenUuid)
    try {
      const e = await fromUuid(n.tokenUuid);
      if (e?.object?.center)
        return { center: e.object.center };
    } catch {
    }
  return null;
}
class wp {
  async #e(e, t, i) {
    const a = await bp(e);
    a && await canvas.interface.createScrollingText(a.center, t, {
      anchor: CONST.TEXT_ANCHOR_POINTS.CENTER,
      direction: CONST.TEXT_ANCHOR_POINTS.TOP,
      duration: 1200,
      distance: 48,
      jitter: 0.15,
      textStyle: { fill: i, fontSize: 32, stroke: 0, strokeThickness: 4 }
    });
  }
  async npcDamage(e, t) {
    t.appliedDamage > 0 && await this.#e(e, `-${t.appliedDamage}`, "#ff5c5c"), t.previousHealth > 0 && t.health === 0 && await this.#e(e, game.i18n.localize("MAGNUSARCHIVES.Combat.Feedback.Dead"), "#ff3030");
  }
  async characterWound(e, t) {
    await this.#e(e, game.i18n.format("MAGNUSARCHIVES.Combat.Feedback.Wound", {
      severity: game.i18n.localize(`MAGNUSARCHIVES.Wounds.Severity.${t}`)
    }), "#ffb347");
  }
  async characterStress(e, t, i) {
    t <= 0 || await this.#e(e, game.i18n.format("MAGNUSARCHIVES.Combat.Feedback.Stress", {
      points: t,
      level: i
    }), "#d6b24a");
  }
  async characterSeriousInjury(e, t) {
    await this.#e(e, game.i18n.format("MAGNUSARCHIVES.Combat.Feedback.SeriousInjury", {
      step: game.i18n.localize(`MAGNUSARCHIVES.DamageTrack.${t}`)
    }), t === "dead" ? "#ff3030" : "#ff5c5c");
  }
  async shieldWound(e, t, i, a) {
    const s = a ? game.i18n.format("MAGNUSARCHIVES.Shield.Feedback.Broken", { shield: t }) : game.i18n.format("MAGNUSARCHIVES.Shield.Feedback.Wound", {
      shield: t,
      severity: game.i18n.localize(`MAGNUSARCHIVES.Wounds.Severity.${i}`)
    });
    await this.#e(e, s, a ? "#ff5c5c" : "#7dcfff");
  }
}
class vp {
  async syncNpcDead() {
  }
}
class Cp {
  async syncNpcDead(e, t) {
    const i = Vi(e);
    let a = null;
    if (i.tokenUuid)
      try {
        a = (await fromUuid(i.tokenUuid))?.actor ?? null;
      } catch {
        a = null;
      }
    !a && i.tokenId && (a = canvas.tokens?.get(i.tokenId)?.actor ?? null), !(!a && (i.tokenId || i.tokenUuid)) && (a || (a = e), typeof a.toggleStatusEffect == "function" && await a.toggleStatusEffect(CONFIG.specialStatusEffects.DEFEATED ?? "dead", {
      active: t
    }));
  }
}
function Ep(n) {
  if ("system.health.value" in n) return !0;
  const e = n.system;
  if (!e || typeof e != "object") return !1;
  const t = e.health;
  return !!(t && typeof t == "object" && "value" in t);
}
function Ip(n) {
  Hooks.on("updateActor", (e, t, i = {}) => {
    if (i.magnusarchivesSkipDeadStatusSync === !0 || e.type !== "npc" || !Ep(t)) return;
    const a = Number(e.system.health?.value);
    Number.isFinite(a) && n.syncNpcDead(e, a <= 0);
  });
}
function vn(n, e) {
  if (!Number.isInteger(n) || n < 0) throw new Error(`${e} must be a non-negative whole number.`);
  return n;
}
class wr {
  ammunition(e) {
    const t = e.system.ammo.enabled, i = vn(e.system.ammo.value, "Current ammunition"), a = vn(e.system.ammo.max, "Maximum ammunition"), s = vn(e.system.ammo.perAttack, "Ammunition per attack");
    return { tracked: t, current: i, maximum: a, perAttack: s, canAttack: !t || i >= s };
  }
  assertCanAttack(e) {
    if (!this.ammunition(e).canAttack) throw new Error("Insufficient Ammunition — Reload Weapon");
  }
  async consumeAttack(e) {
    const t = this.ammunition(e);
    if (!t.tracked) return null;
    if (this.assertCanAttack(e), !e.update) throw new Error("Weapon ammunition requires an updateable Item document.");
    const i = Math.max(0, t.current - t.perAttack);
    return await e.update({ "system.ammo.value": i }, { magnusarchivesWeaponUse: !0 }), { previous: t.current, current: i, spent: t.current - i };
  }
  async reload(e) {
    const t = this.ammunition(e);
    if (!t.tracked) throw new Error("Ammunition tracking is not enabled for this Weapon.");
    if (!e.update) throw new Error("Weapon ammunition requires an updateable Item document.");
    await e.update({ "system.ammo.value": t.maximum }, { magnusarchivesWeaponReload: !0 });
  }
}
const Rp = Object.freeze({
  weaponDamage: Object.freeze({ light: 2, medium: 4, heavy: 6 }),
  lightWeaponEase: 1,
  unfamiliarWeaponHindrance: 1,
  armorDefenseSteps: Object.freeze({ light: 1, medium: 2, heavy: 3 }),
  blockSeverityReduction: 1,
  damageEffortBonus: 3
});
function Cn(n, e) {
  if (!Number.isInteger(n) || n < 0) throw new Error(`${e} must be a non-negative integer.`);
  return n;
}
function Hs(n, e, t) {
  return {
    id: n.id,
    label: t,
    direction: e,
    steps: n.value,
    source: "other",
    sourceId: n.sourceId
  };
}
function Xt(n) {
  return n.naturalEffects.filter((e) => e.kind === "damage-bonus" && e.status === "applied").reduce((e, t) => e + (t.damageBonus ?? 0), 0);
}
function vr(n, e) {
  return n.naturalEffects.filter((i) => i.status === "available").length === 0 ? n : {
    ...n,
    naturalEffects: n.naturalEffects.map((i) => {
      if (i.status !== "available") return i;
      const a = e === "damage" && i.kind === "damage-bonus", s = e === "effect" && (i.kind === "minor-effect" || i.kind === "major-effect");
      return { ...i, status: a || s ? "applied" : "inapplicable" };
    })
  };
}
class Np {
  #e;
  #t;
  #i;
  #n;
  #a;
  #l;
  #r;
  #s;
  #c;
  #o;
  constructor(e, t, i, a, s, o = new Ar(), r = new Ap(), l = new vp(), u = new fr(s), d = new wr()) {
    this.#e = e, this.#t = t, this.#i = i, this.#n = a, this.#a = s, this.#l = o, this.#r = r, this.#s = l, this.#c = u, this.#o = d;
  }
  policy(e = []) {
    return this.#e.resolveCombatPolicy(Rp, e);
  }
  weaponBaseDamage(e, t = this.policy()) {
    if (e.type !== "weapon") throw new Error("Weapon attacks require a Weapon Item.");
    if (!Number.isInteger(e.system.bonusDamage) || e.system.bonusDamage < 0)
      throw new Error("Weapon bonus damage must be a non-negative integer.");
    return Math.max(0, t.weaponDamage[e.system.category] + e.system.bonusDamage);
  }
  weaponAttackPool(e, t) {
    if (t) return t;
    const i = e.system.defaultPool;
    return i && i !== "none" && k.includes(i) ? i : e.system.attackType === "melee" ? "might" : "speed";
  }
  weaponFreelyUsed(e, t) {
    const i = e.system.derived.packages?.weaponCategories ?? e.system.proficiencies.weaponCategories, a = e.system.derived.packages?.weaponFamilies ?? [], s = ct(t.system.family);
    return i.includes(t.system.category) || s !== "" && a.some((o) => ct(o) === s);
  }
  armorFreelyUsed(e, t) {
    return (e.system.derived.packages?.armorCategories ?? e.system.proficiencies.armorCategories).includes(t.system.category);
  }
  weaponFamiliarityContribution(e, t, i = []) {
    const a = this.policy(i);
    return this.weaponFreelyUsed(e, t) || a.unfamiliarWeaponHindrance <= 0 ? null : {
      id: `weapon.${t.id}.unfamiliar`,
      label: `MAGNUSARCHIVES.Combat.Weapon.Unfamiliar.${t.system.category}`,
      direction: "hinder",
      steps: a.unfamiliarWeaponHindrance,
      source: "other",
      sourceId: t.id
    };
  }
  applicableWeaponSkills(e, t, i = []) {
    return this.#u(e, [
      "attack",
      "attack.weapon",
      `attack.${t.system.attackType}`,
      `weapon.${t.system.category}`
    ], i);
  }
  applicableDefenseSkills(e, t, i = []) {
    return this.#u(e, [
      "defense",
      ...t === "blockWithShield" ? ["defense.block"] : [],
      `defense.${t}`
    ], i);
  }
  buildWeaponAttackPlan(e, t, i = {}) {
    if (t.type !== "weapon") throw new Error("Weapon attacks require a Weapon Item.");
    const a = i.enabledRuleModuleIds ?? [], s = this.policy(a), o = this.weaponFreelyUsed(e, t), r = this.weaponAttackPool(t, i.pool), l = {
      tags: [
        "attack",
        "attack.weapon",
        `attack.${t.system.attackType}`,
        `weapon.${t.system.category}`,
        "defense.speed"
      ],
      pool: r,
      attackType: t.system.attackType,
      weaponCategory: t.system.category
    }, u = i.targets ?? [], d = u.map((R) => this.#n.resolve(R, l, a)), p = u.length > 0 ? u : [null], y = d.length > 0 ? d : [null], m = [];
    t.system.category === "light" && s.lightWeaponEase > 0 && m.push({
      id: `weapon.${t.id}.light`,
      label: "MAGNUSARCHIVES.Combat.Weapon.LightEase",
      direction: "ease",
      steps: s.lightWeaponEase,
      source: "other",
      sourceId: t.id
    });
    const h = this.weaponFamiliarityContribution(e, t, a);
    if (h && m.push(h), i.extremeRange && m.push({
      id: `weapon.${t.id}.extreme-range`,
      label: "MAGNUSARCHIVES.Combat.Weapon.ExtremeRange",
      direction: "hinder",
      steps: 1,
      source: "other",
      sourceId: t.id
    }), !Number.isInteger(t.system.attackModifier) || t.system.attackModifier < -2 || t.system.attackModifier > 2)
      throw new Error("Weapon attack modifier must be an integer from -2 to +2.");
    t.system.attackModifier !== 0 && m.push({
      id: `weapon.${t.id}.attack-modifier`,
      label: "MAGNUSARCHIVES.Combat.Weapon.AttackModifierContribution",
      direction: t.system.attackModifier > 0 ? "ease" : "hinder",
      steps: Math.abs(t.system.attackModifier),
      source: "other",
      sourceId: t.id
    });
    const f = i.skill ? this.#i.rankContribution(i.skill, a) : null;
    f && m.push(f);
    const A = s.weaponDamage[t.system.category], v = t.system.bonusDamage, E = this.weaponBaseDamage(t, s), H = y.map((R, G) => ({
      label: t.name,
      pool: r,
      difficulty: R ? { mode: "hidden", value: R.difficulty } : i.difficulty ?? { mode: "unknown" },
      skillSteps: i.skillSteps ?? 0,
      assets: i.assets ?? 0,
      paidEffort: i.paidEffort ?? 0,
      damageEffort: i.damageEffort ?? 0,
      freeDamageEffort: i.freeDamageEffort ?? 0,
      freeEffort: i.freeEffort ?? 0,
      otherEase: i.otherEase ?? 0,
      otherHindrance: i.otherHindrance ?? 0,
      contributions: [...new Map([
        ...m,
        ...R?.contributions ?? [],
        ...i.contributions ?? []
      ].map((P) => [P.id, P])).values()],
      purpose: "damage",
      tags: [
        ...l.tags,
        ...r === "speed" ? ["speed-task"] : [],
        ...i.extremeRange ? ["range.extreme"] : []
      ],
      origin: {
        kind: "weapon",
        itemId: t.id,
        name: t.name,
        category: t.system.category,
        attackType: t.system.attackType,
        baseDamage: E
      },
      ...p[G] ? {
        target: {
          ...Ut(p[G]),
          name: p[G].name,
          type: "npc"
        }
      } : {}
    }));
    return {
      weapon: t,
      categoryDamage: A,
      weaponBonusDamage: v,
      baseDamage: E,
      freelyUsed: o,
      requests: H,
      targets: p,
      targetResolutions: y,
      policy: s
    };
  }
  async executeWeaponAttack(e, t, i, a) {
    this.#o.assertCanAttack(t);
    const s = this.buildWeaponAttackPlan(e, t, i), o = await this.#t.executeBatch(e, s.requests, a), r = o.length > 0 ? await this.#d(t) : void 0;
    return o.map((l, u) => {
      const d = l.result.prepared.damageEffortApplied * s.policy.damageEffortBonus, p = Xt(l.result), y = s.baseDamage + d + p, m = s.targets[u] ?? null, h = m?.system.armorBase ?? 0;
      return {
        target: m,
        targetResolution: s.targetResolutions[u] ?? null,
        execution: l,
        grossDamage: y,
        categoryDamage: s.categoryDamage,
        weaponBonusDamage: s.weaponBonusDamage,
        effortDamage: d,
        naturalDamage: p,
        armor: h,
        netDamage: Math.max(0, y - h),
        ...u === 0 && r ? { weaponUse: r } : {}
      };
    });
  }
  async #d(e) {
    const t = await this.#o.consumeAttack(e);
    return t ? { ammo: t } : {};
  }
  chooseAttackOutcomes(e, t, i = []) {
    const a = this.policy(i);
    return e.map((s) => {
      const o = vr(s.execution.result, t), r = o.prepared.context.origin;
      if (r?.kind !== "weapon") return s;
      const l = r.baseDamage + o.prepared.damageEffortApplied * a.damageEffortBonus + Xt(o), u = o.prepared.damageEffortApplied * a.damageEffortBonus, d = Xt(o);
      return {
        ...s,
        execution: { ...s.execution, result: o },
        grossDamage: l,
        effortDamage: u,
        naturalDamage: d,
        netDamage: Math.max(0, l - s.armor)
      };
    });
  }
  buildDefenseRequest(e, t, i) {
    if (!Ls.includes(t)) throw new Error(`Unknown defense '${t}'.`);
    const a = i.enabledRuleModuleIds ?? [], s = t === "dodge" ? "speed" : "might", o = e.system.derived.combat.armor, r = t === "dodge" ? o.dodgeContributions.map((u) => Hs(u, "hinder", "MAGNUSARCHIVES.Combat.Armor.DodgeHindrance")) : o.blockContributions.map((u) => Hs(u, "ease", "MAGNUSARCHIVES.Combat.Armor.BlockEase")), l = i.skill ? this.#i.rankContribution(i.skill, a) : null;
    return {
      label: t === "dodge" ? "MAGNUSARCHIVES.Combat.Defense.DodgeRoll" : t === "blockWithShield" ? "MAGNUSARCHIVES.Combat.Defense.BlockWithShieldRoll" : "MAGNUSARCHIVES.Combat.Defense.BlockRoll",
      pool: s,
      difficulty: i.difficulty,
      skillSteps: i.skillSteps ?? 0,
      assets: i.assets ?? 0,
      paidEffort: i.paidEffort ?? 0,
      damageEffort: 0,
      freeEffort: i.freeEffort ?? 0,
      otherEase: i.otherEase ?? 0,
      otherHindrance: i.otherHindrance ?? 0,
      contributions: [
        ...r,
        ...l ? [l] : [],
        ...i.contributions ?? []
      ],
      purpose: "task",
      tags: [
        "defense",
        ...t === "blockWithShield" ? ["defense.block"] : [],
        `defense.${t}`,
        ...s === "speed" ? ["speed-task"] : []
      ],
      origin: {
        kind: "defense",
        defenseType: t,
        ...i.source ? { sourceActorId: i.source.id, sourceName: i.source.name } : {}
      }
    };
  }
  buildDefenseAgainstNpcRequest(e, t, i, a = {}) {
    const s = {
      tags: ["attack", "npc-attack", `requested-defense.${i}`],
      defenseType: i
    }, o = this.#n.resolve(t, s, a.enabledRuleModuleIds ?? []);
    return this.buildDefenseRequest(e, i, {
      ...a,
      difficulty: { mode: "hidden", value: o.difficulty },
      source: { id: t.id, name: t.name },
      contributions: [...o.contributions, ...a.contributions ?? []]
    });
  }
  /** A successful defense avoids the attack entirely; a failed one takes it in full. */
  damageAfterDefense(e, t) {
    return e.success === !0 ? "none" : t;
  }
  async resolveDefenseDamage(e, t, i, a, s, o, r = []) {
    if (i !== "blockWithShield" || t.success !== !0) {
      const u = this.damageAfterDefense(t, a);
      return u === "none" ? { recipient: "none" } : { recipient: "character", effect: u, stressAmount: s };
    }
    const l = await this.#c.normalizeEquipped(e);
    if (!l || this.#c.isBroken(l))
      throw new Error("Block With Shield requires one equipped, functional Shield.");
    return {
      recipient: "shield",
      severity: a === "seriousInjury" ? "major" : "minor",
      shieldId: l.id,
      shieldName: l.name
    };
  }
  async transferWoundToShield(e, t, i, a) {
    const s = await this.#c.applyResolved(e, t, i, {
      ...a ? { label: `${a.name} attack` } : {},
      sourceUuid: a ? `Actor.${a.id}` : "magnusarchives.combat"
    });
    return s.appliedSeverity && await this.#r.shieldWound?.(
      e,
      t.name,
      s.appliedSeverity,
      s.broken
    ), s;
  }
  /** Commit a previously resolved Shield consequence from an authorized Chat action. */
  async applyShieldWound(e, t, i, a) {
    return this.transferWoundToShield(e, t, i, a);
  }
  async applyNpcDamage(e, t) {
    if (e.type !== "npc") throw new Error("NPC damage requires an NPC target.");
    const i = Cn(t, "Damage"), a = Cn(e.system.armorBase, "NPC Armor"), s = Cn(e.system.health.value, "NPC Health"), o = Math.max(0, i - a), r = Math.max(0, s - o);
    await e.update(
      { "system.health.value": r },
      { magnusarchivesSkipDeadStatusSync: !0 }
    );
    const l = {
      requestedDamage: i,
      armor: a,
      appliedDamage: o,
      previousHealth: s,
      health: r,
      dead: r === 0
    };
    return await this.#s.syncNpcDead(e, l.dead), await this.#r.npcDamage(e, l), l;
  }
  /**
   * Applies an attack to a PC: Stress points, or a serious injury that moves
   * them one step down the damage track (p12).
   */
  async applyCharacterDamage(e, t, i = 0) {
    if (t === "stress") {
      const s = await this.#l.applyStress(e, Math.max(0, i));
      return await this.#r.characterStress?.(e, s.value - s.previousValue, s.level), { effect: t, stress: s, injury: null };
    }
    const a = await this.#l.applySeriousInjury(e);
    return await this.#r.characterSeriousInjury?.(e, a.step), { effect: t, stress: null, injury: a };
  }
  #u(e, t, i) {
    return [...e.items].filter((a) => {
      if (!a || typeof a != "object") return !1;
      const s = a;
      if (s.type !== "skill" || !s.system) return !1;
      const o = s.system.contexts ?? [], r = s.system.category ?? "";
      return o.some((l) => t.includes(l)) || t.includes(r);
    }).sort((a, s) => {
      const o = this.#i.rankContribution(a, i), r = this.#i.rankContribution(s, i), l = (u) => u ? u.steps * (u.direction === "ease" ? 1 : -1) : 0;
      return l(r) - l(o) || a.name.localeCompare(s.name);
    });
  }
}
function Ti(n) {
  return {
    targetActorId: n.actorId,
    ...n.actorUuid ? { targetActorUuid: n.actorUuid } : {},
    ...n.tokenId ? { targetTokenId: n.tokenId } : {},
    ...n.tokenUuid ? { targetTokenUuid: n.tokenUuid } : {}
  };
}
class Mp {
  #e;
  #t;
  constructor(e, t) {
    this.#e = e, this.#t = t;
  }
  async publishWeaponAttack(e, t, i, a = !1) {
    const s = t.execution.result.success === !0, r = {
      ...t.execution.result.success !== !1 ? {
        damage: t.grossDamage,
        damageBreakdown: [
          { label: "MAGNUSARCHIVES.Combat.DamageBreakdown.Category", value: t.categoryDamage },
          ...t.weaponBonusDamage === 0 ? [] : [{
            label: "MAGNUSARCHIVES.Combat.DamageBreakdown.WeaponBonus",
            value: t.weaponBonusDamage,
            additive: !0
          }],
          ...t.effortDamage === 0 ? [] : [{
            label: "MAGNUSARCHIVES.Combat.DamageBreakdown.Effort",
            value: t.effortDamage,
            additive: !0
          }],
          ...t.naturalDamage === 0 ? [] : [{
            label: "MAGNUSARCHIVES.Combat.DamageBreakdown.Natural",
            value: t.naturalDamage,
            additive: !0
          }]
        ]
      } : {},
      ...s && t.target ? {
        action: {
          kind: "npcDamage",
          ...Ti(Ut(t.target)),
          requestedDamage: t.grossDamage,
          applied: !1
        }
      } : {}
    };
    await this.#e.publish(e, t.execution, i, { combat: r, showGmAudit: a });
  }
  async publishDefense(e, t, i, a, s, o = !1) {
    const r = Ti(Vi(e)), l = a ? { sourceActorId: a.id, sourceName: a.name } : {}, u = {
      ...i.recipient === "character" ? {
        damageEffect: i.effect,
        stressAmount: i.stressAmount,
        action: {
          kind: "characterDamage",
          ...r,
          effect: i.effect,
          stressAmount: i.stressAmount,
          ...l,
          applied: !1
        }
      } : {},
      ...i.recipient === "shield" ? {
        shieldTransfer: {
          shieldName: i.shieldName,
          severity: i.severity
        },
        action: {
          kind: "shieldWound",
          ...r,
          shieldId: i.shieldId,
          shieldName: i.shieldName,
          severity: i.severity,
          ...l,
          applied: !1
        }
      } : {}
    };
    await this.#e.publish(e, t, s, { combat: u, showGmAudit: o });
  }
  async createDefenseRequest(e, t, i, a, s) {
    const o = Ut(e), r = Vi(t), l = [...s];
    if (this.#t && l.includes("block") && !l.includes("blockWithShield")) {
      const p = await this.#t.normalizeEquipped(t);
      p && !this.#t.isBroken(p) && l.push("blockWithShield");
    }
    const u = {
      kind: "defenseRequest",
      sourceActorId: e.id,
      ...o.actorUuid ? { sourceActorUuid: o.actorUuid } : {},
      ...o.tokenId ? { sourceTokenId: o.tokenId } : {},
      ...o.tokenUuid ? { sourceTokenUuid: o.tokenUuid } : {},
      sourceName: e.name,
      targetActorId: t.id,
      ...r.actorUuid ? { targetActorUuid: r.actorUuid } : {},
      ...r.tokenId ? { targetTokenId: r.tokenId } : {},
      ...r.tokenUuid ? { targetTokenUuid: r.tokenUuid } : {},
      targetName: t.name,
      effect: i,
      stressAmount: a,
      allowedDefenses: l,
      resolved: !1
    }, d = await foundry.applications.handlebars.renderTemplate(
      "systems/magnusarchives/templates/chat/defense-request-card.hbs",
      {
        sourceName: e.name,
        ...Ue(e),
        targetName: t.name,
        damageEffect: game.i18n.localize(`MAGNUSARCHIVES.CharacterDamage.${i}`),
        stressAmount: i === "stress" ? a : 0,
        allowBlock: l.includes("block"),
        allowBlockWithShield: l.includes("blockWithShield"),
        allowDodge: l.includes("dodge")
      }
    );
    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: e }),
      content: d,
      flags: { magnusarchives: { defenseRequest: u } }
    });
  }
}
const Gp = async (n) => {
  const e = await new Roll(n).evaluate();
  if (e.total === null) throw new Error("The depletion roll did not produce a total.");
  return { total: e.total, chatRoll: e };
};
class Up {
  #e;
  constructor(e = Gp) {
    this.#e = e;
  }
  async roll(e) {
    const t = e.system.depletion;
    if (!t.enabled) throw new Error("Depletion is not enabled for this Item.");
    const i = ["artifact", "weapon", "shield", "armor"].includes(e.type);
    if (i && e.system.depleted)
      throw new Error(`This ${e.name} is already depleted.`);
    const s = ["weapon", "shield", "armor"].includes(e.type) ? "" : t.formula?.trim() ?? "";
    if (Zt(t), !Number.isInteger(t.threshold) || t.threshold < 1)
      throw new Error("Depletion threshold must be a positive whole number.");
    const o = s || fd(t), r = Number(o.match(/^1d(\d+)$/i)?.[1]);
    if (r > 0 && t.threshold > r)
      throw new Error(`Depletion threshold must be between 1 and ${r}.`);
    const l = await this.#e(o), u = {
      itemId: e.id,
      itemName: e.name,
      formula: o,
      total: l.total,
      threshold: t.threshold,
      depleted: l.total <= t.threshold,
      ...l.chatRoll === void 0 ? {} : { chatRoll: l.chatRoll }
    };
    return u.depleted && i && e.update && await e.update({ "system.depleted": !0 }), u;
  }
}
class kp {
  async publish(e, t) {
    const i = await foundry.applications.handlebars.renderTemplate(
      "systems/magnusarchives/templates/chat/depletion-card.hbs",
      {
        itemName: t.itemName,
        ...Ue(e.actor),
        formula: t.formula,
        total: t.total,
        depleted: t.depleted,
        outcome: game.i18n.localize(
          t.depleted ? "MAGNUSARCHIVES.Depletion.Depleted" : "MAGNUSARCHIVES.Depletion.NotDepleted"
        )
      }
    ), a = {
      speaker: ChatMessage.getSpeaker(e.actor ? { actor: e.actor } : void 0),
      content: i
    };
    t.chatRoll !== void 0 && (a.rolls = [t.chatRoll]), await ChatMessage.create(a);
  }
}
const $s = 124, Hp = 58, Vs = 108, $p = 10, Vp = async (n) => {
  if (!n) return null;
  try {
    const e = await fromUuid(n);
    if (!e || typeof e != "object" || !("name" in e)) return null;
    const t = e, i = t._source?.system?.description;
    return {
      name: t.name,
      ...typeof i == "string" ? { description: i } : {},
      relativeTo: e,
      ...t.sheet ? { sheet: t.sheet } : {}
    };
  } catch {
    return null;
  }
}, Dp = async (n, e) => typeof foundry > "u" || !foundry.applications?.ux?.TextEditor?.implementation ? n : foundry.applications.ux.TextEditor.implementation.enrichHTML(n, e ? { async: !0, relativeTo: e } : { async: !0 });
function Fp(n) {
  const e = /* @__PURE__ */ new Map(), t = /* @__PURE__ */ new Map();
  for (const i of n) {
    const a = t.get(i.tier) ?? [];
    a.push(i), t.set(i.tier, a);
  }
  for (const i of t.values()) {
    const a = [...i].sort((s, o) => {
      const r = s.position?.x, l = o.position?.x;
      return r != null && l !== null && l !== void 0 ? r - l || s.id.localeCompare(o.id) : r != null ? -1 : l != null ? 1 : s.id.localeCompare(o.id);
    });
    a.forEach((s, o) => e.set(s.id, (o + 1) / (a.length + 1) * 100));
  }
  return e;
}
function Tp(n, e = 120) {
  const t = n.replace(/<[^>]*>/g, " ").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'").replace(/\s+/g, " ").trim();
  return t.length <= e ? t : `${t.slice(0, Math.max(0, e - 1)).trimEnd()}…`;
}
class zp {
  #e;
  #t;
  #i;
  constructor(e = new ha(), t = Vp, i = Dp) {
    this.#e = e, this.#t = t, this.#i = i;
  }
  async prepare(e, t = {}) {
    const i = t.characterTier ?? Number.MAX_SAFE_INTEGER, a = t.progress ?? { focusUuid: e.uuid, ownedNodeIds: [] }, s = t.missingOwnedNodeIds ?? /* @__PURE__ */ new Set();
    let o;
    try {
      o = this.#e.evaluateProgress(e.system.graph, i, a);
    } catch (m) {
      if (!(m instanceof Mt)) throw m;
      if (t.progress) {
        const h = new Set(a.ownedNodeIds);
        o = {
          characterTier: i,
          ownedNodeIds: [...h],
          diagnostics: m.diagnostics,
          nodes: e.system.graph.nodes.map((f) => ({
            node: f,
            state: h.has(f.id) ? "owned" : f.tier > i ? "future" : "available",
            reason: h.has(f.id) ? "owned" : f.tier > i ? "tier-too-low" : "tier-one-choice",
            requiredTier: f.tier,
            reachableFrom: []
          })).sort((f, A) => f.node.tier - A.node.tier || f.node.id.localeCompare(A.node.id))
        };
      } else
        return {
          focusUuid: e.uuid,
          focusName: e.name,
          markerId: `focus-arrow-${e.id.replace(/[^a-zA-Z0-9_-]/g, "-")}`,
          mode: t.editor ? "editor" : t.progress ? "progression" : "focus",
          editor: !!t.editor,
          width: 0,
          height: 0,
          nodes: [],
          connections: [],
          tiers: [],
          diagnostics: m.diagnostics,
          invalid: !0
        };
    }
    const r = Fp(o.nodes.map((m) => m.node)), l = t.editor ? 6 : Math.max(1, ...o.nodes.map((m) => m.node.tier)), u = /* @__PURE__ */ new Map();
    for (const m of o.nodes)
      u.set(m.node.tier, (u.get(m.node.tier) ?? 0) + 1);
    const d = Math.max(440, ...[...u.values()].map((m) => m * $s + (m + 1) * $p)), p = await Promise.all(o.nodes.map(async (m) => {
      const h = await this.#t(m.node.abilityUuid), f = m.state === "owned" && s.has(m.node.id), A = h?.description ?? m.node.abilitySnapshot.description ?? "", v = o.diagnostics.some((P) => P.code === "invalid-owned-progression" && P.nodeId === m.node.id || P.severity === "error" && (!P.nodeId || P.nodeId === m.node.id)), E = m.state !== "owned" && m.node.tier > i, H = m.state !== "owned" && m.reason === "no-owned-prerequisite", R = m.state !== "owned" && (m.state !== "available" || v), G = t.editable && t.progress && !t.gmProgressionEdit ? m.state === "owned" ? "undoFocusAcquisition" : "acquireFocusNode" : "openFocusNode";
      return {
        id: m.node.id,
        abilityUuid: m.node.abilityUuid,
        abilityName: h?.name || m.node.abilitySnapshot.name || m.node.id,
        descriptionExcerpt: Tp(A),
        descriptionHtml: await this.#i(A, h?.relativeTo ?? e),
        tier: m.node.tier,
        state: m.state,
        stateLabel: `MAGNUSARCHIVES.Focus.State.${m.state}`,
        reason: m.reason,
        requiredTier: m.requiredTier,
        reachableFrom: m.reachableFrom,
        missingAbility: !h,
        missingOwnedAbility: f,
        isOwned: m.state === "owned",
        advisoryUnavailable: R,
        tierLocked: E,
        prerequisiteLocked: H,
        invalidProgression: v,
        canAcquire: !!(t.editable && t.progress && !t.gmProgressionEdit && m.state !== "owned"),
        canRestoreAbility: !!(t.editable && t.progress && f),
        canUndoAcquisition: !!(t.editable && t.progress && m.state === "owned" && !t.gmProgressionEdit),
        canGmMarkOwned: !!(t.editable && t.progress && t.gmOverrideAllowed && t.gmProgressionEdit && m.state !== "owned"),
        canGmRemoveOwned: !!(t.editable && t.progress && t.gmOverrideAllowed && t.gmProgressionEdit && m.state === "owned"),
        primaryAction: t.editor?.connectionSourceNodeId ? "completeFocusConnection" : t.editor ? "selectFocusEditorNode" : G,
        selected: t.editor?.selectedNodeId === m.node.id,
        connectionSource: t.editor?.connectionSourceNodeId === m.node.id,
        xPercent: r.get(m.node.id) ?? 50,
        width: $s,
        height: Hp
      };
    })), y = e.system.graph.connections.map(({ id: m, from: h, to: f }) => ({ id: m, from: h, to: f }));
    return {
      focusUuid: e.uuid,
      focusName: e.name,
      markerId: `focus-arrow-${e.id.replace(/[^a-zA-Z0-9_-]/g, "-")}`,
      mode: t.editor ? "editor" : t.progress ? "progression" : "focus",
      editor: !!t.editor,
      width: d,
      height: l * Vs,
      nodes: p,
      connections: y,
      tiers: Array.from({ length: l }, (m, h) => {
        const f = h + 1;
        return {
          tier: f,
          top: h * Vs,
          nodes: p.filter((A) => A.tier === f).sort((A, v) => A.xPercent - v.xPercent || A.id.localeCompare(v.id))
        };
      }),
      diagnostics: o.diagnostics,
      invalid: !1
    };
  }
}
function st(n) {
  return structuredClone(n);
}
function Me(n) {
  return new Set(n).size === n.length;
}
function En(n, e) {
  return !n?.name || !n.system || typeof n.system != "object" ? null : { name: n.name, img: n.img, type: e, system: st(n.system) };
}
function Pp(n, e) {
  return !n?.name || !n.system || typeof n.system != "object" ? null : { name: n.name, ...n.img ? { img: n.img } : {}, type: e, system: st(n.system) };
}
function Ds(n, e, t, i, a) {
  return {
    kind: n,
    sourceUuid: e,
    instanceId: t,
    grantId: i,
    status: "active",
    contentUuid: a.contentUuid,
    contentKey: a.contentKey,
    replacement: Ea()
  };
}
function Ea() {
  return {
    active: !1,
    originalName: "",
    originalContentUuid: "",
    originalContentKey: "",
    replacementName: "",
    replacementContentUuid: "",
    replacementContentKey: "",
    selectionKind: "none"
  };
}
function In() {
  return {
    kind: "other",
    sourceUuid: "",
    instanceId: "",
    grantId: "",
    status: "active",
    contentUuid: "",
    contentKey: "",
    replacement: Ea()
  };
}
function Ot(n) {
  return { name: n.name, img: n.img, type: n.type, system: st(n.system) };
}
function Rn(n, e) {
  const t = Ot(n);
  return t.type = e, t;
}
function ze(n) {
  return [...n.items].filter((e) => e.type === "characterType" || e.type === "descriptor" || e.type === "species");
}
function xp(n, e) {
  return [...n.items].filter((t) => t.system.grantedBy?.instanceId === e);
}
function Wn(n, e) {
  return xp(n, e).flatMap((i) => {
    if (i.type !== "descriptor" && i.type !== "characterType" && i.type !== "species") return [i];
    const a = i.system.instance?.instanceId;
    return [i, ...a ? Wn(n, a) : []];
  });
}
class qp {
  #e;
  #t;
  #i;
  constructor(e = async (a) => await fromUuid(a), t = () => globalThis.crypto?.randomUUID?.() ?? `package-${Date.now()}-${Math.random()}`, i = Date.now) {
    this.#e = e, this.#t = t, this.#i = i;
  }
  async attachType(e, t, i = {}) {
    this.#S(e, t, "characterType");
    const a = i.replaceItemId ? ze(e).find((R) => R.id === i.replaceItemId && R.type === "characterType") : void 0;
    if (ze(e).some((R) => R.type === "characterType" && R.id !== a?.id))
      throw new Error("This Character already has an active Type.");
    const s = st(t.system), o = s.edgeGrant.mode === "choice" ? i.edgePool : s.edgeGrant.pool;
    if (s.edgeGrant.mode === "choice" && !o) throw new Error("This Type requires an Edge Pool choice.");
    const r = s.genre === "superhero" && s.superhero?.superheroics?.enabled === !0, l = i.superheroicsPool;
    if (r && !l)
      throw new Error("This Superhero Type requires a Superheroics Pool choice.");
    if (l && !k.includes(l))
      throw new Error("Invalid Superheroics Pool choice.");
    const u = Number.isInteger(s.superhero?.powerShiftCount) ? Math.max(0, Number(s.superhero?.powerShiftCount)) : 0, d = Array.from({ length: u }, (R, G) => String(i.powerShifts?.[G] ?? "").trim()), p = this.#f(s.choiceGroups ?? [], i.skillChoices ?? {}), y = this.#p(s.abilityChoiceGroups ?? [], i.abilityChoices ?? {}), m = this.#t(), h = s.instance?.sourceUuid || t.uuid, f = (s.abilityChoiceGroups ?? []).flatMap((R) => R.options.filter((G) => y[R.id]?.includes(G.id)).map((G) => ({ ...G, id: `${R.id}:${G.id}` }))), A = [
      ...await this.#l([...s.abilityGrants ?? [], ...f], "type", h, m),
      ...await this.#r(s.skillGrants ?? [], "type", h, m),
      ...await this.#s(s.choiceGroups ?? [], p, "type", h, m)
    ], { grants: v, skippedGrantIds: E } = await this.#o(
      e,
      A,
      t,
      i.conflictResolver
    ), H = Ot(t);
    return H.system = {
      ...s,
      instance: {
        sourceUuid: h,
        instanceId: m,
        role: "primary",
        attachedAt: this.#i(),
        selections: {
          edgePool: o ?? "none",
          superheroicsPool: r ? l : "none",
          powerShifts: d,
          poolChoices: [],
          skillChoices: Object.entries(p).map(([R, G]) => ({ groupId: R, optionIds: G })),
          abilityChoices: Object.entries(y).map(([R, G]) => ({ groupId: R, optionIds: G })),
          descriptorChoices: [],
          suppressedGrantIds: E
        },
        parent: In()
      }
    }, this.#n(e, H, v, a, i.replaceGrantedItemsMode ?? "delete", E);
  }
  async attachDescriptor(e, t, i) {
    this.#S(e, t, "descriptor");
    const a = st(t.system), s = a.instance?.sourceUuid || t.uuid;
    if (ze(e).some((m) => m.type === "descriptor" && m.system.instance.sourceUuid === s)) throw new Error("This Descriptor is already attached.");
    if (i.role === "primary" && ze(e).some((m) => m.type === "descriptor" && m.system.instance.role === "primary")) throw new Error("This Character already has a primary Descriptor.");
    const o = this.#t(), r = this.#m(a.poolBonusChoiceGroups ?? [], i.poolChoices ?? {}), l = this.#f(a.choiceGroups ?? [], i.skillChoices ?? {}), u = [
      ...await this.#r(a.skillGrants ?? [], "descriptor", s, o),
      ...await this.#s(a.choiceGroups ?? [], l, "descriptor", s, o)
    ], { grants: d, skippedGrantIds: p } = await this.#o(
      e,
      u,
      t,
      i.conflictResolver
    ), y = Ot(t);
    return y.system = {
      ...a,
      instance: {
        sourceUuid: s,
        instanceId: o,
        role: i.role,
        attachedAt: this.#i(),
        selections: {
          edgePool: "none",
          superheroicsPool: "none",
          powerShifts: [],
          poolChoices: Object.entries(r).map(([m, h]) => ({ groupId: m, pools: h })),
          skillChoices: Object.entries(l).map(([m, h]) => ({ groupId: m, optionIds: h })),
          abilityChoices: [],
          descriptorChoices: [],
          suppressedGrantIds: p
        },
        parent: i.parent ?? In()
      }
    }, i.parent && (y.system.grantedBy = i.parent), this.#n(e, y, d, void 0, "delete", p);
  }
  async attachSpecies(e, t, i = {}) {
    this.#S(e, t, "species");
    const a = i.replaceItemId ? ze(e).find((M) => M.id === i.replaceItemId && M.type === "species") : void 0;
    if (ze(e).some((M) => M.type === "species" && M.id !== a?.id))
      throw new Error("This Character already has an active Species.");
    const s = st(t.system), o = s.edgeGrant.mode === "choice" ? i.edgePool : s.edgeGrant.pool;
    if (s.edgeGrant.mode === "choice" && !o) throw new Error("This Species requires an Edge Pool choice.");
    const r = this.#f(s.choiceGroups ?? [], i.skillChoices ?? {}), l = this.#p(s.abilityChoiceGroups ?? [], i.abilityChoices ?? {}), u = new Map(
      (i.resolvedDescriptorChoiceGroups ?? []).map((M) => [M.id, M])
    ), d = (s.descriptorChoiceGroups ?? []).map((M) => {
      if ((M.sourceMode ?? "fixed") !== "catalog") return M;
      const D = u.get(M.id);
      return { ...M, options: D?.options ?? M.options };
    }), p = this.#h(
      d,
      i.descriptorChoices ?? {}
    ), y = this.#t(), m = s.instance?.sourceUuid || t.uuid, h = (s.abilityChoiceGroups ?? []).flatMap((M) => M.options.filter((D) => l[M.id]?.includes(D.id)).map((D) => ({ ...D, id: `${M.id}:${D.id}` }))), f = d.flatMap((M) => M.options.filter((D) => p[M.id]?.includes(D.id)).map((D) => ({ ...D, id: `${M.id}:${D.id}` }))), A = [
      ...await this.#l([...s.abilityGrants ?? [], ...h], "species", m, y),
      ...await this.#r(s.skillGrants ?? [], "species", m, y),
      ...await this.#s(s.choiceGroups ?? [], r, "species", m, y)
    ], v = await this.#o(
      e,
      A,
      t,
      i.conflictResolver
    ), E = [...v.grants], H = [...v.skippedGrantIds], R = [...v.skippedGrantIds], G = new Set(ze(e).filter((M) => M.type === "descriptor").map((M) => M.system.instance.sourceUuid || `snapshot:${M.name.trim().toLocaleLowerCase()}`)), P = [...s.descriptorGrants ?? [], ...f];
    if (!Me(P.map((M) => M.id)))
      throw new Error("Species Descriptor grant IDs must be unique.");
    for (const M of P) {
      const D = M.descriptorUuid ? await this.#e(M.descriptorUuid) : null;
      if (D && D.type !== "descriptor") throw new Error("A Species Descriptor grant references a non-Descriptor Item.");
      const I = D ? Ot(D) : Pp(M.snapshot, "descriptor");
      if (!I) throw new Error(`Descriptor grant '${M.id}' has neither a source nor a usable snapshot.`);
      const ne = st(I.system), _ = ne.instance?.sourceUuid || M.descriptorUuid, He = _ || `snapshot:${String(I.name).trim().toLocaleLowerCase()}`;
      if (G.has(He)) {
        H.push(M.id), R.push(M.id);
        continue;
      }
      G.add(He);
      const O = this.#t(), Q = this.#m(
        ne.poolBonusChoiceGroups ?? [],
        i.descriptorPoolChoices?.[M.id] ?? {}
      ), $e = this.#f(
        ne.choiceGroups ?? [],
        i.descriptorSkillChoices?.[M.id] ?? {}
      ), Se = [
        ...await this.#r(ne.skillGrants ?? [], "descriptor", _, O),
        ...await this.#s(ne.choiceGroups ?? [], $e, "descriptor", _, O)
      ], Ie = {
        id: String(D?.id ?? M.id),
        uuid: _,
        name: String(I.name),
        type: "descriptor",
        ...I.img ? { img: String(I.img) } : {},
        system: ne
      }, ce = await this.#o(
        e,
        Se,
        Ie,
        i.conflictResolver,
        E
      );
      R.push(...ce.skippedGrantIds);
      const Z = {
        contentUuid: _,
        contentKey: `descriptor:${String(I.name).trim().toLocaleLowerCase()}`
      }, Ae = {
        kind: "species",
        sourceUuid: m,
        instanceId: y,
        grantId: M.id,
        status: "active",
        ...Z,
        replacement: Ea()
      };
      I.system = {
        ...ne,
        grantedBy: Ae,
        instance: {
          sourceUuid: _,
          instanceId: O,
          role: "speciesGranted",
          attachedAt: this.#i(),
          selections: {
            edgePool: "none",
            superheroicsPool: "none",
            powerShifts: [],
            poolChoices: Object.entries(Q).map(([pe, N]) => ({ groupId: pe, pools: N })),
            skillChoices: Object.entries($e).map(([pe, N]) => ({ groupId: pe, optionIds: N })),
            abilityChoices: [],
            descriptorChoices: [],
            suppressedGrantIds: ce.skippedGrantIds
          },
          parent: Ae
        }
      }, E.push(I, ...ce.grants);
    }
    const X = Ot(t);
    return X.system = {
      ...s,
      instance: {
        sourceUuid: m,
        instanceId: y,
        role: "primary",
        attachedAt: this.#i(),
        selections: {
          edgePool: o ?? "none",
          superheroicsPool: "none",
          powerShifts: [],
          poolChoices: [],
          skillChoices: Object.entries(r).map(([M, D]) => ({ groupId: M, optionIds: D })),
          abilityChoices: Object.entries(l).map(([M, D]) => ({ groupId: M, optionIds: D })),
          descriptorChoices: Object.entries(p).map(([M, D]) => ({ groupId: M, optionIds: D })),
          suppressedGrantIds: H
        },
        parent: In()
      }
    }, this.#n(
      e,
      X,
      E,
      a,
      i.replaceGrantedItemsMode ?? "delete",
      R
    );
  }
  async remove(e, t, i) {
    const a = ze(e).find((d) => d.id === t);
    if (!a) throw new Error("Character Package not found.");
    const s = a.system.instance.instanceId, o = Wn(e, s), r = Object.fromEntries(k.map((d) => [d, e.system.derived.pools[d].max])), l = nn(a), u = i === "delete" ? o.map((d) => d.id) : [];
    return i === "keep" && await Promise.all(o.map((d) => d.update({
      "system.grantedBy.status": "retained",
      ...d.type === "descriptor" || d.type === "characterType" || d.type === "species" ? { "system.instance.parent.status": "retained" } : {}
    }))), await e.deleteEmbeddedDocuments("Item", [a.id, ...u]), await this.#a(e, r, Object.fromEntries(k.map((d) => [d, r[d] - l[d]]))), {
      removedPackageId: a.id,
      deletedGrantedItemIds: u,
      retainedGrantedItemIds: i === "keep" ? o.map((d) => d.id) : []
    };
  }
  async #n(e, t, i, a, s = "delete", o = []) {
    const r = Object.fromEntries(k.map((y) => [y, e.system.derived.pools[y].max])), l = nn(t), u = a ? nn(a) : { might: 0, speed: 0, intellect: 0 }, d = await e.createEmbeddedDocuments("Item", [t, ...i]);
    try {
      if (a) {
        const m = Wn(e, a.system.instance.instanceId);
        s === "keep" && await Promise.all(m.map((h) => h.update({
          "system.grantedBy.status": "retained",
          ...h.type === "descriptor" || h.type === "characterType" || h.type === "species" ? { "system.instance.parent.status": "retained" } : {}
        }))), await e.deleteEmbeddedDocuments("Item", [
          a.id,
          ...s === "delete" ? m.map((h) => h.id) : []
        ]);
      }
      const y = Object.fromEntries(k.map((m) => [m, r[m] + l[m] - u[m]]));
      await this.#a(e, r, y);
    } catch (y) {
      const m = d.map((h) => h.id).filter((h) => !!h);
      throw m.length && await e.deleteEmbeddedDocuments("Item", m), y;
    }
    const p = t.system.instance.instanceId;
    return { packageItem: d[0], grantedItems: d.slice(1), instanceId: p, skippedGrantIds: o };
  }
  async #a(e, t, i) {
    const a = {};
    for (const s of k)
      a[`system.stats.${s}.value`] = co(e.system.stats[s].value, t[s], Math.max(0, i[s]));
    await e.update(a);
  }
  async #l(e, t, i, a) {
    if (!Me(e.map((s) => s.id))) throw new Error("Type Ability grant IDs must be unique.");
    return Promise.all(e.map(async (s) => {
      const o = s.abilityUuid ? await this.#e(s.abilityUuid) : null;
      if (o && o.type !== "ability") throw new Error("An Ability grant references a non-Ability Item.");
      const r = o ? Rn(o, "ability") : En(s.snapshot, "ability");
      if (!r) throw new Error(`Ability grant '${s.id}' has neither a source nor a usable snapshot.`);
      const l = Ge("ability", String(r.name ?? s.snapshot.name), s.abilityUuid);
      return r.system = { ...r.system, grantedBy: Ds(t, i, a, s.id, l) }, r;
    }));
  }
  async #r(e, t, i, a) {
    if (!Me(e.map((s) => s.id))) throw new Error("Descriptor Skill grant IDs must be unique.");
    return Promise.all(e.map((s) => this.#c(s, s.rank, t, i, a, s.id)));
  }
  async #s(e, t, i, a, s) {
    const o = [];
    for (const r of e)
      for (const l of t[r.id] ?? []) {
        const u = r.options.find((d) => d.id === l);
        o.push(await this.#c(u, r.rank, i, a, s, `${r.id}:${u.id}`));
      }
    return o;
  }
  async #c(e, t, i, a, s, o) {
    const r = e.skillUuid ? await this.#e(e.skillUuid) : null;
    if (r && r.type !== "skill") throw new Error("A Skill grant references a non-Skill Item.");
    const l = r ? Rn(r, "skill") : En(e.snapshot, "skill") ?? (e.customName ? { name: e.customName, type: "skill", system: {} } : null);
    if (!l) throw new Error(`Skill grant '${o}' has neither a source, custom name, nor usable snapshot.`);
    const u = Ge("skill", String(l.name ?? e.customName), e.skillUuid), d = l.system, p = d.acquisition && typeof d.acquisition == "object" ? d.acquisition : {}, y = String(e.notes ?? "");
    return l.system = {
      ...d,
      ...y ? { acquisition: { ...p, notes: y } } : {},
      rank: t,
      grantedBy: Ds(i, a, s, o, u)
    }, l;
  }
  async #o(e, t, i, a, s = []) {
    const o = [], r = [], l = [...e.items], u = s.filter((d) => d.type === "ability" || d.type === "skill");
    for (const d of t) {
      let p = d;
      const y = p.type;
      if (y !== "ability" && y !== "skill") {
        o.push(p);
        continue;
      }
      for (; ; ) {
        const m = p.system.grantedBy ?? {}, h = { type: y, contentUuid: m.contentUuid, contentKey: m.contentKey }, f = [...l, ...u, ...o], A = Wi(f, h);
        if (!A) {
          o.push(p);
          break;
        }
        if (!a) {
          r.push(m.grantId);
          break;
        }
        const v = {
          id: `${m.instanceId}:${m.grantId}`,
          type: y,
          packageName: i.name,
          packageSourceUuid: i.uuid,
          grantId: m.grantId,
          existing: this.#d(A, y),
          proposed: this.#d(p, y),
          suggestions: this.#A(e, i, y, m.grantId),
          allowCustom: y === "skill",
          allowSuppress: !0,
          allowGmOverride: !1,
          context: "package"
        }, E = await a(v);
        if (E.action === "cancel") throw new We();
        if (E.action === "suppress") {
          r.push(m.grantId);
          break;
        }
        if (E.action !== "replace")
          throw new Error("GM Override is not a valid Character Package grant resolution.");
        p = await this.#u(p, E.replacement, E.selectionKind);
      }
    }
    return { grants: o, skippedGrantIds: r };
  }
  #d(e, t) {
    const i = e, a = i.system ?? {}, s = a.grantedBy ?? {}, o = Ge(t, String(i.name ?? ""), String(s.contentUuid ?? ""));
    return {
      id: String(i.id ?? i.uuid ?? o.contentKey),
      name: String(i.name ?? ""),
      type: t,
      rank: t === "skill" ? String(a.rank ?? "untrained") : "",
      contentUuid: String(s.contentUuid ?? o.contentUuid),
      contentKey: String(s.contentKey ?? o.contentKey)
    };
  }
  async #u(e, t, i) {
    const a = e.type;
    if (a !== "ability" && a !== "skill") throw new Error("Only Skill and Ability grants can be replaced.");
    if (t.type !== a) throw new Error("A grant replacement must use the same Item type.");
    const s = t.itemUuid ? await this.#e(t.itemUuid) : null;
    if (s && s.type !== a) throw new Error(`The selected replacement is not a ${a} Item.`);
    const o = s ? Rn(s, a) : En(t.snapshot, a) ?? (a === "skill" && t.custom ? { name: t.name, type: a, system: {} } : null);
    if (!o) throw new Error(`The selected ${a} replacement is unavailable and has no usable snapshot.`);
    const r = e.system, l = r.grantedBy ?? {}, u = l.replacement?.active ? l.replacement : {
      originalName: String(e.name ?? ""),
      originalContentUuid: l.contentUuid,
      originalContentKey: l.contentKey
    }, d = Ge(a, String(o.name ?? t.name), t.itemUuid), p = o.system, y = r.acquisition && typeof r.acquisition == "object" ? r.acquisition : {}, m = p.acquisition && typeof p.acquisition == "object" ? p.acquisition : {};
    return o.system = {
      ...p,
      ...a === "skill" ? { rank: r.rank } : {},
      ...a === "skill" && y.notes ? { acquisition: { ...m, notes: y.notes } } : {},
      grantedBy: {
        ...l,
        contentUuid: d.contentUuid,
        contentKey: d.contentKey,
        replacement: {
          active: !0,
          originalName: u.originalName,
          originalContentUuid: u.originalContentUuid,
          originalContentKey: u.originalContentKey,
          replacementName: String(o.name ?? t.name),
          replacementContentUuid: d.contentUuid,
          replacementContentKey: d.contentKey,
          selectionKind: i
        }
      }
    }, o;
  }
  #A(e, t, i, a) {
    const s = [], o = (d, p, y) => {
      const m = d.snapshot?.name || d.customName;
      m && s.push({
        id: `${y}:${d.id}`,
        type: i,
        name: m,
        itemUuid: d.itemUuid,
        snapshot: d.snapshot,
        reason: p,
        reasonSourceUuid: y,
        ...i === "skill" && !d.itemUuid ? { custom: !0 } : {}
      });
    }, r = (d, p, y) => {
      for (const m of d ?? []) o(m, p, y);
    }, l = (d, p = !1) => {
      const y = d.system, m = "instance" in y ? y.instance?.selections : void 0;
      if (i === "skill") {
        for (const h of y.skillGrants ?? [])
          d.uuid === t.uuid && h.id === a && r(h.alternatives, `${d.name} — declared alternative`, d.uuid);
        for (const h of y.choiceGroups ?? []) {
          const f = m?.skillChoices.find((v) => v.groupId === h.id)?.optionIds ?? [], A = a.startsWith(`${h.id}:`) ? a.slice(h.id.length + 1) : "";
          if (d.uuid === t.uuid && A)
            for (const v of h.options) v.id !== A && o({ id: v.id, itemUuid: v.skillUuid, customName: v.customName, snapshot: v.snapshot }, `${d.name} — Skill choice`, d.uuid);
          else if (!p)
            for (const v of h.options) f.includes(v.id) || o({ id: v.id, itemUuid: v.skillUuid, customName: v.customName, snapshot: v.snapshot }, `${d.name} — unused Skill choice`, d.uuid);
        }
      } else {
        for (const h of y.abilityGrants ?? [])
          d.uuid === t.uuid && h.id === a && r(h.alternatives, `${d.name} — declared alternative`, d.uuid);
        for (const h of y.abilityChoiceGroups ?? []) {
          const f = m?.abilityChoices.find((v) => v.groupId === h.id)?.optionIds ?? [], A = a.startsWith(`${h.id}:`) ? a.slice(h.id.length + 1) : "";
          if (d.uuid === t.uuid && A)
            for (const v of h.options) v.id !== A && o({ id: v.id, itemUuid: v.abilityUuid, customName: "", snapshot: v.snapshot }, `${d.name} — Ability choice`, d.uuid);
          else if (!p)
            for (const v of h.options) f.includes(v.id) || o({ id: v.id, itemUuid: v.abilityUuid, customName: "", snapshot: v.snapshot }, `${d.name} — unused Ability choice`, d.uuid);
        }
      }
    };
    l(t, !0);
    for (const d of ze(e)) l(d);
    const u = /* @__PURE__ */ new Set();
    return s.filter((d) => {
      const p = Ge(i, d.name, d.itemUuid), y = p.contentUuid || p.contentKey;
      return u.has(y) || _o(e.items, p) ? !1 : (u.add(y), !0);
    });
  }
  #f(e, t) {
    const i = {};
    for (const a of e) {
      const s = t[a.id] ?? [];
      if (s.length !== a.choose || !Me(s) || s.some((o) => !a.options.some((r) => r.id === o)))
        throw new Error(`Descriptor choice '${a.id}' requires exactly ${a.choose} valid option(s).`);
      i[a.id] = [...s];
    }
    return i;
  }
  #p(e, t) {
    const i = {};
    for (const a of e) {
      const s = t[a.id] ?? [];
      if (s.length !== a.choose || !Me(s) || s.some((o) => !a.options.some((r) => r.id === o)))
        throw new Error(`Ability choice '${a.id}' requires exactly ${a.choose} valid option(s).`);
      i[a.id] = [...s];
    }
    return i;
  }
  #h(e, t) {
    if (!Me(e.map((a) => a.id)))
      throw new Error("Species Descriptor choice group IDs must be unique.");
    const i = {};
    for (const a of e) {
      if (!Me(a.options.map((o) => o.id)))
        throw new Error(`Descriptor choice '${a.id}' option IDs must be unique.`);
      const s = t[a.id] ?? [];
      if (!Number.isInteger(a.choose) || a.choose < 1 || a.choose > a.options.length || s.length !== a.choose || !Me(s) || s.some((o) => !a.options.some((r) => r.id === o)))
        throw new Error(`Descriptor choice '${a.id}' requires exactly ${a.choose} valid option(s).`);
      i[a.id] = [...s];
    }
    return i;
  }
  #m(e, t) {
    if (!Me(e.map((a) => a.id)))
      throw new Error("Descriptor Pool bonus choice group IDs must be unique.");
    const i = {};
    for (const a of e) {
      const s = [...new Set(a.pools)].filter((r) => k.includes(r));
      if (s.length !== a.pools.length || !Number.isInteger(a.choose) || a.choose < 1 || a.choose > s.length || !Number.isInteger(a.amount) || a.amount < 1)
        throw new Error(`Descriptor Pool choice '${a.id}' is invalid.`);
      const o = t[a.id] ?? [];
      if (o.length !== a.choose || !Me(o) || o.some((r) => !s.includes(r)))
        throw new Error(`Descriptor Pool choice '${a.id}' requires exactly ${a.choose} valid Pool(s).`);
      i[a.id] = [...o];
    }
    return i;
  }
  #S(e, t, i) {
    if (e.type !== "character") throw new Error("Character Packages require a Character Actor.");
    if (t.type !== i) throw new Error(`Expected a ${i} Item.`);
  }
}
function Ii(n, e, t = 0) {
  if (!Number.isInteger(n) || n < t)
    throw new Error(`${e} must be an integer of at least ${t}.`);
  return n;
}
function Fs(n, e, t) {
  if (!Number.isInteger(e) || e < -10 || e > 10)
    throw new Error(`${t} modifier must be an integer from -10 to +10.`);
  return e === 0 ? null : {
    id: `ability.${n.id}.${t}-modifier`,
    label: t === "attack" ? "MAGNUSARCHIVES.Ability.AttackModifierContribution" : "MAGNUSARCHIVES.Ability.RollModifierContribution",
    direction: e > 0 ? "ease" : "hinder",
    steps: Math.abs(e),
    source: "other",
    sourceId: n.id
  };
}
function Op(n) {
  return n.type === "npc" ? Ut(n) : {
    actorId: n.id,
    ...n.actorUuid ?? n.uuid ? { actorUuid: n.actorUuid ?? n.uuid } : {},
    ...n.tokenId ? { tokenId: n.tokenId } : {},
    ...n.tokenUuid ? { tokenUuid: n.tokenUuid } : {}
  };
}
class Bp {
  #e;
  #t;
  #i;
  #n;
  constructor(e, t, i, a) {
    this.#e = e, this.#t = t, this.#i = i, this.#n = a;
  }
  canUse(e) {
    return e.type === "ability" && !["passive", "enabler", "perpetual"].includes(e.system.activation);
  }
  pool(e, t) {
    const i = Ye(e);
    if (t && i.length > 0 && !i.includes(t))
      throw new Error(`${t} is not an allowed Pool for this Ability.`);
    return i.length === 1 ? i[0] : t ?? null;
  }
  previewPayment(e, t, i) {
    j(e), this.#l(t);
    const a = Ye(t), s = Ii(t.system.cost.amount, "Ability cost");
    if (s <= 0 || a.length === 0)
      throw new Error("This Ability has no payable Pool cost.");
    if (!a.includes(i)) throw new Error(`${i} is not an allowed Pool for this Ability.`);
    const o = Ii(e.system.stats[i].value, `${i} Pool value`), r = Math.max(0, Math.trunc(e.system.derived.pools[i].edge)), l = Ln(s, 0, r, t.system.cost.ignoresEdge), u = o - l.poolCost;
    return {
      ability: t,
      pool: i,
      listedCost: s,
      ignoresEdge: t.system.cost.ignoresEdge,
      edge: r,
      edgeApplied: l.edgeApplied,
      costPaid: l.poolCost,
      currentBefore: o,
      currentAfter: u,
      canPay: u >= 0
    };
  }
  async payCost(e, t, i) {
    const a = this.previewPayment(e, t, i);
    if (!a.canPay)
      throw new Error(`${i} has ${a.currentBefore} points but this Ability costs ${a.costPaid}.`);
    return a.costPaid > 0 && await e.update({ [`system.stats.${i}.value`]: a.currentAfter }), a;
  }
  async executeNoRoll(e, t, i = {}) {
    if (this.#l(t), !this.canUse(t)) throw new Error("Passive, Enabler, and Perpetual Abilities have no direct Use action.");
    if (t.system.roll !== "none") throw new Error("This Ability requires a roll.");
    const a = this.#a(t, i.targets ?? []), s = this.pool(t, i.pool), o = this.#r(t);
    if (o > 0 && !s) throw new Error("A Pool is required to pay this Ability cost.");
    if (!s) return { ability: t, actor: { id: e.id, name: e.name }, pool: null, costPaid: 0, edgeApplied: 0, targets: a };
    const r = e.system.stats[s].value, l = Ln(
      o,
      0,
      e.system.derived.pools[s].edge,
      t.system.cost.ignoresEdge
    );
    if (r < l.poolCost)
      throw new Error(`${s} has ${r} points but this action costs ${l.poolCost}.`);
    return l.poolCost > 0 && await e.update({ [`system.stats.${s}.value`]: r - l.poolCost }), {
      ability: t,
      actor: { id: e.id, name: e.name },
      pool: s,
      costPaid: l.poolCost,
      edgeApplied: l.edgeApplied,
      targets: a
    };
  }
  buildRollPlan(e, t, i = {}) {
    if (this.#l(t), !this.canUse(t)) throw new Error("Passive, Enabler, and Perpetual Abilities have no direct Use action.");
    if (t.system.roll === "none") throw new Error("This Ability does not require a roll.");
    const a = this.pool(t, i.pool);
    if (!a) throw new Error("Choose a Pool for this Ability roll.");
    const s = i.enabledRuleModuleIds ?? [], o = this.#a(t, i.targets ?? []), r = o.length ? o : [null], l = [
      "ability",
      `ability.${t.system.roll}`,
      ...t.system.roll === "attack" ? ["attack", "attack.ability", "defense.speed"] : [],
      ...t.system.roll === "defense" ? ["defense"] : [],
      ...a === "speed" ? ["speed-task"] : []
    ], u = { tags: l, pool: a }, d = r.map((f) => f?.type === "npc" ? this.#i.resolve(f, u, s) : null), p = [], y = Fs(t, t.system.rollModifier, "roll");
    if (y && p.push(y), t.system.roll === "attack") {
      const f = Fs(t, t.system.attackModifier, "attack");
      f && p.push(f);
    }
    const m = i.skill ? this.#t.rankContribution(i.skill, s) : null;
    m && p.push(m);
    const h = r.map((f, A) => ({
      label: t.name,
      pool: a,
      difficulty: d[A] ? { mode: "hidden", value: d[A].difficulty } : i.difficulty ?? { mode: "unknown" },
      skillSteps: i.skillSteps ?? 0,
      assets: i.assets ?? 0,
      paidEffort: i.paidEffort ?? 0,
      damageEffort: t.system.roll === "attack" ? i.damageEffort ?? 0 : 0,
      freeDamageEffort: t.system.roll === "attack" ? i.freeDamageEffort ?? 0 : 0,
      freeEffort: i.freeEffort ?? 0,
      actionCost: this.#r(t),
      actionCostIgnoresEdge: t.system.cost.ignoresEdge,
      otherEase: i.otherEase ?? 0,
      otherHindrance: i.otherHindrance ?? 0,
      contributions: [
        ...p,
        ...d[A]?.contributions ?? [],
        ...i.contributions ?? []
      ],
      purpose: t.system.roll === "attack" ? "damage" : "task",
      tags: l,
      origin: {
        kind: "ability",
        itemId: t.id,
        name: t.name,
        activation: t.system.activation,
        rollType: t.system.roll,
        damage: Ii(t.system.damage, "Ability damage"),
        damageEffect: t.system.damageEffect,
        stressAmount: t.system.stressAmount
      },
      ...f ? {
        target: {
          ...Op(f),
          name: f.name,
          type: f.type === "npc" ? "npc" : "character"
        }
      } : {}
    }));
    return { ability: t, pool: a, requests: h, targets: r, targetResolutions: d, damage: t.system.damage };
  }
  async executeRoll(e, t, i, a) {
    const s = this.buildRollPlan(e, t, i), o = await this.#e.executeBatch(e, s.requests, a), r = this.#n.policy(i.enabledRuleModuleIds ?? []).damageEffortBonus;
    return o.map((l, u) => {
      const d = t.system.roll === "attack" ? l.result.prepared.damageEffortApplied * r : 0, p = t.system.roll === "attack" ? Xt(l.result) : 0;
      return {
        ability: t,
        target: s.targets[u] ?? null,
        targetResolution: s.targetResolutions[u] ?? null,
        execution: l,
        baseDamage: s.damage,
        effortDamage: d,
        naturalDamage: p,
        grossDamage: s.damage + d + p,
        damageEffect: t.system.damageEffect,
        stressAmount: t.system.stressAmount
      };
    });
  }
  chooseAttackOutcomes(e, t) {
    return e.map((i) => {
      if (i.ability.system.roll !== "attack") return i;
      const a = vr(i.execution.result, t), s = Xt(a);
      return {
        ...i,
        execution: { ...i.execution, result: a },
        naturalDamage: s,
        grossDamage: i.baseDamage + i.effortDamage + s
      };
    });
  }
  #a(e, t) {
    if (e.system.targetMode === "none") return [];
    if (e.system.targetMode === "single" && t.length > 1)
      throw new Error("This Ability can target only one Character or NPC.");
    return t;
  }
  #l(e) {
    if (e.type !== "ability") throw new Error("Ability use requires an Ability Item.");
  }
  #r(e) {
    const t = Ii(e.system.cost.amount, "Ability cost");
    return Ye(e).length > 0 ? t : 0;
  }
}
function Ts(n) {
  return n.type === "npc" ? Ut(n) : Vi(n);
}
function zs(n, e) {
  const t = n.target;
  return t ? t.type === "npc" && n.grossDamage > 0 ? {
    damage: n.grossDamage,
    action: {
      kind: "npcDamage",
      ...Ti(Ts(t)),
      requestedDamage: n.grossDamage,
      applied: !1
    }
  } : t.type === "character" && n.damageEffect !== "none" ? {
    damageEffect: n.damageEffect,
    stressAmount: n.stressAmount,
    action: {
      kind: "characterDamage",
      ...Ti(Ts(t)),
      effect: n.damageEffect,
      stressAmount: n.stressAmount,
      sourceActorId: e,
      sourceName: n.ability.name,
      applied: !1
    }
  } : {} : {};
}
class Lp {
  #e;
  constructor(e) {
    this.#e = e;
  }
  async publishRoll(e, t, i, a = !1) {
    const s = t.execution.result.success === !0, o = t.execution.result.success !== !1, l = {
      ...s ? zs(t, e.id) : {},
      ...o && t.ability.system.roll === "attack" ? {
        damage: t.grossDamage,
        damageBreakdown: [
          { label: "MAGNUSARCHIVES.Ability.DamageBreakdown.Base", value: t.baseDamage },
          ...t.effortDamage ? [{ label: "MAGNUSARCHIVES.Combat.DamageBreakdown.Effort", value: t.effortDamage, additive: !0 }] : [],
          ...t.naturalDamage ? [{ label: "MAGNUSARCHIVES.Combat.DamageBreakdown.Natural", value: t.naturalDamage, additive: !0 }] : []
        ]
      } : {}
    };
    await this.#e.publish(e, t.execution, i, { combat: l, showGmAudit: a });
  }
  async publishNoRoll(e, t) {
    const i = t.targets.length ? t.targets : [null];
    for (const a of i) {
      const s = a ? zs({
        ability: t.ability,
        target: a,
        grossDamage: t.ability.system.damage,
        damageEffect: t.ability.system.damageEffect,
        stressAmount: t.ability.system.stressAmount
      }, e.id) : {}, o = s.action, r = await foundry.applications.handlebars.renderTemplate(
        "systems/magnusarchives/templates/chat/ability-card.hbs",
        {
          abilityName: t.ability.name,
          actorName: e.name,
          ...Ue(e),
          activation: game.i18n.localize(`MAGNUSARCHIVES.Ability.Activation.${t.ability.system.activation}`),
          poolLabel: t.pool ? game.i18n.localize(`MAGNUSARCHIVES.Pools.${t.pool[0].toUpperCase()}${t.pool.slice(1)}`) : "",
          costPaid: t.costPaid,
          targetName: a?.name ?? "",
          damage: s.damage,
          damageEffect: s.damageEffect ? game.i18n.localize(`MAGNUSARCHIVES.CharacterDamage.${s.damageEffect}`) : "",
          stressAmount: s.damageEffect === "stress" ? s.stressAmount : 0,
          combatAction: !!o,
          combatActionLabel: o ? game.i18n.localize(o.kind === "npcDamage" ? "MAGNUSARCHIVES.Combat.ApplyDamage" : "MAGNUSARCHIVES.Combat.ApplyCharacterDamage") : ""
        }
      ), l = {
        speaker: ChatMessage.getSpeaker({ actor: e }),
        content: r
      };
      o && (l.flags = { magnusarchives: { combatAction: o } }), await ChatMessage.create(l);
    }
  }
  async publishPayment(e, t) {
    const i = game.i18n.localize(
      `MAGNUSARCHIVES.Pools.${t.pool[0].toUpperCase()}${t.pool.slice(1)}`
    ), a = await foundry.applications.handlebars.renderTemplate(
      "systems/magnusarchives/templates/chat/ability-payment-card.hbs",
      {
        abilityName: t.ability.name,
        actorName: e.name,
        ...Ue(e),
        poolLabel: i,
        listedCost: t.listedCost,
        ignoresEdge: t.ignoresEdge,
        edgeApplied: t.edgeApplied,
        costPaid: t.costPaid,
        currentBefore: t.currentBefore,
        currentAfter: t.currentAfter
      }
    );
    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: e }),
      content: a
    });
  }
}
const jp = async (n) => {
  const e = await new Roll(n).evaluate();
  if (e.total === null) throw new Error("The Artifact level roll did not produce a total.");
  return { total: e.total, chatRoll: e };
};
class Wp {
  #e;
  constructor(e = jp) {
    this.#e = e;
  }
  canRollLevel(e) {
    return qn(e.system) && Fi(e.system);
  }
  async rollLevel(e) {
    if (!qn(e.system)) throw new Error("This Artifact is depleted.");
    if (!Fi(e.system)) throw new Error("This Artifact has a fixed Level.");
    const t = Qi(e.system), i = await this.#e(t);
    return await e.update({ "system.level": String(i.total) }), {
      itemId: e.id,
      itemName: e.name,
      formula: t,
      total: i.total,
      ...i.chatRoll === void 0 ? {} : { chatRoll: i.chatRoll }
    };
  }
}
function _p(n) {
  return game.i18n.localize(`MAGNUSARCHIVES.Pools.${n[0].toUpperCase()}${n.slice(1)}`);
}
function Kp(n) {
  const e = n._source?.system?.description;
  return typeof e == "string" ? e : "";
}
function Xp(n) {
  const e = n.system;
  if (n.type === "equipment")
    return [
      { label: game.i18n.localize("MAGNUSARCHIVES.Inventory.Quantity"), value: Number(e.quantity ?? 1) },
      ...Number(e.level) > 0 ? [{ label: game.i18n.localize("MAGNUSARCHIVES.Inventory.Level"), value: Number(e.level) }] : [],
      ...e.equipped === !0 ? [{ label: game.i18n.localize("MAGNUSARCHIVES.Combat.Equipped"), value: game.i18n.localize("MAGNUSARCHIVES.Common.Yes") }] : []
    ];
  if (n.type === "cypher") {
    const t = dr(e.manifestation), i = ur(e.power);
    return [
      { label: game.i18n.localize("MAGNUSARCHIVES.Cypher.Manifestation.Label"), value: game.i18n.localize(`MAGNUSARCHIVES.Cypher.Manifestation.${t}`) },
      ...String(e.form ?? "").trim() ? [{ label: game.i18n.localize("MAGNUSARCHIVES.Cypher.Form"), value: String(e.form) }] : [],
      { label: game.i18n.localize("MAGNUSARCHIVES.Cypher.Power.Label"), value: game.i18n.localize(`MAGNUSARCHIVES.Cypher.Power.${i}`) },
      { label: game.i18n.localize("MAGNUSARCHIVES.Inventory.Level"), value: Ca(e) }
    ];
  }
  if (n.type === "artifact") {
    const t = e.depletion;
    return [
      { label: game.i18n.localize("MAGNUSARCHIVES.Inventory.Level"), value: Qi(e) },
      ...t?.enabled === !0 ? [{
        label: game.i18n.localize("MAGNUSARCHIVES.Inventory.Depletion"),
        value: String(t.formula || `1${String(t.die ?? "d6")}`)
      }] : [],
      ...e.depleted === !0 ? [{ label: game.i18n.localize("MAGNUSARCHIVES.Artifact.Depleted"), value: game.i18n.localize("MAGNUSARCHIVES.Common.Yes") }] : []
    ];
  }
  if (n.type === "weapon") {
    const t = String(e.category ?? "medium"), i = String(e.attackType ?? "melee"), a = String(e.rangeCategory ?? "immediate");
    return [
      { label: game.i18n.localize("MAGNUSARCHIVES.Combat.Category"), value: game.i18n.localize(`MAGNUSARCHIVES.Combat.Weapon.Category.${t}`) },
      { label: game.i18n.localize("MAGNUSARCHIVES.Combat.Damage"), value: Number(e.baseDamage ?? 0) },
      { label: game.i18n.localize("MAGNUSARCHIVES.Combat.Weapon.AttackType.Label"), value: game.i18n.localize(`MAGNUSARCHIVES.Combat.Weapon.AttackType.${i}`) },
      { label: game.i18n.localize("MAGNUSARCHIVES.Combat.Range.Label"), value: game.i18n.localize(`MAGNUSARCHIVES.Combat.Range.${a}`) }
    ];
  }
  if (n.type === "shield") {
    const t = e.wounds, i = e.derived, a = i?.capacities, s = i?.broken === !0;
    return [
      { label: game.i18n.localize("MAGNUSARCHIVES.Shield.Status"), value: game.i18n.localize(s ? "MAGNUSARCHIVES.Shield.Broken" : "MAGNUSARCHIVES.Shield.Functional") },
      { label: game.i18n.localize("MAGNUSARCHIVES.Combat.Equipped"), value: game.i18n.localize(e.equipped === !0 ? "MAGNUSARCHIVES.Common.Yes" : "MAGNUSARCHIVES.Common.No") },
      { label: game.i18n.localize("MAGNUSARCHIVES.Shield.WoundTrack"), value: ["minor", "moderate", "major"].map((o) => `${t?.[o]?.length ?? 0}/${a?.[o] ?? 0}`).join(" · ") }
    ];
  }
  if (n.type === "armor") {
    const t = String(e.category ?? "light");
    return [
      { label: game.i18n.localize("MAGNUSARCHIVES.Combat.Category"), value: game.i18n.localize(`MAGNUSARCHIVES.Combat.Armor.Category.${t}`) },
      { label: game.i18n.localize("MAGNUSARCHIVES.Combat.Equipped"), value: game.i18n.localize(e.equipped === !0 ? "MAGNUSARCHIVES.Common.Yes" : "MAGNUSARCHIVES.Common.No") }
    ];
  }
  if (n.type === "ability") {
    const t = n, i = Ye(t), a = Eo(t.system.cost.amount, i, _p, {
      pair: game.i18n.localize("MAGNUSARCHIVES.Ability.CostDisplay.Or"),
      middle: game.i18n.localize("MAGNUSARCHIVES.Ability.CostDisplay.Separator"),
      final: game.i18n.localize("MAGNUSARCHIVES.Ability.CostDisplay.FinalOr")
    }, t.system.cost.scalable === !0);
    return a ? [{ label: game.i18n.localize("MAGNUSARCHIVES.Ability.Cost"), value: a }] : [];
  }
  return [];
}
function Yp(n) {
  return Xp(n).filter(
    ({ label: e, value: t }) => e.trim().length > 0 && (typeof t == "number" || t.trim().length > 0)
  );
}
class Jp {
  async publish(e) {
    const t = e.system, i = Kp(e), a = i ? await foundry.applications.ux.TextEditor.implementation.enrichHTML(i, {
      async: !0,
      relativeTo: e
    }) : "", s = t.depletion, o = await foundry.applications.handlebars.renderTemplate(
      "systems/magnusarchives/templates/chat/item-card.hbs",
      {
        itemName: e.name,
        ...Ue(e.actor),
        itemType: game.i18n.localize(`TYPES.Item.${e.type}`),
        properties: Yp(e),
        enrichedDescription: a,
        hasDescription: !!i.trim(),
        canRollDepletion: e.type === "artifact" && s?.enabled === !0 && t.depleted !== !0,
        itemUuid: e.uuid,
        depleted: t.depleted === !0
      }
    );
    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker(e.actor ? { actor: e.actor } : void 0),
      content: o
    });
  }
  async publishArtifactLevelRoll(e, t) {
    const i = await foundry.applications.handlebars.renderTemplate(
      "systems/magnusarchives/templates/chat/item-formula-roll-card.hbs",
      {
        itemName: t.itemName,
        ...Ue(e.actor),
        label: game.i18n.localize("MAGNUSARCHIVES.Artifact.LevelRoll"),
        formula: t.formula,
        total: t.total
      }
    ), a = {
      speaker: ChatMessage.getSpeaker(e.actor ? { actor: e.actor } : void 0),
      content: i
    };
    t.chatRoll !== void 0 && (a.rolls = [t.chatRoll]), await ChatMessage.create(a);
  }
}
class Qp {
  canUse(e) {
    return e.type === "character" && e.system.xp >= 1;
  }
  async spend(e, t) {
    if (j(e), !t) throw new Error("A Player Intrusion request ID is required.");
    if (e.system.xp < 1) throw new Error("Player Intrusion requires 1 XP.");
    return await e.update({ "system.xp": e.system.xp - 1 }), {
      requestId: t,
      actorId: e.id,
      actorUuid: e.uuid,
      actorName: e.name,
      xpSpent: 1
    };
  }
}
function Zp(n) {
  return { actorName: n.actorName, xpSpent: n.xpSpent };
}
class ef {
  async publish(e, t) {
    const i = await foundry.applications.handlebars.renderTemplate(
      "systems/magnusarchives/templates/chat/player-intrusion-card.hbs",
      {
        ...Zp(e),
        ...Ue(t)
      }
    );
    return await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: t }),
      content: i,
      flags: { magnusarchives: { playerIntrusion: e } }
    });
  }
}
function tf(n) {
  const e = new Ar(), t = new _m(), i = new qm(), a = new jm(), s = new cp(n), o = new up(n), r = new Sp(n), l = new sp(), u = new wp(), d = new Cp(), p = new fr(t), y = new Up(), m = new wr(), h = new ha(), f = new Np(
    n,
    s,
    o,
    r,
    t,
    e,
    u,
    d,
    p,
    m
  );
  return Object.freeze({
    conditions: e,
    wounds: t,
    recovery: new Lm(i, a),
    rally: new Mc(t),
    rolls: s,
    rollChat: l,
    skills: o,
    intrusions: new fp(n),
    intrusionChat: new Yc(),
    playerIntrusions: new Qp(),
    playerIntrusionChat: new ef(),
    targets: r,
    combat: f,
    combatChat: new Mp(l, p),
    abilities: new Bp(s, o, r, f),
    abilityChat: new Lp(l),
    shields: p,
    artifacts: new Wp(),
    itemChat: new Jp(),
    genres: new jd(),
    weapons: m,
    depletion: y,
    depletionChat: new kp(),
    combatStatuses: d,
    focusEvaluator: h,
    focusTrees: new zp(h),
    focusAcquisition: new Rd(h),
    advancement: new kd(n),
    focusAssociations: new Pd(),
    characterInitialization: new qd(),
    characterPackages: new qp()
  });
}
const nf = {
  id: "core",
  label: "MAGNUSARCHIVES.Themes.Core",
  sourceId: "magnusarchives.core",
  properties: {
    "--magnusarchives-surface-primary": "#1b1c1f",
    "--magnusarchives-surface-secondary": "#25262a",
    "--magnusarchives-surface-raised": "#303136",
    "--magnusarchives-text-primary": "#f3f4f6",
    "--magnusarchives-text-muted": "#a9acb2",
    "--magnusarchives-accent": "#96082a",
    "--magnusarchives-accent-hover": "#bd123f",
    "--magnusarchives-border": "#484a50",
    "--magnusarchives-danger": "#d85b66",
    "--magnusarchives-success": "#5fa878",
    "--magnusarchives-wound-pip-character": "var(--magnusarchives-danger)",
    "--magnusarchives-wound-pip-shield": "#8fc7ea",
    "--magnusarchives-stress-pip": "#d6b24a",
    "--magnusarchives-damage-track-reached": "var(--magnusarchives-danger)",
    "--magnusarchives-rank-expert": "#c4a7e7",
    "--magnusarchives-rank-specialized": "#8fc7ea",
    "--magnusarchives-rank-trained": "#85c99a",
    "--magnusarchives-rank-untrained": "#a9acb2",
    "--magnusarchives-rank-inability": "var(--magnusarchives-danger)",
    "--magnusarchives-cypher-power-low": "#a9acb2",
    "--magnusarchives-cypher-power-medium": "#85c99a",
    "--magnusarchives-cypher-power-advanced": "#8fc7ea",
    "--magnusarchives-cypher-power-high": "#c4a7e7",
    "--magnusarchives-cypher-power-ultra": "#e4a46d",
    "--magnusarchives-pool-gauge-low": "#8f4d55",
    "--magnusarchives-pool-gauge-high": "#567961",
    "--magnusarchives-color-bg": "var(--magnusarchives-surface-primary)",
    "--magnusarchives-color-surface": "var(--magnusarchives-surface-secondary)",
    "--magnusarchives-color-surface-raised": "var(--magnusarchives-surface-raised)",
    "--magnusarchives-color-border": "var(--magnusarchives-border)",
    "--magnusarchives-color-text": "var(--magnusarchives-text-primary)",
    "--magnusarchives-color-muted": "var(--magnusarchives-text-muted)",
    "--magnusarchives-color-accent": "var(--magnusarchives-accent)",
    "--magnusarchives-color-warning": "#c78a51",
    "--magnusarchives-color-danger": "var(--magnusarchives-danger)",
    "--magnusarchives-font-heading": "var(--font-primary, sans-serif)",
    "--magnusarchives-radius": "0.5rem",
    "--magnusarchives-shadow": "0 0.35rem 1rem rgb(0 0 0 / 30%)",
    "--magnusarchives-space": "0.65rem",
    "--magnusarchives-space-page": "0.85rem",
    "--magnusarchives-space-compact": "0.35rem",
    "--magnusarchives-space-tight": "0.2rem",
    "--magnusarchives-scrollbar-size": "0.45rem",
    "--magnusarchives-scrollbar-thumb": "var(--magnusarchives-color-border)",
    "--magnusarchives-scrollbar-track": "color-mix(in srgb, var(--magnusarchives-color-bg) 70%, transparent)"
  }
};
class af {
  #e = /* @__PURE__ */ new Map();
  #t = /* @__PURE__ */ new Set();
  register(e) {
    const t = e.id.trim();
    if (!t) throw new Error("Theme IDs cannot be blank.");
    if (this.#e.has(t)) throw new Error(`Theme '${t}' is already registered.`);
    const i = Object.freeze({ ...e.properties });
    for (const s of Object.keys(i))
      if (!s.startsWith("--magnusarchives-"))
        throw new Error(`Theme property '${s}' must use the --magnusarchives- prefix.`);
    const a = Object.freeze({ ...e, id: t, properties: i });
    return this.#e.set(t, a), a;
  }
  get(e) {
    return this.#e.get(e);
  }
  has(e) {
    return this.#e.has(e);
  }
  list() {
    return [...this.#e.values()].sort((e, t) => e.id.localeCompare(t.id));
  }
  choices() {
    return Object.fromEntries(this.list().map((e) => [e.id, e.label]));
  }
  apply(e, t = document.documentElement) {
    const i = this.#e.get(e);
    if (!i) throw new Error(`Theme '${e}' is not registered.`);
    for (const a of this.#t) t.style.removeProperty(a);
    this.#t.clear();
    for (const [a, s] of Object.entries(i.properties))
      t.style.setProperty(a, s), this.#t.add(a);
    return t.dataset.magnusarchivesTheme = i.id, i;
  }
}
function Ps(n) {
  return n.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function sf(n) {
  return n === !0 || n === "true" || n === "on";
}
async function of() {
  if (!game.user.isGM) throw new Error("Only a GM can initiate a GM Intrusion.");
  const n = [...game.actors].filter((r) => r.type === "character").sort((r, l) => r.name.localeCompare(l.name));
  if (n.length === 0) {
    ui.notifications.warn(game.i18n.localize("MAGNUSARCHIVES.Intrusion.NoCharacters"));
    return;
  }
  const e = n.map((r) => '<option value="' + r.id + '">' + Ps(r.name) + "</option>").join(""), t = n.map((r) => '<label class="intrusion-character-choice"><input name="group-' + r.id + '" type="checkbox"> ' + Ps(r.name) + "</label>").join(""), i = [
    '<div class="magnusarchives-dialog-fields magnusarchives-intrusion-dialog">',
    "<label>" + game.i18n.localize("MAGNUSARCHIVES.Intrusion.ModeLabel"),
    '<select name="mode">',
    '<option value="targeted">' + game.i18n.localize("MAGNUSARCHIVES.Intrusion.Mode.targeted") + "</option>",
    '<option value="group">' + game.i18n.localize("MAGNUSARCHIVES.Intrusion.Mode.group") + "</option>",
    '<option value="free">' + game.i18n.localize("MAGNUSARCHIVES.Intrusion.Mode.free") + "</option>",
    "</select></label>",
    '<label data-intrusion-selection="single">' + game.i18n.localize("MAGNUSARCHIVES.Intrusion.Character"),
    '<select name="targetActorId">' + e + "</select></label>",
    '<fieldset data-intrusion-selection="group" hidden>',
    "<legend>" + game.i18n.localize("MAGNUSARCHIVES.Intrusion.GroupCharacters") + "</legend>",
    t,
    "</fieldset></div>"
  ].join(""), a = await foundry.applications.api.DialogV2.input({
    window: { title: game.i18n.localize("MAGNUSARCHIVES.Intrusion.ManualTitle") },
    content: i,
    rejectClose: !1,
    ok: { label: game.i18n.localize("MAGNUSARCHIVES.Intrusion.Create") },
    render: (r, l) => {
      const u = l.element.querySelector('[name="mode"]'), d = l.element.querySelector('[data-intrusion-selection="single"]'), p = l.element.querySelector('[data-intrusion-selection="group"]'), y = () => {
        const m = u?.value === "group";
        d && (d.hidden = m), p && (p.hidden = !m);
      };
      u?.addEventListener("change", y), y();
    }
  });
  if (!a) return;
  const s = a.mode === "group" || a.mode === "free" ? a.mode : "targeted", o = s === "group" ? n.filter((r) => sf(a["group-" + r.id])).map((r) => r.id) : [String(a.targetActorId ?? "")];
  try {
    await ai().createManual({ mode: s, actorIds: o });
  } catch (r) {
    ui.notifications.error(r instanceof Error ? r.message : String(r));
  }
}
function Nn(n, e, t) {
  const i = t > dt, a = n.querySelector("[data-horror-summary]"), s = n.querySelector("[data-horror-explanation]"), o = n.querySelector("[data-horror-value]");
  n.dataset.horrorBand = Ro(t), n.style.setProperty("--magnusarchives-horror-fill", `${No(t)}%`), e.value = String(t), e.setAttribute("aria-valuetext", i ? `1–${t}` : "Natural 1"), o && (o.value = String(t)), a && (a.textContent = i ? game.i18n.format("MAGNUSARCHIVES.Horror.RangeSummary", { range: t }) : game.i18n.localize("MAGNUSARCHIVES.Horror.NormalSummary")), s && (s.textContent = i ? game.i18n.format("MAGNUSARCHIVES.Horror.Explanation", { range: t }) : game.i18n.localize("MAGNUSARCHIVES.Horror.NormalExplanation"));
}
async function rf() {
  if (!game.user.isGM) throw new Error(game.i18n.localize("MAGNUSARCHIVES.Horror.Errors.GMOnly"));
  const n = $n(), e = `<div class="magnusarchives magnusarchives-dialog magnusarchives-horror-dialog" data-horror-dialog data-horror-band="${Ro(n)}" style="--magnusarchives-horror-fill: ${No(n)}%">
    <header class="magnusarchives-dialog-heading">
      <span>${game.i18n.localize("MAGNUSARCHIVES.Horror.Title")}</span>
      <strong data-horror-summary></strong>
    </header>
    <section class="magnusarchives-dialog-section">
      <div class="horror-range-control">
        <input class="horror-range-input" id="magnusarchives-horror-intrusion-range" name="horrorIntrusionRange" type="range" min="${dt}" max="${ni}" step="1" value="${n}" aria-label="${game.i18n.localize("MAGNUSARCHIVES.Horror.RangeLabel")}">
        <output class="horror-range-value" data-horror-value for="magnusarchives-horror-intrusion-range">${n}</output>
      </div>
      <p class="magnusarchives-dialog-help" data-horror-explanation></p>
    </section>
  </div>`;
  await foundry.applications.api.DialogV2.input({
    window: { title: game.i18n.localize("MAGNUSARCHIVES.Horror.Title") },
    content: e,
    rejectClose: !1,
    ok: { label: game.i18n.localize("MAGNUSARCHIVES.Horror.Close") },
    render: (t, i) => {
      const a = i.element.querySelector("[data-horror-dialog]"), s = a?.querySelector("[name='horrorIntrusionRange']");
      !a || !s || (Nn(a, s, n), s.addEventListener("input", () => {
        Nn(a, s, Number(s.value));
      }), s.addEventListener("change", () => {
        Rc(Number(s.value)).catch((o) => {
          ui.notifications.error(o instanceof Error ? o.message : String(o)), Nn(a, s, $n());
        });
      }));
    }
  });
}
function lf() {
  Hooks.on("getSceneControlButtons", (n) => {
    const e = n.tokens;
    if (!e) return;
    const t = e.tools ?? (e.tools = {}), i = Object.keys(t).length;
    t.magnusarchivesGMIntrusion = {
      name: "magnusarchivesGMIntrusion",
      title: "MAGNUSARCHIVES.Intrusion.SceneControl",
      icon: "fa-solid fa-bolt",
      order: i,
      button: !0,
      visible: game.user.isGM,
      onChange: () => {
        of();
      }
    }, t.magnusarchivesHorrorMode = {
      name: "magnusarchivesHorrorMode",
      title: "MAGNUSARCHIVES.Horror.SceneControl",
      icon: "fa-solid fa-skull",
      order: i + 1,
      button: !0,
      visible: game.user.isGM,
      onChange: () => {
        rf();
      }
    };
  });
}
const Cr = `system.${U}`;
function zi(n) {
  return game.user.isGM || n.testUserPermission(game.user, CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER);
}
function _n(n) {
  (n.tokenId || n.tokenUuid) && ui.notifications.error(game.i18n.localize("MAGNUSARCHIVES.Combat.Errors.OriginalTokenMissing"));
}
function Er(n) {
  return {
    actorId: n.targetActorId,
    ...n.targetActorUuid ? { actorUuid: n.targetActorUuid } : {},
    ...n.targetTokenId ? { tokenId: n.targetTokenId } : {},
    ...n.targetTokenUuid ? { tokenUuid: n.targetTokenUuid } : {}
  };
}
function Ir(n) {
  return {
    actorId: n.targetActorId,
    ...n.targetActorUuid ? { actorUuid: n.targetActorUuid } : {},
    ...n.targetTokenId ? { tokenId: n.targetTokenId } : {},
    ...n.targetTokenUuid ? { tokenUuid: n.targetTokenUuid } : {}
  };
}
function cf(n) {
  return {
    actorId: n.sourceActorId,
    ...n.sourceActorUuid ? { actorUuid: n.sourceActorUuid } : {},
    ...n.sourceTokenId ? { tokenId: n.sourceTokenId } : {},
    ...n.sourceTokenUuid ? { tokenUuid: n.sourceTokenUuid } : {}
  };
}
function Rr(n) {
  const e = n.getFlag(U, "combatAction");
  if (!e || typeof e != "object") return null;
  const t = e;
  return t.kind !== "npcDamage" && t.kind !== "characterDamage" && t.kind !== "shieldWound" || typeof t.targetActorId != "string" || typeof t.applied != "boolean" ? null : e;
}
function Nr(n) {
  const e = n.getFlag(U, "defenseRequest");
  if (!e || typeof e != "object") return null;
  const t = e;
  return t.kind !== "defenseRequest" || typeof t.sourceActorId != "string" || typeof t.targetActorId != "string" ? null : e;
}
async function df(n, e) {
  const t = Rr(n);
  if (!t || t.applied) return;
  const i = Er(t), a = await Dn(i);
  if (!a) {
    _n(i);
    return;
  }
  if (!zi(a)) return;
  const s = Qt(a, i);
  e.disabled = !0;
  try {
    if (t.kind === "npcDamage")
      await game.magnusarchives.services.combat.applyNpcDamage(
        s,
        t.requestedDamage
      ), ui.notifications.info(game.i18n.localize("MAGNUSARCHIVES.Combat.DamageApplied"));
    else if (t.kind === "characterDamage")
      await game.magnusarchives.services.combat.applyCharacterDamage(
        s,
        t.effect,
        t.stressAmount
      ), ui.notifications.info(game.i18n.localize(t.effect === "stress" ? "MAGNUSARCHIVES.Combat.StressApplied" : "MAGNUSARCHIVES.Combat.SeriousInjuryApplied"));
    else {
      const o = a.items.get(t.shieldId);
      if (!o || o.type !== "shield") throw new Error("Resolved Shield Item not found.");
      const r = t.sourceActorId ? { id: t.sourceActorId, name: t.sourceName ?? "NPC" } : void 0;
      await game.magnusarchives.services.combat.applyShieldWound(
        s,
        o,
        t.severity,
        r
      ), ui.notifications.info(game.i18n.localize("MAGNUSARCHIVES.Combat.WoundApplied"));
    }
    await n.setFlag(U, "combatAction", { ...t, applied: !0 }), e.textContent = game.i18n.localize("MAGNUSARCHIVES.Combat.Applied");
  } catch (o) {
    e.disabled = !1, ui.notifications.error(o instanceof Error ? o.message : String(o));
  }
}
async function uf(n, e, t, i) {
  if (e.resolved || !e.allowedDefenses.includes(t)) return;
  const a = Ir(e), s = cf(e), o = await Dn(a), r = await Dn(s);
  if (!o || !r) {
    o || _n(a), r || _n(s);
    return;
  }
  if (!zi(o)) return;
  if (i.disabled = !0, !await Fn(
    Qt(o, a),
    t,
    {
      source: Qt(r, s),
      effect: e.effect,
      stressAmount: e.stressAmount
    }
  )) {
    i.disabled = !1;
    return;
  }
  game.socket.emit(Cr, { type: "resolveDefenseRequest", messageId: n.id }), game.user.isGM && await n.setFlag(U, "defenseRequest", { ...e, resolved: !0 });
}
function mf(n, e) {
  const t = Rr(n), i = e.querySelector("[data-action='applyCombatOutcome']");
  if (i) {
    const r = t ? Vn(Er(t)) : null;
    !t || !r || !zi(r) ? i.remove() : t.applied ? (i.disabled = !0, i.textContent = game.i18n.localize("MAGNUSARCHIVES.Combat.Applied")) : i.addEventListener("click", () => {
      df(n, i);
    }, { once: !0 });
  }
  const a = Nr(n), s = [...e.querySelectorAll("[data-action='rollRequestedDefense']")];
  if (s.length === 0) return;
  const o = a ? Vn(Ir(a)) : null;
  if (!a || !o || !zi(o) || a.resolved) {
    for (const r of s) r.remove();
    return;
  }
  for (const r of s) {
    const l = r.dataset.defense;
    if (!Ls.includes(l)) {
      r.remove();
      continue;
    }
    r.addEventListener(
      "click",
      () => {
        uf(n, a, l, r);
      },
      { once: !0 }
    );
  }
}
function pf() {
  Hooks.on("renderChatMessageHTML", (n, e) => {
    mf(n, e);
  }), game.socket.on(Cr, (n) => {
    if (!game.user.isGM || n.type !== "resolveDefenseRequest") return;
    const e = game.messages.get(n.messageId);
    if (!e) return;
    const t = Nr(e);
    !t || t.resolved || e.setFlag(U, "defenseRequest", { ...t, resolved: !0 });
  });
}
function ff(n) {
  return n.actor ? n.actor.testUserPermission(game.user, CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER) : game.user.isGM;
}
function gf() {
  Hooks.on("renderChatMessageHTML", (n, e) => {
    for (const t of e.querySelectorAll("[data-action='rollItemCardDepletion']"))
      t.addEventListener("click", async (i) => {
        i.preventDefault(), i.stopPropagation();
        const a = t.dataset.itemUuid, s = a ? await fromUuid(a) : null;
        if (!s || s.type !== "artifact" || !ff(s)) {
          ui.notifications.warn(game.i18n.localize("MAGNUSARCHIVES.Inventory.NotAuthorized"));
          return;
        }
        t.disabled = !0, await Di(s), t.disabled = s.system.depleted === !0;
      });
  });
}
async function hf() {
  if (!game.user.isGM) return;
  const n = [...game.items].filter((e) => e.type === "genre");
  if (n.length)
    for (const e of game.actors)
      try {
        if (e.type !== "character") continue;
        const t = e, i = [...e.items].find((s) => s.type === "characterType");
        if (!i || t.system.genre.sourceUuid) continue;
        const a = await Jo(
          i.system,
          n,
          async (s) => await fromUuid(s)
        );
        if (!a) continue;
        await game.magnusarchives.services.genres.attach(t, a, "migration");
      } catch (t) {
        console.warn("magnusarchives | Could not migrate a legacy Type Genre suggestion", e.uuid, t);
      }
}
class yf {
  #e = /* @__PURE__ */ new Set();
  constructor(e = []) {
    for (const t of e) this.#e.add(t.id);
  }
  mark(e, t) {
    const i = t.querySelector(".magnusarchives-roll-card[data-magnusarchives-entrance]");
    return !i || this.#e.has(e.id) ? !1 : (this.#e.add(e.id), i.classList.add("magnusarchives-chat-card-enter"), !0);
  }
}
function Sf() {
  const n = new yf(game.messages);
  return Hooks.on("renderChatMessageHTML", (e, t) => {
    n.mark(e, t);
  }), n;
}
const Pi = "doneThisRound";
function Mr(n, e) {
  return !!(e && (n.isGM || e.testUserPermission(n, "OWNER")));
}
function Af(n, e) {
  return e > 0 && n?.getFlag(U, Pi) === e;
}
async function bf(n, e, t) {
  if (!n.started) return { ok: !1, reason: "not-started" };
  if (!n.turns.length) return { ok: !1, reason: "empty" };
  const i = n.combatant;
  return n.turn === null || !i ? { ok: !1, reason: "no-current" } : i.id !== t ? { ok: !1, reason: "stale" } : Mr(e, i) ? (await i.setFlag(U, Pi, n.round), await n.nextTurn(), { ok: !0 }) : { ok: !1, reason: "not-authorized" };
}
async function wf(n) {
  const e = Array.from(n.combatants).filter((t) => t.getFlag(U, Pi) !== void 0).map((t) => ({
    _id: t.id,
    [`flags.${U}.-=${Pi}`]: null
  }));
  e.length && await n.updateEmbeddedDocuments("Combatant", e, { turnEvents: !1 });
}
function vf(n, e, t, i) {
  if (!n.includes(e)) return [...n];
  const a = n.filter((o) => o !== e);
  if (!t) return [...a, e];
  const s = a.indexOf(t);
  return s < 0 ? [...n] : (a.splice(s + (i ? 1 : 0), 0, e), a);
}
function Cf(n) {
  return n.map((e, t) => ({
    _id: e,
    initiative: (n.length - t) * 10
  }));
}
const Ef = foundry.applications.sidebar.tabs.CombatTracker, xs = "application/x-magnusarchives-combatant";
function Mn(n) {
  return n?.dataset.combatantId ?? null;
}
class Ia extends Ef {
  static DEFAULT_OPTIONS = {
    classes: ["magnusarchives-combat-tracker"],
    actions: {
      endCypherTurn: Ia.#e
    }
  };
  static PARTS = {
    header: {
      template: "systems/magnusarchives/templates/sidebar/combat-tracker-header.hbs"
    },
    tracker: {
      template: "systems/magnusarchives/templates/sidebar/combat-tracker.hbs",
      scrollable: [""]
    },
    footer: {
      template: "templates/sidebar/tabs/combat/footer.hbs"
    }
  };
  static async #e(e, t) {
    const i = this.viewed, a = Mn(t.closest("[data-combatant-id]"));
    if (!i || !a) {
      ui.notifications.warn(game.i18n.localize("MAGNUSARCHIVES.CombatTracker.Errors.NoCombat"));
      return;
    }
    t.setAttribute("disabled", "");
    try {
      const s = await bf(i, game.user, a);
      s.ok || ui.notifications.warn(game.i18n.localize(`MAGNUSARCHIVES.CombatTracker.Errors.${s.reason}`));
    } finally {
      t.removeAttribute("disabled");
    }
  }
  async _prepareTrackerContext(e, t) {
    await super._prepareTrackerContext(e, t), e.manualOrderEditable = game.user.isGM;
    const i = this.viewed;
    for (const a of e.turns ?? []) {
      const s = i?.combatants.get(a.id);
      a.doneThisRound = Af(s, i?.round ?? 0), a.canEndTurn = !!(i?.started && a.active && !a.doneThisRound && Mr(game.user, s));
    }
  }
  async _onRender(e, t) {
    if (await super._onRender(e, t), !game.user.isGM) return;
    const i = this.element.querySelector(".combat-tracker");
    if (!(!i || i.dataset.magnusarchivesOrderBound === "true")) {
      i.dataset.magnusarchivesOrderBound = "true", i.addEventListener("dragover", this.#i), i.addEventListener("drop", this.#n.bind(this)), i.addEventListener("dragend", this.#a.bind(this));
      for (const a of i.querySelectorAll(".combatant[data-combatant-id]"))
        a.addEventListener("dragstart", this.#t.bind(this));
    }
  }
  _getEntryContextOptions() {
    return super._getEntryContextOptions().filter((e) => e.label !== "COMBATANT.ACTIONS.Clear" && e.label !== "COMBATANT.ACTIONS.Reroll");
  }
  _getCombatContextOptions() {
    return super._getCombatContextOptions().filter((e) => e.label !== "COMBAT.InitiativeReset");
  }
  #t(e) {
    if (!game.user.isGM || !e.dataTransfer) return;
    const t = e.currentTarget?.closest("[data-combatant-id]") ?? null, i = Mn(t);
    i && (e.dataTransfer.effectAllowed = "move", e.dataTransfer.setData(xs, i), e.dataTransfer.setData("text/plain", i), t?.classList.add("magnusarchives-combatant-dragging"));
  }
  #i(e) {
    !game.user.isGM || !e.dataTransfer || (e.preventDefault(), e.dataTransfer.dropEffect = "move");
  }
  async #n(e) {
    if (e.preventDefault(), !game.user.isGM || !e.dataTransfer) return;
    const t = this.viewed, i = e.dataTransfer.getData(xs) || e.dataTransfer.getData("text/plain");
    if (!t || !i || !t.combatants.get(i)) return;
    const a = e.target?.closest(".combatant[data-combatant-id]") ?? null, s = Mn(a), o = a?.getBoundingClientRect(), r = !!(o && e.clientY > o.top + o.height / 2), l = t.turns.map((y) => y.id), u = vf(l, i, s, r);
    if (u.every((y, m) => y === l[m])) {
      this.#a();
      return;
    }
    const d = t.combatant?.id, p = d ? u.indexOf(d) : void 0;
    await t.updateEmbeddedDocuments(
      "Combatant",
      Cf(u),
      {
        ...p === void 0 || p < 0 ? {} : { combatTurn: p },
        turnEvents: !1
      }
    ), this.#a();
  }
  #a() {
    this.element.querySelectorAll(".magnusarchives-combatant-dragging").forEach((e) => {
      e.classList.remove("magnusarchives-combatant-dragging");
    });
  }
}
function If() {
  CONFIG.ui.combat = Ia;
}
function Rf() {
  Hooks.on("updateCombat", (n, e) => {
    !("round" in e) || !game.user.isActiveGM || wf(n).catch((t) => {
      console.error("magnusarchives | Failed to reset Combat Tracker DONE states", t);
    });
  });
}
const Nf = CONFIG.ui.pause;
class Mf extends Nf {
  static DEFAULT_OPTIONS = {
    classes: ["magnusarchives-game-pause"]
  };
  async _prepareContext(e) {
    return {
      ...await super._prepareContext(e),
      icon: sa.gamePaused,
      spin: !1
    };
  }
}
function Gf() {
  CONFIG.ui.pause = Mf;
}
function Uf() {
  CONFIG.Combat.fallbackTurnMarker = sa.turnMarker;
}
const kf = "--magnusarchives-blank-canvas-background-image";
function Hf(n) {
  return `url("${n.replaceAll("\\", "\\\\").replaceAll('"', '\\"').replace(/[\n\r\f;]/g, "")}")`;
}
function $f(n = document.body, e = (t) => foundry.utils.getRoute(t)) {
  const t = So(sa.lobby, e);
  n.style.setProperty(kf, Hf(t));
}
const Gr = ["system.options.totalEffortCapMode"];
function Vf(n = CONFIG.Item.compendiumIndexFields) {
  for (const e of Gr)
    n.includes(e) || n.push(e);
}
function qs(n) {
  const e = n.split(".");
  return e.length >= 5 && e[0] === "Compendium" && e[3] === "Item" ? `${e[1]}.${e[2]}` : null;
}
async function Df(n = game.actors, e = game.packs, t = (i, a) => console.warn(i, a)) {
  const i = [...n].filter((s) => s.type === "character" && qs(s.system.genre.sourceUuid) !== null), a = new Set(i.map((s) => qs(s.system.genre.sourceUuid)));
  for (const s of a)
    try {
      await e.get(s)?.getIndex({ fields: [...Gr] });
    } catch (o) {
      t(`magnusarchives | Could not enrich Genre Compendium index ${s}`, o);
    }
  for (const s of i) s.reset();
}
Hooks.once("init", async () => {
  console.info(`${U} | Initializing`);
  const n = new Pm();
  Dm(n);
  const e = new af();
  e.register(nf), Vf(), game.magnusarchives = Br(n, tf(n), e), Cc(), fc(), Gm(), If(), Gf(), Uf(), lf(), Hooks.callAll("magnusarchives.registerRules", n), Hooks.callAll("magnusarchives.registerThemes", e), Ic(e), await foundry.applications.handlebars.loadTemplates([
    "systems/magnusarchives/templates/focus/focus-tree.hbs"
  ]);
});
Hooks.once("ready", async () => {
  $f();
  const n = String(game.settings.get(U, B.theme));
  game.magnusarchives.themes.apply(game.magnusarchives.themes.has(n) ? n : "core"), ed(
    game.magnusarchives.services.intrusions,
    game.magnusarchives.services.intrusionChat
  ), im(
    game.magnusarchives.services.playerIntrusions,
    game.magnusarchives.services.playerIntrusionChat
  ), pf(), gf(), Sf(), Ip(game.magnusarchives.services.combatStatuses), Rf(), await Df(), await hf(), console.info(`${U} | Ready`);
});
//# sourceMappingURL=magnusarchives.mjs.map
