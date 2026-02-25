'use client';

import posthog from 'posthog-js';

import { getSupabaseBrowser } from '@/lib/supabase';

import { Session } from './types';

async function getSession(): Promise<Session> {
	const supabase = getSupabaseBrowser();
	const { data, error } = await supabase.auth.getSession();
	if (error) throw error;
	const token = data.session?.access_token ?? null;

	const headers: Session = {
		'X-Posthog-Session-Id': posthog.get_session_id(),
	};

	if (token) headers['Authorization'] = `Bearer ${token}`;
	return headers;
}

export { getSession };
