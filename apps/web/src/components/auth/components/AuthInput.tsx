import { InputHTMLAttributes } from 'react';

type AuthInputProps = InputHTMLAttributes<HTMLInputElement> & {
	label: string;
	error?: string;
};

export function AuthInput({ label, error, id, ...props }: AuthInputProps) {
	return (
		<div className="flex flex-col gap-1">
			<label htmlFor={id} className="text-sm font-medium text-neutral-300">
				{label}
			</label>
			<input
				id={id}
				className="rounded-4 border border-neutral-700 bg-neutral-800 px-3 py-2_5 text-sm text-dark-neutral-50 outline-none transition-colors placeholder:text-neutral-500 focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
				{...props}
			/>
			{error && <p className="text-xs text-critical-400">{error}</p>}
		</div>
	);
}
