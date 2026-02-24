import Image from 'next/image';
import { Fragment, PropsWithChildren } from 'react';

import { Button } from '@/components/Button';
import { User } from '@/lib/api';

import { MobileMenu } from './MobileMenu';
import { UserDropdown } from './UserDropdown';

type HeaderProps = { user: User | null };

function Header(props: HeaderProps) {
	return (
		<Fragment>
			{props.user !== null ? (
				<div className="hidden items-center gap-3 sm:flex">
					<UserDropdown user={props.user} />
				</div>
			) : (
				<div className="hidden items-center gap-2 sm:flex">
					<Button variant="outline" size="md" href="/auth">
						Sign in
					</Button>
					<Button variant="light" size="md" href="/auth/register">
						Get started
					</Button>
				</div>
			)}

			<div className="flex items-center gap-2 sm:hidden">
				<MobileMenu {...props} />
			</div>
		</Fragment>
	);
}

function HeaderLayout({ children }: PropsWithChildren) {
	return (
		<header className="relative z-99 flex items-center justify-between px-4 py-4 sm:px-6">
			<Image src="/logo/logo.svg" alt="Logo" width={32} height={32} priority />
			{children}
		</header>
	);
}

function HeaderSkeleton() {
	return (
		<Fragment>
			<div className="hidden items-center gap-2 sm:flex">
				<div className="h-8 w-16 animate-pulse rounded-5 bg-neutral-800" />
				<div className="h-8 w-16 animate-pulse rounded-5 bg-neutral-800" />
			</div>

			<div className="size-9 animate-pulse rounded-full bg-neutral-800 sm:hidden" />
		</Fragment>
	);
}

export { Header, HeaderSkeleton, HeaderLayout };
