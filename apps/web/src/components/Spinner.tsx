import { ArrowPathIcon } from '@heroicons/react/24/solid';

import { cn } from '@/components/utils';

type SpinnerProps = {
	size?: 'sm' | 'md' | 'lg';
	className?: string;
};

const sizeStyles: Record<NonNullable<SpinnerProps['size']>, string> = {
	sm: 'size-3.5',
	md: 'size-5',
	lg: 'size-6',
};

function Spinner({ size = 'sm', className }: SpinnerProps) {
	return (
		<span className={cn('inline-flex items-center justify-center', className)}>
			<ArrowPathIcon className={cn('animate-spin', sizeStyles[size])} />
		</span>
	);
}

export { Spinner };
