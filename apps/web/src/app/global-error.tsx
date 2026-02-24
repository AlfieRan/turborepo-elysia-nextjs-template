'use client';

import { NextErrorRequest } from '@/lib/types';

import { ErrorPage } from '@/components';

export default function GlobalError({ reset }: NextErrorRequest) {
	return (
		<html>
			<head>
				<title>500 | Internal Server Error</title>
			</head>
			<body>
				<ErrorPage type="500" reset={reset} />
			</body>
		</html>
	);
}
