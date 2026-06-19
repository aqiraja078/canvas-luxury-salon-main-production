import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/lib/site";

const PILLARS = [
  {
    icon: "◆",
    title: "We come to you",
    text: "Professional lighting, sanitised kit, and calm setup — your home becomes our studio.",
  },
  {
    icon: "◎",
    title: "Bridal-first care",
    text: "Makeup, mehndi, and hair artists who understand walima, mehndi, and barat timelines.",
  },
  {
    icon: "✦",
    title: "Honest & warm",
    text: "Clear pricing before we arrive. The patience we'd give our own family on wedding day.",
  },
] as const;

const AREAS = ["Jhelum", "Dina", "Gujrat"] as const;

export function HomeAboutSection() {
  const salonName = site.name.split(" ")[0];

  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-[#060606] px-4 py-16 sm:px-6 md:px-8 md:py-28">
      {/* Background ornaments */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_0%_50%,rgba(201,169,98,0.08),transparent_55%),radial-gradient(ellipse_50%_40%_at_100%_20%,rgba(201,169,98,0.05),transparent_50%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `repeating-linear-gradient(-14deg, transparent, transparent 72px, rgba(201,169,98,0.9) 72px, rgba(201,169,98,0.9) 73px)`,
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10 xl:gap-14">
          {/* Visual column */}
          <Reveal className="relative lg:col-span-5 xl:col-span-5">
            <div className="relative">
              <div className="absolute -left-3 top-8 hidden h-[calc(100%-4rem)] w-px bg-gradient-to-b from-transparent via-gold/50 to-transparent sm:block" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] rounded-tr-[3rem] border border-gold/30 shadow-[0_24px_80px_-24px_rgba(201,169,98,0.35)]">
                <Image
                  src="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=900&q=85"
                  alt={`${site.name} — home beauty artistry`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_0%,rgba(201,169,98,0.15),transparent)]" />
              </div>

              {/* Floating quote card */}
              <div className="absolute -bottom-5 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-[240px]">
                <div className="rounded-2xl border border-gold/35 bg-black/85 px-5 py-4 backdrop-blur-xl">
                  <p className="font-display text-lg leading-snug text-gold-light">
                    Salon results.
                  </p>
                  <p className="font-display text-lg leading-snug text-white">
                    Your doorstep.
                  </p>
                </div>
              </div>

              {/* Stat strip */}
              <div className="absolute -right-2 top-6 hidden flex-col gap-2 sm:flex">
                {[
                  { v: "8–10 PM", l: "Daily hours" },
                  { v: "3", l: "Cities" },
                ].map((s) => (
                  <div
                    key={s.l}
                    className="rounded-xl border border-white/10 bg-black/70 px-3 py-2 text-center backdrop-blur-md"
                  >
                    <p className="font-display text-sm text-gold-light">{s.v}</p>
                    <p className="text-[9px] uppercase tracking-[0.16em] text-white/45">
                      {s.l}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Copy column */}
          <div className="lg:col-span-7 xl:col-span-7 lg:pl-4">
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gold/35 bg-gradient-to-br from-gold/25 to-transparent font-display text-xl text-gold-light shadow-[0_0_30px_-8px_rgba(201,169,98,0.45)]">
                  {salonName.charAt(0)}
                </span>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.38em] text-gold/90">
                    About {salonName}
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-white/35">
                    Home beauty · since day one
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.06}>
              <h2 className="mt-8 font-display text-3xl leading-[1.12] text-white sm:text-4xl md:text-[2.75rem]">
                Your home,
                <span className="block bg-gradient-to-r from-gold-light via-gold to-gold-dark bg-clip-text text-transparent">
                  our quiet luxury studio
                </span>
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-white/72 sm:text-lg">
                {site.name} was built for brides, working women, and families who want
                salon-level results without the travel. We arrive with professional
                lighting, sanitised tools, and artists trained in bridal makeup,
                mehndi, hair, and skin care.
              </p>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/55">
                Serving {AREAS.join(", ")} with the same patience we&apos;d give our own
                sister on her wedding — consultation first, pressure never.
              </p>
            </Reveal>

            <Reveal delay={0.14}>
              <div className="mt-8 flex flex-wrap gap-2">
                {AREAS.map((area) => (
                  <span
                    key={area}
                    className="rounded-full border border-gold/25 bg-gold/10 px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-gold-light"
                  >
                    {area}
                  </span>
                ))}
                <span className="rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-white/55">
                  Doorstep only
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/about"
                  className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light px-8 text-xs font-semibold uppercase tracking-[0.2em] text-black transition hover:opacity-90"
                >
                  Read our story
                </Link>
                <Link
                  href="/book"
                  className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/20 bg-white/[0.04] px-8 text-xs font-semibold uppercase tracking-[0.2em] text-white/85 transition hover:border-gold/40 hover:text-gold"
                >
                  Book a visit
                </Link>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Pillars — unique to this section */}
        <div className="mt-16 grid gap-4 sm:mt-20 sm:grid-cols-3 sm:gap-5">
          {PILLARS.map((p, idx) => (
            <Reveal key={p.title} delay={0.08 + idx * 0.06} scale>
              <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent p-6 transition duration-300 hover:border-gold/30">
                <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-gold/60 via-gold/20 to-transparent opacity-0 transition group-hover:opacity-100" />
                <span className="font-display text-2xl text-gold/80" aria-hidden>
                  {p.icon}
                </span>
                <h3 className="mt-4 font-display text-lg text-white">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
