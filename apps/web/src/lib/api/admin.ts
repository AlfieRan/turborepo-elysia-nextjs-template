import { User } from '@repo/api';

import { ApiError, EmailVerificationState, SignUpRequestAdmin } from '@repo/shared';

import { adminApi } from './_core';

async function signUpApi(request: SignUpRequestAdmin): Promise<User> {
	const res = await adminApi.admin.users.post(request);
	if (!res.data) throw await ApiError.fromResponse(res.response);
	return res.data;
}

async function adminSyncOauthUser(request: { userId: string }): Promise<User> {
	const res = await adminApi.admin.users.oauth.post(request);
	if (!res.data) throw await ApiError.fromResponse(res.response);
	return res.data;
}

async function checkEmailVerificationAdmin(email: string): Promise<EmailVerificationState> {
	const res = await adminApi.admin.users['email-verification'].get({ query: { email } });
	if (!res.data) throw await ApiError.fromResponse(res.response);
	return res.data;
}

async function resendEmailVerificationAdmin(email: string): Promise<{ success: true }> {
	const res = await adminApi.admin.users['email-verification'].post({ email });
	if (!res.data) throw await ApiError.fromResponse(res.response);
	return res.data;
}

export { signUpApi, adminSyncOauthUser, checkEmailVerificationAdmin, resendEmailVerificationAdmin };
