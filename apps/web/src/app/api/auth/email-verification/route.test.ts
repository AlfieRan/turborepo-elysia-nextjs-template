import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { BadRequestError, InternalServerError, NotFoundError } from '@repo/shared';

import { RESEND_EMAIL_FAILURE_MESSAGE, mapResendVerificationError } from './utils';

describe('mapResendVerificationError', () => {
	it('returns generic accepted response for 400 and 404 account-state errors', () => {
		const badRequest = mapResendVerificationError(new BadRequestError('Email already verified'));
		const notFound = mapResendVerificationError(new NotFoundError('User has not signed up'));

		assert.deepEqual(badRequest, { status: 200, body: { success: true } });
		assert.deepEqual(notFound, { status: 200, body: { success: true } });
	});

	it('returns generic retryable error for operational API errors', () => {
		const result = mapResendVerificationError(new InternalServerError('Boom'));

		assert.deepEqual(result, {
			status: 500,
			body: { success: false, message: RESEND_EMAIL_FAILURE_MESSAGE },
		});
	});

	it('returns generic retryable error for unexpected errors', () => {
		const result = mapResendVerificationError(new Error('unexpected'));

		assert.deepEqual(result, {
			status: 500,
			body: { success: false, message: RESEND_EMAIL_FAILURE_MESSAGE },
		});
	});
});
