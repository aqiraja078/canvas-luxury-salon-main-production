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
  "users.manage": ["owner"] as AdminRole[],
} as const;

export type AdminPermission = keyof typeof ADMIN_PERMISSIONS;

export function hasPermission(
  role: AdminRole,
  permission: AdminPermission
): boolean {
  return ADMIN_PERMISSIONS[permission].includes(role);
}
