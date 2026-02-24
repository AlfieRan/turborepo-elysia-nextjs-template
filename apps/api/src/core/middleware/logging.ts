import { Elysia } from 'elysia';

import { log } from '../logger.js';

export const logging = new Elysia({ name: 'logging' })
	.derive({ as: 'global' }, () => ({ log }))
	.onAfterResponse({ as: 'global' }, async ({ request, route, set, responseValue }) => {
		const message = typeof responseValue === 'string' ? responseValue : null;
		let logMessage = `[${request.method} - ${set.status}] ${route}`;
		if (message !== null) logMessage += ` - ${message}`;
		console.log(logMessage);
	});
