import type { ServiceThemeId } from "@/components/services/ServiceCategoryPage";

export type ServiceIconId =
  | "tiara"
  | "ring"
  | "sparkles"
  | "hd"
  | "airbrush"
  | "waterproof"
  | "hairStyle"
  | "hairColor"
  | "scissors"
  | "hairTreatment"
  | "facial"
  | "nailPolish"
  | "spa"
  | "eye"
  | "mehndi"
  | "wax"
  | "massage"
  | "bridal"
  | "leaf"
  | "diamond"
  | "star";

const THEME_DEFAULT: Record<ServiceThemeId, ServiceIconId> = {
  hair: "hairStyle",
  makeup: "sparkles",
  facial: "facial",
  bodySpa: "spa",
  nails: "nailPolish",
  mehndi: "mehndi",
};

/** Pick a distinct gold line-art icon per service name. */
export function getServiceIconId(
  name: string,
  theme: ServiceThemeId
): ServiceIconId {
  const n = name.toLowerCase();

  if (n.includes("bridal makeup barat") || n.includes("dulhan")) return "tiara";
  if (n.includes("engagement makeup") || n.includes("nikkah")) return "ring";
  if (n.includes("walima")) return "sparkles";
  if (n.includes("hd makeup")) return "hd";
  if (n.includes("airbrush")) return "airbrush";
  if (n.includes("waterproof") || n.includes("smudge")) return "waterproof";
  if (n.includes("party") || n.includes("festive") || n.includes("eid"))
    return "sparkles";
  if (n.includes("editorial") || n.includes("photoshoot")) return "hd";
  if (n.includes("trial") || n.includes("consultation")) return "diamond";
  if (n.includes("touch-up") || n.includes("correction")) return "star";

  if (n.includes("mehndi") || n.includes("henna")) {
    if (n.includes("bridal") || n.includes("dulhan")) return "tiara";
    if (n.includes("arabic") || n.includes("floral")) return "leaf";
    if (n.includes("glitter") || n.includes("white") || n.includes("colored"))
      return "sparkles";
    return "mehndi";
  }

  if (n.includes("manicure") || n.includes("pedicure") || n.includes("nail")) {
    if (n.includes("art") || n.includes("glitter") || n.includes("chrome"))
      return "sparkles";
    if (n.includes("extension") || n.includes("acrylic") || n.includes("gel"))
      return "diamond";
    return "nailPolish";
  }

  if (n.includes("facial") || n.includes("peel") || n.includes("derma")) {
    if (n.includes("gold") || n.includes("diamond") || n.includes("pearl"))
      return "diamond";
    if (n.includes("herbal") || n.includes("organic") || n.includes("aloe"))
      return "leaf";
    return "facial";
  }

  if (
    n.includes("massage") ||
    n.includes("spa") ||
    n.includes("hammam") ||
    n.includes("reflexology")
  ) {
    return n.includes("hot stone") || n.includes("hammam") ? "spa" : "massage";
  }

  if (n.includes("wax") || n.includes("bleach") || n.includes("laser"))
    return "wax";

  if (n.includes("cut") || n.includes("trim") || n.includes("bangs") || n.includes("bob") || n.includes("pixie"))
    return "scissors";

  if (
    n.includes("color") ||
    n.includes("colour") ||
    n.includes("highlight") ||
    n.includes("balayage") ||
    n.includes("ombre")
  )
    return "hairColor";

  if (
    n.includes("keratin") ||
    n.includes("rebonding") ||
    n.includes("smoothen") ||
    n.includes("protein") ||
    n.includes("botox") ||
    n.includes("treatment") ||
    n.includes("spa")
  )
    return "hairTreatment";

  if (
    n.includes("bridal") ||
    n.includes("bun") ||
    n.includes("braid") ||
    n.includes("style") ||
    n.includes("blow") ||
    n.includes("curl") ||
    n.includes("iron")
  )
    return "hairStyle";

  if (n.includes("extension")) return "diamond";
  if (n.includes("eyebrow") || n.includes("threading")) return "eye";
  if (n.includes("wash") || n.includes("condition") || n.includes("oil"))
    return "leaf";

  return THEME_DEFAULT[theme];
}

function iconVariant(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return h % 6;
}

type Props = {
  name: string;
  theme: ServiceThemeId;
};

export function ServiceCardIcon({ name, theme }: Props) {
  const id = getServiceIconId(name, theme);
  const variant = iconVariant(name);

  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`service-card-icon service-card-icon--v${variant}`}
      aria-hidden
    >
      <g stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
        {id === "tiara" && (
          <>
            <path d="M8 32 L14 18 L24 26 L34 18 L40 32 Z" />
            <circle cx="14" cy="18" r="1.2" fill="currentColor" stroke="none" />
            <circle cx="24" cy="26" r="1.2" fill="currentColor" stroke="none" />
            <circle cx="34" cy="18" r="1.2" fill="currentColor" stroke="none" />
            <path d="M10 32 H38" />
          </>
        )}
        {id === "ring" && (
          <>
            <circle cx="24" cy="28" r="10" />
            <path d="M24 18 L26 12 L28 18" />
            <path d="M22 14 L26 10 L30 14" />
            <circle cx="26" cy="12" r="1.5" fill="currentColor" stroke="none" />
          </>
        )}
        {id === "sparkles" && (
          <>
            <path d="M24 8 L26 18 L36 20 L26 22 L24 32 L22 22 L12 20 L22 18 Z" />
            <path d="M36 10 L37 14 L41 15 L37 16 L36 20 L35 16 L31 15 L35 14 Z" />
            <path d="M10 30 L11 33 L14 34 L11 35 L10 38 L9 35 L6 34 L9 33 Z" />
          </>
        )}
        {id === "hd" && (
          <>
            <rect x="10" y="14" width="28" height="20" rx="2" />
            <path d="M16 14 V10 H32 V14" />
            <text x="24" y="28" textAnchor="middle" fill="currentColor" stroke="none" fontSize="9" fontWeight="700" fontFamily="sans-serif">HD</text>
          </>
        )}
        {id === "airbrush" && (
          <>
            <path d="M10 22 H22" />
            <path d="M22 18 V26" />
            <path d="M22 20 H34 C36 20 38 22 38 24 C38 26 36 28 34 28 H22" />
            <path d="M34 20 L40 16 M34 28 L40 32" />
          </>
        )}
        {id === "waterproof" && (
          <>
            <path d="M24 10 C18 18 14 22 14 28 A10 10 0 0 0 34 28 C34 22 30 18 24 10 Z" />
            <path d="M20 28 C20 31 22 33 24 33 C26 33 28 31 28 28" />
          </>
        )}
        {id === "hairStyle" && (
          <>
            <circle cx="24" cy="16" r="7" />
            <path d="M14 36 C14 26 18 22 24 22 C30 22 34 26 34 36" />
            <path d="M30 20 C34 24 36 30 36 36" />
          </>
        )}
        {id === "hairColor" && (
          <>
            <path d="M14 30 C14 22 18 16 24 16 C30 16 34 22 34 30" />
            <path d="M20 30 V36 H28 V30" />
            <path d="M18 36 H30" />
            <path d="M22 22 L26 18 L30 22" />
          </>
        )}
        {id === "scissors" && (
          <>
            <circle cx="16" cy="30" r="4" />
            <circle cx="32" cy="30" r="4" />
            <path d="M20 26 L32 14 M28 26 L16 14" />
          </>
        )}
        {id === "hairTreatment" && (
          <>
            <path d="M18 14 C18 10 22 8 24 8 C26 8 30 10 30 14" />
            <path d="M16 20 C12 24 12 32 16 36 C20 40 28 40 32 36 C36 32 36 24 32 20" />
            <path d="M24 20 V32 M20 24 H28" />
          </>
        )}
        {id === "facial" && (
          <>
            <circle cx="24" cy="24" r="12" />
            <path d="M18 22 C19 24 21 25 24 25 C27 25 29 24 30 22" />
            <path d="M20 30 C22 32 26 32 28 30" />
            <path d="M14 14 L16 16 M34 14 L32 16 M24 10 L24 12" />
          </>
        )}
        {id === "nailPolish" && (
          <>
            <rect x="18" y="10" width="12" height="22" rx="2" />
            <path d="M20 10 H28 V8 C28 6 26 5 24 5 C22 5 20 6 20 8 Z" />
            <path d="M16 34 L20 30 H28 L32 34" />
            <path d="M22 18 H26" />
          </>
        )}
        {id === "spa" && (
          <>
            <ellipse cx="24" cy="32" rx="14" ry="5" />
            <ellipse cx="24" cy="26" rx="10" ry="4" />
            <ellipse cx="24" cy="20" rx="6" ry="3" />
            <path d="M30 16 C32 12 34 10 36 8" />
          </>
        )}
        {id === "eye" && (
          <>
            <path d="M10 24 C14 18 20 16 24 16 C28 16 34 18 38 24 C34 30 28 32 24 32 C20 32 14 30 10 24 Z" />
            <circle cx="24" cy="24" r="4" />
            <path d="M18 20 C20 18 22 17 24 17" />
          </>
        )}
        {id === "mehndi" && (
          <>
            <path d="M24 8 C20 12 16 16 16 22 C16 28 20 34 24 38 C28 34 32 28 32 22 C32 16 28 12 24 8 Z" />
            <path d="M24 14 V30 M20 18 H28 M20 26 H28" />
          </>
        )}
        {id === "wax" && (
          <>
            <rect x="14" y="14" width="20" height="24" rx="3" />
            <path d="M18 20 H30 M18 26 H30 M18 32 H26" />
            <path d="M24 10 V14" />
          </>
        )}
        {id === "massage" && (
          <>
            <path d="M12 28 C16 22 20 20 24 20 C28 20 32 22 36 28" />
            <path d="M14 32 H34" />
            <circle cx="20" cy="26" r="2" />
            <circle cx="28" cy="26" r="2" />
          </>
        )}
        {id === "bridal" && (
          <>
            <path d="M24 10 L28 18 H36 L30 24 L32 32 L24 28 L16 32 L18 24 L12 18 H20 Z" />
          </>
        )}
        {id === "leaf" && (
          <>
            <path d="M24 8 C16 14 12 22 14 30 C16 36 20 38 24 40 C28 38 32 36 34 30 C36 22 32 14 24 8 Z" />
            <path d="M24 12 V36 M20 20 H28 M18 28 H30" />
          </>
        )}
        {id === "diamond" && (
          <>
            <path d="M24 8 L36 18 L24 40 L12 18 Z" />
            <path d="M12 18 H36 M18 18 L24 8 L30 18" />
          </>
        )}
        {id === "star" && (
          <>
            <path d="M24 8 L28 20 H40 L30 28 L34 40 L24 32 L14 40 L18 28 L8 20 H20 Z" />
          </>
        )}
      </g>
    </svg>
  );
}
