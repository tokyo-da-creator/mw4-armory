import { Suspense } from "react";
import { Loading } from "@/components/ui";
import Weapons from "@/views/Weapons";
export const metadata = { title: "Weapons" };
export default function Page() {
  return <Suspense fallback={<Loading />}><Weapons /></Suspense>;
}
