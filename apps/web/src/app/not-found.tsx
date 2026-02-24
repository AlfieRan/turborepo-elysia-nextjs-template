import { getMetadata } from '@/config';

import { ErrorPage } from '@/components';

export const metadata = getMetadata(
	'Page not found',
	'The page you’re looking for doesn’t exist or may have been moved.',
	{
		keywords: [],
	},
);

export default function NotFound() {
	return <ErrorPage type="404" description="This page does not exist" />;
}
