type VerificationResult = { mode: 'allow' } | { mode: 'block'; message: string; status: number };

const PUBLIC_EMAIL_DOMAINS = new Set([
	'gmail.com',
	'googlemail.com',
	'yahoo.com',
	'yahoo.co.uk',
	'outlook.com',
	'hotmail.com',
	'live.com',
	'msn.com',
	'icloud.com',
	'me.com',
	'mac.com',
	'aol.com',
	'protonmail.com',
	'pm.me',
	'hey.com',
]);

// NOTE: This is a placeholder for the email verification logic, I'd recommend using a service like UserCheck or EmailValidator to verify the email address.
async function verifyEmail(email: string): Promise<VerificationResult> {
	if (!email) return { mode: 'block', message: 'Please enter a valid email address', status: 400 };
	const domain = extractDomain(email);
	if (!domain) return { mode: 'block', message: 'Please enter a valid email address', status: 400 };
	if (PUBLIC_EMAIL_DOMAINS.has(domain)) return { mode: 'allow' };
	return { mode: 'allow' };
}

function extractDomain(email: string): string | null {
	const atIndex = email.lastIndexOf('@');
	if (atIndex === -1 || atIndex === email.length - 1) return null;
	return email.slice(atIndex + 1).toLowerCase();
}

export { verifyEmail };
