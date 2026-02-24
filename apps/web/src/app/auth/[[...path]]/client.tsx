'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { AuthAgreement, Login, Register, VerifyEmail, WelcomeScreen } from '@/components/auth';
import { ModalCloseButton } from '@/components/modals';
import { getSupabaseBrowser } from '@/lib/supabase';
import { type AuthMode } from '@/lib/types';

type AuthPageState =
	| { type: 'welcome'; mode: AuthMode }
	| { type: 'login' }
	| { type: 'register' }
	| { type: 'verify'; email: string };

type AuthPageProps = {
	initialState: AuthPageState;
};

function AuthPage({ initialState }: AuthPageProps) {
	const router = useRouter();
	const [state, setState] = useState<AuthPageState>(initialState);

	useEffect(() => {
		switch (state.type) {
			case 'welcome':
				window.history.pushState(null, '', state.mode === 'register' ? '/auth/register' : '/auth');
				break;
			case 'login':
				window.history.pushState(null, '', '/auth');
				break;
			case 'register':
				window.history.pushState(null, '', '/auth/register');
				break;
			case 'verify':
				window.history.pushState(null, '', `/auth/verify?email=${encodeURIComponent(state.email)}`);
				break;
		}
	}, [state]);

	const handleGoogleOAuth = async (): Promise<void> => {
		const supabase = getSupabaseBrowser();
		const { error } = await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: `${window.location.origin}/api/auth/callback`,
			},
		});

		if (error) {
			console.error('Google OAuth error:', error);
		}
	};

	const handleClose = (): void => {
		router.push('/');
	};

	const handleLoginSuccess = (): void => {
		router.push('/');
	};

	const renderContent = (): React.JSX.Element | null => {
		switch (state.type) {
			case 'welcome':
				return (
					<WelcomeScreen
						mode={state.mode}
						onGoogle={handleGoogleOAuth}
						onEmail={() => setState({ type: state.mode })}
						onToggleMode={() => setState({ type: 'welcome', mode: state.mode === 'login' ? 'register' : 'login' })}
					/>
				);
			case 'login':
				return (
					<Login
						onSuccess={handleLoginSuccess}
						onSignUp={() => setState({ type: 'welcome', mode: 'register' })}
						onVerifyEmail={(email) => setState({ type: 'verify', email })}
					/>
				);
			case 'register':
				return (
					<Register
						onSuccess={(email) => setState({ type: 'verify', email })}
						onLogin={() => setState({ type: 'welcome', mode: 'login' })}
					/>
				);
			case 'verify':
				return <VerifyEmail email={state.email} />;
			default:
				return null;
		}
	};

	return (
		<div className="fixed inset-0 z-99 flex bg-neutral-950 items-center justify-center">
			<div className="relative flex flex-1 flex-col w-full min-h-0 max-w-1/2 h-full">
				<ModalCloseButton onClick={handleClose} className="absolute top-4 right-4 z-20" />

				<div className="flex flex-1 flex-col items-center justify-center min-h-0">{renderContent()}</div>

				<AuthAgreement />
			</div>
		</div>
	);
}

export { AuthPage, type AuthPageState };
