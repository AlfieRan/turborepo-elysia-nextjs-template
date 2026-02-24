'use client';

import { FormEvent, useCallback, useState } from 'react';

import { Button } from '@/components/Button';
import { signUp } from '@/lib/api';

import { AuthInput, AuthMessage } from './components';

type Props = {
	onSuccess: (_email: string) => void;
	onLogin: () => void;
};

function Register({ onSuccess, onLogin }: Props) {
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
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
				await signUp({
					email,
					password,
					firstName,
					lastName,
				});

				onSuccess(email);
			} catch (error) {
				if (error instanceof Error && error.message === 'email_unverified') {
					onSuccess(email);
					return;
				}
				setError(error instanceof Error ? error.message : 'An unknown error occurred');
			} finally {
				setLoading(false);
			}
		},
		[email, password, firstName, lastName, onSuccess],
	);

	return (
		<div className="w-full max-w-[320px] px-4 animate-fade-up-sm">
			<div className="flex flex-col gap-1">
				<h1 className="text-xl font-semibold text-dark-neutral-50">Create an account</h1>
				<p className="mt-1.5 text-sm text-neutral-400">Get started</p>
			</div>

			{error ? (
				<div className="mt-4">
					<AuthMessage variant="error">{error}</AuthMessage>
				</div>
			) : null}

			<form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
				<AuthInput
					id="register-first-name"
					label="First name"
					type="text"
					placeholder="Jane"
					value={firstName}
					onChange={(e) => setFirstName(e.target.value)}
					required
					autoComplete="given-name"
				/>
				<AuthInput
					id="register-last-name"
					label="Last name"
					type="text"
					placeholder="Doe"
					value={lastName}
					onChange={(e) => setLastName(e.target.value)}
					required
					autoComplete="family-name"
				/>
				<AuthInput
					id="register-email"
					label="Email"
					type="email"
					placeholder="you@example.com"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
					autoComplete="email"
				/>
				<AuthInput
					id="register-password"
					label="Password"
					type="password"
					placeholder="••••••••"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
					minLength={8}
					autoComplete="new-password"
				/>

				<Button variant="light" size="lg" type="submit" loading={loading} className="w-full">
					Create account
				</Button>
			</form>

			<p className="mt-6 text-center text-sm text-neutral-500">
				Already have an account?{' '}
				<Button variant="ghost" size="sm" className="-mx-2 font-medium text-dark-neutral-50" onClick={onLogin}>
					Sign in
				</Button>
			</p>
		</div>
	);
}

export { Register };
