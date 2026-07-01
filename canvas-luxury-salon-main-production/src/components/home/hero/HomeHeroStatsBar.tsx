import type { CmsHomeHeroTrust } from "@/lib/cms-types";
import { heroBottomStats, statIconForLabel } from "@/lib/hero-cms-utils";
import { HERO_STAT_ICONS } from "@/components/home/hero/HeroIcons";

type Props = {
  trustItems: CmsHomeHeroTrust[];
};

export function HomeHeroStatsBar({ trustItems }: Props) {
  const stats = heroBottomStats(trustItems);
  if (stats.length === 0) return null;

  return (
    <div className="hero-luxury__stats-wrap hero-luxury__reveal hero-luxury__reveal--8">
      <div className="hero-luxury__stats-card">
        <div className="hero-luxury__stats-grid">
          {stats.map((stat) => {
            const Icon = HERO_STAT_ICONS[statIconForLabel(stat.label)];
            return (
              <div key={stat.label} className="hero-luxury__stat-item group">
                <div className="hero-luxury__stat-icon">
                  <Icon className="h-5 w-5 text-gold-light" />
                </div>
                <p className="hero-luxury__stat-value">{stat.value}</p>
                <p className="hero-luxury__stat-label">{stat.label}</p>
                {stat.hint ? (
                  <p className="hero-luxury__stat-hint">{stat.hint}</p>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
