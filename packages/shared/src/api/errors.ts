import { EdenFetchError } from '@elysiajs/eden';

class ApiError extends EdenFetchError<number, string> {
	constructor(status: number, message: string) {
		super(status, message);
	}

	static async fromResponse(response: Response): Promise<ApiError> {
		let message: string;
		try {
			message = await response.text();
		} catch {
			if (typeof response === 'object' && response !== null && 'statusText' in response) {
				message = response.statusText;
			} else {
				message = 'Something went wrong';
			}
		}

		switch (response.status) {
			case 400:
				return new BadRequestError(message);
			case 401:
				return new UnauthorizedError(message);
			case 404:
				return new NotFoundError(message);
			case 500:
				return new InternalServerError(message);
			case 502:
				return new BadGatewayError(message);
			default:
				return new ApiError(response.status, message);
		}
	}
}

class BadRequestError extends ApiError {
	constructor(message = 'Bad request') {
		super(400, message);
	}
}

class UnauthorizedError extends ApiError {
	constructor(message = 'Unauthorized') {
		super(401, message);
	}
}

class NotFoundError extends ApiError {
	constructor(message = 'Resource not found') {
		super(404, message);
	}
}

class InternalServerError extends ApiError {
	constructor(message = 'Internal server error') {
		super(500, message);
	}
}

class BadGatewayError extends ApiError {
	constructor(message = 'Bad gateway') {
		super(502, message);
	}
}

export { ApiError, BadRequestError, UnauthorizedError, NotFoundError, InternalServerError, BadGatewayError };
