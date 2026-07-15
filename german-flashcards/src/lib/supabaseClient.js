// supabaseClient.js — real client, auto-detected.
//
// If VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are present (in .env or your
// Vercel project settings), the app runs against Supabase with auth + sync.
// If they're absent, `supabase` is null and storage.js falls back to
// localStorage so the app still runs out of the box.

import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const hasSupabase = Boolean(url && key);

export const supabase = hasSupabase ? createClient(url, key) : null;
