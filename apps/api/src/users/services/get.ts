import { db, schema } from '@/core/database/index.js';
import { AuthUser } from '@supabase/supabase-js';
import { eq } from 'drizzle-orm';

import { NotFoundError } from '@repo/shared';

import { User } from '../types.js';

async function getUser(user: AuthUser): Promise<User> {
	const row = await db.query.users.findFirst({
		where: eq(schema.users.id, user.id),
	});
	if (!row) throw new NotFoundError('User not found');
	return User.parse(row);
}

export { getUser };
