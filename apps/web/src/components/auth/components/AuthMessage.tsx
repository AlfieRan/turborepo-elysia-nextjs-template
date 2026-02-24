import { PropsWithChildren } from 'react';

type AuthMessageProps = PropsWithChildren<{
	variant: 'error' | 'success' | 'info';
}>;

const styles = {
	error: 'border-critical-800/50 bg-critical-900/30 text-critical-400',
	success: 'border-success-800/50 bg-success-900/30 text-success-400',
	info: 'border-information-800/50 bg-information-900/30 text-information-400',
};

export function AuthMessage({ variant, children }: AuthMessageProps) {
	if (!children) return null;
	return <div className={`rounded-4 border px-4 py-3 text-sm ${styles[variant]}`}>{children}</div>;
}
