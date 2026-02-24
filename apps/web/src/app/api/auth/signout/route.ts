import { reply } from '@/lib/api/_core/nextFetcher';
import { getSupabaseServer } from '@/lib/supabase/server';

export async function POST() {
	const supabase = await getSupabaseServer();
	const { error } = await supabase.auth.signOut();
	if (error) return reply({ error: error.message }, 400);
	return reply({ success: true }, 200);
}
