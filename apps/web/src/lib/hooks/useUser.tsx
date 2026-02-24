import { posthog } from 'posthog-js';
import { useCallback, useEffect, useState } from 'react';

import { User, getCurrentUser } from '@/lib/api';
import { getSupabaseBrowser } from '@/lib/supabase';

import { usePolling } from './usePolling';

type UserState = { loading: boolean; user: User | null };

const DEFAULT_STATE: UserState = { loading: true, user: null };

function useUser(initial: UserState = DEFAULT_STATE) {
	const supabase = getSupabaseBrowser();
	const [state, setState] = useState<UserState>(initial);

	useEffect(() => {
		if (!state.user) return;
		try {
			if (posthog.get_explicit_consent_status() !== 'granted') {
				posthog.opt_in_capturing();
			}
			posthog.identify(state.user.id, { email: state.user.email, name: state.user.firstName });
		} catch {
			// PostHog not configured or init failed
		}
	}, [state.user]);

	const onRefresh = useCallback(async () => {
		try {
			const user = await getCurrentUser();
			setState({ loading: false, user });
		} catch (error) {
			setState((prev) => ({ ...prev, loading: false, user: null }));
			console.error(error);
		}
	}, []);

	usePolling(onRefresh, 60000);

	useEffect(() => {
		onRefresh().catch(console.error);
	}, [onRefresh]);

	useEffect(() => {
		const { subscription } = supabase.auth.onAuthStateChange(async (event: string) => {
			if (event === 'SIGNED_OUT') {
				setState({ loading: false, user: null });
			}
		}).data;

		return () => {
			subscription.unsubscribe();
		};
	}, [supabase.auth, onRefresh]);

	return { ...state, onRefresh };
}

export { useUser };
