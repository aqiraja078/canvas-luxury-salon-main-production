export const mainNavLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Service" },
  { href: "/offers", label: "Offers" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Blog" },
  { href: "/courses", label: "Course" },
  { href: "/about", label: "About" },
  { href: "/book", label: "Book" },
  { href: "/contact", label: "Contact" },
] as const;

export const serviceNavLinks = [
  { href: "/services", label: "All services" },
  { href: "/services/hair", label: "Hair" },
  { href: "/services/makeup", label: "Makeup" },
  { href: "/services/facial", label: "Facial" },
  { href: "/services/body-spa", label: "Wax" },
  { href: "/services/nails", label: "Nail, mani & pedi" },
  { href: "/services/mehndi", label: "Mehndi" },
] as const;

export type SiteNavLink = { href: string; label: string };

/** Header top nav — Service is a dropdown, so Home is separate. */
export const headerNavLinks = mainNavLinks.filter((l) => l.href !== "/");

export const servicesSub = serviceNavLinks;
