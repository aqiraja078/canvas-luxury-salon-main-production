import type { ReactNode } from "react";
import { HomeSection } from "@/components/home/HomeSection";
import { Reveal } from "@/components/ui/Reveal";
import { TeamArtistsCarousel } from "@/components/team/TeamArtistsCarousel";
import type { CmsTeamMember } from "@/lib/cms-types";

type TeamArtistsSectionProps = {
  kicker: string;
  title: ReactNode;
  subtitle?: string;
  index?: string;
  members: CmsTeamMember[];
  limit?: number;
};

function TeamArtistsHeader({
  kicker,
  title,
  subtitle,
  index,
}: Pick<TeamArtistsSectionProps, "kicker" | "title" | "subtitle" | "index">) {
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
  kicker,
  title,
  subtitle,
  index,
  members,
  limit,
}: TeamArtistsSectionProps) {
  const visible = limit ? members.slice(0, limit) : members;

  if (visible.length === 0) {
    return (
      <HomeSection tone="midnight" className="team-artists-section">
        <TeamArtistsHeader
          kicker={kicker}
          title={title}
          subtitle={subtitle}
          index={index}
        />
        <p className="team-artists-section__empty">
          Our artist profiles are being updated. Check back soon.
        </p>
      </HomeSection>
    );
  }

  return (
    <HomeSection tone="midnight" className="team-artists-section">
      <TeamArtistsHeader
        kicker={kicker}
        title={title}
        subtitle={subtitle}
        index={index}
      />
      <Reveal delay={0.08}>
        <TeamArtistsCarousel members={visible} />
      </Reveal>
    </HomeSection>
  );
}
