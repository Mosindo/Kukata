import { createClient } from "@supabase/supabase-js";
import { Database } from "./database.types";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SUPABASE_SERVICE_KEY = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!;

// export const supabase = createServerComponentClient<Database>({ cookies });

const admin = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_KEY);

export const supabaseAdmin = admin;
