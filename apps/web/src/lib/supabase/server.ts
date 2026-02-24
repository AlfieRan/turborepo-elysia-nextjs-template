import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

import { env } from '@env';

async function getSupabaseServer() {
	const cookieStore = await cookies();

	return createServerClient(env.SUPABASE_URL, env.SUPABASE_PUBLISHABLE_KEY, {
		cookies: {
			getAll() {
				return cookieStore.getAll();
			},
			setAll(cookiesToSet) {
				for (const { name, value, options } of cookiesToSet) {
					cookieStore.set(name, value, options);
				}
			},
		},
	});
}

export { getSupabaseServer };
