import Link from 'next/link';
import { type ComponentProps, type ReactNode, forwardRef } from 'react';

import { Spinner } from '@/components/Spinner';
import { cn } from '@/components/utils/cn';

type ButtonVariant = 'filled' | 'light' | 'outline' | 'ghost' | 'icon' | 'upgrade';
type ButtonSize = '2xs' | 'xs' | 'sm' | 'md' | 'lg';

type SharedProps = {
	variant?: ButtonVariant;
	size?: ButtonSize;
	icon?: ReactNode;
	loading?: boolean;
	className?: string;
	children?: ReactNode;
};

type ButtonAsButton = SharedProps &
	Omit<ComponentProps<'button'>, keyof SharedProps> & {
		href?: undefined;
	};

type ButtonAsLink = SharedProps &
	Omit<ComponentProps<typeof Link>, keyof SharedProps> & {
		href: string;
	};

type ButtonProps = ButtonAsButton | ButtonAsLink;

const baseStyles =
	'inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors disabled:cursor-not-allowed disabled:opacity-50';

const variantStyles: Record<ButtonVariant, string> = {
	filled: `${baseStyles} bg-neutral-800 text-dark-neutral-50 hover:bg-neutral-700`,
	light: `${baseStyles} bg-dark-neutral-50 text-dark-neutral-0 hover:bg-dark-neutral-200`,
	outline: `${baseStyles} border border-neutral-600 text-dark-neutral-50 hover:bg-neutral-800`,
	ghost: `${baseStyles} text-neutral-400 hover:text-neutral-300`,
	icon: `${baseStyles} text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300`,
	upgrade: `${baseStyles} bg-purple-600 text-white hover:bg-purple-500`,
};

const sizeStyles: Record<ButtonVariant, Record<ButtonSize, string>> = {
	filled: {
		'2xs': 'rounded-5 px-1.5 py-0.5 text-2xs font-medium',
		xs: 'rounded-5 px-2 py-1 text-2xs font-medium',
		sm: 'rounded-5 px-3 py-1.5 text-xs font-medium',
		md: 'rounded-5 px-4 py-2 text-sm font-medium',
		lg: 'rounded-4 px-4 py-2.5 text-sm font-medium',
	},
	light: {
		'2xs': 'rounded-5 px-1.5 py-0.5 text-2xs font-medium',
		xs: 'rounded-5 px-2 py-1 text-2xs font-medium',
		sm: 'rounded-5 px-3 py-1.5 text-xs font-medium',
		md: 'rounded-5 px-4 py-2 text-sm font-medium',
		lg: 'rounded-4 px-4 py-2.5 text-sm font-medium',
	},
	outline: {
		'2xs': 'rounded-5 px-1.5 py-0_5 text-2xs font-medium',
		xs: 'rounded-5 px-2 py-0_5 text-2xs font-medium',
		sm: 'rounded-5 px-3 py-1 text-xs font-medium',
		md: 'rounded-5 px-4 py-1.5 text-sm font-medium',
		lg: 'rounded-4 px-4 py-2.5 text-sm font-medium',
	},
	ghost: {
		'2xs': 'rounded-full px-1.5 py-0_5 text-2xs font-medium',
		xs: 'rounded-full px-2 py-0_5 text-2xs font-medium',
		sm: 'rounded-full px-3 py-1 text-xs font-medium',
		md: 'rounded-full px-4 py-1.5 text-sm font-medium',
		lg: 'rounded-full px-5 py-2 text-sm font-medium',
	},
	icon: {
		'2xs': 'size-5 rounded-full',
		xs: 'size-6 rounded-full',
		sm: 'size-7 rounded-full',
		md: 'size-8 rounded-full',
		lg: 'size-10 rounded-full',
	},
	upgrade: {
		'2xs': 'rounded-5 px-1.5 py-0.5 text-2xs font-semibold',
		xs: 'rounded-5 px-2 py-1 text-2xs font-semibold',
		sm: 'rounded-5 px-3 py-1.5 text-xs font-semibold',
		md: 'rounded-5 px-4 py-2 text-sm font-semibold',
		lg: 'rounded-4 px-4 py-2.5 text-sm font-semibold',
	},
};

function getButtonClasses(variant: ButtonVariant, size: ButtonSize, className?: string): string {
	return cn(variantStyles[variant], sizeStyles[variant][size], className);
}

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>((props, ref) => {
	const { variant = 'filled', size = 'md', icon, loading, className, children, ...rest } = props;
	const classes = getButtonClasses(variant, size, className);

	const content = (
		<>
			{loading ? <Spinner size="sm" /> : icon ? <span className="shrink-0">{icon}</span> : null}
			{loading && variant !== 'icon' ? 'Loading...' : children}
		</>
	);

	if (rest.href !== undefined) {
		const { href, ...linkRest } = rest as ButtonAsLink;
		return (
			<Link ref={ref as React.Ref<HTMLAnchorElement>} href={href} className={classes} {...linkRest}>
				{content}
			</Link>
		);
	}

	const buttonRest = rest as Omit<ButtonAsButton, keyof SharedProps>;
	return (
		<button
			ref={ref as React.Ref<HTMLButtonElement>}
			type="button"
			className={classes}
			disabled={buttonRest.disabled ?? loading}
			{...buttonRest}
		>
			{content}
		</button>
	);
});

Button.displayName = 'Button';

export { Button, type ButtonVariant, type ButtonSize };
