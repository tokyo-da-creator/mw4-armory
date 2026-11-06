import { Suspense } from "react";
import { Loading } from "@/components/ui";
import Camos from "@/views/Camos";
export const metadata = { title: "Camos" };
export default function Page() {
  return <Suspense fallback={<Loading />}><Camos /></Suspense>;
}
