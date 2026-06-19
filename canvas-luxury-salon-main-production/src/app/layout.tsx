import type { Metadata, Viewport } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { JsonLd } from "@/components/seo/JsonLd";
import { getMetadataBase } from "@/lib/public-site-url";
import { site } from "@/lib/site";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
  adjustFontFallback: true,
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
  adjustFontFallback: true,
});

const metadataBase = getMetadataBase();

export const metadata: Metadata = {
  metadataBase,
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  title: {
    default: `${site.name} | Home Beauty Services in Jhelum, Dina, Gujrat`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: site.name,
    description: site.description,
    locale: "en_PK",
    type: "website",
    url: "/",
    siteName: site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <head>
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://i.pinimg.com" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="" />
        <link rel="preconnect" href="https://i.pinimg.com" crossOrigin="" />
      </head>
      <body
        className={`${poppins.variable} ${playfair.variable} grain min-h-screen overflow-x-clip bg-background antialiased selection:bg-gold/30 selection:text-white`}
      >
        <JsonLd />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
