import type { Camo, ModeRequirement, WeaponCategoryId } from "./schema";
import { LAUNCH_WEAPON_COUNT, WEAPONS, v } from "./weapons";

const mp = (text: string, target: number | null): ModeRequirement => ({ mode: "mp", text, target });
const dmz = (text: string, target: number | null): ModeRequirement => ({ mode: "dmz", text, target });

// ─── Military ────────────────────────────────────────────────────────────────
/** Han 86 military unlock levels — the only weapon with a published breakdown. */
const MILITARY_LEVELS: Record<string, number[]> = {
  "han-86": [10, 18, 25, 34, 42, 50, 57, 65],
};

// ─── Special (3 per weapon) ──────────────────────────────────────────────────
type SpecialRow = { name: string; level: number | null; reqs: ModeRequirement[]; src: string[]; note?: string };
const SPECIALS: Record<string, (SpecialRow | null)[]> = {
  "han-86": [
    { name: "Smoke", level: 25, reqs: [mp("20 kills while mounted", 20), dmz("75 kills while mounted", 75)], src: ["gamerfuzion-camos", "wzl-camos"] },
    { name: "Stormwave", level: 46, reqs: [mp("50 kills with a silencer", 50), dmz("125 kills with a silencer", 125)], src: ["gamerfuzion-camos", "wzl-camos"] },
    { name: "Red", level: 72, reqs: [mp("3 kills without dying, 15 times", 15), dmz("3 kills without taking damage, 50 times", 50)], src: ["gamerfuzion-camos", "wzl-camos"],
      note: "GamerFuzion's wording is ambiguous on the MP count; warzoneloadout lists 15×. Confirm in-game." },
  ],
  "sang-9mm": [
    { name: "Autumn", level: 13, reqs: [mp("25 kills while aiming down sights", 25), dmz("75 kills while aiming down sights", 75)], src: ["gamerfuzion-camos", "codmunity-tracker"] },
    { name: "Snakeskin", level: 25, reqs: [mp("3 kills without dying, 5 times", 5), dmz("3 kills without taking damage, 15 times", 15)], src: ["gamerfuzion-camos", "codmunity-tracker"] },
    { name: "Space Time", level: 38, reqs: [mp("50 kills while using akimbo", 50), dmz("125 kills while using akimbo", 125)], src: ["gamerfuzion-camos", "codmunity-tracker"] },
  ],
  "kg-7-vulcan": [
    { name: "Treeline", level: null, reqs: [mp("10 hipfire kills", 10), dmz("25 hipfire kills", 25)], src: ["codmunity-tracker"] },
    { name: "Spidersilk", level: null, reqs: [mp("20 headshot kills", 20), dmz("75 headshot kills", 75)], src: ["codmunity-tracker"] },
    { name: "Tension", level: null, reqs: [mp("2 kills without taking damage, 20 times", 20), dmz("2 kills without taking damage, 30 times", 30)], src: ["codmunity-tracker"] },
  ],
  "rezi-12": [
    { name: "Struck Oil", level: null, reqs: [mp("20 point-blank kills", 20), dmz("75 point-blank kills", 75)], src: ["codmunity-tracker", "codmunity-guide"] },
    { name: "Brushstroke", level: null, reqs: [mp("10 longshot kills", 10), dmz("50 longshot kills", 50)], src: ["codmunity-tracker"] },
    { name: "White Pine", level: null, reqs: [mp("40 kills while jumping", 40), dmz("100 kills while jumping", 100)], src: ["codmunity-tracker"] },
  ],
  "iso-nightshade": [
    { name: "Asphalt", level: null, reqs: [mp("50 kills while aiming down sights", 50), dmz("125 kills while aiming down sights", 125)], src: ["codmunity-tracker", "codmunity-guide"] },
    { name: "Black Topo", level: null, reqs: [mp("10 double kills", 10), dmz("30 double kills", 30)], src: ["codmunity-tracker"] },
    { name: "Brown", level: null, reqs: [mp("3 kills without dying, 15 times", 15), dmz("3 kills without taking damage, 50 times", 50)], src: ["codmunity-tracker"] },
  ],
  "finn-lmg": [
    { name: "Desert Tactics", level: null, reqs: [mp("20 point-blank kills", 20), dmz("75 point-blank kills", 75)], src: ["codmunity-tracker", "codmunity-guide"] },
    { name: "Green Tiger", level: null, reqs: [mp("2 kills without reloading, 10 times", 10), dmz("2 kills without reloading, 30 times", 30)], src: ["codmunity-tracker"] },
    { name: "Thunderhead", level: null, reqs: [mp("30 longshot kills", 30), dmz("100 longshot kills", 100)], src: ["codmunity-tracker"] },
  ],
  "mar-9": [
    { name: "Mangrove", level: null, reqs: [mp("20 kills while mounted", 20), dmz("75 kills while mounted", 75)], src: ["codmunity-tracker"] },
    { name: "Fungal Grid", level: null, reqs: [mp("25 kills while crouched", 25), dmz("75 kills while crouched", 75)], src: ["codmunity-tracker"] },
    { name: "White", level: null, reqs: [mp("30 longshot kills", 30), dmz("100 longshot kills", 100)], src: ["codmunity-tracker"] },
  ],
  m4: [
    { name: "Myriad", level: null, reqs: [mp("20 point-blank kills", 20), dmz("75 point-blank kills", 75)], src: ["codmunity-guide"],
      note: "Only one of the M4's three Special camos is published; its slot order is not confirmed." },
    null,
    null,
  ],
};

// ─── Completionist, by weapon class (CODMunity guide) ────────────────────────
type ClassRule = { platinum: ModeRequirement[]; harmonic: ModeRequirement[]; note?: string };
const CLASS_RULES: Record<WeaponCategoryId, ClassRule> = {
  "assault-rifle": { platinum: [mp("50 headshots", 50), dmz("100 headshots", 100)], harmonic: [mp("25 double kills", 25), dmz("50 double kills", 50)] },
  "sniper-rifle": { platinum: [mp("75 kills while prone", 75), dmz("150 kills while prone", 150)], harmonic: [mp("75 one-shot kills", 75), dmz("150 one-shot kills", 150)],
    note: "CODMunity also lists 200 for the DMZ counts; confirm in-game." },
  shotgun: { platinum: [mp("50 hipfire kills", 50), dmz("125 hipfire kills", 125)], harmonic: [mp("2 kills without reloading, 25 times", 25), dmz("2 kills without reloading, 50 times", 50)] },
  lmg: { platinum: [mp("3 kills without dying, 15 times", 15), dmz("3 kills without taking damage, 50 times", 50)], harmonic: [mp("2 kills without releasing the trigger, 25 times", 25), dmz("2 kills without releasing the trigger, 75 times", 75)] },
  "marksman-rifle": { platinum: [mp("75 kills while prone", 75), dmz("150 kills while prone", 150)], harmonic: [mp("75 one-shot kills", 75), dmz("150 one-shot kills", 150)] },
  pistol: { platinum: [mp("20 kills from behind", 20), dmz("75 kills from behind", 75)], harmonic: [mp("40 hipfire kills", 40), dmz("100 hipfire kills", 100)] },
  smg: { platinum: [mp("25 kills from behind", 25), dmz("75 kills from behind", 75)], harmonic: [mp("50 hipfire kills", 50), dmz("100 hipfire kills", 100)] },
  launcher: { platinum: [mp("2 kills without taking damage, 15 times", 15), dmz("2 kills without taking damage, 50 times", 50)], harmonic: [mp("10 kills in a match, 7 times", 7), dmz("10 kills in a match, 15 times", 15)] },
  melee: { platinum: [mp("3 kills without dying, 15 times", 15), dmz("3 kills without taking damage, 50 times", 50)], harmonic: [mp("25 kills from behind", 25), dmz("75 kills from behind", 75)] },
};

export const DIVERGENCE_ID = "account:divergence";
const DIVERGENCE_COUNT = 33;

function buildWeaponCamos(): Camo[] {
  const out: Camo[] = [];
  for (const w of WEAPONS) {
    const s1 = w.season > 0;
    const seasonNote = s1 ? "Season 1 weapon — assumes the same camo structure as launch weapons; not yet confirmed." : undefined;

    // Military 1–8
    const lv = MILITARY_LEVELS[w.id];
    for (let i = 1; i <= 8; i++) {
      const level = lv?.[i - 1] ?? null;
      const strigaFirst = w.id === "wz55-striga" && i === 1;
      out.push({
        id: `${w.id}:military:${i}`,
        name: `Military Camo ${i}`,
        slotLabel: `Military ${i}`,
        group: "military",
        order: i,
        weaponId: w.id,
        requirements: level
          ? [{ mode: "any", text: `Reach weapon level ${level}`, target: null }]
          : strigaFirst
            ? [{ mode: "any", text: "Earn weapon unlocks (in-game text read “Earn 11 more weapon unlocks”)", target: null }]
            : [],
        requiredLevel: level,
        prereqs: level ? [{ kind: "weapon-level", weaponId: w.id, level }] : [],
        autoFromLevel: level !== null,
        verification: strigaFirst
          ? v("in-game", ["user-screens"])
          : level
            ? v("community", ["gamerfuzion-camos"])
            : v(s1 ? "unconfirmed" : i === 1 ? "in-game" : "community", i === 1 ? ["user-screens"] : ["wzl-camos"],
                level === null ? `Name pattern confirmed (“MILITARY CAMO 1” shown in-game). Unlock level for this weapon not yet published.${seasonNote ? " " + seasonNote : ""}` : undefined),
      });
    }

    // Special 1–3
    const specials = SPECIALS[w.id] ?? [null, null, null];
    specials.forEach((s, idx) => {
      const n = idx + 1;
      out.push({
        id: `${w.id}:special:${n}`,
        name: s?.name ?? null,
        slotLabel: `Special ${n}`,
        group: "special",
        order: n,
        weaponId: w.id,
        requirements: s?.reqs ?? [],
        requiredLevel: s?.level ?? null,
        prereqs: s?.level ? [{ kind: "weapon-level", weaponId: w.id, level: s.level }] : [],
        autoFromLevel: false,
        verification: s ? v("community", s.src, s.note) : v("unconfirmed", [], `Camo name and challenge for this slot not yet published — check the in-game Gunsmith.${seasonNote ? " " + seasonNote : ""}`),
      });
    });

    // Completionist: Gold, Platinum, Harmonic Break (Divergence is account-wide, added below)
    const rule = CLASS_RULES[w.category];
    const ownMilSpec = [
      ...Array.from({ length: 8 }, (_, i) => ({ kind: "camo" as const, camoId: `${w.id}:military:${i + 1}` })),
      ...[1, 2, 3].map((n) => ({ kind: "camo" as const, camoId: `${w.id}:special:${n}` })),
    ];
    out.push({
      id: `${w.id}:gold`,
      name: "Gold",
      slotLabel: "Completionist 1",
      group: "completionist",
      order: 1,
      weaponId: w.id,
      requirements: [mp("15 kills in a single match", 15), dmz(w.category === "launcher" ? "50 kills in a single match" : "100 kills in a single match", w.category === "launcher" ? 50 : 100)],
      requiredLevel: null,
      prereqs: ownMilSpec,
      autoFromLevel: false,
      verification: v("community", ["codmunity-guide", "gamerfuzion-camos"], "Requires every Military and Special camo on this weapon." + (seasonNote ? " " + seasonNote : "")),
    });
    const classGolds = WEAPONS.filter((x) => x.category === w.category && x.season === 0).map((x) => ({ kind: "camo" as const, camoId: `${x.id}:gold` }));
    out.push({
      id: `${w.id}:platinum`,
      name: "Platinum",
      slotLabel: "Completionist 2",
      group: "completionist",
      order: 2,
      weaponId: w.id,
      requirements: rule.platinum,
      requiredLevel: null,
      prereqs: [{ kind: "camo", camoId: `${w.id}:gold` }, ...classGolds],
      autoFromLevel: false,
      verification: v("community", ["codmunity-guide", "gamerfuzion-camos"],
        "Requires Gold on every launch weapon in this class (whether seasonal weapons are required isn't confirmed)." + (rule.note ? " " + rule.note : "")),
    });
    out.push({
      id: `${w.id}:harmonic-break`,
      name: "Harmonic Break",
      slotLabel: "Completionist 3",
      group: "completionist",
      order: 3,
      weaponId: w.id,
      requirements: rule.harmonic,
      requiredLevel: null,
      prereqs: [{ kind: "camo", camoId: `${w.id}:platinum` }],
      autoFromLevel: false,
      verification: v("community", ["codmunity-guide", "gamerfuzion-camos"],
        "Sources say “complete all Platinum challenges” — tracked here as requiring this weapon's Platinum. Confirm whether the whole class is required." + (rule.note ? " " + rule.note : "")),
    });

    // Weapon Prestige: Pyroclast evolution
    const pyroNote = "Weapon Prestige 1 resets the weapon to level 1 and relocks attachments (except Apex and blueprint attachments). Reaching max level in Prestige 1 enters Prestige Master.";
    const pyro: [string, string, Camo["prereqs"], string, string[], string?][] = [
      ["pyroclast", "Pyroclast", [{ kind: "weapon-prestige", weaponId: w.id, stage: "p1" }], "Enter Weapon Prestige 1", ["gamerfuzion-camos", "codmunity-guide"]],
      ["pyroclast-terminus", "Pyroclast Terminus", [{ kind: "weapon-prestige", weaponId: w.id, stage: "p1-max" }], "Reach max level in Weapon Prestige 1", ["gamerfuzion-camos", "codmunity-guide"]],
      ["pyroclast-scatter", "Pyroclast Scatter", [{ kind: "weapon-master-level", weaponId: w.id, level: 160 }], "Reach Weapon Prestige Master level 160 (one source says 150)", ["gamerfuzion-camos", "codmunity-guide"],
        "Sources conflict: CODMunity says level 160, GamerFuzion says 150. Auto-detection uses 160; you can tick it manually."],
      ["pyroclast-cascade", "Pyroclast Cascade", [{ kind: "weapon-master-level", weaponId: w.id, level: 250 }], "Reach Weapon Prestige Master level 250", ["gamerfuzion-camos", "codmunity-guide"]],
    ];
    pyro.forEach(([key, name, prereqs, text, src, note], i) => {
      out.push({
        id: `${w.id}:${key}`,
        name,
        slotLabel: `Prestige ${i + 1}`,
        group: "prestige",
        order: i + 1,
        weaponId: w.id,
        requirements: [{ mode: "any", text, target: null }],
        requiredLevel: null,
        prereqs,
        autoFromLevel: true,
        verification: v("community", src, [note, i === 0 ? pyroNote : undefined, seasonNote].filter(Boolean).join(" ") || undefined),
      });
    });
  }
  return out;
}

function buildAccountCamos(): Camo[] {
  const masteryNote = "Account-wide; equippable on any weapon. Each tier unlocks after the previous one.";
  return [
    {
      id: DIVERGENCE_ID,
      name: "Divergence",
      slotLabel: "Completionist 4",
      group: "completionist",
      order: 4,
      weaponId: null,
      requirements: [{ mode: "any", text: `Complete ${DIVERGENCE_COUNT} Harmonic Break camo challenges`, target: DIVERGENCE_COUNT }],
      requiredLevel: null,
      prereqs: [{ kind: "camo-count", camoSuffix: ":harmonic-break", count: DIVERGENCE_COUNT }],
      autoFromLevel: true,
      verification: v("community", ["codmunity-guide", "gamerfuzion-camos"],
        `Account-wide (earned once). ${DIVERGENCE_COUNT} matches the launch roster of ${LAUNCH_WEAPON_COUNT} weapons. Shown as the 4th Completionist slot on every weapon, matching the in-game [0/4] counter.`),
    },
    ...([
      ["mp", 1, "Mercurial Drift", "10 kills in a match, 250 times", 250],
      ["mp", 2, "Polyatomic Reforged", "3 kills without taking damage, 300 times", 300],
      ["mp", 3, "Orion Reforged", "5 kills without dying, 500 times", 500],
      ["dmz", 1, "Chiral", "2,500 Tier 3+ enemy kills", 2500],
      ["dmz", 2, "Ripple Tide", "Exfil with 2 LT dog tags in a single deployment, 50 times", 50],
      ["dmz", 3, "Helio", "25,000 kills with Legendary weapons on a Max Level Operator", 25000],
    ] as const).map(([mode, tier, name, text, target]): Camo => ({
      id: `mastery:${mode}:${tier}`,
      name,
      slotLabel: `${mode === "mp" ? "MP" : "DMZ"} Mastery ${tier}`,
      group: "mastery",
      order: tier,
      weaponId: null,
      requirements: [{ mode, text, target }],
      requiredLevel: null,
      prereqs: [{ kind: "camo", camoId: tier === 1 ? DIVERGENCE_ID : `mastery:${mode}:${tier - 1}` }],
      autoFromLevel: false,
      verification: v("community", ["codmunity-guide", "gamerfuzion-camos"], masteryNote),
    })),
    ...(["Parallax", "Damascus Reforged", "Empyros"] as const).map((name, i): Camo => ({
      id: `mastery:wz:${i + 1}`,
      name,
      slotLabel: `Warzone Mastery ${i + 1}`,
      group: "mastery",
      order: i + 1,
      weaponId: null,
      requirements: [],
      requiredLevel: null,
      prereqs: [{ kind: "camo", camoId: i === 0 ? DIVERGENCE_ID : `mastery:wz:${i}` }],
      autoFromLevel: false,
      verification: v("unconfirmed", ["gamerfuzion-camos"], "Single source; requirements listed as classified until Warzone integration in Season 1."),
    })),
  ];
}

export const CAMOS: Camo[] = [...buildWeaponCamos(), ...buildAccountCamos()];
