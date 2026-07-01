import {
  HeroIconBadge,
  HeroIconHome,
  HeroIconShield,
  HeroIconSparkles,
} from "@/components/home/hero/HeroIcons";

const FEATURES = [
  { icon: HeroIconBadge, label: "Verified Experts" },
  { icon: HeroIconSparkles, label: "Premium Products" },
  { icon: HeroIconShield, label: "100% Hygienic" },
  { icon: HeroIconHome, label: "Doorstep Service" },
] as const;

export function HomeHeroFeatureStrip() {
  return (
    <div className="hero-luxury__features hero-luxury__reveal hero-luxury__reveal--7">
      <div className="hero-luxury__features-inner">
        {FEATURES.map(({ icon: Icon, label }) => (
          <div key={label} className="hero-luxury__feature-item">
            <div className="hero-luxury__feature-icon">
              <Icon className="h-4 w-4 text-gold-light" />
            </div>
            <p className="hero-luxury__feature-label">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
