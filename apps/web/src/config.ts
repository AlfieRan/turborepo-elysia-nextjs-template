import { Metadata } from 'next';

import { ErrorType } from './lib/types/errors';

function requireEnv(name: string): string {
	const value = process.env[name];
	if (!value) throw new Error(`${name} is required`);
	return value;
}

export const Config = {
	urls: {
		terms: 'https://en.wikipedia.org/wiki/End-user_license_agreement', // TODO: Replace with actual terms and conditions
		privacy: 'https://en.wikipedia.org/wiki/Privacy_policy', // TODO: Replace with actual terms and conditions
		getAppUrl: (path?: string) => {
			const baseUrl = stripTrailingSlash(requireEnv('NEXT_PUBLIC_APP_URL'));
			if (!path) return baseUrl;
			if (!path.startsWith('/')) path = '/' + path;
			return baseUrl + path;
		},
		getErrorUrl: (type: ErrorType) => {
			return Config.urls.getAppUrl(`/error?type=${type}`);
		},
	},
	metadata: {
		title: 'Web App',
		description: "Add your site's description here",
		keywords: [],
	},
	containers: {
		root: 'ROOT_CONTAINER',
		modal: 'MODAL_PORTAL',
		toast: 'TOAST_PORTAL',
	},
};

type MetadataOptions = {
	image?: string;
	keywords?: string[];
};

export function getMetadata(title: string = 'Website', description?: string, options: MetadataOptions = {}): Metadata {
	const { image, keywords } = options;
	const desc = description ?? Config.metadata.description;
	const url = new URL(requireEnv('NEXT_PUBLIC_APP_URL'));
	return {
		metadataBase: url,
		title: {
			default: title,
			template: '%s | Website',
		},
		description: desc,
		keywords: keywords ?? Config.metadata.keywords,
		openGraph: {
			title,
			description: desc,
			siteName: Config.metadata.title,
			url,
			type: 'website',
			...(image === undefined ? {} : { images: [image] }),
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description: desc,
		},
		icons: {
			icon: '/favicon.ico',
			shortcut: '/favicon.ico',
			apple: '/apple-touch-icon.png',
		},
		manifest: '/site.webmanifest',
	};
}

function stripTrailingSlash(url: string) {
	if (url.endsWith('/')) return url.slice(0, -1);
	return url;
}
