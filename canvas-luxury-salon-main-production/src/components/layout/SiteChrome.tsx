"use client";

import { usePathname } from "next/navigation";
import { PageLoader } from "@/components/layout/PageLoader";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import type { SiteNavLink } from "@/lib/navigation";

function isAdminPath(pathname: string | null): boolean {
  return pathname?.startsWith("/admin") ?? false;
}

export function SiteChrome({
  children,
  footer,
  headerNavLinks,
  serviceNavLinks,
}: {
  children: React.ReactNode;
  footer: React.ReactNode;
  headerNavLinks: SiteNavLink[];
  serviceNavLinks: SiteNavLink[];
}) {
  const pathname = usePathname();
  const isAdmin = isAdminPath(pathname);

  if (isAdmin) {
    return (
      <main id="main-content" className="min-h-screen" tabIndex={-1}>
        {children}
      </main>
    );
  }

  return (
    <>
      <a
        href="#main-content"
        className="absolute left-[-9999px] top-0 z-[110] rounded-md bg-gold px-4 py-2 text-sm font-medium text-black focus:left-4 focus:top-4 focus:outline-none focus:ring-2 focus:ring-gold-light"
      >
        Skip to main content
      </a>
      <PageLoader />
      <SiteHeader
        headerNavLinks={headerNavLinks}
        serviceNavLinks={serviceNavLinks}
      />
      <main id="main-content" className="min-h-screen" tabIndex={-1}>
        {children}
      </main>
      {footer}
      <WhatsAppButton />
    </>
  );
}
