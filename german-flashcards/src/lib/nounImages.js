import { AVAILABLE_NOUN_IMAGE_KEYS } from "./nounImageManifest.js";

const env = import.meta.env ?? {};
const configuredBase = env.VITE_NOUN_IMAGE_BASE_URL;
const supabaseBase = env.VITE_SUPABASE_URL
  ? `${env.VITE_SUPABASE_URL}/storage/v1/object/public/noun-images`
  : null;
const imageBaseUrl = (configuredBase || supabaseBase)?.replace(/\/$/, "") || null;

export function nounImageKey(noun) {
  return noun
    .trim()
    .toLowerCase()
    .replaceAll("ä", "ae")
    .replaceAll("ö", "oe")
    .replaceAll("ü", "ue")
    .replaceAll("ß", "ss")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function nounImageUrl(card) {
  const key = nounImageKey(card.noun);
  if (!imageBaseUrl || !AVAILABLE_NOUN_IMAGE_KEYS.has(key)) return null;
  return `${imageBaseUrl}/${key}.webp`;
}
