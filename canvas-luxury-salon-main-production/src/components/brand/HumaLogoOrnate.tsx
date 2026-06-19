import { site } from "@/lib/site";

type Props = {
  width?: number;
  className?: string;
  title?: string;
};

const [, ...brandRest] = site.name.split(" ");
const brandLine = brandRest.join(" ").toUpperCase();

function Sparkle({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <path
      d={`M${cx} ${cy - r} L${cx + r * 0.28} ${cy - r * 0.28} L${cx + r} ${cy} L${cx + r * 0.28} ${cy + r * 0.28} L${cx} ${cy + r} L${cx - r * 0.28} ${cy + r * 0.28} L${cx - r} ${cy} L${cx - r * 0.28} ${cy - r * 0.28} Z`}
      fill="#f5e6bc"
    />
  );
}

/** Full vertical ornate logo — gold emblem, flourishes, Huma wordmark. */
export function HumaLogoOrnate({
  width = 168,
  className = "",
  title = site.name,
}: Props) {
  const height = Math.round(width * 1.35);

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 240 324"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`huma-logo-ornate shrink-0 ${className}`.trim()}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <defs>
        <linearGradient id="huma-ornate-gold" x1="40" y1="20" x2="200" y2="300">
          <stop offset="0%" stopColor="#f5e8c8" />
          <stop offset="35%" stopColor="#d4b978" />
          <stop offset="55%" stopColor="#c9a962" />
          <stop offset="100%" stopColor="#8b7340" />
        </linearGradient>
        <linearGradient id="huma-ornate-gold-soft" x1="120" y1="90" x2="120" y2="210">
          <stop offset="0%" stopColor="#fff8e8" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#c9a962" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Top flourishes */}
      <path
        d="M48 54 C34 42 18 44 12 58 C8 68 14 78 26 82 C20 72 22 60 34 56 C40 54 44 54 48 54 Z"
        fill="url(#huma-ornate-gold)"
        opacity="0.95"
      />
      <path
        d="M192 54 C206 42 222 44 228 58 C232 68 226 78 214 82 C220 72 218 60 206 56 C200 54 196 54 192 54 Z"
        fill="url(#huma-ornate-gold)"
        opacity="0.95"
      />
      <path
        d="M62 48 C72 34 88 30 98 38 M178 48 C168 34 152 30 142 38"
        stroke="url(#huma-ornate-gold)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* Circle emblem */}
      <circle cx="120" cy="72" r="34" fill="#0a0a0a" stroke="url(#huma-ornate-gold)" strokeWidth="1.8" />
      <circle cx="120" cy="72" r="29" stroke="#c9a962" strokeWidth="0.6" opacity="0.45" />

      {/* Stylised H with curved crossbar */}
      <path
        d="M102 54 V90 M138 54 V90"
        stroke="url(#huma-ornate-gold)"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M102 72 C108 66 132 66 138 72"
        stroke="url(#huma-ornate-gold)"
        strokeWidth="2.8"
        strokeLinecap="round"
        fill="none"
      />

      <Sparkle cx={120} cy={34} r={4.5} />
      <Sparkle cx={86} cy={58} r={3} />
      <Sparkle cx={154} cy={58} r={3} />

      {/* Upper rule */}
      <path d="M52 112 H208" stroke="url(#huma-ornate-gold)" strokeWidth="0.9" opacity="0.85" />
      <path d="M112 112 L120 104 L128 112" stroke="url(#huma-ornate-gold)" strokeWidth="0.9" fill="none" />

      {/* Brand name */}
      <text
        x="120"
        y="168"
        textAnchor="middle"
        fill="url(#huma-ornate-gold)"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="46"
        fontWeight="700"
        letterSpacing="1"
      >
        Huma
      </text>
      <text
        x="120"
        y="196"
        textAnchor="middle"
        fill="url(#huma-ornate-gold)"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="13"
        fontWeight="600"
        letterSpacing="5.5"
      >
        {brandLine}
      </text>

      <ellipse cx="120" cy="150" rx="72" ry="34" fill="url(#huma-ornate-gold-soft)" />

      {/* Lower rule + diamond */}
      <path d="M52 218 H208" stroke="url(#huma-ornate-gold)" strokeWidth="0.9" opacity="0.85" />
      <path
        d="M120 218 L126 228 L120 238 L114 228 Z"
        fill="url(#huma-ornate-gold)"
        stroke="#f5e6bc"
        strokeWidth="0.5"
      />

      {/* Bottom flourish */}
      <path
        d="M120 246 C108 252 92 258 78 254 C66 250 58 240 62 228 C66 238 76 244 88 244 C98 244 108 238 120 232 C132 238 142 244 152 244 C164 244 174 238 178 228 C182 240 174 250 162 254 C148 258 132 252 120 246 Z"
        fill="url(#huma-ornate-gold)"
        opacity="0.92"
      />
      <path
        d="M120 252 V272 M104 262 Q120 278 136 262"
        stroke="url(#huma-ornate-gold)"
        strokeWidth="1.1"
        strokeLinecap="round"
        fill="none"
      />

      <Sparkle cx={120} cy={212} r={3.5} />
      <Sparkle cx={72} cy={226} r={2.5} />
      <Sparkle cx={168} cy={226} r={2.5} />
    </svg>
  );
}
