import z from 'zod';

import { resendEmailVerificationAdmin } from '@/lib/api';
import { handleError, reply } from '@/lib/api/_core/nextFetcher';

const ResendEmailRequest = z.object({ email: z.email() });

export async function POST(request: Request): Promise<Response> {
	try {
		const { email } = ResendEmailRequest.parse(await request.json());
		await resendEmailVerificationAdmin(email);
		return reply({ success: true }, 200);
	} catch (error) {
		return handleError(error);
	}
}
