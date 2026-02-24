import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

import { SignUpRequest } from '@repo/shared';

import { checkEmailVerificationAdmin, signUpApi } from '@/lib/api';

import { verifyEmail } from './verification';

/**
 * Headless Supabase client — stores sessions in memory, never sets cookies.
 * Sign-up doesn't need a browser session; the user must confirm their email
 * and then sign in via the browser client.
 */
function getSupabaseHeadless() {
	return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!);
}

/** Admin client (service-role key) used only for rollback on failure. */
function getSupabaseAdmin() {
	return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!);
}

export async function POST(request: Request) {
	try {
		const req = SignUpRequest.parse(await request.json());
		const validation = await verifyEmail(req.email);
		if (validation.mode === 'block')
			return NextResponse.json({ success: false, message: validation.message }, { status: validation.status });

		const supabase = getSupabaseHeadless();

		const { data, error } = await supabase.auth.signUp({
			email: req.email,
			password: req.password,
		});

		if (error || !data.user || !data.user.email)
			return NextResponse.json({ success: false, message: error?.message || 'User creation failed' }, { status: 400 });

		// User already exists — Supabase returns user with empty identities
		if (data.user.identities?.length === 0) {
			try {
				const verification = await checkEmailVerificationAdmin(req.email);
				if (!verification.verified) {
					return NextResponse.json({ success: false, message: 'email_unverified' }, { status: 409 });
				}
			} catch {
				// Verification check failed — fall through to generic message
			}
			return NextResponse.json(
				{ success: false, message: 'An account with this email already exists' },
				{ status: 409 },
			);
		}

		try {
			const user = await signUpApi({
				userId: data.user.id,
				email: data.user.email,
				firstName: req.firstName,
				lastName: req.lastName,
			});

			return NextResponse.json(user, { status: 200 });
		} catch (signUpError) {
			console.error('[ERROR] /api/auth/signup - signUpApi failed:', signUpError);

			const admin = getSupabaseAdmin();
			const { error: deleteError } = await admin.auth.admin.deleteUser(data.user.id);
			if (deleteError) console.error('[ROLLBACK FAILED] Could not delete orphaned auth user:', deleteError.message);

			return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
		}
	} catch (error) {
		console.error(error);
		return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
	}
}
