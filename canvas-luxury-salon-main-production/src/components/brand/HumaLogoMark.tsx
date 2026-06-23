"use client";

import { useId } from "react";
import { site } from "@/lib/site";

type Props = {
  size?: number;
  className?: string;
  title?: string;
};

/** Compact ornate monogram — circle H with gold flourishes. */
export function HumaLogoMark({
  size = 48,
  className = "",
  title = site.name,
}: Props) {
  const gold = `huma-mark-gold-${useId().replace(/:/g, "")}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`huma-logo__mark shrink-0 ${className}`.trim()}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <defs>
        <linearGradient id={gold} x1="8" y1="6" x2="64" y2="66">
          <stop offset="0%" stopColor="#f5e8c8" />
          <stop offset="45%" stopColor="#c9a962" />
          <stop offset="100%" stopColor="#8b7340" />
        </linearGradient>
      </defs>

      <path
        d="M8 28 C4 22 6 16 12 14 C10 18 10 24 14 26 Z"
        fill={`url(#${gold})`}
        opacity="0.9"
      />
      <path
        d="M64 28 C68 22 66 16 60 14 C62 18 62 24 58 26 Z"
        fill={`url(#${gold})`}
        opacity="0.9"
      />

      <circle
        cx="36"
        cy="36"
        r="26"
        fill="transparent"
        stroke={`url(#${gold})`}
        strokeWidth="1.6"
      />
      <circle cx="36" cy="36" r="22" stroke="#c9a962" strokeWidth="0.55" opacity="0.4" />

      <path
        d="M24 24 V48 M48 24 V48"
        stroke={`url(#${gold})`}
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      <path
        d="M24 36 C28 32 44 32 48 36"
        stroke={`url(#${gold})`}
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />

      <path
        d="M33 14 L36 10 L39 14"
        stroke="#f5e6bc"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="36" cy="8" r="1.5" fill="#f5e6bc" />
    </svg>
  );
}
