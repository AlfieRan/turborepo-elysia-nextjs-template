import { getPosthogClient } from '@/core/posthog/index.js';
import { Elysia } from 'elysia';
import { z } from 'zod';

import { ApiError } from '@repo/shared';

export const errorHandler = new Elysia({ name: 'errorHandler' })
	.error({ CUSTOM: ApiError, ZOD: z.core.$ZodError })
	.onError({ as: 'global' }, ({ code, error, set, route, request }): string => {
		let response: string = 'Internal server error';

		switch (code) {
			case 'CUSTOM':
				set.status = error.status;
				response = error.message;
				break;

			case 'ZOD':
			case 'VALIDATION':
				set.status = 400;
				response = error.message;
				break;

			case 'NOT_FOUND':
				set.status = 404;
				response = 'Resource Not Found';
				break;

			case 'INVALID_COOKIE_SIGNATURE':
			case 'PARSE':
			case 'INVALID_FILE_TYPE':
				response = error.message;
				break;

			default:
				set.status = 500;
				break;
		}

		console.warn(`[${request.method} - ${set.status}] ${route} - ${response}`);

		const status = typeof set.status === 'number' ? set.status : 500;
		if (status >= 500) {
			const posthog = getPosthogClient('api');
			posthog.captureException(error, { route, method: request.method, status });
		}

		return response;
	});
