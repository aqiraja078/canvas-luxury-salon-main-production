import type {
  CmsHomeCard,
  CmsHomeCategorySection,
  CmsHomePage,
} from "@/lib/cms-types";
import {
  homeFacialCards,
  homeHairCards,
  homeMehndiCards,
  homeNailsCards,
  homeWaxingCards,
} from "@/lib/home-category-cards";
import { homeMakeupCards } from "@/lib/makeup-home-cards";
import { site } from "@/lib/site";

function toCards(
  items: { id: string; name: string; price: string; image: string }[]
): CmsHomeCard[] {
  return items.map((c, i) => ({
    id: c.id,
    name: c.name,
    price: c.price,
    image: c.image,
    active: true,
    sortOrder: i,
  }));
}

function categorySection(
  section: Omit<CmsHomeCategorySection, "cards">,
  cards: { id: string; name: string; price: string; image: string }[]
): CmsHomeCategorySection {
  return { ...section, cards: toCards(cards) };
}

export function buildDefaultHomePage(): CmsHomePage {
  const salonName = site.name.split(" ")[0];
  const ts = new Date().toISOString();

  return {
    hero: {
      imageUrl:
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1920&q=85",
      badgeText: `Doorstep luxury · ${salonName}`,
      kicker: site.tagline,
      titleLine1: "Salon-grade beauty,",
      titleLine2: "without leaving home",
      description: site.description,
      footnote:
        "Bridal · Mehndi · Hair · Skin · Nails — one message away on WhatsApp",
      primaryBtnLabel: "Book appointment",
      primaryBtnHref: "/book",
      secondaryBtnLabel: "Explore services",
      secondaryBtnHref: "/services",
      trustItems: [
        {
          value: "3 cities",
          label: "Jhelum · Dina · Gujrat",
          hint: "We travel to you",
        },
        {
          value: "8AM – 10PM",
          label: "Morning to evening",
          hint: "Flexible home slots",
        },
        {
          value: "Full setup",
          label: "Light · mirror · kit",
          hint: "Salon at your door",
        },
        {
          value: "48 hrs",
          label: "Booking confirmed",
          hint: "Clear quote upfront",
        },
      ],
    },
    makeup: categorySection(
      {
        kicker: "Makeup services",
        title: "Signature looks for every celebration",
        subtitle:
          "Bridal, walima, and event artistry — priced clearly, booked in one step.",
        viewAllHref: "/services/makeup",
        viewAllLabel: "Makeup menu",
        sectionIndex: "01",
        variant: "default",
      },
      homeMakeupCards
    ),
    offers: {
      kicker: "Limited offers",
      title: "Packages & special deals",
      subtitle: `Active offers from ${site.name} — swipe through our best home-service packages.`,
      sectionIndex: "02",
    },
    hair: categorySection(
      {
        kicker: "Hair services",
        title: "Cuts, colour & bridal styling",
        subtitle:
          "Precision cuts, rich colour, keratin care, and event-ready hairstyles — at your doorstep.",
        viewAllHref: "/services/hair",
        viewAllLabel: "Hair menu",
        sectionIndex: "04",
        variant: "default",
      },
      homeHairCards
    ),
    facial: categorySection(
      {
        kicker: "Facial services",
        title: "Glow, brighten & bridal skin prep",
        subtitle:
          "From everyday glow to pre-bridal facials — customised for your skin and Punjab climate.",
        viewAllHref: "/services/facial",
        viewAllLabel: "Facial menu",
        sectionIndex: "05",
        variant: "alt",
      },
      homeFacialCards
    ),
    nails: categorySection(
      {
        kicker: "Nail services",
        title: "Mani, pedi & nail art",
        subtitle:
          "Gel polish, classic mani-pedi, bridal nail art, and extensions — salon-finish nails at home.",
        viewAllHref: "/services/nails",
        viewAllLabel: "Nails menu",
        sectionIndex: "06",
        variant: "default",
      },
      homeNailsCards
    ),
    waxing: categorySection(
      {
        kicker: "Waxing services",
        title: "Smooth, hygienic body waxing",
        subtitle:
          "Full or partial waxing with gentle prep and aftercare — silky skin without leaving home.",
        viewAllHref: "/services/body-spa",
        viewAllLabel: "Wax menu",
        sectionIndex: "07",
        variant: "default",
      },
      homeWaxingCards
    ),
    mehndi: categorySection(
      {
        kicker: "Mehndi services",
        title: "Bridal trails & festive henna",
        subtitle:
          "Arabic vines, dense bridal sets, and quick Eid motifs — rich paste, lasting stain.",
        viewAllHref: "/services/mehndi",
        viewAllLabel: "Mehndi menu",
        sectionIndex: "08",
        variant: "alt",
      },
      homeMehndiCards
    ),
    why: {
      kicker: "Why us",
      title: "The Huma promise",
      subtitle:
        "Three reasons families across Jhelum, Dina & Gujrat choose us for every celebration.",
      sectionIndex: "09",
      cards: [
        {
          id: "why-1",
          title: "Doorstep luxury",
          desc: "Full salon setup at your home — no salon visit needed.",
        },
        {
          id: "why-2",
          title: "Bridal specialists",
          desc: "Makeup, mehndi & hair artists for your full wedding journey.",
        },
        {
          id: "why-3",
          title: "Honest pricing",
          desc: "Clear rates on every service — no hidden charges at arrival.",
        },
      ],
    },
    team: {
      kicker: "Our team",
      title: "Artists behind your glow",
      subtitle:
        "Certified makeup artists, mehndi specialists, and hair stylists — all home-ready.",
      sectionIndex: "10",
    },
    steps: {
      kicker: "Process",
      title: "Your journey",
      subtitle:
        "From first message to final touch-up — a calm, clear booking flow at your home.",
      sectionIndex: "11",
      items: [
        {
          id: "step-1",
          number: "01",
          title: "Book appointment",
          desc: "Share your date and preferred service.",
        },
        {
          id: "step-2",
          number: "02",
          title: "Trial setup",
          desc: "Optional trial for bridal and special events.",
        },
        {
          id: "step-3",
          number: "03",
          title: "Confirm booking",
          desc: "We confirm timing and personalize your plan.",
        },
        {
          id: "step-4",
          number: "04",
          title: "Enjoy service",
          desc: "Relax — our artists take care of the rest.",
        },
      ],
    },
    testimonials: {
      kicker: "Testimonials",
      title: "Loved by our clients",
      subtitle: "Brides, party guests, and families who booked us at home.",
      sectionIndex: "13",
      items: [
        {
          id: "t-1",
          quote:
            "The attention to detail was impeccable — a traditional yet modern bridal look that stayed flawless all day. I felt like royalty.",
          name: "Ayesha Malik",
          role: "Bridal client",
        },
        {
          id: "t-2",
          quote:
            "The colorist listened and delivered vibrant, healthy hair. The salon's expertise is unmatched — I'm already planning my next visit.",
          name: "Fizza Khan",
          role: "Color & styling",
        },
        {
          id: "t-3",
          quote:
            "Professional, calm, and thorough. My skin was glowing after the facial — truly a luxury experience from start to finish.",
          name: "Hura Kaleem",
          role: "Facial treatment",
        },
        {
          id: "t-4",
          quote:
            "Party makeup that lasted all night with a lightweight feel. Compliments everywhere — thank you for the confidence boost.",
          name: "Aeman Khan",
          role: "Event makeup",
        },
      ],
    },
    cta: {
      trustPoints: [
        "Certified staff",
        "Hygiene protocol",
        "Premium products",
        "On-time slots",
      ],
      proofCards: [],
      title: "Book your appointment now",
      subtitle: "Tell us your preferred date — we will confirm within 48 hours.",
      buttonLabel: "Schedule visit",
      buttonHref: "/book",
    },
    updatedAt: ts,
  };
}
