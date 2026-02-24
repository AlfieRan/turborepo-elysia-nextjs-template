import z from 'zod';

const GoogleOauthMetadata = z.object({
	email: z.email(),
	name: z.string().optional(),
	full_name: z.string().optional(),
	avatar_url: z.string().optional(),
});

type GoogleOauthMetadata = z.infer<typeof GoogleOauthMetadata>;

export { GoogleOauthMetadata };
