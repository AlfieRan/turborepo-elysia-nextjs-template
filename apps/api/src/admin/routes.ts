import { Elysia } from 'elysia';
import z from 'zod';

import { EmailVerificationState, SignUpRequestAdmin } from '@repo/shared';

import { User } from '@/users/types.js';

import { adminAuth } from './middleware.js';
import { checkEmailVerification, createUser, resendEmailVerification, syncOauthUser } from './services/users.js';

const router = new Elysia({ prefix: '/admin' })
	.use(adminAuth)
	.post('/users', async ({ body }) => await createUser(body), {
		body: SignUpRequestAdmin,
		response: User,
	})
	.post('/users/oauth', async ({ body }) => await syncOauthUser(body.userId), {
		body: z.object({ userId: z.uuid() }),
		response: User,
	})
	.get('/users/email-verification', async ({ query }) => await checkEmailVerification(query.email), {
		query: z.object({ email: z.email() }),
		response: EmailVerificationState,
	})
	.post(
		'/users/email-verification',
		async ({ body }) => {
			await resendEmailVerification(body.email);
			return { success: true };
		},
		{
			body: z.object({ email: z.email() }),
			response: z.object({ success: z.literal(true) }),
		},
	);

export { router };
