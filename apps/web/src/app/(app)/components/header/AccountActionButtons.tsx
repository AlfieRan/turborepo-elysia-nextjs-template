'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import { Button, type ButtonSize, type ButtonVariant } from '@/components/Button';
import { signOut } from '@/lib/api';
import { useAsyncAction } from '@/lib/hooks';
import { getSupabaseBrowser } from '@/lib/supabase';

type ActionButtonProps = {
	variant: ButtonVariant;
	size: ButtonSize;
	className?: string;
};

function LogoutButton({ variant, size, className }: ActionButtonProps): React.JSX.Element {
	const router = useRouter();
	const supabase = getSupabaseBrowser();
	const [isLoading, run] = useAsyncAction();

	const onClick = useCallback(() => {
		run(async () => {
			await signOut(supabase);
			router.push('/');
		});
	}, [run, supabase, router]);

	return (
		<Button variant={variant} size={size} className={className} loading={isLoading} onClick={onClick}>
			Logout
		</Button>
	);
}

export { LogoutButton };
