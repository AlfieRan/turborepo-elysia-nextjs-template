import { PostHog } from 'posthog-node';

import { env } from '@/config.js';

import { PosthogClient } from './client.js';
import { PosthogEvent } from './events.js';

const posthog = env.posthog.API_KEY
	? new PostHog(env.posthog.API_KEY, {
			host: env.posthog.HOST,
			enableExceptionAutocapture: true,
		})
	: null;

function getPosthogClient(distinctId: 'api' | (string & {}), sessionId?: string): PosthogClient {
	return new PosthogClient(posthog, { distinctId, sessionId: sessionId ?? null });
}

export { getPosthogClient, PosthogClient, type PosthogEvent };
