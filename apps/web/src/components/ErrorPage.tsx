'use client';

import { NextErrorRequest } from '@/lib/types';

import { Button } from './Button';

type Props = NextErrorRequest & {
	type: '404' | '500';
	description?: string;
	size?: 'small' | 'medium';
};

export function ErrorPage({ description, type, reset, size = 'medium' }: Props) {
	const titleSize = size === 'small' ? 'text-[30vw] h-[30vw]' : 'text-[40vw] h-[40vw]';
	return (
		<div className="relative flex w-full h-full min-h-[80vh] items-center justify-center">
			<div className="absolute -top-[5%] left-0 w-full h-full flex items-center justify-center overflow-hidden">
				<h1
					className={`${titleSize} font-bold text-transparent bg-clip-text bg-linear-to-t from-neutral-500 to-neutral-900`}
					style={{
						lineHeight: '1',
					}}
				>
					{type === '404' ? '404' : '500'}
				</h1>
			</div>
			<div className="relative text-center px-4 flex flex-col gap-1 items-center z-20">
				<h2 className="text-3xl font-bold">Oops...</h2>
				<p className="text-sm text-neutral-100">{description || 'Something went wrong!'}</p>

				<div className="flex gap-2 mt-4 justify-center">
					{reset && (
						<Button variant="filled" onClick={reset}>
							Try again
						</Button>
					)}
					<Button variant="light" href="/">
						Back to home
					</Button>
				</div>
			</div>
		</div>
	);
}
