import { NextPageRequest } from '@/lib/types';
import { ErrorType } from '@/lib/types/errors';

import { ErrorPage as ErrorPageComponent } from '@/components';

async function ErrorPage({ searchParams }: NextPageRequest<Record<string, string>, 'type'>) {
	const params = await searchParams;
	const type = ErrorType.parse(params.type);
	const description = getDescription(type);
	return <ErrorPageComponent description={description} type="500" />;
}

function getDescription(error: ErrorType): string | undefined {
	switch (error) {
		case 'auth.confirmation_failed':
			return 'Failed to confirm email!';

		case 'auth.callback_failed':
			return 'Failed to authenticate!';

		default:
			return undefined;
	}
}

export default ErrorPage;
