import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getSafeRedirectUrl, sanitizeNextPath } from './redirect';

describe('sanitizeNextPath', () => {
	it('accepts valid relative paths and preserves query/hash', () => {
		const result = sanitizeNextPath('/dashboard?tab=billing#invoices');

		assert.equal(result.sanitized, false);
		assert.equal(result.path, '/dashboard?tab=billing#invoices');
	});

	it('rejects absolute URLs and protocol-style values', () => {
		assert.equal(sanitizeNextPath('https://evil.com').path, '/');
		assert.equal(sanitizeNextPath('javascript:alert(1)').path, '/');
	});

	it('rejects empty and malformed values', () => {
		assert.equal(sanitizeNextPath('').path, '/');
		assert.equal(sanitizeNextPath(null).path, '/');
		assert.equal(sanitizeNextPath('//evil.com').path, '/');
	});
});

describe('getSafeRedirectUrl', () => {
	it('falls back to same-origin root for unsafe next values', () => {
		const redirect = getSafeRedirectUrl('http://localhost:3000', 'https://evil.com');
		assert.equal(redirect.url.toString(), 'http://localhost:3000/');
		assert.equal(redirect.sanitized, true);
	});

	it('uses provided path when next is safe', () => {
		const redirect = getSafeRedirectUrl('http://localhost:3000', '/auth/verify?email=x#done');
		assert.equal(redirect.url.toString(), 'http://localhost:3000/auth/verify?email=x#done');
		assert.equal(redirect.sanitized, false);
	});
});
