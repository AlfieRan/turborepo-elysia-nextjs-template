'use client';

import { AuthApiError } from '@supabase/supabase-js';
import { FormEvent, useCallback, useState } from 'react';

import { Button } from '@/components/Button';
import { getSupabaseBrowser } from '@/lib/supabase';

import { AuthInput } from './components';

type Props = {
	onSuccess: () => void;
	onSignUp: () => void;
	onVerifyEmail: (email: string) => void;
};

function Login({ onSuccess, onSignUp, onVerifyEmail }: Props) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const handleSubmit = useCallback(
		async (e: FormEvent) => {
			e.preventDefault();
			setError(null);
			setLoading(true);

			try {
				const supabase = getSupabaseBrowser();
				const { error } = await supabase.auth.signInWithPassword({ email, password });
				if (error) throw error;

				onSuccess();
			} catch (error) {
				if (error instanceof AuthApiError && error.code === 'email_not_confirmed') {
					onVerifyEmail(email);
					return;
				}
				setError(error instanceof Error ? error.message : 'An unknown error occurred');
			} finally {
				setLoading(false);
			}
		},
		[email, password, onSuccess, onVerifyEmail],
	);

	return (
		<div className="w-full max-w-[320px] px-4 animate-fade-up-sm">
			<div className="flex flex-col gap-1">
				<h1 className="text-xl font-medium text-dark-neutral-50">Welcome back</h1>
				<p className="text-sm text-neutral-400">Sign in to your account</p>
			</div>

			{error && <p className="text-xs text-critical-400">{error}</p>}

			<form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
				<AuthInput
					id="login-email"
					label="Email"
					type="email"
					placeholder="you@example.com"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
					autoComplete="email"
				/>
				<AuthInput
					id="login-password"
					label="Password"
					type="password"
					placeholder="••••••••"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
					autoComplete="current-password"
				/>

				<Button variant="light" size="lg" type="submit" loading={loading} className="w-full">
					Sign in
				</Button>
			</form>

			<p className="mt-6 text-center text-sm text-neutral-500">
				Don&apos;t have an account?{' '}
				<Button
					variant="ghost"
					size="2xs"
					type="button"
					className="font-medium text-dark-neutral-50"
					onClick={onSignUp}
				>
					Sign up
				</Button>
			</p>
		</div>
	);
}

export { Login };
