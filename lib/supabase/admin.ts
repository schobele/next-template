import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const SUPABASE_SERVICE_ROLE_KEY = process.env
	.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY as string;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
	throw new Error(
		"Missing env variables SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY"
	);
}

export const supabaseAdminClient = createClient(
	SUPABASE_URL,
	SUPABASE_SERVICE_ROLE_KEY
);
