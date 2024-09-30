import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
	throw new Error(
		"Missing env variables SUPABASE_URL and/or SUPABASE_ANON_KEY"
	);
}

export const supabaseAnonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
