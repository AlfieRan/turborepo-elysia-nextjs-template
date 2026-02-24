import { boolean, jsonb, pgSchema, text, timestamp, uuid } from 'drizzle-orm/pg-core';

const authSchema = pgSchema('auth');

/**
 * Read-only reference to Supabase's auth.users table.
 * This is NOT managed by Drizzle Kit migrations (it lives in the `auth` schema,
 * and drizzle-kit defaults to `schemaFilter: ['public']`).
 * Use this for relational joins against authenticated users.
 */
const authUsers = authSchema.table('users', {
	id: uuid().primaryKey(),
	email: text(),
	phone: text(),
	emailConfirmedAt: timestamp({ withTimezone: true }),
	phoneConfirmedAt: timestamp({ withTimezone: true }),
	lastSignInAt: timestamp({ withTimezone: true }),
	rawAppMetaData: jsonb(),
	rawUserMetaData: jsonb(),
	isAnonymous: boolean(),
	createdAt: timestamp({ withTimezone: true }).notNull(),
	updatedAt: timestamp({ withTimezone: true }),
});

export { authUsers };
