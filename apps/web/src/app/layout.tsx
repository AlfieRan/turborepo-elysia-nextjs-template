import { Metadata } from 'next';
import localFont from 'next/font/local';
import { PropsWithChildren } from 'react';

import '../components/globals.css';
import { Config, getMetadata } from '../config';
import { LayoutClient } from './layout.client';

export const metadata: Metadata = getMetadata(undefined, Config.metadata.description);

const satoshi = localFont({
	src: './fonts/satoshi.woff2',
	display: 'swap',
	variable: '--custom-font-satoshi',
});

const ivyPesto = localFont({
	src: [
		{
			path: './fonts/ivy-pesto-headline-thin.woff2',
			weight: '100',
			style: 'normal',
		},
		{
			path: './fonts/ivy-pesto-headline-light.woff2',
			weight: '300',
			style: 'normal',
		},
		{
			path: './fonts/ivy-pesto-headline-regular.woff2',
			weight: '400',
			style: 'normal',
		},
	],
	display: 'swap',
	variable: '--custom-font-ivy-pesto',
});

const sfMono = localFont({
	src: [
		{
			path: './fonts/sf-mono-regular.woff2',
			weight: '400',
			style: 'normal',
		},
		{
			path: './fonts/sf-mono-semibold.woff2',
			weight: '600',
			style: 'normal',
		},
	],
	display: 'swap',
	variable: '--custom-font-sf-mono',
});

export default async function RootLayout({ children }: PropsWithChildren) {
	return (
		<html lang="en" translate="no">
			<body
				className={`${satoshi.variable} ${ivyPesto.variable} ${sfMono.variable} h-screen overflow-clip max-h-screen max-w-screen bg-neutral-950`}
			>
				<div id={Config.containers.root} className="h-screen w-full overflow-y-auto overflow-x-hidden">
					{children}
				</div>
				<div id={Config.containers.modal}></div>
				<div id={Config.containers.toast}></div>

				<LayoutClient />
			</body>
		</html>
	);
}
