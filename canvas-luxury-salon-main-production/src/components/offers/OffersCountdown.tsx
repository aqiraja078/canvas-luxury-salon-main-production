"use client";

import { useEffect, useState } from "react";

type Props = {
  endsAt: string;
};

type TimeLeft = {
  days: number;
  hours: number;
  mins: number;
  secs: number;
};

function calcTimeLeft(endsAt: string): TimeLeft | null {
  const diff = new Date(endsAt).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    mins: Math.floor((diff / (1000 * 60)) % 60),
    secs: Math.floor((diff / 1000) % 60),
  };
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export function OffersCountdown({ endsAt }: Props) {
  const [time, setTime] = useState<TimeLeft | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const tick = () => setTime(calcTimeLeft(endsAt));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [endsAt]);

  if (!mounted || !time) return null;

  const units = [
    { value: pad(time.days), label: "Days" },
    { value: pad(time.hours), label: "Hours" },
    { value: pad(time.mins), label: "Mins" },
    { value: pad(time.secs), label: "Secs" },
  ];

  return (
    <section className="offers-countdown" aria-label="Offer countdown">
      <div className="offers-countdown__head">
        <span className="offers-countdown__icon" aria-hidden>
          ⏰
        </span>
        <p className="offers-countdown__text">
          <span className="offers-countdown__accent">Hurry up!</span> Offer ends in
        </p>
      </div>
      <div className="offers-countdown__grid">
        {units.map((unit) => (
          <div key={unit.label} className="offers-countdown__unit">
            <span className="offers-countdown__value">{unit.value}</span>
            <span className="offers-countdown__label">{unit.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
