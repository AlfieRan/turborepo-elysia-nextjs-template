import { defineConfig } from 'drizzle-kit';

import { env } from './src/config.js';

export default defineConfig({
	out: './supabase/migrations',
	schema: './src/db/schema',
	dialect: 'postgresql',
	schemaFilter: ['users'],
	migrations: {
		prefix: 'supabase',
	},
	dbCredentials: {
		url: env.DATABASE_URL,
	},
});
