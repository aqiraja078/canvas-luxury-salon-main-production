import type { Metadata, Viewport } from "next";
import { Great_Vibes, Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { JsonLd } from "@/components/seo/JsonLd";
import { getMetadataBase } from "@/lib/public-site-url";
import { DEFAULT_OG_IMAGE } from "@/lib/seo-metadata";
import { headerNavLinks, mainNavLinks, serviceNavLinks, type SiteNavLink } from "@/lib/navigation";
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

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
  display: "swap",
  adjustFontFallback: false,
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
  keywords: [
    "beauty salon",
    "home beauty services",
    "bridal makeup",
    "Jhelum",
    "Dina",
    "Gujrat",
    "Huma Beauty Saloon",
  ],
  openGraph: {
    title: site.name,
    description: site.description,
    locale: "en_PK",
    type: "website",
    url: "/",
    siteName: site.name,
    images: [{ url: DEFAULT_OG_IMAGE, alt: site.name, width: 512, height: 512 }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
    images: [DEFAULT_OG_IMAGE],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#090909",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navMain: SiteNavLink[] = mainNavLinks.map((link) => ({
    href: link.href,
    label: link.label,
  }));
  const navServices: SiteNavLink[] = serviceNavLinks.map((link) => ({
    href: link.href,
    label: link.label,
  }));

  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <head>
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://i.pinimg.com" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="" />
        <link rel="preconnect" href="https://i.pinimg.com" crossOrigin="" />
      </head>
      <body
        className={`${poppins.variable} ${playfair.variable} ${greatVibes.variable} grain min-h-screen overflow-x-clip bg-background antialiased selection:bg-gold/30 selection:text-white`}
      >
        <JsonLd />
        <SiteChrome
          footer={
            <SiteFooter
              mainNavLinks={navMain}
              serviceNavLinks={navServices}
            />
          }
          headerNavLinks={headerNavLinks.map((link) => ({
            href: link.href,
            label: link.label,
          }))}
          serviceNavLinks={navServices}
        >
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
