import { describe, expect, it } from "vitest";
import { CATALOG, camoById } from "@/data";
import { FIELD_UPGRADES, KILLSTREAKS, LETHALS, LOADOUT, OPERATORS, PERKS, TACTICALS } from "@/data/loadout";
import { prerequisiteSteps } from "@/lib/howto";
import { search, staticIndex } from "@/lib/search";
import { byLevel, levelUnlocks } from "@/lib/unlocks";

describe("equipment, perks, killstreaks, operators (official launch post)", () => {
  it("has the official counts", () => {
    expect([TACTICALS.length, LETHALS.length, FIELD_UPGRADES.length, PERKS.length, KILLSTREAKS.length]).toEqual([9, 11, 12, 18, 17]);
    expect(OPERATORS).toHaveLength(33);
    expect(PERKS.filter((p) => p.slot === "Perk 1")).toHaveLength(6);
  });
  it("matches spot-checked official unlock levels", () => {
    const lvl = (n: string) => LOADOUT.find((g) => g.name === n)?.level;
    expect(lvl("Snapshot Grenade")).toBe(10);
    expect(lvl("Drill Charge")).toBe(7);
    expect(lvl("Portable Radar")).toBe(4);
    expect(lvl("Air Lockdown")).toBe(55);
    expect(lvl("Cold-Blooded")).toBe(36);
    expect(lvl("Tracker")).toBe(32);
  });
  it("never invents descriptions: unsourced items have none", () => {
    expect(PERKS.every((p) => p.summary === null)).toBe(true);
    expect(KILLSTREAKS.every((k) => k.summary === null)).toBe(true);
  });
  it("uses unique ids", () => {
    const ids = [...LOADOUT, ...OPERATORS].map((x) => x.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("level unlock path", () => {
  const all = levelUnlocks();
  it("covers every launch weapon and every gear item, within levels 1–55", () => {
    expect(all.filter((u) => u.kind === "weapon")).toHaveLength(33);
    expect(all.filter((u) => u.kind !== "weapon" && u.kind !== "feature")).toHaveLength(LOADOUT.length);
    expect(all.every((u) => u.level >= 1 && u.level <= 55)).toBe(true);
  });
  it("puts the screenshot loadout items at the right levels", () => {
    const at = byLevel(all);
    const names = (l: number) => (at.get(l) ?? []).map((u) => u.name);
    expect(names(4)).toEqual(expect.arrayContaining(["Han 86", "Create-a-Class", "Portable Radar"]));
    expect(names(7)).toEqual(expect.arrayContaining(["Krait P68", "Drill Charge"]));
    expect(names(10)).toContain("Snapshot Grenade");
    expect(names(55)).toEqual(expect.arrayContaining(["Cronen Squall", "Air Lockdown"]));
  });
  it("flags the six weapons Activision lists at two levels, with the other value", () => {
    const disputed = all.filter((u) => u.altLevel);
    expect(disputed.map((u) => [u.name, u.level, u.altLevel]).sort()).toEqual(
      [["Astaroth .57", 25, 10], ["PPSh-41", 30, 27], ["Signal 50", 50, 35], ["VEL 46", 5, 13], ["Wz.55 Striga", 18, 21], ["X-58 Nyx", 46, 34]].sort(),
    );
  });
});

describe("how to unlock", () => {
  it("explains level-gated Special camos", () => {
    expect(prerequisiteSteps(camoById.get("han-86:special:1")!)).toEqual(["Reach Han 86 weapon level 25"]);
  });
  it("summarises Gold and Platinum prerequisites in plain language", () => {
    expect(prerequisiteSteps(camoById.get("han-86:gold")!)).toEqual(["Unlock all 8 Military and all 3 Special camos on this weapon"]);
    expect(prerequisiteSteps(camoById.get("han-86:platinum")!)).toEqual(["Unlock Gold on this weapon and on all 8 launch Assault Rifles"]);
  });
  it("chains Harmonic Break, Divergence and Mastery", () => {
    expect(prerequisiteSteps(camoById.get("han-86:harmonic-break")!)).toEqual(["Unlock Platinum — Han 86"]);
    expect(prerequisiteSteps(camoById.get("account:divergence")!)).toEqual(["Unlock 33 Harmonic Break camos (any weapons)"]);
    expect(prerequisiteSteps(camoById.get("mastery:mp:2")!)).toEqual(["Unlock Mercurial Drift"]);
  });
  it("describes Pyroclast stages via weapon prestige", () => {
    expect(prerequisiteSteps(camoById.get("han-86:pyroclast-terminus")!)[0]).toMatch(/max level in Weapon Prestige 1/);
  });
  it("produces a step list for every camo without throwing", () => {
    for (const c of CATALOG.camos) expect(Array.isArray(prerequisiteSteps(c))).toBe(true);
  });
});

describe("search", () => {
  const idx = staticIndex();
  it("finds weapons by partial and punctuation-free names", () => {
    expect(search("han", idx)[0]).toMatchObject({ kind: "weapon", href: "/weapons/han-86/" });
    expect(search("wz55", idx)[0].title).toBe("Wz.55 Striga");
  });
  it("finds camos, challenges, attachments, gear, operators and prestige", () => {
    expect(search("stormwave", idx)[0]).toMatchObject({ kind: "camo" });
    expect(search("mounted", idx).some((r) => r.kind === "challenge")).toBe(true);
    expect(search("skybreaker", idx)[0]).toMatchObject({ kind: "attachment" });
    expect(search("ghost", idx).some((r) => r.kind === "gear" && r.title === "Ghost")).toBe(true);
    expect(search("uav", idx)[0]).toMatchObject({ kind: "gear" });
    expect(search("price", idx).some((r) => r.kind === "operator")).toBe(true);
    expect(search("pyroclast cascade", idx)[0]).toMatchObject({ kind: "prestige" });
  });
});

import { camoVideoUrl, weaponVideoUrl } from "@/lib/watch";
describe("see it in game links", () => {
  it("build YouTube searches for the exact weapon and camo", () => {
    const w = CATALOG.weapons.find((x) => x.id === "wz55-striga")!;
    expect(weaponVideoUrl(w)).toBe("https://www.youtube.com/results?search_query=Modern%20Warfare%204%20Wz.55%20Striga%20gunsmith");
    expect(decodeURIComponent(camoVideoUrl(camoById.get("han-86:special:2")!))).toContain("Modern Warfare 4 Han 86 Stormwave camo");
    expect(decodeURIComponent(camoVideoUrl(camoById.get("mastery:mp:1")!))).toContain("Mercurial Drift mastery camo");
  });
});
