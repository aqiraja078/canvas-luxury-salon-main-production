import { allWaxingServiceNames } from "@/lib/waxing-services-data";
import { allFacialServiceNames } from "@/lib/facial-services-data";
import { allHairServiceNames } from "@/lib/hair-services-data";
import { allMakeupServiceNames } from "@/lib/makeup-services-data";
import { allMehndiServiceNames } from "@/lib/mehndi-services-data";
import { allNailsServiceNames } from "@/lib/nails-services-data";

export const site = {
  name: "Huma Beauty Saloon",
  tagline: "Premium beauty saloon Jhelum",
  description:
    "At Huma Beauty Saloon, we blend artistry, luxury, and care to create beautiful experiences that leave you feeling confident, radiant, and unforgettable.",
  email: "humaaqi96@gmail.com",
  phone: "+92 335 5462214",
  phoneDigits: "923355462214",
  serviceAreas: ["Jhelum", "Dina", "Gujrat"] as const,
  address: "Jhelum, Dina and Gujrat",
  social: {
    instagram: "https://www.instagram.com/huma_beauty.saloon/",
    facebook: "https://www.instagram.com/huma_beauty.saloon/",
    tiktok: "https://www.tiktok.com/@humabeautysaloonjhe",
  },
} as const;

export function whatsappUrl(message?: string): string {
  const text =
    message ??
    `Hello ${site.name}, I would like to book an appointment.`;
  return `https://wa.me/${site.phoneDigits}?text=${encodeURIComponent(text)}`;
}

export const serviceCategories = [
  {
    slug: "hair",
    title: "Hair",
    short: "Precision cuts, rich colour, treatments & bridal styling at home.",
    href: "/services/hair",
    image:
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=900&q=85",
    price: "Starting at PKR 2,000",
  },
  {
    slug: "facial",
    title: "Facial",
    short: "Skin-first facials — glow, brightening, acne care & bridal prep.",
    href: "/services/facial",
    image:
      "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=900&q=85",
    price: "Starting at PKR 3,000",
  },
  {
    slug: "body-spa",
    title: "Wax",
    short: "Full & partial body wax, area waxing, and pre/post wax care at home.",
    href: "/services/body-spa",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=900&q=85",
    price: "Starting at PKR 150",
  },
  {
    slug: "nails",
    title: "Nail, mani & pedi",
    short: "Flawless mani-pedi, gel polish, nail art & extensions.",
    href: "/services/nails",
    image:
      "https://i.pinimg.com/1200x/02/ea/e1/02eae1fc1f0e7c9f4bfa52ee8347a941.jpg",
    price: "Starting at PKR 1,200",
  },
  {
    slug: "mehndi",
    title: "Mehndi",
    short: "Bridal, Arabic, Indo-Pak & feet mehndi for every celebration.",
    href: "/services/mehndi",
    image:
      "https://i.pinimg.com/736x/ae/84/5f/ae845fba0f519d795710e90bf6a866ec.jpg",
    price: "Starting at PKR 1,500",
  },
  {
    slug: "makeup",
    title: "Makeup",
    short: "Bridal glam, party looks & HD makeup that lasts all day.",
    href: "/services/makeup",
    image:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=900&q=85",
    price: "Starting at PKR 5,000",
  },
] as const;

const bookingServicesBase = [
  "Bridal Makeup",
  "Party / Event Makeup",
  "Hair Color & Styling",
  "Facial Treatment",
  "Body Waxing",
  "Manicure & Pedicure",
  "Laser Hair Removal",
  "Consultation / Trial",
] as const;

/** Salon-wide bookable labels including all service menus. */
export const bookingServices: string[] = Array.from(
  new Set<string>([
    ...allHairServiceNames(),
    ...allFacialServiceNames(),
    ...allWaxingServiceNames(),
    ...allNailsServiceNames(),
    ...allMehndiServiceNames(),
    ...allMakeupServiceNames(),
    ...bookingServicesBase,
  ])
).sort((a, b) => a.localeCompare(b));
