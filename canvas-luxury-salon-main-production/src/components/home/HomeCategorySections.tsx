import { HomeCategoryServicesRow } from "@/components/home/HomeCategoryServicesRow";
import {
  homeFacialCards,
  homeHairCards,
  homeMehndiCards,
  homeWaxingCards,
} from "@/lib/home-category-cards";

export function HomeHairServices() {
  return (
    <HomeCategoryServicesRow
      kicker="Hair services"
      title="Cuts, colour & bridal styling"
      subtitle="Precision cuts, rich colour, keratin care, and event-ready hairstyles — at your doorstep."
      cards={homeHairCards}
      viewAllHref="/services/hair"
      viewAllLabel="Hair menu"
      sectionIndex="04"
    />
  );
}

export function HomeFacialServices() {
  return (
    <HomeCategoryServicesRow
      kicker="Facial services"
      title="Glow, brighten & bridal skin prep"
      subtitle="From everyday glow to pre-bridal facials — customised for your skin and Punjab climate."
      cards={homeFacialCards}
      viewAllHref="/services/facial"
      viewAllLabel="Facial menu"
      variant="alt"
      sectionIndex="05"
    />
  );
}

export function HomeWaxingServices() {
  return (
    <HomeCategoryServicesRow
      kicker="Waxing services"
      title="Smooth, hygienic body waxing"
      subtitle="Full or partial waxing with gentle prep and aftercare — silky skin without leaving home."
      cards={homeWaxingCards}
      viewAllHref="/services/body-spa"
      viewAllLabel="Wax menu"
      sectionIndex="06"
    />
  );
}

export function HomeMehndiServices() {
  return (
    <HomeCategoryServicesRow
      kicker="Mehndi services"
      title="Bridal trails & festive henna"
      subtitle="Arabic vines, dense bridal sets, and quick Eid motifs — rich paste, lasting stain."
      cards={homeMehndiCards}
      viewAllHref="/services/mehndi"
      viewAllLabel="Mehndi menu"
      variant="alt"
      sectionIndex="07"
    />
  );
}
