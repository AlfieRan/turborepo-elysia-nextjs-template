import { RefObject, useEffect } from 'react';

export function useClickAway(
	ref: RefObject<HTMLElement | null>,
	callback: () => unknown,
	secondaryRef?: RefObject<HTMLElement>,
) {
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (!ref.current || ref.current.contains(event.target as Node)) return;
			if (secondaryRef && secondaryRef.current && secondaryRef.current.contains(event.target as Node)) return;
			callback();
		}

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [ref, callback, secondaryRef]);
}
