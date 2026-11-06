"use client";

import type { Weapon, WeaponCategoryId } from "@/data/schema";

const ART: Record<string, string> = {
  "m4": "https://www.gamesatlas.com/images/cod-modern-warfare-4/weapons/m4-2.jpg",
  "han-86": "https://www.gamesatlas.com/images/cod-modern-warfare-4/weapons/Han-86-2.jpg",
  "cronen-osprey": "https://imgs.callofduty.com/content/dam/atvi/callofduty/cod-touchui/blog/body/mw4/s1-mp-dmz-announcement/MW4-SEASON-1-ANNOUNCEMENT-025.webp",
};

export function WeaponArt({ weapon, size = "card" }: { weapon: Weapon; size?: "card" | "hero" }) {
  const hero = size === "hero";
  const src = ART[weapon.slug];
  return (
    <div className={`relative overflow-hidden ${hero ? "aspect-[16/9]" : "aspect-[16/9]"} bg-zinc-950`}>
      {src ? (
        <img src={src} alt={weapon.name} className="absolute inset-0 h-full w-full object-contain p-4" loading="lazy" />
      ) : (
        <div className="flex h-full items-center justify-center text-zinc-500 text-xs">No art</div>
      )}
    </div>
  );
}
