import { Suspense } from "react";
import { Loading } from "@/components/ui";
import Attachments from "@/views/Attachments";
export const metadata = { title: "Attachments" };
export default function Page() {
  return <Suspense fallback={<Loading />}><Attachments /></Suspense>;
}
