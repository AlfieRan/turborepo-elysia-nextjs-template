import type { User } from '@/lib/api';

function getUserDisplayName(user: Pick<User, 'firstName' | 'lastName'>): string {
	return [user.firstName, user.lastName].filter(Boolean).join(' ') || 'User';
}

function getUserInitials(user: Pick<User, 'firstName' | 'lastName'>): string {
	return (
		[user.firstName, user.lastName]
			.filter((part): part is string => Boolean(part))
			.map((part) => part.charAt(0).toUpperCase())
			.join('') || 'U'
	);
}

export { getUserDisplayName, getUserInitials };
