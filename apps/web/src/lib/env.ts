const env = {
	get API_URL(): string {
		return enforce(process.env.NEXT_PUBLIC_API_URL, 'NEXT_PUBLIC_API_URL');
	},

	get SUPABASE_URL(): string {
		return enforce(process.env.NEXT_PUBLIC_SUPABASE_URL, 'NEXT_PUBLIC_SUPABASE_URL');
	},
	get SUPABASE_PUBLISHABLE_KEY(): string {
		return enforce(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY');
	},
};

function enforce(value: string | undefined, key?: string): string {
	// Some browser handle process.env differently, so we can't index it in this function like we do in the backend.
	// e.g. process.env['NEXT_PUBLIC_SUPABASE_URL'] is undefined in the browser, but process.env.NEXT_PUBLIC_SUPABASE_URL is defined.
	if (!value) throw new Error(key ? `${key} is required` : 'Missing required environment variable');
	return value;
}

export { env };
