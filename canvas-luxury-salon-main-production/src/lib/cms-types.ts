export type ServiceCategorySlug =
  | "hair"
  | "facial"
  | "body-spa"
  | "nails"
  | "mehndi"
  | "makeup";

export type AdminRole = "owner" | "reception" | "contact";

export type CmsService = {
  id: string;
  categorySlug: ServiceCategorySlug;
  sectionId: string;
  sectionEmoji: string;
  sectionTitle: string;
  name: string;
  description: string;
  price: string;
  duration?: string;
  imageUrl?: string;
  featured: boolean;
  sortOrder: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CmsOffer = {
  id: string;
  title: string;
  description: string;
  discountLabel: string;
  originalPrice?: string;
  offerPrice?: string;
  imageUrl?: string;
  includedServices: string[];
  promoCode?: string;
  startsAt?: string;
  endsAt?: string;
  featured: boolean;
  active: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type CourseApplicationStatus =
  | "pending"
  | "contacted"
  | "enrolled"
  | "rejected";

export type CmsCourse = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  duration: string;
  fee: string;
  syllabus: string[];
  highlights: string[];
  instructor?: string;
  nextBatch?: string;
  imageUrl?: string;
  featured: boolean;
  active: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type CmsCourseApplication = {
  id: string;
  courseId: string;
  courseSlug: string;
  courseTitle: string;
  /** Snapshot of course fee at apply time (e.g. Rs. 45,000). */
  courseFee?: string;
  courseDuration?: string;
  courseInstructor?: string;
  courseNextBatch?: string;
  courseShortDescription?: string;
  name: string;
  email: string;
  phone: string;
  age?: string;
  city?: string;
  message?: string;
  status: CourseApplicationStatus;
  createdAt: string;
};

export type CmsTeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  specialties: string[];
  experienceYears?: number;
  imageUrl?: string;
  instagram?: string;
  sortOrder: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CmsAdminUser = {
  id: string;
  username: string;
  passwordHash: string;
  role: AdminRole;
  name: string;
  email?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AdminSessionUser = {
  userId: string;
  role: AdminRole;
  name: string;
  username: string;
};

export type CmsHomeCard = {
  id: string;
  name: string;
  price: string;
  image: string;
  active: boolean;
  sortOrder: number;
};

export type CmsHomeCategorySection = {
  kicker: string;
  title: string;
  subtitle: string;
  viewAllHref: string;
  viewAllLabel: string;
  sectionIndex: string;
  variant: "default" | "alt";
  cards: CmsHomeCard[];
};

export type CmsHomeHeroTrust = {
  value: string;
  label: string;
  hint: string;
};

export type CmsHomeHero = {
  imageUrl: string;
  badgeText: string;
  kicker: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  footnote: string;
  primaryBtnLabel: string;
  primaryBtnHref: string;
  secondaryBtnLabel: string;
  secondaryBtnHref: string;
  trustItems: CmsHomeHeroTrust[];
};

export type CmsHomeSectionMeta = {
  kicker: string;
  title: string;
  subtitle: string;
  sectionIndex: string;
};

export type CmsHomeWhyCard = {
  id: string;
  title: string;
  desc: string;
};

export type CmsHomeStep = {
  id: string;
  number: string;
  title: string;
  desc: string;
};

export type CmsHomeTestimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
};

export type CmsHomeCtaProof = {
  id: string;
  name: string;
  event: string;
  line: string;
};

export type CmsHomeCta = {
  trustPoints: string[];
  proofCards: CmsHomeCtaProof[];
  title: string;
  subtitle: string;
  buttonLabel: string;
  buttonHref: string;
};

export type CmsHomePage = {
  hero: CmsHomeHero;
  makeup: CmsHomeCategorySection;
  offers: CmsHomeSectionMeta;
  hair: CmsHomeCategorySection;
  facial: CmsHomeCategorySection;
  nails: CmsHomeCategorySection;
  waxing: CmsHomeCategorySection;
  mehndi: CmsHomeCategorySection;
  why: CmsHomeSectionMeta & { cards: CmsHomeWhyCard[] };
  team: CmsHomeSectionMeta;
  steps: CmsHomeSectionMeta & { items: CmsHomeStep[] };
  testimonials: CmsHomeSectionMeta & { items: CmsHomeTestimonial[] };
  cta: CmsHomeCta;
  updatedAt: string;
};

export type CmsAboutTimelineItem = {
  id: string;
  year: string;
  title: string;
  text: string;
};

export type CmsAboutPillar = {
  id: string;
  num: string;
  title: string;
  text: string;
};

export type CmsAboutStat = {
  id: string;
  value: string;
  label: string;
};

export type CmsAboutCity = {
  id: string;
  name: string;
  note: string;
};

export type CmsAboutCtaButton = {
  id: string;
  label: string;
  href: string;
  variant: "primary" | "secondary" | "outline";
};

export type CmsAboutHero = {
  imageUrl: string;
  kicker: string;
  titleBefore: string;
  titleAccent: string;
  lead: string;
  cities: { id: string; name: string }[];
};

export type CmsAboutStory = {
  imageUrl: string;
  quoteLine1: string;
  quoteLine2: string;
  kicker: string;
  titleBefore: string;
  titleAccent: string;
  subtitle: string;
  sectionIndex: string;
  paragraph1: string;
  paragraph2: string;
  timeline: CmsAboutTimelineItem[];
};

export type CmsAboutKitItem = {
  id: string;
  text: string;
};

export type CmsAboutPage = {
  hero: CmsAboutHero;
  story: CmsAboutStory;
  team: CmsHomeSectionMeta & { memberLimit: number };
  pillars: CmsHomeSectionMeta & { items: CmsAboutPillar[] };
  stats: CmsAboutStat[];
  coverage: CmsHomeSectionMeta & { cities: CmsAboutCity[] };
  homeKit: CmsHomeSectionMeta & {
    items: CmsAboutKitItem[];
    quote: string;
    quoteAttribution: string;
  };
  cta: {
    kicker: string;
    title: string;
    subtitle: string;
    buttons: CmsAboutCtaButton[];
  };
  updatedAt: string;
};

export const ADMIN_PERMISSIONS = {
  "bookings.view": ["owner", "reception", "contact"] as AdminRole[],
  "bookings.update": ["owner", "reception"] as AdminRole[],
  "bookings.delete": ["owner", "reception"] as AdminRole[],
  "services.view": ["owner", "reception"] as AdminRole[],
  "services.manage": ["owner"] as AdminRole[],
  "offers.view": ["owner", "reception"] as AdminRole[],
  "offers.manage": ["owner"] as AdminRole[],
  "team.view": ["owner", "reception"] as AdminRole[],
  "team.manage": ["owner"] as AdminRole[],
  "courses.view": ["owner", "reception"] as AdminRole[],
  "courses.manage": ["owner"] as AdminRole[],
  "course-applications.view": ["owner", "reception", "contact"] as AdminRole[],
  "course-applications.update": ["owner", "reception"] as AdminRole[],
  "home.view": ["owner", "reception"] as AdminRole[],
  "home.manage": ["owner"] as AdminRole[],
  "about.view": ["owner", "reception"] as AdminRole[],
  "about.manage": ["owner"] as AdminRole[],
  "users.manage": ["owner"] as AdminRole[],
} as const;

export type AdminPermission = keyof typeof ADMIN_PERMISSIONS;

export function hasPermission(
  role: AdminRole,
  permission: AdminPermission
): boolean {
  return ADMIN_PERMISSIONS[permission].includes(role);
}
