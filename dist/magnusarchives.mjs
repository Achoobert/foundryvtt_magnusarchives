const G = "magnusarchives", Gr = "0.1.0";
const te = [
  "inability",
  "untrained",
  "trained",
  "specialized",
  "expert"
], Os = ["choose", "might", "speed", "intellect"], Oe = ["light", "medium", "heavy"], Bs = ["melee", "ranged"], Nn = ["immediate", "short", "long", "very-long", "specified"], Be = ["light", "medium", "heavy"], Ls = ["block", "blockWithShield", "dodge"], kr = ["d6", "d10", "d20"], Wn = ["subtle", "manifest"], _n = ["low", "medium", "advanced", "high", "ultra"], fe = ["minor", "moderate", "major"], qt = ["hale", "hurt", "impaired", "debilitated", "dead"], zi = ["none", "stress", "seriousInjury"];
const Mn = [
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
], Ia = ["none", "might", "speed", "intellect", "choose"], Ws = ["none", "task", "attack", "defense"], _s = ["none", "single", "multiple"], Ue = ["one-action", "10-minutes", "1-hour", "10-hours"], Hr = ["normal", "nonRest"], $r = ["10-minutes", "1-hour", "10-hours"];
function Vr(n, e, t) {
  return Object.freeze({
    version: Gr,
    rules: n,
    services: e,
    themes: t
  });
}
const Dr = qt.filter(
  (n) => n !== "hurt"
);
function Qt(n) {
  return n ? qt : Dr;
}
function Ui(n) {
  return Math.floor(Math.max(0, n) / 3);
}
function Ks(n) {
  const e = Math.max(0, n) % 3;
  return e === 0 ? 3 : 3 - e;
}
function Xs(n, e) {
  return Math.max(0, Math.max(0, n) - Math.max(0, Math.floor(e)) * 3);
}
function vt(n, e) {
  return Qt(e).includes(n) ? n : "hale";
}
function Fr(n, e, t = 1) {
  const i = Qt(e), a = i.indexOf(vt(n, e)), s = Math.min(i.length - 1, a + Math.max(0, t));
  return i[s] ?? "dead";
}
function Tr(n, e, t = 1) {
  const i = Qt(e), a = i.indexOf(vt(n, e)), s = Math.max(0, a - Math.max(0, t));
  return i[s] ?? "hale";
}
const zr = Object.freeze({
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
}), Pr = Object.freeze({
  ...Js,
  dead: !0
});
function xr(n) {
  switch (n) {
    case "impaired":
      return Ys;
    case "debilitated":
      return Js;
    case "dead":
      return Pr;
    default:
      return zr;
  }
}
const k = ["might", "speed", "intellect"], Zt = {
  "one-action": "oneAction",
  "10-minutes": "tenMinutes",
  "1-hour": "oneHour",
  "10-hours": "tenHours"
};
function Ct(n = !1) {
  return { oneAction: n, tenMinutes: n, oneHour: n, tenHours: n };
}
function Qs(n) {
  return Ue.filter((e) => !n[Zt[e]]);
}
let Ra = 0;
const je = () => {
  const n = globalThis.crypto?.randomUUID;
  return n ? n.call(globalThis.crypto) : (Ra += 1, `magnusarchives-${Date.now()}-${Ra}`);
};
function L(n) {
  if (n.type !== "character") throw new Error("Core Character services require a Character Actor.");
}
function Pe(n) {
  if (L(n), n.system.derived.damageTrack.dead) throw new Error("A dead Character cannot use this service.");
}
function gt(n) {
  return {
    minor: n.minor.map((e) => ({ ...e })),
    moderate: n.moderate.map((e) => ({ ...e })),
    major: n.major.map((e) => ({ ...e }))
  };
}
const Yi = [
  "tier",
  "effort",
  "mightMax",
  "mightEdge",
  "speedMax",
  "speedEdge",
  "intellectMax",
  "intellectEdge"
];
function qr() {
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
function ht(n, e) {
  return Number.isInteger(e) ? Number(e) : n;
}
function Kn(n) {
  return n.startsWith("might") ? "might" : n.startsWith("speed") ? "speed" : n.startsWith("intellect") ? "intellect" : null;
}
function bt(n) {
  return n === "tier" || n === "effort" ? `system.overrides.${n}` : `system.overrides.stats.${Kn(n)}.${n.endsWith("Max") ? "max" : "edge"}`;
}
function di(n, e, t) {
  if (!Number.isFinite(t)) throw new Error("Character progression delta must be finite.");
  if (e === "tier") {
    const l = Number.isInteger(n.overrides?.tier);
    return {
      path: l ? bt(e) : "system.tier",
      value: (l ? Number(n.overrides.tier) : n.tier) + t,
      overrideActive: l
    };
  }
  if (e === "effort") {
    const l = Number.isInteger(n.overrides?.effort);
    return {
      path: l ? bt(e) : "system.stats.effortBase",
      value: (l ? Number(n.overrides.effort) : n.stats.effortBase) + t,
      overrideActive: l
    };
  }
  const i = Kn(e), a = e.endsWith("Max") ? "max" : "edge", s = n.overrides?.stats?.[i]?.[a], o = Number.isInteger(s), r = a === "max" ? n.stats[i].baseMax : n.stats[i].baseEdge;
  return {
    path: o ? bt(e) : `system.stats.${i}.${a === "max" ? "baseMax" : "baseEdge"}`,
    value: (o ? Number(s) : r) + t,
    overrideActive: o
  };
}
function B(n) {
  return n.derived?.tier?.value ?? ht(n.tier, n.overrides?.tier);
}
function Un(n, e) {
  if (e === "tier") return {
    key: e,
    path: bt(e),
    calculated: n.derived.tier.calculated,
    override: n.overrides?.tier ?? null,
    effective: n.derived.tier.value,
    minimum: 1
  };
  if (e === "effort") return {
    key: e,
    path: bt(e),
    calculated: n.derived.effort.calculatedMax,
    override: n.overrides?.effort ?? null,
    effective: n.derived.effort.max,
    minimum: 0
  };
  const t = Kn(e), i = e.endsWith("Max") ? "max" : "edge", a = n.derived.pools[t];
  return {
    key: e,
    path: bt(e),
    calculated: i === "max" ? a.calculatedMax : a.calculatedEdge,
    override: n.overrides?.stats?.[t]?.[i] ?? null,
    effective: a[i],
    minimum: i === "max" ? 1 : -20
  };
}
const Or = [
  { id: "core-recovery-action", type: "one-action" },
  { id: "core-recovery-ten-minutes", type: "10-minutes" },
  { id: "core-recovery-one-hour", type: "1-hour" },
  { id: "core-recovery-ten-hours", type: "10-hours" }
];
function ot(n = Ct(!1)) {
  return Or.map((e) => ({
    ...e,
    used: n[Zt[e.type]]
  }));
}
function Br(n, e = Ct(!1)) {
  if (!Array.isArray(n) || n.length === 0) return ot(e);
  const t = /* @__PURE__ */ new Set(), i = [];
  for (const a of n) {
    if (!a || typeof a != "object") continue;
    const s = a, o = typeof s.id == "string" ? s.id.trim() : "", r = String(s.type ?? "");
    !o || t.has(o) || !Ue.includes(r) || (t.add(o), i.push({ id: o, type: r, used: s.used === !0 }));
  }
  return i.length > 0 ? i : ot(e);
}
function Et(n) {
  const e = Ct(!1);
  for (const t of Ue) {
    const i = n.filter((a) => a.type === t);
    e[Zt[t]] = i.length > 0 && i.every((a) => a.used);
  }
  return e;
}
function Ot(n) {
  return n.filter((e) => !e.used).map((e) => ({ ...e }));
}
function Na(n, e, t) {
  const i = n.find((a) => a.id === e && a.type === t);
  if (!i) throw new Error(`Recovery slot '${e}' is not available for '${t}'.`);
  if (i.used) throw new Error(`Recovery slot '${e}' has already been used today.`);
  return t === "10-hours" ? n.map((a) => ({ ...a, used: !1 })) : n.map((a) => a.id === e ? { ...a, used: !0 } : { ...a });
}
function Lr(n) {
  const e = Ct(!1);
  for (const t of Ue)
    e[Zt[t]] = n.some((i) => i.type === t && i.used);
  return ot(e);
}
const jr = Object.freeze({
  stressPoints: 0,
  damageTrackStep: "hale",
  hurtAvailable: !1
}), Ji = Object.freeze({
  light: 1,
  medium: 2,
  heavy: 3
});
function Ae(n) {
  return n.reduce((e, t) => e + t.value, 0);
}
function be(n, e, t, i, a) {
  return { id: n, sourceId: e, sourceType: t, label: i, value: a };
}
function Wr(n, e, t, i = {}, a = [], s = { armorCategories: [], freelyUse: [] }, o = 0, r = {
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
}, l = 2, u = 1, c = qr(), p = 0, y = [], m = jr) {
  const f = {};
  for (const N of k) {
    const S = [
      be(
        `pool.${N}.max.base`,
        `system.stats.${N}.baseMax`,
        "base",
        `${N} base maximum`,
        n[N].baseMax
      ),
      ...i.poolMax?.[N] ?? []
    ], Y = [
      be(
        `pool.${N}.edge.base`,
        `system.stats.${N}.baseEdge`,
        "base",
        `${N} base Edge`,
        n[N].baseEdge
      ),
      ...i.poolEdge?.[N] ?? []
    ], We = Ae(S), li = Ae(Y);
    f[N] = {
      calculatedMax: We,
      calculatedEdge: li,
      max: ht(We, c.stats?.[N]?.max),
      edge: ht(li, c.stats?.[N]?.edge),
      maxContributions: S,
      edgeContributions: Y
    };
  }
  const g = [
    be(
      "effort.max.base",
      "system.stats.effortBase",
      "base",
      "Base Effort",
      n.effortBase ?? 0
    ),
    ...i.effortMax ?? []
  ], A = Math.max(0, Ae(g)), v = [
    be(
      "recovery.bonus.base",
      "system.recovery.bonus",
      "base",
      "Permanent Recovery bonus",
      o
    ),
    ...i.recoveryBonus ?? []
  ], E = Ae(v), H = [
    be("cypher-limit.base", "system.cypherLimitBase", "base", "Base Cypher Limit", l),
    ...i.cypherLimit ?? []
  ], R = {}, U = {}, z = {};
  for (const N of fe) {
    const S = [
      be(
        `wound.${N}.capacity.core`,
        "magnusarchives.core",
        "core",
        `${N} Wound capacity`,
        3
      ),
      ...i.woundCapacity?.[N] ?? []
    ], Y = Math.max(1, Ae(S)), We = c.wounds?.[N] ?? 0;
    U[N] = Y, R[N] = We === 0 ? S : [...S, be(
      `wound.${N}.capacity.manual`,
      `system.overrides.wounds.${N}`,
      "base",
      `Manual ${N} Wound capacity modifier`,
      We
    )], z[N] = Math.max(1, Y + We);
  }
  const K = [];
  e.moderate.length >= z.moderate && K.push(
    be(
      "wound.moderate.full.hindrance",
      "magnusarchives.core",
      "core",
      "Moderate Wounds full",
      1
    )
  );
  for (const N of e.major)
    K.push(
      be(
        `wound.major.${N.id}.hindrance`,
        N.id,
        "wound",
        N.label || "Major Wound",
        1
      )
    );
  const M = Math.max(0, m.stressPoints), V = Ui(M);
  V > 0 && K.push(
    be(
      "stress.level.hindrance",
      "magnusarchives.core",
      "stress",
      `Stress Level ${V}`,
      V
    )
  ), K.push(...i.hindrance ?? []);
  const ie = [...a].filter((N) => N.type === "armor" && N.system.equipped).some((N) => N.system.grantsHurtStep !== !1), W = m.hurtAvailable || ie || (i.hurtStep?.length ?? 0) > 0, Ge = vt(m.damageTrackStep, W), q = xr(Ge), J = [...a].filter((N) => N.type === "armor" && N.system.equipped).filter((N) => Be.includes(N.system.category)).sort((N, S) => Ji[S.system.category] - Ji[N.system.category] || N.id.localeCompare(S.id))[0], ke = J?.system.category ?? "none", ye = J ? Ji[J.system.category] : 0, Ce = J ? s.armorCategories.includes(J.system.category) : !0, re = (N, S, Y) => J && Y > 0 ? [be(
    `armor.${J.id}.${N}`,
    J.id,
    "item",
    S,
    Y
  )] : [], Q = re("block", "Armor: Block", ye), Se = re("dodge", "Armor: Dodge", ye), me = re(
    "speed-task",
    "Armor: Speed task",
    Math.max(J?.system.speedTaskHindrance ?? 0, Ce ? 0 : ye)
  );
  return {
    tier: {
      calculated: u,
      value: ht(u, c.tier)
    },
    pools: f,
    effort: {
      calculatedMax: A,
      max: Math.max(0, ht(A, c.effort)),
      contributions: g
    },
    stress: {
      value: M,
      level: V,
      toNextLevel: Ks(M),
      hindrance: V
    },
    damageTrack: {
      step: Ge,
      hurtAvailable: W,
      steps: [...Qt(W)],
      effortSurcharge: q.effortSurcharge,
      ignoresSpecialEffects: q.ignoresSpecialEffects,
      reducedSpecialDamage: q.reducedSpecialDamage,
      moveOnly: q.moveOnly,
      dead: q.dead
    },
    totalHindrance: Ae(K),
    wounds: {
      calculatedCapacities: U,
      capacities: z,
      capacityContributions: R,
      hindrance: Ae(K),
      hindranceContributions: K,
      dead: e.major.length >= z.major
    },
    recovery: {
      formula: Ma(E + p),
      calculatedFormula: Ma(E),
      calculatedBonus: E,
      manualModifier: p,
      bonus: E + p,
      bonusContributions: v,
      availableTypes: y.length > 0 ? [...new Set(Ot(y).map((N) => N.type))] : Qs(t)
    },
    cypherLimit: { max: Math.max(0, Ae(H)), contributions: H },
    combat: {
      armor: {
        itemId: J?.id ?? "",
        category: ke,
        freelyUsed: Ce,
        blockEase: Ae(Q),
        dodgeHindrance: Ae(Se),
        speedTaskHindrance: Ae(me),
        blockContributions: Q,
        dodgeContributions: Se,
        speedTaskContributions: me
      }
    },
    packages: r
  };
}
function Ma(n) {
  return n === 0 ? "1d6 + Tier" : `1d6 + Tier ${n > 0 ? "+" : "-"} ${Math.abs(n)}`;
}
const {
  ArrayField: Xn,
  BooleanField: Pi,
  HTMLField: Zs,
  NumberField: It,
  ObjectField: _r,
  SchemaField: Ut,
  StringField: ge
} = foundry.data.fields, d = {
  ArrayField: Xn,
  BooleanField: Pi,
  HTMLField: Zs,
  NumberField: It,
  ObjectField: _r,
  SchemaField: Ut,
  StringField: ge
};
function w(n = 0, e = 0) {
  return new It({ required: !0, nullable: !1, integer: !0, min: e, initial: n });
}
function Z(n = []) {
  return new Xn(
    new ge({ required: !0, nullable: !1, blank: !1 }),
    { required: !0, nullable: !1, initial: [...n] }
  );
}
function Qi(n = 10) {
  return new Ut({
    value: w(n),
    baseMax: w(n, 1),
    baseEdge: w(0, -20),
    max: new It({
      required: !0,
      nullable: !1,
      integer: !0,
      min: 1,
      initial: n,
      persisted: !1
    }),
    edge: new It({
      required: !0,
      nullable: !1,
      integer: !0,
      min: -20,
      initial: 0,
      persisted: !1
    })
  });
}
function wt() {
  return new Ut({
    id: new ge({ required: !0, nullable: !1, blank: !1 }),
    label: new ge({ required: !0, nullable: !1, initial: "" }),
    description: new Zs({ required: !0, nullable: !1, initial: "" }),
    sourceUuid: new ge({ required: !0, nullable: !1, initial: "" }),
    treated: new Pi({ required: !0, nullable: !1, initial: !1 })
  });
}
function Kr() {
  return new Ut({
    id: new ge({ required: !0, nullable: !1, blank: !1 }),
    sourceId: new ge({ required: !0, nullable: !1, blank: !1 }),
    sourceType: new ge({
      required: !0,
      nullable: !1,
      choices: ["base", "core", "rule-module", "wound", "item"]
    }),
    label: new ge({ required: !0, nullable: !1, initial: "" }),
    value: new It({ required: !0, nullable: !1, integer: !0, initial: 0 })
  });
}
function pe() {
  return new Xn(Kr(), {
    required: !0,
    nullable: !1,
    initial: [],
    persisted: !1
  });
}
function Xr() {
  return new Ut({
    enabled: new Pi({ required: !0, nullable: !1, initial: !1 }),
    trigger: new ge({
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
function xi(n = "") {
  return new Ut({
    enabled: new Pi({ required: !0, nullable: !1, initial: !1 }),
    die: new ge({
      required: !0,
      nullable: !1,
      initial: "d6",
      validate: (e) => /^d(?:[2-9]|[1-9]\d{1,2}|1000)$/i.test(e)
    }),
    formula: new ge({ required: !0, nullable: !1, initial: n }),
    threshold: new It({
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
      description: new d.HTMLField({ required: !0, nullable: !1, initial: "" }),
      notes: new d.HTMLField({ required: !0, nullable: !1, initial: "" }),
      gmNotes: new d.HTMLField({ required: !0, nullable: !1, initial: "" })
    };
  }
}
const Yn = [
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
], Yr = [...Yn, "other"], io = [
  "characterCreation",
  "additionalFocus",
  "otherAdvancement",
  "newTier"
], Jr = ["otherAdvancement", "newTier"], no = Object.freeze({
  xpCost: 4,
  purchasesPerTier: 4,
  capabilityPoints: 4,
  effortMaximum: 6,
  recoveryBonus: 2,
  genreChoiceForTier: (n) => n >= 3 && n % 3 === 0,
  attackDefenseTrainingTier: 2,
  attackDefenseSpecializationTier: 4
}), ao = ["axes", "knives", "swords"];
function rt(n) {
  const e = String(n ?? "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").trim().toLocaleLowerCase("en-US").replace(/[^\p{Letter}\p{Number}]+/gu, "-").replace(/^-+|-+$/g, "");
  return e === "none" ? "" : e;
}
function oe(n) {
  const e = Array.isArray(n) ? n : typeof n == "string" ? n.split(/[,;\n]/) : [];
  return [...new Set(e.map(rt).filter(Boolean))];
}
function yt(n) {
  return rt(n).split("-").filter(Boolean).map((e) => `${e[0]?.toLocaleUpperCase("en-US") ?? ""}${e.slice(1)}`).join(" ");
}
function qi(n) {
  return !n || typeof n != "object" || Array.isArray(n) ? [] : oe(Object.entries(n).filter(([, e]) => e === !0).map(([e]) => e));
}
const Qr = [
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
function Zr(n) {
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
function Ua(n, e) {
  const t = oo(n);
  return t.length > 0 ? t : Zr(e);
}
function el(n) {
  return n.filter((e) => e.type === "characterType").reduce((e, t) => {
    const i = Number(t.system.superhero?.powerShiftCount ?? 0);
    return e + (Number.isInteger(i) && i > 0 ? i : 0);
  }, 0);
}
function tl(n, e) {
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
function il(n, e, t = je) {
  const i = e.id?.trim() || t(), a = so({ ...e, id: i });
  if (!a) throw new Error("A Power Shift requires a category and a positive whole-number value.");
  const s = n.findIndex((o) => o.id === i);
  return s < 0 ? [...n, a] : n.map((o, r) => r === s ? a : o);
}
function nl(n, e) {
  return n.filter((t) => t.id !== e);
}
function mi(n, e) {
  return Number.isInteger(n) && Number(n) >= e ? Number(n) : null;
}
function Ga(n, e = !1) {
  const t = {}, i = n.stats && typeof n.stats == "object" ? n.stats : {}, a = (s) => {
    const o = i[s] && typeof i[s] == "object" ? i[s] : {}, r = {};
    return (!e || F(o, "max")) && (r.max = mi(o.max, 1)), (!e || F(o, "edge")) && (r.edge = mi(o.edge, -20)), r;
  };
  if ((!e || F(n, "tier")) && (t.tier = mi(n.tier, 1)), (!e || F(n, "effort")) && (t.effort = mi(n.effort, 0)), !e || F(n, "stats")) {
    const s = {};
    for (const o of ["might", "speed", "intellect"])
      (!e || F(i, o)) && (s[o] = a(o));
    t.stats = s;
  }
  if (!e || F(n, "wounds")) {
    const s = n.wounds && typeof n.wounds == "object" ? n.wounds : {}, o = {};
    for (const r of ["minor", "moderate", "major"])
      (!e || F(s, r)) && (o[r] = Number.isInteger(s[r]) ? Number(s[r]) : 0);
    t.wounds = o;
  }
  return t;
}
function F(n, e) {
  return Object.prototype.hasOwnProperty.call(n, e);
}
function al(n, e) {
  const t = { ...n };
  return (!e || F(n, "cycle")) && (t.cycle = Number.isInteger(n.cycle) ? n.cycle : 1), (!e || F(n, "purchases")) && (t.purchases = Array.isArray(n.purchases) ? n.purchases : []), (!e || F(n, "initializedFocusUuids")) && (t.initializedFocusUuids = Array.isArray(n.initializedFocusUuids) ? n.initializedFocusUuids : []), (!e || F(n, "pendingFocusChoices")) && (t.pendingFocusChoices = Array.isArray(n.pendingFocusChoices) ? n.pendingFocusChoices : []), (!e || F(n, "pendingGenreChoices")) && (t.pendingGenreChoices = Array.isArray(n.pendingGenreChoices) ? n.pendingGenreChoices : []), (!e || F(n, "guidanceCompletedTiers")) && (t.guidanceCompletedTiers = Array.isArray(n.guidanceCompletedTiers) ? [...new Set(n.guidanceCompletedTiers.filter((i) => Number.isInteger(i) && Number(i) >= 1).map(Number))].sort((i, a) => i - a) : []), (!e || F(n, "notes")) && (t.notes = typeof n.notes == "string" ? n.notes : ""), t;
}
function sl(n, e) {
  const t = { ...n };
  if ((!e || F(n, "coreInitialized")) && (t.coreInitialized = n.coreInitialized === !0), !e || F(n, "mode")) {
    const i = n.mode === "setup" ? "completed" : String(n.mode);
    t.mode = ["completed", "skipped", "manual"].includes(i) ? i : "uninitialized";
  }
  return (!e || F(n, "initializedAt")) && (t.initializedAt = Number.isInteger(n.initializedAt) ? n.initializedAt : 0), t;
}
function ka(n, e) {
  const t = {};
  if (!e || F(n, "backgroundMode")) {
    const i = String(n.backgroundMode ?? "theme");
    t.backgroundMode = ["theme", "portrait", "custom"].includes(i) ? i : "theme";
  }
  if ((!e || F(n, "customImage")) && (t.customImage = typeof n.customImage == "string" ? n.customImage : ""), !e || F(n, "color")) {
    const i = typeof n.color == "string" ? n.color.trim() : "";
    t.color = /^#(?:[\da-f]{3}|[\da-f]{6})$/i.test(i) ? i.toLocaleLowerCase("en-US") : "";
  }
  return t;
}
function ol(n, e = {}) {
  const t = e.partial === !0;
  if (t ? n.overrides && typeof n.overrides == "object" && (n.overrides = Ga(n.overrides, !0)) : n.overrides = Ga(
    n.overrides && typeof n.overrides == "object" ? n.overrides : {}
  ), !t && (!n.genre || typeof n.genre != "object") && (n.genre = { sourceUuid: "", instanceId: "", provenance: "manual", attachedAt: 0 }), t ? n.appearance && typeof n.appearance == "object" && (n.appearance = ka(n.appearance, !0)) : n.appearance = ka(
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
  })), n.advancement && typeof n.advancement == "object" && (n.advancement = al(n.advancement, t)), !t || n.recovery && typeof n.recovery == "object") {
    const i = n.recovery && typeof n.recovery == "object" ? n.recovery : {}, a = i.used && typeof i.used == "object" ? { ...Ct(!1), ...i.used } : Ct(!1), s = { ...i };
    (!t || F(i, "bonus")) && (s.bonus = Number.isInteger(i.bonus) ? i.bonus : 0), (!t || F(i, "slots")) && (s.slots = Br(i.slots, a), s.used = Et(s.slots)), (!t || F(i, "customized")) && (s.customized = i.customized === !0), (!t || F(i, "rollModifier")) && (s.rollModifier = Number.isInteger(i.rollModifier) ? Number(i.rollModifier) : 0), (!t || F(i, "history")) && (s.history = Array.isArray(i.history) ? i.history.map((o) => o && typeof o == "object" ? { slotId: "", ...o } : o) : []), n.recovery = s;
  }
  if (t) {
    if (n.presentation && typeof n.presentation == "object") {
      const i = n.presentation, a = { ...i };
      F(i, "hideFocusInSentence") && (a.hideFocusInSentence = i.hideFocusInSentence === !0), F(i, "powerShiftsEnabled") && (a.powerShiftsEnabled = i.powerShiftsEnabled === !0), n.presentation = a;
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
    (!t || F(i, "weaponFamilies")) && (a.weaponFamilies = oe(i.weaponFamilies)), n.proficiencies = a;
  }
  return (!t || F(n, "powerShifts")) && (n.powerShifts = oo(n.powerShifts)), n.creation && typeof n.creation == "object" && (n.creation = sl(n.creation, t)), n;
}
function ut(n, e, t) {
  return {
    id: `package.${n.system.instance.instanceId || n.id}.${e}`,
    sourceId: n.id,
    sourceType: "item",
    label: n.name,
    value: t
  };
}
function _e(n) {
  return Number.isInteger(n) && Number(n) > 0 ? Number(n) : 0;
}
function ro(n) {
  if (n.type !== "descriptor") return [];
  const e = n.system, t = e.instance?.selections?.poolChoices ?? [];
  return (e.poolBonusChoiceGroups ?? []).flatMap((i) => {
    const a = _e(i.amount), s = new Set(i.pools.filter((l) => k.includes(l))), o = t.find((l) => l.groupId === i.id)?.pools ?? [], r = [...new Set(o)].filter((l) => s.has(l)).slice(0, _e(i.choose));
    return a ? r.map((l) => ({ groupId: i.id, pool: l, amount: a })) : [];
  });
}
function lo(n) {
  if (n.type !== "characterType") return null;
  const e = n.system;
  if (!e.superhero?.superheroics?.enabled) return null;
  const t = e.instance?.selections?.superheroicsPool, i = _e(e.superhero.superheroics.poolBonus);
  return t && t !== "none" && k.includes(t) && i > 0 ? { pool: t, amount: i } : null;
}
function rl(n, e, t = []) {
  const i = [...n, ...e].join(" ").trim(), a = t.length > 0 ? `who ${t.join(" and ")}` : "";
  return [i, a].filter(Boolean).join(" ");
}
function ll(n, e = [], t = [], i = [], a = []) {
  const s = {}, o = {}, r = {}, l = new Set(e.filter((g) => Oe.includes(g))), u = new Set(oe(a)), c = new Set(t.filter((g) => Be.includes(g))), p = [], y = [], m = [], f = [];
  for (const g of n) {
    if (g.type === "characterType" || g.type === "species") {
      const E = g.system;
      if (g.type === "characterType")
        p.push(g.name);
      else {
        m.push(g.name);
        const R = _e(E.cypherLimitBonus);
        R && f.push(ut(g, "cypher-limit", R));
      }
      for (const R of oe([
        ...E.weaponFamilies ?? [],
        ...qi(E.weaponFamilyUse)
      ])) u.add(R);
      for (const R of ["minor", "moderate", "major"]) {
        const U = _e(E.woundBonuses[R]);
        U && (r[R] ??= []).push(ut(g, `wound.${R}`, U));
      }
      const H = E.edgeGrant.mode === "choice" ? E.instance.selections.edgePool : E.edgeGrant.pool;
      if (H !== "none" && k.includes(H)) {
        const R = _e(E.edgeGrant.amount);
        R && (o[H] ??= []).push(ut(g, `edge.${H}`, R));
      }
      for (const R of Oe) E.weaponUse[R] && l.add(R);
      for (const R of Be) E.armorUse[R] && c.add(R);
    } else
      y.push(g.name);
    const A = g.system.poolBonuses;
    for (const E of k) {
      const H = _e(A[E]);
      H && (s[E] ??= []).push(ut(g, `pool.${E}`, H));
    }
    for (const E of ro(g))
      (s[E.pool] ??= []).push(ut(
        g,
        `pool-choice.${E.groupId}.${E.pool}`,
        E.amount
      ));
    const v = lo(g);
    v && (s[v.pool] ??= []).push(ut(
      g,
      `superheroics.${v.pool}`,
      v.amount
    ));
  }
  return {
    extensions: { poolMax: s, poolEdge: o, woundCapacity: r, cypherLimit: f },
    weaponCategories: [...l],
    weaponFamilies: [...u],
    armorCategories: [...c],
    typeNames: p,
    descriptorNames: y,
    speciesNames: m,
    characterSentence: rl(y, p, i)
  };
}
function Zi(n) {
  const e = n.system, t = Object.fromEntries(k.map((a) => [a, _e(e.poolBonuses[a])]));
  for (const a of ro(n)) t[a.pool] += a.amount;
  const i = lo(n);
  return i && (t[i.pool] += i.amount), t;
}
function co(n, e, t) {
  const i = Math.max(0, e - n);
  return Math.max(0, Math.min(t, t - i));
}
const uo = ["core", "unlimited"], cl = ["manual", "typeSuggestion", "migration"], dl = ["progression", "origin"], ul = 6;
function ml(n, e) {
  if (!n.sourceUuid) return null;
  const t = e(n.sourceUuid);
  return !t || t.type !== "genre" || !t.system || !t.system.options || !uo.includes(t.system.options.totalEffortCapMode) ? null : {
    sourceUuid: n.sourceUuid,
    name: t.name,
    totalEffortCapMode: t.system.options.totalEffortCapMode
  };
}
function pl(n) {
  return n === "unlimited" ? null : ul;
}
const mo = ["theme", "portrait", "custom"], fl = "#96082a", gl = { r: 23, g: 24, b: 27 };
function Jn(n) {
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
function hl(n) {
  const e = po(n);
  return Math.max(e.r, e.g, e.b) < 96 ? fo(go(e, { r: 255, g: 255, b: 255 }, 0.72)) : n;
}
function ho(n) {
  const e = Jn(n);
  return e ? fo(go(po(e), gl, 0.2)) : null;
}
function yo(n) {
  const e = Jn(n);
  return e ? hl(e) : null;
}
function yl(n) {
  return `url("${n.replaceAll("\\", "\\\\").replaceAll('"', '\\"').replace(/[\n\r\f;]/g, "")}")`;
}
function So(n, e = (t) => foundry.utils.getRoute(t)) {
  const t = n.trim();
  return t ? /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(t) ? t : e(t) : "";
}
function Sl(n, e, t) {
  const i = mo.includes(n.backgroundMode) ? n.backgroundMode : "theme", a = n.customImage.trim(), s = Jn(n.color), o = s ? yo(s) : null, r = s ? ho(s) : null, l = i === "portrait" ? e.trim() : i === "custom" ? a : "", u = So(l, t), c = [
    ...o ? [`--magnusarchives-character-accent: ${o}`] : [],
    ...r ? [`--magnusarchives-character-tint: ${r}`] : [],
    ...u ? [`--magnusarchives-character-background-image: ${yl(u)}`] : []
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
    colorInput: s ?? fl,
    isTheme: i === "theme",
    isPortrait: i === "portrait",
    isCustom: i === "custom",
    style: c.join("; ")
  };
}
function Al() {
  return new d.SchemaField({
    id: new d.StringField({ required: !0, nullable: !1, blank: !1 }),
    kind: new d.StringField({ required: !0, nullable: !1, choices: [...Yr] }),
    otherKind: new d.StringField({
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
function bl() {
  return new d.SchemaField({
    id: new d.StringField({ required: !0, nullable: !1, blank: !1 }),
    source: new d.StringField({ required: !0, nullable: !1, choices: [...io] }),
    grantTier: w(1, 1),
    focusUuid: new d.StringField({ required: !0, nullable: !1, initial: "" })
  });
}
function wl() {
  return new d.SchemaField({
    id: new d.StringField({ required: !0, nullable: !1, blank: !1 }),
    source: new d.StringField({ required: !0, nullable: !1, choices: [...Jr] }),
    grantTier: w(1, 1)
  });
}
function vl() {
  return new d.SchemaField({
    nodeId: new d.StringField({ required: !0, nullable: !1, blank: !1 }),
    mode: new d.StringField({
      required: !0,
      nullable: !1,
      choices: ["choice", "manualOverride", "gmOverride", "gmManual", "legacy"]
    }),
    choiceId: new d.StringField({ required: !0, nullable: !1, initial: "" }),
    choiceSource: new d.StringField({
      required: !0,
      nullable: !1,
      initial: "none",
      choices: ["none", ...io]
    }),
    choiceGrantTier: w(1, 1),
    choiceFocusUuid: new d.StringField({ required: !0, nullable: !1, initial: "" }),
    acquiredAt: w()
  });
}
function Cl() {
  return new d.SchemaField({
    id: new d.StringField({ required: !0, nullable: !1, blank: !1 }),
    slotId: new d.StringField({ required: !0, nullable: !1, blank: !0, initial: "" }),
    kind: new d.StringField({
      required: !0,
      nullable: !1,
      initial: "normal",
      choices: [...Hr]
    }),
    type: new d.StringField({ required: !0, nullable: !1, choices: [...Ue] }),
    rolled: new d.BooleanField({ required: !0, nullable: !1, initial: !0 }),
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
function El() {
  return new d.SchemaField({
    id: new d.StringField({ required: !0, nullable: !1, blank: !1 }),
    type: new d.StringField({ required: !0, nullable: !1, choices: [...Ue] }),
    used: new d.BooleanField({ required: !0, nullable: !1, initial: !1 })
  });
}
function Il() {
  return new d.SchemaField({
    id: new d.StringField({ required: !0, nullable: !1, blank: !1 }),
    type: new d.StringField({ required: !0, nullable: !1, choices: [...$r] }),
    choice: new d.StringField({ required: !0, nullable: !1, initial: "" }),
    majorTaskSucceeded: new d.BooleanField({ required: !0, nullable: !1, initial: !1 }),
    removedWoundIds: Z(),
    timestamp: w()
  });
}
function en() {
  return new d.SchemaField({
    calculatedMax: w(),
    calculatedEdge: w(0, -20),
    max: w(),
    edge: w(0, -20),
    maxContributions: pe(),
    edgeContributions: pe()
  });
}
class Rl extends eo {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      tier: w(1, 1),
      overrides: new d.SchemaField({
        tier: new d.NumberField({ required: !0, nullable: !0, integer: !0, min: 1, initial: null }),
        effort: new d.NumberField({ required: !0, nullable: !0, integer: !0, min: 0, initial: null }),
        stats: new d.SchemaField({
          might: new d.SchemaField({
            max: new d.NumberField({ required: !0, nullable: !0, integer: !0, min: 1, initial: null }),
            edge: new d.NumberField({ required: !0, nullable: !0, integer: !0, min: -20, initial: null })
          }),
          speed: new d.SchemaField({
            max: new d.NumberField({ required: !0, nullable: !0, integer: !0, min: 1, initial: null }),
            edge: new d.NumberField({ required: !0, nullable: !0, integer: !0, min: -20, initial: null })
          }),
          intellect: new d.SchemaField({
            max: new d.NumberField({ required: !0, nullable: !0, integer: !0, min: 1, initial: null }),
            edge: new d.NumberField({ required: !0, nullable: !0, integer: !0, min: -20, initial: null })
          })
        }),
        wounds: new d.SchemaField({
          minor: w(0, -20),
          moderate: w(0, -20),
          major: w(0, -20)
        })
      }),
      xp: w(),
      stats: new d.SchemaField({
        effortBase: w(1),
        might: Qi(8),
        speed: Qi(8),
        intellect: Qi(8)
      }),
      recovery: new d.SchemaField({
        bonus: w(),
        used: new d.SchemaField({
          oneAction: new d.BooleanField({ required: !0, nullable: !1, initial: !1 }),
          tenMinutes: new d.BooleanField({ required: !0, nullable: !1, initial: !1 }),
          oneHour: new d.BooleanField({ required: !0, nullable: !1, initial: !1 }),
          tenHours: new d.BooleanField({ required: !0, nullable: !1, initial: !1 })
        }),
        slots: new d.ArrayField(El(), {
          required: !0,
          nullable: !1,
          initial: ot()
        }),
        customized: new d.BooleanField({ required: !0, nullable: !1, initial: !1 }),
        rollModifier: w(0, -20),
        history: new d.ArrayField(Cl(), {
          required: !0,
          nullable: !1,
          initial: []
        })
      }),
      rest: new d.SchemaField({
        lastType: new d.StringField({ required: !0, nullable: !1, initial: "" }),
        history: new d.ArrayField(Il(), {
          required: !0,
          nullable: !1,
          initial: []
        })
      }),
      wounds: new d.SchemaField({
        minor: new d.ArrayField(wt(), { required: !0, nullable: !1, initial: [] }),
        moderate: new d.ArrayField(wt(), { required: !0, nullable: !1, initial: [] }),
        major: new d.ArrayField(wt(), { required: !0, nullable: !1, initial: [] })
      }),
      stress: new d.SchemaField({
        value: w(0, 0),
        supernatural: w(0, 0)
      }),
      damageTrack: new d.SchemaField({
        step: new d.StringField({
          required: !0,
          nullable: !1,
          initial: "hale",
          choices: [...qt]
        }),
        hurtAvailable: new d.BooleanField({ required: !0, nullable: !1, initial: !1 })
      }),
      cypherLimitBase: w(2),
      build: new d.SchemaField({
        descriptorIds: Z(),
        typeIds: Z(),
        speciesIds: Z()
      }),
      focusProgress: new d.ArrayField(
        new d.SchemaField({
          focusUuid: new d.StringField({ required: !0, nullable: !1, blank: !1 }),
          ownedNodeIds: Z(),
          acquisitions: new d.ArrayField(vl(), {
            required: !0,
            nullable: !1,
            initial: []
          }),
          provenance: new d.StringField({
            required: !0,
            nullable: !1,
            initial: "additional",
            choices: ["creation", "additional"]
          }),
          initialChoicesGranted: new d.BooleanField({
            required: !0,
            nullable: !1,
            initial: !1
          }),
          attachedAt: w()
        }),
        { required: !0, nullable: !1, initial: [] }
      ),
      genre: new d.SchemaField({
        sourceUuid: new d.StringField({ required: !0, nullable: !1, initial: "" }),
        instanceId: new d.StringField({ required: !0, nullable: !1, initial: "" }),
        provenance: new d.StringField({
          required: !0,
          nullable: !1,
          initial: "manual",
          choices: [...cl]
        }),
        attachedAt: w()
      }),
      appearance: new d.SchemaField({
        backgroundMode: new d.StringField({
          required: !0,
          nullable: !1,
          initial: "theme",
          choices: [...mo]
        }),
        customImage: new d.StringField({
          required: !0,
          nullable: !1,
          blank: !0,
          initial: ""
        }),
        color: new d.StringField({
          required: !0,
          nullable: !1,
          blank: !0,
          initial: "",
          validate: (e) => e === "" || /^#(?:[\da-f]{3}|[\da-f]{6})$/i.test(e)
        })
      }),
      presentation: new d.SchemaField({
        hideFocusInSentence: new d.BooleanField({ required: !0, nullable: !1, initial: !1 }),
        powerShiftsEnabled: new d.BooleanField({ required: !0, nullable: !1, initial: !1 })
      }),
      powerShifts: new d.ArrayField(new d.SchemaField({
        id: new d.StringField({ required: !0, nullable: !1, blank: !1 }),
        category: new d.StringField({ required: !0, nullable: !1, blank: !1 }),
        shifts: w(1, 1),
        specification: new d.StringField({ required: !0, nullable: !1, initial: "" }),
        description: new d.StringField({ required: !0, nullable: !1, initial: "" })
      }), { required: !0, nullable: !1, initial: [] }),
      advancement: new d.SchemaField({
        cycle: w(1, 1),
        purchases: new d.ArrayField(Al(), {
          required: !0,
          nullable: !1,
          initial: []
        }),
        initializedFocusUuids: Z(),
        pendingFocusChoices: new d.ArrayField(bl(), {
          required: !0,
          nullable: !1,
          initial: []
        }),
        pendingGenreChoices: new d.ArrayField(wl(), {
          required: !0,
          nullable: !1,
          initial: []
        }),
        guidanceCompletedTiers: new d.ArrayField(w(1, 1), {
          required: !0,
          nullable: !1,
          initial: []
        }),
        notes: new d.HTMLField({ required: !0, nullable: !1, initial: "" })
      }),
      creation: new d.SchemaField({
        coreInitialized: new d.BooleanField({ required: !0, nullable: !1, initial: !1 }),
        mode: new d.StringField({
          required: !0,
          nullable: !1,
          initial: "uninitialized",
          choices: ["uninitialized", "completed", "skipped", "manual"]
        }),
        initializedAt: w()
      }),
      proficiencies: new d.SchemaField({
        weaponCategories: Z(["light"]),
        weaponFamilies: Z(),
        armorCategories: Z(),
        freelyUse: Z()
      }),
      derived: new d.SchemaField(
        {
          tier: new d.SchemaField({
            calculated: w(1, 1),
            value: w(1, 1)
          }),
          pools: new d.SchemaField({
            might: en(),
            speed: en(),
            intellect: en()
          }),
          effort: new d.SchemaField({
            calculatedMax: w(),
            max: w(),
            contributions: pe()
          }),
          stress: new d.SchemaField({
            value: w(),
            level: w(),
            toNextLevel: w(3),
            hindrance: w()
          }),
          damageTrack: new d.SchemaField({
            step: new d.StringField({
              required: !0,
              nullable: !1,
              initial: "hale",
              choices: [...qt]
            }),
            hurtAvailable: new d.BooleanField({ required: !0, nullable: !1, initial: !1 }),
            steps: new d.ArrayField(
              new d.StringField({ required: !0, nullable: !1, choices: [...qt] }),
              { required: !0, nullable: !1, initial: [] }
            ),
            effortSurcharge: w(),
            ignoresSpecialEffects: new d.BooleanField({ required: !0, nullable: !1, initial: !1 }),
            reducedSpecialDamage: new d.BooleanField({ required: !0, nullable: !1, initial: !1 }),
            moveOnly: new d.BooleanField({ required: !0, nullable: !1, initial: !1 }),
            dead: new d.BooleanField({ required: !0, nullable: !1, initial: !1 })
          }),
          totalHindrance: w(),
          wounds: new d.SchemaField({
            calculatedCapacities: new d.SchemaField({
              minor: w(3, 1),
              moderate: w(3, 1),
              major: w(3, 1)
            }),
            capacities: new d.SchemaField({
              minor: w(3, 1),
              moderate: w(3, 1),
              major: w(3, 1)
            }),
            capacityContributions: new d.SchemaField({
              minor: pe(),
              moderate: pe(),
              major: pe()
            }),
            hindrance: w(),
            hindranceContributions: pe(),
            dead: new d.BooleanField({ required: !0, nullable: !1, initial: !1 })
          }),
          recovery: new d.SchemaField({
            formula: new d.StringField({ required: !0, nullable: !1, initial: "1d6 + Tier" }),
            calculatedFormula: new d.StringField({ required: !0, nullable: !1, initial: "1d6 + Tier" }),
            calculatedBonus: w(0, -20),
            manualModifier: w(0, -20),
            bonus: w(),
            bonusContributions: pe(),
            availableTypes: new d.ArrayField(
              new d.StringField({ required: !0, nullable: !1, choices: [...Ue] }),
              { required: !0, nullable: !1, initial: [] }
            )
          }),
          cypherLimit: new d.SchemaField({ max: w(), contributions: pe() }),
          combat: new d.SchemaField({
            armor: new d.SchemaField({
              itemId: new d.StringField({ required: !0, nullable: !1, initial: "" }),
              category: new d.StringField({
                required: !0,
                nullable: !1,
                initial: "none",
                choices: ["none", "light", "medium", "heavy"]
              }),
              freelyUsed: new d.BooleanField({ required: !0, nullable: !1, initial: !0 }),
              blockEase: w(),
              dodgeHindrance: w(),
              speedTaskHindrance: w(),
              blockContributions: pe(),
              dodgeContributions: pe(),
              speedTaskContributions: pe()
            })
          }),
          packages: new d.SchemaField({
            weaponCategories: Z(),
            weaponFamilies: Z(),
            armorCategories: Z(),
            genre: new d.StringField({ required: !0, nullable: !1, initial: "none" }),
            genreUuid: new d.StringField({ required: !0, nullable: !1, initial: "" }),
            totalEffortCapMode: new d.StringField({
              required: !0,
              nullable: !1,
              initial: "core",
              choices: ["core", "unlimited"]
            }),
            typeNames: Z(),
            descriptorNames: Z(),
            speciesNames: Z(),
            characterSentence: new d.StringField({ required: !0, nullable: !1, initial: "" })
          })
        },
        { required: !0, nullable: !1, persisted: !1 }
      )
    };
  }
  static migrateData(e, t = {}) {
    return ol(super.migrateData(e), t);
  }
  prepareDerivedData() {
    super.prepareDerivedData();
    const e = [...this.parent.items ?? []], t = e.filter((l) => l.type === "armor").map((l) => ({
      id: l.id,
      type: l.type,
      system: l.system
    })), i = this.proficiencies, a = ll(
      e.filter((l) => l.type === "characterType" || l.type === "descriptor" || l.type === "species"),
      i.weaponCategories,
      i.armorCategories,
      [],
      oe(i.weaponFamilies)
    ), s = ml(this.genre, (l) => typeof fromUuidSync != "function" ? null : fromUuidSync(l)), o = {
      armorCategories: a.armorCategories,
      freelyUse: i.freelyUse
    }, r = Wr(
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
class Nl extends eo {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      level: w(1, 0),
      health: new d.SchemaField({
        value: w(3),
        baseMax: w(3, 1),
        max: new d.NumberField({
          required: !0,
          nullable: !1,
          integer: !0,
          min: 1,
          initial: 3,
          persisted: !1
        })
      }),
      dead: new d.BooleanField({
        required: !0,
        nullable: !1,
        initial: !1,
        persisted: !1
      }),
      // GM-facing reference only. NPC combat intentionally continues to use
      // the legacy armorBase field where that older automation is required.
      armor: w(),
      armorBase: w(),
      damage: new d.SchemaField({
        amount: w(1),
        // What this NPC's attack does to a PC. The book writes these as, for
        // example, "Knife deals 3 points of Stress" or "short-range firearm
        // attack deals serious injury".
        effect: new d.StringField({
          required: !0,
          nullable: !1,
          initial: "stress",
          choices: [...zi]
        }),
        stressAmount: w(3),
        defense: new d.SchemaField({
          allowBlock: new d.BooleanField({ required: !0, nullable: !1, initial: !0 }),
          allowDodge: new d.BooleanField({ required: !0, nullable: !1, initial: !0 })
        }),
        notes: new d.StringField({ required: !0, nullable: !1, initial: "" })
      }),
      movement: new d.SchemaField({
        category: new d.StringField({ required: !0, nullable: !1, initial: "short" }),
        distance: new d.StringField({ required: !0, nullable: !1, initial: "" }),
        notes: new d.StringField({ required: !0, nullable: !1, initial: "" })
      }),
      modifications: new d.ArrayField(
        new d.SchemaField({
          id: new d.StringField({ required: !0, nullable: !1, blank: !1 }),
          label: new d.StringField({ required: !0, nullable: !1, initial: "" }),
          contexts: new d.ArrayField(
            new d.StringField({ required: !0, nullable: !1, blank: !1 }),
            { required: !0, nullable: !1, initial: [] }
          ),
          mode: new d.StringField({
            required: !0,
            nullable: !1,
            initial: "levelOverride",
            choices: ["levelOverride", "levelDelta", "ease", "hinder"]
          }),
          value: new d.NumberField({ required: !0, nullable: !1, integer: !0, initial: 0 }),
          visibility: new d.StringField({
            required: !0,
            nullable: !1,
            initial: "gm",
            choices: ["public", "gm"]
          }),
          predicate: new d.ObjectField({ required: !0, nullable: !1, initial: {} }),
          description: new d.HTMLField({ required: !0, nullable: !1, initial: "" })
        }),
        { required: !0, nullable: !1, initial: [] }
      ),
      gmIntrusion: new d.HTMLField({ required: !0, nullable: !1, initial: "" })
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
const Ml = ["none", "fantasy", "scienceFiction", "superhero", "custom"], Ul = ["primary", "additional", "speciesGranted", "custom"], Ao = ["none", "fixed", "choice"], Gl = ["type", "descriptor", "focus", "genre", "species", "other"], kl = ["active", "retained"], Hl = ["fixed", "catalog"], $l = ["none", "descriptor"];
function Gt() {
  return new d.SchemaField({
    name: new d.StringField({ required: !0, nullable: !1, initial: "" }),
    img: new d.StringField({ required: !0, nullable: !1, initial: "" }),
    system: new d.ObjectField({ required: !0, nullable: !1, initial: {} })
  });
}
function bo() {
  return new d.SchemaField({
    kind: new d.StringField({ required: !0, nullable: !1, initial: "other", choices: [...Gl] }),
    sourceUuid: new d.StringField({ required: !0, nullable: !1, initial: "" }),
    instanceId: new d.StringField({ required: !0, nullable: !1, initial: "" }),
    grantId: new d.StringField({ required: !0, nullable: !1, initial: "" }),
    status: new d.StringField({ required: !0, nullable: !1, initial: "active", choices: [...kl] }),
    contentUuid: new d.StringField({ required: !0, nullable: !1, initial: "" }),
    contentKey: new d.StringField({ required: !0, nullable: !1, initial: "" }),
    replacement: new d.SchemaField({
      active: new d.BooleanField({ required: !0, nullable: !1, initial: !1 }),
      originalName: new d.StringField({ required: !0, nullable: !1, initial: "" }),
      originalContentUuid: new d.StringField({ required: !0, nullable: !1, initial: "" }),
      originalContentKey: new d.StringField({ required: !0, nullable: !1, initial: "" }),
      replacementName: new d.StringField({ required: !0, nullable: !1, initial: "" }),
      replacementContentUuid: new d.StringField({ required: !0, nullable: !1, initial: "" }),
      replacementContentKey: new d.StringField({ required: !0, nullable: !1, initial: "" }),
      selectionKind: new d.StringField({ required: !0, nullable: !1, initial: "none", choices: ["none", "suggested", "world", "compendium", "custom"] })
    })
  });
}
function wo() {
  return new d.SchemaField({
    id: new d.StringField({ required: !0, nullable: !1, blank: !1 }),
    itemUuid: new d.StringField({ required: !0, nullable: !1, initial: "" }),
    customName: new d.StringField({ required: !0, nullable: !1, initial: "" }),
    snapshot: Gt()
  });
}
function tn() {
  return new d.SchemaField({
    groupId: new d.StringField({ required: !0, nullable: !1, blank: !1 }),
    optionIds: new d.ArrayField(new d.StringField({ required: !0, nullable: !1, blank: !1 }), { required: !0, nullable: !1, initial: [] })
  });
}
function Vl() {
  return new d.SchemaField({
    groupId: new d.StringField({ required: !0, nullable: !1, blank: !1 }),
    pools: new d.ArrayField(
      new d.StringField({ required: !0, nullable: !1, blank: !1, choices: [...k] }),
      { required: !0, nullable: !1, initial: [] }
    )
  });
}
function Qn() {
  return new d.SchemaField({
    sourceUuid: new d.StringField({ required: !0, nullable: !1, initial: "" }),
    instanceId: new d.StringField({ required: !0, nullable: !1, initial: "" }),
    role: new d.StringField({ required: !0, nullable: !1, initial: "primary", choices: [...Ul] }),
    attachedAt: w(),
    selections: new d.SchemaField({
      edgePool: new d.StringField({ required: !0, nullable: !1, initial: "none", choices: ["none", "might", "speed", "intellect"] }),
      superheroicsPool: new d.StringField({ required: !0, nullable: !1, initial: "none", choices: ["none", ...k] }),
      powerShifts: new d.ArrayField(
        new d.StringField({ required: !0, nullable: !1, initial: "" }),
        { required: !0, nullable: !1, initial: [] }
      ),
      poolChoices: new d.ArrayField(Vl(), { required: !0, nullable: !1, initial: [] }),
      skillChoices: new d.ArrayField(tn(), { required: !0, nullable: !1, initial: [] }),
      abilityChoices: new d.ArrayField(tn(), { required: !0, nullable: !1, initial: [] }),
      descriptorChoices: new d.ArrayField(tn(), { required: !0, nullable: !1, initial: [] }),
      suppressedGrantIds: new d.ArrayField(new d.StringField({ required: !0, nullable: !1, blank: !1 }), { required: !0, nullable: !1, initial: [] })
    }),
    parent: bo()
  });
}
function Dl() {
  return new d.SchemaField({
    id: new d.StringField({ required: !0, nullable: !1, blank: !1 }),
    amount: w(1, 1),
    choose: w(1, 1),
    pools: new d.ArrayField(
      new d.StringField({ required: !0, nullable: !1, blank: !1, choices: [...k] }),
      { required: !0, nullable: !1, initial: [] }
    )
  });
}
function Zn() {
  return new d.SchemaField({
    id: new d.StringField({ required: !0, nullable: !1, blank: !1 }),
    abilityUuid: new d.StringField({ required: !0, nullable: !1, initial: "" }),
    notes: new d.StringField({ required: !0, nullable: !1, initial: "" }),
    snapshot: Gt(),
    alternatives: new d.ArrayField(wo(), { required: !0, nullable: !1, initial: [] })
  });
}
function Fl() {
  return new d.SchemaField({
    id: new d.StringField({ required: !0, nullable: !1, blank: !1 }),
    skillUuid: new d.StringField({ required: !0, nullable: !1, initial: "" }),
    customName: new d.StringField({ required: !0, nullable: !1, initial: "" }),
    notes: new d.HTMLField({ required: !0, nullable: !1, initial: "" }),
    snapshot: Gt()
  });
}
function ea() {
  return new d.SchemaField({
    id: new d.StringField({ required: !0, nullable: !1, blank: !1 }),
    skillUuid: new d.StringField({ required: !0, nullable: !1, initial: "" }),
    customName: new d.StringField({ required: !0, nullable: !1, initial: "" }),
    notes: new d.HTMLField({ required: !0, nullable: !1, initial: "" }),
    rank: new d.StringField({ required: !0, nullable: !1, initial: "trained", choices: [...te] }),
    snapshot: Gt(),
    alternatives: new d.ArrayField(wo(), { required: !0, nullable: !1, initial: [] })
  });
}
function ta() {
  return new d.SchemaField({
    id: new d.StringField({ required: !0, nullable: !1, blank: !1 }),
    choose: w(1, 1),
    rank: new d.StringField({ required: !0, nullable: !1, initial: "trained", choices: [...te] }),
    options: new d.ArrayField(Fl(), { required: !0, nullable: !1, initial: [] })
  });
}
function vo() {
  return new d.SchemaField({
    id: new d.StringField({ required: !0, nullable: !1, blank: !1 }),
    choose: w(1, 1),
    options: new d.ArrayField(Zn(), { required: !0, nullable: !1, initial: [] })
  });
}
function Co() {
  return new d.SchemaField({
    id: new d.StringField({ required: !0, nullable: !1, blank: !1 }),
    descriptorUuid: new d.StringField({ required: !0, nullable: !1, initial: "" }),
    snapshot: Gt()
  });
}
function Tl() {
  return new d.SchemaField({
    id: new d.StringField({ required: !0, nullable: !1, blank: !1 }),
    choose: w(1, 1),
    sourceMode: new d.StringField({
      required: !0,
      nullable: !1,
      initial: "fixed",
      choices: [...Hl]
    }),
    catalogItemType: new d.StringField({
      required: !0,
      nullable: !1,
      initial: "none",
      choices: [...$l]
    }),
    options: new d.ArrayField(Co(), { required: !0, nullable: !1, initial: [] })
  });
}
function Gi() {
  return new d.SchemaField({
    light: new d.BooleanField({ required: !0, nullable: !1, initial: !1 }),
    medium: new d.BooleanField({ required: !0, nullable: !1, initial: !1 }),
    heavy: new d.BooleanField({ required: !0, nullable: !1, initial: !1 })
  });
}
class ue extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      schemaVersion: w(1, 1),
      slug: new d.StringField({ required: !0, nullable: !1, initial: "" }),
      description: new d.StringField({ required: !1, nullable: !1, initial: "" }),
      source: new d.SchemaField({
        uuid: new d.StringField({ required: !0, nullable: !1, initial: "" }),
        book: new d.StringField({ required: !0, nullable: !1, initial: "" }),
        page: new d.StringField({ required: !0, nullable: !1, initial: "" }),
        license: new d.StringField({ required: !0, nullable: !1, initial: "original" })
      }),
      automation: new d.SchemaField({
        mode: new d.StringField({
          required: !0,
          nullable: !1,
          initial: "descriptive",
          choices: ["descriptive", "assisted", "automatic"]
        }),
        duration: Xr(),
        rollDefaults: new d.ObjectField({ required: !0, nullable: !1, initial: {} })
      }),
      ruleElements: new d.ArrayField(
        new d.ObjectField({ required: !0, nullable: !1 }),
        { required: !0, nullable: !1, initial: [] }
      ),
      tags: new d.ArrayField(
        new d.StringField({ required: !0, nullable: !1, blank: !1 }),
        { required: !0, nullable: !1, initial: [] }
      ),
      grantedBy: bo()
    };
  }
}
const zl = [...k];
function Gn(n, e = "none") {
  return Array.isArray(n) ? k.filter((t) => n.includes(t)) : e === "choose" || e === "any" ? [...k] : k.includes(e) ? [e] : [];
}
function Ke(n) {
  return Gn(n.system.cost.allowedPools, n.system.pool);
}
function Pl(n, e, t) {
  const i = k.filter((a) => n.includes(a));
  return i.length === 0 ? "" : i.length === 1 ? e(i[0]) : i.length === 2 ? `${e(i[0])}${t.pair}${e(i[1])}` : `${e(i[0])}${t.middle}${e(i[1])}${t.final}${e(i[2])}`;
}
function Eo(n, e, t, i, a = !1) {
  return !Number.isInteger(n) || n <= 0 || e.length === 0 ? "" : `${n}${a ? "+" : ""} ${Pl(e, t, i)}`;
}
class xl extends ue {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      tier: w(1, 0),
      category: new d.StringField({ required: !0, nullable: !1, initial: "general" }),
      archived: new d.BooleanField({ required: !0, nullable: !1, initial: !1 }),
      activation: new d.StringField({
        required: !0,
        nullable: !1,
        initial: "action",
        choices: [...js]
      }),
      // Legacy V1 single-Pool source retained for safe document migration.
      // Runtime and UI use cost.allowedPools as the normalized authority.
      pool: new d.StringField({
        required: !0,
        nullable: !1,
        initial: "none",
        choices: [...Ia]
      }),
      cost: new d.SchemaField({
        amount: w(),
        scalable: new d.BooleanField({ required: !0, nullable: !1, initial: !1 }),
        ignoresEdge: new d.BooleanField({ required: !0, nullable: !1, initial: !1 }),
        allowedPools: new d.ArrayField(
          new d.StringField({ required: !0, nullable: !1, choices: [...k] }),
          { required: !0, nullable: !1, initial: [] }
        )
      }),
      roll: new d.StringField({
        required: !0,
        nullable: !1,
        initial: "none",
        choices: [...Ws]
      }),
      rollModifier: new d.NumberField({
        required: !0,
        nullable: !1,
        integer: !0,
        min: -10,
        max: 10,
        initial: 0
      }),
      attackModifier: new d.NumberField({
        required: !0,
        nullable: !1,
        integer: !0,
        min: -10,
        max: 10,
        initial: 0
      }),
      damage: w(),
      damageEffect: new d.StringField({
        required: !0,
        nullable: !1,
        initial: "none",
        choices: [...zi]
      }),
      stressAmount: w(3),
      range: new d.StringField({ required: !0, nullable: !1, initial: "" }),
      targetMode: new d.StringField({
        required: !0,
        nullable: !1,
        initial: "none",
        choices: [..._s]
      }),
      // Reserved for the later Focus acquisition workflow. Phase 1 never writes these fields.
      sourceFocusUuid: new d.StringField({ required: !0, nullable: !1, initial: "" }),
      sourceNodeId: new d.StringField({ required: !0, nullable: !1, initial: "" })
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
        allowedPools: Gn(
          s ? a.allowedPools : void 0,
          i.pool ?? a.pool
        )
      }), i;
    }
    if (i.pool === void 0) {
      const s = String(a.pool ?? "none");
      i.pool = Ia.includes(s) ? s : "none";
    }
    return i.archived = !!(i.archived ?? !1), i.cost = {
      amount: Number(a.amount ?? 0),
      scalable: !!(a.scalable ?? !1),
      ignoresEdge: !!(a.ignoresEdge ?? !1),
      allowedPools: Gn(
        a.allowedPools,
        i.pool ?? a.pool
      )
    }, i.roll === void 0 && (i.roll = "none"), i.targetMode === void 0 && (i.targetMode = "none"), i;
  }
}
const tt = Object.freeze({
  minor: 3,
  moderate: 2,
  major: 1
});
class ql extends ue {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      equipped: new d.BooleanField({ required: !0, nullable: !1, initial: !1 }),
      depletion: xi(),
      depleted: new d.BooleanField({ required: !0, nullable: !1, initial: !1 }),
      woundCapacities: new d.SchemaField({
        minor: w(tt.minor),
        moderate: w(tt.moderate),
        major: w(tt.major)
      }),
      wounds: new d.SchemaField({
        minor: new d.ArrayField(wt(), { required: !0, nullable: !1, initial: [] }),
        moderate: new d.ArrayField(wt(), { required: !0, nullable: !1, initial: [] }),
        major: new d.ArrayField(wt(), { required: !0, nullable: !1, initial: [] })
      }),
      derived: new d.SchemaField({
        capacities: new d.SchemaField({
          minor: w(tt.minor),
          moderate: w(tt.moderate),
          major: w(tt.major)
        }),
        broken: new d.BooleanField({ required: !0, nullable: !1, initial: !1 })
      }, { required: !0, nullable: !1, persisted: !1 })
    };
  }
  prepareDerivedData() {
    super.prepareDerivedData(), Object.assign(this.derived.capacities, this.woundCapacities), this.derived.broken = this.wounds.major.length >= this.derived.capacities.major;
  }
}
class Ol extends ue {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      category: new d.StringField({
        required: !0,
        nullable: !1,
        initial: "light",
        choices: [...Be]
      }),
      grantsHurtStep: new d.BooleanField({ required: !0, nullable: !1, initial: !0 }),
      speedTaskHindrance: w(1),
      // Legacy compatibility only. Effective Armor familiarity is derived from the Character.
      freelyUsed: new d.BooleanField({ required: !0, nullable: !1, initial: !1 }),
      depletion: xi(),
      depleted: new d.BooleanField({ required: !0, nullable: !1, initial: !1 }),
      equipped: new d.BooleanField({ required: !0, nullable: !1, initial: !1 })
    };
  }
}
class Bl extends ue {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      level: new d.StringField({ required: !0, nullable: !1, initial: "1", blank: !1 }),
      identified: new d.BooleanField({ required: !0, nullable: !1, initial: !0 }),
      depletion: xi("1d6"),
      depleted: new d.BooleanField({ required: !0, nullable: !1, initial: !1 }),
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
class Ll extends ue {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      poolBonuses: new d.SchemaField({ might: w(), speed: w(), intellect: w() }),
      woundBonuses: new d.SchemaField({ minor: w(), moderate: w(), major: w() }),
      edgeGrant: new d.SchemaField({
        mode: new d.StringField({ required: !0, nullable: !1, initial: "none", choices: [...Ao] }),
        pool: new d.StringField({ required: !0, nullable: !1, initial: "none", choices: ["none", "might", "speed", "intellect"] }),
        amount: w(1)
      }),
      weaponUse: Gi(),
      weaponFamilies: new d.ArrayField(
        new d.StringField({ required: !0, nullable: !1, blank: !1 }),
        { required: !0, nullable: !1, initial: [] }
      ),
      armorUse: Gi(),
      superhero: new d.SchemaField({
        rank: new d.NumberField({ required: !0, nullable: !1, integer: !0, min: 0, max: 5, initial: 0 }),
        powerShiftCount: new d.NumberField({ required: !0, nullable: !1, integer: !0, min: 0, max: 10, initial: 0 }),
        superheroics: new d.SchemaField({
          enabled: new d.BooleanField({ required: !0, nullable: !1, initial: !1 }),
          poolBonus: w()
        })
      }),
      abilityGrants: new d.ArrayField(Zn(), { required: !0, nullable: !1, initial: [] }),
      abilityChoiceGroups: new d.ArrayField(vo(), { required: !0, nullable: !1, initial: [] }),
      skillGrants: new d.ArrayField(ea(), { required: !0, nullable: !1, initial: [] }),
      choiceGroups: new d.ArrayField(ta(), { required: !0, nullable: !1, initial: [] }),
      genre: new d.StringField({ required: !0, nullable: !1, initial: "none", choices: [...Ml] }),
      customGenreId: new d.StringField({ required: !0, nullable: !1, initial: "" }),
      backgroundOptions: new d.HTMLField({ required: !0, nullable: !1, initial: "" }),
      equipmentNotes: new d.HTMLField({ required: !0, nullable: !1, initial: "" }),
      equipmentBundleUuid: new d.StringField({ required: !0, nullable: !1, initial: "" }),
      instance: Qn()
    };
  }
  static migrateData(e, t = {}) {
    const i = qi(e.weaponFamilyUse), a = super.migrateData(e, t);
    return (!t.partial || Object.hasOwn(e, "weaponFamilies") || i.length > 0) && (a.weaponFamilies = oe([
      ...Array.isArray(e.weaponFamilies) ? e.weaponFamilies : [],
      ...i
    ])), delete a.weaponFamilyUse, a;
  }
}
class jl extends ue {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      level: w(1, 1),
      levelOverride: new d.BooleanField({ required: !0, nullable: !1, initial: !1 }),
      category: new d.StringField({ required: !0, nullable: !1, initial: "general" }),
      manifest: new d.BooleanField({ required: !0, nullable: !1, initial: !1 }),
      manifestation: new d.StringField({
        required: !0,
        nullable: !1,
        initial: "subtle",
        choices: [...Wn]
      }),
      form: new d.StringField({ required: !0, nullable: !1, initial: "" }),
      power: new d.StringField({
        required: !0,
        nullable: !1,
        initial: "low",
        choices: [..._n]
      }),
      identified: new d.BooleanField({ required: !0, nullable: !1, initial: !0 }),
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
class Wl extends ue {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      poolBonuses: new d.SchemaField({ might: w(), speed: w(), intellect: w() }),
      poolBonusChoiceGroups: new d.ArrayField(Dl(), { required: !0, nullable: !1, initial: [] }),
      skillGrants: new d.ArrayField(ea(), { required: !0, nullable: !1, initial: [] }),
      choiceGroups: new d.ArrayField(ta(), { required: !0, nullable: !1, initial: [] }),
      instance: Qn()
    };
  }
}
class _l extends ue {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      // Mundane equipment is about level 4 (p99).
      level: w(4),
      quantity: w(1),
      equipped: new d.BooleanField({ required: !0, nullable: !1, initial: !1 }),
      // One of the six price categories (p98) rather than a currency amount.
      price: new d.StringField({
        required: !0,
        nullable: !1,
        initial: "inexpensive",
        choices: [...Mn]
      }),
      priceNote: new d.StringField({ required: !0, nullable: !1, initial: "" })
    };
  }
  static migrateData(e, t = {}) {
    const i = super.migrateData(e, t);
    return typeof i.price == "string" && !Mn.includes(i.price) && (i.priceNote === void 0 && i.price !== "" && (i.priceNote = i.price), i.price = "inexpensive"), i;
  }
}
function Kl() {
  return new d.SchemaField({
    id: new d.StringField({ required: !0, nullable: !1, blank: !1 }),
    abilityUuid: new d.StringField({ required: !0, nullable: !1, initial: "" }),
    abilitySnapshot: new d.SchemaField({
      name: new d.StringField({ required: !0, nullable: !1, initial: "" }),
      description: new d.StringField({ required: !1, nullable: !1, initial: "" })
    }),
    tier: new d.NumberField({
      required: !0,
      nullable: !1,
      integer: !0,
      min: 1,
      max: 6,
      initial: 1
    }),
    position: new d.SchemaField({
      x: new d.NumberField({ required: !0, nullable: !0, initial: null }),
      y: new d.NumberField({ required: !0, nullable: !0, initial: null })
    })
  });
}
function Xl() {
  return new d.SchemaField({
    id: new d.StringField({ required: !0, nullable: !1, blank: !1 }),
    from: new d.StringField({ required: !0, nullable: !1, blank: !1 }),
    to: new d.StringField({ required: !0, nullable: !1, blank: !1 })
  });
}
class Yl extends ue {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      graph: new d.SchemaField({
        version: w(1, 1),
        nodes: new d.ArrayField(Kl(), { required: !0, nullable: !1, initial: [] }),
        connections: new d.ArrayField(Xl(), {
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
const at = 1, Kt = 6;
class ia extends Error {
  constructor(e, t) {
    super(t), this.code = e, this.name = "GenreCatalogError";
  }
  code;
}
function Io(n) {
  const e = Number(n);
  if (!Number.isInteger(e) || e < at || e > Kt)
    throw new ia(
      "invalid-minimum-tier",
      `Genre Ability Minimum Tier must be an integer from ${at} to ${Kt}.`
    );
  return e;
}
function Jl(n, e, t) {
  const i = Io(t);
  let a = !1;
  const s = n.map((o) => o.id !== e ? o : (a = !0, { ...o, minimumTier: i }));
  if (!a) throw new ia("entry-missing", "Genre Ability catalog entry not found.");
  return s;
}
function Ql(n, e, t) {
  let i = !1;
  const a = n.map((s) => s.id !== e ? s : (i = !0, { ...s, snapshot: t }));
  if (!i) throw new ia("entry-missing", "Genre Ability catalog entry not found.");
  return a;
}
function Zl(n, e) {
  return n.filter((t) => t.id !== e);
}
function ec() {
  return new d.SchemaField({
    id: new d.StringField({ required: !0, nullable: !1, blank: !1 }),
    abilityUuid: new d.StringField({ required: !0, nullable: !1, initial: "" }),
    minimumTier: new d.NumberField({
      required: !0,
      nullable: !1,
      integer: !0,
      min: at,
      max: Kt,
      initial: at
    }),
    catalog: new d.StringField({
      required: !0,
      nullable: !1,
      initial: "progression",
      choices: [...dl]
    }),
    minimumSuperheroRank: new d.NumberField({
      required: !0,
      nullable: !1,
      integer: !0,
      min: 0,
      max: 5,
      initial: 0
    }),
    snapshot: Gt()
  });
}
class tc extends ue {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      abilityCatalog: new d.ArrayField(ec(), {
        required: !0,
        nullable: !1,
        initial: []
      }),
      options: new d.SchemaField({
        totalEffortCapMode: new d.StringField({
          required: !0,
          nullable: !1,
          initial: "core",
          choices: [...uo]
        })
      }),
      legacyKey: new d.StringField({ required: !0, nullable: !1, initial: "" })
    };
  }
}
class ic extends ue {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      rank: new d.StringField({
        required: !0,
        nullable: !1,
        initial: "untrained",
        choices: [...te]
      }),
      defaultPool: new d.StringField({
        required: !0,
        nullable: !1,
        initial: "choose",
        choices: [...Os]
      }),
      category: new d.StringField({ required: !0, nullable: !1, initial: "general" }),
      contexts: new d.ArrayField(
        new d.StringField({ required: !0, nullable: !1, blank: !1 }),
        { required: !0, nullable: !1, initial: [] }
      ),
      initiative: new d.BooleanField({ required: !0, nullable: !1, initial: !1 }),
      acquisition: new d.SchemaField({
        minimumTier: w(1, 1),
        grantedByUuid: new d.StringField({ required: !0, nullable: !1, initial: "" }),
        notes: new d.HTMLField({ required: !0, nullable: !1, initial: "" })
      })
    };
  }
  static migrateData(e, t = {}) {
    const i = super.migrateData(e, t), a = Object.hasOwn(i, "defaultPool");
    return (!t.partial || a) && (i.defaultPool === "" || i.defaultPool === null || i.defaultPool === void 0) && (i.defaultPool = "choose"), i;
  }
}
class nc extends ue {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      poolBonuses: new d.SchemaField({ might: w(), speed: w(), intellect: w() }),
      woundBonuses: new d.SchemaField({ minor: w(), moderate: w(), major: w() }),
      edgeGrant: new d.SchemaField({
        mode: new d.StringField({ required: !0, nullable: !1, initial: "none", choices: [...Ao] }),
        pool: new d.StringField({ required: !0, nullable: !1, initial: "none", choices: ["none", "might", "speed", "intellect"] }),
        amount: w(1)
      }),
      weaponUse: Gi(),
      weaponFamilies: new d.ArrayField(
        new d.StringField({ required: !0, nullable: !1, blank: !1 }),
        { required: !0, nullable: !1, initial: [] }
      ),
      armorUse: Gi(),
      cypherLimitBonus: w(),
      skillGrants: new d.ArrayField(ea(), { required: !0, nullable: !1, initial: [] }),
      choiceGroups: new d.ArrayField(ta(), { required: !0, nullable: !1, initial: [] }),
      abilityGrants: new d.ArrayField(Zn(), { required: !0, nullable: !1, initial: [] }),
      abilityChoiceGroups: new d.ArrayField(vo(), { required: !0, nullable: !1, initial: [] }),
      descriptorGrants: new d.ArrayField(Co(), { required: !0, nullable: !1, initial: [] }),
      descriptorChoiceGroups: new d.ArrayField(Tl(), { required: !0, nullable: !1, initial: [] }),
      instance: Qn()
    };
  }
  static migrateData(e, t = {}) {
    const i = qi(e.weaponFamilyUse), a = super.migrateData(e, t);
    return (!t.partial || Object.hasOwn(e, "weaponFamilies") || i.length > 0) && (a.weaponFamilies = oe([
      ...Array.isArray(e.weaponFamilies) ? e.weaponFamilies : [],
      ...i
    ])), delete a.weaponFamilyUse, a;
  }
}
class ac extends ue {
  static defineSchema() {
    return {
      ...super.defineSchema(),
      category: new d.StringField({
        required: !0,
        nullable: !1,
        initial: "medium",
        choices: [...Oe]
      }),
      family: new d.StringField({ required: !0, nullable: !1, blank: !0, initial: "" }),
      attackType: new d.StringField({
        required: !0,
        nullable: !1,
        initial: "melee",
        choices: [...Bs]
      }),
      rangeCategory: new d.StringField({
        required: !0,
        nullable: !1,
        initial: "immediate",
        choices: [...Nn]
      }),
      rangeNotes: new d.StringField({ required: !0, nullable: !1, initial: "" }),
      skillLevel: new d.StringField({
        required: !0,
        nullable: !1,
        initial: "untrained",
        choices: [...te]
      }),
      defaultPool: new d.StringField({
        required: !0,
        nullable: !1,
        initial: "none",
        choices: ["none", ...k]
      }),
      damageOverride: new d.NumberField({
        required: !0,
        nullable: !0,
        integer: !0,
        min: 0,
        initial: null
      }),
      attackModifier: new d.NumberField({
        required: !0,
        nullable: !1,
        integer: !0,
        min: -2,
        max: 2,
        initial: 0
      }),
      bonusDamage: new d.NumberField({
        required: !0,
        nullable: !1,
        integer: !0,
        min: 0,
        initial: 0
      }),
      baseDamage: new d.NumberField({
        required: !0,
        nullable: !1,
        integer: !0,
        min: 0,
        initial: 4,
        persisted: !1
      }),
      // Legacy compatibility only. Effective Weapon familiarity is derived from the Character.
      freelyUsed: new d.BooleanField({ required: !0, nullable: !1, initial: !1 }),
      ammo: new d.SchemaField({
        enabled: new d.BooleanField({ required: !0, nullable: !1, initial: !1 }),
        value: w(),
        max: w(),
        perAttack: w(1, 1)
      }),
      // Assault rifles and submachine guns are rapid-fire weapons (p103-104).
      rapidFire: new d.BooleanField({ required: !0, nullable: !1, initial: !1 }),
      // Explosives hit every target in an area and always leave a mark (p100).
      explosive: new d.BooleanField({ required: !0, nullable: !1, initial: !1 }),
      depletion: xi(),
      depleted: new d.BooleanField({ required: !0, nullable: !1, initial: !1 }),
      equipped: new d.BooleanField({ required: !0, nullable: !1, initial: !1 })
    };
  }
  static migrateData(e, t = {}) {
    const i = super.migrateData(e, t);
    (!t.partial || Object.hasOwn(i, "family")) && (i.family = rt(i.family));
    const a = Object.hasOwn(i, "defaultPool");
    (!t.partial || a) && i.defaultPool !== "none" && !k.includes(i.defaultPool) && (i.defaultPool = "none");
    const s = Oe.includes(i.category) ? i.category : "medium", o = { light: 2, medium: 4, heavy: 6 }, r = typeof i.damageOverride == "number" ? i.damageOverride : typeof i.damage == "number" ? i.damage : null;
    if (i.bonusDamage === void 0 && r !== null && (i.bonusDamage = Math.max(0, r - o[s])), i.damageOverride = null, i.rangeCategory === void 0 && typeof i.range == "string") {
      const l = i.range;
      i.rangeCategory = Nn.includes(l) ? l : "specified", i.rangeCategory === "specified" && i.rangeNotes === void 0 && (i.rangeNotes = i.range);
    }
    return i;
  }
  prepareDerivedData() {
    super.prepareDerivedData();
    const e = { light: 2, medium: 4, heavy: 6 };
    this.baseDamage = Math.max(0, e[this.category] + this.bonusDamage);
  }
}
function sc() {
  Object.assign(CONFIG.Actor.dataModels, {
    character: Rl,
    npc: Nl
  }), Object.assign(CONFIG.Item.dataModels, {
    ability: xl,
    skill: ic,
    weapon: ac,
    armor: Ol,
    shield: ql,
    equipment: _l,
    cypher: jl,
    artifact: Bl,
    descriptor: Wl,
    characterType: Ll,
    focus: Yl,
    genre: tc,
    species: nc
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
const X = "systems/magnusarchives/assets", Ha = {
  character: `${X}/icons/magnuspc.webp`,
  npc: `${X}/icons/magnusnpc.webp`
}, $a = {
  ability: `${X}/icons/magnusability.webp`,
  armor: `${X}/icons/magnusarmor.webp`,
  artifact: `${X}/icons/magnusartefact.webp`,
  cypher: `${X}/icons/magnuscypher.webp`,
  descriptor: `${X}/icons/magnusdescriptor.webp`,
  equipment: `${X}/icons/magnusequipment.webp`,
  focus: `${X}/icons/magnusfocus.webp`,
  genre: `${X}/icons/magnusgenre.webp`,
  shield: `${X}/icons/magnusshield.webp`,
  skill: `${X}/icons/magnusskill.webp`,
  species: `${X}/icons/magnusspecies.webp`,
  characterType: `${X}/icons/magnustype.webp`,
  weapon: `${X}/icons/magnusweapons.webp`
}, na = {
  gamePaused: `${X}/ui/magnusgamepaused.webp`,
  lobby: `${X}/magnuslobby.webp`,
  turnMarker: `${X}/ui/magnusturnmarker.webp`
};
function oc(n) {
  return n in Ha ? Ha[n] : null;
}
function rc(n) {
  return n in $a ? $a[n] : null;
}
function lc(n) {
  if ("prototypeToken.actorLink" in n) return !0;
  const e = n.prototypeToken;
  return !!(e && typeof e == "object" && "actorLink" in e);
}
function cc(n, e) {
  return n === "character" && !lc(e);
}
class dc extends Actor {
  static getDefaultArtwork(e) {
    const t = oc(String(e.type ?? ""));
    return t ? { img: t, texture: { src: t } } : super.getDefaultArtwork(e);
  }
  async _preCreate(e, t, i) {
    const a = await super._preCreate(e, t, i);
    return a === !1 ? !1 : (cc(this.type, e) && this.prototypeToken.updateSource({ actorLink: !0 }), a);
  }
  /**
   * Rule actions will be delegated to services in later phases.
   * The document shell intentionally contains no roll or wound logic.
   */
}
function uc(n) {
  return Object.keys(n).some((e) => e === "system.poolBonuses" || e.startsWith("system.poolBonuses.") || e === "system.poolBonusChoiceGroups" || e.startsWith("system.poolBonusChoiceGroups.") || e === "system.instance.selections.poolChoices" || e.startsWith("system.instance.selections.poolChoices.") || e === "system.instance.selections.superheroicsPool" || e === "system.superhero.superheroics.poolBonus" || e === "system" && typeof n.system == "object" && n.system !== null && ("poolBonuses" in n.system || "poolBonusChoiceGroups" in n.system || "superhero" in n.system || "instance" in n.system && typeof n.system.instance == "object" && n.system.instance !== null && "selections" in n.system.instance && typeof n.system.instance.selections == "object" && n.system.instance.selections !== null && ("poolChoices" in n.system.instance.selections || "superheroicsPool" in n.system.instance.selections)));
}
function mc(n) {
  if (n["system.equipped"] === !0) return !0;
  const e = n.system;
  return !!(e && typeof e == "object" && e.equipped === !0);
}
class pc extends Item {
  static getDefaultArtwork(e) {
    const t = rc(String(e.type ?? ""));
    return t ? { img: t } : super.getDefaultArtwork(e);
  }
  async update(e, t = {}) {
    const i = this.actor?.type === "character" ? this.actor : null, a = i && (this.type === "characterType" || this.type === "descriptor" || this.type === "species") && uc(e), s = a ? Object.fromEntries(k.map((l) => [
      l,
      Number(i.system.derived.pools[l].max)
    ])) : null, o = a ? Object.fromEntries(k.map((l) => [
      l,
      Number(i.system.stats[l].value)
    ])) : null, r = await super.update(e, t);
    if (i && (this.type === "shield" || this.type === "armor") && mc(e) && t.magnusarchivesCombatEquipmentSync !== !0 && t.magnusarchivesShieldEquipmentSync !== !0)
      for (const l of i.items)
        l.id === this.id || l.type !== this.type || l.system.equipped && await l.update(
          { "system.equipped": !1 },
          { magnusarchivesCombatEquipmentSync: !0 }
        );
    if (i && s && o) {
      const l = {};
      for (const u of k) {
        const c = Number(i.system.derived.pools[u].max);
        l[`system.stats.${u}.value`] = co(o[u], s[u], c);
      }
      await i.update(l, { magnusarchivesPackagePoolSync: !0 });
    }
    return r;
  }
}
function fc() {
  CONFIG.Actor.documentClass = dc, CONFIG.Item.documentClass = pc;
}
const lt = 1, ei = 20, aa = 1;
function kt(n) {
  const e = Number(n);
  return Number.isFinite(e) ? Math.min(
    ei,
    Math.max(lt, Math.trunc(e))
  ) : aa;
}
function gc(n) {
  return Number.isInteger(n) && Number(n) >= lt && Number(n) <= ei;
}
function Ro(n) {
  const e = kt(n);
  return e === 1 ? "neutral" : e <= 3 ? "low" : e <= 5 ? "elevated" : e <= 8 ? "severe" : e <= 12 ? "extreme" : e <= 16 ? "catastrophic" : "maximum";
}
function No(n) {
  return (kt(n) - lt) / (ei - lt) * 100;
}
const O = {
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
function hc(n) {
  game.settings.register(G, O.difficultyVisibility, {
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
  }), game.settings.register(G, O.showGmRollAudit, {
    name: "MAGNUSARCHIVES.Settings.ShowGmRollAudit.Name",
    hint: "MAGNUSARCHIVES.Settings.ShowGmRollAudit.Hint",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1
  }), game.settings.register(G, O.defaultDifficultyCeiling, {
    name: "MAGNUSARCHIVES.Settings.DifficultyCeiling.Name",
    hint: "MAGNUSARCHIVES.Settings.DifficultyCeiling.Hint",
    scope: "world",
    config: !0,
    type: Number,
    default: 10,
    range: { min: 0, max: 15, step: 1 }
  }), game.settings.register(G, O.interfaceHiddenDifficulty, {
    name: "MAGNUSARCHIVES.Settings.HiddenDifficulty.Name",
    hint: "MAGNUSARCHIVES.Settings.HiddenDifficulty.Hint",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !0
  }), game.settings.register(G, O.enabledRuleModules, {
    scope: "world",
    config: !1,
    type: Array,
    default: []
  }), game.settings.register(G, O.debugRules, {
    name: "MAGNUSARCHIVES.Settings.DebugRules.Name",
    hint: "MAGNUSARCHIVES.Settings.DebugRules.Hint",
    scope: "world",
    config: !0,
    type: Boolean,
    default: !1
  }), game.settings.register(G, O.worldSchemaVersion, {
    scope: "world",
    config: !1,
    type: Number,
    default: 1
  }), game.settings.register(G, O.theme, {
    name: "MAGNUSARCHIVES.Settings.Theme.Name",
    hint: "MAGNUSARCHIVES.Settings.Theme.Hint",
    scope: "world",
    config: !0,
    type: String,
    choices: n.choices(),
    default: "core",
    onChange: (e) => n.apply(e)
  }), game.settings.register(G, O.horrorIntrusionRange, {
    name: "MAGNUSARCHIVES.Horror.SettingName",
    hint: "MAGNUSARCHIVES.Horror.SettingHint",
    scope: "world",
    config: !1,
    type: Number,
    default: aa,
    range: {
      min: lt,
      max: ei,
      step: 1
    },
    onChange: (e) => Hooks.callAll(
      "magnusarchivesHorrorIntrusionRangeChanged",
      kt(e)
    )
  }), game.settings.register(G, O.pendingIntrusionXP, {
    scope: "world",
    config: !1,
    type: Array,
    default: [],
    onChange: (e) => Hooks.callAll("magnusarchivesIntrusionPendingChanged", e)
  });
}
function xe() {
  const n = st();
  return {
    base: {
      difficultyCeiling: Number(
        game.settings.get(G, O.defaultDifficultyCeiling)
      ),
      assetLimit: 0
    },
    enabledRuleModuleIds: n
  };
}
function st() {
  const n = game.settings.get(G, O.enabledRuleModules);
  return Array.isArray(n) ? n.filter((e) => typeof e == "string") : [];
}
function Oi() {
  const n = game.settings.get(G, O.difficultyVisibility);
  return n === "resultOnly" || n === "rollOnly" ? n : "full";
}
function Mo() {
  return game.settings.get(G, O.interfaceHiddenDifficulty) === !0;
}
function Bi() {
  return game.settings.get(G, O.showGmRollAudit) === !0;
}
function kn() {
  return typeof game > "u" ? aa : kt(
    game.settings.get(G, O.horrorIntrusionRange)
  );
}
async function yc(n) {
  if (!game.user.isGM) throw new Error(game.i18n.localize("MAGNUSARCHIVES.Horror.Errors.GMOnly"));
  if (!gc(n))
    throw new Error(game.i18n.localize("MAGNUSARCHIVES.Horror.Errors.InvalidRange"));
  return await game.settings.set(G, O.horrorIntrusionRange, n), n;
}
const sa = {
  tag: "form",
  form: {
    closeOnSubmit: !1,
    submitOnChange: !0
  }
};
function oa(n) {
  return n.system.schema.fields;
}
function ra(n, e) {
  return Object.fromEntries(Object.entries(n).map(([t, i]) => [
    t,
    e.has(t) ? function(...s) {
      if (this.isEditable)
        return i.apply(this, s);
    } : i
  ]));
}
function la(n, e, t) {
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
const Sc = Object.freeze({ minor: 2, moderate: 5 }), Uo = 10;
class Ac {
  #e;
  constructor(e) {
    this.#e = e;
  }
  costFor(e) {
    return Sc[e];
  }
  canApply(e) {
    try {
      Pe(e);
    } catch {
      return !1;
    }
    const { wounds: t, stats: i } = e.system;
    return this.rally(t, i.might.value, "minor").success || this.rally(t, i.might.value, "moderate").success;
  }
  preview(e, t, i = this.costFor(t)) {
    try {
      Pe(e);
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
    if (!Number.isInteger(o) || o < 0 || o > Uo)
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
    Pe(e);
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
function Go(n) {
  return n === "one-action" ? ["normal", "lastAction", "nonRest"] : ["normal", "nonRest"];
}
function bc(n, e) {
  if (!Go(n).includes(e))
    throw new Error(`Recovery mode '${e}' is not available for '${n}'.`);
  return e === "nonRest" ? { kind: "nonRest", lastAction: !1 } : { kind: "normal", lastAction: e === "lastAction" };
}
function Bt(n, e) {
  return Number(n[e] ?? 0);
}
function qe(n, e) {
  return String(n[e] ?? "");
}
function Va(n, e) {
  const t = n[e];
  return t === !0 || t === "true" || t === "on";
}
function Xe(n) {
  const e = n instanceof Error ? n.message : String(n);
  ui.notifications.error(e);
}
async function ca(n, e, t = game.i18n.localize("MAGNUSARCHIVES.Actions.Apply")) {
  return foundry.applications.api.DialogV2.input({
    window: { title: n },
    content: e,
    rejectClose: !1,
    ok: { label: t }
  });
}
function ki(n) {
  return n.replace(/[&<>"']/g, (e) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[e]);
}
async function wc(n, e, t) {
  const i = n.system.wounds[e].find((s) => s.id === t);
  if (!i) {
    Xe(new Error(`Wound '${t}' was not found in ${e} Wounds.`));
    return;
  }
  const a = await foundry.applications.api.DialogV2.input({
    window: { title: game.i18n.localize("MAGNUSARCHIVES.Wounds.EditTitle") },
    content: `<div class="magnusarchives-dialog-fields">
      <label>${game.i18n.localize("MAGNUSARCHIVES.Wounds.Label")}
        <input name="label" type="text" value="${ki(i.label)}">
      </label>
      <label>${game.i18n.localize("MAGNUSARCHIVES.Wounds.Description")}
        <textarea name="description">${ki(i.description)}</textarea>
      </label>
    </div>`,
    rejectClose: !1,
    ok: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Save") }
  });
  if (a)
    try {
      await game.magnusarchives.services.wounds.edit(n, e, t, {
        label: qe(a, "label"),
        description: qe(a, "description")
      }), ui.notifications.info(game.i18n.localize("MAGNUSARCHIVES.Wounds.Updated"));
    } catch (s) {
      Xe(s);
    }
}
async function vc(n, e, t) {
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
      Xe(a);
    }
}
async function Cc(n) {
  const e = await ca(
    game.i18n.localize("MAGNUSARCHIVES.Actions.ApplyWound"),
    `<div class="magnusarchives-dialog-fields">
      <label>${game.i18n.localize("MAGNUSARCHIVES.Wounds.SeverityLabel")}
        <select name="severity">
          ${fe.map((t) => `<option value="${t}">${game.i18n.localize(`MAGNUSARCHIVES.Wounds.Severity.${t}`)}</option>`).join("")}
        </select>
      </label>
      <label>${game.i18n.localize("MAGNUSARCHIVES.Wounds.Label")}
        <input name="label" type="text">
      </label>
    </div>`
  );
  if (e)
    try {
      const t = qe(e, "label"), i = await game.magnusarchives.services.wounds.apply(
        n,
        qe(e, "severity"),
        t ? { label: t } : {}
      ), a = i.applied ? `${i.appliedSeverity}${i.dead ? ` — ${game.i18n.localize("MAGNUSARCHIVES.Wounds.Dead")}` : ""}` : game.i18n.localize("MAGNUSARCHIVES.Wounds.NoFourthMajor");
      ui.notifications.info(a);
    } catch (t) {
      Xe(t);
    }
}
async function Ec(n) {
  const e = await ca(
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
        qe(e, "pool"),
        Bt(e, "damage")
      );
      ui.notifications.info(
        t.overflowSeverity ? `${t.pool}: ${t.value}; ${t.overflowSeverity} Wound` : `${t.pool}: ${t.value}`
      );
    } catch (t) {
      Xe(t);
    }
}
async function Da(n, e, t) {
  const i = n.system.recovery.slots?.length ? n.system.recovery.slots : ot(n.system.recovery.used), a = Ot(i);
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
            <select name="slotId">${a.map((c) => `<option value="${c.id}">${game.i18n.localize(`MAGNUSARCHIVES.Recovery.${c.type}`)}</option>`).join("")}</select>
          </label>
        </section>
      </div>`,
      rejectClose: !1,
      ok: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Next") }
    });
    if (!u) return;
    if (o = qe(u, "slotId"), s = a.find((c) => c.id === o)?.type, !s || !o) {
      ui.notifications.warn(game.i18n.localize("MAGNUSARCHIVES.Recovery.AlreadyUsed"));
      return;
    }
  }
  const r = Go(s), l = await foundry.applications.api.DialogV2.input({
    window: { title: `${game.i18n.localize("MAGNUSARCHIVES.Actions.Recovery")} — ${game.i18n.localize(`MAGNUSARCHIVES.Recovery.${s}`)}` },
    content: `<div class="magnusarchives magnusarchives-dialog magnusarchives-recovery-dialog">
      <header class="magnusarchives-dialog-heading">
        <span>${game.i18n.localize("MAGNUSARCHIVES.Actions.Recovery")}</span>
        <strong>${game.i18n.localize(`MAGNUSARCHIVES.Recovery.${s}`)}</strong>
      </header>
      <section class="magnusarchives-dialog-section magnusarchives-recovery-formula">
        <span class="magnusarchives-dialog-section-heading">${game.i18n.localize("MAGNUSARCHIVES.Recovery.Roll")}</span>
        <strong class="magnusarchives-dialog-value">${ki(n.system.derived.recovery.formula)}</strong>
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
      const u = bc(s, qe(l, "mode"));
      if (u.kind === "nonRest") {
        await game.magnusarchives.services.recovery.completeNonRest(n, s, o), ui.notifications.info(game.i18n.localize("MAGNUSARCHIVES.Recovery.NonRestCompleted"));
        return;
      }
      const c = await game.magnusarchives.services.recovery.rollNormal(
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
          <label><input name="majorSuccess" type="checkbox"> ${game.i18n.localize("MAGNUSARCHIVES.Rest.MajorTaskSuccess")}</label>` : s === "10-minutes" ? `<p>${game.i18n.localize("MAGNUSARCHIVES.Recovery.TenMinuteBenefit")}</p>` : "", y = await ca(
        `${game.i18n.localize("MAGNUSARCHIVES.Actions.Recovery")} — ${c.total}`,
        `<div class="magnusarchives magnusarchives-dialog magnusarchives-recovery-dialog magnusarchives-recovery-allocation-dialog">
        <section class="magnusarchives-dialog-section">
          <span class="magnusarchives-dialog-section-heading">${game.i18n.localize("MAGNUSARCHIVES.Recovery.Result")}</span>
          <div class="magnusarchives-dialog-summary-row"><span>${ki(n.system.derived.recovery.formula)}</span><strong>${c.total}</strong></div>
          ${c.lastAction ? `<div class="magnusarchives-dialog-summary-row"><span>${game.i18n.localize("MAGNUSARCHIVES.Recovery.Kind.lastAction")}</span><strong>+2</strong></div>` : ""}
        </section>
        <section class="magnusarchives-dialog-section magnusarchives-dialog-field-grid">
          <label class="magnusarchives-dialog-field">${game.i18n.localize("MAGNUSARCHIVES.Pools.Might")} <input name="might" type="number" value="0" min="0" max="${c.total}" step="1"></label>
          <label class="magnusarchives-dialog-field">${game.i18n.localize("MAGNUSARCHIVES.Pools.Speed")} <input name="speed" type="number" value="0" min="0" max="${c.total}" step="1"></label>
          <label class="magnusarchives-dialog-field">${game.i18n.localize("MAGNUSARCHIVES.Pools.Intellect")} <input name="intellect" type="number" value="0" min="0" max="${c.total}" step="1"></label>
        </section>
        ${p ? `<section class="magnusarchives-dialog-section magnusarchives-dialog-fields">${p}</section>` : ""}
      </div>`,
        game.i18n.localize("MAGNUSARCHIVES.Recovery.Recover")
      );
      if (!y) return;
      const m = await game.magnusarchives.services.recovery.completeNormal(
        n,
        c,
        {
          might: Bt(y, "might"),
          speed: Bt(y, "speed"),
          intellect: Bt(y, "intellect")
        },
        {
          oneHourChoice: qe(y, "oneHourChoice"),
          removeMinorsInsteadOfOneModerate: Va(y, "exchange"),
          majorTaskSucceeded: Va(y, "majorSuccess")
        }
      ), f = c.total - m.recovery.unspent, g = m.rest?.result.removed.length ?? 0;
      ui.notifications.info(
        `${game.i18n.localize("MAGNUSARCHIVES.Recovery.Restored")}: ${f}; ${game.i18n.localize("MAGNUSARCHIVES.Rest.Removed")}: ${g}`
      );
    } catch (u) {
      Xe(u);
    }
}
async function Ic(n) {
  const e = game.magnusarchives.services.rally, t = n.system.stats.might.value, i = n.system.derived.pools.might.max, a = e.costFor("minor"), s = e.costFor("moderate"), o = e.preview(n, "minor", a), r = await foundry.applications.api.DialogV2.input({
    window: { title: game.i18n.localize("MAGNUSARCHIVES.Actions.Rally") },
    content: Rc(
      t,
      i,
      a,
      s,
      o.success ? o.mightValue : null
    ),
    rejectClose: !1,
    ok: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Rally") },
    render: (l, u) => Nc(u.element, n)
  });
  if (r)
    try {
      const l = await game.magnusarchives.services.rally.apply(
        n,
        qe(r, "severity"),
        void 0,
        Bt(r, "cost")
      );
      if (!l.success) throw new Error(l.failure ?? "Rally failed.");
      ui.notifications.info(`${game.i18n.localize("MAGNUSARCHIVES.Actions.Rally")}: -${l.cost} Might`);
    } catch (l) {
      Xe(l);
    }
}
function Rc(n, e, t = 2, i = 5, a = null) {
  const s = game.i18n.localize("MAGNUSARCHIVES.Wounds.Severity.minor"), o = game.i18n.localize("MAGNUSARCHIVES.Wounds.Severity.moderate");
  return `<div class="magnusarchives magnusarchives-dialog magnusarchives-rally-dialog" data-current-might="${n}" data-max-might="${e}">
    <header class="magnusarchives-dialog-heading"><span>${game.i18n.localize("MAGNUSARCHIVES.Actions.Rally")}</span><strong data-rally-heading>${s}</strong></header>
    <section class="magnusarchives-dialog-section">
      <div class="magnusarchives-dialog-button-group" role="radiogroup" aria-label="${game.i18n.localize("MAGNUSARCHIVES.Wounds.SeverityLabel")}">
        <label class="magnusarchives-dialog-toggle"><input type="radio" name="severity" value="minor" data-default-cost="${t}" checked><span>${s}</span></label>
        <label class="magnusarchives-dialog-toggle"><input type="radio" name="severity" value="moderate" data-default-cost="${i}"><span>${o}</span></label>
      </div>
      <label class="magnusarchives-dialog-field">${game.i18n.localize("MAGNUSARCHIVES.Rally.Cost")}
        <input name="cost" type="number" min="0" max="${Uo}" step="1" value="${t}">
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
function Nc(n, e) {
  const t = n.querySelector('input[name="cost"]'), i = [...n.querySelectorAll('input[name="severity"]')], a = n.querySelector("[data-rally-cost]"), s = n.querySelector("[data-rally-after]"), o = n.querySelector("[data-rally-heading]"), r = n.querySelector("[data-rally-error]"), l = n.querySelector('button[data-action="ok"]');
  if (!t) return;
  const u = () => {
    const c = Number(t.value), p = i.find((m) => m.checked)?.value, y = p ? game.magnusarchives.services.rally.preview(e, p, c) : null;
    a && (a.textContent = Number.isInteger(c) ? String(c) : "—"), s && (s.textContent = y?.success ? String(y.mightValue) : "—"), r && (r.hidden = y?.success === !0, r.textContent = game.i18n.localize(y?.failure === "insufficient-might" ? "MAGNUSARCHIVES.Rally.InsufficientMight" : y?.failure === "invalid-cost" ? "MAGNUSARCHIVES.Rally.InvalidCost" : "MAGNUSARCHIVES.Rally.NoWound")), l && (l.disabled = y?.success !== !0);
  };
  for (const c of i) c.addEventListener("change", () => {
    c.checked && (t.value = String(Number(c.dataset.defaultCost ?? 0)), o && (o.textContent = c.nextElementSibling?.textContent ?? c.value), u());
  });
  t.addEventListener("input", u), u();
}
async function Mc(n, e) {
  const t = Un(n.system, e), i = await foundry.applications.api.DialogV2.input({
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
    Xe(new Error(game.i18n.localize("MAGNUSARCHIVES.Overrides.Invalid")));
    return;
  }
  await n.update({ [t.path]: a });
}
function Fa(n) {
  return n.replace(/[&<>"']/g, (e) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[e]);
}
function Ii(n, e) {
  const t = Number(n);
  if (!Number.isInteger(t)) throw new Error(`${e} must be a whole number.`);
  return t;
}
function ko(n) {
  ui.notifications.error(n instanceof Error ? n.message : String(n));
}
function Uc(n, e) {
  for (const t of fe) {
    if (!Number.isInteger(e[t])) throw new Error(`${t} modifier must be a whole number.`);
    if (n[t] + e[t] < 1)
      throw new Error(`${t} Wound capacity must remain at least 1.`);
  }
  return { ...e };
}
async function Gc(n) {
  const e = n.system.derived.wounds.calculatedCapacities, t = n.system.overrides.wounds ?? { minor: 0, moderate: 0, major: 0 }, i = await foundry.applications.api.DialogV2.input({
    window: { title: game.i18n.localize("MAGNUSARCHIVES.Overrides.WoundsEdit") },
    content: `<div class="magnusarchives magnusarchives-dialog magnusarchives-wound-override-dialog">
      <section class="magnusarchives-dialog-section">
        <span class="magnusarchives-dialog-section-heading">${game.i18n.localize("MAGNUSARCHIVES.Overrides.WoundModifiers")}</span>
        <div class="magnusarchives-dialog-field-grid">
          ${fe.map((a) => `<label class="magnusarchives-dialog-field">${game.i18n.localize(`MAGNUSARCHIVES.Wounds.Severity.${a}`)}
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
      const a = Uc(e, {
        minor: Ii(i.minor, "Minor"),
        moderate: Ii(i.moderate, "Moderate"),
        major: Ii(i.major, "Major")
      });
      await n.update({ "system.overrides.wounds": a });
    } catch (a) {
      ko(a);
    }
}
function kc(n) {
  return Ue.map((e) => `<option value="${e}"${e === n ? " selected" : ""}>${game.i18n.localize(`MAGNUSARCHIVES.Recovery.${e}`)}</option>`).join("");
}
function Ho(n) {
  return `<div class="recovery-override-slot" data-recovery-slot-id="${Fa(n.id)}">
    <i class="fa-solid fa-grip-lines" aria-hidden="true"></i>
    <select name="slotType__${Fa(n.id)}" aria-label="${game.i18n.localize("MAGNUSARCHIVES.Overrides.RecoverySlotType")}">${kc(n.type)}</select>
    <span class="recovery-slot-state">${n.used ? game.i18n.localize("MAGNUSARCHIVES.Overrides.Used") : game.i18n.localize("MAGNUSARCHIVES.Overrides.Available")}</span>
    <span class="character-settings-row-actions">
      <button type="button" class="magnusarchives-icon-action" data-recovery-slot-move="up" title="${game.i18n.localize("MAGNUSARCHIVES.Actions.MoveUp")}"><i class="fa-solid fa-arrow-up"></i></button>
      <button type="button" class="magnusarchives-icon-action" data-recovery-slot-move="down" title="${game.i18n.localize("MAGNUSARCHIVES.Actions.MoveDown")}"><i class="fa-solid fa-arrow-down"></i></button>
      <button type="button" class="magnusarchives-icon-action" data-recovery-slot-remove title="${game.i18n.localize("MAGNUSARCHIVES.Actions.Remove")}"><i class="fa-solid fa-trash"></i></button>
    </span>
  </div>`;
}
function Hc(n, e) {
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
function nn(n) {
  const e = [...n.querySelectorAll("[data-recovery-slot-id]")], t = n.querySelector('input[name="slotOrder"]');
  t && (t.value = e.map((i) => i.dataset.recoverySlotId ?? "").filter(Boolean).join(","));
  for (const [i, a] of e.entries()) {
    const s = a.querySelector('[data-recovery-slot-move="up"]'), o = a.querySelector('[data-recovery-slot-move="down"]'), r = a.querySelector("[data-recovery-slot-remove]");
    s && (s.disabled = i === 0), o && (o.disabled = i === e.length - 1), r && (r.disabled = e.length <= 1);
  }
}
function $c(n) {
  nn(n), n.addEventListener("click", (e) => {
    const t = e.target instanceof Element ? e.target.closest("button") : null;
    if (!t) return;
    const i = t.closest("[data-recovery-slot-id]"), a = n.querySelector(".recovery-override-slots");
    if (t.hasAttribute("data-recovery-slot-add") && a) {
      const s = { id: je(), type: "one-action", used: !1 };
      a.insertAdjacentHTML("beforeend", Ho(s)), nn(n);
      return;
    }
    !i || !a || (t.hasAttribute("data-recovery-slot-remove") && i.remove(), t.dataset.recoverySlotMove === "up" && i.previousElementSibling && a.insertBefore(i, i.previousElementSibling), t.dataset.recoverySlotMove === "down" && i.nextElementSibling && a.insertBefore(i.nextElementSibling, i), nn(n));
  });
}
function Vc(n, e) {
  const t = String(n.slotOrder ?? "").split(",").filter(Boolean);
  if (t.length === 0 || new Set(t).size !== t.length) throw new Error("Recovery track must contain unique slots.");
  const i = new Map(e.map((o) => [o.id, o])), a = t.map((o) => {
    const r = String(n[`slotType__${o}`] ?? "");
    if (!Ue.includes(r)) throw new Error(`Invalid Recovery type '${r}'.`);
    return { id: o, type: r, used: i.get(o)?.used ?? !1 };
  }), s = Ii(n.rollModifier, "Recovery roll modifier");
  if (s < -20 || s > 20) throw new Error("Recovery roll modifier must be between -20 and 20.");
  return { slots: a, rollModifier: s };
}
async function Dc(n) {
  const e = n.system.recovery.slots, t = await foundry.applications.api.DialogV2.input({
    window: { title: game.i18n.localize("MAGNUSARCHIVES.Overrides.RecoveryEdit") },
    content: Hc(e, n.system.recovery.rollModifier),
    rejectClose: !1,
    ok: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Save") },
    render: (i, a) => $c(a.element)
  });
  if (t)
    try {
      const i = Vc(t, e);
      await n.update({
        "system.recovery.slots": i.slots,
        "system.recovery.used": Et(i.slots),
        "system.recovery.customized": !0,
        "system.recovery.rollModifier": i.rollModifier
      });
    } catch (i) {
      ko(i);
    }
}
async function Fc(n) {
  await n.update({ "system.overrides.wounds": { minor: 0, moderate: 0, major: 0 } });
}
async function Tc(n) {
  const e = Lr(n.system.recovery.slots);
  await n.update({
    "system.recovery.slots": e,
    "system.recovery.used": Et(e),
    "system.recovery.customized": !1,
    "system.recovery.rollModifier": 0
  });
}
function zc(n) {
  const e = n?.token?.texture?.src;
  if (typeof e == "string" && e.trim()) return e;
  const t = n?.img;
  return typeof t == "string" ? t.trim() : "";
}
function Me(n) {
  const e = zc(n), t = n?.system && typeof n.system == "object" ? n.system : null, i = t?.appearance && typeof t.appearance == "object" ? t.appearance : null, a = typeof i?.color == "string" ? i.color : "", s = yo(a), o = ho(a), r = [
    ...s ? [`--magnusarchives-chat-accent: ${s}`] : [],
    ...o ? [`--magnusarchives-chat-tint: ${o}`] : []
  ].join("; ");
  return {
    ...e ? { actorImage: e } : {},
    ...r ? { chatCardStyle: r } : {}
  };
}
function Pc(n, e = []) {
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
function xc(n) {
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
function an(n) {
  if (!n || typeof n != "object") return !1;
  const e = n;
  return e.kind === "gm-intrusion" && typeof e.intrusionId == "string" && typeof e.sourceActorId == "string" && (e.mode === "targeted" || e.mode === "group" || e.mode === "free") && (e.status === "pending" || e.status === "resolving" || e.status === "resolved") && Array.isArray(e.recipients);
}
class qc {
  async publish(e, t, i = []) {
    const a = Pc(e, i), s = await this.render(a, t);
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
        ...xc(e),
        ...Me(t)
      }
    );
  }
}
const Vt = "system." + G;
function Xt() {
  return [...game.users];
}
function $o() {
  return Xt().filter((n) => n.active);
}
function pi() {
  return [...game.actors].filter((n) => n.type === "character").map((n) => n);
}
function $e(n) {
  const e = game.actors.get(n);
  return e?.type === "character" ? e : null;
}
function sn() {
  return $o().filter((n) => n.isGM).sort((n, e) => n.id.localeCompare(e.id))[0] ?? null;
}
function Dt(n, e) {
  return Xt().filter((t) => !t.isGM && (!e || t.active)).filter((t) => n.testUserPermission(t, CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER)).sort((t, i) => t.id.localeCompare(i.id));
}
function on(n) {
  const e = n.filter((t) => !t.isGM).sort((t, i) => t.id.localeCompare(i.id));
  return e.find((t) => t.active) ?? e[0] ?? null;
}
function fi(n, e) {
  const t = new Set(Xt().filter((a) => !a.isGM).map((a) => a.character?.id).filter((a) => typeof a == "string" && a.length > 0));
  return [...new Map(n.filter((a) => a.type === "character").map((a) => [a.id, a])).values()].filter((a) => a.id !== e).filter((a) => t.has(a.id)).map((a) => ({ actorId: a.id, actorName: a.name, actorImage: a.img ?? "" })).sort((a, s) => a.actorName.localeCompare(s.actorName));
}
function Ta(n) {
  if (!n || typeof n != "object") return !1;
  const e = n;
  return typeof e.intrusionId == "string" && e.intrusionId.length > 0 && typeof e.messageId == "string" && e.messageId.length > 0 && typeof e.sourceActorId == "string" && e.sourceActorId.length > 0 && Number.isInteger(e.amount) && Number(e.amount) > 0 && (e.responderUserId === void 0 || typeof e.responderUserId == "string");
}
function Oc(n) {
  if (!n || typeof n != "object") return !1;
  const e = n;
  return typeof e.intrusionId == "string" && e.intrusionId.length > 0 && e.messageId === void 0 && typeof e.sourceActorId == "string" && e.sourceActorId.length > 0 && Number.isInteger(e.amount) && Number(e.amount) > 0 && (e.responderUserId === void 0 || typeof e.responderUserId == "string");
}
function Bc(n, e) {
  return JSON.stringify(n) === JSON.stringify(e);
}
class Lc {
  #e;
  #t;
  #i = /* @__PURE__ */ new Set();
  #n = /* @__PURE__ */ new Map();
  #a = !1;
  constructor(e, t) {
    this.#e = e, this.#t = t;
  }
  initialize() {
    game.socket.on(Vt, (e) => {
      this.#d(e).catch((t) => {
        console.error(G + " | GM Intrusion socket error", t), game.user.isGM && ui.notifications.error(t instanceof Error ? t.message : String(t));
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
      const t = e.actorIds.map($e).filter((o) => o !== null), i = xe();
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
        const o = on(Dt(s, !1)), r = fi(pi(), s.id), l = await this.#t.publish(a, s, r), u = {
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
      if (!sn()) {
        ui.notifications.warn(game.i18n.localize("MAGNUSARCHIVES.Intrusion.NoActiveGM"));
        return;
      }
      game.socket.emit(Vt, { type: "create-free", actorId: e.id, naturalRoll: t.naturalRoll });
    }
  }
  async retryPendingDistributions() {
    if (this.#m())
      for (const e of this.#u()) await this.#c(e);
  }
  async requestDistribution(e, t) {
    const i = this.#A(e), a = $e(i.sourceActorId);
    if (!a || !this.#s(a, i))
      throw new Error(game.i18n.localize("MAGNUSARCHIVES.Intrusion.Errors.NotAuthorized"));
    if (this.#m()) {
      await this.#o(e, t, game.user.id);
      return;
    }
    if (!sn()) throw new Error(game.i18n.localize("MAGNUSARCHIVES.Intrusion.Errors.NoActiveGM"));
    const s = je();
    await new Promise((o, r) => {
      const l = setTimeout(() => {
        this.#n.delete(s), r(new Error(game.i18n.localize("MAGNUSARCHIVES.Intrusion.Errors.RequestTimeout")));
      }, 1e4);
      this.#n.set(s, { resolve: o, reject: r, timeout: l }), game.socket.emit(Vt, {
        type: "distribution-choice",
        intrusionId: e,
        recipientActorId: t,
        requesterUserId: game.user.id,
        requestId: s
      });
    });
  }
  async #l(e, t) {
    const i = $e(e);
    if (!i) throw new Error(game.i18n.localize("MAGNUSARCHIVES.Intrusion.Errors.CharacterMissing"));
    const a = xe(), s = await this.#e.createFree(i, t, a.enabledRuleModuleIds ?? []);
    Hooks.callAll("magnusarchivesGMIntrusionCreated", s);
  }
  #r(e, t) {
    const i = e.getFlag(G, "gmIntrusion");
    if (!an(i)) return;
    const a = this.#u().find((r) => r.intrusionId === i.intrusionId), s = a ? $e(a.sourceActorId) : null, o = i.status === "pending" && (game.user.isGM || !!(a && s && this.#s(s, a)));
    for (const r of t.querySelectorAll("[data-action='assignSharedIntrusionXp']")) {
      if (!o) {
        r.remove();
        continue;
      }
      r.dataset.magnusarchivesIntrusionBound !== "true" && (r.dataset.magnusarchivesIntrusionBound = "true", r.addEventListener("click", (l) => {
        l.preventDefault(), l.stopPropagation();
        const u = r.dataset.recipientActorId;
        !u || r.disabled || (r.disabled = !0, this.requestDistribution(i.intrusionId, u).catch((c) => {
          r.disabled = !1, ui.notifications.error(c instanceof Error ? c.message : String(c));
        }));
      }));
    }
  }
  #s(e, t) {
    return game.user.isGM ? !0 : game.user.id === t.responderUserId && e.testUserPermission(game.user, CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER);
  }
  async #c(e, t = !1) {
    const i = $e(e.sourceActorId), a = game.messages.get(e.messageId);
    if (!i || !a) {
      await this.#p(e.intrusionId);
      return;
    }
    let s = e.responderUserId ? Xt().find((l) => l.id === e.responderUserId) ?? null : null;
    (!s || !Dt(i, !1).some((l) => l.id === s?.id)) && (s = on(Dt(i, !1)), s && (e = { ...e, responderUserId: s.id }, await this.#f(e)));
    const o = a.getFlag(G, "gmIntrusion");
    if (!an(o) || o.status !== "pending") return;
    const r = fi(pi(), i.id);
    (t || !Bc(o.recipients, r)) && await this.#t.update(a, { ...o, recipients: r }, i);
  }
  async #o(e, t, i) {
    if (this.#i.has(e))
      throw new Error(game.i18n.localize("MAGNUSARCHIVES.Intrusion.Errors.AlreadyResolved"));
    this.#i.add(e);
    let a = !1, s = null, o = null, r = null;
    try {
      const l = this.#A(e);
      r = $e(l.sourceActorId);
      const u = $e(t);
      if (o = game.messages.get(l.messageId) ?? null, !r || !u || !o)
        throw new Error(game.i18n.localize("MAGNUSARCHIVES.Intrusion.Errors.CharacterMissing"));
      const c = o.getFlag(G, "gmIntrusion");
      if (!an(c) || c.intrusionId !== e || c.status !== "pending")
        throw new Error(game.i18n.localize("MAGNUSARCHIVES.Intrusion.Errors.AlreadyResolved"));
      s = c;
      const p = $o().find((g) => g.id === i);
      if (!(p?.isGM === !0 || !!(p && p.id === l.responderUserId && Dt(r, !0).some((g) => g.id === p.id)))) throw new Error(game.i18n.localize("MAGNUSARCHIVES.Intrusion.Errors.NotAuthorized"));
      const f = fi(pi(), r.id).find((g) => g.actorId === u.id);
      if (!f) throw new Error(game.i18n.localize("MAGNUSARCHIVES.Intrusion.Errors.RecipientUnavailable"));
      await this.#t.update(o, { ...c, status: "resolving" }, r), await this.#e.distributeSecondXp(r, u, l.amount), a = !0, await this.#p(e), await this.#t.update(o, {
        ...c,
        status: "resolved",
        recipients: [],
        resolvedRecipient: f
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
          await this.#o(e.intrusionId, e.recipientActorId, e.requesterUserId), game.socket.emit(Vt, {
            type: "distribution-result",
            requestId: e.requestId,
            recipientUserId: e.requesterUserId,
            success: !0
          });
        } catch (t) {
          throw game.socket.emit(Vt, {
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
    const e = game.settings.get(G, O.pendingIntrusionXP);
    return Array.isArray(e) ? e.filter(Ta).map((t) => ({
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
    i < 0 ? t.push(e) : t[i] = e, await game.settings.set(G, O.pendingIntrusionXP, t);
  }
  async #p(e) {
    await game.settings.set(
      G,
      O.pendingIntrusionXP,
      this.#u().filter((t) => t.intrusionId !== e)
    );
  }
  async #h() {
    const e = game.settings.get(G, O.pendingIntrusionXP), t = [];
    for (const i of Array.isArray(e) ? e : []) {
      if (Ta(i)) {
        $e(i.sourceActorId) && game.messages.get(i.messageId) && t.push({
          intrusionId: i.intrusionId,
          messageId: i.messageId,
          sourceActorId: i.sourceActorId,
          amount: i.amount,
          ...i.responderUserId ? { responderUserId: i.responderUserId } : {}
        });
        continue;
      }
      if (!Oc(i)) continue;
      const a = $e(i.sourceActorId), s = [...game.messages].find(
        (u) => u.getFlag(G, "gmIntrusionId") === i.intrusionId
      );
      if (!a || !s) continue;
      const o = i.responderUserId ? Xt().find((u) => u.id === i.responderUserId) : on(Dt(a, !1)), r = this.#e.policy(xe().enabledRuleModuleIds ?? []), l = {
        kind: "gm-intrusion",
        intrusionId: i.intrusionId,
        mode: "targeted",
        sourceActorId: a.id,
        sourceActorName: a.name,
        targetXp: r.targetedXpToTarget,
        sharedXp: i.amount,
        status: "pending",
        recipients: fi(pi(), a.id)
      };
      await this.#t.update(s, l, a), t.push({
        intrusionId: i.intrusionId,
        messageId: s.id,
        sourceActorId: i.sourceActorId,
        amount: i.amount,
        ...o ? { responderUserId: o.id } : {}
      });
    }
    (!Array.isArray(e) || JSON.stringify(e) !== JSON.stringify(t)) && await game.settings.set(G, O.pendingIntrusionXP, t);
  }
  #m() {
    return game.user.isGM && sn()?.id === game.user.id;
  }
}
let Lt = null;
function jc(n, e) {
  return Lt = new Lc(n, e), Lt.initialize(), Lt;
}
function ti() {
  if (!Lt) throw new Error("GM Intrusion controller is not ready.");
  return Lt;
}
async function da(n, e) {
  await game.magnusarchives.services.rollChat.publish(n, e, Oi(), {
    showGmAudit: Bi()
  }), await ti().requestFreeFromNaturalResult(n, e.result);
}
function ve(n, e) {
  if (!Number.isFinite(e)) throw new Error("Step modifier amount must be finite.");
  const t = Math.abs(Math.trunc(e));
  return t === 0 ? "0" : `${n === "ease" ? "+" : "-"}${t}`;
}
function Wc(n) {
  if (!Number.isFinite(n)) throw new Error("Net step modifier must be finite.");
  return n === 0 ? "0" : ve(n > 0 ? "ease" : "hinder", n);
}
const za = /* @__PURE__ */ new Set([
  "manual.skill",
  "manual.other-ease",
  "manual.other-hindrance",
  "core.assets",
  "core.effort.paid",
  "core.effort.free"
]);
function ct(n) {
  return String(n).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function ua(n) {
  return game.i18n.localize(n);
}
function ma(n, e) {
  return e(`MAGNUSARCHIVES.Pools.${n[0].toUpperCase()}${n.slice(1)}`);
}
function Pa(n, e) {
  return e.context.difficulty.mode === "hidden" && n.id.startsWith("npc-modification.");
}
function xa(n, e) {
  return {
    id: n.id,
    label: e(n.label),
    modifier: ve(n.direction, n.steps),
    direction: n.direction
  };
}
function _c(n, e, t) {
  const i = n.breakdown.filter((c) => Pa(c, n)), a = n.breakdown.filter((c) => !Pa(c, n)), s = a.filter((c) => za.has(c.id)).map((c) => xa(c, t)), o = a.filter((c) => !za.has(c.id)).map((c) => xa(c, t)), r = n.context.difficulty.mode === "known", l = n.context.pool;
  if (l === null) throw new Error("Configured rolls require a Pool.");
  const u = e.system.stats[l].value;
  return {
    rollLabel: t(n.context.label),
    pool: l,
    poolLabel: ma(l, t),
    modifiers: s,
    automaticModifiers: o,
    netModifier: i.length === 0 ? Wc(n.netSteps) : null,
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
function qa(n) {
  const e = {};
  for (const t of n.querySelectorAll("[name]"))
    e[t.name] = t instanceof HTMLInputElement && t.type === "checkbox" ? t.checked : t.value;
  return e;
}
function se(n, e) {
  return String(n[e] ?? "");
}
function j(n, e) {
  return Number(n[e] ?? 0);
}
function Kc(n, e) {
  const t = n[e];
  return t === !0 || t === "true" || t === "on";
}
function ii(n, e) {
  const t = se(n, "difficulty").trim();
  return t ? {
    mode: Kc(n, "hidden") ? "hidden" : "known",
    value: Number(t)
  } : { mode: "unknown" };
}
function ni(n) {
  const e = j(n, "situationalSteps");
  return se(n, "situationalDirection") === "hinder" ? { otherEase: 0, otherHindrance: e } : { otherEase: e, otherHindrance: 0 };
}
function he(n, e = 0) {
  return Array.from({ length: n + 1 }, (t, i) => `<option value="${i}"${i === e ? " selected" : ""}>${i}</option>`).join("");
}
function Vo(n) {
  return ["might", "speed", "intellect"].map((e) => `<option value="${e}"${e === n ? " selected" : ""}>${ct(ma(e, ua))}</option>`).join("");
}
const Xc = Object.freeze({
  inability: -1,
  untrained: 0,
  trained: 1,
  specialized: 2,
  expert: 3
});
function St(n) {
  return Xc[n];
}
function pa(n = 0, e = "") {
  return te.map((t) => {
    const i = St(t), a = game.i18n.localize(`MAGNUSARCHIVES.Skill.Ranks.${t}`), s = i === 0 ? game.i18n.localize("MAGNUSARCHIVES.Roll.Unmodified") : ve(i > 0 ? "ease" : "hinder", i);
    return `<option value="${e}${i}"${n !== null && i === n ? " selected" : ""}>${ct(a)} · ${s}</option>`;
  }).join("");
}
function ai() {
  return `<div class="roll-dialog-inline-field roll-dialog-situational">
    <span class="roll-dialog-field-label">${game.i18n.localize("MAGNUSARCHIVES.Roll.SituationalModifier")}</span>
    <select name="situationalDirection" aria-label="${game.i18n.localize("MAGNUSARCHIVES.Roll.ModifierDirection")}">
      <option value="ease">${game.i18n.localize("MAGNUSARCHIVES.Roll.Ease")}</option>
      <option value="hinder">${game.i18n.localize("MAGNUSARCHIVES.Roll.Hinder")}</option>
    </select>
    <input name="situationalSteps" type="number" value="0" min="0" max="10" step="1" aria-label="${game.i18n.localize("MAGNUSARCHIVES.Roll.ModifierSteps")}">
  </div>`;
}
function si(n, e) {
  return `<div class="roll-dialog-inline-field roll-dialog-difficulty-field">
    <label>${game.i18n.localize("MAGNUSARCHIVES.Roll.BaseDifficulty")}
      <input name="difficulty" type="number" min="0" max="${n}" step="1" placeholder="${game.i18n.localize("MAGNUSARCHIVES.Roll.Optional")}">
    </label>
    ${e ? `<label class="roll-dialog-checkbox"><input name="hidden" type="checkbox"> ${game.i18n.localize("MAGNUSARCHIVES.Roll.HiddenDifficulty")}</label>` : ""}
  </div>`;
}
function oi(n) {
  return `<div class="magnusarchives magnusarchives-dialog magnusarchives-dialog-fields magnusarchives-roll-dialog">
    <div class="roll-dialog-layout">
      <section class="roll-dialog-settings" aria-labelledby="magnusarchives-roll-settings-heading">
        <header class="roll-dialog-panel-header">
          <span class="roll-dialog-kicker" id="magnusarchives-roll-settings-heading">${game.i18n.localize("MAGNUSARCHIVES.Roll.Settings")}</span>
          <strong>${ct(n.identity)}</strong>
        </header>
        <div class="roll-dialog-settings-grid">${n.settings}</div>
      </section>
      <aside class="roll-dialog-summary" aria-labelledby="magnusarchives-roll-summary-heading" aria-live="polite">
        <header class="roll-dialog-panel-header">
          <span class="roll-dialog-kicker" id="magnusarchives-roll-summary-heading">${game.i18n.localize("MAGNUSARCHIVES.Roll.Summary")}</span>
          <strong data-roll-summary="label">${ct(n.identity)}</strong>
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
function ae(n, e, t = "") {
  return `<div class="roll-summary-row ${t}"><span>${ct(n)}</span><strong>${ct(e)}</strong></div>`;
}
function Oa(n) {
  return n.length === 0 ? `<p class="roll-summary-empty">${game.i18n.localize("MAGNUSARCHIVES.Common.None")}</p>` : n.map((e) => ae(
    e.label,
    e.modifier,
    e.direction === "ease" ? "is-ease" : "is-hindrance"
  )).join("");
}
function Ye(n, e, t) {
  const i = n.querySelector(`[data-roll-summary="${e}"]`);
  i && (i.innerHTML = t);
}
function Tt(n, e, t) {
  const i = n.querySelector(`[data-roll-summary="${e}"]`);
  i && (i.textContent = t);
}
function Yc(n, e, t) {
  Tt(n, "label", e.rollLabel), Tt(n, "pool", e.poolLabel), Ye(n, "modifiers", Oa(e.modifiers)), Tt(n, "net", e.netModifier ?? game.i18n.localize("MAGNUSARCHIVES.Roll.HiddenValue"));
  const i = n.querySelector('[data-roll-summary-section="automatic"]');
  i && (i.hidden = e.automaticModifiers.length === 0), Ye(n, "automatic", Oa(e.automaticModifiers));
  const a = n.querySelector('[data-roll-summary-section="effort"]');
  a && (a.hidden = e.totalEffortApplied === 0), Ye(n, "effort", [
    ae(
      game.i18n.localize("MAGNUSARCHIVES.Roll.PaidAppliedEffort"),
      `${e.paidEffortApplied} / ${e.effortMaximum}`
    ),
    ae(game.i18n.localize("MAGNUSARCHIVES.Roll.FreeAppliedEffort"), String(e.freeEffortApplied)),
    ae(
      game.i18n.localize("MAGNUSARCHIVES.Roll.TotalAppliedEffort"),
      e.totalEffortMaximum === null ? `${e.totalEffortApplied} / ${game.i18n.localize("MAGNUSARCHIVES.Genre.Unlimited")}` : `${e.totalEffortApplied} / ${e.totalEffortMaximum}`,
      e.totalEffortMaximum !== null && e.totalEffortApplied === e.totalEffortMaximum ? "is-total" : ""
    )
  ].join(""));
  const s = e.difficultyMode === "hidden" ? ae(game.i18n.localize("MAGNUSARCHIVES.Roll.BaseDifficulty"), game.i18n.localize("MAGNUSARCHIVES.Roll.HiddenValue")) : e.difficultyMode === "unknown" ? ae(game.i18n.localize("MAGNUSARCHIVES.Roll.BaseDifficulty"), game.i18n.localize("MAGNUSARCHIVES.Roll.NotProvided")) : [
    ae(game.i18n.localize("MAGNUSARCHIVES.Roll.BaseDifficulty"), String(e.baseDifficulty)),
    ae(
      game.i18n.localize("MAGNUSARCHIVES.Roll.FinalDifficulty"),
      e.automaticSuccess ? game.i18n.localize("MAGNUSARCHIVES.Roll.AutomaticSuccess") : String(e.finalDifficulty)
    ),
    ae(game.i18n.localize("MAGNUSARCHIVES.Roll.TargetNumber"), String(e.targetNumber))
  ].join("");
  Ye(n, "difficulty", s);
  const o = n.querySelector('[data-roll-summary-section="attack"]');
  o && t !== void 0 && (o.hidden = !t, Ye(n, "attack", t));
  const r = [
    ...e.actionCost > 0 ? [ae(game.i18n.localize("MAGNUSARCHIVES.Roll.ActionCost"), String(e.actionCost))] : [],
    ...e.effortCost > 0 ? [ae(game.i18n.localize("MAGNUSARCHIVES.Roll.EffortCost"), String(e.effortCost))] : [],
    ...e.edgeApplied > 0 ? [ae(game.i18n.localize("MAGNUSARCHIVES.Roll.EdgeApplied"), `-${e.edgeApplied}`)] : [],
    ae(game.i18n.localize("MAGNUSARCHIVES.Roll.TotalCost"), `${e.totalCost} ${e.poolLabel}`, "is-total"),
    ae(game.i18n.localize("MAGNUSARCHIVES.Roll.PoolAfterRoll"), `${e.poolValue} → ${e.poolAfter}`)
  ];
  Ye(n, "cost", r.join(""));
  const l = ["might", "speed", "intellect"].map((u) => {
    const c = e.pool === u ? e.poolAfter : null, p = e.pool === u ? e.poolValue : null, y = n.dataset[`pool${u[0].toUpperCase()}${u.slice(1)}`], m = n.dataset[`pool${u[0].toUpperCase()}${u.slice(1)}Max`], f = n.dataset[`pool${u[0].toUpperCase()}${u.slice(1)}Edge`];
    return `<div class="roll-summary-pool${e.pool === u ? " is-selected" : ""}">
      <span>${ct(ma(u, ua))}</span>
      <strong>${p === null ? y : `${p} → ${c}`} / ${m}</strong>
      <small>${game.i18n.localize("MAGNUSARCHIVES.Pools.Edge")} ${f}</small>
    </div>`;
  }).join("");
  Ye(n, "character", `${l}<div class="roll-summary-effort"><span>${game.i18n.localize("MAGNUSARCHIVES.Character.Effort")}</span><strong>${e.effortUsed} / ${e.effortMaximum}</strong></div>`), Tt(n, "error", e.poolValue < e.totalCost ? game.i18n.localize("MAGNUSARCHIVES.Roll.InsufficientPool") : "");
}
function ri(n, e) {
  for (const i of ["might", "speed", "intellect"]) {
    const a = `pool${i[0].toUpperCase()}${i.slice(1)}`;
    n.dataset[a] = String(e.actor.system.stats[i].value), n.dataset[`${a}Max`] = String(e.actor.system.derived.pools[i].max), n.dataset[`${a}Edge`] = String(e.actor.system.derived.pools[i].edge);
  }
  const t = () => {
    try {
      const i = e.buildRequest(qa(n)), a = game.magnusarchives.services.rolls.preview(e.actor, i, e.policyRequest);
      Yc(
        n,
        _c(a, e.actor, ua),
        e.attackSummary?.(qa(n), a)
      );
    } catch (i) {
      Tt(n, "error", i instanceof Error ? i.message : String(i));
    }
  };
  return n.addEventListener("input", t), n.addEventListener("change", t), t(), t;
}
function Ba(n) {
  return {
    label: "MAGNUSARCHIVES.Roll.TaskRoll",
    pool: se(n, "pool"),
    difficulty: ii(n),
    skillSteps: j(n, "skillSteps"),
    assets: j(n, "assets"),
    paidEffort: j(n, "paidEffort"),
    freeEffort: j(n, "freeEffort"),
    ...ni(n),
    purpose: "task"
  };
}
function Jc(n) {
  ui.notifications.error(n instanceof Error ? n.message : String(n));
}
async function Qc(n, e = "might") {
  const t = xe(), i = game.magnusarchives.rules.resolveDifficultyPolicy(
    t.base,
    t.enabledRuleModuleIds ?? []
  ), a = `
    ${si(i.difficultyCeiling, Mo())}
    <label>${game.i18n.localize("MAGNUSARCHIVES.Pools.Pool")}
      <select name="pool">${Vo(e)}</select>
    </label>
    <label>${game.i18n.localize("MAGNUSARCHIVES.Roll.SkillLevel")}
      <select name="skillSteps">${pa()}</select>
    </label>
    <label>${game.i18n.localize("MAGNUSARCHIVES.Roll.Assets")}
      <select name="assets">${he(i.assetLimit)}</select>
    </label>
    <label>${game.i18n.localize("MAGNUSARCHIVES.Roll.EffortToEase")}
      <select name="paidEffort">${he(n.system.derived.effort.max)}</select>
    </label>
    <label>${game.i18n.localize("MAGNUSARCHIVES.Roll.FreeEffort")}
      <input name="freeEffort" type="number" value="0" min="0" step="1">
    </label>
    ${ai()}`, s = await foundry.applications.api.DialogV2.input({
    window: { title: game.i18n.localize("MAGNUSARCHIVES.Roll.TaskRoll"), resizable: !0 },
    position: { width: 800 },
    content: oi({
      identity: `${n.name} · ${game.i18n.localize("MAGNUSARCHIVES.Roll.Task")}`,
      settings: a
    }),
    rejectClose: !1,
    ok: { label: game.i18n.localize("MAGNUSARCHIVES.Roll.Roll") },
    render: (o, r) => {
      ri(r.element, {
        actor: n,
        policyRequest: t,
        buildRequest: Ba
      });
    }
  });
  if (s)
    try {
      const o = await game.magnusarchives.services.rolls.execute(
        n,
        Ba(s),
        t
      );
      await da(n, o);
    } catch (o) {
      Jc(o);
    }
}
function rn(n, e) {
  return n === e ? " selected" : "";
}
function Zc(n, e) {
  const t = se(n, "skillRank");
  return te.includes(t) ? t : e;
}
function La(n, e, t) {
  const i = se(e, "pool");
  return game.magnusarchives.services.skills.buildRollRequest(n, {
    ...i === "might" || i === "speed" || i === "intellect" ? { pool: i } : {},
    rankOverride: Zc(e, n.system.rank),
    difficulty: ii(e),
    assets: j(e, "assets"),
    paidEffort: j(e, "paidEffort"),
    freeEffort: j(e, "freeEffort"),
    ...ni(e),
    enabledRuleModuleIds: t
  });
}
async function ed(n, e) {
  const t = xe(), i = t.enabledRuleModuleIds ?? [], a = game.magnusarchives.rules.resolveDifficultyPolicy(t.base, i), s = game.magnusarchives.services.skills.configuredPool(e) ?? "choose", o = `
    ${s === "choose" ? `<option value="" selected disabled>${game.i18n.localize("MAGNUSARCHIVES.Skill.ChoosePool")}</option>` : ""}
    <option value="might"${rn(s, "might")}>${game.i18n.localize("MAGNUSARCHIVES.Pools.Might")}</option>
    <option value="speed"${rn(s, "speed")}>${game.i18n.localize("MAGNUSARCHIVES.Pools.Speed")}</option>
    <option value="intellect"${rn(s, "intellect")}>${game.i18n.localize("MAGNUSARCHIVES.Pools.Intellect")}</option>`, r = te.map((c) => `<option value="${c}"${c === e.system.rank ? " selected" : ""}>${game.i18n.localize(`MAGNUSARCHIVES.Skill.Ranks.${c}`)} · ${St(c) === 0 ? game.i18n.localize("MAGNUSARCHIVES.Roll.Unmodified") : St(c) > 0 ? `+${St(c)}` : St(c)}</option>`).join(""), l = `
    ${si(a.difficultyCeiling, Mo())}
    <label>${game.i18n.localize("MAGNUSARCHIVES.Pools.Pool")}<select name="pool">${o}</select></label>
    <label>${game.i18n.localize("MAGNUSARCHIVES.Roll.SkillLevel")}<select name="skillRank">${r}</select></label>
    <label>${game.i18n.localize("MAGNUSARCHIVES.Roll.Assets")}<select name="assets">${he(a.assetLimit)}</select></label>
    <label>${game.i18n.localize("MAGNUSARCHIVES.Roll.EffortToEase")}<select name="paidEffort">${he(n.system.derived.effort.max)}</select></label>
    <label>${game.i18n.localize("MAGNUSARCHIVES.Roll.FreeEffort")}<input name="freeEffort" type="number" value="0" min="0" step="1"></label>
    ${ai()}`, u = await foundry.applications.api.DialogV2.input({
    window: { title: `${game.i18n.localize("MAGNUSARCHIVES.Skill.Roll")}: ${e.name}`, resizable: !0 },
    position: { width: 800 },
    content: oi({ identity: e.name, settings: l }),
    rejectClose: !1,
    ok: { label: game.i18n.localize("MAGNUSARCHIVES.Roll.Roll") },
    render: (c, p) => {
      ri(p.element, {
        actor: n,
        policyRequest: t,
        buildRequest: (y) => La(e, y, i)
      });
    }
  });
  if (u)
    try {
      const c = La(e, u, i), p = await game.magnusarchives.services.rolls.execute(n, c, t);
      await da(n, p);
    } catch (c) {
      ui.notifications.error(c instanceof Error ? c.message : String(c));
    }
}
function Hi(n) {
  const e = n.token, t = n.tokenId ?? e?.id, i = n.tokenUuid ?? e?.uuid;
  return {
    actorId: n.id,
    ...n.actorUuid ?? n.uuid ? { actorUuid: n.actorUuid ?? n.uuid } : {},
    ...t ? { tokenId: t } : {},
    ...i ? { tokenUuid: i } : {}
  };
}
function Yt(n, e) {
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
  return !(t instanceof Actor) || t.type !== "npc" ? null : Yt(t, {
    actorId: t.id,
    actorUuid: t.uuid,
    ...e.id ? { tokenId: e.id } : {},
    ...e.uuid ? { tokenUuid: e.uuid } : {}
  });
}
function Fo(n) {
  const e = n.document ?? n, t = n.actor ?? e.actor ?? null;
  return !(t instanceof Actor) || t.type !== "character" ? null : Yt(t, {
    actorId: t.id,
    actorUuid: t.uuid,
    ...e.id ? { tokenId: e.id } : {},
    ...e.uuid ? { tokenUuid: e.uuid } : {}
  });
}
function Hn(n) {
  if (n.tokenId) {
    const e = canvas.tokens?.get(n.tokenId)?.actor;
    return e instanceof Actor ? e : null;
  }
  return n.tokenUuid ? null : game.actors.get(n.actorId) ?? null;
}
async function $n(n) {
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
  return n.tokenId || n.tokenUuid ? null : Hn(n);
}
function td(n, e) {
  return String(n[e] ?? "");
}
function To(n) {
  return [...n.items].filter((e) => e instanceof Item && e.type === "skill").map((e) => e).sort((e, t) => e.name.localeCompare(t.name));
}
function zo(n, e = "manual:0") {
  const t = e.startsWith("manual:") ? Number(e.slice(7)) : null;
  return [
    `<optgroup label="${game.i18n.localize("MAGNUSARCHIVES.Roll.ManualSkillLevel")}">${pa(t, "manual:")}</optgroup>`,
    `<optgroup label="${game.i18n.localize("MAGNUSARCHIVES.Skill.Title")}">`,
    ...To(n).map((i) => `<option value="${i.id}"${i.id === e ? " selected" : ""}>${i.name} — ${game.i18n.localize(`MAGNUSARCHIVES.Skill.Ranks.${i.system.rank}`)}</option>`),
    "</optgroup>"
  ].join("");
}
function Po(n, e) {
  return To(n).find((t) => t.id === e);
}
function xo(n) {
  const e = se(n, "skillId");
  return e.startsWith("manual:") ? Number(e.slice(7)) : 0;
}
function id(n, e) {
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
  return i && td(i, "choice") === "damage" ? "damage" : "effect";
}
async function nd(n, e) {
  const t = xe(), i = t.enabledRuleModuleIds ?? [], a = game.magnusarchives.rules.resolveDifficultyPolicy(t.base, i), s = game.magnusarchives.services.combat.policy(i), o = game.magnusarchives.services.targets.nativeNpcTargets(), l = o.length > 0 ? `<div class="roll-dialog-context"><strong>${game.i18n.localize("MAGNUSARCHIVES.Combat.Targets")}</strong><span>${o.map((A) => A.name).join(", ")}</span><small>${game.i18n.localize("MAGNUSARCHIVES.Combat.HiddenTargetDifficulty")}</small></div>` : si(a.difficultyCeiling, !0), u = game.magnusarchives.services.combat.weaponAttackPool(e), c = `manual:${St(e.system.skillLevel ?? "untrained")}`, p = (A) => {
    const v = Po(n, se(A, "skillId"));
    return {
      pool: se(A, "pool"),
      targets: o,
      difficulty: ii(A),
      ...v ? { skill: v } : {},
      skillSteps: xo(A),
      assets: j(A, "assets"),
      paidEffort: j(A, "paidEffort"),
      damageEffort: j(A, "damageEffort"),
      freeDamageEffort: j(A, "freeDamageEffort"),
      freeEffort: j(A, "freeEffort"),
      ...ni(A),
      extremeRange: se(A, "extremeRange") === "true" || A.extremeRange === !0 || A.extremeRange === "on",
      enabledRuleModuleIds: i
    };
  }, y = (A) => {
    const v = game.magnusarchives.services.combat.buildWeaponAttackPlan(n, e, p(A)).requests[0];
    if (!v) throw new Error("Weapon attack preview did not produce a roll request.");
    return v;
  }, m = game.magnusarchives.services.combat.weaponBaseDamage(e, s), f = `
    ${l}
    <label>${game.i18n.localize("MAGNUSARCHIVES.Pools.Pool")}<select name="pool">${Vo(u)}</select></label>
    <label>${game.i18n.localize("MAGNUSARCHIVES.Roll.SkillLevel")}<select name="skillId">${zo(n, c)}</select></label>
    <label>${game.i18n.localize("MAGNUSARCHIVES.Roll.Assets")}<select name="assets">${he(a.assetLimit)}</select></label>
    <label>${game.i18n.localize("MAGNUSARCHIVES.Roll.EffortToEase")}<select name="paidEffort">${he(n.system.derived.effort.max)}</select></label>
    <label>${game.i18n.localize("MAGNUSARCHIVES.Combat.DamageEffort")}<select name="damageEffort">${he(n.system.derived.effort.max)}</select></label>
    <label>${game.i18n.localize("MAGNUSARCHIVES.Roll.FreeDamageEffort")}<input name="freeDamageEffort" type="number" value="0" min="0" step="1"></label>
    <label>${game.i18n.localize("MAGNUSARCHIVES.Roll.FreeEffort")}<input name="freeEffort" type="number" value="0" min="0" step="1"></label>
    ${ai()}
    ${e.system.attackType === "ranged" ? `<label class="roll-dialog-checkbox"><input name="extremeRange" type="checkbox"> ${game.i18n.localize("MAGNUSARCHIVES.Combat.Weapon.ExtremeRange")}</label>` : ""}`, g = await foundry.applications.api.DialogV2.input({
    window: { title: `${game.i18n.localize("MAGNUSARCHIVES.Combat.Attack")}: ${e.name}`, resizable: !0 },
    position: { width: 800 },
    content: oi({ identity: e.name, settings: f, attackSummary: " " }),
    rejectClose: !1,
    ok: { label: game.i18n.localize("MAGNUSARCHIVES.Combat.Attack") },
    render: (A, v) => {
      ri(v.element, {
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
          ...se(E, "extremeRange") === "true" || E.extremeRange === !0 ? [`<div class="roll-summary-row is-hindrance"><span>${game.i18n.localize("MAGNUSARCHIVES.Combat.Weapon.ExtremeRange")}</span><strong>-1</strong></div>`] : []
        ].join("")
      });
    }
  });
  if (g)
    try {
      let A = await game.magnusarchives.services.combat.executeWeaponAttack(
        n,
        e,
        p(g),
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
          Oi(),
          Bi()
        );
      const E = A[0];
      E && await ti().requestFreeFromNaturalResult(n, E.execution.result);
    } catch (A) {
      ui.notifications.error(A instanceof Error ? A.message : String(A));
    }
}
async function Vn(n, e, t) {
  if (e === "blockWithShield")
    try {
      const m = await game.magnusarchives.services.shields.normalizeEquipped(n);
      if (!m || game.magnusarchives.services.shields.isBroken(m))
        return ui.notifications.warn(game.i18n.localize("MAGNUSARCHIVES.Shield.BlockUnavailable")), !1;
    } catch (m) {
      return ui.notifications.error(m instanceof Error ? m.message : String(m)), !1;
    }
  const i = xe(), a = i.enabledRuleModuleIds ?? [], s = game.magnusarchives.rules.resolveDifficultyPolicy(i.base, a), o = t ? `<div class="roll-dialog-context"><strong>${t.source.name} → ${n.name}</strong><small>${game.i18n.localize("MAGNUSARCHIVES.Combat.HiddenTargetDifficulty")}</small></div>` : si(s.difficultyCeiling, !0), r = game.magnusarchives.services.combat.applicableDefenseSkills(
    n,
    e,
    a
  )[0], l = id(n, e), u = (m) => {
    const f = Po(n, se(m, "skillId"));
    return {
      ...f ? { skill: f } : {},
      skillSteps: xo(m),
      assets: j(m, "assets"),
      paidEffort: j(m, "paidEffort"),
      freeEffort: j(m, "freeEffort"),
      ...ni(m),
      enabledRuleModuleIds: a
    };
  }, c = (m) => t ? game.magnusarchives.services.combat.buildDefenseAgainstNpcRequest(
    n,
    t.source,
    e,
    u(m)
  ) : game.magnusarchives.services.combat.buildDefenseRequest(n, e, {
    ...u(m),
    difficulty: ii(m)
  }), p = `
    ${o}
    <div class="roll-dialog-context roll-dialog-fixed-pool"><strong>${game.i18n.localize("MAGNUSARCHIVES.Pools.Pool")}</strong><span>${game.i18n.localize(`MAGNUSARCHIVES.Pools.${l.pool === "speed" ? "Speed" : "Might"}`)}</span></div>
    <label>${game.i18n.localize("MAGNUSARCHIVES.Roll.SkillLevel")}<select name="skillId">${zo(n, r?.id)}</select></label>
    <label>${game.i18n.localize("MAGNUSARCHIVES.Roll.Assets")}<select name="assets">${he(s.assetLimit)}</select></label>
    <label>${game.i18n.localize("MAGNUSARCHIVES.Roll.EffortToEase")}<select name="paidEffort">${he(n.system.derived.effort.max)}</select></label>
    <label>${game.i18n.localize("MAGNUSARCHIVES.Roll.FreeEffort")}<input name="freeEffort" type="number" value="0" min="0" step="1"></label>
    ${ai()}`, y = await foundry.applications.api.DialogV2.input({
    window: { title: game.i18n.localize(`MAGNUSARCHIVES.Combat.Defense.${e}`), resizable: !0 },
    position: { width: 800 },
    content: oi({
      identity: game.i18n.localize(`MAGNUSARCHIVES.Combat.Defense.${e}`),
      settings: p
    }),
    rejectClose: !1,
    ok: { label: game.i18n.localize("MAGNUSARCHIVES.Roll.Roll") },
    render: (m, f) => {
      ri(f.element, { actor: n, policyRequest: i, buildRequest: c });
    }
  });
  if (!y) return !1;
  try {
    const m = c(y), f = await game.magnusarchives.services.rolls.execute(n, m, i), A = (t ? await game.magnusarchives.services.combat.resolveDefenseDamage(
      n,
      f.result,
      e,
      t.effect,
      t.stressAmount,
      t.source,
      a
    ) : null) ?? { recipient: "none" };
    return await game.magnusarchives.services.combatChat.publishDefense(
      n,
      f,
      A,
      t?.source ?? null,
      Oi(),
      Bi()
    ), await ti().requestFreeFromNaturalResult(n, f.result), !0;
  } catch (m) {
    return ui.notifications.error(m instanceof Error ? m.message : String(m)), !1;
  }
}
async function ad(n) {
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
async function $i(n) {
  try {
    const e = await game.magnusarchives.services.depletion.roll(n);
    await game.magnusarchives.services.depletionChat.publish(n, e);
  } catch (e) {
    ui.notifications.error(e instanceof Error ? e.message : String(e));
  }
}
const ja = 2, Wa = 1e3;
function Jt(n) {
  const e = String(n.die).trim().match(/^d(\d+)$/i), t = Number(e?.[1]);
  if (!Number.isInteger(t) || t < ja || t > Wa)
    throw new Error(`Depletion die must have ${ja} to ${Wa} sides.`);
  return t;
}
function sd(n) {
  return `1d${Jt(n)}`;
}
function ln(n) {
  const e = Jt(n), t = Number(n.threshold);
  if (!Number.isInteger(t) || t < 1 || t > e)
    throw new Error(`Depletion threshold must be between 1 and ${e}.`);
  return `${Oo(t)} in 1d${e}`;
}
function Oo(n) {
  return n === 1 ? "1" : `1-${n}`;
}
function od(n) {
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
function rd(n, e) {
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
function ld(n) {
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
  const i = t.abilitySnapshot.name || t.id, a = ld(i), s = t.abilitySnapshot.description || game.i18n.localize("MAGNUSARCHIVES.Focus.MissingAbility");
  await foundry.applications.api.DialogV2.input({
    window: { title: i },
    content: `<div class="magnusarchives magnusarchives-dialog magnusarchives-focus-snapshot"><h3>${a}</h3><div>${s}</div></div>`,
    rejectClose: !1,
    ok: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Close") }
  });
}
function _a(n, e) {
  return {
    left: n.left - e.left,
    top: n.top - e.top,
    width: n.width,
    height: n.height
  };
}
function cd(n, e) {
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
function dd(n) {
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
    const c = cd(
      _a(l.getBoundingClientRect(), i),
      _a(u.getBoundingClientRect(), i)
    );
    r.setAttribute("x1", String(c.x1)), r.setAttribute("y1", String(c.y1)), r.setAttribute("x2", String(c.x2)), r.setAttribute("y2", String(c.y2));
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
    for (const e of this.#i) dd(e);
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
function ud(n, e, t, i = 8) {
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
    const a = e.getBoundingClientRect(), s = i.getBoundingClientRect(), o = e.ownerDocument.defaultView, r = ud(a, s, {
      width: o?.innerWidth ?? e.ownerDocument.documentElement.clientWidth,
      height: o?.innerHeight ?? e.ownerDocument.documentElement.clientHeight
    });
    i.style.left = `${r.left}px`, i.style.top = `${r.top}px`, this.#i = e, this.#t = i;
  }
}
class Rt extends Error {
  diagnostics;
  constructor(e) {
    super(e.map((t) => t.message).join("; ")), this.name = "FocusGraphValidationError", this.diagnostics = e;
  }
}
function md(n, e) {
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
function Dn(n) {
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
  return !e.some((s) => s.severity === "error") && md(n, t) && e.push({
    severity: "warning",
    code: "directed-cycle",
    message: "Focus graph contains a directed cycle; evaluation remains direct and deterministic."
  }), e;
}
function pd(n) {
  const e = Dn(n), t = e.filter((i) => i.severity === "error");
  if (t.length > 0) throw new Rt(t);
  return e;
}
class fa {
  evaluate(e, t) {
    if (!Number.isInteger(t.tier) || t.tier < 1)
      throw new Error("Character Tier must be an integer of at least 1.");
    const i = [...pd(e)], a = new Set(e.nodes.map((c) => c.id)), s = new Set(t.ownedNodeIds);
    for (const c of s)
      a.has(c) || i.push({
        severity: "warning",
        code: "unknown-owned-node",
        nodeId: c,
        message: `Focus progression references unknown node '${c}'.`
      });
    const o = /* @__PURE__ */ new Map();
    for (const c of e.nodes) o.set(c.id, []);
    for (const c of e.connections)
      o.get(c.to).push(c.from);
    const r = new Set(e.nodes.filter((c) => c.tier === 1 && s.has(c.id)).map((c) => c.id));
    let l = !0;
    for (; l; ) {
      l = !1;
      for (const c of e.connections)
        r.has(c.from) && s.has(c.to) && !r.has(c.to) && (r.add(c.to), l = !0);
    }
    for (const c of e.nodes)
      c.tier > 1 && s.has(c.id) && !r.has(c.id) && i.push({
        severity: "warning",
        code: "invalid-owned-progression",
        nodeId: c.id,
        message: `Owned node '${c.abilitySnapshot.name || c.id}' is no longer connected to an owned Tier 1 path.`
      });
    const u = e.nodes.map((c) => {
      const p = [...new Set((o.get(c.id) ?? []).filter((y) => r.has(y)))].sort((y, m) => y.localeCompare(m));
      return s.has(c.id) ? {
        node: c,
        state: "owned",
        reason: "owned",
        requiredTier: c.tier,
        reachableFrom: p
      } : c.tier === 1 ? {
        node: c,
        state: "available",
        reason: "tier-one-choice",
        requiredTier: c.tier,
        reachableFrom: []
      } : p.length > 0 && c.tier > t.tier ? {
        node: c,
        state: "future",
        reason: "tier-too-low",
        requiredTier: c.tier,
        reachableFrom: p
      } : p.length > 0 ? {
        node: c,
        state: "available",
        reason: "connected-from-owned",
        requiredTier: c.tier,
        reachableFrom: p
      } : {
        node: c,
        state: "locked",
        reason: "no-owned-prerequisite",
        requiredTier: c.tier,
        reachableFrom: []
      };
    }).sort((c, p) => c.node.tier - p.node.tier || c.node.id.localeCompare(p.node.id));
    return {
      characterTier: t.tier,
      ownedNodeIds: [...s].sort((c, p) => c.localeCompare(p)),
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
class Le extends Error {
  constructor() {
    super("Grant conflict resolution was cancelled."), this.name = "GrantConflictCancelledError";
  }
}
function Wo(n, e) {
  return `${n}:${String(e ?? "").trim().toLocaleLowerCase().replace(/\s+/g, " ")}`;
}
function Ne(n, e, t = "") {
  return { type: n, contentUuid: t, contentKey: Wo(n, e) };
}
function fd(n) {
  if (n.type !== "ability" && n.type !== "skill") return null;
  const e = n.system.grantedBy ?? {};
  return {
    type: n.type,
    contentUuid: String(e.contentUuid ?? ""),
    contentKey: String(e.contentKey || Wo(n.type, n.name))
  };
}
function gd(n, e) {
  return n.type !== e.type ? !1 : n.contentUuid && e.contentUuid ? n.contentUuid === e.contentUuid : n.contentKey === e.contentKey;
}
function _o(n, e) {
  return !!Li(n, e);
}
function Li(n, e) {
  return [...n].find((t) => {
    const i = fd(t);
    return i ? gd(i, e) : !1;
  }) ?? null;
}
class ce extends Error {
  code;
  dependentNodeIds;
  constructor(e, t, i = []) {
    super(t), this.name = "FocusAcquisitionError", this.code = e, this.dependentNodeIds = i;
  }
}
const hd = async (n) => {
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
function gi(n, e) {
  return n.focusUuid === e.uuid || n.focusUuid === e.id;
}
function Ka(n, e, t) {
  return n.type === "ability" && n.system.sourceFocusUuid === e && n.system.sourceNodeId === t;
}
function cn(n, e) {
  const t = `${n}\0${e}`;
  let i = 2166136261, a = 2654435769;
  for (let s = 0; s < t.length; s += 1) {
    const o = t.charCodeAt(s);
    i = Math.imul(i ^ o, 16777619) >>> 0, a = Math.imul(a ^ o + s, 2246822507) >>> 0;
  }
  return `${i.toString(16).padStart(8, "0")}${a.toString(16).padStart(8, "0")}`;
}
class yd {
  #e;
  #t;
  #i;
  #n = /* @__PURE__ */ new Map();
  constructor(e = new fa(), t = hd, i = Date.now) {
    this.#e = e, this.#t = t, this.#i = i;
  }
  missingOwnedNodeIds(e, t, i) {
    const a = [...e.items];
    return new Set(i.ownedNodeIds.filter((s) => !a.some((o) => Ka(o, t.uuid, s))));
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
      u = this.#e.evaluateProgress(t.system.graph, B(e.system), l).nodes.find((A) => A.node.id === i);
    } catch (A) {
      if (!(A instanceof Rt)) throw A;
    }
    const c = e.system.advancement.pendingFocusChoices.find((A) => A.focusUuid === "" || A.focusUuid === t.uuid || A.focusUuid === t.id), p = s && !a && u?.state === "available" && !!c;
    let y = !1, m = !1, f = null;
    if (!this.#d(e, t.uuid, i)) {
      const A = await this.#o(t, r);
      if (!this.#d(e, t.uuid, i)) {
        const v = this.#A(e, t, r, A);
        if (v) {
          if (!o)
            throw new ce(
              "duplicate-grant",
              `Focus node '${i}' grants an Ability already present on this Character; choose a replacement with the GM.`
            );
          const E = await o(v);
          if (E.action === "cancel") throw new Le();
          if (E.action !== "gmOverride")
            throw new ce(
              "duplicate-grant",
              "A Focus node cannot be replaced by an arbitrary Ability. Choose another valid node or use an explicit GM Override."
            );
          m = !0;
        } else
          f = await this.#f(e, t, i, A), y = !!f;
      }
    }
    if (!this.#p(e, t).ownedNodeIds.includes(i)) {
      const A = e.system.focusProgress.map((v) => gi(v, t) ? {
        ...v,
        ownedNodeIds: [...v.ownedNodeIds, i],
        acquisitions: [
          ...v.acquisitions ?? [],
          this.#u(
            i,
            a || m ? "gmOverride" : p ? "choice" : "manualOverride",
            p ? c : null
          )
        ]
      } : { ...v, ownedNodeIds: [...v.ownedNodeIds], acquisitions: [...v.acquisitions ?? []] });
      try {
        await e.update({
          "system.focusProgress": A,
          ...p && !m && c ? {
            "system.advancement.pendingFocusChoices": e.system.advancement.pendingFocusChoices.filter((v) => v.id !== c.id)
          } : {}
        });
      } catch (v) {
        throw f?.delete && await f.delete(), v;
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
    const r = e.system.focusProgress.map((l) => gi(l, t) ? {
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
      throw new ce("undo-not-owned", `Focus node '${i}' is not owned.`);
    const o = s.ownedNodeIds.filter((g) => g !== i), r = new Set(this.#s(
      t,
      B(e.system),
      s.ownedNodeIds
    )), l = this.#s(t, B(e.system), o), u = l.filter((g) => !r.has(g));
    if (u.length > 0 && !a.force)
      throw new ce(
        "undo-dependent-nodes",
        `Undo would invalidate acquired descendant nodes: ${u.join(", ")}.`,
        u
      );
    const c = (s.acquisitions ?? []).find((g) => g.nodeId === i), p = c && c.choiceSource !== "none" && c.choiceId ? {
      id: c.choiceId,
      source: c.choiceSource,
      grantTier: c.choiceGrantTier,
      focusUuid: c.choiceFocusUuid
    } : null, y = e.system.focusProgress.map((g) => gi(g, t) ? {
      ...g,
      ownedNodeIds: o,
      acquisitions: (g.acquisitions ?? []).filter((A) => A.nodeId !== i)
    } : { ...g, ownedNodeIds: [...g.ownedNodeIds], acquisitions: [...g.acquisitions ?? []] }), m = p && !e.system.advancement.pendingFocusChoices.some((g) => g.id === p.id) ? [...e.system.advancement.pendingFocusChoices, p] : [...e.system.advancement.pendingFocusChoices];
    await e.update({
      "system.focusProgress": y,
      "system.advancement.pendingFocusChoices": m
    });
    let f = !1;
    if (a.deleteAbility) {
      const g = this.#d(e, t.uuid, i);
      g?.delete && (await g.delete(), f = !0);
    }
    return { choiceRestored: p, abilityDeleted: f, invalidOwnedNodeIds: l };
  }
  #s(e, t, i) {
    try {
      return this.#e.invalidOwnedNodeIds(e.system.graph, t, i);
    } catch (a) {
      if (a instanceof Rt) return [];
      throw a;
    }
  }
  async #c(e, t, i) {
    this.#m(e);
    const a = this.#h(t, i);
    if (!this.#p(e, t).ownedNodeIds.includes(i))
      throw new ce(
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
        _id: cn(e.uuid, t.id),
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
      throw new ce(
        "ability-data-unavailable",
        `Focus node '${t.id}' has neither a valid source Ability nor a usable snapshot.`
      );
    return {
      _id: cn(e.uuid, t.id),
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
    return [...e.items].find((a) => Ka(a, t, i)) ?? null;
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
    const o = (a.system ?? {}).grantedBy ?? {}, r = Ne("ability", String(a.name ?? i.abilitySnapshot.name), String(o.contentUuid ?? i.abilityUuid)), l = Li(e.items, r);
    if (!l) return null;
    const c = (l.system ?? {}).grantedBy ?? {}, p = Ne("ability", l.name ?? "", String(c.contentUuid ?? ""));
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
        contentUuid: String(c.contentUuid ?? p.contentUuid),
        contentKey: String(c.contentKey ?? p.contentKey)
      },
      proposed: {
        id: cn(t.uuid, i.id),
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
      throw new ce(
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
    const i = e.system.focusProgress.filter((a) => gi(a, t));
    if (i.length === 0)
      throw new ce(
        "progress-missing",
        `Character has no progression entry for Focus '${t.uuid}'.`
      );
    if (i.length > 1)
      throw new ce(
        "progress-duplicated",
        `Character has duplicate progression entries for Focus '${t.uuid}'.`
      );
    return i[0];
  }
  #h(e, t) {
    const i = e.system.graph.nodes.find((a) => a.id === t);
    if (!i)
      throw new ce("node-not-found", `Focus node '${t}' was not found.`);
    return i;
  }
  #m(e) {
    if (e.type !== "character")
      throw new ce("not-character", "Focus acquisition requires a Character.");
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
class _ extends Error {
  constructor(e, t) {
    super(t), this.code = e, this.name = "AdvancementError";
  }
  code;
}
const Sd = async (n) => {
  try {
    const e = await fromUuid(n);
    if (!e || typeof e != "object" || !("type" in e)) return null;
    const t = e;
    return t.type === "skill" ? t : null;
  } catch {
    return null;
  }
}, Ad = () => globalThis.crypto?.randomUUID?.() ?? `adv-${Date.now()}-${Math.random().toString(36).slice(2)}`;
function bd(n) {
  return n.system.category === "attack" || n.system.category === "defense" || n.system.contexts.some((e) => e === "attack" || e.startsWith("attack.") || e === "defense" || e.startsWith("defense."));
}
function wd(n) {
  return n === "inability" ? "untrained" : n === "untrained" ? "trained" : n === "trained" ? "specialized" : null;
}
function Xa(n) {
  return [...new Set(n)];
}
class vd {
  #e;
  #t;
  #i;
  #n;
  #a = /* @__PURE__ */ new Map();
  constructor(e, t = Ad, i = Date.now, a = Sd) {
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
      options: Yn.map((o) => {
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
    const i = B(e.system);
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
      t.add(B(e.system)), await e.update({
        "system.advancement.guidanceCompletedTiers": [...t].sort((i, a) => i - a)
      });
    });
  }
  async resetProgressionGuidance(e) {
    return this.#u(e, async () => {
      this.#c(e), await e.update({
        "system.advancement.guidanceCompletedTiers": (e.system.advancement.guidanceCompletedTiers ?? []).filter((t) => t !== B(e.system))
      });
    });
  }
  skillTrainingOptions(e, t = []) {
    const i = this.policy(t);
    return [...e.items].filter((a) => a.type === "skill" && te.includes(a.system.rank)).map((a) => {
      const s = wd(a.system.rank), o = s === "trained" ? i.attackDefenseTrainingTier : s === "specialized" ? i.attackDefenseSpecializationTier : 0, r = !!(s && bd(a) && B(e.system) < o);
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
        throw new _(
          "purchase-not-found",
          "That current-cycle Advancement purchase is unavailable."
        );
      const o = s[0];
      if (o.tier !== B(e.system))
        throw new _(
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
        throw new _("tier-not-ready", "Four Advancements are required before advancing Tier.");
      const a = di(e.system, "tier", 1), s = a.value, o = {
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
      throw new _("cycle-complete", "This advancement cycle is complete.");
    if (t.kind === "other") {
      if (o.some((f) => f.kind === "other"))
        throw new _("other-already-purchased", "Other Advancement is unique per cycle.");
    } else if (o.some((f) => f.kind === t.kind))
      throw new _("already-purchased", "That Advancement was already purchased this cycle.");
    const r = a ? 0 : s.xpCost;
    if (e.system.xp < r)
      throw new _("insufficient-xp", "This Character does not have enough XP.");
    const l = B(e.system), u = {};
    let c = null, p = null, y;
    if (t.kind === "increaseCapabilities") {
      const f = Object.values(t.allocation);
      if (f.some((g) => !Number.isInteger(g) || g < 0) || f.reduce((g, A) => g + A, 0) !== s.capabilityPoints)
        throw new _("invalid-allocation", "Pool allocation must distribute exactly four points.");
      for (const g of ["might", "speed", "intellect"]) {
        const A = t.allocation[g], v = di(
          e.system,
          `${g}Max`,
          A
        );
        u[v.path] = v.value;
        const E = v.overrideActive ? v.value : e.system.derived.pools[g].max + A;
        u[`system.stats.${g}.value`] = Math.min(
          e.system.stats[g].value + A,
          E
        );
      }
    } else if (t.kind === "moveTowardPerfection") {
      const f = di(
        e.system,
        `${t.pool}Edge`,
        1
      );
      u[f.path] = f.value;
    } else if (t.kind === "extraEffort") {
      if (this.#o(e) >= s.effortMaximum)
        throw new _("effort-maximum", "Core Effort is already at its maximum.");
      const f = di(e.system, "effort", 1);
      u[f.path] = f.value;
    } else if (t.kind === "skillTraining")
      if (t.mode === "improve") {
        const f = this.skillTrainingOptions(e, i).find((A) => A.id === t.skillId), g = [...e.items].find((A) => A.id === t.skillId && A.type === "skill");
        if (!f || !g) throw new _("skill-not-found", "Skill Item not found.");
        if (f.reason === "maximum" || !f.nextRank)
          throw new _("skill-maximum", "This Skill cannot be improved by Core Advancement.");
        if (f.reason === "tier")
          throw new _("skill-tier", "Attack and defense training is not available at this Tier.");
        c = { skill: g, rank: g.system.rank }, y = f.nextRank;
      } else {
        const f = await this.#r(e, t, s);
        if (p = (await e.createEmbeddedDocuments("Item", [f]))[0] ?? null, !p) throw new Error("Foundry did not create the learned Skill Item.");
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
    }), c && y && await c.skill.update({ "system.rank": y });
    try {
      await e.update(u);
    } catch (f) {
      throw c && await c.skill.update({ "system.rank": c.rank }), p?.delete && await p.delete(), f;
    }
    return { ...y ? { skillRank: y } : {}, record: m };
  }
  async #r(e, t, i) {
    const a = t.sourceUuid ? await this.#n(t.sourceUuid) : null;
    if (t.sourceUuid && !a)
      throw new _("skill-not-found", "The selected Skill source is unavailable.");
    const s = a?.name.trim() || t.customName?.trim() || "";
    if (!s) throw new _("skill-not-found", "A new custom Skill requires a name.");
    if ([...e.items].some((c) => c.type === "skill" && (c.name.trim().toLocaleLowerCase() === s.toLocaleLowerCase() || !!(a?.uuid && c.system.acquisition?.grantedByUuid === a.uuid))))
      throw new _("duplicate-skill", "This Character already owns that Skill.");
    const r = a?.system.category ?? t.customCategory ?? "general", l = a?.system.contexts ?? (r === "general" ? [] : [r]), u = r === "attack" || r === "defense" || l.some((c) => c === "attack" || c.startsWith("attack.") || c === "defense" || c.startsWith("defense."));
    if (u && B(e.system) < i.attackDefenseTrainingTier)
      throw new _("skill-tier", "Attack and defense training is not available at this Tier.");
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
        grantTier: B(e.system),
        focusUuid: ""
      };
      a["system.advancement.pendingFocusChoices"] = [
        ...e.system.advancement.pendingFocusChoices,
        s
      ];
    } else if (t === "armor")
      a["system.proficiencies.armorCategories"] = Xa([
        ...e.system.proficiencies.armorCategories,
        ...Be
      ]);
    else if (t === "weapons")
      a["system.proficiencies.weaponCategories"] = Xa([
        ...e.system.proficiencies.weaponCategories,
        ...Oe
      ]);
    else {
      if (B(e.system) < 3)
        throw new _("genre-tier", "Genre Advancement requires Tier 3 or higher.");
      const s = {
        id: this.#t(),
        source: "otherAdvancement",
        grantTier: B(e.system)
      };
      a["system.advancement.pendingGenreChoices"] = [
        ...e.system.advancement.pendingGenreChoices,
        s
      ];
    }
  }
  #c(e) {
    if (e.type !== "character")
      throw new _("not-character", "Advancement requires a Character.");
  }
  #o(e) {
    return e.system.derived.effort?.max ?? ht(e.system.stats.effortBase, e.system.overrides?.effort);
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
function hi(n) {
  return n.replace(/[&<>"']/g, (e) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[e]);
}
const Cd = {
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
function Je(n, e) {
  return String(n[e] ?? "");
}
function dn(n, e) {
  return Number(n[e] ?? 0);
}
function Ed() {
  return ["might", "speed", "intellect"].map((n) => `<option value="${n}">${game.i18n.localize(`MAGNUSARCHIVES.Pools.${n[0].toUpperCase()}${n.slice(1)}`)}</option>`).join("");
}
async function mt(n, e) {
  return foundry.applications.api.DialogV2.input({
    window: { title: n },
    content: `<div class="magnusarchives-dialog-fields">${e}</div>`,
    rejectClose: !1,
    ok: { label: game.i18n.localize("MAGNUSARCHIVES.Advancement.Purchase") }
  });
}
function ga(n) {
  n instanceof _ ? ui.notifications.error(game.i18n.localize(Cd[n.code])) : (console.error(n), ui.notifications.error(game.i18n.localize("MAGNUSARCHIVES.Advancement.Errors.Unexpected")));
}
async function Id(n, e) {
  const t = game.i18n.localize(`MAGNUSARCHIVES.Advancement.Option.${e}`);
  if (e === "increaseCapabilities") {
    const i = await mt(t, `
      <p>${game.i18n.localize("MAGNUSARCHIVES.Advancement.CapabilitiesPrompt")}</p>
      <label>${game.i18n.localize("MAGNUSARCHIVES.Pools.Might")}<input name="might" type="number" min="0" max="4" value="0"></label>
      <label>${game.i18n.localize("MAGNUSARCHIVES.Pools.Speed")}<input name="speed" type="number" min="0" max="4" value="0"></label>
      <label>${game.i18n.localize("MAGNUSARCHIVES.Pools.Intellect")}<input name="intellect" type="number" min="0" max="4" value="0"></label>`);
    return i ? { kind: e, allocation: {
      might: dn(i, "might"),
      speed: dn(i, "speed"),
      intellect: dn(i, "intellect")
    } } : null;
  }
  if (e === "moveTowardPerfection") {
    const i = await mt(t, `<label>${game.i18n.localize("MAGNUSARCHIVES.Advancement.ChoosePool")}<select name="pool">${Ed()}</select></label>`);
    return i ? { kind: e, pool: Je(i, "pool") } : null;
  }
  if (e === "skillTraining") {
    const i = await mt(t, `<label>${game.i18n.localize("MAGNUSARCHIVES.Advancement.SkillMode")}<select name="mode">
      <option value="learn">${game.i18n.localize("MAGNUSARCHIVES.Advancement.LearnNewSkill")}</option>
      <option value="improve">${game.i18n.localize("MAGNUSARCHIVES.Advancement.ImproveExistingSkill")}</option>
    </select></label>`);
    if (!i) return null;
    if (Je(i, "mode") === "learn") {
      const r = [...game.items].filter((c) => c.type === "skill").sort((c, p) => c.name.localeCompare(p.name)), l = await mt(t, `
        <label>${game.i18n.localize("MAGNUSARCHIVES.Advancement.SkillSource")}<select name="sourceUuid">
          <option value="custom">${game.i18n.localize("MAGNUSARCHIVES.Advancement.CustomSkill")}</option>
          ${r.map((c) => `<option value="${hi(c.uuid)}">${hi(c.name)}</option>`).join("")}
        </select></label>
        <label>${game.i18n.localize("MAGNUSARCHIVES.Advancement.CustomSkillName")}<input name="customName" type="text"></label>
        <label>${game.i18n.localize("MAGNUSARCHIVES.Skill.Category")}<select name="customCategory">
          <option value="general">${game.i18n.localize("MAGNUSARCHIVES.Advancement.SkillCategory.general")}</option>
          <option value="attack">${game.i18n.localize("MAGNUSARCHIVES.Advancement.SkillCategory.attack")}</option>
          <option value="defense">${game.i18n.localize("MAGNUSARCHIVES.Advancement.SkillCategory.defense")}</option>
        </select></label>`);
      if (!l) return null;
      const u = Je(l, "sourceUuid");
      return u === "custom" ? {
        kind: e,
        mode: "learn",
        customName: Je(l, "customName"),
        customCategory: Je(l, "customCategory")
      } : { kind: e, mode: "learn", sourceUuid: u };
    }
    const s = game.magnusarchives.services.advancement.skillTrainingOptions(
      n,
      st()
    ).filter((r) => r.eligible);
    if (s.length === 0)
      return ui.notifications.warn(game.i18n.localize("MAGNUSARCHIVES.Advancement.NoEligibleSkills")), null;
    const o = await mt(t, `<label>${game.i18n.localize("MAGNUSARCHIVES.Advancement.ChooseSkill")}<select name="skillId">${s.map((r) => `<option value="${hi(r.id)}">${hi(r.name)} — ${game.i18n.localize(`MAGNUSARCHIVES.Skill.Ranks.${r.currentRank}`)} → ${game.i18n.localize(`MAGNUSARCHIVES.Skill.Ranks.${r.nextRank}`)}</option>`).join("")}</select></label>`);
    return o ? { kind: e, mode: "improve", skillId: Je(o, "skillId") } : null;
  }
  if (e === "other") {
    const i = to.filter((s) => s !== "genre" || B(n.system) >= 3), a = await mt(t, `<label>${game.i18n.localize("MAGNUSARCHIVES.Advancement.OtherType")}<select name="otherKind">${i.map((s) => `<option value="${s}">${game.i18n.localize(`MAGNUSARCHIVES.Advancement.Other.${s}`)}</option>`).join("")}</select></label>`);
    return a ? { kind: e, otherKind: Je(a, "otherKind") } : null;
  }
  return { kind: e };
}
async function Rd(n, e) {
  const t = await Id(n, e);
  if (t)
    try {
      await game.magnusarchives.services.advancement.purchase(
        n,
        t,
        st()
      ), ui.notifications.info(game.i18n.localize("MAGNUSARCHIVES.Advancement.PurchasedNotice"));
    } catch (i) {
      ga(i);
    }
}
async function Nd(n, e) {
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
    return ga(i), !1;
  }
}
async function Md(n) {
  try {
    const e = await game.magnusarchives.services.advancement.advanceTier(
      n,
      st()
    );
    ui.notifications.info(game.i18n.format("MAGNUSARCHIVES.Advancement.TierAdvancedNotice", { tier: e.tier }));
  } catch (e) {
    ga(e);
  }
}
class Te extends Error {
  constructor(e, t) {
    super(t), this.code = e, this.name = "FocusAssociationError";
  }
  code;
}
const Ud = () => globalThis.crypto?.randomUUID?.() ?? `focus-${Date.now()}-${Math.random().toString(36).slice(2)}`;
class Gd {
  #e;
  #t;
  #i = /* @__PURE__ */ new Map();
  constructor(e = Ud, t = Date.now) {
    this.#e = e, this.#t = t;
  }
  async attach(e, t, i) {
    return this.#r(e, async () => {
      if (this.#n(e, t), e.system.focusProgress.some((l) => this.#a(l, t)))
        throw new Te("duplicate", "This Focus is already attached.");
      if (i === "creation") {
        if (B(e.system) !== 1)
          throw new Te("creation-tier", "A creation Focus requires a Tier 1 Character.");
        if (e.system.focusProgress.some((l) => l.provenance === "creation"))
          throw new Te("creation-focus-exists", "This Character already has a creation Focus.");
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
        throw new Te("not-character", "Focus association requires a Character.");
      const i = e.system.focusProgress.find((s) => s.focusUuid === t);
      if (!i) throw new Te("progress-missing", "Focus progression was not found.");
      const a = e.system.advancement.pendingFocusChoices.filter((s) => s.focusUuid === t).map((s) => s.id);
      return await e.update({
        "system.focusProgress": e.system.focusProgress.filter((s) => s !== i),
        "system.advancement.pendingFocusChoices": e.system.advancement.pendingFocusChoices.filter((s) => s.focusUuid !== t)
      }), { progress: i, removedPendingChoiceIds: a };
    });
  }
  #n(e, t) {
    if (e.type !== "character")
      throw new Te("not-character", "Focus association requires a Character.");
    if (t.type !== "focus" || !t.uuid)
      throw new Te("not-focus", "Only a Focus Item can be attached.");
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
function un(n) {
  return n.replace(/[&<>"']/g, (e) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[e]);
}
function Ko(n) {
  const e = n instanceof Te ? `MAGNUSARCHIVES.Focus.Association.Errors.${n.code}` : "MAGNUSARCHIVES.Focus.Errors.Unexpected";
  n instanceof Te || console.error(n), ui.notifications.error(game.i18n.localize(e));
}
async function Ya(n, e) {
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
        <select name="focusUuid">${s.map((r) => `<option value="${un(r.uuid)}">${un(r.name)}</option>`).join("")}</select></label></div>`,
      ok: { label: game.i18n.localize("MAGNUSARCHIVES.Focus.Association.Add") }
    });
    if (!o) return;
    t = await fromUuid(String(o.focusUuid ?? "")) ?? void 0;
  }
  if (!t) return;
  const i = B(n.system) === 1 && !n.system.focusProgress.some((s) => s.provenance === "creation"), a = await foundry.applications.api.DialogV2.input({
    window: { title: game.i18n.localize("MAGNUSARCHIVES.Focus.Association.Add") },
    content: `<div class="magnusarchives-dialog-fields">
      <p><strong>${un(t.name)}</strong></p>
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
async function kd(n, e) {
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
class de extends Error {
  constructor(e, t) {
    super(t), this.code = e, this.name = "CharacterInitializationError";
  }
  code;
}
const Hd = async (n) => {
  try {
    const e = await fromUuid(n);
    if (!e || typeof e != "object" || !("type" in e)) return null;
    const t = e;
    return t.type === "skill" ? t : null;
  } catch {
    return null;
  }
};
function Ja(n) {
  return n.trim().replace(/\s+/g, " ").toLocaleLowerCase();
}
class $d {
  #e;
  #t;
  constructor(e = Hd, t = Date.now) {
    this.#e = e, this.#t = t;
  }
  async setup(e, t) {
    this.#n(e);
    const i = Object.values(t.pools);
    if (i.some((p) => !Number.isInteger(p) || p < 0) || i.reduce((p, y) => p + y, 0) !== 6)
      throw new de("invalid-pools", "Core Setup must distribute exactly six Pool points.");
    const a = t.skills.filter((p) => p.rank === "trained"), s = t.skills.filter((p) => p.rank === "inability");
    if (!(a.length === 2 && s.length === 0 || a.length === 3 && s.length === 1))
      throw new de(
        "invalid-skills",
        "Core Setup requires two trained Skills, or three trained Skills and one different Inability."
      );
    const r = await Promise.all(t.skills.map((p) => this.#i(p))), l = new Set([...e.items].filter((p) => p.type === "skill").map((p) => Ja(p.name))), u = /* @__PURE__ */ new Set();
    for (const p of r) {
      const y = Ja(String(p.name));
      if (!y || l.has(y) || u.has(y))
        throw new de("duplicate-skill", "Starting Skills must all be different.");
      u.add(y);
    }
    const c = await e.createEmbeddedDocuments("Item", r);
    try {
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
        "system.creation": {
          coreInitialized: !0,
          mode: "completed",
          initializedAt: this.#t()
        }
      }), !e.system.creation.coreInitialized)
        throw new de(
          "state-not-persisted",
          "Foundry did not expose the persisted Core initialization state after update."
        );
    } catch (p) {
      throw await Promise.allSettled(c.map((y) => y.delete?.())), p;
    }
  }
  async markInitialized(e, t) {
    if (e.type !== "character")
      throw new de("not-character", "Core Setup requires a Character.");
    if (!e.system.creation.coreInitialized && (await e.update({ "system.creation": {
      coreInitialized: !0,
      mode: t,
      initializedAt: this.#t()
    } }), !e.system.creation.coreInitialized))
      throw new de(
        "state-not-persisted",
        "Foundry did not expose the persisted Core initialization state after update."
      );
  }
  async #i(e) {
    if (e.sourceUuid) {
      const a = await this.#e(e.sourceUuid);
      if (!a)
        throw new de("skill-source-missing", "A selected Skill source is unavailable.");
      return {
        name: a.name,
        type: "skill",
        system: {
          ...structuredClone(a.system),
          rank: e.rank,
          acquisition: {
            ...a.system.acquisition ?? {},
            grantedByUuid: a.uuid
          }
        }
      };
    }
    const t = e.customName?.trim() ?? "";
    if (!t)
      throw new de("invalid-skills", "A custom Skill requires a name.");
    const i = e.category ?? "general";
    return {
      name: t,
      type: "skill",
      system: {
        rank: e.rank,
        category: i,
        contexts: i === "general" ? [] : [i],
        acquisition: { minimumTier: 1, grantedByUuid: "", notes: "" }
      }
    };
  }
  #n(e) {
    if (e.type !== "character")
      throw new de("not-character", "Core Setup requires a Character.");
    if (e.system.creation.coreInitialized)
      throw new de("already-initialized", "Core Setup has already been finalized.");
  }
}
function mn(n, e) {
  return Number(n[e] ?? 0);
}
function Qa(n, e) {
  return String(n[e] ?? "").trim();
}
function Fn(n) {
  return n.replace(/[&<>"']/g, (e) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[e]);
}
function Vd() {
  return [
    `<option value="custom">${game.i18n.localize("MAGNUSARCHIVES.Creation.CustomSkill")}</option>`,
    ...[...game.items].filter((n) => n.type === "skill").sort((n, e) => n.name.localeCompare(e.name)).map((n) => `<option value="${Fn(n.uuid)}">${Fn(n.name)}</option>`)
  ].join("");
}
function yi(n, e) {
  return `<fieldset><legend>${e}</legend>
    <label>${game.i18n.localize("MAGNUSARCHIVES.Creation.SkillSource")}<select name="source${n}">${Vd()}</select></label>
    <label>${game.i18n.localize("MAGNUSARCHIVES.Creation.CustomSkillName")}<input name="name${n}" type="text"></label>
  </fieldset>`;
}
function Si(n, e, t) {
  const i = Qa(n, `source${e}`);
  return i === "custom" ? { customName: Qa(n, `name${e}`), category: "general", rank: t } : { sourceUuid: i, rank: t };
}
async function pn(n, e, t) {
  return foundry.applications.api.DialogV2.input({
    window: { title: n },
    content: `<div class="magnusarchives-dialog-fields">${e}</div>`,
    rejectClose: !1,
    render: t ? (i, a) => t(a.element) : void 0,
    ok: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Apply") }
  });
}
function Dd(n) {
  const e = [...n.querySelectorAll(
    'input[name="might"], input[name="speed"], input[name="intellect"]'
  )], t = n.querySelector("[data-core-points-remaining]"), i = n.querySelector('button[data-action="ok"]'), a = () => {
    const s = e.map((l) => Number(l.value)), o = s.every((l) => Number.isInteger(l) && l >= 0 && l <= 6), r = 6 - s.reduce((l, u) => l + u, 0);
    t && (t.value = String(r)), i && (i.disabled = !o || r !== 0);
  };
  e.forEach((s) => s.addEventListener("input", a)), a();
}
function Tn(n) {
  const e = n instanceof de ? `MAGNUSARCHIVES.Creation.Errors.${n.code}` : "MAGNUSARCHIVES.Creation.Errors.Unexpected";
  n instanceof de || console.error(n), ui.notifications.error(game.i18n.localize(e));
}
async function Fd(n) {
  const e = await pn(
    game.i18n.localize("MAGNUSARCHIVES.Creation.StepPools"),
    `<p>${game.i18n.localize("MAGNUSARCHIVES.Creation.PoolsPrompt")}</p>
     <label>${game.i18n.localize("MAGNUSARCHIVES.Pools.Might")} 8 + <input name="might" type="number" min="0" max="6" value="0"></label>
     <label>${game.i18n.localize("MAGNUSARCHIVES.Pools.Speed")} 8 + <input name="speed" type="number" min="0" max="6" value="0"></label>
     <label>${game.i18n.localize("MAGNUSARCHIVES.Pools.Intellect")} 8 + <input name="intellect" type="number" min="0" max="6" value="0"></label>
     <p>${game.i18n.localize("MAGNUSARCHIVES.Creation.PointsRemaining")}: <output data-core-points-remaining>6</output> / 6</p>`,
    Dd
  );
  if (!e) return;
  const t = { might: mn(e, "might"), speed: mn(e, "speed"), intellect: mn(e, "intellect") };
  if (Object.values(t).reduce((u, c) => u + c, 0) !== 6 || Object.values(t).some((u) => !Number.isInteger(u) || u < 0)) {
    Tn(new de("invalid-pools", "Invalid Pool allocation."));
    return;
  }
  const i = await pn(
    game.i18n.localize("MAGNUSARCHIVES.Creation.StepSkills"),
    yi(1, game.i18n.localize("MAGNUSARCHIVES.Creation.SkillOne")) + yi(2, game.i18n.localize("MAGNUSARCHIVES.Creation.SkillTwo"))
  );
  if (!i) return;
  const a = [Si(i, 1, "trained"), Si(i, 2, "trained")];
  if (await foundry.applications.api.DialogV2.confirm({
    window: { title: game.i18n.localize("MAGNUSARCHIVES.Creation.OptionalThird") },
    content: `<div class="magnusarchives magnusarchives-dialog"><p>${game.i18n.localize("MAGNUSARCHIVES.Creation.OptionalThirdPrompt")}</p></div>`,
    yes: { label: game.i18n.localize("MAGNUSARCHIVES.Creation.AddThird") },
    no: { label: game.i18n.localize("MAGNUSARCHIVES.Creation.KeepTwo") }
  })) {
    const u = await pn(
      game.i18n.localize("MAGNUSARCHIVES.Creation.OptionalThird"),
      yi(3, game.i18n.localize("MAGNUSARCHIVES.Creation.SkillThree")) + yi(4, game.i18n.localize("MAGNUSARCHIVES.Creation.Inability"))
    );
    if (!u) return;
    a.push(Si(u, 3, "trained"), Si(u, 4, "inability"));
  }
  const o = a.map((u) => u.customName || [...game.items].find((c) => c.uuid === u.sourceUuid)?.name || game.i18n.localize("MAGNUSARCHIVES.Creation.UnknownSkill"));
  if (!await foundry.applications.api.DialogV2.confirm({
    window: { title: game.i18n.localize("MAGNUSARCHIVES.Creation.StepReview") },
    content: `<div class="magnusarchives-dialog-fields">
      <p>${game.i18n.localize("MAGNUSARCHIVES.Pools.Might")} ${8 + t.might} · ${game.i18n.localize("MAGNUSARCHIVES.Pools.Speed")} ${8 + t.speed} · ${game.i18n.localize("MAGNUSARCHIVES.Pools.Intellect")} ${8 + t.intellect}</p>
      <ul>${o.map((u, c) => `<li>${Fn(u)} — ${game.i18n.localize(`MAGNUSARCHIVES.Skill.Ranks.${a[c].rank}`)}</li>`).join("")}</ul>
    </div>`,
    yes: { label: game.i18n.localize("MAGNUSARCHIVES.Creation.Finalize") },
    no: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Cancel") }
  })) return;
  const l = { pools: t, skills: a };
  try {
    await game.magnusarchives.services.characterInitialization.setup(n, l), await n.sheet?.render({ force: !0 }), ui.notifications.info(game.i18n.localize("MAGNUSARCHIVES.Creation.Completed"));
  } catch (u) {
    Tn(u);
  }
}
async function Za(n, e) {
  try {
    await game.magnusarchives.services.characterInitialization.markInitialized(n, e), await n.sheet?.render({ force: !0 }), ui.notifications.info(game.i18n.localize(
      e === "skipped" ? "MAGNUSARCHIVES.Creation.Skipped" : "MAGNUSARCHIVES.Creation.Marked"
    ));
  } catch (t) {
    Tn(t);
  }
}
function Ai(n, e) {
  return e.map((t) => n.system.graph.nodes.find((i) => i.id === t)?.abilitySnapshot.name || t).join(", ");
}
async function Td(n, e, t) {
  return game.magnusarchives.services.focusAcquisition.hasEmbeddedAbility(n, e.uuid, t) ? !!await foundry.applications.api.DialogV2.confirm({
    window: { title: game.i18n.localize("MAGNUSARCHIVES.Focus.UndoDeleteTitle") },
    content: `<div class="magnusarchives magnusarchives-dialog"><p>${game.i18n.localize("MAGNUSARCHIVES.Focus.UndoDeletePrompt")}</p></div>`,
    yes: { label: game.i18n.localize("MAGNUSARCHIVES.Focus.UndoDeleteAbility") },
    no: { label: game.i18n.localize("MAGNUSARCHIVES.Focus.UndoKeepAbility") }
  }) : !1;
}
async function es(n, e, t, i = !1) {
  const a = e.system.graph.nodes.find((r) => r.id === t);
  if (!a || !await foundry.applications.api.DialogV2.confirm({
    window: { title: game.i18n.localize("MAGNUSARCHIVES.Focus.UndoAcquisition") },
    content: `<div class="magnusarchives magnusarchives-dialog"><p>${game.i18n.format("MAGNUSARCHIVES.Focus.UndoConfirm", { name: a.abilitySnapshot.name })}</p></div>`,
    yes: { label: game.i18n.localize("MAGNUSARCHIVES.Focus.UndoAcquisition") },
    no: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Cancel") }
  })) return;
  const o = await Td(n, e, t);
  try {
    const r = await game.magnusarchives.services.focusAcquisition.undo(
      n,
      e,
      t,
      { deleteAbility: o, force: i }
    );
    ui.notifications.info(game.i18n.localize(r.choiceRestored ? "MAGNUSARCHIVES.Focus.UndoChoiceRestored" : "MAGNUSARCHIVES.Focus.UndoCompleted")), r.invalidOwnedNodeIds.length > 0 && ui.notifications.warn(game.i18n.format("MAGNUSARCHIVES.Focus.ProgressionEdit.InvalidWarning", {
      nodes: Ai(e, r.invalidOwnedNodeIds)
    }));
  } catch (r) {
    if (r instanceof ce && r.code === "undo-dependent-nodes") {
      if (!game.user.isGM) {
        ui.notifications.error(game.i18n.format("MAGNUSARCHIVES.Focus.Errors.UndoDependencies", {
          nodes: Ai(e, r.dependentNodeIds)
        }));
        return;
      }
      if (await foundry.applications.api.DialogV2.confirm({
        window: { title: game.i18n.localize("MAGNUSARCHIVES.Focus.ProgressionEdit.ForceUndo") },
        content: `<div class="magnusarchives magnusarchives-dialog"><p>${game.i18n.format("MAGNUSARCHIVES.Focus.ProgressionEdit.ForceUndoWarning", {
          nodes: Ai(e, r.dependentNodeIds)
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
          nodes: Ai(e, u.invalidOwnedNodeIds)
        }));
      }
      return;
    }
    console.error(r), ui.notifications.error(game.i18n.localize("MAGNUSARCHIVES.Focus.Errors.Unexpected"));
  }
}
async function zd(n, e, t) {
  if (!game.user.isGM) return;
  const i = e.system.graph.nodes.find((s) => s.id === t);
  !i || !await foundry.applications.api.DialogV2.confirm({
    window: { title: game.i18n.localize("MAGNUSARCHIVES.Focus.ProgressionEdit.MarkOwned") },
    content: `<div class="magnusarchives magnusarchives-dialog"><p>${game.i18n.format("MAGNUSARCHIVES.Focus.ProgressionEdit.MarkOwnedConfirm", { name: i.abilitySnapshot.name })}</p></div>`,
    yes: { label: game.i18n.localize("MAGNUSARCHIVES.Focus.ProgressionEdit.MarkOwned") },
    no: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Cancel") }
  }) || (await game.magnusarchives.services.focusAcquisition.markOwnedWithGmOverride(n, e, t), ui.notifications.info(game.i18n.localize("MAGNUSARCHIVES.Focus.ProgressionEdit.MarkedOwned")));
}
function Ee(n) {
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
function Pd(n) {
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
      snapshot: Pd(i),
      reason: game.i18n.localize(t === "compendium" ? "MAGNUSARCHIVES.GrantConflict.CompendiumItem" : "MAGNUSARCHIVES.GrantConflict.WorldItem"),
      reasonSourceUuid: i.uuid
    }
  };
}
async function Ht(n) {
  const e = [...game.items].filter((u) => u.type === n.type).filter((u) => u.uuid !== n.existing.contentUuid && u.uuid !== n.proposed.contentUuid).sort((u, c) => u.name.localeCompare(c.name)), t = n.suggestions.length ? n.suggestions.map((u) => `
      <label class="grant-conflict-option">
        <input type="radio" name="resolution" value="suggestion:${Ee(u.id)}">
        <span><strong>${Ee(u.name)}</strong><small>${Ee(u.reason)}</small></span>
      </label>`).join("") : `<p class="empty-list">${game.i18n.localize("MAGNUSARCHIVES.GrantConflict.NoSuggestions")}</p>`, i = game.i18n.localize(n.type === "skill" ? "MAGNUSARCHIVES.GrantConflict.Skill" : "MAGNUSARCHIVES.GrantConflict.Ability"), a = n.existing.rank ? ` — ${Ee(ts(n.existing.rank))}` : "", s = n.proposed.rank ? ` — ${Ee(ts(n.proposed.rank))}` : "", o = game.user.isGM ? `
      <label class="grant-conflict-option"><input type="radio" name="resolution" value="world"><span>${game.i18n.localize("MAGNUSARCHIVES.GrantConflict.WorldItem")}</span></label>
      <select name="worldUuid">${e.map((u) => `<option value="${Ee(u.uuid)}">${Ee(u.name)}</option>`).join("")}</select>
      <label class="grant-conflict-option"><input type="radio" name="resolution" value="uuid"><span>${game.i18n.localize("MAGNUSARCHIVES.GrantConflict.CompendiumUuid")}</span></label>
      <input name="documentUuid" type="text" placeholder="Compendium.world.pack.Item.id">` : `<p class="hint">${game.i18n.localize("MAGNUSARCHIVES.GrantConflict.GmExternalOnly")}</p>`, r = n.context === "package" ? `<fieldset><legend>${game.i18n.format("MAGNUSARCHIVES.GrantConflict.ChooseAnother", { type: i })}</legend>
      ${o}
      ${n.allowCustom ? `<label class="grant-conflict-option"><input type="radio" name="resolution" value="custom"><span>${game.i18n.localize("MAGNUSARCHIVES.GrantConflict.CustomSkill")}</span></label><input name="customName" type="text" placeholder="${game.i18n.localize("MAGNUSARCHIVES.GrantConflict.CustomSkillName")}">` : `<p class="hint">${game.i18n.localize("MAGNUSARCHIVES.GrantConflict.NoCustomAbility")}</p>`}
    </fieldset>` : `<p class="hint">${game.i18n.localize("MAGNUSARCHIVES.GrantConflict.FocusRestriction")}</p>`, l = `<div class="magnusarchives magnusarchives-dialog grant-conflict-dialog">
    <div class="grant-conflict-comparison">
      <p><span>${game.i18n.localize("MAGNUSARCHIVES.GrantConflict.AlreadyHave")}</span><strong>${Ee(n.existing.name)}${a}</strong></p>
      <p><span>${game.i18n.format("MAGNUSARCHIVES.GrantConflict.WouldGrant", { source: Ee(n.packageName) })}</span><strong>${Ee(n.proposed.name)}${s}</strong></p>
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
    const c = String(u.resolution ?? "");
    if (c === "suppress" && n.allowSuppress) return { action: "suppress" };
    if (c === "gmOverride" && n.allowGmOverride && game.user.isGM) return { action: "gmOverride" };
    if (c.startsWith("suggestion:")) {
      const p = n.suggestions.find((y) => y.id === c.slice(11));
      if (p) return { action: "replace", replacement: p, selectionKind: "suggested" };
    }
    if (c === "world") {
      const p = await is(n, String(u.worldUuid ?? ""), "world");
      if (p) return p;
    }
    if (c === "uuid") {
      const p = String(u.documentUuid ?? "").trim(), y = await is(n, p, p.startsWith("Compendium.") ? "compendium" : "world");
      if (y) return y;
    }
    if (c === "custom" && n.type === "skill" && n.allowCustom) {
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
function pt(n) {
  return n.trim().toLocaleLowerCase().replace(/[^a-z0-9]+/g, "");
}
function xd(n, e) {
  const t = n.genre === "custom" ? String(n.customGenreId ?? "") : String(n.genre ?? "");
  if (!t || t === "none") return null;
  const i = [...e].sort((a, s) => a.uuid.localeCompare(s.uuid));
  return i.find((a) => a.uuid === t) ?? i.find((a) => pt(a.system.legacyKey) === pt(t)) ?? i.find((a) => pt(String(a.system.slug ?? "")) === pt(t)) ?? i.find((a) => pt(a.name) === pt(t)) ?? null;
}
async function Xo(n, e, t) {
  if (n.genre === "custom" && n.customGenreId) {
    const i = await t(n.customGenreId);
    if (i?.type === "genre") return i;
  }
  return xd(n, e);
}
class zt extends Error {
  constructor(e, t) {
    super(t), this.code = e, this.name = "GenreAssociationError";
  }
  code;
}
class x extends Error {
  constructor(e, t) {
    super(t), this.code = e, this.name = "GenreChoiceError";
  }
  code;
}
function qd() {
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
class Od {
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
        throw new zt("not-genre", "Only a Genre Item can be attached.");
      if (e.system.genre.sourceUuid === t.uuid)
        throw new zt("duplicate", "This Genre is already attached.");
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
      if (!t.sourceUuid) throw new zt("missing", "No Genre is attached.");
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
    return t.system.abilityCatalog.filter((a) => (a.catalog ?? "progression") === "progression" && a.minimumTier <= B(e.system) && a.minimumTier <= i.grantTier);
  }
  manualCatalog(e, t) {
    return t.system.abilityCatalog.filter((i) => (i.catalog ?? "progression") === "progression").map((i) => ({
      id: i.id,
      name: i.snapshot.name || i.id,
      minimumTier: i.minimumTier,
      normallyAvailable: i.minimumTier <= B(e.system),
      owned: !!this.#r(e, t, e.system.genre, i, "active")
    })).sort((i, a) => i.minimumTier - a.minimumTier || i.name.localeCompare(a.name));
  }
  async acquireManual(e, t, i) {
    return this.#o(e, async () => {
      this.#c(e);
      const a = e.system.genre;
      if (!a.sourceUuid) throw new x("genre-required", "Attach a Genre before acquiring an Ability.");
      const s = await this.#e(a.sourceUuid);
      if (!s || s.type !== "genre") throw new x("genre-unavailable", "The active Genre source is unavailable.");
      const o = s.system.abilityCatalog.find((m) => m.id === t);
      if (!o) throw new x("entry-missing", "The Genre Ability is no longer in the active Genre catalog.");
      if ((o.catalog ?? "progression") !== "progression")
        throw new x("entry-ineligible", "Origin Abilities are not part of Genre progression.");
      if (this.#r(e, s, a, o, "active")) return { entry: o, abilityCreated: !1, conflictOverridden: !1 };
      const l = this.#r(e, s, a, o, "retained");
      if (l?.update)
        return await l.update({ "system.grantedBy.status": "active" }), { entry: o, abilityCreated: !1, conflictOverridden: !1 };
      const u = await this.#l(s, a, o), c = this.#s(e, s, o, u);
      let p = !1;
      if (c) {
        if (!i) throw new x("duplicate-grant", "This Ability is already present on the Character.");
        const m = await i(c);
        if (m.action === "cancel") throw new Le();
        if (m.action !== "gmOverride")
          throw new x("duplicate-grant", "A Genre acquisition must use an Ability from its Genre catalog.");
        p = !0;
      }
      const y = c ? void 0 : (await e.createEmbeddedDocuments("Item", [u]))[0];
      return { entry: o, abilityCreated: !!y, conflictOverridden: p };
    });
  }
  async undoManual(e, t, i) {
    return this.#o(e, async () => {
      this.#c(e);
      const a = e.system.genre;
      if (!a.sourceUuid) throw new x("genre-required", "No active Genre is attached.");
      const s = await this.#e(a.sourceUuid);
      if (!s || s.type !== "genre") throw new x("genre-unavailable", "The active Genre source is unavailable.");
      const o = s.system.abilityCatalog.find((l) => l.id === t);
      if (!o) throw new x("entry-missing", "The Genre Ability is no longer in the active Genre catalog.");
      const r = this.#r(e, s, a, o, "active");
      if (!r) throw new x("entry-missing", "This Genre Ability is not currently owned.");
      if (i) {
        if (!r.delete) throw new x("ability-unavailable", "The embedded Genre Ability cannot be deleted.");
        return await r.delete(), { abilityDeleted: !0, abilityRetained: !1 };
      }
      if (!r.update) throw new x("ability-unavailable", "The embedded Genre Ability cannot be retained.");
      return await r.update({ "system.grantedBy.status": "retained" }), { abilityDeleted: !1, abilityRetained: !0 };
    });
  }
  async acquire(e, t, i, a) {
    return this.#o(e, async () => {
      this.#c(e);
      const s = e.system.genre;
      if (!s.sourceUuid) throw new x("genre-required", "Attach a Genre before spending this choice.");
      const o = await this.#e(s.sourceUuid);
      if (!o || o.type !== "genre") throw new x("genre-unavailable", "The active Genre source is unavailable.");
      const r = e.system.advancement.pendingGenreChoices.find((m) => m.id === t);
      if (!r) throw new x("choice-missing", "The pending Genre Choice no longer exists.");
      const l = o.system.abilityCatalog.find((m) => m.id === i);
      if (!l) throw new x("entry-missing", "The Genre Ability is no longer in the active Genre catalog.");
      if (!this.eligibleEntries(e, o, r).some((m) => m.id === l.id))
        throw new x("entry-ineligible", "This Genre Ability is not eligible for the selected choice.");
      const u = await this.#l(o, s, l), c = this.#s(e, o, l, u);
      let p = !1;
      if (c) {
        if (!a) throw new x("duplicate-grant", "This Ability is already present on the Character.");
        const m = await a(c);
        if (m.action === "cancel") throw new Le();
        if (m.action !== "gmOverride")
          throw new x("duplicate-grant", "A Genre choice must grant an Ability from its Genre catalog.");
        p = !0;
      }
      let y;
      c || (y = (await e.createEmbeddedDocuments("Item", [u]))[0]);
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
      throw new x("ability-unavailable", "The Genre Ability source and snapshot are unavailable.");
    const r = s?.name ?? o.name, l = s?.img ?? o.img ?? "", u = s?.system ?? o.system, c = Ne("ability", r, i.abilityUuid || s?.uuid || ""), p = {
      kind: "genre",
      sourceUuid: e.uuid,
      instanceId: t.instanceId,
      grantId: i.id,
      status: "active",
      contentUuid: c.contentUuid,
      contentKey: c.contentKey,
      replacement: qd()
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
    const o = a.system.grantedBy, r = Ne("ability", String(a.name), o.contentUuid), l = Li(e.items, r);
    if (!l) return null;
    const u = l.system.grantedBy ?? {}, c = Ne("ability", l.name, String(u.contentUuid ?? "")), p = (y, m, f) => ({
      id: m,
      name: y.name,
      type: "ability",
      rank: "",
      contentUuid: f.contentUuid,
      contentKey: f.contentKey
    });
    return {
      id: `${t.uuid}:${i.id}`,
      type: "ability",
      packageName: t.name,
      packageSourceUuid: t.uuid,
      grantId: i.id,
      existing: p(l, String(l.id ?? c.contentKey), c),
      proposed: p({ name: String(a.name) }, i.id, r),
      suggestions: [],
      allowCustom: !1,
      allowSuppress: !1,
      allowGmOverride: !0,
      context: "genre"
    };
  }
  #c(e) {
    if (e.type !== "character") throw new zt("not-character", "Genre association requires a Character.");
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
function ze(n) {
  return n.replace(/[&<>"']/g, (e) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[e]);
}
function ji(n) {
  if (n instanceof Le) return;
  console.error(n);
  const e = n instanceof zt ? `MAGNUSARCHIVES.Genre.Errors.${n.code}` : n instanceof x ? `MAGNUSARCHIVES.Genre.Errors.${n.code}` : "MAGNUSARCHIVES.Genre.Errors.unexpected";
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
      content: `<div class="magnusarchives-dialog-fields"><label>${game.i18n.localize("MAGNUSARCHIVES.Genre.Label")}<select name="uuid">${a.map((o) => `<option value="${ze(o.uuid)}">${ze(o.name)}</option>`).join("")}</select></label></div>`,
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
      ji(a);
    }
}
async function Bd(n) {
  if (await foundry.applications.api.DialogV2.confirm({
    window: { title: game.i18n.localize("MAGNUSARCHIVES.Genre.Remove") },
    content: `<div class="magnusarchives magnusarchives-dialog"><p>${game.i18n.localize("MAGNUSARCHIVES.Genre.RemoveConfirm")}</p></div>`,
    yes: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Remove") },
    no: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Cancel") }
  }))
    try {
      await game.magnusarchives.services.genres.remove(n), ui.notifications.info(game.i18n.localize("MAGNUSARCHIVES.Genre.Removed"));
    } catch (t) {
      ji(t);
    }
}
async function Ld(n, e) {
  try {
    const t = await game.magnusarchives.services.genres.active(n);
    if (!t) throw new x("genre-required", "Attach a Genre first.");
    const i = n.system.advancement.pendingGenreChoices.find((o) => o.id === e);
    if (!i) throw new x("choice-missing", "Choice not found.");
    const a = game.magnusarchives.services.genres.eligibleEntries(n, t, i);
    if (!a.length) throw new x("entry-ineligible", "No eligible Genre Ability is available.");
    const s = await foundry.applications.api.DialogV2.input({
      window: { title: game.i18n.localize("MAGNUSARCHIVES.Genre.ChooseAbility") },
      content: `<div class="magnusarchives-dialog-fields"><p><strong>${ze(t.name)}</strong></p><label>${game.i18n.localize("MAGNUSARCHIVES.Genre.Ability")}<select name="entryId">${a.map((o) => `<option value="${ze(o.id)}">${ze(o.snapshot.name)} (${game.i18n.localize("MAGNUSARCHIVES.Focus.Tier")} ${o.minimumTier})</option>`).join("")}</select></label></div>`,
      ok: { label: game.i18n.localize("MAGNUSARCHIVES.Genre.Acquire") }
    });
    if (!s) return;
    await game.magnusarchives.services.genres.acquire(
      n,
      i.id,
      String(s.entryId ?? ""),
      Ht
    ), ui.notifications.info(game.i18n.localize("MAGNUSARCHIVES.Genre.AbilityAcquired"));
  } catch (t) {
    ji(t);
  }
}
async function jd(n) {
  try {
    const e = await game.magnusarchives.services.genres.active(n);
    if (!e) throw new x("genre-required", "Attach a Genre first.");
    const t = game.magnusarchives.services.genres.manualCatalog(n, e);
    if (!t.length) {
      ui.notifications.warn(game.i18n.localize("MAGNUSARCHIVES.Genre.NoCatalogAbilities"));
      return;
    }
    const i = `<div class="magnusarchives genre-ability-browser">
      <p class="genre-browser-source"><strong>${ze(e.name)}</strong></p>
      <div class="genre-browser-list">${t.map((u, c) => `
        <label class="genre-browser-entry${u.owned ? " is-owned" : ""}${u.normallyAvailable ? "" : " is-future"}">
          <input type="radio" name="entryId" value="${ze(u.id)}"${c === 0 ? " checked" : ""}>
          <span><strong>${ze(u.name)}</strong><small>${game.i18n.localize("MAGNUSARCHIVES.Genre.MinimumTier")} ${u.minimumTier}</small></span>
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
        Ht
      ), ui.notifications.info(game.i18n.localize("MAGNUSARCHIVES.Genre.AbilityAcquired"));
      return;
    }
    if (!await foundry.applications.api.DialogV2.confirm({
      window: { title: game.i18n.localize("MAGNUSARCHIVES.Genre.Browser.Undo") },
      content: `<div class="magnusarchives magnusarchives-dialog"><p>${game.i18n.format("MAGNUSARCHIVES.Genre.Browser.UndoConfirm", { name: ze(o.name) })}</p></div>`,
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
    ji(e);
  }
}
function jt(n) {
  return n.replace(/[&<>"']/g, (e) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[e]);
}
function Wd(n, e, t) {
  return n.includes(e) ? n.filter((i) => i !== e) : n.length >= t ? [...n] : [...n, e];
}
function _d() {
  let n = !1;
  return () => n ? !1 : (n = !0, !0);
}
function Kd(n, e) {
  return n.map((t, i) => `<button type="button" class="package-choice-option"${e ? ` data-action="package-choice-${i}"` : ""} data-package-choice-option data-option-id="${jt(t.id)}" aria-pressed="false"><i class="fa-solid fa-check package-choice-check" aria-hidden="true"></i><span>${jt(t.label)}</span></button>`).join("");
}
async function Wi(n) {
  const e = n.options.filter((l, u, c) => l.id && c.findIndex((p) => p.id === l.id) === u);
  if (!Number.isInteger(n.choose) || n.choose < 1 || n.choose > e.length) return null;
  const t = n.choose === 1, i = _d();
  let a = [];
  const s = `<div class="magnusarchives magnusarchives-dialog package-choice-dialog ${t ? "package-choice-single" : "package-choice-multiple"}" data-package-choice-required="${n.choose}">
    <header class="magnusarchives-dialog-heading package-choice-heading"><strong>${jt(n.title)}</strong></header>
    <p class="magnusarchives-dialog-help package-choice-prompt">${jt(n.prompt)}</p>
    <div class="package-choice-options" role="group" aria-label="${jt(n.ariaLabel)}">${Kd(e, t)}</div>
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
      const c = [...u.element.querySelectorAll("button[data-package-choice-option]")], p = u.element.querySelector('button[data-action="confirm-package-choice"]'), y = u.element.querySelector("[data-package-choice-count]"), m = () => {
        for (const f of c) {
          const g = a.includes(f.dataset.optionId ?? "");
          f.classList.toggle("is-selected", g), f.setAttribute("aria-pressed", String(g));
        }
        p && (p.disabled = a.length !== n.choose), y && (y.textContent = game.i18n.format("MAGNUSARCHIVES.Packages.SelectionCount", {
          selected: a.length,
          required: n.choose
        }));
      };
      for (const f of c)
        f.addEventListener("click", () => {
          a = Wd(a, f.dataset.optionId ?? "", n.choose), m();
        });
      m();
    }
  });
  return Array.isArray(r) && r.length === n.choose ? r : null;
}
const Xd = "magnusarchives.descriptors";
function Yd(n) {
  return structuredClone(n);
}
function Jd(n) {
  const e = n.toObject?.() ?? {};
  return {
    name: String(e.name ?? n.name),
    ...String(e.img ?? n.img ?? "") ? { img: String(e.img ?? n.img) } : {},
    system: Yd(e.system ?? n.system)
  };
}
function Qd(n, e) {
  const t = n.name.toLocaleLowerCase(), i = e.name.toLocaleLowerCase();
  return t < i ? -1 : t > i ? 1 : n.uuid < e.uuid ? -1 : n.uuid > e.uuid ? 1 : 0;
}
function Zd(n, e) {
  const t = /* @__PURE__ */ new Map();
  for (const a of e)
    a.type !== "descriptor" || !a.uuid || t.has(a.uuid) || t.set(a.uuid, a);
  const i = [...t.values()].sort(Qd).map((a) => ({
    id: a.uuid,
    descriptorUuid: a.uuid,
    snapshot: Jd(a)
  }));
  return n.map((a) => (a.sourceMode ?? "fixed") !== "catalog" ? a : {
    ...a,
    options: a.catalogItemType === "descriptor" ? i : []
  });
}
async function eu() {
  const n = game, e = n.packs?.get(Xd), t = e ? await e.getDocuments() : [], i = [...n.items].filter((a) => a.type === "descriptor");
  return [...t, ...i];
}
async function tu(n) {
  return n.some((e) => (e.sourceMode ?? "fixed") === "catalog") ? Zd(n, await eu()) : [...n];
}
function Nt(n) {
  return n.replace(/[&<>"']/g, (e) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[e]);
}
function _i(n) {
  return [...n.items].filter((e) => e.type === "characterType" || e.type === "descriptor" || e.type === "species");
}
async function ha(n) {
  const e = [...game.items].filter((i) => i.type === n).sort((i, a) => i.name.localeCompare(a.name));
  if (!e.length)
    return ui.notifications.warn(game.i18n.localize(`MAGNUSARCHIVES.Packages.NoWorld${n === "characterType" ? "Types" : n === "descriptor" ? "Descriptors" : "Species"}`)), null;
  const t = await foundry.applications.api.DialogV2.input({
    window: { title: game.i18n.localize(n === "characterType" ? "MAGNUSARCHIVES.Packages.AddType" : n === "descriptor" ? "MAGNUSARCHIVES.Packages.AddDescriptor" : "MAGNUSARCHIVES.Packages.AddSpecies") },
    content: `<div class="magnusarchives-dialog-fields"><label>${game.i18n.localize("MAGNUSARCHIVES.Packages.Source")}
      <select name="uuid">${e.map((i) => `<option value="${Nt(i.uuid)}">${Nt(i.name)}</option>`).join("")}</select>
    </label></div>`,
    ok: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Add") }
  });
  return t ? await fromUuid(String(t.uuid ?? "")) : null;
}
async function ya(n) {
  const e = await foundry.applications.api.DialogV2.input({
    window: { title: game.i18n.localize("MAGNUSARCHIVES.Packages.Remove") },
    content: `<div class="magnusarchives-dialog-fields"><p>${game.i18n.format("MAGNUSARCHIVES.Packages.RemoveConfirm", { name: Nt(n) })}</p>
      <label>${game.i18n.localize("MAGNUSARCHIVES.Packages.GrantedItems")}
        <select name="mode"><option value="delete">${game.i18n.localize("MAGNUSARCHIVES.Packages.RemoveWithGrants")}</option><option value="keep">${game.i18n.localize("MAGNUSARCHIVES.Packages.KeepGrants")}</option></select>
      </label></div>`,
    ok: { label: game.i18n.localize("MAGNUSARCHIVES.Packages.Remove") }
  });
  return e && (e.mode === "delete" || e.mode === "keep") ? e.mode : null;
}
function Ki(n) {
  console.error(n), ui.notifications.error(n instanceof Error ? n.message : String(n));
}
function Sa(n) {
  return n.map((e) => ({
    id: e,
    label: game.i18n.localize(`MAGNUSARCHIVES.Pools.${e[0].toUpperCase()}${e.slice(1)}`)
  }));
}
async function Yo(n) {
  const t = (await Wi({
    title: n,
    prompt: game.i18n.format("MAGNUSARCHIVES.Packages.ChooseOne", {
      label: game.i18n.localize("MAGNUSARCHIVES.Packages.EdgeChoice")
    }),
    ariaLabel: game.i18n.localize("MAGNUSARCHIVES.Packages.EdgeChoice"),
    choose: 1,
    options: Sa(k)
  }))?.[0];
  return k.includes(t) ? t : null;
}
async function iu(n) {
  const t = (await Wi({
    title: n,
    prompt: game.i18n.localize("MAGNUSARCHIVES.Packages.SuperheroicsPoolPrompt"),
    ariaLabel: game.i18n.localize("MAGNUSARCHIVES.Packages.SuperheroicsPool"),
    choose: 1,
    options: Sa(k)
  }))?.[0];
  return k.includes(t) ? t : null;
}
async function as(n, e) {
  const t = e ?? await ha("characterType");
  if (!t) return;
  const i = _i(n).find((p) => p.type === "characterType");
  let a, s;
  if (i && (!await foundry.applications.api.DialogV2.confirm({
    window: { title: game.i18n.localize("MAGNUSARCHIVES.Packages.ReplaceType") },
    content: `<div class="magnusarchives magnusarchives-dialog"><p>${game.i18n.format("MAGNUSARCHIVES.Packages.ReplaceTypeConfirm", { name: Nt(i.name) })}</p></div>`,
    yes: { label: game.i18n.localize("MAGNUSARCHIVES.Packages.Replace") },
    no: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Cancel") }
  }) || (a = i.id, s = await ya(i.name) ?? void 0, !s)))
    return;
  const o = t.system;
  let r;
  if (o.edgeGrant.mode === "choice" && (r = await Yo(t.name) ?? void 0, !r))
    return;
  let l;
  if (o.genre === "superhero" && o.superhero?.superheroics?.enabled && (l = await iu(t.name) ?? void 0, !l))
    return;
  const u = await it(t.name, o.choiceGroups ?? [], game.i18n.localize("MAGNUSARCHIVES.Packages.SkillChoice"));
  if (u === null) return;
  const c = await it(t.name, o.abilityChoiceGroups ?? [], game.i18n.localize("MAGNUSARCHIVES.Species.AbilityChoice"));
  if (c !== null)
    try {
      await game.magnusarchives.services.characterPackages.attachType(n, t, {
        conflictResolver: Ht,
        skillChoices: u,
        abilityChoices: c,
        ...r ? { edgePool: r } : {},
        ...l ? { superheroicsPool: l } : {},
        ...a ? { replaceItemId: a } : {},
        ...s ? { replaceGrantedItemsMode: s } : {}
      }), ui.notifications.info(game.i18n.localize("MAGNUSARCHIVES.Packages.TypeAttached"));
      const p = n;
      if (!p.system.genre.sourceUuid) {
        const y = [...game.items].filter((f) => f.type === "genre"), m = await Xo(
          o,
          y,
          async (f) => await fromUuid(f)
        );
        m && await foundry.applications.api.DialogV2.confirm({
          window: { title: game.i18n.localize("MAGNUSARCHIVES.Genre.TypeSuggestion") },
          content: `<div class="magnusarchives magnusarchives-dialog"><p>${game.i18n.format("MAGNUSARCHIVES.Genre.TypeSuggestionPrompt", { genre: Nt(m.name) })}</p></div>`,
          yes: { label: game.i18n.localize("MAGNUSARCHIVES.Genre.AttachSuggestion") },
          no: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Cancel") }
        }) && await zn(p, m, "typeSuggestion");
      }
    } catch (p) {
      p instanceof Le || Ki(p);
    }
}
async function ss(n, e) {
  const t = e ?? await ha("descriptor");
  if (!t) return;
  const i = _i(n).some((l) => l.type === "descriptor" && l.system.instance.role === "primary"), a = await foundry.applications.api.DialogV2.input({
    window: { title: t.name },
    content: `<div class="magnusarchives-dialog-fields"><label>${game.i18n.localize("MAGNUSARCHIVES.Packages.DescriptorRole")}
      <select name="role">${i ? "" : `<option value="primary">${game.i18n.localize("MAGNUSARCHIVES.Packages.Role.primary")}</option>`}<option value="additional">${game.i18n.localize("MAGNUSARCHIVES.Packages.Role.additional")}</option><option value="custom">${game.i18n.localize("MAGNUSARCHIVES.Packages.Role.custom")}</option></select>
    </label></div>`,
    ok: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Next") }
  });
  if (!a) return;
  const s = t.system, o = await Jo(t.name, s.poolBonusChoiceGroups ?? []);
  if (o === null) return;
  const r = await it(
    t.name,
    s.choiceGroups ?? [],
    game.i18n.localize("MAGNUSARCHIVES.Packages.SkillChoice")
  );
  if (r !== null)
    try {
      await game.magnusarchives.services.characterPackages.attachDescriptor(n, t, {
        role: String(a.role),
        poolChoices: o,
        skillChoices: r,
        conflictResolver: Ht
      }), ui.notifications.info(game.i18n.localize("MAGNUSARCHIVES.Packages.DescriptorAttached"));
    } catch (l) {
      l instanceof Le || Ki(l);
    }
}
async function Jo(n, e) {
  const t = {};
  for (const i of e) {
    const a = [...new Set(i.pools)].filter((o) => k.includes(o));
    if (i.choose < 1 || i.choose > a.length)
      return ui.notifications.error(game.i18n.localize("MAGNUSARCHIVES.Packages.InvalidPoolBonusChoice")), null;
    const s = await Wi({
      title: n,
      prompt: i.choose === 1 ? game.i18n.localize("MAGNUSARCHIVES.Packages.ChooseOnePool") : game.i18n.format("MAGNUSARCHIVES.Packages.ChooseManyPools", { count: i.choose }),
      ariaLabel: game.i18n.localize("MAGNUSARCHIVES.Packages.AllowedPools"),
      choose: i.choose,
      options: Sa(a)
    });
    if (!s) return null;
    t[i.id] = s.filter((o) => k.includes(o));
  }
  return t;
}
async function it(n, e, t) {
  const i = {};
  for (const a of e) {
    const s = a.rank ? game.i18n.format("MAGNUSARCHIVES.Packages.ChooseSkills", {
      count: a.choose,
      rank: game.i18n.localize(`MAGNUSARCHIVES.Skill.Ranks.${a.rank}`)
    }) : game.i18n.format(
      a.choose === 1 ? "MAGNUSARCHIVES.Packages.ChooseOne" : "MAGNUSARCHIVES.Packages.ChooseMany",
      { count: a.choose, label: t }
    ), o = await Wi({
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
async function os(n, e) {
  const t = e ?? await ha("species");
  if (!t) return;
  const i = _i(n).find((g) => g.type === "species");
  let a, s;
  if (i && (!await foundry.applications.api.DialogV2.confirm({
    window: { title: game.i18n.localize("MAGNUSARCHIVES.Species.Replace") },
    content: `<div class="magnusarchives magnusarchives-dialog"><p>${game.i18n.format("MAGNUSARCHIVES.Species.ReplaceConfirm", { name: Nt(i.name) })}</p></div>`,
    yes: { label: game.i18n.localize("MAGNUSARCHIVES.Packages.Replace") },
    no: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Cancel") }
  }) || (a = i.id, s = await ya(i.name) ?? void 0, !s)))
    return;
  const o = t.system;
  let r;
  if (o.edgeGrant.mode === "choice" && (r = await Yo(t.name) ?? void 0, !r))
    return;
  const l = await it(t.name, o.choiceGroups ?? [], game.i18n.localize("MAGNUSARCHIVES.Packages.SkillChoice"));
  if (l === null) return;
  const u = await it(t.name, o.abilityChoiceGroups ?? [], game.i18n.localize("MAGNUSARCHIVES.Species.AbilityChoice"));
  if (u === null) return;
  const c = await tu(o.descriptorChoiceGroups ?? []), p = await it(
    t.name,
    c,
    game.i18n.localize("MAGNUSARCHIVES.Species.DescriptorChoice")
  );
  if (p === null) return;
  const y = c.flatMap((g) => g.options.filter((A) => p[g.id]?.includes(A.id)).map((A) => ({ ...A, id: `${g.id}:${A.id}` }))), m = {}, f = {};
  for (const g of [...o.descriptorGrants ?? [], ...y]) {
    const A = g.descriptorUuid ? await fromUuid(g.descriptorUuid) : null, v = A?.system ?? g.snapshot.system, E = await Jo(
      g.snapshot.name || A?.name || t.name,
      v.poolBonusChoiceGroups ?? []
    );
    if (E === null) return;
    const H = await it(g.snapshot.name || A?.name || t.name, v.choiceGroups ?? [], game.i18n.localize("MAGNUSARCHIVES.Packages.SkillChoice"));
    if (H === null) return;
    m[g.id] = H, f[g.id] = E;
  }
  try {
    await game.magnusarchives.services.characterPackages.attachSpecies(n, t, {
      ...r ? { edgePool: r } : {},
      skillChoices: l,
      abilityChoices: u,
      descriptorChoices: p,
      resolvedDescriptorChoiceGroups: c,
      descriptorSkillChoices: m,
      descriptorPoolChoices: f,
      conflictResolver: Ht,
      ...a ? { replaceItemId: a } : {},
      ...s ? { replaceGrantedItemsMode: s } : {}
    }), ui.notifications.info(game.i18n.localize("MAGNUSARCHIVES.Species.Attached"));
  } catch (g) {
    g instanceof Le || Ki(g);
  }
}
async function nu(n, e) {
  const t = _i(n).find((a) => a.id === e);
  if (!t) return;
  const i = await ya(t.name);
  if (i)
    try {
      await game.magnusarchives.services.characterPackages.remove(n, e, i), ui.notifications.info(game.i18n.localize("MAGNUSARCHIVES.Packages.Removed"));
    } catch (a) {
      Ki(a);
    }
}
function Qo(n) {
  return [...n.items].filter((e) => e instanceof Item && e.type === "skill").map((e) => e).sort((e, t) => e.name.localeCompare(t.name));
}
function au() {
  return [...game.user.targets ?? []].flatMap((n) => {
    const e = Do(n);
    if (e) return [e];
    const t = Fo(n);
    return t ? [t] : [];
  });
}
function rs(n, e) {
  const t = Ke(n);
  if (t.length === 1) {
    const a = t[0];
    return `<input type="hidden" name="pool" value="${a}"><div class="roll-dialog-context roll-dialog-fixed-pool"><strong>${game.i18n.localize("MAGNUSARCHIVES.Pools.Pool")}</strong><span>${game.i18n.localize(`MAGNUSARCHIVES.Pools.${a[0].toUpperCase()}${a.slice(1)}`)}</span></div>`;
  }
  if (!e && t.length === 0) return "";
  const i = t.length > 1 ? t : zl;
  return `<label>${game.i18n.localize("MAGNUSARCHIVES.Pools.Pool")}<select name="pool">${i.map((a) => `<option value="${a}">${game.i18n.localize(`MAGNUSARCHIVES.Pools.${a[0].toUpperCase()}${a.slice(1)}`)}</option>`).join("")}</select></label>`;
}
function su(n) {
  return [
    `<optgroup label="${game.i18n.localize("MAGNUSARCHIVES.Roll.ManualSkillLevel")}">${pa(0, "manual:")}</optgroup>`,
    `<optgroup label="${game.i18n.localize("MAGNUSARCHIVES.Skill.Title")}">`,
    ...Qo(n).map((e) => `<option value="${e.id}">${e.name} — ${game.i18n.localize(`MAGNUSARCHIVES.Skill.Ranks.${e.system.rank}`)}</option>`),
    "</optgroup>"
  ].join("");
}
function ou(n, e) {
  const t = se(e, "skillId");
  return Qo(n).find((i) => i.id === t);
}
function ru(n) {
  const e = se(n, "skillId");
  return e.startsWith("manual:") ? Number(e.slice(7)) : 0;
}
function ls(n) {
  const e = se(n, "pool");
  return e === "might" || e === "speed" || e === "intellect" ? e : void 0;
}
async function lu(n, e) {
  if (!game.magnusarchives.services.abilities.canUse(e)) return;
  const t = xe(), i = t.enabledRuleModuleIds ?? [], a = game.magnusarchives.rules.resolveDifficultyPolicy(t.base, i), s = e.system.targetMode === "none" ? [] : au(), o = s.filter((g) => g.type === "npc"), r = e.system.roll !== "none", l = e.system.targetMode === "none" ? "" : `<div class="roll-dialog-context"><strong>${game.i18n.localize("MAGNUSARCHIVES.Combat.Targets")}</strong><span>${s.length ? s.map((g) => g.name).join(", ") : game.i18n.localize("MAGNUSARCHIVES.Common.None")}</span></div>`;
  if (!r) {
    const g = await foundry.applications.api.DialogV2.input({
      window: { title: `${game.i18n.localize("MAGNUSARCHIVES.Ability.Use")}: ${e.name}` },
      content: `<div class="magnusarchives magnusarchives-dialog-fields"><p><strong>${e.name}</strong></p>${l}${rs(e, !1)}</div>`,
      rejectClose: !1,
      ok: { label: game.i18n.localize("MAGNUSARCHIVES.Ability.Use") }
    });
    if (!g) return;
    try {
      const A = ls(g), v = await game.magnusarchives.services.abilities.executeNoRoll(n, e, {
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
  const u = o.length > 0 ? `<div class="roll-dialog-context"><strong>${game.i18n.localize("MAGNUSARCHIVES.Roll.Difficulty")}</strong><span>${game.i18n.localize("MAGNUSARCHIVES.Roll.HiddenValue")}</span></div>` : si(a.difficultyCeiling, !0), c = (g) => {
    const A = ou(n, g), v = ls(g);
    return {
      ...v ? { pool: v } : {},
      targets: s,
      difficulty: ii(g),
      ...A ? { skill: A } : {},
      skillSteps: ru(g),
      assets: j(g, "assets"),
      paidEffort: j(g, "paidEffort"),
      damageEffort: j(g, "damageEffort"),
      freeDamageEffort: j(g, "freeDamageEffort"),
      freeEffort: j(g, "freeEffort"),
      ...ni(g),
      enabledRuleModuleIds: i
    };
  }, p = (g) => {
    const A = game.magnusarchives.services.abilities.buildRollPlan(n, e, c(g)).requests[0];
    if (!A) throw new Error("Ability preview did not produce a roll request.");
    return A;
  }, y = `
    ${l}
    ${u}
    ${rs(e, !0)}
    <label>${game.i18n.localize("MAGNUSARCHIVES.Roll.SkillLevel")}<select name="skillId">${su(n)}</select></label>
    <label>${game.i18n.localize("MAGNUSARCHIVES.Roll.Assets")}<select name="assets">${he(a.assetLimit)}</select></label>
    <label>${game.i18n.localize("MAGNUSARCHIVES.Roll.EffortToEase")}<select name="paidEffort">${he(n.system.derived.effort.max)}</select></label>
    ${e.system.roll === "attack" ? `<label>${game.i18n.localize("MAGNUSARCHIVES.Combat.DamageEffort")}<select name="damageEffort">${he(n.system.derived.effort.max)}</select></label>
    <label>${game.i18n.localize("MAGNUSARCHIVES.Roll.FreeDamageEffort")}<input name="freeDamageEffort" type="number" value="0" min="0" step="1"></label>` : ""}
    <label>${game.i18n.localize("MAGNUSARCHIVES.Roll.FreeEffort")}<input name="freeEffort" type="number" value="0" min="0" step="1"></label>
    ${ai()}`, m = game.magnusarchives.services.combat.policy(i), f = await foundry.applications.api.DialogV2.input({
    window: { title: `${game.i18n.localize("MAGNUSARCHIVES.Ability.Use")}: ${e.name}`, resizable: !0 },
    position: { width: 800 },
    content: oi({
      identity: e.name,
      settings: y,
      ...e.system.roll === "attack" ? { attackSummary: " " } : {}
    }),
    rejectClose: !1,
    ok: { label: game.i18n.localize("MAGNUSARCHIVES.Roll.Roll") },
    render: (g, A) => {
      ri(A.element, {
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
  if (f)
    try {
      let g = await game.magnusarchives.services.abilities.executeRoll(
        n,
        e,
        c(f),
        t
      );
      if (e.system.roll === "attack") {
        const v = await qo(g);
        v && (g = game.magnusarchives.services.abilities.chooseAttackOutcomes(g, v));
      }
      for (const v of g)
        await game.magnusarchives.services.abilityChat.publishRoll(
          n,
          v,
          Oi(),
          Bi()
        );
      const A = g[0];
      A && await ti().requestFreeFromNaturalResult(n, A.execution.result);
    } catch (g) {
      ui.notifications.error(g instanceof Error ? g.message : String(g));
    }
}
function cu(n) {
  return game.i18n.localize(`MAGNUSARCHIVES.Pools.${n[0].toUpperCase()}${n.slice(1)}`);
}
function du(n) {
  const e = String(n.pool ?? "");
  return e === "might" || e === "speed" || e === "intellect" ? e : null;
}
async function uu(n, e) {
  const t = Ke(e);
  if (e.system.cost.amount <= 0 || t.length === 0)
    throw new Error(game.i18n.localize("MAGNUSARCHIVES.Ability.Payment.NoCost"));
  let i = t.length === 1 ? t[0] : null;
  if (!i) {
    const o = t.map(
      (l) => game.magnusarchives.services.abilities.previewPayment(n, e, l)
    ).map((l, u) => `
      <label class="ability-payment-choice">
        <input type="radio" name="pool" value="${l.pool}" ${u === 0 ? "checked" : ""}>
        <strong>${cu(l.pool)}</strong>
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
    if (i = du(r), !i || !t.includes(i)) throw new Error("Invalid Ability payment Pool.");
  }
  const a = await game.magnusarchives.services.abilities.payCost(n, e, i);
  await game.magnusarchives.services.abilityChat.publishPayment(n, a);
}
const mu = {
  descriptor: { accepts: "descriptor", placeholder: "[DESCRIPTOR]" },
  species: { accepts: "species", placeholder: "[SPECIES]" },
  type: { accepts: "characterType", placeholder: "[TYPE]" },
  focus: { accepts: "focus", placeholder: "[FOCUS]" }
}, pu = {
  "one-action": "MAGNUSARCHIVES.Hud.Recovery.Action",
  "10-minutes": "MAGNUSARCHIVES.Hud.Recovery.TenMinutes",
  "1-hour": "MAGNUSARCHIVES.Hud.Recovery.OneHour",
  "10-hours": "MAGNUSARCHIVES.Hud.Recovery.TenHours"
};
function Ft(n, e) {
  const t = mu[n];
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
function fn(n) {
  return n.instanceId || n.id || n.uuid || `${n.role ?? "custom"}:${n.name.trim().toLocaleLowerCase("en-US")}`;
}
function fu(n = []) {
  const e = /* @__PURE__ */ new Map();
  for (const t of n) {
    const i = fn(t);
    e.has(i) || e.set(i, t);
  }
  return [...e.values()].sort((t, i) => cs[t.role ?? "custom"] - cs[i.role ?? "custom"] || (t.attachedAt ?? 0) - (i.attachedAt ?? 0) || t.name.localeCompare(i.name, "en-US") || fn(t).localeCompare(fn(i), "en-US"));
}
function gu(n) {
  const e = n.trim().replace(/^[^a-z]+/i, "").toLocaleLowerCase("en-US");
  return /^(honest|honor|hour|heir)/.test(e) ? "AN" : /^(one|once|euro|user|use|uni(?:t|v|q))/.test(e) ? "A" : /^[aeiou]/.test(e) ? "AN" : "A";
}
function hu(n = {}) {
  const e = fu(n.descriptors), t = e.map((c) => Ft("descriptor", c));
  e.some((c) => c.role === "primary") || t.unshift(Ft("descriptor"));
  const i = n.species ? Ft("species", n.species) : null, a = Ft("type", n.type), s = Ft("focus", n.focus), o = n.hideFocus !== !0, r = gu(t[0].displayName), u = [t.map((c) => c.displayName).join(" AND "), i?.displayName, a.displayName].filter(Boolean).join(" ");
  return {
    article: r,
    descriptors: t,
    species: i,
    type: a,
    focus: s,
    showFocus: o,
    sentence: o ? `I AM ${r} ${u} WHO ${s.displayName}` : `I AM ${r} ${u}`
  };
}
function Zo(n, e) {
  const t = Math.max(0, Math.trunc(e)), i = Math.max(0, Math.min(t, Math.trunc(n)));
  return Array.from({ length: t }, (a, s) => ({
    index: s,
    filled: s < i,
    targetCount: s + 1 === i ? i - 1 : s + 1
  }));
}
function Ri(n, e) {
  return ["minor", "moderate", "major"].map((t) => ({
    severity: t,
    count: n[t],
    capacity: e[t],
    overCapacity: Math.max(0, n[t] - e[t]),
    pips: Zo(n[t], e[t])
  }));
}
const yu = {
  hale: 0,
  hurt: 1,
  impaired: 3,
  debilitated: 2,
  dead: 0
};
function Su(n, e) {
  const t = Qt(e), i = vt(n, e), a = t.indexOf(i);
  return t.map((s, o) => ({
    step: s,
    label: `MAGNUSARCHIVES.DamageTrack.${s}`,
    hintLabel: `MAGNUSARCHIVES.DamageTrack.Hint.${s}`,
    noteLabels: Array.from(
      { length: yu[s] },
      (r, l) => `MAGNUSARCHIVES.DamageTrack.Note.${s}.${l + 1}`
    ),
    current: s === i,
    reached: o <= a
  }));
}
function Au(n, e = 0) {
  const t = Math.max(0, Math.trunc(n)), i = Ui(t);
  return {
    value: t,
    level: i,
    toNextLevel: Ks(t),
    supernatural: Math.max(0, Math.trunc(e)),
    pips: Zo(t - i * 3, 3)
  };
}
function bu(n) {
  return (Array.isArray(n) ? n : ot(n)).map((t) => {
    const i = t.used;
    return { id: t.id, type: t.type, used: i, available: !i, shortLabel: pu[t.type] };
  });
}
function er(n, e) {
  const t = Number.isFinite(e) ? Math.max(0, e) : 0, i = Number.isFinite(n) ? Math.max(0, Math.min(t, n)) : 0, a = t > 0 ? i / t : 0;
  return { current: i, max: t, ratio: a, percent: a * 100 };
}
const wu = ["name", "rank"], ds = {
  expert: 0,
  specialized: 1,
  trained: 2,
  untrained: 3,
  inability: 4
};
function vu(n) {
  return wu.includes(n);
}
function Cu(n, e) {
  return [...n].sort((t, i) => (e === "rank" ? ds[t.rank] - ds[i.rank] : 0) || t.name.localeCompare(i.name, "en-US"));
}
function Eu(n) {
  const e = n.system.grantedBy;
  return !e || e.status === "retained" ? !0 : !e.sourceUuid && !e.instanceId && !e.grantId;
}
function us(n) {
  const e = Ke(n), t = Number.isInteger(n.system.cost.amount) && n.system.cost.amount > 0 ? n.system.cost.amount : 0;
  return {
    archived: n.system.archived === !0,
    cost: {
      amount: t,
      scalable: n.system.cost.scalable === !0,
      pools: e,
      payable: t > 0 && e.length > 0
    },
    description: n.system.description.trim(),
    canDelete: Eu(n)
  };
}
function Iu(n) {
  const e = new Intl.Collator("en-US", { sensitivity: "base", numeric: !0 });
  return n.map((t, i) => ({ ability: t, index: i })).sort((t, i) => +(t.ability.system.archived === !0) - +(i.ability.system.archived === !0) || e.compare(t.ability.name, i.ability.name) || t.index - i.index).map(({ ability: t }) => t);
}
class Ru {
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
function Xi(n) {
  return String(n.level ?? "1").trim() || "1";
}
function Vi(n) {
  return !/^\d+$/.test(Xi(n));
}
function Pn(n) {
  return n.depleted !== !0;
}
function tr(n) {
  return Wn.includes(n) ? n : "subtle";
}
function ir(n) {
  return _n.includes(n) ? n : "low";
}
function Aa(n) {
  const e = Number(n.level);
  return n.levelOverride === !0 && Number.isInteger(e) && e >= 1 ? e : tr(n.manifestation) === "manifest" ? 6 : 4;
}
const xn = ["equipment", "cypher", "artifact"];
function ms(n, e) {
  const t = Number(n);
  return Number.isInteger(t) && t >= 0 ? t : e;
}
function Ni(n) {
  return xn.includes(n);
}
function Nu(n) {
  if (!Ni(n.type)) return null;
  const e = n.system.depletion && typeof n.system.depletion == "object" ? n.system.depletion : null;
  return {
    id: n.id,
    name: n.name,
    type: n.type,
    level: n.type === "cypher" ? Aa(n.system) : n.type === "artifact" ? Xi(n.system) : null,
    levelRollable: n.type === "artifact" && Vi(n.system),
    power: n.type === "cypher" ? ir(n.system.power) : null,
    quantity: n.type === "equipment" ? ms(n.system.quantity, 1) : null,
    equipped: n.type === "equipment" && typeof n.system.equipped == "boolean" ? n.system.equipped : null,
    description: typeof n.system.description == "string" ? n.system.description.trim() : "",
    depleted: n.type === "artifact" && n.system.depleted === !0,
    usable: n.type !== "artifact" || Pn(n.system),
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
function qn(n) {
  const e = n.track, t = n.severity, i = n.count, a = i === void 0 || i.trim() === "" ? Number.NaN : Number(i);
  if (e !== "character" && e !== "shield" || !fe.includes(t) || !Number.isInteger(a) || a < 0) throw new Error("Invalid Wound count action data.");
  if (e === "shield") {
    const s = n.shieldId?.trim();
    if (!s) throw new Error("Invalid Wound count action data.");
    return { track: e, shieldId: s, severity: t, count: a };
  }
  return { track: e, severity: t, count: a };
}
async function Mu(n, e) {
  const t = rt(e);
  if (!t) throw new Error("Weapon family must not be blank.");
  const i = oe([...n.system.proficiencies.weaponFamilies, t]);
  return await n.update({ "system.proficiencies.weaponFamilies": i }), i;
}
async function Uu(n, e) {
  const t = rt(e), i = oe(n.system.proficiencies.weaponFamilies).filter((a) => a !== t);
  return await n.update({ "system.proficiencies.weaponFamilies": i }), i;
}
async function Gu(n) {
  const e = await foundry.applications.api.DialogV2.input({
    window: { title: game.i18n.localize("MAGNUSARCHIVES.Settings.Character.AddWeaponFamily") },
    content: `<div class="magnusarchives magnusarchives-dialog"><label class="magnusarchives-dialog-field">${game.i18n.localize("MAGNUSARCHIVES.Settings.Character.WeaponFamily")}
      <input name="family" type="text" list="magnusarchives-character-weapon-families" required autofocus>
      <datalist id="magnusarchives-character-weapon-families">${ao.map((t) => `<option value="${yt(t)}"></option>`).join("")}</datalist>
    </label></div>`,
    rejectClose: !1,
    ok: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Add") }
  });
  e && await Mu(n, e.family);
}
function ku(n) {
  const e = n.family, t = n.category;
  if (e !== "weapon" && e !== "armor") throw new Error("Invalid familiarity action data.");
  if (!t || !(e === "weapon" ? Oe : Be).includes(t)) throw new Error("Invalid familiarity action data.");
  return { family: e, category: t };
}
function Hu(n, e) {
  const t = /* @__PURE__ */ new Set([...Oe, ...Be]), i = new Set(n.filter((a) => t.has(a)));
  return i.has(e) ? i.delete(e) : i.add(e), [...i];
}
async function $u(n, e, t) {
  const i = e === "weapon" ? "weaponCategories" : "armorCategories", a = Hu(n.system.proficiencies[i], t);
  return await n.update({ [`system.proficiencies.${i}`]: a }), a;
}
function bi(n) {
  return n.replace(/[&<>"']/g, (e) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[e]);
}
function Vu(n) {
  const e = n ?? { category: "Accuracy", shifts: 1, specification: "", description: "" };
  return `<div class="magnusarchives magnusarchives-dialog magnusarchives-power-shift-dialog">
    <label class="magnusarchives-dialog-field">${game.i18n.localize("MAGNUSARCHIVES.PowerShifts.Category")}
      <input name="category" type="text" value="${bi(e.category)}" list="magnusarchives-power-shift-categories" required>
      <datalist id="magnusarchives-power-shift-categories">${Qr.map((t) => `<option value="${bi(t)}"></option>`).join("")}</datalist>
    </label>
    <label class="magnusarchives-dialog-field">${game.i18n.localize("MAGNUSARCHIVES.PowerShifts.Shifts")}
      <input name="shifts" type="number" min="1" step="1" value="${e.shifts}" required>
    </label>
    <label class="magnusarchives-dialog-field">${game.i18n.localize("MAGNUSARCHIVES.PowerShifts.Specification")}
      <input name="specification" type="text" value="${bi(e.specification)}">
    </label>
    <label class="magnusarchives-dialog-field">${game.i18n.localize("MAGNUSARCHIVES.PowerShifts.Description")}
      <textarea name="description" rows="3">${bi(e.description)}</textarea>
    </label>
  </div>`;
}
async function fs(n, e, t) {
  const i = await foundry.applications.api.DialogV2.input({
    window: { title: game.i18n.localize(t ? "MAGNUSARCHIVES.PowerShifts.Edit" : "MAGNUSARCHIVES.PowerShifts.Add") },
    content: Vu(t),
    rejectClose: !1,
    ok: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Save") }
  });
  if (!i) return;
  const a = il(e, {
    ...t ? { id: t.id } : {},
    category: String(i.category ?? ""),
    shifts: Number(i.shifts),
    specification: String(i.specification ?? ""),
    description: String(i.description ?? "")
  });
  await n.update({ "system.powerShifts": a });
}
async function Du(n, e, t) {
  await n.update({ "system.powerShifts": nl(e, t) });
}
const wi = "system." + G;
function nr() {
  return [...game.users];
}
function gs() {
  return nr().filter((n) => n.active && n.isGM).sort((n, e) => n.id.localeCompare(e.id))[0] ?? null;
}
function hs(n, e) {
  return e.isGM || n.testUserPermission(e, CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER);
}
function Fu(n) {
  return [...game.messages].some((e) => {
    const t = e.getFlag(G, "playerIntrusion");
    return !!(t && typeof t == "object" && t.requestId === n);
  });
}
class Tu {
  #e;
  #t;
  #i = /* @__PURE__ */ new Set();
  #n = /* @__PURE__ */ new Set();
  constructor(e, t) {
    this.#e = e, this.#t = t;
  }
  initialize() {
    game.socket.on(wi, (e) => {
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
      const i = je(), a = gs();
      return a && a.id !== game.user.id ? game.socket.emit(wi, {
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
    if (!(this.#n.has(e) || Fu(e))) {
      this.#n.add(e);
      try {
        const s = await fromUuid(t);
        if (!s || s.type !== "character" || s.uuid !== t)
          throw new Error(game.i18n.localize("MAGNUSARCHIVES.Intrusion.Player.CharacterMissing"));
        const o = nr().find((l) => l.id === i && l.active);
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
        await this.#a(i.requestId, i.actorUuid, i.requesterUserId), game.socket.emit(wi, {
          type: "player-intrusion-result",
          requestId: i.requestId,
          recipientUserId: i.requesterUserId,
          success: !0
        });
      } catch (s) {
        game.socket.emit(wi, {
          type: "player-intrusion-result",
          requestId: i.requestId,
          recipientUserId: i.requesterUserId,
          success: !1,
          error: s instanceof Error ? s.message : String(s)
        });
      }
  }
}
let Wt = null;
function zu(n, e) {
  return Wt = new Tu(n, e), Wt.initialize(), Wt;
}
function Pu() {
  if (!Wt) throw new Error("Player Intrusion controller is not ready.");
  return Wt;
}
const gn = "is-quick-roll-pulse";
function xu(n) {
  n.classList.remove(gn), n.offsetWidth, n.classList.add(gn), n.addEventListener("animationend", () => {
    n.classList.remove(gn);
  }, { once: !0 });
}
const qu = foundry.applications.api.HandlebarsApplicationMixin(
  foundry.applications.sheets.ActorSheetV2
);
function ys(n) {
  const e = n.dataset.severity, t = n.dataset.woundId;
  if (!fe.includes(e) || !t)
    throw new Error("Invalid Wound action data.");
  return { severity: e, woundId: t };
}
function P(n) {
  const e = n.dataset.itemId;
  if (!e) throw new Error("Missing Item ID.");
  return e;
}
function Ou(n) {
  return game.i18n.localize(`MAGNUSARCHIVES.Pools.${n[0].toUpperCase()}${n.slice(1)}`);
}
function hn(n) {
  return n > 0 ? `+${n}` : String(n);
}
function Qe(n) {
  const e = n.dataset.focusUuid, t = n.dataset.nodeId;
  if (!e || !t) throw new Error("Missing Focus node action data.");
  return { focusUuid: e, nodeId: t };
}
const Bu = {
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
async function Ve(n, e) {
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
]);
class C extends qu {
  #e = new Lo();
  #t = new jo();
  #i = null;
  #n = !1;
  #a = "name";
  #l = new Ru();
  #r = new ps();
  #s = new ps();
  #c = null;
  #o = null;
  #d = "skills";
  static DEFAULT_OPTIONS = {
    ...sa,
    classes: ["magnusarchives", "sheet", "actor", "character-sheet"],
    actions: ra({
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
      editWoundCapacityOverride: C.#U,
      resetWoundCapacityOverride: C.#Se,
      editRecoveryOverride: C.#G,
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
      toggleShieldEquipped: C.#Ue,
      toggleArmorEquipped: C.#Ge,
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
      skipCoreSetup: C.#Ye,
      markCoreInitialized: C.#Je,
      restoreFocusAbility: C.#Qe,
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
    if (await super._onRender(e, t), la(this.element, this.isEditable, Ss), this.#o) {
      this.#d = this.#o.activeTab;
      const i = this.changeTab;
      typeof i == "function" && i.call(this, this.#d, "primary"), rd(this.element, this.#o), this.#o = null;
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
    return s && i?.type !== s ? (ui.notifications.warn(game.i18n.localize("MAGNUSARCHIVES.Hud.InvalidIdentityDrop")), null) : i?.type === "focus" ? (await Ya(this.actor, i), i) : i?.type === "characterType" ? (await as(this.actor, i), i) : i?.type === "descriptor" ? (await ss(this.actor, i), i) : i?.type === "species" ? (await os(this.actor, i), i) : i?.type === "genre" ? (await zn(this.actor, i), i) : super._onDropDocument(e, t);
  }
  static async #A() {
    await as(this.actor);
  }
  static async #f() {
    await ss(this.actor);
  }
  static async #p() {
    await os(this.actor);
  }
  static async #h() {
    await zn(this.actor);
  }
  static async #m() {
    await (await game.magnusarchives.services.genres.active(this.actor))?.sheet?.render(!0);
  }
  static async #S() {
    await Bd(this.actor);
  }
  static async #w(e, t) {
    const i = t.dataset.choiceId;
    i && await Ld(this.actor, i);
  }
  static async #V() {
    await jd(this.actor), await this.render({ force: !0 });
  }
  static async #D(e, t) {
    const i = this.actor.items.get(P(t));
    i?.type !== "characterType" && i?.type !== "descriptor" && i?.type !== "species" || await i.sheet?.render(!0);
  }
  static async #F(e, t) {
    await nu(this.actor, P(t));
  }
  static async #T(e, t) {
    await this.actor.items.get(P(t))?.sheet?.render(!0);
  }
  static async #z(e, t) {
    const i = this.actor.items.get(P(t));
    if (!i || i.type !== "ability") throw new Error("Ability Item not found.");
    await lu(
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
    const i = P(t), a = this.#l.toggle(i), s = t.closest(".compact-ability");
    if (!s) return;
    s.classList.toggle("is-expanded", a);
    const o = s.querySelector(".compact-ability-details");
    o && (o.hidden = !a);
    for (const r of s.querySelectorAll("[data-action='toggleAbilityDetails']"))
      r.setAttribute("aria-expanded", String(a));
  }
  static async #q(e, t) {
    e.preventDefault(), e.stopPropagation();
    const i = this.actor.items.get(P(t));
    if (!i || i.type !== "ability") throw new Error("Ability Item not found.");
    await i.sheet?.render(!0);
  }
  static async #O(e, t) {
    e.preventDefault(), e.stopPropagation();
    const i = this.actor.items.get(P(t));
    if (!i || i.type !== "ability") throw new Error("Ability Item not found.");
    try {
      await uu(
        this.actor,
        i
      );
    } catch (a) {
      ui.notifications.error(a instanceof Error ? a.message : String(a));
    }
  }
  static async #B(e, t) {
    e.preventDefault(), e.stopPropagation();
    const i = this.actor.items.get(P(t));
    if (!i || i.type !== "ability") throw new Error("Ability Item not found.");
    const a = i.system.archived === !0;
    await i.update({ "system.archived": !a });
  }
  static async #L(e, t) {
    e.preventDefault(), e.stopPropagation();
    const i = this.actor.items.get(P(t));
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
    if (!Ni(i)) throw new Error("Invalid Inventory Item type.");
    await (await this.actor.createEmbeddedDocuments("Item", [{
      name: game.i18n.localize(`MAGNUSARCHIVES.Inventory.New.${i}`),
      type: i
    }]))[0]?.sheet?.render(!0);
  }
  static async #W(e, t) {
    const i = this.actor.items.get(P(t));
    if (!i || !Ni(i.type)) throw new Error("Inventory Item not found.");
    await i.sheet?.render(!0);
  }
  static #_(e, t) {
    e.preventDefault(), e.stopPropagation();
    const i = P(t), a = this.#r.toggle(i), s = t.closest(".compact-inventory-item");
    if (!s) return;
    s.classList.toggle("is-expanded", a);
    const o = s.querySelector(".compact-inventory-details");
    o && (o.hidden = !a), t.setAttribute("aria-expanded", String(a));
  }
  static async #K(e, t) {
    const i = this.actor.items.get(P(t));
    if (!i || !Ni(i.type)) throw new Error("Inventory Item not found.");
    await foundry.applications.api.DialogV2.confirm({
      window: { title: game.i18n.localize("MAGNUSARCHIVES.Inventory.DeleteTitle") },
      content: `<div class="magnusarchives magnusarchives-dialog"><p>${game.i18n.format("MAGNUSARCHIVES.Inventory.DeleteConfirm", { name: i.name })}</p></div>`,
      yes: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Delete") },
      no: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Cancel") }
    }) && (this.#r.remove(i.id), await i.delete());
  }
  static async #N(e, t) {
    const i = this.actor.items.get(P(t));
    if (!i || i.type !== "artifact") throw new Error("Artifact Item not found.");
    await $i(i);
  }
  static async #X(e, t) {
    const i = this.actor.items.get(P(t));
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
    const i = this.actor.items.get(P(t));
    if (!i || !["ability", "weapon", "shield", "armor", ...xn].includes(i.type))
      throw new Error("Chat Item not found.");
    await game.magnusarchives.services.itemChat.publish(i);
  }
  static async #J() {
    await Cc(this.actor);
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
    const i = qn(t.dataset);
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
    const i = qn(t.dataset);
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
    const { family: i, category: a } = ku(t.dataset);
    await $u(this.actor, i, a), await this.render({ force: !0 });
  }
  static async #se() {
    await Gu(this.actor), await this.render({ force: !0 });
  }
  static async #oe(e, t) {
    e.preventDefault(), e.stopPropagation(), await Uu(
      this.actor,
      t.dataset.weaponFamily
    ), await this.render({ force: !0 });
  }
  static #I(e) {
    const t = e.actor.system, i = [...e.actor.items].filter((a) => a.type === "characterType");
    return Ua(t.powerShifts ?? [], i);
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
    i && await Du(
      this.actor,
      C.#I(this),
      i
    );
  }
  static async #de(e, t) {
    const { severity: i, woundId: a } = ys(t);
    await wc(this.actor, i, a);
  }
  static async #ue(e, t) {
    const { severity: i, woundId: a } = ys(t);
    await vc(this.actor, i, a);
  }
  static async #me() {
    await Ec(this.actor);
  }
  static async #pe() {
    await Da(this.actor);
  }
  static async #fe(e, t) {
    const i = t.dataset.recoveryType, a = t.dataset.recoverySlotId;
    !i || !Ue.includes(i) || await Da(this.actor, i, a);
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
      "system.recovery.used": Et(t)
    }), ui.notifications.info(game.i18n.localize("MAGNUSARCHIVES.Hud.RecoveriesReset"));
  }
  static async #he(e) {
    e?.stopPropagation(), await Ic(this.actor);
  }
  static async #ye(e, t) {
    e.preventDefault(), e.stopPropagation(), t instanceof HTMLButtonElement && (t.disabled = !0);
    try {
      await Pu().activate(
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
    !i || !Yi.includes(i) || await Mc(this.actor, i);
  }
  static async #y(e, t) {
    e.preventDefault(), e.stopPropagation();
    const i = t.dataset.overrideKey;
    if (!i || !Yi.includes(i)) return;
    const a = Un(
      this.actor.system,
      i
    );
    await this.actor.update({ [a.path]: null });
  }
  static async #U(e) {
    e.preventDefault(), e.stopPropagation(), await Gc(this.actor);
  }
  static async #Se(e) {
    e.preventDefault(), e.stopPropagation(), await Fc(this.actor);
  }
  static async #G(e) {
    e.preventDefault(), e.stopPropagation(), await Dc(this.actor);
  }
  static async #b(e) {
    e.preventDefault(), e.stopPropagation(), await Tc(this.actor);
  }
  static async #k(e, t) {
    if (e.target instanceof Element && e.target.closest("input, button, select, textarea, a")) return;
    const i = t.dataset.pool;
    !i || !k.includes(i) || await Qc(this.actor, i);
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
    await (await Ve(this.actor, i))?.sheet?.render(!0);
  }
  static async #Ae() {
    await this.actor.createEmbeddedDocuments("Item", [{
      name: game.i18n.localize("MAGNUSARCHIVES.Skill.New"),
      type: "skill"
    }]);
  }
  static #E(e, t) {
    const i = t.dataset.sortMode;
    !vu(i) || i === this.#a || (this.#a = i, this.render({ force: !0 }));
  }
  static async #R(e, t) {
    e.stopPropagation();
    const i = this.actor.items.get(P(t));
    if (!i || i.type !== "skill") throw new Error("Skill Item not found.");
    xu(t);
    try {
      const a = st(), s = game.magnusarchives.services.skills.buildQuickRollRequest(
        i,
        { enabledRuleModuleIds: a }
      ), o = await game.magnusarchives.services.rolls.execute(
        this.actor,
        s,
        xe()
      );
      await da(this.actor, o);
    } catch (a) {
      ui.notifications.error(a instanceof Error ? a.message : String(a));
    }
  }
  static async #$(e, t) {
    e.stopPropagation();
    const i = this.actor.items.get(P(t));
    if (!i || i.type !== "skill") throw new Error("Skill Item not found.");
    await ed(
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
    const i = this.actor.items.get(P(t));
    if (!i || i.type !== "skill") throw new Error("Skill Item not found.");
    await i.sheet?.render(!0);
  }
  static async #we(e, t) {
    const i = this.actor.items.get(P(t));
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
    const i = this.actor.items.get(P(t));
    if (!i || i.type !== "weapon") throw new Error("Weapon Item not found.");
    if (!game.magnusarchives.services.weapons.ammunition(i).canAttack) {
      ui.notifications.warn(game.i18n.localize("MAGNUSARCHIVES.Combat.Weapon.InsufficientAmmo"));
      return;
    }
    await nd(
      this.actor,
      i
    );
  }
  static #Re(e, t) {
    e.preventDefault(), e.stopPropagation();
    const i = P(t), a = this.#s.toggle(i), s = t.closest(".compact-combat-item");
    if (!s) return;
    s.classList.toggle("is-expanded", a);
    const o = s.querySelector(".compact-combat-details");
    o && (o.hidden = !a), t.setAttribute("aria-expanded", String(a));
  }
  static async #Ne(e, t) {
    e.preventDefault(), e.stopPropagation();
    const i = this.actor.items.get(P(t));
    if (!i || !["weapon", "shield", "armor"].includes(i.type))
      throw new Error("Combat Item not found.");
    await $i(i);
  }
  static async #Me(e, t) {
    if (e.preventDefault(), e.stopPropagation(), !this.isEditable) return;
    const i = this.actor.items.get(P(t));
    if (!i || i.type !== "weapon") throw new Error("Weapon Item not found.");
    await game.magnusarchives.services.weapons.reload(i);
  }
  static async #Ue(e, t) {
    if (e.preventDefault(), e.stopPropagation(), !this.isEditable) return;
    const i = this.actor.items.get(P(t));
    if (!i || i.type !== "shield") throw new Error("Shield Item not found.");
    await game.magnusarchives.services.shields.setEquipped(
      this.actor,
      i,
      !i.system.equipped
    );
  }
  static async #Ge(e, t) {
    if (e.preventDefault(), e.stopPropagation(), !this.isEditable) return;
    const i = this.actor.items.get(P(t));
    if (!i || i.type !== "armor") throw new Error("Armor Item not found.");
    await i.update({ "system.equipped": !i.system.equipped });
  }
  static async #ke(e, t) {
    e.preventDefault(), e.stopPropagation();
    const i = this.actor.items.get(P(t));
    if (!i || i.type !== "weapon" && i.type !== "armor" && i.type !== "shield")
      throw new Error("Combat Item not found.");
    await i.sheet?.render(!0);
  }
  static async #He(e, t) {
    e.preventDefault(), e.stopPropagation();
    const i = this.actor.items.get(P(t));
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
    await Vn(this.actor, "block");
  }
  static async #Ve() {
    await Vn(this.actor, "dodge");
  }
  static async #De(e, t) {
    const { focusUuid: i, nodeId: a } = Qe(t), s = await Ve(this.actor, i);
    if (!s) throw new Error("Focus Item not found.");
    await Bo(s, a);
  }
  static async #Fe(e, t) {
    const { focusUuid: i, nodeId: a } = Qe(t), s = await Ve(this.actor, i);
    if (!s) {
      ui.notifications.error(game.i18n.localize("MAGNUSARCHIVES.Focus.Errors.FocusUnavailable"));
      return;
    }
    try {
      const o = await game.magnusarchives.services.focusAcquisition.acquireManual(
        this.actor,
        s,
        a,
        Ht
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
    const { focusUuid: i, nodeId: a } = Qe(t), s = await Ve(this.actor, i);
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
    i !== "other" && !Yn.includes(i) || await Rd(
      this.actor,
      i
    );
  }
  static async #Pe(e, t) {
    const i = t.dataset.purchaseId;
    i && await Nd(
      this.actor,
      i
    );
  }
  static async #xe() {
    await Md(this.actor);
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
    await Ya(this.actor);
  }
  static async #Le(e, t) {
    const i = t.dataset.focusUuid;
    i && await kd(this.actor, i);
  }
  static async #je() {
    game.user.isGM && (this.#n = !this.#n, await this.render({ force: !0 }));
  }
  static async #We(e, t) {
    const { focusUuid: i, nodeId: a } = Qe(t), s = await Ve(this.actor, i);
    s && (await es(
      this.actor,
      s,
      a
    ), await this.render({ force: !0 }));
  }
  static async #_e(e, t) {
    if (!game.user.isGM || !this.#n) return;
    const { focusUuid: i, nodeId: a } = Qe(t), s = await Ve(this.actor, i);
    s && (await zd(
      this.actor,
      s,
      a
    ), await this.render({ force: !0 }));
  }
  static async #Ke(e, t) {
    if (!game.user.isGM || !this.#n) return;
    const { focusUuid: i, nodeId: a } = Qe(t), s = await Ve(this.actor, i);
    s && (await es(
      this.actor,
      s,
      a
    ), await this.render({ force: !0 }));
  }
  static async #Xe() {
    await Fd(this.actor);
  }
  static async #Ye() {
    game.user.isGM && await Za(this.actor, "skipped");
  }
  static async #Je() {
    game.user.isGM && await Za(this.actor, "manual");
  }
  static async #Qe(e, t) {
    const { focusUuid: i, nodeId: a } = Qe(t), s = await Ve(this.actor, i);
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
    if (!(e instanceof Le)) {
      if (e instanceof ce) {
        ui.notifications.error(game.i18n.localize(Bu[e.code]));
        return;
      }
      console.error(e), ui.notifications.error(game.i18n.localize("MAGNUSARCHIVES.Focus.Errors.Unexpected"));
    }
  }
  async _prepareContext(e) {
    this.element?.isConnected && (this.#o = od(this.element), this.#d = this.#o.activeTab);
    const t = await super._prepareContext(e), i = Cu([...this.actor.items].filter((h) => h.type === "skill").map((h) => {
      const b = h, D = game.magnusarchives.services.skills.configuredPool(b);
      return {
        id: b.id,
        name: b.name,
        rank: b.system.rank,
        rankLabel: game.i18n.localize(`MAGNUSARCHIVES.Skill.Ranks.${b.system.rank}`),
        poolLabel: D ? game.i18n.localize(`MAGNUSARCHIVES.Pools.${D[0].toUpperCase()}${D.slice(1)}`) : game.i18n.localize("MAGNUSARCHIVES.Skill.ChoosePool")
      };
    }), this.#a), a = Iu([...this.actor.items].filter((h) => h.type === "ability").map((h) => h));
    this.#l.retain(a.map((h) => h.id));
    const s = await Promise.all(a.map(async (h, b) => {
      const D = h, T = us(h), le = this.#l.isExpanded(h.id), He = Eo(
        T.cost.amount,
        T.cost.pools,
        Ou,
        {
          pair: game.i18n.localize("MAGNUSARCHIVES.Ability.CostDisplay.Or"),
          middle: game.i18n.localize("MAGNUSARCHIVES.Ability.CostDisplay.Separator"),
          final: game.i18n.localize("MAGNUSARCHIVES.Ability.CostDisplay.FinalOr")
        },
        T.cost.scalable
      ), dt = T.description ? await foundry.applications.ux.TextEditor.implementation.enrichHTML(
        T.description,
        { async: !0, relativeTo: D }
      ) : "";
      return {
        id: h.id,
        name: h.name,
        archived: T.archived,
        startsArchivedGroup: T.archived && (b === 0 || a[b - 1].system.archived !== !0),
        canPay: this.isEditable && T.cost.payable,
        canDelete: this.isEditable && T.canDelete,
        expanded: le,
        costLabel: He,
        enrichedDescription: dt,
        hasDescription: !!T.description
      };
    })), o = this.actor, r = [...this.actor.items].filter((h) => h.type === "weapon" || h.type === "shield" || h.type === "armor");
    r.filter((h) => h.type === "shield" && !!h.system.equipped).length > 1 && this.isEditable && await game.magnusarchives.services.shields.normalizeEquipped(
      o
    ), this.#s.retain(r.map((h) => h.id));
    const u = async (h, b) => b ? foundry.applications.ux.TextEditor.implementation.enrichHTML(b, { async: !0, relativeTo: h }) : "", c = (await Promise.all(r.filter((h) => h.type === "weapon").map(async (h) => {
      const b = h, D = b.system.description.trim();
      return {
        id: b.id,
        name: b.name,
        category: game.i18n.localize(`MAGNUSARCHIVES.Combat.Weapon.Category.${b.system.category}`),
        attackType: game.i18n.localize(`MAGNUSARCHIVES.Combat.Weapon.AttackType.${b.system.attackType}`),
        range: game.i18n.localize(`MAGNUSARCHIVES.Combat.Range.${b.system.rangeCategory}`),
        damage: game.magnusarchives.services.combat.weaponBaseDamage(b),
        depletionEnabled: b.system.depletion.enabled,
        depletionLabel: b.system.depletion.enabled ? ln(b.system.depletion) : "",
        ammoEnabled: b.system.ammo.enabled,
        ammoLabel: b.system.ammo.enabled ? `${b.system.ammo.value} / ${b.system.ammo.max}` : "",
        canAttack: game.magnusarchives.services.weapons.ammunition(b).canAttack,
        depleted: !!b.system.depleted,
        freelyUsed: game.magnusarchives.services.combat.weaponFreelyUsed(o, b),
        expanded: this.#s.isExpanded(b.id),
        hasDescription: !!D,
        enrichedDescription: await u(h, D)
      };
    }))).sort((h, b) => h.name.localeCompare(b.name)), p = (await Promise.all(r.filter((h) => h.type === "armor").map(async (h) => {
      const b = h, D = b.system.description.trim(), T = b.system.depletion;
      return {
        id: b.id,
        name: b.name,
        category: game.i18n.localize(`MAGNUSARCHIVES.Combat.Armor.Category.${b.system.category}`),
        equipped: b.system.equipped,
        freelyUsed: game.magnusarchives.services.combat.armorFreelyUsed(o, b),
        depletionEnabled: !!T?.enabled,
        depletionLabel: T?.enabled ? ln(T) : "",
        depleted: !!b.system.depleted,
        expanded: this.#s.isExpanded(b.id),
        hasDescription: !!D,
        enrichedDescription: await u(h, D)
      };
    }))).sort((h, b) => h.name.localeCompare(b.name)), y = (await Promise.all(r.filter((h) => h.type === "shield").map(async (h) => {
      const b = h, D = b.system.description.trim(), T = b.system.depletion, le = Ri({
        minor: b.system.wounds.minor.length,
        moderate: b.system.wounds.moderate.length,
        major: b.system.wounds.major.length
      }, b.system.derived.capacities).map((He) => ({
        ...He,
        label: game.i18n.localize(`MAGNUSARCHIVES.Wounds.Severity.${He.severity}`),
        shortLabel: game.i18n.localize(`MAGNUSARCHIVES.Hud.Wounds.${He.severity}`)
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
        woundTracks: le,
        depletionEnabled: !!T?.enabled,
        depletionLabel: T?.enabled ? ln(T) : "",
        depleted: !!b.system.depleted,
        expanded: this.#s.isExpanded(b.id),
        hasDescription: !!D,
        enrichedDescription: await u(h, D)
      };
    }))).sort((h, b) => h.name.localeCompare(b.name)), m = y.filter((h) => h.equipped).length > 1, f = this.actor.system, g = [], A = [], v = [];
    for (const h of f.focusProgress ?? []) {
      const b = await Ve(this.actor, h.focusUuid);
      if (!b || b.type !== "focus") {
        A.push(h.focusUuid);
        continue;
      }
      v.push({
        uuid: h.focusUuid,
        name: b.name,
        provenance: h.provenance ?? "additional"
      });
      const D = await game.magnusarchives.services.focusTrees.prepare(b, {
        characterTier: B(this.actor.system),
        progress: h,
        editable: this.isEditable,
        missingOwnedNodeIds: game.magnusarchives.services.focusAcquisition.missingOwnedNodeIds(
          this.actor,
          b,
          h
        ),
        gmOverrideAllowed: game.user.isGM,
        gmProgressionEdit: this.#n
      });
      g.push({
        ...D,
        provenance: h.provenance ?? "additional",
        provenanceLabel: `MAGNUSARCHIVES.Focus.Association.${h.provenance === "creation" ? "Creation" : "Additional"}`,
        ownedCount: h.ownedNodeIds.length
      });
    }
    const E = game.magnusarchives.services.advancement.view(
      this.actor,
      st()
    ), H = game.magnusarchives.services.advancement.progressionGuidance(
      this.actor,
      st()
    ), R = [...this.actor.items].filter((h) => h.type === "characterType"), U = R.map((h) => ({ id: h.id, name: h.name })), z = [...this.actor.items].filter((h) => h.type === "species").map((h) => ({ id: h.id, name: h.name })), K = [...this.actor.items].filter((h) => h.type === "descriptor").map((h) => {
      const b = h.system.instance, D = b?.role ?? "custom";
      return {
        id: h.id,
        name: h.name,
        role: D,
        instanceId: b?.instanceId ?? h.id,
        attachedAt: b?.attachedAt ?? 0,
        roleLabel: game.i18n.localize(`MAGNUSARCHIVES.Packages.Role.${D}`)
      };
    }), M = new Map([...this.actor.items].filter((h) => h.type === "characterType" || h.type === "descriptor" || h.type === "species").map((h) => [h.system.instance?.instanceId ?? "", h.name])), V = [...this.actor.items].filter((h) => {
      const b = h.system.grantedBy;
      return b?.instanceId && (b.kind === "type" || b.kind === "descriptor" || b.kind === "species");
    }).map((h) => {
      const b = h.system.grantedBy;
      return {
        id: h.id,
        name: h.name,
        type: h.type,
        sourceName: M.get(b.instanceId) ?? game.i18n.localize("MAGNUSARCHIVES.Packages.Retained"),
        grantId: b.grantId,
        status: b.status,
        replacementLabel: b.replacement?.active ? `${b.replacement.originalName} → ${b.replacement.replacementName}` : ""
      };
    }), I = this.actor.system, ie = Ua(
      I.powerShifts ?? [],
      R
    ), W = tl(
      ie,
      el(R)
    ), Ge = {
      enabled: I.presentation.powerShiftsEnabled,
      allocated: W.allocated,
      available: W.available,
      overBudget: W.overBudget,
      legacy: (I.powerShifts ?? []).length === 0 && ie.some((h) => h.id.startsWith("legacy-")),
      entries: ie.map((h) => ({
        ...h,
        categoryWarning: W.categoryWarnings.has(h.category.trim().toLocaleLowerCase("en-US"))
      }))
    }, q = await game.magnusarchives.services.genres.active(
      this.actor
    ), J = q ? {
      attached: !0,
      available: !0,
      name: q.name,
      uuid: q.uuid,
      img: q.img,
      provenance: I.genre.provenance,
      totalEffortCapMode: q.system.options.totalEffortCapMode,
      totalEffortCapLabel: game.i18n.localize(
        `MAGNUSARCHIVES.Genre.EffortCap.${q.system.options.totalEffortCapMode}`
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
    }, ke = [...this.actor.items].filter((h) => xn.includes(h.type)).sort((h, b) => h.name.localeCompare(b.name, "en-US"));
    this.#r.retain(ke.map((h) => h.id));
    const ye = (await Promise.all(ke.map(async (h) => {
      const b = Nu(h);
      if (!b) return null;
      const D = this.#r.isExpanded(h.id), T = b.description ? await foundry.applications.ux.TextEditor.implementation.enrichHTML(
        b.description,
        { async: !0, relativeTo: h }
      ) : "";
      return {
        ...b,
        expanded: D,
        hasDescription: !!b.description,
        enrichedDescription: T,
        depletionLabel: b.depletion?.enabled ? b.depletion.formula : "",
        powerLabel: b.power ? game.i18n.localize(`MAGNUSARCHIVES.Cypher.Power.${b.power}`) : "",
        canRollLevel: b.levelRollable && b.usable,
        canRollDepletion: !!(b.depletion?.enabled && b.usable)
      };
    }))).filter((h) => h !== null), Ce = {
      cypherLimit: I.derived.cypherLimit.max,
      equipment: ye.filter((h) => h.type === "equipment"),
      cyphers: ye.filter((h) => h.type === "cypher"),
      artifacts: ye.filter((h) => h.type === "artifact")
    }, re = v.find((h) => h.provenance === "creation") ?? v[0], Q = hu({
      descriptors: K,
      ...z[0] ? { species: { id: z[0].id, name: z[0].name } } : {},
      ...U[0] ? { type: { id: U[0].id, name: U[0].name } } : {},
      ...re ? { focus: { uuid: re.uuid, name: re.name } } : {},
      hideFocus: I.presentation.hideFocusInSentence
    }), Se = {
      ...Q,
      descriptors: Q.descriptors.map((h) => ({
        ...h,
        displayName: h.missing ? game.i18n.localize("MAGNUSARCHIVES.Hud.Placeholder.Descriptor") : h.displayName
      })),
      type: {
        ...Q.type,
        displayName: Q.type.missing ? game.i18n.localize("MAGNUSARCHIVES.Hud.Placeholder.Type") : Q.type.displayName
      },
      focus: {
        ...Q.focus,
        displayName: Q.focus.missing ? game.i18n.localize("MAGNUSARCHIVES.Hud.Placeholder.Focus") : Q.focus.displayName
      }
    }, me = Ri({
      minor: I.wounds.minor.length,
      moderate: I.wounds.moderate.length,
      major: I.wounds.major.length
    }, I.derived.wounds.capacities).map((h) => ({
      ...h,
      shortLabel: game.i18n.localize(`MAGNUSARCHIVES.Hud.Wounds.${h.severity}`),
      pips: h.pips.map((b) => ({
        ...b,
        tooltip: game.i18n.format("MAGNUSARCHIVES.Hud.SetWoundCount", {
          severity: game.i18n.localize(`MAGNUSARCHIVES.Wounds.Severity.${h.severity}`),
          count: b.targetCount
        })
      })),
      tooltip: game.i18n.format("MAGNUSARCHIVES.Hud.CharacterWoundTooltip", {
        severity: game.i18n.localize(`MAGNUSARCHIVES.Wounds.Severity.${h.severity}`),
        count: h.count,
        capacity: h.capacity
      })
    })), N = y.filter((h) => h.equipped), S = N.find((h) => !h.broken) ?? N[0], Y = S ? {
      ...S,
      tracks: Ri({
        minor: S.minor,
        moderate: S.moderate,
        major: S.major
      }, S.capacities).map((h) => ({
        ...h,
        itemId: S.id,
        shortLabel: game.i18n.localize(`MAGNUSARCHIVES.Hud.Wounds.${h.severity}`),
        pips: h.pips.map((b) => ({
          ...b,
          tooltip: game.i18n.format("MAGNUSARCHIVES.Hud.SetShieldWoundCount", {
            shield: S.name,
            severity: game.i18n.localize(`MAGNUSARCHIVES.Wounds.Severity.${h.severity}`),
            count: b.targetCount
          })
        })),
        tooltip: game.i18n.format("MAGNUSARCHIVES.Hud.ShieldWoundTooltip", {
          shield: S.name,
          severity: game.i18n.localize(`MAGNUSARCHIVES.Wounds.Severity.${h.severity}`),
          count: h.count,
          capacity: h.capacity
        })
      }))
    } : null, We = me.map((h, b) => ({
      character: h,
      shield: Y?.tracks[b] ?? null
    })), li = {
      appearance: Sl(I.appearance, this.actor.img),
      identity: Se,
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
      pools: k.map((h) => ({
        key: h,
        isMight: h === "might",
        canRally: h === "might" && game.magnusarchives.services.rally.canApply(this.actor),
        label: game.i18n.localize(`MAGNUSARCHIVES.Pools.${h[0].toUpperCase()}${h.slice(1)}`),
        value: I.stats[h].value,
        max: I.derived.pools[h].max,
        edge: I.derived.pools[h].edge,
        gauge: er(I.stats[h].value, I.derived.pools[h].max)
      })),
      wounds: {
        tracks: me,
        rows: We,
        hindrance: I.derived.wounds.hindrance,
        hindranceModifier: ve("hinder", I.derived.wounds.hindrance),
        dead: I.derived.wounds.dead
      },
      stress: {
        ...Au(I.stress.value, I.stress.supernatural),
        hindranceModifier: ve("hinder", I.derived.stress.level),
        canEdit: this.isEditable
      },
      damageTrack: {
        hurtAvailable: I.derived.damageTrack.hurtAvailable,
        dead: I.derived.damageTrack.dead,
        canEdit: this.isEditable,
        steps: Su(
          I.damageTrack.step,
          I.derived.damageTrack.hurtAvailable
        ).map((h) => ({
          ...h,
          label: game.i18n.localize(h.label),
          hint: game.i18n.localize(h.hintLabel),
          notes: h.noteLabels.map((b) => game.i18n.localize(b))
        }))
      },
      recoveries: bu(I.recovery.slots).map((h) => ({
        ...h,
        label: game.i18n.localize(`MAGNUSARCHIVES.Recovery.${h.type}`)
      })),
      recoveryFormulaLabel: I.derived.recovery.formula,
      canResetRecoveries: game.user.isGM,
      shield: Y
    }, wr = (h, b) => [
      ...this.actor.items
    ].filter((D) => D.type !== "characterType" && D.type !== "species" ? !1 : D.system[h === "weapon" ? "weaponUse" : "armorUse"]?.[b] === !0).map((D) => D.name), va = (h, b, D, T) => b.map((le) => {
      const He = wr(h, le), dt = D.includes(le), ci = He.length > 0, Mr = T.includes(le), Ur = dt && ci ? game.i18n.format("MAGNUSARCHIVES.Settings.Character.FamiliarityManualAndGranted", { sources: He.join(", ") }) : dt ? game.i18n.localize("MAGNUSARCHIVES.Settings.Character.FamiliarityManual") : ci ? game.i18n.format("MAGNUSARCHIVES.Settings.Character.FamiliarityGranted", { sources: He.join(", ") }) : game.i18n.localize("MAGNUSARCHIVES.Settings.Character.FamiliarityAbsent");
      return {
        family: h,
        category: le,
        label: game.i18n.localize(`MAGNUSARCHIVES.Combat.${h === "weapon" ? "Weapon" : "Armor"}.Category.${le}`),
        manual: dt,
        packageGranted: ci,
        effective: Mr,
        canToggle: this.isEditable && (dt || !ci),
        sourceHint: Ur
      };
    }), vr = {
      weapons: va(
        "weapon",
        Oe,
        I.proficiencies.weaponCategories,
        I.derived.packages.weaponCategories
      ),
      armor: va(
        "armor",
        Be,
        I.proficiencies.armorCategories,
        I.derived.packages.armorCategories
      ),
      weaponFamilies: oe([
        ...I.proficiencies.weaponFamilies,
        ...I.derived.packages.weaponFamilies ?? []
      ]).map((h) => {
        const b = [...this.actor.items].filter((T) => T.type === "characterType").filter((T) => {
          const le = T.system;
          return oe([
            ...le.weaponFamilies ?? [],
            ...qi(le.weaponFamilyUse)
          ]).includes(h);
        }).map((T) => T.name), D = I.proficiencies.weaponFamilies.includes(h);
        return {
          id: h,
          label: yt(h),
          manual: D,
          packageGranted: b.length > 0,
          canRemove: this.isEditable && D,
          sourceHint: b.length > 0 ? game.i18n.format("MAGNUSARCHIVES.Settings.Character.FamiliarityGranted", { sources: b.join(", ") }) : game.i18n.localize("MAGNUSARCHIVES.Settings.Character.FamiliarityManual")
        };
      })
    }, Cr = {
      tier: "MAGNUSARCHIVES.Character.Tier",
      effort: "MAGNUSARCHIVES.Character.Effort",
      mightMax: "MAGNUSARCHIVES.Overrides.MightMax",
      mightEdge: "MAGNUSARCHIVES.Overrides.MightEdge",
      speedMax: "MAGNUSARCHIVES.Overrides.SpeedMax",
      speedEdge: "MAGNUSARCHIVES.Overrides.SpeedEdge",
      intellectMax: "MAGNUSARCHIVES.Overrides.IntellectMax",
      intellectEdge: "MAGNUSARCHIVES.Overrides.IntellectEdge"
    }, Er = Yi.map((h) => {
      const b = Un(I, h);
      return { ...b, label: game.i18n.localize(Cr[h]), hasOverride: b.override !== null };
    }), $t = I.overrides.wounds ?? { minor: 0, moderate: 0, major: 0 }, Ir = {
      hasOverride: Object.values($t).some((h) => h !== 0),
      calculated: I.derived.wounds.calculatedCapacities,
      modifiers: $t,
      modifierLabels: {
        minor: hn($t.minor),
        moderate: hn($t.moderate),
        major: hn($t.major)
      },
      effective: I.derived.wounds.capacities
    }, Rr = {
      hasOverride: I.recovery.customized || I.recovery.rollModifier !== 0,
      calculatedSlots: 4,
      calculatedFormula: I.derived.recovery.calculatedFormula,
      effectiveSlots: I.recovery.slots.length,
      effectiveFormula: I.derived.recovery.formula,
      modifier: I.recovery.rollModifier
    }, Ca = [game.i18n.localize(H.focusAbilityCount === 2 ? "MAGNUSARCHIVES.Advancement.Guidance.TwoFocusAbilities" : "MAGNUSARCHIVES.Advancement.Guidance.FocusAbility")];
    H.includesGenreAbility && Ca.push(game.i18n.localize("MAGNUSARCHIVES.Advancement.Guidance.GenreAbility"));
    const Ea = typeof this.actor._source?.system?.notes == "string" ? this.actor._source.system.notes : "", Nr = Ea ? await foundry.applications.ux.TextEditor.implementation.enrichHTML(Ea, {
      async: !0,
      relativeTo: this.actor
    }) : "";
    return {
      ...t,
      actor: this.actor,
      system: this.actor.system,
      systemFields: oa(this.actor),
      editable: this.isEditable,
      enriched: { notes: Nr },
      familiarities: vr,
      powerShifts: Ge,
      characterOverrides: Er,
      woundOverride: Ir,
      recoveryOverride: Rr,
      genre: J,
      woundHindranceModifier: ve("hinder", I.derived.wounds.hindrance),
      header: li,
      skillItems: i,
      skillSort: {
        mode: this.#a,
        nameActive: this.#a === "name",
        rankActive: this.#a === "rank"
      },
      abilityItems: s,
      inventory: Ce,
      weaponItems: c,
      armorItems: p,
      shieldItems: y,
      multipleShieldsEquipped: m,
      focusTrees: g,
      missingFoci: A,
      advancement: {
        ...E,
        options: E.options.map((h) => ({
          ...h,
          label: `MAGNUSARCHIVES.Advancement.Option.${h.kind}`,
          shortLabel: `MAGNUSARCHIVES.Advancement.Short.${h.kind}`,
          xpCost: E.policy.xpCost
        })),
        other: {
          ...E.other,
          label: "MAGNUSARCHIVES.Advancement.OtherAdvancement",
          shortLabel: "MAGNUSARCHIVES.Advancement.Short.other",
          xpCost: E.policy.xpCost
        },
        purchases: f.advancement.purchases.map((h) => ({
          ...h,
          label: h.kind === "other" ? `MAGNUSARCHIVES.Advancement.Other.${h.otherKind}` : `MAGNUSARCHIVES.Advancement.Option.${h.kind}`
        })),
        guidance: {
          ...H,
          title: game.i18n.format("MAGNUSARCHIVES.Advancement.Guidance.Title", { tier: H.tier }),
          reminder: Ca.join(" · ")
        }
      },
      isGM: game.user.isGM,
      gmProgressionEdit: game.user.isGM && this.#n,
      typeItems: U,
      speciesItems: z,
      descriptorItems: K,
      primaryDescriptorItems: K.filter((h) => h.role === "primary"),
      additionalDescriptorItems: K.filter((h) => h.role === "additional" || h.role === "custom"),
      speciesDescriptorItems: K.filter((h) => h.role === "speciesGranted"),
      packageGrantedItems: V,
      coreCreation: this.actor.system.creation,
      activeArmorCategoryLabel: game.i18n.localize(
        `MAGNUSARCHIVES.Combat.Armor.Category.${o.system.derived.combat.armor.category}`
      ),
      recoveryAvailableLabels: this.actor.system.derived.recovery.availableTypes.map((h) => game.i18n.localize(`MAGNUSARCHIVES.Recovery.${h}`)).join(", "),
      phase: "0.1.0"
    };
  }
}
class we extends Error {
  constructor(e, t) {
    super(t), this.code = e, this.name = "FocusTreeEditorError";
  }
  code;
}
class Lu {
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
      throw new we("node-not-selected", "Select a Focus node before connecting.");
    return this.#t = this.#e, this.#t;
  }
  connectionTo(e) {
    if (!this.#t)
      throw new we("node-not-selected", "No source node is selected for the connection.");
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
function ju() {
  return globalThis.crypto?.randomUUID?.().replaceAll("-", "") ?? `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
}
function De(n) {
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
    throw new we("not-ability", "Only Ability Items can be added to a Focus Tree.");
  if (!n.uuid.trim())
    throw new we("ability-uuid-missing", "The Ability must have a resolvable UUID.");
}
function ws(n) {
  if (!Number.isInteger(n) || n < 1 || n > 6)
    throw new we("invalid-tier", "Focus node Tier must be an integer from 1 to 6.");
}
function vs(n, e) {
  return n.nodes.filter((t) => t.tier === e).sort((t, i) => {
    const a = t.position.x ?? Number.MAX_SAFE_INTEGER, s = i.position.x ?? Number.MAX_SAFE_INTEGER;
    return a - s || t.id.localeCompare(i.id);
  });
}
class Wu {
  #e;
  #t;
  #i;
  #n = !1;
  constructor(e, t = ju) {
    this.#e = t, this.#t = De(e), this.#i = De(e);
  }
  get graph() {
    return De(this.#i);
  }
  get dirty() {
    return this.#n;
  }
  diagnostics() {
    return Dn(this.#i);
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
    return this.#i = { ...this.#i, nodes: [...this.#i.nodes, s] }, this.#n = !0, De({ ...this.#i, nodes: [s] }).nodes[0];
  }
  setTier(e, t) {
    return ws(t), this.#l(e, (i) => ({ ...i, tier: t }));
  }
  moveNode(e, t) {
    const i = this.#a(e), a = vs(this.#i, i.tier), s = a.findIndex((y) => y.id === e), o = t === "left" ? s - 1 : s + 1;
    if (o < 0 || o >= a.length) return De({
      version: this.#i.version,
      nodes: [i],
      connections: []
    }).nodes[0];
    const r = a[o], l = a[t === "left" ? o - 1 : o + 1], u = r.position.x ?? o, c = l?.position.x, p = t === "left" ? c == null ? u - 1 : (c + u) / 2 : c == null ? u + 1 : (u + c) / 2;
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
      throw new we("self-connection", "A Focus node cannot connect to itself.");
    if (this.#i.connections.some((a) => a.from === e && a.to === t))
      throw new we(
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
      throw new we(
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
      throw new we(
        "ability-source-mismatch",
        "The refreshed Ability does not match the node source UUID."
      );
    return this.#l(e, (a) => ({
      ...a,
      abilitySnapshot: As(t)
    }));
  }
  cancel() {
    return this.#i = De(this.#t), this.#n = !1, this.graph;
  }
  async save(e) {
    const t = Dn(this.#i), i = t.filter((s) => s.severity === "error");
    if (i.length > 0) throw new Rt(i);
    const a = this.graph;
    return await e(a), this.#t = De(a), this.#i = De(a), this.#n = !1, { graph: a, diagnostics: t };
  }
  #a(e) {
    const t = this.#i.nodes.find((i) => i.id === e);
    if (!t)
      throw new we("node-not-found", `Focus node '${e}' was not found.`);
    return t;
  }
  #l(e, t) {
    const i = this.#a(e), a = t(i);
    return this.#i = {
      ...this.#i,
      nodes: this.#i.nodes.map((s) => s.id === e ? a : s)
    }, this.#n = !0, De({ version: this.#i.version, nodes: [a], connections: [] }).nodes[0];
  }
  #r(e, t) {
    for (let i = 0; i < 100; i += 1) {
      const a = this.#e().replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 24), s = `${e}-${a}`;
      if (a && !t.has(s)) return s;
    }
    throw new we(
      "unique-id-unavailable",
      `Unable to generate a unique ${e} ID.`
    );
  }
}
function _u(n) {
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
function Ku(n, e) {
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
class Xu extends Error {
  constructor(e) {
    super("Only one Shield may be equipped at a time."), this.shieldIds = e, this.name = "MultipleEquippedShieldsError";
  }
  shieldIds;
}
class ar extends Error {
  constructor(e, t, i) {
    super(`Shield ${e} capacity cannot be lower than its current Wound count (${i}).`), this.severity = e, this.requested = t, this.current = i, this.name = "ShieldCapacityBelowWoundsError";
  }
  severity;
  requested;
  current;
}
class sr {
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
    if (t.length > 1) throw new Xu(t.map((i) => i.id));
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
    return e.system.derived?.capacities ?? e.system.woundCapacities ?? tt;
  }
  async setCapacity(e, t, i) {
    if (!Number.isInteger(i) || i < 0)
      throw new RangeError("Shield Wound capacity must be a non-negative whole number.");
    const a = e.system.wounds[t].length;
    if (i < a) throw new ar(t, i, a);
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
async function Yu(n, e, t) {
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
async function Ju(n, e, t) {
  await foundry.applications.api.DialogV2.confirm({
    window: { title: game.i18n.localize("MAGNUSARCHIVES.Wounds.DeleteTitle") },
    content: `<div class="magnusarchives magnusarchives-dialog"><p>${game.i18n.localize("MAGNUSARCHIVES.Wounds.DeleteConfirm")}</p></div>`,
    rejectClose: !1,
    modal: !0,
    yes: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Delete") },
    no: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Cancel") }
  }) && await game.magnusarchives.services.shields.delete(n, e, t);
}
function Qu(n) {
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
function Zu(n) {
  return n.defaultPool !== "choose" || n.category !== "general" || n.contexts.length > 0 || n.initiative;
}
function em(n) {
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
function tm(n, e) {
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
function Ie(n) {
  return n.replace(/[&<>"']/g, (e) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[e]);
}
function ne(n) {
  ui.notifications.error(n instanceof Error ? n.message : String(n));
}
const im = foundry.applications.api.HandlebarsApplicationMixin(
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
class $ extends im {
  #e = new Lo();
  #t = new Lu();
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
    if (!fe.includes(t) || !i)
      throw new Error("Invalid Shield Wound action data.");
    return { severity: t, woundId: i };
  }
  static async #S(e, t) {
    if (e.preventDefault(), e.stopPropagation(), !this.isEditable || this.item.actor && !game.user.isGM && !this.item.actor.testUserPermission(
      game.user,
      CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER
    )) return;
    const i = qn(t.dataset);
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
    await Yu(this.item, i.severity, i.woundId);
  }
  static async #V(e, t) {
    const i = $.#m(t);
    await Ju(this.item, i.severity, i.woundId);
  }
  static async #D() {
    !this.isEditable || this.item.type !== "weapon" || (await game.magnusarchives.services.weapons.reload(this.item), await this.render({ force: !0 }));
  }
  static DEFAULT_OPTIONS = {
    ...sa,
    classes: ["magnusarchives", "sheet", "item", "item-sheet"],
    actions: ra({
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
    if (await super._onRender(e, t), la(this.element, this.isEditable, Es), this.#o?.abort(), this.#o = null, this.#c && (Ku(this.element, this.#c), this.#c = null), this.#A && (tm(this.element, this.#A), this.#A = null), this.#t.connectionSourceNodeId) {
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
      const a = t.value.trim().match(/^1(?:-(\d+))?$/), s = Number(a?.[1] ?? (a ? 1 : Number.NaN)), o = Jt(this.item.system.depletion);
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
        if (fe.includes(s))
          try {
            await game.magnusarchives.services.shields.setCapacity(
              this.item,
              s,
              Number(i.value)
            );
          } catch (o) {
            o instanceof ar ? ui.notifications.warn(game.i18n.format("MAGNUSARCHIVES.Shield.CapacityTooLow", {
              severity: game.i18n.localize(`MAGNUSARCHIVES.Wounds.Severity.${o.severity}`),
              count: o.current
            })) : ne(o), await this.render({ force: !0 });
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
          ne(o), await this.render({ force: !0 });
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
          const r = Jl(o, s, Number(i.value));
          await this.item.update({ "system.abilityCatalog": r });
        } catch (r) {
          ne(r), await this.render({ force: !0 });
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
        await this.item.update({ "system.weaponFamilies": oe(e.value) });
      } catch (a) {
        ne(a), await this.render({ force: !0 });
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
      return ne(a), null;
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
      content: `<div class="magnusarchives-dialog-fields"><label>${game.i18n.localize("MAGNUSARCHIVES.Packages.Source")}<select name="uuid">${s}${a.map((r) => `<option value="${Ie(r.uuid)}">${Ie(r.name)}</option>`).join("")}</select></label>${i === "skill" ? `<label>${game.i18n.localize("MAGNUSARCHIVES.Packages.CustomSkillName")}<input name="customName" type="text"></label><label>${game.i18n.localize("MAGNUSARCHIVES.Skill.Rank")}<select name="rank">${te.map((r) => `<option value="${r}" ${r === "trained" ? "selected" : ""}>${game.i18n.localize(`MAGNUSARCHIVES.Skill.Ranks.${r}`)}</option>`).join("")}</select></label><label>${game.i18n.localize("MAGNUSARCHIVES.Packages.SkillContextNote")}<textarea name="notes" rows="2"></textarea></label>` : ""}</div>`,
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
        <select name="uuid">${e.map((a) => `<option value="${Ie(a.uuid)}">${Ie(a.name)}</option>`).join("")}</select></label>
        <label>${game.i18n.localize("MAGNUSARCHIVES.Genre.MinimumTier")}<input name="minimumTier" type="number" min="${at}" max="${Kt}" value="${at}"></label></div>`,
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
      "system.abilityCatalog": Ql(s, i.id, this.#b(a))
    });
  }
  static async #_(e, t) {
    const i = t.dataset.entryId;
    if (!i || this.item.type !== "genre") return;
    const a = this.item.system.abilityCatalog;
    await this.item.update({ "system.abilityCatalog": Zl(a, i) });
  }
  static async #K(e, t) {
    if (this.item.type !== "characterType" && this.item.type !== "descriptor" && this.item.type !== "species") return;
    const i = t.dataset.choiceKind ?? "skill", a = this.item.type !== "descriptor" && i === "ability", s = this.item.type === "species" && i === "descriptor", o = await foundry.applications.api.DialogV2.input({
      window: { title: game.i18n.localize("MAGNUSARCHIVES.Packages.AddChoiceGroup") },
      content: `<div class="magnusarchives-dialog-fields"><label>${game.i18n.localize("MAGNUSARCHIVES.Packages.ChooseCount")}<input name="choose" type="number" min="1" value="1"></label>${s ? `<label>${game.i18n.localize("MAGNUSARCHIVES.Packages.ChoiceSource")}<select name="sourceMode"><option value="fixed">${game.i18n.localize("MAGNUSARCHIVES.Packages.FixedOptions")}</option><option value="catalog">${game.i18n.localize("MAGNUSARCHIVES.Packages.AllAvailableDescriptors")}</option></select></label>` : a ? "" : `<label>${game.i18n.localize("MAGNUSARCHIVES.Skill.Rank")}<select name="rank">${te.map((l) => `<option value="${l}" ${l === "trained" ? "selected" : ""}>${game.i18n.localize(`MAGNUSARCHIVES.Skill.Ranks.${l}`)}</option>`).join("")}</select></label>`}</div>`,
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
      }, c = r.descriptorChoiceGroups ?? [];
      await this.item.update({ "system.descriptorChoiceGroups": [...c, u] });
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
    const u = o ? "ability" : r ? "descriptor" : "skill", c = [...game.items].filter((m) => m.type === u).sort((m, f) => m.name.localeCompare(f.name)), p = await foundry.applications.api.DialogV2.input({
      window: { title: game.i18n.localize(o ? "MAGNUSARCHIVES.Species.AddAbilityOption" : r ? "MAGNUSARCHIVES.Species.AddDescriptorOption" : "MAGNUSARCHIVES.Packages.AddSkillOption") },
      content: `<div class="magnusarchives-dialog-fields"><label>${game.i18n.localize("MAGNUSARCHIVES.Packages.Source")}<select name="uuid">${o || r ? "" : `<option value="custom">${game.i18n.localize("MAGNUSARCHIVES.Packages.CustomSkill")}</option>`}${c.map((m) => `<option value="${Ie(m.uuid)}">${Ie(m.name)}</option>`).join("")}</select></label>${o || r ? "" : `<label>${game.i18n.localize("MAGNUSARCHIVES.Packages.CustomSkillName")}<input name="customName" type="text"></label><label>${game.i18n.localize("MAGNUSARCHIVES.Packages.SkillContextNote")}<textarea name="notes" rows="2"></textarea></label>`}</div>`,
      ok: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Add") }
    });
    if (!p) return;
    const y = p.uuid === "custom" ? null : await fromUuid(String(p.uuid ?? ""));
    if (o) {
      if (!y) return;
      const m = { id: crypto.randomUUID(), abilityUuid: y.uuid, snapshot: this.#b(y) }, f = a.abilityChoiceGroups;
      await this.item.update({ "system.abilityChoiceGroups": f.map((g) => g.id === i ? { ...g, options: [...g.options, m] } : g) });
    } else if (r) {
      if (!y) return;
      const m = { id: crypto.randomUUID(), descriptorUuid: y.uuid, snapshot: this.#b(y) }, f = a.descriptorChoiceGroups;
      await this.item.update({ "system.descriptorChoiceGroups": f.map((g) => g.id === i ? { ...g, options: [...g.options, m] } : g) });
    } else {
      const m = this.#C(y, String(p.customName ?? ""), String(p.notes ?? ""));
      if (!m) return;
      await this.item.update({ "system.choiceGroups": a.choiceGroups.map((f) => f.id === i ? { ...f, options: [...f.options, m] } : f) });
    }
  }
  static async #Z(e, t) {
    const i = this.#R(t);
    if (!i || !("skillUuid" in i)) return;
    const a = await foundry.applications.api.DialogV2.input({
      window: { title: game.i18n.localize("MAGNUSARCHIVES.Packages.EditSkillContextNote") },
      content: `<div class="magnusarchives-dialog-fields"><label>${game.i18n.localize("MAGNUSARCHIVES.Packages.SkillContextNote")}<textarea name="notes" rows="3">${Ie(String(i.notes ?? ""))}</textarea></label></div>`,
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
    await $i(this.item);
  }
  static async #ae(e, t) {
    const i = t.dataset.nodeId;
    if (!i) throw new Error("Missing Focus node ID.");
    await Bo(this.#U(), i);
  }
  static async #se() {
    try {
      this.#M(), this.#s = new Wu(
        this.item.system.graph
      ), this.#t.reset(), await this.#g();
    } catch (e) {
      ne(e);
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
            <select name="abilityUuid">${t.map((o) => `<option value="${Ie(o.uuid)}">${Ie(o.name)}</option>`).join("")}</select>
          </label>
          ${this.#G()}
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
      ne(e);
    }
  }
  static async #I() {
    try {
      const e = this.#y(), t = e.diagnostics().filter((i) => i.severity === "warning");
      t.length > 0 && ui.notifications.warn(t.map((i) => i.message).join(`
`)), await e.save((i) => this.item.update({ "system.graph": i })), this.#s = null, this.#t.reset(), ui.notifications.info(game.i18n.localize("MAGNUSARCHIVES.Focus.Editor.Saved")), await this.#g();
    } catch (e) {
      if (e instanceof Rt) {
        ui.notifications.error(e.diagnostics.map((t) => t.message).join(`
`));
        return;
      }
      ne(e);
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
      ne(i);
    }
  }
  static async #de(e, t) {
    try {
      this.#y().setTier(this.#v(t), Number(t.dataset.tier)), await this.#g();
    } catch (i) {
      ne(i);
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
      ne(i);
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
      ne(i);
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
      ne(e);
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
      ne(i);
    }
  }
  static async #ye(e, t) {
    try {
      const i = this.#v(t), a = this.#y().graph.nodes.find((o) => o.id === i);
      if (!a) throw new Error(`Focus node '${i}' was not found.`);
      if (!await foundry.applications.api.DialogV2.confirm({
        window: { title: game.i18n.localize("MAGNUSARCHIVES.Focus.Editor.DeleteNode") },
        content: `<div class="magnusarchives magnusarchives-dialog"><p>${game.i18n.format("MAGNUSARCHIVES.Focus.Editor.DeleteNodeConfirm", {
          name: Ie(a.abilitySnapshot.name || a.id)
        })}</p></div>`,
        rejectClose: !1,
        modal: !0,
        yes: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Delete") },
        no: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Cancel") }
      })) return;
      this.#y().deleteNode(i), this.#t.clearSelection(i), await this.#g();
    } catch (i) {
      ne(i);
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
  #U() {
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
      content: `<div class="magnusarchives-dialog-fields">${this.#G()}</div>`,
      rejectClose: !1,
      ok: { label: game.i18n.localize("MAGNUSARCHIVES.Focus.Editor.AddAbility") }
    });
    if (!i) return;
    const a = t.addAbility(e, Number(i.tier ?? 1));
    this.#t.select(a.id), await this.#g();
  }
  #G() {
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
    this.#c = _u(this.element), await this.render({ force: !0 });
  }
  async _prepareContext(e) {
    this.element?.isConnected && (this.#A = em(this.element));
    const t = await super._prepareContext(e), i = this.item.system, a = this.item.type === "skill", s = this.item.type === "ability", o = this.item.type === "weapon", r = this.item.type === "armor", l = this.item.type === "shield", u = this.item.type === "equipment", c = this.item.type === "cypher", p = this.item.type === "artifact", y = this.item.type === "focus", m = this.item.type === "genre", f = this.item.type === "characterType", g = this.item.type === "descriptor", A = this.item.type === "species", v = f && String(i.genre ?? "none") === "superhero", E = f ? i.instance : void 0, H = ["ability", "focus", "genre", "skill", "weapon", "armor", "shield", "equipment", "cypher", "artifact", "characterType", "descriptor", "species"].includes(this.item.type), R = typeof this.item._source?.system?.description == "string" ? this.item._source.system.description : "", U = H ? await foundry.applications.ux.TextEditor.implementation.enrichHTML(R, {
      async: !0,
      relativeTo: this.item
    }) : "", z = f ? await foundry.applications.ux.TextEditor.implementation.enrichHTML(String(this.item._source.system.backgroundOptions ?? ""), { async: !0, relativeTo: this.item }) : "", K = f ? await foundry.applications.ux.TextEditor.implementation.enrichHTML(String(this.item._source.system.equipmentNotes ?? ""), { async: !0, relativeTo: this.item }) : "", M = String(i.rank ?? "untrained"), V = String(i.defaultPool ?? "choose"), I = Array.isArray(i.contexts) ? i.contexts : [], ie = s ? Ke(this.item) : [], W = s ? Qu(i) : null, Ge = W ? {
      ...W,
      rollModifierLabel: game.i18n.localize(
        W.rollModifierLabel === "task" ? "MAGNUSARCHIVES.Ability.TaskModifier" : W.rollModifierLabel === "defense" ? "MAGNUSARCHIVES.Ability.DefenseModifier" : "MAGNUSARCHIVES.Ability.RollModifier"
      )
    } : null, q = s ? this.item.flags?.magnusarchives?.genreAbility : void 0, J = q ? {
      catalogLabel: game.i18n.localize(`MAGNUSARCHIVES.Genre.CatalogKind.${q.catalog ?? "progression"}`),
      genresLabel: (q.genres ?? []).map((S) => game.i18n.localize(`MAGNUSARCHIVES.Packages.Genre.${S}`)).join(" · "),
      progressionBandLabel: q.progressionBand === "origin" ? game.i18n.localize("MAGNUSARCHIVES.Genre.CatalogKind.origin") : game.i18n.localize(`MAGNUSARCHIVES.Genre.ProgressionBand.${q.progressionBand ?? "mid-tier"}`),
      minimumSuperheroRank: Number(q.minimumSuperheroRank ?? 0)
    } : null, ke = m ? i.abilityCatalog.map((S) => ({
      ...S,
      catalogLabel: game.i18n.localize(`MAGNUSARCHIVES.Genre.CatalogKind.${S.catalog ?? "progression"}`),
      progressionBandLabel: (S.catalog ?? "progression") === "progression" ? S.minimumTier === 3 ? game.i18n.localize("MAGNUSARCHIVES.Genre.ProgressionBand.mid-tier") : S.minimumTier === 6 ? game.i18n.localize("MAGNUSARCHIVES.Genre.ProgressionBand.high-tier") : "" : "",
      minimumSuperheroRank: Number(S.minimumSuperheroRank ?? 0)
    })) : [], ye = a && Zu({
      defaultPool: V,
      category: String(i.category ?? "general"),
      contexts: I,
      initiative: !!i.initiative
    }), Ce = i.grantedBy, re = !!(Ce?.sourceUuid || Ce?.instanceId || Ce?.grantId), Q = y ? this.#U() : null, Se = Q?.system.graph, me = Se?.nodes.find((S) => S.id === this.#t.selectedNodeId), N = new Map(Se?.nodes.map((S) => [
      S.id,
      S.abilitySnapshot.name || S.id
    ]) ?? []);
    return {
      ...t,
      item: this.item,
      system: this.item.system,
      systemFields: oa(this.item),
      enriched: { description: U, backgroundOptions: z, equipmentNotes: K },
      usesRichDescription: H,
      isSkill: a,
      isAbility: s,
      isWeapon: o,
      isArmor: r,
      isShield: l,
      isEquipment: u,
      isCypher: c,
      isArtifact: p,
      isFocus: y,
      isGenre: m,
      isCharacterType: f,
      typeCustomGenreSelected: f && String(i.genre ?? "none") === "custom",
      typeSuperheroSelected: v,
      typeSuperheroAttached: v && !!E?.instanceId,
      typeSuperheroicsPoolLabel: E?.selections?.superheroicsPool && E.selections.superheroicsPool !== "none" ? game.i18n.localize(`MAGNUSARCHIVES.Pools.${E.selections.superheroicsPool[0].toUpperCase()}${E.selections.superheroicsPool.slice(1)}`) : game.i18n.localize("MAGNUSARCHIVES.Common.None"),
      typeWeaponFamiliesValue: f ? oe(i.weaponFamilies).map(yt).join(", ") : "",
      speciesWeaponFamiliesValue: A ? oe(i.weaponFamilies).map(yt).join(", ") : "",
      weaponFamilySuggestions: ao.map((S) => ({ value: yt(S) })),
      isDescriptor: g,
      isSpecies: A,
      isCompactRuleItem: s || a || o || r || l || u || c || p || m || f || A,
      usesCleanItemHeader: s || a || o || r || l || u || c || p || y || m || g || f || A,
      hideNormalItemFooter: s || a || o || r || l || u || c || p || y || m || g || f || A,
      genreEffortCapOptions: m ? ["core", "unlimited"].map((S) => ({
        value: S,
        label: game.i18n.localize(`MAGNUSARCHIVES.Genre.EffortCap.${S}`),
        selected: i.options?.totalEffortCapMode === S
      })) : [],
      genreMinimumTierMin: at,
      genreMinimumTierMax: Kt,
      genreCatalogEntries: ke,
      abilityMechanics: Ge,
      abilityGenreReview: J,
      skillOptionalMechanics: ye,
      hasGrantProvenance: re,
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
      descriptorSkillGrants: g ? i.skillGrants.map((S) => ({
        ...S,
        rankLabel: game.i18n.localize(`MAGNUSARCHIVES.Skill.Ranks.${S.rank}`)
      })) : [],
      descriptorPoolBonusChoiceGroups: g ? (i.poolBonusChoiceGroups ?? []).map((S) => ({
        ...S,
        poolsLabel: S.pools.map((Y) => game.i18n.localize(
          `MAGNUSARCHIVES.Pools.${Y[0].toUpperCase()}${Y.slice(1)}`
        )).join(" · ")
      })) : [],
      descriptorChoiceGroups: g ? i.choiceGroups.map((S) => ({
        ...S,
        rankLabel: game.i18n.localize(`MAGNUSARCHIVES.Skill.Ranks.${S.rank}`)
      })) : [],
      typeSkillGrants: f ? i.skillGrants.map((S) => ({
        ...S,
        rankLabel: game.i18n.localize(`MAGNUSARCHIVES.Skill.Ranks.${S.rank}`)
      })) : [],
      typeSkillChoiceGroups: f ? i.choiceGroups.map((S) => ({
        ...S,
        rankLabel: game.i18n.localize(`MAGNUSARCHIVES.Skill.Ranks.${S.rank}`)
      })) : [],
      typeAbilityChoiceGroups: f ? i.abilityChoiceGroups : [],
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
        selectedNode: me ? {
          ...me,
          canMoveLeft: !0,
          canMoveRight: !0
        } : null,
        connections: Se?.connections.map((S) => ({
          ...S,
          fromName: N.get(S.from) ?? S.from,
          toName: N.get(S.to) ?? S.to
        })) ?? []
      } : null,
      focusTrees: y ? [await game.magnusarchives.services.focusTrees.prepare(Q, this.#s ? {
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
        selected: ie.includes(S)
      })) : [],
      abilityRollOptions: s ? Ws.map((S) => ({
        value: S,
        label: game.i18n.localize(`MAGNUSARCHIVES.Ability.Roll.${S}`),
        selected: i.roll === S
      })) : [],
      priceCategoryOptions: u ? Mn.map((S) => ({
        value: S,
        label: game.i18n.localize(`MAGNUSARCHIVES.Price.${S}`),
        selected: i.price === S
      })) : [],
      abilityDamageEffectOptions: s ? zi.map((S) => ({
        value: S,
        label: game.i18n.localize(`MAGNUSARCHIVES.CharacterDamage.${S}`),
        selected: i.damageEffect === S
      })) : [],
      abilityTargetOptions: s ? _s.map((S) => ({
        value: S,
        label: game.i18n.localize(`MAGNUSARCHIVES.Ability.TargetMode.${S}`),
        selected: i.targetMode === S
      })) : [],
      cypherManifestationOptions: c ? Wn.map((S) => ({
        value: S,
        label: game.i18n.localize(`MAGNUSARCHIVES.Cypher.Manifestation.${S}`),
        selected: i.manifestation === S
      })) : [],
      cypherPowerOptions: c ? _n.map((S) => ({
        value: S,
        label: game.i18n.localize(`MAGNUSARCHIVES.Cypher.Power.${S}`),
        selected: i.power === S
      })) : [],
      cypherEffectiveLevel: c ? Aa(i) : 0,
      artifactLevelRollable: p ? Vi(i) : !1,
      skillRankOptions: a ? te.map((S) => ({
        value: S,
        label: game.i18n.localize(`MAGNUSARCHIVES.Skill.Ranks.${S}`),
        selected: S === M
      })) : [],
      skillPoolOptions: a ? [
        { value: "choose", label: game.i18n.localize("MAGNUSARCHIVES.Skill.ChoosePool"), selected: V === "choose" },
        ...k.map((S) => ({
          value: S,
          label: game.i18n.localize(`MAGNUSARCHIVES.Pools.${S[0].toUpperCase()}${S.slice(1)}`),
          selected: S === V
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
      weaponCategoryOptions: o ? Oe.map((S) => ({
        value: S,
        label: game.i18n.localize(`MAGNUSARCHIVES.Combat.Weapon.Category.${S}`),
        selected: i.category === S
      })) : [],
      weaponFamilyDisplay: o ? yt(i.family) : "",
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
      rangeOptions: o ? Nn.map((S) => ({
        value: S,
        label: game.i18n.localize(`MAGNUSARCHIVES.Combat.Range.${S}`),
        selected: i.rangeCategory === S
      })) : [],
      weaponAttackModifierOptions: o ? [-2, -1, 0, 1, 2].map((S) => ({
        value: S,
        label: S > 0 ? `+${S}` : String(S),
        selected: i.attackModifier === S
      })) : [],
      weaponSkillLevelOptions: o ? te.map((S) => ({
        value: S,
        label: game.i18n.localize(`MAGNUSARCHIVES.Skill.Ranks.${S}`),
        selected: i.skillLevel === S
      })) : [],
      combatResourcesExpanded: (o || r || l) && this.#d.has("combat-resources"),
      advancedExpanded: this.#d.has("advanced"),
      shieldWoundsExpanded: l && this.#d.has("shield-wounds"),
      combatDepletionSides: o || r || l ? Jt(i.depletion ?? { die: "d6" }) : 0,
      combatDepletionThreshold: o || r || l ? Oo(Number(i.depletion?.threshold ?? 1)) : "",
      depletionDieOptions: o || p ? kr.map((S) => ({
        value: S,
        label: `1 in 1${S}`,
        selected: i.depletion?.die === S
      })) : [],
      armorCategoryOptions: r ? Be.map((S) => ({
        value: S,
        label: game.i18n.localize(`MAGNUSARCHIVES.Combat.Armor.Category.${S}`),
        selected: i.category === S
      })) : [],
      shieldWoundTracks: l ? Ri({
        minor: i.wounds.minor.length,
        moderate: i.wounds.moderate.length,
        major: i.wounds.major.length
      }, i.derived.capacities).map((S) => ({
        ...S,
        label: game.i18n.localize(`MAGNUSARCHIVES.Wounds.Severity.${S.severity}`),
        pips: S.pips.map((Y) => ({
          ...Y,
          tooltip: game.i18n.format("MAGNUSARCHIVES.Hud.SetWoundCount", {
            severity: game.i18n.localize(`MAGNUSARCHIVES.Wounds.Severity.${S.severity}`),
            count: Y.targetCount
          })
        }))
      })) : []
    };
  }
}
function Ze(n, e) {
  return String(n[e] ?? "");
}
function vi(n) {
  return n.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
async function or(n) {
  const e = await foundry.applications.api.DialogV2.input({
    window: { title: game.i18n.localize(n ? "MAGNUSARCHIVES.Combat.Modification.Edit" : "MAGNUSARCHIVES.Combat.Modification.Create") },
    content: `<div class="magnusarchives-dialog-fields">
      <label>${game.i18n.localize("MAGNUSARCHIVES.Common.Name")} <input name="label" type="text" value="${vi(n?.label ?? "")}"></label>
      <label>${game.i18n.localize("MAGNUSARCHIVES.Combat.Modification.Contexts")} <input name="contexts" type="text" value="${vi(n?.contexts.join(", ") ?? "defense.speed")}"></label>
      <label>${game.i18n.localize("MAGNUSARCHIVES.Combat.Modification.ModeLabel")}
        <select name="mode">
          ${["levelOverride", "levelDelta", "ease", "hinder"].map((a) => `<option value="${a}"${n?.mode === a ? " selected" : ""}>${game.i18n.localize(`MAGNUSARCHIVES.Combat.Modification.Mode.${a}`)}</option>`).join("")}
        </select>
      </label>
      <label>${game.i18n.localize("MAGNUSARCHIVES.Combat.Modification.Value")} <input name="value" type="number" step="1" value="${n?.value ?? 0}"></label>
      <label>${game.i18n.localize("MAGNUSARCHIVES.Combat.Modification.Predicate")} <textarea name="predicate">${vi(JSON.stringify(n?.predicate ?? {}))}</textarea></label>
      <label>${game.i18n.localize("MAGNUSARCHIVES.Combat.Modification.Visibility")}
        <select name="visibility"><option value="gm">${game.i18n.localize("MAGNUSARCHIVES.Combat.Modification.Gm")}</option><option value="public"${n?.visibility === "public" ? " selected" : ""}>${game.i18n.localize("MAGNUSARCHIVES.Combat.Modification.Public")}</option></select>
      </label>
      <label>${game.i18n.localize("MAGNUSARCHIVES.Common.Description")} <textarea name="description">${vi(n?.description ?? "")}</textarea></label>
    </div>`,
    rejectClose: !1,
    ok: { label: game.i18n.localize("MAGNUSARCHIVES.Actions.Save") }
  });
  if (!e) return null;
  const t = JSON.parse(Ze(e, "predicate") || "{}");
  if (!t || typeof t != "object" || Array.isArray(t))
    throw new Error("NPC modification predicate must be a JSON object.");
  const i = Ze(e, "mode");
  return {
    id: n?.id ?? je(),
    label: Ze(e, "label"),
    contexts: Ze(e, "contexts").split(",").map((a) => a.trim()).filter(Boolean),
    mode: i,
    value: Number(Ze(e, "value")),
    visibility: Ze(e, "visibility") === "public" ? "public" : "gm",
    predicate: t,
    description: Ze(e, "description")
  };
}
async function nm(n) {
  try {
    const e = await or();
    if (!e) return;
    await n.update({ "system.modifications": [...n.system.modifications, e] });
  } catch (e) {
    ui.notifications.error(e instanceof Error ? e.message : String(e));
  }
}
async function am(n, e) {
  try {
    const t = n.system.modifications.find((a) => a.id === e);
    if (!t) throw new Error(`NPC modification '${e}' was not found.`);
    const i = await or(t);
    if (!i) return;
    await n.update({
      "system.modifications": n.system.modifications.map((a) => a.id === e ? i : a)
    });
  } catch (t) {
    ui.notifications.error(t instanceof Error ? t.message : String(t));
  }
}
async function sm(n, e) {
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
function om(n) {
  const e = typeof n == "number" ? n : typeof n == "string" && n.trim() !== "" ? Number(n) : Number.NaN;
  return Number.isInteger(e) && e >= 0 ? e * 3 : null;
}
function rm(n, e) {
  const t = er(n, e), i = t.ratio > 0.5 ? "healthy" : t.ratio > 0.25 ? "intermediate" : "low";
  return { ...t, state: i };
}
const lm = foundry.applications.api.HandlebarsApplicationMixin(
  foundry.applications.sheets.ActorSheetV2
), Is = /* @__PURE__ */ new Set([
  "requestDefense",
  "createModification",
  "editModification",
  "deleteModification"
]);
class At extends lm {
  static DEFAULT_OPTIONS = {
    ...sa,
    classes: ["magnusarchives", "sheet", "actor", "npc-sheet"],
    actions: ra({
      requestDefense: At.#e,
      createModification: At.#t,
      editModification: At.#i,
      deleteModification: At.#n
    }, Is),
    position: { width: 680, height: 700 },
    window: { resizable: !0 }
  };
  static PARTS = {
    main: { template: "systems/magnusarchives/templates/actor/npc-sheet.hbs" }
  };
  static async #e() {
    await ad(this.actor);
  }
  static async #t() {
    await nm(this.actor);
  }
  static async #i(e, t) {
    const i = t.dataset.modificationId;
    if (!i) throw new Error("Missing NPC modification ID.");
    await am(this.actor, i);
  }
  static async #n(e, t) {
    const i = t.dataset.modificationId;
    if (!i) throw new Error("Missing NPC modification ID.");
    await sm(this.actor, i);
  }
  async _onRender(e, t) {
    await super._onRender(e, t), la(this.element, this.isEditable, Is);
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
      systemFields: oa(this.actor),
      editable: this.isEditable,
      isGM: game.user.isGM,
      enriched: { notes: o },
      targetNumber: om(i.level) ?? "—",
      healthGauge: rm(
        i.health.value,
        i.health.max ?? i.health.baseMax
      ),
      damageEffectOptions: zi.map((r) => ({
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
function cm() {
  const { DocumentSheetConfig: n } = foundry.applications.apps;
  n.registerSheet(foundry.documents.Actor, G, C, {
    types: ["character"],
    makeDefault: !0,
    label: "MAGNUSARCHIVES.Sheets.Character"
  }), n.registerSheet(foundry.documents.Actor, G, At, {
    types: ["npc"],
    makeDefault: !0,
    label: "MAGNUSARCHIVES.Sheets.Npc"
  }), n.registerSheet(foundry.documents.Item, G, $, {
    makeDefault: !0,
    label: "MAGNUSARCHIVES.Sheets.Item"
  });
}
function ee(n, e, t = 0) {
  if (!Number.isInteger(n) || n < t)
    throw new Error(`${e} must be an integer of at least ${t}.`);
  return n;
}
function rr(n, e, t) {
  return Math.min(t, Math.max(e, n));
}
function dm(n, e = 0) {
  const t = ee(n, "Paid Effort");
  if (t === 0) return 0;
  const i = Math.max(0, Math.trunc(e));
  return 3 + (t - 1) * 2 + t * i;
}
function On(n, e, t, i = !1) {
  const a = ee(n, "Action cost"), s = ee(e, "Effort cost"), o = a + s, r = s + (i ? 0 : a), l = Math.min(r, Math.max(0, Math.trunc(t)));
  return {
    actionCostBeforeEdge: a,
    effortCostBeforeEdge: s,
    totalCostBeforeEdge: o,
    edgeApplied: l,
    poolCost: Math.max(0, o - l)
  };
}
function lr(n) {
  if (ee(n, "Natural d20 result", 1), n > 20) throw new Error("Natural d20 result cannot exceed 20.");
  return [1, 17, 18, 19, 20].includes(n) ? [`natural-${n}`] : [];
}
function um(n) {
  return lr(n), Math.floor(n / 3);
}
function yn(n, e, t, i, a) {
  return { id: n, label: e, direction: t, steps: i, source: a };
}
function mm(n) {
  const e = ee(n.limits.difficultyCeiling, "Difficulty ceiling"), t = ee(n.limits.assetLimit, "Asset limit"), i = ee(n.limits.paidEffortMaximum, "Maximum Effort"), a = ee(n.assets, "Assets"), s = ee(n.paidEffort, "Paid Effort"), o = ee(n.damageEffort ?? 0, "Damage Effort"), r = ee(n.freeDamageEffort ?? 0, "Free Damage Effort"), l = ee(n.freeEffort, "Free Effort"), u = n.limits.totalEffortMaximum === null ? null : ee(n.limits.totalEffortMaximum, "Maximum total Effort");
  if (ee(n.poolValue, "Pool value"), a > t) throw new Error(`Assets cannot exceed the current limit of ${t}.`);
  const c = o + r, p = s + c + l, y = s + o, m = l + r;
  if (u !== null && p > u)
    throw new Error(`Maximum total Effort: ${u}.`);
  if (y > i)
    throw new Error(`Paid Effort cannot exceed the Character maximum of ${i}.`);
  const f = [];
  a > 0 && f.push(yn(
    "core.assets",
    "MAGNUSARCHIVES.Roll.Breakdown.Assets",
    "ease",
    a,
    "asset"
  )), s > 0 && f.push(yn(
    "core.effort.paid",
    "MAGNUSARCHIVES.Roll.Breakdown.PaidEffort",
    "ease",
    s,
    "effort"
  )), l > 0 && f.push(yn(
    "core.effort.free",
    "MAGNUSARCHIVES.Roll.Breakdown.FreeEffort",
    "ease",
    l,
    "free-effort"
  ));
  for (const U of n.contributions)
    ee(U.steps, `Steps for '${U.id}'`), U.steps > 0 && f.push({ ...U });
  const g = f.filter((U) => U.direction === "ease").reduce((U, z) => U + z.steps, 0), A = f.filter((U) => U.direction === "hinder").reduce((U, z) => U + z.steps, 0), v = g - A, E = On(
    n.actionCost ?? 0,
    dm(y, n.effortSurcharge ?? 0),
    n.edge,
    n.actionCostIgnoresEdge ?? !1
  );
  let H = null, R = null;
  if (n.difficulty.mode !== "unknown") {
    const U = ee(n.difficulty.value, "Difficulty");
    if (U > e)
      throw new Error(`Difficulty cannot exceed the current ceiling of ${e}.`);
    H = rr(U - v, 0, e), R = H * 3;
  }
  return {
    context: n,
    breakdown: f,
    totalEase: g,
    totalHindrance: A,
    netSteps: v,
    damageEffortApplied: c,
    totalEffortApplied: p,
    paidEffortApplied: y,
    freeEffortApplied: m,
    totalEffortMaximum: u,
    ...E,
    finalDifficulty: H,
    targetNumber: R
  };
}
function pm(n, e) {
  if (n.finalDifficulty === 0) return cr(n);
  const t = lr(e), i = n.targetNumber === null ? null : e >= n.targetNumber, a = um(e), s = rr(
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
function cr(n) {
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
function Sn(n) {
  return n === null ? "unresolved" : n ? "applied" : "inapplicable";
}
function fm(n, e = 1) {
  const t = n.naturalRoll;
  if (t === null) return [];
  const i = { sourceId: "magnusarchives.core", naturalRoll: t }, a = kt(e);
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
      status: o ? Sn(n.success) : "inapplicable",
      label: `MAGNUSARCHIVES.Roll.NaturalEffects.Damage${t}`,
      damageBonus: t === 17 ? 1 : 2
    }];
  }
  if (t === 19) {
    const o = Sn(n.success);
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
    const o = Sn(n.success), r = n.prepared.context.purpose === "damage" ? [{
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
const et = {
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
function gm(n) {
  n.register(et), n.registerDifficultyPolicy(et.id, (e) => ({
    ...e,
    assetLimit: 2
  })), n.registerSkillRankRule(et.id, Sm), n.registerNaturalResultRule(et.id, (e, t) => [
    ...t,
    ...fm(e, e.prepared.context.horrorIntrusionRange)
  ]), n.registerGMIntrusionPolicy(et.id, (e) => ({
    ...e,
    targetedXpToTarget: 1,
    targetedXpToShare: 1,
    groupXpPerTarget: 1,
    freeXp: 0
  })), n.registerCombatPolicy(et.id, () => hm), n.registerAdvancementPolicy(et.id, () => no);
}
const hm = Object.freeze({
  weaponDamage: Object.freeze({ light: 2, medium: 4, heavy: 6 }),
  lightWeaponEase: 1,
  unfamiliarWeaponHindrance: 1,
  armorDefenseSteps: Object.freeze({ light: 1, medium: 2, heavy: 3 }),
  blockSeverityReduction: 1,
  damageEffortBonus: 3
}), ym = Object.freeze({
  inability: -1,
  untrained: 0,
  trained: 1,
  specialized: 2,
  expert: 3
});
function Sm(n, e) {
  const t = ym[n];
  return t === 0 ? null : {
    id: `core.skill.${e.id}.rank`,
    label: `MAGNUSARCHIVES.Skill.Ranks.${n}`,
    direction: t > 0 ? "ease" : "hinder",
    steps: Math.abs(t),
    source: "skill",
    sourceId: e.id
  };
}
class Am {
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
async function bm() {
  const n = await new Roll("1d6").evaluate();
  return Number(n.total);
}
function Ci(n, e, t, i) {
  if (!Number.isInteger(n) || n < e || n > t)
    throw new Error(`${i} must be an integer from ${e} to ${t}.`);
  return n;
}
class wm {
  #e;
  #t;
  #i;
  constructor(e = bm, t = je, i = Date.now) {
    this.#e = e, this.#t = t, this.#i = i;
  }
  calculateRoll(e, t, i, a = !1, s = 0, o = "") {
    Ci(i, 1, 6, "Recovery die"), Ci(t, 1, Number.MAX_SAFE_INTEGER, "Tier"), Ci(s, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, "Recovery bonus");
    const r = s + (e === "one-action" && a ? 2 : 0);
    return { slotId: o, type: e, dieResult: i, tier: t, bonus: r, total: Math.max(0, i + t + r), lastAction: a };
  }
  availableTypes(e) {
    return Qs(e);
  }
  isAvailable(e, t) {
    return !e[Zt[t]];
  }
  slots(e) {
    return e.system.recovery.slots?.length ? e.system.recovery.slots.map((t) => ({ ...t })) : ot(e.system.recovery.used);
  }
  availableSlots(e) {
    return Ot(this.slots(e));
  }
  async roll(e, t, i = !1, a) {
    Pe(e);
    const s = this.availableSlots(e).find((o) => o.type === t && (!a || o.id === a));
    if (!s)
      throw new Error(`The '${t}' Core Recovery has already been used today.`);
    return this.calculateRoll(
      t,
      B(e.system),
      await this.#e(),
      i,
      e.system.derived.recovery.bonus,
      s.id
    );
  }
  distribute(e, t, i) {
    const a = k.reduce((r, l) => r + Ci(i[l], 0, Number.MAX_SAFE_INTEGER, `${l} allocation`), 0);
    if (a > t.total) throw new Error("Recovery allocations exceed the Recovery result.");
    const s = {}, o = {};
    for (const r of k) {
      const l = e.system.stats[r].value, u = e.system.derived.pools[r].max, c = Math.max(0, u - l);
      if (i[r] > c)
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
    Pe(e);
    const a = this.slots(e), s = t.slotId || Ot(a).find((c) => c.type === t.type)?.id || "", o = Na(a, s, t.type), r = this.distribute(e, t, i), l = Et(o), u = {
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
    Pe(e);
    const a = this.slots(e), s = Ot(a).find((c) => c.type === t && (!i || c.id === i));
    if (!s)
      throw new Error(`The '${t}' Core Recovery has already been used today.`);
    const o = Na(a, s.id, t), r = Et(o), l = { might: 0, speed: 0, intellect: 0 }, u = {
      id: this.#t(),
      slotId: s.id,
      kind: "nonRest",
      type: t,
      rolled: !1,
      dieResult: 0,
      tier: B(e.system),
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
const vm = {
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
function Cm(n) {
  return n === "one-action" ? null : n;
}
function Rs(n, e) {
  const t = [n === "normal" ? "recovery" : "non-rest-recovery"];
  return e !== "one-action" && t.push("10-minute-or-longer"), (e === "1-hour" || e === "10-hours") && t.push("1-hour-or-longer"), e === "10-hours" && t.push("10-hour"), t;
}
class Em {
  #e;
  #t;
  #i;
  constructor(e, t, i = vm) {
    this.#e = e, this.#t = t, this.#i = i;
  }
  async rollNormal(e, t, i = !1, a) {
    return this.#e.roll(e, t, i, a);
  }
  async completeNormal(e, t, i, a = {}) {
    Pe(e);
    const s = Cm(t.type), o = s ? this.#t.prepare(e, s, a) : null, r = this.#e.prepareNormal(e, t, i), l = {
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
    Pe(e);
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
class Im {
  #e;
  #t;
  constructor(e = je, t = Date.now) {
    this.#e = e, this.#t = t;
  }
  /** Points of Stress a rest of this type removes (p12). */
  stressRelief(e) {
    return Ns[e] * 3;
  }
  rest(e, t, i = {}, a = 0) {
    const s = gt(e), o = [];
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
    Pe(e);
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
function ft(n, e) {
  if (!Number.isInteger(n) || n < 0)
    throw new Error(`${e} must be a non-negative integer.`);
  return n;
}
class dr {
  /** Adds Stress points. Returns the new total and any Stress Levels crossed. */
  async applyStress(e, t) {
    return L(e), ft(t, "Stress"), this.#t(e, e.system.stress.value + t);
  }
  /** Removes Stress points, never dropping below zero. */
  async relieveStress(e, t) {
    return L(e), ft(t, "Stress"), this.#t(e, e.system.stress.value - t);
  }
  /** Rest removes 3 points of Stress — one level — for each hour (p12). */
  async restStress(e, t) {
    return L(e), ft(t, "Hours of rest"), this.#t(e, Xs(e.system.stress.value, t));
  }
  async setStress(e, t) {
    return L(e), ft(t, "Stress"), this.#t(e, t);
  }
  /** A serious injury moves the Character down the damage track. */
  async applySeriousInjury(e, t = 1) {
    L(e), ft(t, "Damage track steps");
    const { step: i, hurtAvailable: a } = this.#e(e);
    return this.#i(e, i, Fr(i, a, t));
  }
  /** Recovery moves the Character back up the damage track. */
  async healDamageTrack(e, t = 1) {
    L(e), ft(t, "Damage track steps");
    const { step: i, hurtAvailable: a } = this.#e(e);
    return this.#i(e, i, Tr(i, a, t));
  }
  async setDamageTrackStep(e, t) {
    L(e);
    const { step: i, hurtAvailable: a } = this.#e(e);
    return this.#i(e, i, vt(t, a));
  }
  #e(e) {
    const t = e.system.derived.damageTrack.hurtAvailable;
    return {
      step: vt(e.system.damageTrack.step, t),
      hurtAvailable: t
    };
  }
  async #t(e, t) {
    const i = e.system.stress.value, a = Math.max(0, t);
    a !== i && await e.update({ "system.stress.value": a });
    const s = Ui(i), o = Ui(a);
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
function Pt(n, e) {
  if (!Number.isInteger(n) || n < 0)
    throw new Error(`${e} must be a non-negative integer.`);
  return n;
}
function Rm(n) {
  return Pt(n, "Pool damage overflow"), n === 0 ? null : n <= 4 ? "minor" : n <= 8 ? "moderate" : "major";
}
class Nm {
  #e;
  constructor(e = je) {
    this.#e = e;
  }
  applyWound(e, t, i = Ms, a = {}) {
    const s = gt(e), o = {
      id: a.id ?? this.#e(),
      label: a.label ?? `${t[0]?.toUpperCase()}${t.slice(1)} Wound`,
      description: a.description ?? "",
      sourceUuid: a.sourceUuid ?? "magnusarchives.core",
      treated: a.treated ?? !1
    }, r = fe.indexOf(t);
    if (r < 0) throw new Error(`Unsupported Wound severity '${t}'.`);
    for (let l = r; l < fe.length; l += 1) {
      const u = fe[l];
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
      overflowSteps: fe.length - r,
      record: null,
      applied: !1,
      dead: s.major.length >= i.major
    };
  }
  removeOne(e, t, i) {
    const a = gt(e), s = i ? a[t].findIndex((r) => r.id === i) : a[t].length - 1;
    if (s < 0) return { wounds: a, removed: null };
    const [o] = a[t].splice(s, 1);
    return { wounds: a, removed: o ?? null };
  }
  updateWound(e, t, i, a) {
    if (typeof a.label != "string" || typeof a.description != "string")
      throw new Error("Wound label and description must be strings.");
    const s = gt(e), o = s[t].findIndex((u) => u.id === i);
    if (o < 0) throw new Error(`Wound '${i}' was not found in ${t} Wounds.`);
    const l = { ...s[t][o], label: a.label, description: a.description };
    return s[t][o] = l, { wounds: s, updated: l };
  }
  removeAll(e, t) {
    const i = gt(e), a = i[t];
    return i[t] = [], { wounds: i, removed: a };
  }
  setWoundCount(e, t, i, a, s = {}) {
    const o = Pt(i, "Wound count"), r = Pt(a, "Wound capacity");
    if (o > r) throw new Error("Wound count cannot exceed its capacity.");
    const l = gt(e), u = l[t], c = u.length, p = o < c ? u.splice(o) : [], y = [];
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
    return { wounds: l, severity: t, previousCount: c, count: o, added: y, removed: p };
  }
  applyPoolDamage(e, t, i, a, s = Ms, o = {}) {
    const r = Pt(i, "Pool value"), l = Pt(a, "Pool damage"), u = Math.min(r, l), c = r - u, p = l - u, y = Rm(p), m = y ? this.applyWound(e, y, s, {
      ...o,
      label: o.label ?? `${t} Pool overflow`
    }) : null;
    return {
      pool: t,
      damage: l,
      previousValue: r,
      value: c,
      absorbed: u,
      overflow: p,
      overflowSeverity: y,
      wound: m
    };
  }
  async apply(e, t, i = {}) {
    return L(e), this.applyTrack(e, t, e.system.derived.wounds.capacities, i);
  }
  async applyTrack(e, t, i, a = {}) {
    const s = this.applyWound(e.system.wounds, t, i, a);
    return s.applied && await e.update({ "system.wounds": s.wounds }), s;
  }
  async edit(e, t, i, a) {
    return L(e), this.editTrack(e, t, i, a);
  }
  async editTrack(e, t, i, a) {
    const s = this.updateWound(e.system.wounds, t, i, a);
    return await e.update({ "system.wounds": s.wounds }), s;
  }
  async setCount(e, t, i, a = {}) {
    return L(e), this.setTrackCount(
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
    return L(e), this.deleteTrack(e, t, i);
  }
  async deleteTrack(e, t, i) {
    const a = this.removeOne(e.system.wounds, t, i);
    if (!a.removed) throw new Error(`Wound '${i}' was not found in ${t} Wounds.`);
    return await e.update({ "system.wounds": a.wounds }), { wounds: a.wounds, removed: a.removed };
  }
  async damagePool(e, t, i, a = {}) {
    L(e);
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
function Mm(n, e) {
  return n.naturalEffects.filter((t) => t.status !== "inapplicable").map((t) => ({
    kind: t.kind,
    label: e(t.label),
    status: e(`MAGNUSARCHIVES.Roll.NaturalEffects.Status.${t.status}`),
    isIntrusion: t.kind === "gm-intrusion",
    ...t.damageBonus === void 0 ? {} : { damageBonus: t.damageBonus }
  }));
}
function Um(n, e) {
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
function Us(n, e, t) {
  return `${ve(e, n)} ${t(e === "ease" ? n === 1 ? "MAGNUSARCHIVES.Roll.EaseStep" : "MAGNUSARCHIVES.Roll.EaseSteps" : n === 1 ? "MAGNUSARCHIVES.Roll.HindranceStep" : "MAGNUSARCHIVES.Roll.HindranceSteps")}`;
}
function Gm(n, e) {
  return n.breakdown.map((t) => ({
    label: e(t.label),
    value: ve(t.direction, t.steps)
  }));
}
function km(n, e) {
  return n.breakdown.length === 0 && n.totalEase === 0 && n.totalHindrance === 0 ? [] : [{
    label: e("MAGNUSARCHIVES.Roll.TotalEase"),
    value: n.totalEase === 0 ? 0 : ve("ease", n.totalEase)
  }, {
    label: e("MAGNUSARCHIVES.Roll.TotalHindrance"),
    value: n.totalHindrance === 0 ? 0 : ve("hinder", n.totalHindrance)
  }];
}
function Hm(n, e) {
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
function $m(n, e) {
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
function Vm(n, e) {
  const t = n.naturalEffects.find((i) => i.kind === "gm-intrusion" && i.status === "applied" && i.intrusionProvenance === "horror-mode" && i.horrorIntrusionRange !== void 0);
  return t?.horrorIntrusionRange === void 0 ? [] : [{
    label: e("MAGNUSARCHIVES.Horror.Title"),
    value: `1–${t.horrorIntrusionRange}`
  }];
}
function ur(n, e) {
  const t = n.prepared, i = t.context.pool ? `${t.context.pool[0].toUpperCase()}${t.context.pool.slice(1)}` : null, a = Mm(n, e), s = a.filter((r) => !r.isIntrusion), o = [
    ...t.totalEase > 0 ? [Us(t.totalEase, "ease", e)] : [],
    ...t.totalHindrance > 0 ? [Us(t.totalHindrance, "hinder", e)] : []
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
      modifier: ve(r.direction, r.steps)
    })),
    modifierDetails: Gm(t, e),
    modifierTotalDetails: km(t, e),
    effortDetails: Hm(n, e),
    costDetails: $m(n, e),
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
    specialRoll: Um(n, e),
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
function Dm(n, e) {
  return n ? { outcome: e("MAGNUSARCHIVES.Roll.Success"), outcomeIcon: "✓", outcomeClass: "success" } : { outcome: e("MAGNUSARCHIVES.Roll.Failure"), outcomeIcon: "✕", outcomeClass: "failure" };
}
function Bn(n, e, t = !0) {
  return n.automaticSuccess && t ? { outcome: e("MAGNUSARCHIVES.Roll.AutomaticSuccess"), outcomeIcon: "✓", outcomeClass: "success" } : Dm(n.success === !0, e);
}
function Fm(n, e, t = (i) => i) {
  const i = ur(n, t), a = n.beatsDifficulty === null ? {} : {
    beatsDifficulty: n.beatsDifficulty,
    showBeatsDifficulty: !0
  }, s = Vm(n, t), o = n.prepared.context.difficulty;
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
      ...Bn(n, t),
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
    ...Bn(n, t, !1),
    resolutionDetails: s,
    hasDetails: s.length > 0 || i.modifierDetails.length > 0 || i.modifierTotalDetails.length > 0 || i.effortDetails.length > 0 || i.costDetails.length > 0
  };
}
function Tm(n, e = (t) => t) {
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
function zm(n, e = (t) => t) {
  const t = n.prepared.context.difficulty;
  if (t.mode !== "hidden") throw new Error("Only hidden-difficulty rolls require an audit card.");
  return {
    ...ur(n, e),
    originalDifficulty: t.value,
    finalDifficulty: n.prepared.finalDifficulty ?? 0,
    targetNumber: n.prepared.targetNumber ?? 0,
    ...Bn(n, e)
  };
}
class Pm {
  async publish(e, t, i, a = {}) {
    const s = (f) => game.i18n.localize(f), o = Fm(t.result, i, s), r = Tm(a.combat, s), l = {
      ...o,
      ...r,
      hasDetails: o.hasDetails || r.damageDetails.length > 0 || r.damageTotalDetails.length > 0,
      ...Me(e),
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
    ), c = {
      speaker: ChatMessage.getSpeaker({ actor: e }),
      content: u
    };
    if (a.combat?.action && (c.flags = { magnusarchives: { combatAction: a.combat.action } }), t.chatRoll !== void 0 && (c.rolls = [t.chatRoll]), await ChatMessage.create(c), t.result.prepared.context.difficulty.mode !== "hidden") return;
    const p = zm(t.result, s);
    if (Hooks.callAll("magnusarchivesHiddenRollAudit", p, e, t), a.showGmAudit !== !0) return;
    const y = await foundry.applications.handlebars.renderTemplate(
      "systems/magnusarchives/templates/chat/roll-audit-card.hbs",
      {
        ...p,
        ...r,
        ...Me(e)
      }
    ), m = {
      speaker: ChatMessage.getSpeaker({ actor: e }),
      content: y,
      whisper: ChatMessage.getWhisperRecipients("GM").map((f) => f.id),
      blind: !0
    };
    await ChatMessage.create(m);
  }
}
const xm = async () => {
  const n = await new Roll("1d20").evaluate();
  if (n.total === null) throw new Error("The d20 roll did not produce a total.");
  return { naturalRoll: n.total, chatRoll: n };
}, qm = (n) => n.system.derived.packages?.totalEffortCapMode === "unlimited" ? "unlimited" : "core", Om = () => kn();
function Gs(n, e) {
  if (!Number.isInteger(n) || n < 0)
    throw new Error(`${e} must be a non-negative integer.`);
  return n;
}
function An(n, e, t, i) {
  if (!Number.isInteger(t)) throw new Error(`${e} steps must be an integer.`);
  return t === 0 ? null : {
    id: n,
    label: e,
    direction: t > 0 ? "ease" : "hinder",
    steps: Math.abs(t),
    source: i
  };
}
class Bm {
  #e;
  #t;
  #i;
  #n;
  constructor(e, t = xm, i = qm, a = Om) {
    this.#e = e, this.#t = t, this.#i = i, this.#n = a;
  }
  preview(e, t, i) {
    L(e), Gs(t.otherEase, "Other Ease"), Gs(t.otherHindrance, "Other Hindrance");
    const a = [], s = An(
      "manual.skill",
      "MAGNUSARCHIVES.Roll.Breakdown.Skill",
      t.skillSteps,
      "skill"
    );
    s && a.push(s);
    const o = An(
      "manual.other-ease",
      "MAGNUSARCHIVES.Roll.Breakdown.OtherEase",
      t.otherEase,
      "other"
    );
    o && a.push(o);
    const r = An(
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
    const u = t.tags ?? [], c = e.system.derived.combat?.armor, p = u.includes("defense.dodge") || t.origin?.kind === "defense" && t.origin.defenseType === "dodge";
    if (t.pool === "speed" && !p)
      for (const A of c?.speedTaskContributions ?? [])
        a.push({
          id: A.id,
          label: `MAGNUSARCHIVES.Combat.Armor.Unfamiliar.${c?.category ?? "light"}`,
          direction: "hinder",
          steps: A.value,
          source: "other",
          sourceId: A.sourceId
        });
    if (a.push(...t.contributions ?? []), t.pool === null && (t.paidEffort > 0 || (t.damageEffort ?? 0) > 0 || (t.actionCost ?? 0) > 0))
      throw new Error("A Pool-less roll cannot pay Effort or an action cost.");
    const y = i.enabledRuleModuleIds ?? [], m = this.#e.resolveDifficultyPolicy(i.base, y), f = {
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
        totalEffortMaximum: pl(this.#i(e))
      },
      contributions: a,
      horrorIntrusionRange: kt(this.#n()),
      tags: u,
      ...t.target ? { target: t.target } : {},
      ...t.purpose ? { purpose: t.purpose } : {},
      ...t.origin ? { origin: t.origin } : {}
    }, g = this.#e.enrichRollContext(f, y);
    return mm(g);
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
    const u = a.some((m) => m.finalDifficulty !== 0) ? await this.#t() : null, c = a.map((m) => {
      const f = m.finalDifficulty === 0 ? cr(m) : pm(m, u.naturalRoll), g = this.#e.resolveNaturalEffects(
        f,
        i.enabledRuleModuleIds ?? []
      );
      return { ...f, naturalEffects: g };
    }), p = c.some((m) => m.naturalEffects.some(
      (f) => f.status === "applied" && f.refundsPoolCost === !0
    )) ? s.poolCost : 0;
    p > 0 && o !== null && await e.update({ [`system.stats.${o}.value`]: r });
    let y = !1;
    return c.map((m) => {
      const f = {
        ...m,
        poolCostPaid: s.poolCost - p,
        poolCostRefunded: p
      };
      return u?.chatRoll === void 0 || m.automaticSuccess || y ? { result: f } : (y = !0, { result: f, chatRoll: u.chatRoll });
    });
  }
}
function Lm(n) {
  return k.includes(n);
}
class jm {
  #e;
  constructor(e) {
    this.#e = e;
  }
  configuredPool(e) {
    if (!Os.includes(e.system.defaultPool))
      throw new Error(`Unknown Skill default Pool '${e.system.defaultPool}'.`);
    return Lm(e.system.defaultPool) ? e.system.defaultPool : null;
  }
  rankContribution(e, t = []) {
    if (e.type !== "skill") throw new Error("Skill contributions require a Skill Item.");
    if (!te.includes(e.system.rank)) throw new Error(`Unknown Skill rank '${e.system.rank}'.`);
    return this.#e.resolveSkillRankContribution(
      e.system.rank,
      { id: e.id, name: e.name },
      t
    );
  }
  buildRollRequest(e, t) {
    if (e.type !== "skill") throw new Error("Skill rolls require a Skill Item.");
    if (!te.includes(e.system.rank)) throw new Error(`Unknown Skill rank '${e.system.rank}'.`);
    const i = t.pool ?? this.configuredPool(e);
    if (!i) throw new Error("Choose a Pool for this Skill roll.");
    const a = t.rankOverride ? { ...e, system: { ...e.system, rank: t.rankOverride } } : e;
    if (!te.includes(a.system.rank))
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
    if (!te.includes(e.system.rank)) throw new Error(`Unknown Skill rank '${e.system.rank}'.`);
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
const Wm = Object.freeze({
  targetedXpToTarget: 0,
  targetedXpToShare: 0,
  groupXpPerTarget: 0,
  freeXp: 0
});
function _m(n) {
  return {
    actorId: n.id,
    actorName: n.name,
    ...n.img ? { actorImage: n.img } : {}
  };
}
class Km {
  #e;
  #t;
  constructor(e, t = je) {
    this.#e = e, this.#t = t;
  }
  policy(e = []) {
    return this.#e.resolveGMIntrusionPolicy(Wm, e);
  }
  async createTargeted(e, t = []) {
    L(e);
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
    i.forEach(L);
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
    L(e);
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
    if (L(e), L(t), t.id === e.id)
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
      targets: t.map(_m),
      targetXp: i,
      sharedXp: a,
      naturalRoll: s
    };
  }
}
function Mt(n) {
  const e = n.tokenId ?? n.token?.id, t = n.tokenUuid ?? n.token?.uuid;
  return {
    actorId: n.id,
    ...n.actorUuid ?? n.uuid ? { actorUuid: n.actorUuid ?? n.uuid } : {},
    ...e ? { tokenId: e } : {},
    ...t ? { tokenUuid: t } : {}
  };
}
function Mi(n, e, t) {
  if (!Number.isInteger(n) || t !== void 0 && n < t)
    throw new Error(`${e} must be an integer${t === void 0 ? "" : ` of at least ${t}`}.`);
  return n;
}
function Xm(n, e) {
  return n.contexts.every((t) => e.tags.includes(t));
}
function Ym(n, e) {
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
function Jm(n) {
  return Mi(n.value, `NPC modification '${n.id}'`, 0), {
    id: `npc-modification.${n.id}`,
    label: "MAGNUSARCHIVES.Combat.TargetModification",
    direction: n.mode === "ease" ? "ease" : "hinder",
    steps: n.value,
    source: "other",
    sourceId: n.id
  };
}
class Qm {
  #e;
  constructor(e) {
    this.#e = e;
  }
  resolve(e, t, i = []) {
    if (e.type !== "npc") throw new Error("Combat targets must be NPC Actors.");
    const a = Mi(e.system.level, "NPC Level", 0), s = e.system.modifications.map((c, p) => ({ modification: c, index: p })).filter(({ modification: c }) => Xm(c, t) && Ym(c.predicate, t)), o = s.filter(({ modification: c }) => c.mode === "levelOverride").sort((c, p) => ks(p.modification) - ks(c.modification) || p.index - c.index)[0]?.modification;
    let r = o ? Mi(o.value, `NPC modification '${o.id}'`, 0) : a;
    const l = o ? [o.id] : [];
    for (const { modification: c } of s)
      c.mode === "levelDelta" && (r += Mi(c.value, `NPC modification '${c.id}'`), l.push(c.id));
    r = Math.max(0, r);
    const u = s.map(({ modification: c }) => c).filter((c) => c.mode === "ease" || c.mode === "hinder").map((c) => (l.push(c.id), Jm(c)));
    return this.#e.enrichTargetResolution({
      targetId: e.id,
      targetIdentity: Mt(e),
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
class Zm {
  async npcDamage() {
  }
  async characterWound() {
  }
}
async function ep(n) {
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
class tp {
  async #e(e, t, i) {
    const a = await ep(e);
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
class ip {
  async syncNpcDead() {
  }
}
class np {
  async syncNpcDead(e, t) {
    const i = Hi(e);
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
function ap(n) {
  if ("system.health.value" in n) return !0;
  const e = n.system;
  if (!e || typeof e != "object") return !1;
  const t = e.health;
  return !!(t && typeof t == "object" && "value" in t);
}
function sp(n) {
  Hooks.on("updateActor", (e, t, i = {}) => {
    if (i.magnusarchivesSkipDeadStatusSync === !0 || e.type !== "npc" || !ap(t)) return;
    const a = Number(e.system.health?.value);
    Number.isFinite(a) && n.syncNpcDead(e, a <= 0);
  });
}
function bn(n, e) {
  if (!Number.isInteger(n) || n < 0) throw new Error(`${e} must be a non-negative whole number.`);
  return n;
}
class mr {
  ammunition(e) {
    const t = e.system.ammo.enabled, i = bn(e.system.ammo.value, "Current ammunition"), a = bn(e.system.ammo.max, "Maximum ammunition"), s = bn(e.system.ammo.perAttack, "Ammunition per attack");
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
const op = Object.freeze({
  weaponDamage: Object.freeze({ light: 2, medium: 4, heavy: 6 }),
  lightWeaponEase: 1,
  unfamiliarWeaponHindrance: 1,
  armorDefenseSteps: Object.freeze({ light: 1, medium: 2, heavy: 3 }),
  blockSeverityReduction: 1,
  damageEffortBonus: 3
});
function wn(n, e) {
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
function _t(n) {
  return n.naturalEffects.filter((e) => e.kind === "damage-bonus" && e.status === "applied").reduce((e, t) => e + (t.damageBonus ?? 0), 0);
}
function pr(n, e) {
  return n.naturalEffects.filter((i) => i.status === "available").length === 0 ? n : {
    ...n,
    naturalEffects: n.naturalEffects.map((i) => {
      if (i.status !== "available") return i;
      const a = e === "damage" && i.kind === "damage-bonus", s = e === "effect" && (i.kind === "minor-effect" || i.kind === "major-effect");
      return { ...i, status: a || s ? "applied" : "inapplicable" };
    })
  };
}
class rp {
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
  constructor(e, t, i, a, s, o = new dr(), r = new Zm(), l = new ip(), u = new sr(s), c = new mr()) {
    this.#e = e, this.#t = t, this.#i = i, this.#n = a, this.#a = s, this.#l = o, this.#r = r, this.#s = l, this.#c = u, this.#o = c;
  }
  policy(e = []) {
    return this.#e.resolveCombatPolicy(op, e);
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
    const i = e.system.derived.packages?.weaponCategories ?? e.system.proficiencies.weaponCategories, a = e.system.derived.packages?.weaponFamilies ?? [], s = rt(t.system.family);
    return i.includes(t.system.category) || s !== "" && a.some((o) => rt(o) === s);
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
    }, u = i.targets ?? [], c = u.map((R) => this.#n.resolve(R, l, a)), p = u.length > 0 ? u : [null], y = c.length > 0 ? c : [null], m = [];
    t.system.category === "light" && s.lightWeaponEase > 0 && m.push({
      id: `weapon.${t.id}.light`,
      label: "MAGNUSARCHIVES.Combat.Weapon.LightEase",
      direction: "ease",
      steps: s.lightWeaponEase,
      source: "other",
      sourceId: t.id
    });
    const f = this.weaponFamiliarityContribution(e, t, a);
    if (f && m.push(f), i.extremeRange && m.push({
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
    const g = i.skill ? this.#i.rankContribution(i.skill, a) : null;
    g && m.push(g);
    const A = s.weaponDamage[t.system.category], v = t.system.bonusDamage, E = this.weaponBaseDamage(t, s), H = y.map((R, U) => ({
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
      ].map((z) => [z.id, z])).values()],
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
      ...p[U] ? {
        target: {
          ...Mt(p[U]),
          name: p[U].name,
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
      const c = l.result.prepared.damageEffortApplied * s.policy.damageEffortBonus, p = _t(l.result), y = s.baseDamage + c + p, m = s.targets[u] ?? null, f = m?.system.armorBase ?? 0;
      return {
        target: m,
        targetResolution: s.targetResolutions[u] ?? null,
        execution: l,
        grossDamage: y,
        categoryDamage: s.categoryDamage,
        weaponBonusDamage: s.weaponBonusDamage,
        effortDamage: c,
        naturalDamage: p,
        armor: f,
        netDamage: Math.max(0, y - f),
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
      const o = pr(s.execution.result, t), r = o.prepared.context.origin;
      if (r?.kind !== "weapon") return s;
      const l = r.baseDamage + o.prepared.damageEffortApplied * a.damageEffortBonus + _t(o), u = o.prepared.damageEffortApplied * a.damageEffortBonus, c = _t(o);
      return {
        ...s,
        execution: { ...s.execution, result: o },
        grossDamage: l,
        effortDamage: u,
        naturalDamage: c,
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
    const i = wn(t, "Damage"), a = wn(e.system.armorBase, "NPC Armor"), s = wn(e.system.health.value, "NPC Health"), o = Math.max(0, i - a), r = Math.max(0, s - o);
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
function Di(n) {
  return {
    targetActorId: n.actorId,
    ...n.actorUuid ? { targetActorUuid: n.actorUuid } : {},
    ...n.tokenId ? { targetTokenId: n.tokenId } : {},
    ...n.tokenUuid ? { targetTokenUuid: n.tokenUuid } : {}
  };
}
class lp {
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
          ...Di(Mt(t.target)),
          requestedDamage: t.grossDamage,
          applied: !1
        }
      } : {}
    };
    await this.#e.publish(e, t.execution, i, { combat: r, showGmAudit: a });
  }
  async publishDefense(e, t, i, a, s, o = !1) {
    const r = Di(Hi(e)), l = a ? { sourceActorId: a.id, sourceName: a.name } : {}, u = {
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
    const o = Mt(e), r = Hi(t), l = [...s];
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
    }, c = await foundry.applications.handlebars.renderTemplate(
      "systems/magnusarchives/templates/chat/defense-request-card.hbs",
      {
        sourceName: e.name,
        ...Me(e),
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
      content: c,
      flags: { magnusarchives: { defenseRequest: u } }
    });
  }
}
const cp = async (n) => {
  const e = await new Roll(n).evaluate();
  if (e.total === null) throw new Error("The depletion roll did not produce a total.");
  return { total: e.total, chatRoll: e };
};
class dp {
  #e;
  constructor(e = cp) {
    this.#e = e;
  }
  async roll(e) {
    const t = e.system.depletion;
    if (!t.enabled) throw new Error("Depletion is not enabled for this Item.");
    const i = ["artifact", "weapon", "shield", "armor"].includes(e.type);
    if (i && e.system.depleted)
      throw new Error(`This ${e.name} is already depleted.`);
    const s = ["weapon", "shield", "armor"].includes(e.type) ? "" : t.formula?.trim() ?? "";
    if (Jt(t), !Number.isInteger(t.threshold) || t.threshold < 1)
      throw new Error("Depletion threshold must be a positive whole number.");
    const o = s || sd(t), r = Number(o.match(/^1d(\d+)$/i)?.[1]);
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
class up {
  async publish(e, t) {
    const i = await foundry.applications.handlebars.renderTemplate(
      "systems/magnusarchives/templates/chat/depletion-card.hbs",
      {
        itemName: t.itemName,
        ...Me(e.actor),
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
const $s = 124, mp = 58, Vs = 108, pp = 10, fp = async (n) => {
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
}, gp = async (n, e) => typeof foundry > "u" || !foundry.applications?.ux?.TextEditor?.implementation ? n : foundry.applications.ux.TextEditor.implementation.enrichHTML(n, e ? { async: !0, relativeTo: e } : { async: !0 });
function hp(n) {
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
function yp(n, e = 120) {
  const t = n.replace(/<[^>]*>/g, " ").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'").replace(/\s+/g, " ").trim();
  return t.length <= e ? t : `${t.slice(0, Math.max(0, e - 1)).trimEnd()}…`;
}
class Sp {
  #e;
  #t;
  #i;
  constructor(e = new fa(), t = fp, i = gp) {
    this.#e = e, this.#t = t, this.#i = i;
  }
  async prepare(e, t = {}) {
    const i = t.characterTier ?? Number.MAX_SAFE_INTEGER, a = t.progress ?? { focusUuid: e.uuid, ownedNodeIds: [] }, s = t.missingOwnedNodeIds ?? /* @__PURE__ */ new Set();
    let o;
    try {
      o = this.#e.evaluateProgress(e.system.graph, i, a);
    } catch (m) {
      if (!(m instanceof Rt)) throw m;
      if (t.progress) {
        const f = new Set(a.ownedNodeIds);
        o = {
          characterTier: i,
          ownedNodeIds: [...f],
          diagnostics: m.diagnostics,
          nodes: e.system.graph.nodes.map((g) => ({
            node: g,
            state: f.has(g.id) ? "owned" : g.tier > i ? "future" : "available",
            reason: f.has(g.id) ? "owned" : g.tier > i ? "tier-too-low" : "tier-one-choice",
            requiredTier: g.tier,
            reachableFrom: []
          })).sort((g, A) => g.node.tier - A.node.tier || g.node.id.localeCompare(A.node.id))
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
    const r = hp(o.nodes.map((m) => m.node)), l = t.editor ? 6 : Math.max(1, ...o.nodes.map((m) => m.node.tier)), u = /* @__PURE__ */ new Map();
    for (const m of o.nodes)
      u.set(m.node.tier, (u.get(m.node.tier) ?? 0) + 1);
    const c = Math.max(440, ...[...u.values()].map((m) => m * $s + (m + 1) * pp)), p = await Promise.all(o.nodes.map(async (m) => {
      const f = await this.#t(m.node.abilityUuid), g = m.state === "owned" && s.has(m.node.id), A = f?.description ?? m.node.abilitySnapshot.description ?? "", v = o.diagnostics.some((z) => z.code === "invalid-owned-progression" && z.nodeId === m.node.id || z.severity === "error" && (!z.nodeId || z.nodeId === m.node.id)), E = m.state !== "owned" && m.node.tier > i, H = m.state !== "owned" && m.reason === "no-owned-prerequisite", R = m.state !== "owned" && (m.state !== "available" || v), U = t.editable && t.progress && !t.gmProgressionEdit ? m.state === "owned" ? "undoFocusAcquisition" : "acquireFocusNode" : "openFocusNode";
      return {
        id: m.node.id,
        abilityUuid: m.node.abilityUuid,
        abilityName: f?.name || m.node.abilitySnapshot.name || m.node.id,
        descriptionExcerpt: yp(A),
        descriptionHtml: await this.#i(A, f?.relativeTo ?? e),
        tier: m.node.tier,
        state: m.state,
        stateLabel: `MAGNUSARCHIVES.Focus.State.${m.state}`,
        reason: m.reason,
        requiredTier: m.requiredTier,
        reachableFrom: m.reachableFrom,
        missingAbility: !f,
        missingOwnedAbility: g,
        isOwned: m.state === "owned",
        advisoryUnavailable: R,
        tierLocked: E,
        prerequisiteLocked: H,
        invalidProgression: v,
        canAcquire: !!(t.editable && t.progress && !t.gmProgressionEdit && m.state !== "owned"),
        canRestoreAbility: !!(t.editable && t.progress && g),
        canUndoAcquisition: !!(t.editable && t.progress && m.state === "owned" && !t.gmProgressionEdit),
        canGmMarkOwned: !!(t.editable && t.progress && t.gmOverrideAllowed && t.gmProgressionEdit && m.state !== "owned"),
        canGmRemoveOwned: !!(t.editable && t.progress && t.gmOverrideAllowed && t.gmProgressionEdit && m.state === "owned"),
        primaryAction: t.editor?.connectionSourceNodeId ? "completeFocusConnection" : t.editor ? "selectFocusEditorNode" : U,
        selected: t.editor?.selectedNodeId === m.node.id,
        connectionSource: t.editor?.connectionSourceNodeId === m.node.id,
        xPercent: r.get(m.node.id) ?? 50,
        width: $s,
        height: mp
      };
    })), y = e.system.graph.connections.map(({ id: m, from: f, to: g }) => ({ id: m, from: f, to: g }));
    return {
      focusUuid: e.uuid,
      focusName: e.name,
      markerId: `focus-arrow-${e.id.replace(/[^a-zA-Z0-9_-]/g, "-")}`,
      mode: t.editor ? "editor" : t.progress ? "progression" : "focus",
      editor: !!t.editor,
      width: c,
      height: l * Vs,
      nodes: p,
      connections: y,
      tiers: Array.from({ length: l }, (m, f) => {
        const g = f + 1;
        return {
          tier: g,
          top: f * Vs,
          nodes: p.filter((A) => A.tier === g).sort((A, v) => A.xPercent - v.xPercent || A.id.localeCompare(v.id))
        };
      }),
      diagnostics: o.diagnostics,
      invalid: !1
    };
  }
}
function nt(n) {
  return structuredClone(n);
}
function Re(n) {
  return new Set(n).size === n.length;
}
function vn(n, e) {
  return !n?.name || !n.system || typeof n.system != "object" ? null : { name: n.name, img: n.img, type: e, system: nt(n.system) };
}
function Ap(n, e) {
  return !n?.name || !n.system || typeof n.system != "object" ? null : { name: n.name, ...n.img ? { img: n.img } : {}, type: e, system: nt(n.system) };
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
    replacement: ba()
  };
}
function ba() {
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
function Cn() {
  return {
    kind: "other",
    sourceUuid: "",
    instanceId: "",
    grantId: "",
    status: "active",
    contentUuid: "",
    contentKey: "",
    replacement: ba()
  };
}
function xt(n) {
  return { name: n.name, img: n.img, type: n.type, system: nt(n.system) };
}
function En(n, e) {
  const t = xt(n);
  return t.type = e, t;
}
function Fe(n) {
  return [...n.items].filter((e) => e.type === "characterType" || e.type === "descriptor" || e.type === "species");
}
function bp(n, e) {
  return [...n.items].filter((t) => t.system.grantedBy?.instanceId === e);
}
function Ln(n, e) {
  return bp(n, e).flatMap((i) => {
    if (i.type !== "descriptor" && i.type !== "characterType" && i.type !== "species") return [i];
    const a = i.system.instance?.instanceId;
    return [i, ...a ? Ln(n, a) : []];
  });
}
class wp {
  #e;
  #t;
  #i;
  constructor(e = async (a) => await fromUuid(a), t = () => globalThis.crypto?.randomUUID?.() ?? `package-${Date.now()}-${Math.random()}`, i = Date.now) {
    this.#e = e, this.#t = t, this.#i = i;
  }
  async attachType(e, t, i = {}) {
    this.#S(e, t, "characterType");
    const a = i.replaceItemId ? Fe(e).find((R) => R.id === i.replaceItemId && R.type === "characterType") : void 0;
    if (Fe(e).some((R) => R.type === "characterType" && R.id !== a?.id))
      throw new Error("This Character already has an active Type.");
    const s = nt(t.system), o = s.edgeGrant.mode === "choice" ? i.edgePool : s.edgeGrant.pool;
    if (s.edgeGrant.mode === "choice" && !o) throw new Error("This Type requires an Edge Pool choice.");
    const r = s.genre === "superhero" && s.superhero?.superheroics?.enabled === !0, l = i.superheroicsPool;
    if (r && !l)
      throw new Error("This Superhero Type requires a Superheroics Pool choice.");
    if (l && !k.includes(l))
      throw new Error("Invalid Superheroics Pool choice.");
    const u = Number.isInteger(s.superhero?.powerShiftCount) ? Math.max(0, Number(s.superhero?.powerShiftCount)) : 0, c = Array.from({ length: u }, (R, U) => String(i.powerShifts?.[U] ?? "").trim()), p = this.#f(s.choiceGroups ?? [], i.skillChoices ?? {}), y = this.#p(s.abilityChoiceGroups ?? [], i.abilityChoices ?? {}), m = this.#t(), f = s.instance?.sourceUuid || t.uuid, g = (s.abilityChoiceGroups ?? []).flatMap((R) => R.options.filter((U) => y[R.id]?.includes(U.id)).map((U) => ({ ...U, id: `${R.id}:${U.id}` }))), A = [
      ...await this.#l([...s.abilityGrants ?? [], ...g], "type", f, m),
      ...await this.#r(s.skillGrants ?? [], "type", f, m),
      ...await this.#s(s.choiceGroups ?? [], p, "type", f, m)
    ], { grants: v, skippedGrantIds: E } = await this.#o(
      e,
      A,
      t,
      i.conflictResolver
    ), H = xt(t);
    return H.system = {
      ...s,
      instance: {
        sourceUuid: f,
        instanceId: m,
        role: "primary",
        attachedAt: this.#i(),
        selections: {
          edgePool: o ?? "none",
          superheroicsPool: r ? l : "none",
          powerShifts: c,
          poolChoices: [],
          skillChoices: Object.entries(p).map(([R, U]) => ({ groupId: R, optionIds: U })),
          abilityChoices: Object.entries(y).map(([R, U]) => ({ groupId: R, optionIds: U })),
          descriptorChoices: [],
          suppressedGrantIds: E
        },
        parent: Cn()
      }
    }, this.#n(e, H, v, a, i.replaceGrantedItemsMode ?? "delete", E);
  }
  async attachDescriptor(e, t, i) {
    this.#S(e, t, "descriptor");
    const a = nt(t.system), s = a.instance?.sourceUuid || t.uuid;
    if (Fe(e).some((m) => m.type === "descriptor" && m.system.instance.sourceUuid === s)) throw new Error("This Descriptor is already attached.");
    if (i.role === "primary" && Fe(e).some((m) => m.type === "descriptor" && m.system.instance.role === "primary")) throw new Error("This Character already has a primary Descriptor.");
    const o = this.#t(), r = this.#m(a.poolBonusChoiceGroups ?? [], i.poolChoices ?? {}), l = this.#f(a.choiceGroups ?? [], i.skillChoices ?? {}), u = [
      ...await this.#r(a.skillGrants ?? [], "descriptor", s, o),
      ...await this.#s(a.choiceGroups ?? [], l, "descriptor", s, o)
    ], { grants: c, skippedGrantIds: p } = await this.#o(
      e,
      u,
      t,
      i.conflictResolver
    ), y = xt(t);
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
          poolChoices: Object.entries(r).map(([m, f]) => ({ groupId: m, pools: f })),
          skillChoices: Object.entries(l).map(([m, f]) => ({ groupId: m, optionIds: f })),
          abilityChoices: [],
          descriptorChoices: [],
          suppressedGrantIds: p
        },
        parent: i.parent ?? Cn()
      }
    }, i.parent && (y.system.grantedBy = i.parent), this.#n(e, y, c, void 0, "delete", p);
  }
  async attachSpecies(e, t, i = {}) {
    this.#S(e, t, "species");
    const a = i.replaceItemId ? Fe(e).find((M) => M.id === i.replaceItemId && M.type === "species") : void 0;
    if (Fe(e).some((M) => M.type === "species" && M.id !== a?.id))
      throw new Error("This Character already has an active Species.");
    const s = nt(t.system), o = s.edgeGrant.mode === "choice" ? i.edgePool : s.edgeGrant.pool;
    if (s.edgeGrant.mode === "choice" && !o) throw new Error("This Species requires an Edge Pool choice.");
    const r = this.#f(s.choiceGroups ?? [], i.skillChoices ?? {}), l = this.#p(s.abilityChoiceGroups ?? [], i.abilityChoices ?? {}), u = new Map(
      (i.resolvedDescriptorChoiceGroups ?? []).map((M) => [M.id, M])
    ), c = (s.descriptorChoiceGroups ?? []).map((M) => {
      if ((M.sourceMode ?? "fixed") !== "catalog") return M;
      const V = u.get(M.id);
      return { ...M, options: V?.options ?? M.options };
    }), p = this.#h(
      c,
      i.descriptorChoices ?? {}
    ), y = this.#t(), m = s.instance?.sourceUuid || t.uuid, f = (s.abilityChoiceGroups ?? []).flatMap((M) => M.options.filter((V) => l[M.id]?.includes(V.id)).map((V) => ({ ...V, id: `${M.id}:${V.id}` }))), g = c.flatMap((M) => M.options.filter((V) => p[M.id]?.includes(V.id)).map((V) => ({ ...V, id: `${M.id}:${V.id}` }))), A = [
      ...await this.#l([...s.abilityGrants ?? [], ...f], "species", m, y),
      ...await this.#r(s.skillGrants ?? [], "species", m, y),
      ...await this.#s(s.choiceGroups ?? [], r, "species", m, y)
    ], v = await this.#o(
      e,
      A,
      t,
      i.conflictResolver
    ), E = [...v.grants], H = [...v.skippedGrantIds], R = [...v.skippedGrantIds], U = new Set(Fe(e).filter((M) => M.type === "descriptor").map((M) => M.system.instance.sourceUuid || `snapshot:${M.name.trim().toLocaleLowerCase()}`)), z = [...s.descriptorGrants ?? [], ...g];
    if (!Re(z.map((M) => M.id)))
      throw new Error("Species Descriptor grant IDs must be unique.");
    for (const M of z) {
      const V = M.descriptorUuid ? await this.#e(M.descriptorUuid) : null;
      if (V && V.type !== "descriptor") throw new Error("A Species Descriptor grant references a non-Descriptor Item.");
      const I = V ? xt(V) : Ap(M.snapshot, "descriptor");
      if (!I) throw new Error(`Descriptor grant '${M.id}' has neither a source nor a usable snapshot.`);
      const ie = nt(I.system), W = ie.instance?.sourceUuid || M.descriptorUuid, Ge = W || `snapshot:${String(I.name).trim().toLocaleLowerCase()}`;
      if (U.has(Ge)) {
        H.push(M.id), R.push(M.id);
        continue;
      }
      U.add(Ge);
      const q = this.#t(), J = this.#m(
        ie.poolBonusChoiceGroups ?? [],
        i.descriptorPoolChoices?.[M.id] ?? {}
      ), ke = this.#f(
        ie.choiceGroups ?? [],
        i.descriptorSkillChoices?.[M.id] ?? {}
      ), ye = [
        ...await this.#r(ie.skillGrants ?? [], "descriptor", W, q),
        ...await this.#s(ie.choiceGroups ?? [], ke, "descriptor", W, q)
      ], Ce = {
        id: String(V?.id ?? M.id),
        uuid: W,
        name: String(I.name),
        type: "descriptor",
        ...I.img ? { img: String(I.img) } : {},
        system: ie
      }, re = await this.#o(
        e,
        ye,
        Ce,
        i.conflictResolver,
        E
      );
      R.push(...re.skippedGrantIds);
      const Q = {
        contentUuid: W,
        contentKey: `descriptor:${String(I.name).trim().toLocaleLowerCase()}`
      }, Se = {
        kind: "species",
        sourceUuid: m,
        instanceId: y,
        grantId: M.id,
        status: "active",
        ...Q,
        replacement: ba()
      };
      I.system = {
        ...ie,
        grantedBy: Se,
        instance: {
          sourceUuid: W,
          instanceId: q,
          role: "speciesGranted",
          attachedAt: this.#i(),
          selections: {
            edgePool: "none",
            superheroicsPool: "none",
            powerShifts: [],
            poolChoices: Object.entries(J).map(([me, N]) => ({ groupId: me, pools: N })),
            skillChoices: Object.entries(ke).map(([me, N]) => ({ groupId: me, optionIds: N })),
            abilityChoices: [],
            descriptorChoices: [],
            suppressedGrantIds: re.skippedGrantIds
          },
          parent: Se
        }
      }, E.push(I, ...re.grants);
    }
    const K = xt(t);
    return K.system = {
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
          skillChoices: Object.entries(r).map(([M, V]) => ({ groupId: M, optionIds: V })),
          abilityChoices: Object.entries(l).map(([M, V]) => ({ groupId: M, optionIds: V })),
          descriptorChoices: Object.entries(p).map(([M, V]) => ({ groupId: M, optionIds: V })),
          suppressedGrantIds: H
        },
        parent: Cn()
      }
    }, this.#n(
      e,
      K,
      E,
      a,
      i.replaceGrantedItemsMode ?? "delete",
      R
    );
  }
  async remove(e, t, i) {
    const a = Fe(e).find((c) => c.id === t);
    if (!a) throw new Error("Character Package not found.");
    const s = a.system.instance.instanceId, o = Ln(e, s), r = Object.fromEntries(k.map((c) => [c, e.system.derived.pools[c].max])), l = Zi(a), u = i === "delete" ? o.map((c) => c.id) : [];
    return i === "keep" && await Promise.all(o.map((c) => c.update({
      "system.grantedBy.status": "retained",
      ...c.type === "descriptor" || c.type === "characterType" || c.type === "species" ? { "system.instance.parent.status": "retained" } : {}
    }))), await e.deleteEmbeddedDocuments("Item", [a.id, ...u]), await this.#a(e, r, Object.fromEntries(k.map((c) => [c, r[c] - l[c]]))), {
      removedPackageId: a.id,
      deletedGrantedItemIds: u,
      retainedGrantedItemIds: i === "keep" ? o.map((c) => c.id) : []
    };
  }
  async #n(e, t, i, a, s = "delete", o = []) {
    const r = Object.fromEntries(k.map((y) => [y, e.system.derived.pools[y].max])), l = Zi(t), u = a ? Zi(a) : { might: 0, speed: 0, intellect: 0 }, c = await e.createEmbeddedDocuments("Item", [t, ...i]);
    try {
      if (a) {
        const m = Ln(e, a.system.instance.instanceId);
        s === "keep" && await Promise.all(m.map((f) => f.update({
          "system.grantedBy.status": "retained",
          ...f.type === "descriptor" || f.type === "characterType" || f.type === "species" ? { "system.instance.parent.status": "retained" } : {}
        }))), await e.deleteEmbeddedDocuments("Item", [
          a.id,
          ...s === "delete" ? m.map((f) => f.id) : []
        ]);
      }
      const y = Object.fromEntries(k.map((m) => [m, r[m] + l[m] - u[m]]));
      await this.#a(e, r, y);
    } catch (y) {
      const m = c.map((f) => f.id).filter((f) => !!f);
      throw m.length && await e.deleteEmbeddedDocuments("Item", m), y;
    }
    const p = t.system.instance.instanceId;
    return { packageItem: c[0], grantedItems: c.slice(1), instanceId: p, skippedGrantIds: o };
  }
  async #a(e, t, i) {
    const a = {};
    for (const s of k)
      a[`system.stats.${s}.value`] = co(e.system.stats[s].value, t[s], Math.max(0, i[s]));
    await e.update(a);
  }
  async #l(e, t, i, a) {
    if (!Re(e.map((s) => s.id))) throw new Error("Type Ability grant IDs must be unique.");
    return Promise.all(e.map(async (s) => {
      const o = s.abilityUuid ? await this.#e(s.abilityUuid) : null;
      if (o && o.type !== "ability") throw new Error("An Ability grant references a non-Ability Item.");
      const r = o ? En(o, "ability") : vn(s.snapshot, "ability");
      if (!r) throw new Error(`Ability grant '${s.id}' has neither a source nor a usable snapshot.`);
      const l = Ne("ability", String(r.name ?? s.snapshot.name), s.abilityUuid);
      return r.system = { ...r.system, grantedBy: Ds(t, i, a, s.id, l) }, r;
    }));
  }
  async #r(e, t, i, a) {
    if (!Re(e.map((s) => s.id))) throw new Error("Descriptor Skill grant IDs must be unique.");
    return Promise.all(e.map((s) => this.#c(s, s.rank, t, i, a, s.id)));
  }
  async #s(e, t, i, a, s) {
    const o = [];
    for (const r of e)
      for (const l of t[r.id] ?? []) {
        const u = r.options.find((c) => c.id === l);
        o.push(await this.#c(u, r.rank, i, a, s, `${r.id}:${u.id}`));
      }
    return o;
  }
  async #c(e, t, i, a, s, o) {
    const r = e.skillUuid ? await this.#e(e.skillUuid) : null;
    if (r && r.type !== "skill") throw new Error("A Skill grant references a non-Skill Item.");
    const l = r ? En(r, "skill") : vn(e.snapshot, "skill") ?? (e.customName ? { name: e.customName, type: "skill", system: {} } : null);
    if (!l) throw new Error(`Skill grant '${o}' has neither a source, custom name, nor usable snapshot.`);
    const u = Ne("skill", String(l.name ?? e.customName), e.skillUuid), c = l.system, p = c.acquisition && typeof c.acquisition == "object" ? c.acquisition : {}, y = String(e.notes ?? "");
    return l.system = {
      ...c,
      ...y ? { acquisition: { ...p, notes: y } } : {},
      rank: t,
      grantedBy: Ds(i, a, s, o, u)
    }, l;
  }
  async #o(e, t, i, a, s = []) {
    const o = [], r = [], l = [...e.items], u = s.filter((c) => c.type === "ability" || c.type === "skill");
    for (const c of t) {
      let p = c;
      const y = p.type;
      if (y !== "ability" && y !== "skill") {
        o.push(p);
        continue;
      }
      for (; ; ) {
        const m = p.system.grantedBy ?? {}, f = { type: y, contentUuid: m.contentUuid, contentKey: m.contentKey }, g = [...l, ...u, ...o], A = Li(g, f);
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
        if (E.action === "cancel") throw new Le();
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
    const i = e, a = i.system ?? {}, s = a.grantedBy ?? {}, o = Ne(t, String(i.name ?? ""), String(s.contentUuid ?? ""));
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
    const o = s ? En(s, a) : vn(t.snapshot, a) ?? (a === "skill" && t.custom ? { name: t.name, type: a, system: {} } : null);
    if (!o) throw new Error(`The selected ${a} replacement is unavailable and has no usable snapshot.`);
    const r = e.system, l = r.grantedBy ?? {}, u = l.replacement?.active ? l.replacement : {
      originalName: String(e.name ?? ""),
      originalContentUuid: l.contentUuid,
      originalContentKey: l.contentKey
    }, c = Ne(a, String(o.name ?? t.name), t.itemUuid), p = o.system, y = r.acquisition && typeof r.acquisition == "object" ? r.acquisition : {}, m = p.acquisition && typeof p.acquisition == "object" ? p.acquisition : {};
    return o.system = {
      ...p,
      ...a === "skill" ? { rank: r.rank } : {},
      ...a === "skill" && y.notes ? { acquisition: { ...m, notes: y.notes } } : {},
      grantedBy: {
        ...l,
        contentUuid: c.contentUuid,
        contentKey: c.contentKey,
        replacement: {
          active: !0,
          originalName: u.originalName,
          originalContentUuid: u.originalContentUuid,
          originalContentKey: u.originalContentKey,
          replacementName: String(o.name ?? t.name),
          replacementContentUuid: c.contentUuid,
          replacementContentKey: c.contentKey,
          selectionKind: i
        }
      }
    }, o;
  }
  #A(e, t, i, a) {
    const s = [], o = (c, p, y) => {
      const m = c.snapshot?.name || c.customName;
      m && s.push({
        id: `${y}:${c.id}`,
        type: i,
        name: m,
        itemUuid: c.itemUuid,
        snapshot: c.snapshot,
        reason: p,
        reasonSourceUuid: y,
        ...i === "skill" && !c.itemUuid ? { custom: !0 } : {}
      });
    }, r = (c, p, y) => {
      for (const m of c ?? []) o(m, p, y);
    }, l = (c, p = !1) => {
      const y = c.system, m = "instance" in y ? y.instance?.selections : void 0;
      if (i === "skill") {
        for (const f of y.skillGrants ?? [])
          c.uuid === t.uuid && f.id === a && r(f.alternatives, `${c.name} — declared alternative`, c.uuid);
        for (const f of y.choiceGroups ?? []) {
          const g = m?.skillChoices.find((v) => v.groupId === f.id)?.optionIds ?? [], A = a.startsWith(`${f.id}:`) ? a.slice(f.id.length + 1) : "";
          if (c.uuid === t.uuid && A)
            for (const v of f.options) v.id !== A && o({ id: v.id, itemUuid: v.skillUuid, customName: v.customName, snapshot: v.snapshot }, `${c.name} — Skill choice`, c.uuid);
          else if (!p)
            for (const v of f.options) g.includes(v.id) || o({ id: v.id, itemUuid: v.skillUuid, customName: v.customName, snapshot: v.snapshot }, `${c.name} — unused Skill choice`, c.uuid);
        }
      } else {
        for (const f of y.abilityGrants ?? [])
          c.uuid === t.uuid && f.id === a && r(f.alternatives, `${c.name} — declared alternative`, c.uuid);
        for (const f of y.abilityChoiceGroups ?? []) {
          const g = m?.abilityChoices.find((v) => v.groupId === f.id)?.optionIds ?? [], A = a.startsWith(`${f.id}:`) ? a.slice(f.id.length + 1) : "";
          if (c.uuid === t.uuid && A)
            for (const v of f.options) v.id !== A && o({ id: v.id, itemUuid: v.abilityUuid, customName: "", snapshot: v.snapshot }, `${c.name} — Ability choice`, c.uuid);
          else if (!p)
            for (const v of f.options) g.includes(v.id) || o({ id: v.id, itemUuid: v.abilityUuid, customName: "", snapshot: v.snapshot }, `${c.name} — unused Ability choice`, c.uuid);
        }
      }
    };
    l(t, !0);
    for (const c of Fe(e)) l(c);
    const u = /* @__PURE__ */ new Set();
    return s.filter((c) => {
      const p = Ne(i, c.name, c.itemUuid), y = p.contentUuid || p.contentKey;
      return u.has(y) || _o(e.items, p) ? !1 : (u.add(y), !0);
    });
  }
  #f(e, t) {
    const i = {};
    for (const a of e) {
      const s = t[a.id] ?? [];
      if (s.length !== a.choose || !Re(s) || s.some((o) => !a.options.some((r) => r.id === o)))
        throw new Error(`Descriptor choice '${a.id}' requires exactly ${a.choose} valid option(s).`);
      i[a.id] = [...s];
    }
    return i;
  }
  #p(e, t) {
    const i = {};
    for (const a of e) {
      const s = t[a.id] ?? [];
      if (s.length !== a.choose || !Re(s) || s.some((o) => !a.options.some((r) => r.id === o)))
        throw new Error(`Ability choice '${a.id}' requires exactly ${a.choose} valid option(s).`);
      i[a.id] = [...s];
    }
    return i;
  }
  #h(e, t) {
    if (!Re(e.map((a) => a.id)))
      throw new Error("Species Descriptor choice group IDs must be unique.");
    const i = {};
    for (const a of e) {
      if (!Re(a.options.map((o) => o.id)))
        throw new Error(`Descriptor choice '${a.id}' option IDs must be unique.`);
      const s = t[a.id] ?? [];
      if (!Number.isInteger(a.choose) || a.choose < 1 || a.choose > a.options.length || s.length !== a.choose || !Re(s) || s.some((o) => !a.options.some((r) => r.id === o)))
        throw new Error(`Descriptor choice '${a.id}' requires exactly ${a.choose} valid option(s).`);
      i[a.id] = [...s];
    }
    return i;
  }
  #m(e, t) {
    if (!Re(e.map((a) => a.id)))
      throw new Error("Descriptor Pool bonus choice group IDs must be unique.");
    const i = {};
    for (const a of e) {
      const s = [...new Set(a.pools)].filter((r) => k.includes(r));
      if (s.length !== a.pools.length || !Number.isInteger(a.choose) || a.choose < 1 || a.choose > s.length || !Number.isInteger(a.amount) || a.amount < 1)
        throw new Error(`Descriptor Pool choice '${a.id}' is invalid.`);
      const o = t[a.id] ?? [];
      if (o.length !== a.choose || !Re(o) || o.some((r) => !s.includes(r)))
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
function Ei(n, e, t = 0) {
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
function vp(n) {
  return n.type === "npc" ? Mt(n) : {
    actorId: n.id,
    ...n.actorUuid ?? n.uuid ? { actorUuid: n.actorUuid ?? n.uuid } : {},
    ...n.tokenId ? { tokenId: n.tokenId } : {},
    ...n.tokenUuid ? { tokenUuid: n.tokenUuid } : {}
  };
}
class Cp {
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
    const i = Ke(e);
    if (t && i.length > 0 && !i.includes(t))
      throw new Error(`${t} is not an allowed Pool for this Ability.`);
    return i.length === 1 ? i[0] : t ?? null;
  }
  previewPayment(e, t, i) {
    L(e), this.#l(t);
    const a = Ke(t), s = Ei(t.system.cost.amount, "Ability cost");
    if (s <= 0 || a.length === 0)
      throw new Error("This Ability has no payable Pool cost.");
    if (!a.includes(i)) throw new Error(`${i} is not an allowed Pool for this Ability.`);
    const o = Ei(e.system.stats[i].value, `${i} Pool value`), r = Math.max(0, Math.trunc(e.system.derived.pools[i].edge)), l = On(s, 0, r, t.system.cost.ignoresEdge), u = o - l.poolCost;
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
    const r = e.system.stats[s].value, l = On(
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
    ], u = { tags: l, pool: a }, c = r.map((g) => g?.type === "npc" ? this.#i.resolve(g, u, s) : null), p = [], y = Fs(t, t.system.rollModifier, "roll");
    if (y && p.push(y), t.system.roll === "attack") {
      const g = Fs(t, t.system.attackModifier, "attack");
      g && p.push(g);
    }
    const m = i.skill ? this.#t.rankContribution(i.skill, s) : null;
    m && p.push(m);
    const f = r.map((g, A) => ({
      label: t.name,
      pool: a,
      difficulty: c[A] ? { mode: "hidden", value: c[A].difficulty } : i.difficulty ?? { mode: "unknown" },
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
        ...c[A]?.contributions ?? [],
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
        damage: Ei(t.system.damage, "Ability damage"),
        damageEffect: t.system.damageEffect,
        stressAmount: t.system.stressAmount
      },
      ...g ? {
        target: {
          ...vp(g),
          name: g.name,
          type: g.type === "npc" ? "npc" : "character"
        }
      } : {}
    }));
    return { ability: t, pool: a, requests: f, targets: r, targetResolutions: c, damage: t.system.damage };
  }
  async executeRoll(e, t, i, a) {
    const s = this.buildRollPlan(e, t, i), o = await this.#e.executeBatch(e, s.requests, a), r = this.#n.policy(i.enabledRuleModuleIds ?? []).damageEffortBonus;
    return o.map((l, u) => {
      const c = t.system.roll === "attack" ? l.result.prepared.damageEffortApplied * r : 0, p = t.system.roll === "attack" ? _t(l.result) : 0;
      return {
        ability: t,
        target: s.targets[u] ?? null,
        targetResolution: s.targetResolutions[u] ?? null,
        execution: l,
        baseDamage: s.damage,
        effortDamage: c,
        naturalDamage: p,
        grossDamage: s.damage + c + p,
        damageEffect: t.system.damageEffect,
        stressAmount: t.system.stressAmount
      };
    });
  }
  chooseAttackOutcomes(e, t) {
    return e.map((i) => {
      if (i.ability.system.roll !== "attack") return i;
      const a = pr(i.execution.result, t), s = _t(a);
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
    const t = Ei(e.system.cost.amount, "Ability cost");
    return Ke(e).length > 0 ? t : 0;
  }
}
function Ts(n) {
  return n.type === "npc" ? Mt(n) : Hi(n);
}
function zs(n, e) {
  const t = n.target;
  return t ? t.type === "npc" && n.grossDamage > 0 ? {
    damage: n.grossDamage,
    action: {
      kind: "npcDamage",
      ...Di(Ts(t)),
      requestedDamage: n.grossDamage,
      applied: !1
    }
  } : t.type === "character" && n.damageEffect !== "none" ? {
    damageEffect: n.damageEffect,
    stressAmount: n.stressAmount,
    action: {
      kind: "characterDamage",
      ...Di(Ts(t)),
      effect: n.damageEffect,
      stressAmount: n.stressAmount,
      sourceActorId: e,
      sourceName: n.ability.name,
      applied: !1
    }
  } : {} : {};
}
class Ep {
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
          ...Me(e),
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
        ...Me(e),
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
const Ip = async (n) => {
  const e = await new Roll(n).evaluate();
  if (e.total === null) throw new Error("The Artifact level roll did not produce a total.");
  return { total: e.total, chatRoll: e };
};
class Rp {
  #e;
  constructor(e = Ip) {
    this.#e = e;
  }
  canRollLevel(e) {
    return Pn(e.system) && Vi(e.system);
  }
  async rollLevel(e) {
    if (!Pn(e.system)) throw new Error("This Artifact is depleted.");
    if (!Vi(e.system)) throw new Error("This Artifact has a fixed Level.");
    const t = Xi(e.system), i = await this.#e(t);
    return await e.update({ "system.level": String(i.total) }), {
      itemId: e.id,
      itemName: e.name,
      formula: t,
      total: i.total,
      ...i.chatRoll === void 0 ? {} : { chatRoll: i.chatRoll }
    };
  }
}
function Np(n) {
  return game.i18n.localize(`MAGNUSARCHIVES.Pools.${n[0].toUpperCase()}${n.slice(1)}`);
}
function Mp(n) {
  const e = n._source?.system?.description;
  return typeof e == "string" ? e : "";
}
function Up(n) {
  const e = n.system;
  if (n.type === "equipment")
    return [
      { label: game.i18n.localize("MAGNUSARCHIVES.Inventory.Quantity"), value: Number(e.quantity ?? 1) },
      ...Number(e.level) > 0 ? [{ label: game.i18n.localize("MAGNUSARCHIVES.Inventory.Level"), value: Number(e.level) }] : [],
      ...e.equipped === !0 ? [{ label: game.i18n.localize("MAGNUSARCHIVES.Combat.Equipped"), value: game.i18n.localize("MAGNUSARCHIVES.Common.Yes") }] : []
    ];
  if (n.type === "cypher") {
    const t = tr(e.manifestation), i = ir(e.power);
    return [
      { label: game.i18n.localize("MAGNUSARCHIVES.Cypher.Manifestation.Label"), value: game.i18n.localize(`MAGNUSARCHIVES.Cypher.Manifestation.${t}`) },
      ...String(e.form ?? "").trim() ? [{ label: game.i18n.localize("MAGNUSARCHIVES.Cypher.Form"), value: String(e.form) }] : [],
      { label: game.i18n.localize("MAGNUSARCHIVES.Cypher.Power.Label"), value: game.i18n.localize(`MAGNUSARCHIVES.Cypher.Power.${i}`) },
      { label: game.i18n.localize("MAGNUSARCHIVES.Inventory.Level"), value: Aa(e) }
    ];
  }
  if (n.type === "artifact") {
    const t = e.depletion;
    return [
      { label: game.i18n.localize("MAGNUSARCHIVES.Inventory.Level"), value: Xi(e) },
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
    const t = n, i = Ke(t), a = Eo(t.system.cost.amount, i, Np, {
      pair: game.i18n.localize("MAGNUSARCHIVES.Ability.CostDisplay.Or"),
      middle: game.i18n.localize("MAGNUSARCHIVES.Ability.CostDisplay.Separator"),
      final: game.i18n.localize("MAGNUSARCHIVES.Ability.CostDisplay.FinalOr")
    }, t.system.cost.scalable === !0);
    return a ? [{ label: game.i18n.localize("MAGNUSARCHIVES.Ability.Cost"), value: a }] : [];
  }
  return [];
}
function Gp(n) {
  return Up(n).filter(
    ({ label: e, value: t }) => e.trim().length > 0 && (typeof t == "number" || t.trim().length > 0)
  );
}
class kp {
  async publish(e) {
    const t = e.system, i = Mp(e), a = i ? await foundry.applications.ux.TextEditor.implementation.enrichHTML(i, {
      async: !0,
      relativeTo: e
    }) : "", s = t.depletion, o = await foundry.applications.handlebars.renderTemplate(
      "systems/magnusarchives/templates/chat/item-card.hbs",
      {
        itemName: e.name,
        ...Me(e.actor),
        itemType: game.i18n.localize(`TYPES.Item.${e.type}`),
        properties: Gp(e),
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
        ...Me(e.actor),
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
class Hp {
  canUse(e) {
    return e.type === "character" && e.system.xp >= 1;
  }
  async spend(e, t) {
    if (L(e), !t) throw new Error("A Player Intrusion request ID is required.");
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
function $p(n) {
  return { actorName: n.actorName, xpSpent: n.xpSpent };
}
class Vp {
  async publish(e, t) {
    const i = await foundry.applications.handlebars.renderTemplate(
      "systems/magnusarchives/templates/chat/player-intrusion-card.hbs",
      {
        ...$p(e),
        ...Me(t)
      }
    );
    return await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: t }),
      content: i,
      flags: { magnusarchives: { playerIntrusion: e } }
    });
  }
}
function Dp(n) {
  const e = new dr(), t = new Nm(), i = new wm(), a = new Im(), s = new Bm(n), o = new jm(n), r = new Qm(n), l = new Pm(), u = new tp(), c = new np(), p = new sr(t), y = new dp(), m = new mr(), f = new fa(), g = new rp(
    n,
    s,
    o,
    r,
    t,
    e,
    u,
    c,
    p,
    m
  );
  return Object.freeze({
    conditions: e,
    wounds: t,
    recovery: new Em(i, a),
    rally: new Ac(t),
    rolls: s,
    rollChat: l,
    skills: o,
    intrusions: new Km(n),
    intrusionChat: new qc(),
    playerIntrusions: new Hp(),
    playerIntrusionChat: new Vp(),
    targets: r,
    combat: g,
    combatChat: new lp(l, p),
    abilities: new Cp(s, o, r, g),
    abilityChat: new Ep(l),
    shields: p,
    artifacts: new Rp(),
    itemChat: new kp(),
    genres: new Od(),
    weapons: m,
    depletion: y,
    depletionChat: new up(),
    combatStatuses: c,
    focusEvaluator: f,
    focusTrees: new Sp(f),
    focusAcquisition: new yd(f),
    advancement: new vd(n),
    focusAssociations: new Gd(),
    characterInitialization: new $d(),
    characterPackages: new wp()
  });
}
const Fp = {
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
class Tp {
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
function zp(n) {
  return n === !0 || n === "true" || n === "on";
}
async function Pp() {
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
      const u = l.element.querySelector('[name="mode"]'), c = l.element.querySelector('[data-intrusion-selection="single"]'), p = l.element.querySelector('[data-intrusion-selection="group"]'), y = () => {
        const m = u?.value === "group";
        c && (c.hidden = m), p && (p.hidden = !m);
      };
      u?.addEventListener("change", y), y();
    }
  });
  if (!a) return;
  const s = a.mode === "group" || a.mode === "free" ? a.mode : "targeted", o = s === "group" ? n.filter((r) => zp(a["group-" + r.id])).map((r) => r.id) : [String(a.targetActorId ?? "")];
  try {
    await ti().createManual({ mode: s, actorIds: o });
  } catch (r) {
    ui.notifications.error(r instanceof Error ? r.message : String(r));
  }
}
function In(n, e, t) {
  const i = t > lt, a = n.querySelector("[data-horror-summary]"), s = n.querySelector("[data-horror-explanation]"), o = n.querySelector("[data-horror-value]");
  n.dataset.horrorBand = Ro(t), n.style.setProperty("--magnusarchives-horror-fill", `${No(t)}%`), e.value = String(t), e.setAttribute("aria-valuetext", i ? `1–${t}` : "Natural 1"), o && (o.value = String(t)), a && (a.textContent = i ? game.i18n.format("MAGNUSARCHIVES.Horror.RangeSummary", { range: t }) : game.i18n.localize("MAGNUSARCHIVES.Horror.NormalSummary")), s && (s.textContent = i ? game.i18n.format("MAGNUSARCHIVES.Horror.Explanation", { range: t }) : game.i18n.localize("MAGNUSARCHIVES.Horror.NormalExplanation"));
}
async function xp() {
  if (!game.user.isGM) throw new Error(game.i18n.localize("MAGNUSARCHIVES.Horror.Errors.GMOnly"));
  const n = kn(), e = `<div class="magnusarchives magnusarchives-dialog magnusarchives-horror-dialog" data-horror-dialog data-horror-band="${Ro(n)}" style="--magnusarchives-horror-fill: ${No(n)}%">
    <header class="magnusarchives-dialog-heading">
      <span>${game.i18n.localize("MAGNUSARCHIVES.Horror.Title")}</span>
      <strong data-horror-summary></strong>
    </header>
    <section class="magnusarchives-dialog-section">
      <div class="horror-range-control">
        <input class="horror-range-input" id="magnusarchives-horror-intrusion-range" name="horrorIntrusionRange" type="range" min="${lt}" max="${ei}" step="1" value="${n}" aria-label="${game.i18n.localize("MAGNUSARCHIVES.Horror.RangeLabel")}">
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
      !a || !s || (In(a, s, n), s.addEventListener("input", () => {
        In(a, s, Number(s.value));
      }), s.addEventListener("change", () => {
        yc(Number(s.value)).catch((o) => {
          ui.notifications.error(o instanceof Error ? o.message : String(o)), In(a, s, kn());
        });
      }));
    }
  });
}
function qp() {
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
        Pp();
      }
    }, t.magnusarchivesHorrorMode = {
      name: "magnusarchivesHorrorMode",
      title: "MAGNUSARCHIVES.Horror.SceneControl",
      icon: "fa-solid fa-skull",
      order: i + 1,
      button: !0,
      visible: game.user.isGM,
      onChange: () => {
        xp();
      }
    };
  });
}
const fr = `system.${G}`;
function Fi(n) {
  return game.user.isGM || n.testUserPermission(game.user, CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER);
}
function jn(n) {
  (n.tokenId || n.tokenUuid) && ui.notifications.error(game.i18n.localize("MAGNUSARCHIVES.Combat.Errors.OriginalTokenMissing"));
}
function gr(n) {
  return {
    actorId: n.targetActorId,
    ...n.targetActorUuid ? { actorUuid: n.targetActorUuid } : {},
    ...n.targetTokenId ? { tokenId: n.targetTokenId } : {},
    ...n.targetTokenUuid ? { tokenUuid: n.targetTokenUuid } : {}
  };
}
function hr(n) {
  return {
    actorId: n.targetActorId,
    ...n.targetActorUuid ? { actorUuid: n.targetActorUuid } : {},
    ...n.targetTokenId ? { tokenId: n.targetTokenId } : {},
    ...n.targetTokenUuid ? { tokenUuid: n.targetTokenUuid } : {}
  };
}
function Op(n) {
  return {
    actorId: n.sourceActorId,
    ...n.sourceActorUuid ? { actorUuid: n.sourceActorUuid } : {},
    ...n.sourceTokenId ? { tokenId: n.sourceTokenId } : {},
    ...n.sourceTokenUuid ? { tokenUuid: n.sourceTokenUuid } : {}
  };
}
function yr(n) {
  const e = n.getFlag(G, "combatAction");
  if (!e || typeof e != "object") return null;
  const t = e;
  return t.kind !== "npcDamage" && t.kind !== "characterDamage" && t.kind !== "shieldWound" || typeof t.targetActorId != "string" || typeof t.applied != "boolean" ? null : e;
}
function Sr(n) {
  const e = n.getFlag(G, "defenseRequest");
  if (!e || typeof e != "object") return null;
  const t = e;
  return t.kind !== "defenseRequest" || typeof t.sourceActorId != "string" || typeof t.targetActorId != "string" ? null : e;
}
async function Bp(n, e) {
  const t = yr(n);
  if (!t || t.applied) return;
  const i = gr(t), a = await $n(i);
  if (!a) {
    jn(i);
    return;
  }
  if (!Fi(a)) return;
  const s = Yt(a, i);
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
    await n.setFlag(G, "combatAction", { ...t, applied: !0 }), e.textContent = game.i18n.localize("MAGNUSARCHIVES.Combat.Applied");
  } catch (o) {
    e.disabled = !1, ui.notifications.error(o instanceof Error ? o.message : String(o));
  }
}
async function Lp(n, e, t, i) {
  if (e.resolved || !e.allowedDefenses.includes(t)) return;
  const a = hr(e), s = Op(e), o = await $n(a), r = await $n(s);
  if (!o || !r) {
    o || jn(a), r || jn(s);
    return;
  }
  if (!Fi(o)) return;
  if (i.disabled = !0, !await Vn(
    Yt(o, a),
    t,
    {
      source: Yt(r, s),
      effect: e.effect,
      stressAmount: e.stressAmount
    }
  )) {
    i.disabled = !1;
    return;
  }
  game.socket.emit(fr, { type: "resolveDefenseRequest", messageId: n.id }), game.user.isGM && await n.setFlag(G, "defenseRequest", { ...e, resolved: !0 });
}
function jp(n, e) {
  const t = yr(n), i = e.querySelector("[data-action='applyCombatOutcome']");
  if (i) {
    const r = t ? Hn(gr(t)) : null;
    !t || !r || !Fi(r) ? i.remove() : t.applied ? (i.disabled = !0, i.textContent = game.i18n.localize("MAGNUSARCHIVES.Combat.Applied")) : i.addEventListener("click", () => {
      Bp(n, i);
    }, { once: !0 });
  }
  const a = Sr(n), s = [...e.querySelectorAll("[data-action='rollRequestedDefense']")];
  if (s.length === 0) return;
  const o = a ? Hn(hr(a)) : null;
  if (!a || !o || !Fi(o) || a.resolved) {
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
        Lp(n, a, l, r);
      },
      { once: !0 }
    );
  }
}
function Wp() {
  Hooks.on("renderChatMessageHTML", (n, e) => {
    jp(n, e);
  }), game.socket.on(fr, (n) => {
    if (!game.user.isGM || n.type !== "resolveDefenseRequest") return;
    const e = game.messages.get(n.messageId);
    if (!e) return;
    const t = Sr(e);
    !t || t.resolved || e.setFlag(G, "defenseRequest", { ...t, resolved: !0 });
  });
}
function _p(n) {
  return n.actor ? n.actor.testUserPermission(game.user, CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER) : game.user.isGM;
}
function Kp() {
  Hooks.on("renderChatMessageHTML", (n, e) => {
    for (const t of e.querySelectorAll("[data-action='rollItemCardDepletion']"))
      t.addEventListener("click", async (i) => {
        i.preventDefault(), i.stopPropagation();
        const a = t.dataset.itemUuid, s = a ? await fromUuid(a) : null;
        if (!s || s.type !== "artifact" || !_p(s)) {
          ui.notifications.warn(game.i18n.localize("MAGNUSARCHIVES.Inventory.NotAuthorized"));
          return;
        }
        t.disabled = !0, await $i(s), t.disabled = s.system.depleted === !0;
      });
  });
}
async function Xp() {
  if (!game.user.isGM) return;
  const n = [...game.items].filter((e) => e.type === "genre");
  if (n.length)
    for (const e of game.actors)
      try {
        if (e.type !== "character") continue;
        const t = e, i = [...e.items].find((s) => s.type === "characterType");
        if (!i || t.system.genre.sourceUuid) continue;
        const a = await Xo(
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
class Yp {
  #e = /* @__PURE__ */ new Set();
  constructor(e = []) {
    for (const t of e) this.#e.add(t.id);
  }
  mark(e, t) {
    const i = t.querySelector(".magnusarchives-roll-card[data-magnusarchives-entrance]");
    return !i || this.#e.has(e.id) ? !1 : (this.#e.add(e.id), i.classList.add("magnusarchives-chat-card-enter"), !0);
  }
}
function Jp() {
  const n = new Yp(game.messages);
  return Hooks.on("renderChatMessageHTML", (e, t) => {
    n.mark(e, t);
  }), n;
}
const Ti = "doneThisRound";
function Ar(n, e) {
  return !!(e && (n.isGM || e.testUserPermission(n, "OWNER")));
}
function Qp(n, e) {
  return e > 0 && n?.getFlag(G, Ti) === e;
}
async function Zp(n, e, t) {
  if (!n.started) return { ok: !1, reason: "not-started" };
  if (!n.turns.length) return { ok: !1, reason: "empty" };
  const i = n.combatant;
  return n.turn === null || !i ? { ok: !1, reason: "no-current" } : i.id !== t ? { ok: !1, reason: "stale" } : Ar(e, i) ? (await i.setFlag(G, Ti, n.round), await n.nextTurn(), { ok: !0 }) : { ok: !1, reason: "not-authorized" };
}
async function ef(n) {
  const e = Array.from(n.combatants).filter((t) => t.getFlag(G, Ti) !== void 0).map((t) => ({
    _id: t.id,
    [`flags.${G}.-=${Ti}`]: null
  }));
  e.length && await n.updateEmbeddedDocuments("Combatant", e, { turnEvents: !1 });
}
function tf(n, e, t, i) {
  if (!n.includes(e)) return [...n];
  const a = n.filter((o) => o !== e);
  if (!t) return [...a, e];
  const s = a.indexOf(t);
  return s < 0 ? [...n] : (a.splice(s + (i ? 1 : 0), 0, e), a);
}
function nf(n) {
  return n.map((e, t) => ({
    _id: e,
    initiative: (n.length - t) * 10
  }));
}
const af = foundry.applications.sidebar.tabs.CombatTracker, xs = "application/x-magnusarchives-combatant";
function Rn(n) {
  return n?.dataset.combatantId ?? null;
}
class wa extends af {
  static DEFAULT_OPTIONS = {
    classes: ["magnusarchives-combat-tracker"],
    actions: {
      endCypherTurn: wa.#e
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
    const i = this.viewed, a = Rn(t.closest("[data-combatant-id]"));
    if (!i || !a) {
      ui.notifications.warn(game.i18n.localize("MAGNUSARCHIVES.CombatTracker.Errors.NoCombat"));
      return;
    }
    t.setAttribute("disabled", "");
    try {
      const s = await Zp(i, game.user, a);
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
      a.doneThisRound = Qp(s, i?.round ?? 0), a.canEndTurn = !!(i?.started && a.active && !a.doneThisRound && Ar(game.user, s));
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
    const t = e.currentTarget?.closest("[data-combatant-id]") ?? null, i = Rn(t);
    i && (e.dataTransfer.effectAllowed = "move", e.dataTransfer.setData(xs, i), e.dataTransfer.setData("text/plain", i), t?.classList.add("magnusarchives-combatant-dragging"));
  }
  #i(e) {
    !game.user.isGM || !e.dataTransfer || (e.preventDefault(), e.dataTransfer.dropEffect = "move");
  }
  async #n(e) {
    if (e.preventDefault(), !game.user.isGM || !e.dataTransfer) return;
    const t = this.viewed, i = e.dataTransfer.getData(xs) || e.dataTransfer.getData("text/plain");
    if (!t || !i || !t.combatants.get(i)) return;
    const a = e.target?.closest(".combatant[data-combatant-id]") ?? null, s = Rn(a), o = a?.getBoundingClientRect(), r = !!(o && e.clientY > o.top + o.height / 2), l = t.turns.map((y) => y.id), u = tf(l, i, s, r);
    if (u.every((y, m) => y === l[m])) {
      this.#a();
      return;
    }
    const c = t.combatant?.id, p = c ? u.indexOf(c) : void 0;
    await t.updateEmbeddedDocuments(
      "Combatant",
      nf(u),
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
function sf() {
  CONFIG.ui.combat = wa;
}
function of() {
  Hooks.on("updateCombat", (n, e) => {
    !("round" in e) || !game.user.isActiveGM || ef(n).catch((t) => {
      console.error("magnusarchives | Failed to reset Combat Tracker DONE states", t);
    });
  });
}
const rf = CONFIG.ui.pause;
class lf extends rf {
  static DEFAULT_OPTIONS = {
    classes: ["magnusarchives-game-pause"]
  };
  async _prepareContext(e) {
    return {
      ...await super._prepareContext(e),
      icon: na.gamePaused,
      spin: !1
    };
  }
}
function cf() {
  CONFIG.ui.pause = lf;
}
function df() {
  CONFIG.Combat.fallbackTurnMarker = na.turnMarker;
}
const uf = "--magnusarchives-blank-canvas-background-image";
function mf(n) {
  return `url("${n.replaceAll("\\", "\\\\").replaceAll('"', '\\"').replace(/[\n\r\f;]/g, "")}")`;
}
function pf(n = document.body, e = (t) => foundry.utils.getRoute(t)) {
  const t = So(na.lobby, e);
  n.style.setProperty(uf, mf(t));
}
const br = ["system.options.totalEffortCapMode"];
function ff(n = CONFIG.Item.compendiumIndexFields) {
  for (const e of br)
    n.includes(e) || n.push(e);
}
function qs(n) {
  const e = n.split(".");
  return e.length >= 5 && e[0] === "Compendium" && e[3] === "Item" ? `${e[1]}.${e[2]}` : null;
}
async function gf(n = game.actors, e = game.packs, t = (i, a) => console.warn(i, a)) {
  const i = [...n].filter((s) => s.type === "character" && qs(s.system.genre.sourceUuid) !== null), a = new Set(i.map((s) => qs(s.system.genre.sourceUuid)));
  for (const s of a)
    try {
      await e.get(s)?.getIndex({ fields: [...br] });
    } catch (o) {
      t(`magnusarchives | Could not enrich Genre Compendium index ${s}`, o);
    }
  for (const s of i) s.reset();
}
Hooks.once("init", async () => {
  console.info(`${G} | Initializing`);
  const n = new Am();
  gm(n);
  const e = new Tp();
  e.register(Fp), ff(), game.magnusarchives = Vr(n, Dp(n), e), fc(), sc(), cm(), sf(), cf(), df(), qp(), Hooks.callAll("magnusarchives.registerRules", n), Hooks.callAll("magnusarchives.registerThemes", e), hc(e), await foundry.applications.handlebars.loadTemplates([
    "systems/magnusarchives/templates/focus/focus-tree.hbs"
  ]);
});
Hooks.once("ready", async () => {
  pf();
  const n = String(game.settings.get(G, O.theme));
  game.magnusarchives.themes.apply(game.magnusarchives.themes.has(n) ? n : "core"), jc(
    game.magnusarchives.services.intrusions,
    game.magnusarchives.services.intrusionChat
  ), zu(
    game.magnusarchives.services.playerIntrusions,
    game.magnusarchives.services.playerIntrusionChat
  ), Wp(), Kp(), Jp(), sp(game.magnusarchives.services.combatStatuses), of(), await gf(), await Xp(), console.info(`${G} | Ready`);
});
//# sourceMappingURL=magnusarchives.mjs.map
