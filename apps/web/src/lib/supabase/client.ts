'use client';

import { createBrowserClient } from '@supabase/ssr';
import { SupabaseClient } from '@supabase/supabase-js';

import { env } from '@env';

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabaseBrowser(): SupabaseClient {
	if (browserClient) return browserClient;
	const client = createBrowserClient(env.SUPABASE_URL, env.SUPABASE_PUBLISHABLE_KEY);
	browserClient = client;
	return client;
}
