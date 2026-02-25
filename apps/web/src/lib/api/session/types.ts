type Session = {
	'X-Posthog-Session-Id'?: string;
	Authorization?: `Bearer ${string}`;
};

type GetSession = () => Promise<Session>;

export type { Session, GetSession };
