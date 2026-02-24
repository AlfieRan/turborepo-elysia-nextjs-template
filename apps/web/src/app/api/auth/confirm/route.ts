import { Config } from '@/config';
import { type EmailOtpType } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

import { getSupabaseServer } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
	try {
		const { searchParams, origin } = request.nextUrl;
		const tokenHash = searchParams.get('token_hash');
		if (!tokenHash) throw new Error('No token hash');

		const type = parseType(searchParams.get('type'));
		const next = searchParams.get('next') ?? '/';

		const supabase = await getSupabaseServer();
		const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });

		if (error) {
			console.error('Supabase auth error', error);
			throw new Error();
		}

		return NextResponse.redirect(new URL(next, origin));
	} catch (err) {
		console.error('Failed to confirm email', err);
		return NextResponse.redirect(Config.urls.getErrorUrl('auth.confirmation_failed'));
	}
}

function parseType(param: string | null): EmailOtpType {
	switch (param) {
		case 'invite':
			return 'invite';

		case 'magiclink':
			return 'magiclink';

		case 'recovery':
			return 'recovery';

		case 'email_change':
			return 'email_change';

		case 'email':
			return 'email';

		default:
			return 'signup';
	}
}
