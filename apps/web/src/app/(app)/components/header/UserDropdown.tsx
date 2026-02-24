import { DropdownMenu } from '@/components/Dropdown';
import { cn } from '@/components/utils/cn';
import { User } from '@/lib/api';
import { getUserInitials } from '@/lib/utils';

import { LogoutButton } from './AccountActionButtons';

type Props = {
	user: User;
};

function UserDropdown({ user }: Props) {
	return (
		<DropdownMenu
			trigger={
				<button
					type="button"
					className="flex items-center gap-4 cursor-pointer rounded-7 -m-2 p-2 hover:bg-neutral-900 transition-colors duration-200"
				>
					<UserAvatar user={user} />
				</button>
			}
			align="right"
			menuMinWidth="200px"
			menuClassName="flex flex-col gap-2"
			className="z-50 hidden sm:flex"
		>
			<span className="truncate px-3 py-1.5 text-xs text-neutral-400">{user.email}</span>
			<div className="mx-2 border-t border-neutral-700" />
			<LogoutButton variant="ghost" size="sm" className="w-full justify-start" />
		</DropdownMenu>
	);
}

function UserAvatar({ user, className }: { user: User; className?: string }) {
	const initials = getUserInitials(user);

	return (
		<div
			className={cn(
				'flex size-6 items-center justify-center rounded-full bg-neutral-700 text-xs font-semibold text-dark-neutral-50',
				className,
			)}
		>
			{initials}
		</div>
	);
}

export { UserDropdown, UserAvatar };
