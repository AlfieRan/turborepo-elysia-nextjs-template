import { z } from 'zod';

import { AsyncZodParser } from '@repo/shared';

type Props<Req, Res> = { route: string; parser: AsyncZodParser<Res> } & (
	| { method: 'GET'; body?: undefined }
	| { method: 'POST'; body: Req }
	| { method: 'PUT'; body: Req }
);

export async function nextFetcher<Req, Res extends z.core.output<unknown>>(props: Props<Req, Res>): Promise<Res> {
	const { route, parser, method, body } = props;
	const headers: Record<string, string> = {};
	let requestBody: BodyInit | undefined = undefined;

	if (body instanceof FormData) {
		requestBody = body;
	} else if (body) {
		headers['Content-Type'] = 'application/json';
		requestBody = JSON.stringify(body);
	}

	const res = await fetch(route, {
		method,
		headers,
		body: requestBody,
	});
	const data = await res.json();
	const parsed = await parser(data);
	if (!parsed.success) throw new Error('Something went wrong');
	return parsed.data;
}

export function reply<T>(data: T, status: number) {
	return new Response(JSON.stringify(data), {
		status,
	});
}
