import z from 'zod';

import { users } from './database.js';

type User = typeof users.$inferSelect;

const User = z.object({
	id: z.uuid(),
	email: z.email(),
	firstName: z.string().nullable(),
	lastName: z.string().nullable(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
}) satisfies z.ZodType<User>;

export { User };
