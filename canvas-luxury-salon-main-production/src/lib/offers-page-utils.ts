import type { CmsOffer } from "@/lib/cms-types";
import { site, whatsappUrl } from "@/lib/site";

export const OFFERS_HERO_IMAGE =
  "https://i.pinimg.com/1200x/68/64/65/68646592ddaac1f191d4100112a100e5.jpg";

export function offersHeroImage(_offers: CmsOffer[]): string {
  return OFFERS_HERO_IMAGE;
}

export function nearestOfferEndDate(offers: CmsOffer[]): string | null {
  const now = Date.now();
  const timestamps = offers
    .map((o) => o.endsAt)
    .filter((d): d is string => Boolean(d?.trim()))
    .map((d) => new Date(d).getTime())
    .filter((t) => !Number.isNaN(t) && t > now)
    .sort((a, b) => a - b);

  if (timestamps.length === 0) return null;
  return new Date(timestamps[0]).toISOString();
}

export function maxDiscountBadge(offers: CmsOffer[]): string {
  const percents = offers
    .map((o) => {
      const match = o.discountLabel.match(/(\d+)\s*%/);
      return match ? Number.parseInt(match[1], 10) : 0;
    })
    .filter((n) => n > 0);

  if (percents.length > 0) {
    return `UP TO ${Math.max(...percents)}% OFF`;
  }

  const first = offers[0]?.discountLabel?.trim();
  return first || "SPECIAL OFFER";
}

export function inferOfferTheme(text: string): "makeup" | "mehndi" | "hair" | "facial" | "bodySpa" | "nails" {
  const n = text.toLowerCase();
  if (n.includes("mehndi") || n.includes("henna")) return "mehndi";
  if (n.includes("nail") || n.includes("manicure") || n.includes("pedicure")) return "nails";
  if (n.includes("facial") || n.includes("skin")) return "facial";
  if (n.includes("wax") || n.includes("spa") || n.includes("massage")) return "bodySpa";
  if (n.includes("hair") || n.includes("cut") || n.includes("colour")) return "hair";
  return "makeup";
}

/** Split offer title into two lines like the reference card design. */
export function splitOfferTitle(title: string): { line1: string; line2: string } {
  const trimmed = title.trim();
  const parts = trimmed.split(/\s*[–—-]\s*/);
  if (parts.length >= 2) {
    return { line1: parts[0].trim(), line2: parts.slice(1).join(" ").trim() };
  }

  const words = trimmed.split(/\s+/);
  if (words.length <= 2) {
    return { line1: words[0] ?? trimmed, line2: words.slice(1).join(" ") };
  }

  const half = Math.ceil(words.length / 2);
  return {
    line1: words.slice(0, half).join(" "),
    line2: words.slice(half).join(" "),
  };
}

/** Pre-filled WhatsApp link for a specific offer card. */
export function offerWhatsAppUrl(
  offer: Pick<CmsOffer, "title" | "offerPrice" | "discountLabel">,
): string {
  const priceLine = offer.offerPrice
    ? ` Offer price: ${offer.offerPrice}.`
    : offer.discountLabel
      ? ` ${offer.discountLabel}.`
      : "";

  return whatsappUrl(
    `Hello ${site.name}, I would like to claim this offer: ${offer.title}.${priceLine} Please share availability and booking details.`,
  );
}
