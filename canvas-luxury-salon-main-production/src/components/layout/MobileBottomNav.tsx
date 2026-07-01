"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import type { SiteNavLink } from "@/lib/navigation";

type NavItem = {
  href: string;
  label: string;
  center?: boolean;
  servicesMenu?: boolean;
  icon: ReactNode;
};

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function servicesActive(pathname: string): boolean {
  return pathname === "/services" || pathname.startsWith("/services/");
}

const SERVICES_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
    <rect x="4" y="4" width="6.5" height="6.5" rx="1.25" />
    <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.25" />
    <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.25" />
    <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.25" />
  </svg>
);

const NAV_ITEMS: NavItem[] = [
  {
    href: "/",
    label: "Home",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <path d="M4 10.5 12 4l8 6.5V20a1 1 0 01-1 1h-5v-6H10v6H5a1 1 0 01-1-1v-9.5z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/courses",
    label: "Course",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <path d="M5.5 6.5h13a1 1 0 011 1v11.5a1 1 0 01-1 1h-13a1 1 0 01-1-1V7.5a1 1 0 011-1z" strokeLinejoin="round" />
        <path d="M8.5 6.5V5.25A1.75 1.75 0 0110.25 3.5h3.5A1.75 1.75 0 0115.5 5.25V6.5" strokeLinecap="round" />
        <path d="M9 11.25h6M9 14.25h4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/offers",
    label: "Offers",
    center: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <circle cx="12" cy="12" r="8.25" />
        <path d="M9.5 9.5c.7-1.1 1.8-1.7 3.2-1.7 2 0 3.2 1.3 3.2 2.8 0 2-2.2 2.4-3.2 3.8-.3.35-.5.8-.5 1.3h-2.1" strokeLinecap="round" />
        <circle cx="12" cy="16.75" r="0.75" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    href: "/services",
    label: "Services",
    servicesMenu: true,
    icon: SERVICES_ICON,
  },
  {
    href: "/contact",
    label: "Contact",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <path
          d="M6.5 5.5h11a2 2 0 012 2v8.25a1.25 1.25 0 01-1.25 1.25h-3.1l-2.65 2.2a1 1 0 01-1.6-.8V17H6.5a2 2 0 01-2-2v-7.5a2 2 0 012-2z"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

type Props = {
  serviceNavLinks: SiteNavLink[];
};

export function MobileBottomNav({ serviceNavLinks }: Props) {
  const pathname = usePathname() ?? "/";
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    setServicesOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!servicesOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [servicesOpen]);

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile bottom navigation">
      {servicesOpen ? (
        <button
          type="button"
          className="mobile-bottom-nav__backdrop"
          aria-label="Close services menu"
          onClick={() => setServicesOpen(false)}
        />
      ) : null}

      <div className="mobile-bottom-nav__dock">
        {servicesOpen ? (
          <div
            id="mobile-bottom-services-menu"
            className="mobile-bottom-nav__services-sheet"
            role="menu"
            aria-label="Choose a service"
          >
            <div className="mobile-bottom-nav__services-head">
              <p className="mobile-bottom-nav__services-title">Select service</p>
              <button
                type="button"
                className="mobile-bottom-nav__services-close"
                aria-label="Close"
                onClick={() => setServicesOpen(false)}
              >
                ✕
              </button>
            </div>
            <ul className="mobile-bottom-nav__services-list">
              {serviceNavLinks.map((service) => {
                const active = pathname === service.href;
                return (
                  <li key={service.href}>
                    <Link
                      href={service.href}
                      role="menuitem"
                      className={`mobile-bottom-nav__services-option${active ? " mobile-bottom-nav__services-option--active" : ""}`}
                      onClick={() => setServicesOpen(false)}
                    >
                      <span className="mobile-bottom-nav__services-option-text">
                        {service.label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}

        <div className="mobile-bottom-nav__bar">
        {NAV_ITEMS.map((item) => {
          const active = item.servicesMenu
            ? servicesActive(pathname) || servicesOpen
            : isActive(pathname, item.href);
          const className = [
            "mobile-bottom-nav__item",
            item.center ? "mobile-bottom-nav__item--center" : "",
            active ? "mobile-bottom-nav__item--active" : "",
            item.servicesMenu && servicesOpen ? "mobile-bottom-nav__item--menu-open" : "",
          ]
            .filter(Boolean)
            .join(" ");

          if (item.servicesMenu) {
            return (
              <button
                key={item.href}
                type="button"
                className={className}
                aria-haspopup="menu"
                aria-expanded={servicesOpen}
                aria-controls="mobile-bottom-services-menu"
                onClick={() => setServicesOpen((open) => !open)}
              >
                <span className="mobile-bottom-nav__icon">{item.icon}</span>
                <span className="mobile-bottom-nav__label">{item.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={className}
              aria-current={active ? "page" : undefined}
              onClick={() => setServicesOpen(false)}
            >
              <span className="mobile-bottom-nav__icon">{item.icon}</span>
              <span className="mobile-bottom-nav__label">{item.label}</span>
            </Link>
          );
        })}
        </div>
      </div>
    </nav>
  );
}
