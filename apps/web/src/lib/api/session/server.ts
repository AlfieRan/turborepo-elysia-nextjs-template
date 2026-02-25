import { getSupabaseServer } from '@/lib/supabase/server';

import type { Session } from './types';

async function getServerSession(): Promise<Session> {
	const supabase = await getSupabaseServer();
	const { data, error } = await supabase.auth.getSession();
	if (error) throw error;
	const token = data.session?.access_token ?? null;

	const headers: Session = {};
	if (token) headers['Authorization'] = `Bearer ${token}`;
	return headers;
}

async function getAdminSession(): Promise<Session> {
	const token = process.env.ADMIN_BEARER_TOKEN;
	if (!token) throw new Error('ADMIN_BEARER_TOKEN is not set');
	return {
		Authorization: `Bearer ${token}`,
	};
}

export { getServerSession, getAdminSession };
