import type { GalleryCategory } from "@/lib/cms-types";

export const GALLERY_CATEGORIES: {
  id: GalleryCategory;
  label: string;
  description: string;
}[] = [
  {
    id: "before-after",
    label: "Before → After",
    description: "Real transformations from our home beauty services.",
  },
  {
    id: "bridal",
    label: "Bridal",
    description: "Barat, walima, and engagement looks crafted at your doorstep.",
  },
  {
    id: "hair",
    label: "Hair",
    description: "Colour, styling, and bridal hair artistry.",
  },
  {
    id: "facial",
    label: "Facial",
    description: "Glow, brightening, and pre-event skin prep.",
  },
  {
    id: "mehndi",
    label: "Mehndi",
    description: "Bridal, Arabic, and celebration mehndi designs.",
  },
  {
    id: "reels",
    label: "Video Reels",
    description: "Watch our latest work — tap to play in place.",
  },
  {
    id: "instagram",
    label: "Instagram Feed",
    description: "Fresh looks and behind-the-scenes from our artists.",
  },
];

export const GALLERY_MEDIA_TYPES = [
  { value: "image", label: "Photo" },
  { value: "before-after", label: "Before & After" },
  { value: "video", label: "Video (Instagram / TikTok / file)" },
] as const;
