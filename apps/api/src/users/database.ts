import { authUsers } from '@/core/database/authUsers.js';
import { relations } from 'drizzle-orm';
import { pgSchema, text, timestamp, uuid } from 'drizzle-orm/pg-core';

const usersSchema = pgSchema('users');

const users = usersSchema.table('users', {
	id: uuid()
		.primaryKey()
		.references(() => authUsers.id, { onDelete: 'no action' }),
	email: text().notNull().unique(),
	firstName: text(),
	lastName: text(),
	createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

const usersRelations = relations(users, ({ one }) => ({
	authUser: one(authUsers, {
		fields: [users.id],
		references: [authUsers.id],
	}),
}));

const authUsersRelations = relations(authUsers, ({ one }) => ({
	user: one(users),
}));

export { users, usersRelations, authUsersRelations };
