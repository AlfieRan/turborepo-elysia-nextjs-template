import { Elysia } from 'elysia';

import { UnauthorizedError } from '@repo/shared';

import { env } from '@/config.js';

const adminAuth = new Elysia({ name: 'adminAuth' }).derive({ as: 'scoped' }, async ({ headers }) => {
	const authHeader = headers['authorization'];
	if (!authHeader?.startsWith('Bearer ')) throw new UnauthorizedError('Missing authorization token');

	const token = authHeader.slice(7);
	if (token !== env.ADMIN_BEARER_TOKEN) throw new UnauthorizedError('Invalid or expired token');
	return { admin: true };
});

export { adminAuth };
