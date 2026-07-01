import type { HeroFloatingCard } from "@/components/home/hero/home-hero-constants";

type Props = {
  cards: HeroFloatingCard[];
};

function Stars() {
  return (
    <span className="inline-flex gap-0.5 text-[#F5E6A7]" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className="text-[10px] leading-none">
          ★
        </span>
      ))}
    </span>
  );
}

export function HomeHeroFloatingCards({ cards }: Props) {
  return (
    <>
      {cards.map((card) => (
        <div
          key={card.id}
          className={`hero-luxury__float-card ${card.className}`}
          style={{ animationDelay: card.delay }}
        >
          <div className="hero-luxury__float-card-inner">
            {card.id === "google" ? (
              <>
                <div className="flex items-center gap-1.5">
                  <Stars />
                  <span className="font-display text-sm font-bold text-white">
                    {card.value}
                  </span>
                </div>
                <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-gold/90">
                  {card.label}
                </p>
              </>
            ) : (
              <>
                <p className="font-display text-base font-bold leading-none text-white">
                  {card.value}
                </p>
                <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-gold/85">
                  {card.label}
                </p>
              </>
            )}
          </div>
        </div>
      ))}
    </>
  );
}
