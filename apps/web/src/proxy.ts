import { type NextRequest } from 'next/server';

import { updateSession } from './lib/supabase/middleware';

export async function proxy(request: NextRequest) {
	return await updateSession(request);
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except:
		 *
		 * For ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - ingest (posthog route)
		 * - ph (posthog proxy)
		 * - favicon.ico (favicon file)
		 * - logo.svg (logo file)
		 * - robots.txt (robots file)
		 * - sitemap.xml (sitemap file)
		 * - site.webmanifest (manifest file)
		 *
		 * For ones ending with:
		 * - .svg, .png, .jpg, .jpeg, .gif, .webp (images)
		 */
		// prettier-ignore
		// eslint-disable-next-line no-useless-escape
		'\/((?!_next\/static|ingest|ph|_next\/image|favicon.ico|logo.svg|robots.txt|sitemap.xml|site.webmanifest|.*.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
	],
};
