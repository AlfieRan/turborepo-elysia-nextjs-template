import { PosthogClient } from '@/core/posthog/index.js';

import { User } from '@/users/types.js';

function trackUserSignup(posthog: PosthogClient, user: User, method: 'email' | 'google'): void {
	posthog.identify(user);
	posthog.capture('user:signup', {
		email: user.email,
		firstName: user.firstName,
		lastName: user.lastName,
		method,
	});
}

export { trackUserSignup };
