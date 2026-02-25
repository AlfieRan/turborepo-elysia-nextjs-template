import { User } from '@repo/api';

import { ApiError, UnauthorizedError } from '@repo/shared';

import { api } from './_core';
import type { GetSession } from './session';

async function getCurrentUser(session: GetSession): Promise<User> {
	const headers = await session();
	if (!headers.Authorization) throw new UnauthorizedError();

	const res = await api.users.me.get({ headers });
	if (!res.data) throw await ApiError.fromResponse(res.response);
	return res.data;
}

export { getCurrentUser, type User };
