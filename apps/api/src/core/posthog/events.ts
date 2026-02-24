type SignUpEvent = {
	event: 'user:signup';
	properties: {
		email: string;
		method: 'email' | 'google';
		firstName: string | null;
		lastName: string | null;
	};
};

type PosthogEvent = SignUpEvent; // TODO: Add more events here

export type { PosthogEvent, SignUpEvent };
