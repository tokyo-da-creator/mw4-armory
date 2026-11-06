import { Suspense } from "react";
import type { Metadata } from "next";
import { CATALOG, weaponById } from "@/data";
import { Loading } from "@/components/ui";
import WeaponDetail from "@/views/WeaponDetail";

export const dynamicParams = false;
export function generateStaticParams() {
  return CATALOG.weapons.map((w) => ({ slug: w.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const w = weaponById.get(slug);
  return { title: w ? `${w.name} — camos, attachments & prestige` : "Weapon" };
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <Suspense fallback={<Loading />}><WeaponDetail slug={slug} /></Suspense>;
}
