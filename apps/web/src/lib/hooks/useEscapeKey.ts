'use client';

import { useEffect } from 'react';

/**
 * Registers a global `keydown` listener that calls `handler` when the Escape
 * key is pressed. The listener is only active while `enabled` is `true`
 * (defaults to `true`).
 */
function useEscapeKey(handler: () => void, enabled: boolean = true): void {
	useEffect(() => {
		if (!enabled) return;

		function onKeyDown(e: KeyboardEvent): void {
			if (e.key === 'Escape') handler();
		}

		document.addEventListener('keydown', onKeyDown);
		return () => document.removeEventListener('keydown', onKeyDown);
	}, [handler, enabled]);
}

export { useEscapeKey };
