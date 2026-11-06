"use client";

import type { Weapon, WeaponCategoryId } from "@/data/schema";

/**
 * Original technical-drawing silhouettes by weapon class. These are deliberate
 * placeholders — NOT in-game artwork — and are always labelled as such.
 */
export const SHAPES: Record<WeaponCategoryId, string[]> = {
  "assault-rifle": [
    "M20 62 L70 56 L74 80 L30 92 L20 88 Z", // stock
    "M74 52 L190 52 L196 74 L74 78 Z", // receiver
    "M196 56 L290 56 L290 70 L196 72 Z", // handguard
    "M290 60 L372 60 L372 66 L290 66 Z", // barrel
    "M372 57 L386 57 L386 69 L372 69 Z", // muzzle
    "M150 76 L176 76 L186 116 L162 120 Z", // magazine
    "M100 78 L118 78 L112 108 L96 106 Z", // grip
    "M118 40 L162 40 L162 52 L118 52 Z", // optic
  ],
  smg: [
    "M40 64 L92 60 L92 72 L48 84 L40 80 Z",
    "M92 54 L222 54 L226 76 L92 78 Z",
    "M226 60 L300 60 L300 70 L226 70 Z",
    "M300 56 L326 56 L326 74 L300 74 Z",
    "M150 78 L170 78 L172 128 L152 128 Z",
    "M112 78 L128 78 L122 106 L106 104 Z",
    "M126 42 L160 42 L160 54 L126 54 Z",
  ],
  shotgun: [
    "M16 66 L84 58 L88 82 L28 96 L16 90 Z",
    "M88 56 L182 56 L184 78 L88 80 Z",
    "M184 58 L376 58 L376 66 L184 66 Z",
    "M200 68 L330 68 L330 78 L200 78 Z",
    "M110 80 L126 80 L120 108 L104 106 Z",
  ],
  lmg: [
    "M16 62 L72 56 L76 82 L28 94 L16 88 Z",
    "M76 50 L210 50 L214 78 L76 80 Z",
    "M214 56 L296 56 L296 72 L214 72 Z",
    "M296 60 L380 60 L380 66 L296 66 Z",
    "M130 80 L192 80 L192 118 L130 118 Z",
    "M98 80 L116 80 L110 108 L94 106 Z",
    "M300 72 L304 72 L318 112 L314 112 Z M300 72 L296 72 L282 112 L286 112 Z",
    "M120 38 L168 38 L168 50 L120 50 Z",
  ],
  "marksman-rifle": [
    "M18 62 L80 58 L84 80 L30 92 L18 88 Z",
    "M84 54 L196 54 L200 74 L84 78 Z",
    "M200 58 L300 58 L300 68 L200 68 Z",
    "M300 60 L384 60 L384 65 L300 65 Z",
    "M150 76 L170 76 L174 104 L154 104 Z",
    "M104 78 L120 78 L114 106 L98 104 Z",
    "M110 36 L190 36 L190 46 L110 46 Z",
  ],
  "sniper-rifle": [
    "M12 60 L82 56 L86 80 L24 94 L12 88 Z",
    "M86 54 L200 54 L204 74 L86 78 Z",
    "M204 58 L280 58 L280 68 L204 68 Z",
    "M280 60 L388 60 L388 65 L280 65 Z",
    "M150 76 L168 76 L170 100 L152 100 Z",
    "M104 78 L120 78 L114 106 L98 104 Z",
    "M100 32 L196 32 L196 46 L100 46 Z M92 34 L100 34 L100 44 L92 44 Z M196 34 L208 30 L208 48 L196 44 Z",
  ],
  pistol: [
    "M120 52 L290 52 L290 74 L120 74 Z",
    "M130 74 L176 74 L166 126 L130 126 L122 116 Z",
    "M176 74 L210 74 L206 88 L176 88 Z",
    "M290 58 L300 58 L300 70 L290 70 Z",
  ],
  launcher: [
    "M40 52 L360 52 L360 80 L40 80 Z",
    "M360 46 L384 46 L384 86 L360 86 Z",
    "M140 80 L156 80 L150 112 L134 110 Z",
    "M200 80 L214 80 L210 104 L196 104 Z",
    "M170 34 L220 34 L220 52 L170 52 Z",
    "M24 56 L40 56 L40 76 L24 76 Z",
  ],
  melee: [
    "M60 70 L170 62 L176 64 L176 78 L170 80 L60 76 Z",
    "M176 60 L350 56 Q372 64 360 74 L176 80 Z",
    "M180 66 L330 63",
  ],
};

export function WeaponSchematic({ category, className = "" }: { category: WeaponCategoryId; className?: string }) {
  return (
    <svg viewBox="0 0 400 140" className={className} aria-hidden preserveAspectRatio="xMidYMid meet">
      {SHAPES[category].map((d, i) => (
        <path key={i} d={d} pathLength={1} className="draw" style={{ animationDelay: `${i * 70}ms` }} fill="rgb(165 174 115 / 0.06)" stroke="#A5AE73" strokeOpacity={0.75} strokeWidth={1.1} strokeLinejoin="round" />
      ))}
      <line x1="10" y1="130" x2="390" y2="130" stroke="#29332B" strokeDasharray="2 4" />
    </svg>
  );
}

/** Season 1 weapons use official Activision WebP renders. */
const WEBP_SLUGS = new Set(["cronen-osprey", "csg-35", "jak-12", "zlr-talonhawk"]);

function weaponImageSrc(weapon: Weapon): string | null {
  const ext = WEBP_SLUGS.has(weapon.slug) ? "webp" : "jpg";
  return `/weapons/${weapon.slug}.${ext}`;
}

/** Weapon artwork frame: real render when available, schematic fallback. */
export function WeaponArt({ weapon, size = "card" }: { weapon: Weapon; size?: "card" | "hero" }) {
  const hero = size === "hero";
  const src = weaponImageSrc(weapon);

  return (
    <div className={`relative overflow-hidden ${hero ? "aspect-[16/9] xl:aspect-auto xl:min-h-[320px] xl:flex-1" : "aspect-[16/9]"} bg-bg-2`}>
      {src ? (
        <>
          <img
            src={src}
            alt={weapon.name}
            className={`absolute inset-0 h-full w-full object-contain ${hero ? "p-3 md:p-6" : "p-2 sm:p-2.5"} transition-transform duration-500 ease-out group-hover:scale-[1.045]`}
            loading="lazy"
            decoding="async"
          />
          {/* Soft edge fade so the render sits cleanly in the panel */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgb(9_11_10/0.45)_100%)]" />
        </>
      ) : (
        <WeaponSchematic category={weapon.category} className={`absolute inset-0 m-auto h-full w-full transition-transform duration-500 group-hover:scale-[1.06] ${hero ? "p-6 md:p-10" : "p-3"}`} />
      )}
      {!src && (
        <div className={`pointer-events-none absolute left-2 top-2 font-mono uppercase tracking-[0.14em] text-faint ${hero ? "text-[10px]" : "text-[9px]"}`}>
          Schematic · not in-game art
        </div>
      )}
      {hero && (
        <div className="pointer-events-none absolute bottom-3 right-4 h-display text-[clamp(1.6rem,6vw,4.5rem)] text-fg/[0.06]">{weapon.name}</div>
      )}
    </div>
  );
}
