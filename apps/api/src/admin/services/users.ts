import { db, schema } from '@/core/database/index.js';
import { getPosthogClient } from '@/core/posthog/index.js';
import { supabaseAdmin } from '@/core/supabase.js';
import { eq } from 'drizzle-orm';

import { BadRequestError, InternalServerError, NotFoundError } from '@repo/shared';
import { EmailVerificationState, SignUpRequestAdmin } from '@repo/shared';

import { User } from '@/users/types.js';

import { trackUserSignup } from '../analytics.js';
import { GoogleOauthMetadata } from '../types.js';

async function createUser(request: SignUpRequestAdmin): Promise<User> {
	const posthog = getPosthogClient(request.userId);

	const row = await db
		.insert(schema.users)
		.values({
			id: request.userId,
			email: request.email,
			firstName: request.firstName,
			lastName: request.lastName,
		})
		.returning()
		.then(([row]) => row);
	if (!row) throw new InternalServerError('User creation failed');

	const user = User.parse(row);
	trackUserSignup(posthog, user, 'email');
	return user;
}

async function checkEmailVerification(email: string): Promise<EmailVerificationState> {
	email = email.toLowerCase().trim();
	const [record] = await db
		.select({ id: schema.authUsers.id, emailConfirmedAt: schema.authUsers.emailConfirmedAt })
		.from(schema.authUsers)
		.where(eq(schema.authUsers.email, email));

	if (!record) return { email, exists: false, verified: false };
	return {
		email,
		exists: true,
		verified: record.emailConfirmedAt !== null,
	};
}

async function resendEmailVerification(email: string): Promise<void> {
	const state = await checkEmailVerification(email);
	if (!state.exists) throw new NotFoundError('User has not signed up');
	if (state.verified) throw new BadRequestError('Email already verified');

	const { error } = await supabaseAdmin.auth.resend({
		type: 'signup',
		email: email,
	});

	if (error) {
		console.error('Failed to resend email verification', error);
		throw new InternalServerError('Failed to resend email verification');
	}
}

async function syncOauthUser(userId: string): Promise<User> {
	const posthog = getPosthogClient(userId);

	try {
		const response = await db.transaction(async (tx) => {
			const [current] = await tx.select().from(schema.users).where(eq(schema.users.id, userId));
			if (current !== undefined) return { user: current, created: false };

			const [authUser] = await tx.select().from(schema.authUsers).where(eq(schema.authUsers.id, userId));
			if (!authUser) return null;
			const insert = getUserDataFromAuthUser(authUser);
			if (!insert) return null;

			const [inserted] = await tx.insert(schema.users).values(insert).returning();
			return { user: inserted!, created: true };
		});
		if (!response) throw new NotFoundError();

		const user = User.parse(response.user);
		if (response.created) trackUserSignup(posthog, user, 'google');
		return user;
	} catch (err) {
		console.error('Failed to sync oauth user', err);
		posthog.captureException(err, { service: 'oauth-sync' });
		throw err;
	}
}

function getUserDataFromAuthUser(user: typeof schema.authUsers.$inferSelect): typeof schema.users.$inferInsert | null {
	const metadata = GoogleOauthMetadata.safeParse(user);
	let email = user.email;
	let firstName: string | null = null;
	let lastName: string | null = null;

	if (metadata.success) {
		email = metadata.data.email;
		const [first, last] = splitName(metadata.data.full_name ?? metadata.data.name ?? '', email);
		firstName = first;
		lastName = last;
	}

	if (!email) {
		console.warn('Could not get user from auth data');
		return null;
	}

	return {
		id: user.id,
		email,
		firstName,
		lastName,
	};
}

function splitName(name: string, email: string): [string, string] {
	const split = name.split(' ').filter(Boolean);
	if (split.length > 0) return [split[0]!, split.slice(1).join(' ')];
	const emailSplit = email.split('@');
	return [emailSplit[0]!, ''];
}

export { createUser, syncOauthUser, checkEmailVerification, resendEmailVerification };
