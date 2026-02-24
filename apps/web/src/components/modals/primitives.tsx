'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import type { HTMLAttributes } from 'react';

import { Button } from '@/components/Button';
import { cn } from '@/components/utils';

const modalOverlayMotionProps = {
	initial: { opacity: 0 },
	animate: { opacity: 1 },
	exit: { opacity: 0 },
	transition: { duration: 0.2 },
} as const;

type ModalOverlayProps = {
	children: React.ReactNode;
	className?: string;
};

function ModalOverlay({ children, className }: ModalOverlayProps): React.JSX.Element {
	return (
		<motion.div {...modalOverlayMotionProps} className={cn('fixed inset-0 z-99', className)}>
			{children}
		</motion.div>
	);
}

type ModalCloseButtonProps = {
	onClick: () => void;
	className?: string;
	ariaLabel?: string;
	iconClassName?: string;
} & Omit<HTMLAttributes<HTMLButtonElement>, 'onClick' | 'className'>;

function ModalCloseButton({
	onClick,
	className,
	ariaLabel = 'Close modal',
	iconClassName,
	...props
}: ModalCloseButtonProps): React.JSX.Element {
	return (
		<Button
			variant="icon"
			size="md"
			onClick={onClick}
			className={cn('text-neutral-400 hover:text-dark-neutral-50', className)}
			aria-label={ariaLabel}
			{...props}
		>
			<XMarkIcon className={cn('size-5', iconClassName)} />
		</Button>
	);
}

export { ModalCloseButton, ModalOverlay };
