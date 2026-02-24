const posthog = {
	get API_KEY(): string | undefined {
		return process.env.POSTHOG_API_KEY;
	},
	get HOST(): string {
		return process.env.POSTHOG_HOST ?? 'https://eu.i.posthog.com';
	},
} as const;

const supabase = {
	get URL(): string {
		return requireEnv('SUPABASE_URL');
	},
	get PUBLISHABLE_KEY(): string {
		return requireEnv('SUPABASE_PUBLISHABLE_KEY');
	},
	get SERVICE_ROLE_KEY(): string {
		return requireEnv('SUPABASE_SECRET_KEY');
	},
} as const;

const env = {
	posthog,
	supabase,

	get DATABASE_URL(): string {
		return requireEnv('DATABASE_URL');
	},

	get ADMIN_BEARER_TOKEN(): string {
		return requireEnv('ADMIN_BEARER_TOKEN');
	},
} as const;

function requireEnv(name: string): string {
	const value = process.env[name];
	if (!value) throw new Error(`${name} is required`);
	return value;
}

export { env };
