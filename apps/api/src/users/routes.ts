import { auth } from '@/core/middleware/index.js';
import { Elysia } from 'elysia';

import { getUser } from './services/get.js';
import { User } from './types.js';

const router = new Elysia({ prefix: '/users' }).use(auth).get(
	'/me',
	async ({ user: authUser, posthog }) => {
		const user = await getUser(authUser);
		posthog.identify(user);
		return user;
	},
	{
		response: User,
	},
);

export { router };
