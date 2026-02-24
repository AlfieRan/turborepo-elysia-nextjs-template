'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '@/components/Button';
import { resendVerificationEmail } from '@/lib/api';

type ResendState = { type: 'idle' | 'loading' | 'success' } | { type: 'error'; message: string };

type Props = {
	email: string;
};

const RESEND_GENERIC_ERROR = 'Unable to resend verification email right now. Please try again.';

function TextAnimation({ children, className }: { children: React.ReactNode; className?: string }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 6 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -6 }}
			transition={{ duration: 0.2, ease: 'easeOut' }}
			className={className}
		>
			{children}
		</motion.div>
	);
}

function VerifyEmail({ email }: Props) {
	const [state, setState] = useState<ResendState>({ type: 'idle' });
	const [cooldown, setCooldown] = useState(0);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

	useEffect(() => {
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, []);

	const startCooldown = useCallback(() => {
		setCooldown(60);
		intervalRef.current = setInterval(() => {
			setCooldown((prev) => {
				if (prev <= 1) {
					if (intervalRef.current) clearInterval(intervalRef.current);
					intervalRef.current = null;
					return 0;
				}
				return prev - 1;
			});
		}, 1000);
	}, []);

	const handleResend = useCallback(async () => {
		setState({ type: 'loading' });
		try {
			const result = await resendVerificationEmail(email);

			if (result.success) {
				setState({ type: 'success' });
				startCooldown();
				return;
			}

			setState({
				type: 'error',
				message: result.message,
			});
		} catch {
			setState({
				type: 'error',
				message: RESEND_GENERIC_ERROR,
			});
		}
	}, [email, startCooldown]);

	return (
		<div className="flex w-full max-w-2xl flex-col gap-2 items-center px-4 text-center gap-4">
			<h1 className="text-xl font-semibold text-dark-neutral-50">Check your inbox</h1>

			<div className="flex flex-col items-center justify-center max-w-[320px] text-neutral-400 text-sm min-h-10">
				<AnimatePresence mode="wait">
					{state.type === 'success' ? (
						<TextAnimation key="success">
							Verification email sent to <span className="font-medium text-dark-neutral-50">{email}</span>!
							<br />
							Check your inbox to get started.
						</TextAnimation>
					) : state.type === 'error' ? (
						<TextAnimation key="error" className="text-critical-400">
							{state.message}
						</TextAnimation>
					) : (
						<TextAnimation key="idle">
							We&apos;ve sent an email to <span className="font-medium text-dark-neutral-50">{email}</span>.
							<br />
							Click on the link in the email to verify your account.
						</TextAnimation>
					)}
				</AnimatePresence>
			</div>

			<div className="flex flex-col items-center py-3">
				<Button
					size="lg"
					onClick={handleResend}
					loading={state.type === 'loading'}
					disabled={state.type === 'loading' || cooldown > 0}
					className="text-dark-neutral-50"
				>
					{state.type === 'loading' ? 'Sending...' : cooldown > 0 ? `Resend available in ${cooldown}s` : 'Resend email'}
				</Button>
			</div>

			<div className="flex flex-col items-center gap-2">
				<p className="text-center text-xs text-neutral-400">
					Still haven&apos;t received an email?
					<br />
					Check your spam folder.
				</p>
			</div>
		</div>
	);
}

export { VerifyEmail };
