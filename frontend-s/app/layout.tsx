import type { Metadata, Viewport } from "next";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: { template: "%s | FluxID", default: "FluxID — Liquidity Identity Layer on Stellar" },
  description:
    "FluxID turns any wallet into a real-time financial identity. Analyze liquidity, assess risk, and build financial trust on Stellar.",
  keywords: ["FluxID", "Liquidity Identity", "Stellar", "Soroban", "financial identity", "risk assessment", "DeFi"],
  authors: [{ name: "FluxID" }],
  creator: "FluxID",
  openGraph: {
    type: "website",
    title: "FluxID — Liquidity Identity Layer",
    description: "Turn any wallet into a real-time financial identity on Stellar.",
    siteName: "FluxID",
    images: [{ url: "/logo.svg", width: 44, height: 44, alt: "FluxID Logo" }],
  },
  twitter: {
    card: "summary",
    title: "FluxID",
    description: "Liquidity Identity Layer on Stellar",
    images: ["/logo.svg"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/logo.svg",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#090A06" }],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
