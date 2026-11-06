import Link from "next/link";
export default function NotFound() {
  return (
    <div className="py-24 text-center">
      <div className="label mb-2">404 · Off the map</div>
      <h1 className="h-display text-5xl text-fg">Nothing here</h1>
      <Link href="/" className="btn mt-6">Back to dashboard</Link>
    </div>
  );
}
