import { NextResponse } from 'next/server';
import z from 'zod';

import { ApiError } from '@repo/shared';

import { resendEmailVerificationAdmin } from '@/lib/api/admin';

import { mapResendVerificationError } from './utils';

const ResendEmailRequest = z.object({ email: z.email() });

export async function POST(request: Request): Promise<Response> {
	let email: string;
	try {
		email = ResendEmailRequest.parse(await request.json()).email;
	} catch {
		return NextResponse.json({ success: false, message: 'Invalid request payload.' }, { status: 400 });
	}

	try {
		await resendEmailVerificationAdmin(email);
		return NextResponse.json({ success: true }, { status: 200 });
	} catch (error) {
		const mapped = mapResendVerificationError(error);
		if (mapped.status >= 500) {
			console.error('[ERROR] /api/auth/email-verification failed', {
				status: error instanceof ApiError ? error.status : 'unknown',
			});
		}

		return NextResponse.json(mapped.body, { status: mapped.status });
	}
}
