import { getPublicSiteOrigin } from "@/lib/public-site-url";
import { site } from "@/lib/site";

export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    name: site.name,
    description: site.description,
    url: getPublicSiteOrigin(),
    image: `${getPublicSiteOrigin()}/logo.svg`,
    logo: `${getPublicSiteOrigin()}/logo.svg`,
    telephone: site.phone,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address,
      addressLocality: "Jhelum, Dina, Gujrat",
      addressRegion: "Punjab",
      addressCountry: "PK",
    },
    priceRange: "$$",
    areaServed: site.serviceAreas.map((area) => ({
      "@type": "City",
      name: area,
    })),
    sameAs: [site.social.instagram, site.social.tiktok],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      bestRating: "5",
      ratingCount: "500",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
