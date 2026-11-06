import "@fontsource/barlow-condensed/600.css";
import "@fontsource/barlow-condensed/700.css";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Shell } from "@/components/Shell";

export const metadata: Metadata = {
  title: { default: "MW4 Armory — Every Modern Warfare 4 unlock and how to get it", template: "%s · MW4 Armory" },
  description: "Unofficial, free guide to every unlock in Call of Duty: Modern Warfare 4 — weapons, camos, attachments, equipment, perks, killstreaks, operators and prestige — and exactly how to get each one.",
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = { themeColor: "#090B0A", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
          <Shell>{children}</Shell>
      </body>
    </html>
  );
}
