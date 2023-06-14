import { NextRequest, NextResponse } from "next/server";
import { supabase } from "./lib/supabase";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  await supabase.auth.getSession();
  return res;
}

export const config = {
  matcher: ["/api/auth/me"],
};
