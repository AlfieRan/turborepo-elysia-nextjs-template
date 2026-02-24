import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { env } from '@/config.js';

import * as schema from './registry.js';

const client = postgres(env.DATABASE_URL, { prepare: false });
const db = drizzle(client, { schema, casing: 'snake_case' });

export { db, schema };
