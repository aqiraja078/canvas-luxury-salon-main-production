import type { ReactNode } from "react";
import { HomeSection } from "@/components/home/HomeSection";
import { Reveal } from "@/components/ui/Reveal";
import { TeamArtistsCarousel } from "@/components/team/TeamArtistsCarousel";
import type { CmsTeamMember, CmsTeamSection } from "@/lib/cms-types";

type TeamArtistsSectionProps = {
  section: CmsTeamSection;
  members: CmsTeamMember[];
  limit?: number;
};

function TeamArtistsHeader({
  kicker,
  title,
  subtitle,
  index,
}: {
  kicker: string;
  title: ReactNode;
  subtitle?: string;
  index?: string;
}) {
  return (
    <div className="home-section-header home-section-header--center team-artists-header">
      {index ? (
        <span className="home-section-header__index" aria-hidden>
          {index}
        </span>
      ) : null}
      <div className="mx-auto max-w-3xl">
        <p className="team-artists-header__kicker">
          <span className="team-artists-header__line" aria-hidden />
          <span className="team-artists-header__diamond" aria-hidden>
            ◆
          </span>
          <span>{kicker}</span>
          <span className="team-artists-header__diamond" aria-hidden>
            ◆
          </span>
          <span className="team-artists-header__line" aria-hidden />
        </p>
        <h2 className="home-section-header__title">{title}</h2>
        {subtitle ? (
          <p className="home-section-header__subtitle">{subtitle}</p>
        ) : null}
      </div>
    </div>
  );
}

export function TeamArtistsSection({
  section,
  members,
  limit,
}: TeamArtistsSectionProps) {
  const visible = limit ? members.slice(0, limit) : members;

  if (visible.length === 0) {
    return (
      <HomeSection tone="midnight" className="team-artists-section">
        <TeamArtistsHeader
          kicker={section.kicker}
          title={section.title}
          subtitle={section.subtitle}
          index={section.sectionIndex}
        />
        <p className="team-artists-section__empty">{section.emptyMessage}</p>
      </HomeSection>
    );
  }

  return (
    <HomeSection tone="midnight" className="team-artists-section">
      <TeamArtistsHeader
        kicker={section.kicker}
        title={section.title}
        subtitle={section.subtitle}
        index={section.sectionIndex}
      />
      <Reveal delay={0.08}>
        <TeamArtistsCarousel members={visible} section={section} />
      </Reveal>
    </HomeSection>
  );
}
