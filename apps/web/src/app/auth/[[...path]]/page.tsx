import { type NextPageRequest } from '@/lib/types';

import { AuthPage, type AuthPageState } from './client';

type Params = { path?: string[] };
type SearchParams = 'email';

export default async function Page({ params, searchParams }: NextPageRequest<Params, SearchParams>) {
	const { path } = await params;
	const query = await searchParams;
	const initialState = deriveState(path, query.email);

	return <AuthPage initialState={initialState} />;
}

function deriveState(path: string[] | undefined, email: string | string[] | undefined): AuthPageState {
	const segment = path?.[0];

	if (segment === 'register') return { type: 'welcome', mode: 'register' };

	if (segment === 'verify' && typeof email === 'string' && email.length > 0) {
		return { type: 'verify', email };
	}

	return { type: 'welcome', mode: 'login' };
}
