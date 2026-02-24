'use client';

import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { type PropsWithChildren, type ReactNode, useCallback, useRef, useState } from 'react';

import { Button, type ButtonSize, type ButtonVariant } from '@/components/Button';
import { cn } from '@/components/utils/cn';
import { useClickAway } from '@/lib/hooks';

// ─── Base popover shell ───

type DropdownMenuPropsBase = {
	trigger: ReactNode;
	align?: 'left' | 'right';
	position?: 'top' | 'bottom';
	menuMinWidth?: string;
	menuClassName?: string;
	className?: string;
};

type DropdownMenuPropsCore = PropsWithChildren<
	DropdownMenuPropsBase & {
		/** The element that toggles the menu. */
		open: boolean;
		setOpen: (open: boolean) => void;
	}
>;

type DropdownMenuProps = PropsWithChildren<DropdownMenuPropsBase>;

function DropdownMenuCore({
	trigger,
	children,
	align = 'left',
	position = 'bottom',
	menuMinWidth = '100px',
	menuClassName,
	className,
	open,
	setOpen,
}: DropdownMenuPropsCore) {
	const wrapperRef = useRef<HTMLDivElement>(null);
	useClickAway(wrapperRef, () => setOpen(false));

	return (
		<div ref={wrapperRef} className={cn('relative', className)}>
			<div onClick={() => setOpen(!open)}>{trigger}</div>

			{open ? (
				<div
					className={cn(
						'absolute z-50 rounded-5 border border-neutral-700 bg-neutral-900 py-1 shadow-lg',
						position === 'top' ? 'bottom-full mb-1' : 'top-full mt-2',
						align === 'right' ? 'right-0' : 'left-0',
						menuClassName,
					)}
					style={{ minWidth: menuMinWidth }}
				>
					{children}
				</div>
			) : null}
		</div>
	);
}

function DropdownMenu(props: DropdownMenuProps) {
	const [open, setOpen] = useState(false);
	return <DropdownMenuCore open={open} setOpen={setOpen} {...props} />;
}

// ─── Value-picker dropdown (convenience wrapper) ───

type DropdownProps<Value extends string> = {
	value: Value;
	options: readonly Value[] | Value[];
	onChange: (v: Value) => void;
	getOptionLabel?: (v: Value) => string;
	/** Leading icon rendered inside the trigger button. */
	icon?: ReactNode;
	/** Button variant for the trigger. @default 'ghost' */
	triggerVariant?: ButtonVariant;
	/** Button size for the trigger. @default 'sm' */
	size?: ButtonSize;
	/** Minimum width of the popover menu. @default '100px' */
	menuMinWidth?: string;
	className?: string;
};

function Dropdown<Value extends string>({
	value,
	options,
	onChange,
	getOptionLabel,
	icon,
	triggerVariant = 'ghost',
	size = 'sm',
	menuMinWidth = '100px',
	className,
}: DropdownProps<Value>) {
	const [open, setOpen] = useState(false);
	const optionLabel = useCallback((opt: Value) => (getOptionLabel ? getOptionLabel(opt) : opt), [getOptionLabel]);

	const handleSelect = useCallback(
		(opt: Value) => {
			onChange(opt);
			setOpen(false);
		},
		[onChange],
	);

	return (
		<DropdownMenuCore
			open={open}
			setOpen={setOpen}
			trigger={
				<Button variant={triggerVariant} size={size} icon={icon}>
					<span className="whitespace-nowrap">{optionLabel(value)}</span>
					<ChevronDownIcon className="size-2.5" />
				</Button>
			}
			position="top"
			menuMinWidth={menuMinWidth}
			className={className}
			menuClassName="max-h-56 overflow-y-auto"
		>
			{options.map((opt) => (
				<button
					key={opt}
					type="button"
					onClick={() => handleSelect(opt)}
					className={cn(
						'block w-full rounded-4 px-3 py-1.5 text-left text-xs transition-colors',
						opt === value
							? 'bg-neutral-800 text-dark-neutral-50'
							: 'text-neutral-400 hover:bg-neutral-800/70 hover:text-neutral-200',
					)}
				>
					{optionLabel(opt)}
				</button>
			))}
		</DropdownMenuCore>
	);
}

export { Dropdown, DropdownMenu, type DropdownProps, type DropdownMenuProps };
