import { User } from '@repo/api';

import { ApiError, EmailVerificationState, SignUpRequestAdmin } from '@repo/shared';

import { api } from './_core';
import { getAdminSession } from './session/server';

async function signUpApi(request: SignUpRequestAdmin): Promise<User> {
	const session = await getAdminSession();
	const res = await api.admin.users.post(request, { headers: session });
	if (!res.data) throw await ApiError.fromResponse(res.response);
	return res.data;
}

async function adminSyncOauthUser(request: { userId: string }): Promise<User> {
	const session = await getAdminSession();
	const res = await api.admin.users.oauth.post(request, { headers: session });
	if (!res.data) throw await ApiError.fromResponse(res.response);
	return res.data;
}

async function checkEmailVerificationAdmin(email: string): Promise<EmailVerificationState> {
	const session = await getAdminSession();
	const res = await api.admin.users['email-verification'].get({ query: { email }, headers: session });
	if (!res.data) throw await ApiError.fromResponse(res.response);
	return res.data;
}

async function resendEmailVerificationAdmin(email: string): Promise<{ success: true }> {
	const session = await getAdminSession();
	const res = await api.admin.users['email-verification'].post({ email }, { headers: session });
	if (!res.data) throw await ApiError.fromResponse(res.response);
	return res.data;
}

export { signUpApi, adminSyncOauthUser, checkEmailVerificationAdmin, resendEmailVerificationAdmin };
