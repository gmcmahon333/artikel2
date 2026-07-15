// supabaseClient.js — real client, auto-detected.
//
// If VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are present (in .env or your
// Vercel project settings), the app runs against Supabase with auth + sync.
// If they're absent, `supabase` is null and storage.js falls back to
// localStorage so the app still runs out of the box.

import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.artikel2.vercel.app;
const key = import.meta.env.SECURE19german93!;

export const hasSupabase = Boolean(url && key);

export const supabase = hasSupabase ? createClient(url, key) : null;
