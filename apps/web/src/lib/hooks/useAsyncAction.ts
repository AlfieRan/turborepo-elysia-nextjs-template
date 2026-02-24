'use client';

import { useCallback, useRef, useTransition } from 'react';

import { toast } from '@/components';

type AsyncActionOptions = {
	successMessage?: string;
};

function useAsyncAction() {
	const [isLoading, startTransition] = useTransition();
	const isLoadingRef = useRef(false);

	const run = useCallback(
		(action: () => Promise<void>, options: AsyncActionOptions = {}): void => {
			if (isLoadingRef.current) return;

			isLoadingRef.current = true;
			startTransition(async () => {
				try {
					await action();
					if (options.successMessage) toast.success(options.successMessage);
				} catch (error) {
					toast.error(error instanceof Error ? error.message : 'An unknown error occurred');
				} finally {
					isLoadingRef.current = false;
				}
			});
		},
		[startTransition],
	);

	return [isLoading, run] as const;
}

export { useAsyncAction };
