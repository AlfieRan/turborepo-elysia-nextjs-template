import { useEffect, useRef } from 'react';

export function usePolling(fn: () => unknown, timeout_ms: number, runOnPageLoad: boolean = false) {
	const ref = useRef<{ timeout: NodeJS.Timeout; scheduled_at: number; last_poll_at: number } | null>(null);

	useEffect(() => {
		function schedule() {
			const scheduled_at = Date.now();
			const timeout = setTimeout(() => poll(scheduled_at), timeout_ms);
			ref.current = { timeout, scheduled_at, last_poll_at: ref.current?.last_poll_at ?? Date.now() };
		}

		function exec() {
			if (!ref.current) return;

			if (document.visibilityState === 'visible') {
				ref.current.last_poll_at = Date.now();
				fn();
			}

			schedule();
		}

		function poll(timestamp: number) {
			if (!ref.current || timestamp !== ref.current.scheduled_at) return;
			exec();
		}

		function visibilitychange() {
			if (!ref.current || Date.now() - ref.current.last_poll_at < timeout_ms || document.visibilityState !== 'visible')
				return;
			exec();
		}

		schedule();
		document.addEventListener('visibilitychange', visibilitychange);

		return () => {
			document.removeEventListener('visibilitychange', visibilitychange);
			if (ref.current) {
				clearTimeout(ref.current.timeout);
				ref.current = null;
			}
		};
	}, [fn, timeout_ms]);

	const hasRun = useRef(false);
	useEffect(() => {
		if (!runOnPageLoad || hasRun.current) return;
		hasRun.current = true;
		fn();
	}, [fn, runOnPageLoad]);
}
