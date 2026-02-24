import { Config } from '@/config';
import { NextRequest, NextResponse } from 'next/server';

import { adminSyncOauthUser } from '@/lib/api';
import { getSupabaseServer } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
	try {
		const { searchParams, origin } = request.nextUrl;
		const code = searchParams.get('code');
		if (!code) throw new Error('No code param');
		const next = searchParams.get('next') ?? '/';

		const supabase = await getSupabaseServer();
		const { data, error } = await supabase.auth.exchangeCodeForSession(code);
		if (error) {
			console.error('Supabase error', error);
			throw new Error(error.message);
		}

		const userId = data.user?.id ?? data.session?.user.id;
		if (!userId) {
			console.error('No user id collected from response!');
			throw new Error();
		}

		await adminSyncOauthUser({ userId });

		return NextResponse.redirect(new URL(next, origin));
	} catch (err) {
		console.error('Failed to oauth sync', err);
		return NextResponse.redirect(Config.urls.getErrorUrl('auth.callback_failed'));
	}
}
