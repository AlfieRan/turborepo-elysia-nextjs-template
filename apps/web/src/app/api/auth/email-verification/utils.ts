import { ApiError } from '@repo/shared';

const RESEND_EMAIL_FAILURE_MESSAGE = 'Unable to process request right now. Please try again.';

type ResendEmailResponse = { success: true } | { success: false; message: string };

function mapResendVerificationError(error: unknown): { status: number; body: ResendEmailResponse } {
	if (error instanceof ApiError && (error.status === 400 || error.status === 404)) {
		return { status: 200, body: { success: true } };
	}

	return {
		status: 500,
		body: { success: false, message: RESEND_EMAIL_FAILURE_MESSAGE },
	};
}

export { mapResendVerificationError, RESEND_EMAIL_FAILURE_MESSAGE, type ResendEmailResponse };
