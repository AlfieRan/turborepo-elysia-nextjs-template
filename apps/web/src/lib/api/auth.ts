import type { User } from '@repo/api';
import { SupabaseClient } from '@supabase/supabase-js';
import z from 'zod';

import { SignUpRequest } from '@repo/shared';

import { nextFetcher } from './_core/nextFetcher';

async function signOut(supabase: SupabaseClient): Promise<void> {
	const { error } = await supabase.auth.signOut();
	if (error) throw error;
}

async function signUp(request: SignUpRequest): Promise<User> {
	const res = await fetch('/api/auth/signup', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(request),
	});

	const data = await res.json();
	if (!res.ok) throw new Error(data.message || 'Sign up failed');

	return data as User;
}

const ResendEmailResponse = z.discriminatedUnion('success', [
	z.object({ success: z.literal(true) }),
	z.object({ success: z.literal(false), message: z.string() }),
]);

type ResendEmailResponse = z.infer<typeof ResendEmailResponse>;

async function resendVerificationEmail(email: string): Promise<ResendEmailResponse> {
	return await nextFetcher<{ email: string }, ResendEmailResponse>({
		route: '/api/auth/email-verification',
		method: 'POST',
		body: { email },
		parser: ResendEmailResponse.safeParseAsync,
	});
}

export { signOut, signUp, resendVerificationEmail, ResendEmailResponse };
