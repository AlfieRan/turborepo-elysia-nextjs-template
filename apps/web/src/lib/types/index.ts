import { PropsWithChildren } from 'react';

type NextPageRequest<
	Params extends Record<string, string | string[] | undefined> = Record<string, string | string[] | undefined>,
	SearchParams extends string = string,
> = {
	params: Promise<Params>;
	searchParams: Promise<Record<SearchParams, string | string[] | undefined>>;
};

type NextLayoutRequest<Params extends Record<string, string> = Record<string, string>> = PropsWithChildren<{
	params: Promise<Params>;
}>;

type NextErrorRequest = {
	error?: Error & { digest?: string };
	reset?: () => void;
};

type NextRouteContext<Params extends Record<string, string> = Record<string, string>> = {
	params: Promise<Params>;
};

export type { NextPageRequest, NextLayoutRequest, NextErrorRequest, NextRouteContext };
export * from './state';
