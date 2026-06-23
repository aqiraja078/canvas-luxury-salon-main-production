import type { CmsTeamSection } from "@/lib/cms-types";

export function defaultTeamSection(): CmsTeamSection {
  return {
    kicker: "Meet the team",
    title: "The Artists Behind Your Glow",
    subtitle: "Certified specialists for bridal makeup, mehndi, hair, and skin.",
    sectionIndex: "10",
    emptyMessage: "Our artist profiles are being updated. Check back soon.",
    homeMemberLimit: 3,
    aboutMemberLimit: 3,
    aboutHeadingTemplate: "About {name}",
    aboutLeadTemplate:
      "With over {years}+ years of professional beauty expertise, {name} brings artistry and attention to detail to every bridal and special occasion look.",
    defaultMemberImage:
      "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=800&q=85",
    stats: [
      { id: "stat-1", value: "{years}+", label: "Years Experience" },
      { id: "stat-2", value: "500+", label: "Happy Clients" },
      { id: "stat-3", value: "100%", label: "Client Satisfaction" },
      { id: "stat-4", value: "3", label: "Cities Served" },
    ],
    updatedAt: new Date().toISOString(),
  };
}
