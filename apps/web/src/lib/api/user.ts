import { User } from '@repo/api';

import { ApiError } from '@repo/shared';

import { api } from './_core';

async function getCurrentUser(): Promise<User> {
	const res = await api.users.me.get();
	if (!res.data) throw await ApiError.fromResponse(res.response);
	return res.data;
}

export { getCurrentUser, type User };
