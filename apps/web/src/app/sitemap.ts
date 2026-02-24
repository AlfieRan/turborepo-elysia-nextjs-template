import type { MetadataRoute } from 'next';

import { Config } from '../config';

export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = Config.urls.getAppUrl();

	const pages: MetadataRoute.Sitemap = [
		{
			url: '/',
			changeFrequency: 'weekly',
			priority: 1,
		},
		{
			url: Config.urls.terms,
			changeFrequency: 'monthly',
			priority: 0.3,
		},
		{
			url: Config.urls.privacy,
			changeFrequency: 'monthly',
			priority: 0.3,
		},
	];

	return pages.map((page) => ({
		...page,
		url: getAbsoluteUrl(baseUrl, page.url),
	}));
}

function getAbsoluteUrl(baseUrl: string, relativeUrl: string) {
	if (relativeUrl.startsWith('/')) return `${baseUrl}${relativeUrl}`;
	else if (relativeUrl.startsWith('https://')) return relativeUrl;
	return `${baseUrl}/${relativeUrl}`;
}
