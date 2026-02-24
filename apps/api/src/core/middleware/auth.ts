import { getPosthogClient } from '@/core/posthog/index.js';
import { supabase } from '@/core/supabase.js';
import { Elysia } from 'elysia';
import { z } from 'zod';

import { UnauthorizedError } from '@repo/shared';

const Headers = z.object({
	authorization: z.string().optional(),
	'x-posthog-session-id': z.string().optional(),
});

const auth = new Elysia({ name: 'auth' }).derive(
	{
		as: 'scoped',
	},
	async ({ headers }) => {
		const { authorization, 'x-posthog-session-id': sessionId } = Headers.parse(headers);
		if (!authorization?.startsWith('Bearer ')) throw new UnauthorizedError('Missing authorization token');

		const token = authorization.slice(7);
		const { data, error } = await supabase.auth.getUser(token);
		if (error || !data.user) {
			if (error) console.warn(error.message);
			throw new UnauthorizedError('Invalid or expired token');
		}

		const posthog = getPosthogClient(data.user.id, sessionId);
		return { user: data.user, posthog };
	},
);

export { auth };
