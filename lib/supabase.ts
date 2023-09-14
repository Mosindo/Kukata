import { createClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SUPABASE_SERVICE_KEY = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: { persistSession: false, autoRefreshToken: false },
  }
);
const admin = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

export const supabaseAdmin = admin;
