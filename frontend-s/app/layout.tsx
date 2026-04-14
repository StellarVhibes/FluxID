import type { Metadata, Viewport } from "next";
import "./globals.css";
import Web3Provider from "@/context/Web3Provider";
import ClientLayout from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: { template: "%s | ForgeX: Vult", default: "ForgeX: Vult — Yield-Native Liquidity Hooks on Base" },
  description:
    "ForgeX stacks ERC-4626 vault yield with Uniswap v4 swap fees into a single AI-driven strategy on Base. Stack more. Earn more.",
  keywords: ["ForgeX", "Vult", "ERC-4626", "Uniswap v4", "yield hooks", "Base", "DeFi", "AI vault"],
  authors: [{ name: "ForgeX Protocol" }],
  creator: "ForgeX Protocol",
  openGraph: {
    type: "website",
    title: "ForgeX: Vult — Yield-Native Liquidity Hooks",
    description: "Stack ERC-4626 vault yield with Uniswap v4 swap fees. AI-driven strategy optimization on Base.",
    siteName: "ForgeX: Vult",
    images: [{ url: "/forgex-logo.png", width: 44, height: 44, alt: "ForgeX Logo" }],
  },
  twitter: {
    card: "summary",
    title: "ForgeX: Vult",
    description: "Yield-Native Liquidity Hooks on Base. ERC-4626 + Uniswap v4 + AI.",
    images: ["/forgex-logo.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/forgex-logo.png",
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
        <Web3Provider>
          <ClientLayout>{children}</ClientLayout>
        </Web3Provider>
      </body>
    </html>
  );
}
