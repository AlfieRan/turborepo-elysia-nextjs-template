import { z } from 'zod';

// Schemas

const SignUpRequestBase = z.object({
	email: z.email(),
	firstName: z.string().nullable(),
	lastName: z.string().nullable(),
});

const SignUpRequestAdmin = SignUpRequestBase.extend({
	userId: z.uuid(),
});

const SignUpRequest = SignUpRequestBase.extend({
	password: z.string().min(8),
});

const EmailVerificationState = z.object({
	email: z.string(),
	exists: z.boolean(),
	verified: z.boolean(),
});

// Types

type SignUpRequest = z.infer<typeof SignUpRequest>;
type SignUpRequestAdmin = z.infer<typeof SignUpRequestAdmin>;
type SignUpRequestBase = z.infer<typeof SignUpRequestBase>;

type EmailVerificationState = z.infer<typeof EmailVerificationState>;

export { SignUpRequest, SignUpRequestAdmin, EmailVerificationState };
