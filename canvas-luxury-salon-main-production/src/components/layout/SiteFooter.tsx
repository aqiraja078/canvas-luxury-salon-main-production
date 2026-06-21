import Link from "next/link";
import { mainNavLinks, serviceNavLinks } from "@/lib/navigation";
import { site } from "@/lib/site";

const footerLinkClass =
  "inline-block py-1 transition hover:text-white sm:py-1.5";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-5 gap-y-6 px-4 py-6 sm:gap-x-6 sm:px-6 md:grid-cols-2 md:gap-y-8 md:px-8 md:py-8 lg:grid-cols-4 lg:gap-x-8">
        <div className="col-span-2 lg:col-span-1">
          <p className="font-display text-lg tracking-wide text-gold sm:text-xl lg:text-2xl">
            {site.name}
          </p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/55 sm:mt-3">
            {site.description}
          </p>
        </div>

        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-gold sm:text-xs sm:tracking-[0.25em]">
            Pages
          </p>
          <ul className="mt-2 space-y-0 text-sm text-white/65 sm:mt-3">
            {mainNavLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={footerLinkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-gold sm:text-xs sm:tracking-[0.25em]">
            Services
          </p>
          <ul className="mt-2 space-y-0 text-sm text-white/65 sm:mt-3">
            {serviceNavLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={footerLinkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-2 lg:col-span-1">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-gold sm:text-xs sm:tracking-[0.25em]">
            Contact
          </p>
          <ul className="mt-2 space-y-2 text-sm text-white/65 sm:mt-3">
            <li>
              <a
                href={`mailto:${site.email}`}
                className="break-all hover:text-white"
              >
                {site.email}
              </a>
            </li>
            <li>
              <a href={`tel:+${site.phoneDigits}`} className="hover:text-white">
                {site.phone}
              </a>
            </li>
            <li>
              <p className="text-[11px] uppercase tracking-[0.16em] text-white/45 sm:text-xs sm:tracking-[0.18em]">
                Home service areas
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5 sm:gap-2">
                {site.serviceAreas.map((area) => (
                  <span
                    key={area}
                    className="rounded-full border border-white/12 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-white/85 sm:px-3 sm:py-1.5 sm:text-xs"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </li>
          </ul>

          <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.22em] text-gold sm:mt-5 sm:text-xs sm:tracking-[0.25em]">
            Follow
          </p>
          <div className="mt-2 flex flex-wrap gap-2 sm:mt-3">
            <a
              href={site.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/15 px-3 py-2 text-[11px] uppercase tracking-wider text-white/70 transition hover:border-gold/50 hover:text-gold sm:px-4 sm:py-2.5 sm:text-xs"
            >
              Instagram
            </a>
            <a
              href={site.social.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/15 px-3 py-2 text-[11px] uppercase tracking-wider text-white/70 transition hover:border-gold/50 hover:text-gold sm:px-4 sm:py-2.5 sm:text-xs"
            >
              TikTok
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] text-center text-[11px] text-white/40 sm:py-4 sm:text-xs">
        © {year} {site.name}. All rights reserved.
      </div>
    </footer>
  );
}
