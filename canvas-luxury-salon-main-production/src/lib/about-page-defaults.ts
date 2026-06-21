import type { CmsAboutPage } from "@/lib/cms-types";
import { site } from "@/lib/site";

export function buildDefaultAboutPage(): CmsAboutPage {
  const ts = new Date().toISOString();

  return {
    hero: {
      imageUrl:
        "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1920&q=85",
      kicker: "Our story",
      titleBefore: "Artistry rooted in",
      titleAccent: "care & calm",
      lead: `${site.name} brings senior stylists and makeup artists to your doorstep across Jhelum, Dina, and Gujrat — salon-grade results, zero travel stress.`,
      cities: [
        { id: "city-jhelum", name: "Jhelum" },
        { id: "city-dina", name: "Dina" },
        { id: "city-gujrat", name: "Gujrat" },
      ],
    },
    story: {
      imageUrl:
        "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=900&q=85",
      quoteLine1: "Salon results.",
      quoteLine2: "Your doorstep.",
      kicker: "Who we are",
      titleBefore: "Your home, our",
      titleAccent: "quiet luxury studio",
      subtitle:
        "We were built for brides, working women, and families who want premium beauty without the salon rush.",
      sectionIndex: "01",
      paragraph1: `${site.name} combines senior makeup artists, mehndi designers, hair stylists, and skin specialists who share one goal: make you feel unmistakably yourself — only more radiant.`,
      paragraph2:
        "From bridal trials to quick party refreshes, every appointment gets the same patience, hygiene standards, and eye for detail. We invest in premium products and continuous training so your results look as beautiful in photographs as they do in person.",
      timeline: [
        {
          id: "tl-1",
          year: "Day one",
          title: "Built for home beauty",
          text: "Huma started with one belief — every woman deserves salon results without leaving her home.",
        },
        {
          id: "tl-2",
          year: "Growing",
          title: "Bridal specialists joined",
          text: "Senior makeup artists, mehndi designers, and hair stylists came together for full wedding journeys.",
        },
        {
          id: "tl-3",
          year: "Today",
          title: "Three cities, one promise",
          text: "Jhelum, Dina, and Gujrat — same hygiene standards, same premium products, same calm care.",
        },
      ],
    },
    team: {
      kicker: "Meet the team",
      title: "The Artists Behind Your Glow",
      subtitle: "Certified specialists for bridal makeup, mehndi, hair, and skin.",
      sectionIndex: "02",
      memberLimit: 3,
    },
    pillars: {
      kicker: "Our values",
      title: "Three pillars of the Huma promise",
      subtitle:
        "What stays the same — whether it is bridal prep or a quick glow facial.",
      sectionIndex: "03",
      items: [
        {
          id: "pillar-1",
          num: "01",
          title: "We come to you",
          text: "Professional lighting, sanitised kit, and a calm setup — your home becomes our studio for the day.",
        },
        {
          id: "pillar-2",
          num: "02",
          title: "Bridal-first care",
          text: "Makeup, mehndi, and hair artists who understand walima, mehndi night, and barat timelines.",
        },
        {
          id: "pillar-3",
          num: "03",
          title: "Honest & warm",
          text: "Clear pricing before we arrive. The patience we would give our own family on wedding day.",
        },
      ],
    },
    stats: [
      { id: "stat-1", value: "10+", label: "Years collective expertise" },
      { id: "stat-2", value: "100%", label: "Consultation-first approach" },
      { id: "stat-3", value: "1:1", label: "Trials for major events" },
      { id: "stat-4", value: "3", label: "Cities we serve" },
    ],
    coverage: {
      kicker: "Coverage",
      title: "Home service across Punjab",
      subtitle:
        "We travel to you — share your location on WhatsApp and we confirm your slot.",
      sectionIndex: "04",
      cities: [
        {
          id: "cov-jhelum",
          name: "Jhelum",
          note: "Our busiest home-service zone — bridal, party, and everyday beauty.",
        },
        {
          id: "cov-dina",
          name: "Dina",
          note: "Dedicated doorstep visits with the same premium kit and artists.",
        },
        {
          id: "cov-gujrat",
          name: "Gujrat",
          note: "Full wedding prep — makeup, mehndi, hair, and skin rituals at home.",
        },
      ],
    },
    homeKit: {
      kicker: "What we bring",
      title: "Full salon setup at your door",
      subtitle:
        "Every visit includes professional equipment — not just a bag of products.",
      sectionIndex: "05",
      items: [
        { id: "kit-1", text: "Professional ring light & mirror setup" },
        { id: "kit-2", text: "Sanitised tools & fresh disposable kits" },
        { id: "kit-3", text: "Premium branded makeup & skin products" },
        { id: "kit-4", text: "Clean setup, calm service, tidy breakdown" },
      ],
      quote:
        "We don't rush beauty. We listen first, prep properly, and leave you glowing — that is the Huma way.",
      quoteAttribution: site.name,
    },
    cta: {
      kicker: "Ready when you are",
      title: "Plan your next look at home",
      subtitle:
        "Book online or message us on WhatsApp — we confirm within 48 hours and share clear pricing before we arrive.",
      buttons: [
        { id: "cta-1", label: "Book appointment", href: "/book", variant: "primary" },
        { id: "cta-2", label: "View courses", href: "/courses", variant: "secondary" },
        { id: "cta-3", label: "Contact us", href: "/contact", variant: "outline" },
      ],
    },
    updatedAt: ts,
  };
}
