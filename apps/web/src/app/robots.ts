import type { MetadataRoute } from 'next';

import { Config } from '../config';

export default function robots(): MetadataRoute.Robots {
	const baseUrl = Config.urls.getAppUrl();
	return {
		rules: { userAgent: '*', allow: '/' },
		sitemap: `${baseUrl}/sitemap.xml`,
	};
}
