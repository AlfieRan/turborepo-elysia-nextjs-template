'use client';

import { Config } from '@/config';
import {
	CheckCircleIcon,
	ExclamationCircleIcon,
	ExclamationTriangleIcon,
	InformationCircleIcon,
	XMarkIcon,
} from '@heroicons/react/20/solid';
import { AnimatePresence, motion } from 'framer-motion';
import { type ComponentType, useCallback, useSyncExternalStore } from 'react';

import { Button } from '@/components/Button';

import { Portal, cn } from '../utils';
import { type ToastData, type ToastType, getSnapshot, subscribe, toast as toastApi } from './store';

/* ─── Style map per toast type ─── */

type ToastStyle = {
	icon: ComponentType<{ className?: string }>;
	container: string;
	iconColor: string;
};

const styleMap: Record<ToastType, ToastStyle> = {
	error: {
		icon: ExclamationCircleIcon,
		container: 'border-critical-600/40 bg-critical-950/80',
		iconColor: 'text-critical-400',
	},
	success: {
		icon: CheckCircleIcon,
		container: 'border-success-600/40 bg-success-950/80',
		iconColor: 'text-success-400',
	},
	warning: {
		icon: ExclamationTriangleIcon,
		container: 'border-warning-600/40 bg-warning-950/80',
		iconColor: 'text-warning-400',
	},
	info: {
		icon: InformationCircleIcon,
		container: 'border-information-600/40 bg-information-950/80',
		iconColor: 'text-information-400',
	},
};

/* ─── Individual toast ─── */

function ToastItem({ data }: { data: ToastData }) {
	const style = styleMap[data.type];
	const Icon = style.icon;

	const onDismiss = useCallback(() => {
		toastApi.dismiss(data.id);
	}, [data.id]);

	return (
		<motion.div
			layout
			initial={{ opacity: 0, x: 40, scale: 0.95 }}
			animate={{ opacity: 1, x: 0, scale: 1 }}
			exit={{ opacity: 0, x: 40, scale: 0.95 }}
			transition={{ type: 'spring', stiffness: 400, damping: 30 }}
			className={cn(
				'pointer-events-auto flex w-[360px] max-w-[calc(100vw-2rem)] items-center gap-3 rounded-5 border p-3 shadow-lg backdrop-blur-sm',
				style.container,
			)}
		>
			<Icon className={cn('mt-0.5 size-5 shrink-0', style.iconColor)} />
			<p className="flex-1 text-sm leading-snug text-dark-neutral-100">{data.message}</p>
			<Button
				variant="icon"
				size="2xs"
				onClick={onDismiss}
				className="self-start shrink-0 rounded-3 p-0.5 text-neutral-400 hover:bg-neutral-0/10 hover:text-neutral-200"
			>
				<XMarkIcon className="size-4" />
			</Button>
		</motion.div>
	);
}

/* ─── Container (renders all toasts) ─── */

function ToastContainer() {
	const toasts = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

	return (
		<Portal rootId={Config.containers.toast}>
			<div className="fixed top-4 right-4 z-100 flex flex-col gap-2 pointer-events-none">
				<AnimatePresence mode="popLayout">
					{toasts.map((t) => (
						<ToastItem key={t.id} data={t} />
					))}
				</AnimatePresence>
			</div>
		</Portal>
	);
}

export { ToastContainer };
