import { PostHog } from 'posthog-node';

import { User } from '@/users/types.js';

import { PosthogEvent } from './events.js';

class PosthogClient {
	private posthog: PostHog | null = null;

	private distinctId: string;
	private sessionId: string | null = null;

	constructor(posthog: PostHog | null, identifiers: { distinctId: string; sessionId: string | null }) {
		this.posthog = posthog;
		this.distinctId = identifiers.distinctId;
		this.sessionId = identifiers.sessionId;
	}

	identify(user: User): void {
		this.distinctId = user.id;
		const name = [user.firstName, user.lastName].filter(Boolean).join(' ');
		this.posthog?.identify({
			distinctId: user.id,
			properties: {
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				name,
				$set: { name, email: user.email },
				$set_once: { created_at: user.createdAt.toISOString() },
			},
		});
	}

	capture<E extends PosthogEvent>(event: E['event'], properties: E['properties']): void {
		this.posthog?.capture({
			event,
			distinctId: this.distinctId,
			properties: {
				...properties,
				...(this.sessionId ? { $session_id: this.sessionId } : {}),
			},
		});
	}

	captureException(error: unknown, properties?: Record<string, unknown>): void {
		this.posthog?.captureException(error, this.distinctId, {
			...properties,
			...(this.sessionId ? { $session_id: this.sessionId } : {}),
		});
	}
}

export { PosthogClient };
