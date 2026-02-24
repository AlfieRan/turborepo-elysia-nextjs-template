const PARSE_BASE_ORIGIN = 'https://app.local';
const DEFAULT_PATH = '/';

type RedirectRejectReason = 'missing' | 'non_relative' | 'double_slash' | 'unsafe_path' | 'malformed';

type SanitizedNextPath =
	| {
			path: string;
			sanitized: false;
			reason: null;
	  }
	| {
			path: string;
			sanitized: true;
			reason: RedirectRejectReason;
	  };

function sanitizeNextPath(nextPath: string | null | undefined): SanitizedNextPath {
	if (nextPath === null || nextPath === undefined) {
		return { path: DEFAULT_PATH, sanitized: true, reason: 'missing' };
	}

	const value = nextPath.trim();
	if (value.length === 0) return { path: DEFAULT_PATH, sanitized: true, reason: 'missing' };
	if (!value.startsWith('/')) return { path: DEFAULT_PATH, sanitized: true, reason: 'non_relative' };
	if (value.startsWith('//')) return { path: DEFAULT_PATH, sanitized: true, reason: 'double_slash' };
	if (value.includes('\\')) return { path: DEFAULT_PATH, sanitized: true, reason: 'unsafe_path' };

	try {
		const parsed = new URL(value, PARSE_BASE_ORIGIN);
		if (parsed.origin !== PARSE_BASE_ORIGIN) {
			return { path: DEFAULT_PATH, sanitized: true, reason: 'non_relative' };
		}

		return {
			path: `${parsed.pathname}${parsed.search}${parsed.hash}`,
			sanitized: false,
			reason: null,
		};
	} catch {
		return { path: DEFAULT_PATH, sanitized: true, reason: 'malformed' };
	}
}

function getSafeRedirectUrl(origin: string, nextPath: string | null | undefined): SanitizedNextPath & { url: URL } {
	const result = sanitizeNextPath(nextPath);
	return {
		...result,
		url: new URL(result.path, origin),
	};
}

export { sanitizeNextPath, getSafeRedirectUrl, type SanitizedNextPath, type RedirectRejectReason };
