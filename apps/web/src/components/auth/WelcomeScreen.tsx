import Image from 'next/image';

import { Button } from '@/components/Button';
import { type AuthMode } from '@/lib/types';

import { GoogleIcon } from './components/GoogleIcon';

type WelcomeScreenProps = {
	mode: AuthMode;
	onGoogle: () => void;
	onEmail: () => void;
	onToggleMode: () => void;
};

function WelcomeScreen({ mode, onGoogle, onEmail, onToggleMode }: WelcomeScreenProps) {
	const isLogin = mode === 'login';

	return (
		<div className="flex gap-2 w-full max-w-[320px] flex-col items-center px-4 animate-fade-up-sm">
			<Image src="/logo/logo.svg" alt="Website" width={40} height={40} />

			<div className="flex flex-col gap-1 items-center justify-center">
				<h1 className="text-xl font-medium text-dark-neutral-50">{isLogin ? 'Welcome back' : 'Welcome!'}</h1>
				<p className="text-sm text-neutral-400">{isLogin ? 'Sign in to your account' : 'Sign up to get started'}</p>
			</div>

			<div className="mt-4 flex w-full flex-col gap-3">
				<Button variant="light" size="lg" className="w-full rounded-full" icon={<GoogleIcon />} onClick={onGoogle}>
					Continue with Google
				</Button>

				<Button variant="outline" size="lg" className="w-full rounded-full" onClick={onEmail}>
					{isLogin ? 'Sign in with Email' : 'Sign up with Email'}
				</Button>
			</div>

			<p className="mt-4 text-center text-sm text-neutral-500">
				{isLogin ? "Don't have an account? " : 'Already have an account? '}
				<Button variant="ghost" size="sm" className="-mx-2 font-medium text-dark-neutral-50" onClick={onToggleMode}>
					{isLogin ? 'Sign up' : 'Sign in'}
				</Button>
			</p>
		</div>
	);
}

export { WelcomeScreen };
