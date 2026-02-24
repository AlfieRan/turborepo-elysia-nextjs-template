import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { ResendEmailResponse } from './auth';

describe('ResendEmailResponse schema', () => {
	it('accepts success responses', () => {
		const result = ResendEmailResponse.safeParse({ success: true });
		assert.equal(result.success, true);
	});

	it('accepts error responses with message', () => {
		const result = ResendEmailResponse.safeParse({ success: false, message: 'Try again later' });
		assert.equal(result.success, true);
	});

	it('rejects non-standard error shape', () => {
		const result = ResendEmailResponse.safeParse({ success: false, error: 'Oops' });
		assert.equal(result.success, false);
	});
});
