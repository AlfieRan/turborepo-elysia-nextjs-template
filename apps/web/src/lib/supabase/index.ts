import { getSupabaseBrowser } from './client';

async function getAccessToken(): Promise<string | null> {
	const supabase = getSupabaseBrowser();
	const { data, error } = await supabase.auth.getSession();
	if (error) throw error;
	return data.session?.access_token ?? null;
}

export * from './client';
export { getAccessToken };
