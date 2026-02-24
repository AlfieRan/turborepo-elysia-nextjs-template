type ToastType = 'error' | 'success' | 'warning' | 'info';

type ToastData = {
	id: string;
	type: ToastType;
	message: string;
	duration: number;
};

type ToastOptions = {
	duration?: number;
};

const DEFAULT_DURATION: Record<ToastType, number> = {
	error: 7000,
	success: 5000,
	warning: 6000,
	info: 5000,
};

const MAX_TOASTS = 5;

let toasts: ToastData[] = [];
const listeners = new Set<() => void>();
let counter = 0;

function emit(): void {
	for (const listener of listeners) {
		listener();
	}
}

function addToast(type: ToastType, message: string, options?: ToastOptions): string {
	const id = `toast-${++counter}-${Date.now()}`;
	const duration = options?.duration ?? DEFAULT_DURATION[type];
	const item: ToastData = { id, type, message, duration };

	toasts = [...toasts, item].slice(-MAX_TOASTS);
	emit();

	if (duration > 0) {
		setTimeout(() => removeToast(id), duration);
	}

	return id;
}

function removeToast(id: string): void {
	const prev = toasts;
	toasts = toasts.filter((t) => t.id !== id);
	if (toasts !== prev) emit();
}

/** Public toast API — callable from anywhere (components, hooks, utility functions). */
const toast = {
	error: (message: string, options?: ToastOptions): string => addToast('error', message, options),
	success: (message: string, options?: ToastOptions): string => addToast('success', message, options),
	warning: (message: string, options?: ToastOptions): string => addToast('warning', message, options),
	info: (message: string, options?: ToastOptions): string => addToast('info', message, options),
	dismiss: removeToast,
	dismissAll: (): void => {
		toasts = [];
		emit();
	},
};

/** Subscribe to store changes (for useSyncExternalStore). */
function subscribe(listener: () => void): () => void {
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
	};
}

/** Get current snapshot (for useSyncExternalStore). */
function getSnapshot(): ToastData[] {
	return toasts;
}

export { toast, subscribe, getSnapshot };
export type { ToastData, ToastType, ToastOptions };
