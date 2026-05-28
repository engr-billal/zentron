import type { Niche } from "@/lib/scoring/types";
import type { Database } from "@/types/database";

export const CREATOR_PLATFORM_TYPES = [
  "instagram",
  "youtube",
  "tiktok",
  "podcast",
  "twitter",
  "linkedin",
] as const satisfies ReadonlyArray<
  Database["public"]["Enums"]["creator_platform_type"]
>;

export const PLATFORM_LABELS: Record<
  Database["public"]["Enums"]["creator_platform_type"],
  string
> = {
  instagram: "Instagram",
  youtube: "YouTube",
  tiktok: "TikTok",
  podcast: "Podcast",
  twitter: "X / Twitter",
  linkedin: "LinkedIn",
};

export const NICHES = [
  "finance",
  "b2b_tech",
  "beauty",
  "lifestyle",
  "fitness",
  "food",
  "travel",
  "gaming",
  "education",
  "other",
] as const satisfies ReadonlyArray<Niche>;

export const NICHE_LABELS: Record<Niche, string> = {
  finance: "Finance",
  b2b_tech: "B2B / Tech",
  beauty: "Beauty",
  lifestyle: "Lifestyle",
  fitness: "Fitness",
  food: "Food & Drink",
  travel: "Travel",
  gaming: "Gaming",
  education: "Education",
  other: "Other",
};

export const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "de", label: "German" },
  { code: "fr", label: "French" },
  { code: "es", label: "Spanish" },
  { code: "it", label: "Italian" },
  { code: "pt", label: "Portuguese" },
  { code: "nl", label: "Dutch" },
  { code: "ar", label: "Arabic" },
  { code: "tr", label: "Turkish" },
  { code: "ur", label: "Urdu" },
  { code: "hi", label: "Hindi" },
  { code: "ja", label: "Japanese" },
  { code: "ko", label: "Korean" },
  { code: "zh", label: "Chinese (Mandarin)" },
] as const;

export const COUNTRIES = [
  { code: "GB", label: "United Kingdom" },
  { code: "US", label: "United States" },
  { code: "DE", label: "Germany" },
  { code: "FR", label: "France" },
  { code: "NL", label: "Netherlands" },
  { code: "ES", label: "Spain" },
  { code: "IT", label: "Italy" },
  { code: "AE", label: "United Arab Emirates" },
  { code: "PK", label: "Pakistan" },
  { code: "IN", label: "India" },
  { code: "CA", label: "Canada" },
  { code: "AU", label: "Australia" },
  { code: "SG", label: "Singapore" },
  { code: "JP", label: "Japan" },
] as const;

export const CURRENCIES = ["USD", "GBP", "EUR", "AED"] as const;
