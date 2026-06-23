"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { CmsTeamMember, CmsTeamSection } from "@/lib/cms-types";
import { site } from "@/lib/site";

type SkillItem = {
  title: string;
  description: string;
  icon: "makeup" | "hair" | "mehndi" | "skin";
};

const SKILL_CATALOG: Array<SkillItem & { match: RegExp }> = [
  {
    match: /bridal|makeup/i,
    title: "Bridal Makeup Expert",
    description: "Flawless, long-lasting looks tailored to your style.",
    icon: "makeup",
  },
  {
    match: /hair/i,
    title: "Hair Styling",
    description: "Elegant hairstyles that complete your bridal look.",
    icon: "hair",
  },
  {
    match: /mehndi/i,
    title: "Mehndi Specialist",
    description: "Traditional & modern mehndi designs for every occasion.",
    icon: "mehndi",
  },
  {
    match: /skin|facial|beauty/i,
    title: "Skin & Beauty Care",
    description: "Personalized skincare and beauty treatments.",
    icon: "skin",
  },
];

const DEFAULT_SKILLS: SkillItem[] = SKILL_CATALOG.map(
  ({ title, description, icon }) => ({ title, description, icon })
);

function memberSkills(member: CmsTeamMember): SkillItem[] {
  if (member.skills && member.skills.length > 0) {
    return member.skills.slice(0, 4).map((skill) => ({
      title: skill.title,
      description: skill.description,
      icon: SKILL_CATALOG.find((s) => s.match.test(skill.title))?.icon ?? "skin",
    }));
  }
  const picked: SkillItem[] = [];
  for (const spec of member.specialties) {
    const found = SKILL_CATALOG.find((s) => s.match.test(spec));
    if (found && !picked.some((p) => p.title === found.title)) {
      picked.push({ title: found.title, description: found.description, icon: found.icon });
    }
  }
  for (const fallback of DEFAULT_SKILLS) {
    if (picked.length >= 4) break;
    if (!picked.some((p) => p.title === fallback.title)) picked.push(fallback);
  }
  return picked.slice(0, 4);
}

function aboutDetail(member: CmsTeamMember, section: CmsTeamSection): string {
  if (member.aboutText?.trim()) return member.aboutText.trim();
  const years = member.experienceYears ?? 6;
  const lead = section.aboutLeadTemplate
    .replaceAll("{years}", String(years))
    .replaceAll("{name}", member.name);
  return member.bio.length > 140 ? member.bio : `${lead} ${member.bio}`;
}

function aboutHeading(member: CmsTeamMember, section: CmsTeamSection): string {
  return section.aboutHeadingTemplate.replaceAll("{name}", member.name);
}

function SkillIcon({ type }: { type: SkillItem["icon"] }) {
  const cls = "team-artists-skill__icon-svg";
  switch (type) {
    case "makeup":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path d="M12 3c-3 0-5 2.5-5 6v2h10v-2c0-3.5-2-6-5-6Z" strokeLinecap="round" />
          <path d="M7 11v2c0 4 2.5 7 5 7s5-3 5-7v-2" strokeLinecap="round" />
          <path d="M9 7h6" strokeLinecap="round" />
        </svg>
      );
    case "hair":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path d="M8 4c0 4 2 6 4 8 2-2 4-4 4-8" strokeLinecap="round" />
          <path d="M6 20c2-6 4-8 6-8s4 2 6 8" strokeLinecap="round" />
        </svg>
      );
    case "mehndi":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path d="M12 4v16M8 8c2 2 4 2 4 4M16 8c-2 2-4 2-4 4" strokeLinecap="round" />
          <circle cx="12" cy="18" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      );
    default:
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <circle cx="12" cy="9" r="4" />
          <path d="M5 20c0-4 3-6 7-6s7 2 7 6" strokeLinecap="round" />
        </svg>
      );
  }
}

function StatIcon({ type }: { type: "star" | "clients" | "heart" | "location" }) {
  const cls = "team-artists-stat__icon-svg";
  switch (type) {
    case "star":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path d="M12 3l2.4 5.8L21 10l-4.5 4.2L17.5 21 12 17.8 6.5 21l1-6.8L3 10l6.6-1.2L12 3Z" strokeLinejoin="round" />
        </svg>
      );
    case "clients":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <circle cx="9" cy="8" r="3" />
          <circle cx="17" cy="10" r="2.5" />
          <path d="M3 20c0-3.5 2.5-5.5 6-5.5s6 2 6 5.5" strokeLinecap="round" />
          <path d="M17 14c2.5.5 4 2 4 5" strokeLinecap="round" />
        </svg>
      );
    case "heart":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.5-7 10-7 10Z" strokeLinejoin="round" />
        </svg>
      );
    default:
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path d="M12 21s7-5.2 7-11a7 7 0 0 0-14 0c0 5.8 7 11 7 11Z" strokeLinejoin="round" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      );
  }
}

function SocialIcon({ type }: { type: "instagram" | "facebook" | "phone" }) {
  const cls = "team-artists-social__icon";
  if (type === "instagram") {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (type === "facebook") {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path d="M14 8h3V5h-3c-2.2 0-4 1.8-4 4v2H7v3h3v7h3v-7h3l1-3h-4V9c0-.6.4-1 1-1Z" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" strokeLinejoin="round" />
    </svg>
  );
}

function memberImageSrc(member: CmsTeamMember, section: CmsTeamSection): string {
  if (!member.imageUrl?.trim()) return section.defaultMemberImage;
  const base = member.imageUrl.trim();
  const version = encodeURIComponent(member.updatedAt || member.id);
  return base.includes("?") ? `${base}&v=${version}` : `${base}?v=${version}`;
}

function MemberImage({
  member,
  section,
}: {
  member: CmsTeamMember;
  section: CmsTeamSection;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={memberImageSrc(member, section)}
      alt={member.name}
      className="absolute inset-0 h-full w-full object-cover object-top"
    />
  );
}

const STAT_ICONS = ["star", "clients", "heart", "location"] as const;

function resolveStatValue(template: string, years: number): string {
  return template.replaceAll("{years}", String(years));
}

export function TeamArtistsCarousel({
  members,
  section,
}: {
  members: CmsTeamMember[];
  section: CmsTeamSection;
}) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const count = members.length;
  const member = members[index];

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + count) % count);
  }, [count]);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % count);
  }, [count]);

  if (!member) return null;

  const skills = memberSkills(member);
  const years = member.experienceYears ?? 6;
  const stats = section.stats.map((stat, idx) => ({
    value: resolveStatValue(stat.value, years),
    label: stat.label,
    icon: STAT_ICONS[idx % STAT_ICONS.length],
  }));

  const slideKey = member.id;
  const slideAnim = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
        transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <div className="team-artists-layout">
      <article className="team-artists-profile">
        <div className="team-artists-profile__media">
          <AnimatePresence mode="wait">
            <motion.div key={slideKey} className="team-artists-profile__media-inner" {...slideAnim}>
              <MemberImage member={member} section={section} />
            </motion.div>
          </AnimatePresence>

          {count > 1 ? (
            <>
              <button
                type="button"
                className="team-artists-nav team-artists-nav--prev"
                onClick={prev}
                aria-label="Previous artist"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                className="team-artists-nav team-artists-nav--next"
                onClick={next}
                aria-label="Next artist"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </>
          ) : null}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={slideKey} className="team-artists-profile__body" {...slideAnim}>
            <h3 className="team-artists-profile__name">{member.name}</h3>
            <p className="team-artists-profile__role">{member.role}</p>
            <div className="team-artists-profile__rule" aria-hidden />
            <p className="team-artists-profile__bio">{member.bio}</p>

            <div className="team-artists-social">
              {member.instagram ? (
                <a
                  href={member.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="team-artists-social__link"
                  aria-label={`${member.name} on Instagram`}
                >
                  <SocialIcon type="instagram" />
                </a>
              ) : null}
              {member.facebook ? (
                <a
                  href={member.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="team-artists-social__link"
                  aria-label={`${member.name} on Facebook`}
                >
                  <SocialIcon type="facebook" />
                </a>
              ) : (
                <a
                  href={site.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="team-artists-social__link"
                  aria-label="Facebook"
                >
                  <SocialIcon type="facebook" />
                </a>
              )}
              <a
                href={
                  member.phone
                    ? member.phone.startsWith("tel:")
                      ? member.phone
                      : `tel:${member.phone.replace(/\D/g, "")}`
                    : `tel:+${site.phoneDigits}`
                }
                className="team-artists-social__link"
                aria-label="Call"
              >
                <SocialIcon type="phone" />
              </a>
            </div>
          </motion.div>
        </AnimatePresence>
      </article>

      <article className="team-artists-detail">
        <AnimatePresence mode="wait">
          <motion.div key={slideKey} className="team-artists-detail__inner" {...slideAnim}>
            <div className="team-artists-detail__about">
              <h3 className="team-artists-detail__heading">
                {aboutHeading(member, section)}
              </h3>
              <div className="team-artists-detail__rule" aria-hidden />
              <p className="team-artists-detail__text">
                {aboutDetail(member, section)}
              </p>
            </div>

            <div className="team-artists-skills">
              {skills.map((skill) => (
                <div key={skill.title} className="team-artists-skill">
                  <span className="team-artists-skill__icon" aria-hidden>
                    <SkillIcon type={skill.icon} />
                  </span>
                  <div>
                    <p className="team-artists-skill__title">{skill.title}</p>
                    <p className="team-artists-skill__desc">{skill.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="team-artists-stats">
              {stats.map((stat) => (
                <div key={stat.label} className="team-artists-stat">
                  <StatIcon type={stat.icon} />
                  <p className="team-artists-stat__value">{stat.value}</p>
                  <p className="team-artists-stat__label">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </article>
    </div>
  );
}
