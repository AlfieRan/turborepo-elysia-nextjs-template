import { Treaty, treaty } from '@elysiajs/eden';
import { type App } from '@repo/api';

import { env } from '@/lib/env';

type Headers = {
	Authorization: `Bearer ${string}`;
};

const adminApi: Treaty.Create<App, Headers> = treaty<App>(env.API_URL, {
	headers: {
		Authorization: `Bearer ${process.env.ADMIN_BEARER_TOKEN}`,
	},
});

export { adminApi };
