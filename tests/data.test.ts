import { describe, expect, it } from "vitest";
import { CATALOG, camoById } from "@/data";

describe("game database integrity", () => {
  it("has the 33-weapon launch roster plus 4 Season 1 weapons", () => {
    expect(CATALOG.weapons.filter((w) => w.season === 0)).toHaveLength(33);
    expect(CATALOG.weapons.filter((w) => w.season === 1).map((w) => w.name).sort()).toEqual(["CSG-35", "Cronen Osprey", "JAK 12", "ZLR Talonhawk"]);
    const primaries = CATALOG.weapons.filter((w) => w.season === 0 && !["pistol", "launcher", "melee"].includes(w.category));
    expect(primaries).toHaveLength(24);
  });

  it("uses unique stable ids and slugs everywhere", () => {
    for (const list of [CATALOG.weapons, CATALOG.camos, CATALOG.attachments, CATALOG.playerPrestige.rewards]) {
      const ids = list.map((x) => x.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it("matches the official launch post: max levels, unlock levels, 28 Apex attachments", () => {
    const w = (id: string) => CATALOG.weapons.find((x) => x.id === id)!;
    expect(w("kg-7-vulcan").maxLevel.value).toBe(75);
    expect(w("iso-nightshade").maxLevel.value).toBe(64);
    expect(w("han-86").name).toBe("Han 86");
    expect(w("wz55-striga").name).toBe("Wz.55 Striga");
    expect(CATALOG.weapons.filter((x) => x.season === 0).every((x) => x.maxLevel.value && x.maxLevel.verification.status === "official")).toBe(true);
    expect(CATALOG.attachments.filter((a) => a.type === "apex")).toHaveLength(28);
    // the six weapons Activision's post contradicts itself on are never marked official
    for (const id of ["vel-46", "wz55-striga", "ppsh-41", "x-58-nyx", "astaroth-57", "signal-50"]) expect(w(id).unlock.verification.status).toBe("unconfirmed");
  });

  it("includes the four weapons seen in the player's screenshots, marked in-game verified", () => {
    for (const id of ["han-86", "wz55-striga", "krait-p68", "fss-carbon-edge-1095"]) {
      expect(CATALOG.weapons.find((w) => w.id === id)?.verification.status).toBe("in-game");
    }
  });

  it("gives every weapon 8 Military, 3 Special, 3 per-weapon Completionist and 4 Prestige slots", () => {
    for (const w of CATALOG.weapons) {
      const c = CATALOG.camos.filter((x) => x.weaponId === w.id);
      expect(c.filter((x) => x.group === "military")).toHaveLength(8);
      expect(c.filter((x) => x.group === "special")).toHaveLength(3);
      expect(c.filter((x) => x.group === "completionist")).toHaveLength(3);
      expect(c.filter((x) => x.group === "prestige")).toHaveLength(4);
    }
  });

  it("every prerequisite points at a real record", () => {
    const weaponIds = new Set(CATALOG.weapons.map((w) => w.id));
    for (const c of CATALOG.camos) {
      for (const p of c.prereqs) {
        if (p.kind === "camo") expect(camoById.has(p.camoId), `${c.id} -> ${p.camoId}`).toBe(true);
        if ("weaponId" in p) expect(weaponIds.has(p.weaponId)).toBe(true);
      }
    }
    for (const a of CATALOG.attachments) if (a.unlockWeaponId) expect(weaponIds.has(a.unlockWeaponId)).toBe(true);
  });

  it("never invents a camo name: unverified slots stay nameless and unconfirmed", () => {
    for (const c of CATALOG.camos.filter((x) => x.group === "special" && x.name === null)) {
      expect(c.verification.status).toBe("unconfirmed");
      expect(c.requirements).toHaveLength(0);
    }
  });

  it("never merges MP and DMZ into one requirement", () => {
    for (const c of CATALOG.camos) {
      const modes = c.requirements.map((r) => r.mode);
      expect(new Set(modes).size).toBe(modes.length);
    }
  });

  it("every record cites a known source unless unconfirmed", () => {
    const srcIds = new Set(CATALOG.sources.map((s) => s.id));
    const all = [...CATALOG.weapons.map((w) => w.verification), ...CATALOG.camos.map((c) => c.verification), ...CATALOG.attachments.map((a) => a.verification)];
    for (const ver of all) {
      for (const s of ver.sourceIds) expect(srcIds.has(s)).toBe(true);
      if (ver.status !== "unconfirmed") expect(ver.sourceIds.length).toBeGreaterThan(0);
    }
  });

  it("community data is never labelled official", () => {
    const official = new Set(CATALOG.sources.filter((s) => s.kind === "official").map((s) => s.id));
    for (const c of CATALOG.camos) if (c.verification.status === "official") expect(c.verification.sourceIds.some((s) => official.has(s))).toBe(true);
  });
});
