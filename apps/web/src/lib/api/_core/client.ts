import { Treaty, treaty } from '@elysiajs/eden';
import { type App } from '@repo/api';
import posthog from 'posthog-js';

import { UnauthorizedError } from '@repo/shared';

import { env } from '@/lib/env';
import { getAccessToken } from '@/lib/supabase';

type Headers = {
	'X-Posthog-Session-Id': string;
	Authorization?: `Bearer ${string}`;
};

const api: Treaty.Create<App, Headers> = treaty<App>(env.API_URL, {
	headers: async (_path, options) => {
		const additional: Record<string, string> = {
			'X-Posthog-Session-Id': posthog.get_session_id(),
		};
		const accessToken = await getAccessToken();
		if (accessToken) additional['Authorization'] = `Bearer ${accessToken}`;
		else if (requiresAccessToken(_path)) throw new UnauthorizedError('Unauthorized');

		return {
			...(options.headers ?? {}),
			...additional,
		};
	},
});

function requiresAccessToken(path: string): boolean {
	if (path.startsWith('/admin')) return false;
	return true;
}

export { api };
