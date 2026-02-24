import { z } from 'zod';

const ErrorType = z.enum(['unknown', 'auth.confirmation_failed', 'auth.callback_failed']).catch('unknown');

type ErrorType = z.infer<typeof ErrorType>;

export { ErrorType };
