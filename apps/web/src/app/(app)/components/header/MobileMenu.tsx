'use client';

import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Fragment, useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/Button';
import { ModalCloseButton, ModalOverlay } from '@/components/modals';
import { User } from '@/lib/api';
import { useEscapeKey } from '@/lib/hooks';
import { getUserDisplayName } from '@/lib/utils';

import { LogoutButton } from './AccountActionButtons';
import { UserAvatar } from './UserDropdown';

type MobileMenuProps = { user: User | null };

function MobileMenu(props: MobileMenuProps) {
	const [open, setOpen] = useState(false);

	const toggle = useCallback(() => {
		setOpen((prev) => !prev);
	}, []);

	const close = useCallback(() => {
		setOpen(false);
	}, []);

	useEscapeKey(close, open);

	useEffect(() => {
		document.body.style.overflow = open ? 'hidden' : '';
		return () => {
			document.body.style.overflow = '';
		};
	}, [open]);

	return (
		<>
			<Button
				variant="icon"
				size="sm"
				onClick={toggle}
				className="size-9 sm:hidden"
				aria-label={open ? 'Close menu' : 'Open menu'}
			>
				{open ? <XMarkIcon className="size-5" /> : <Bars3Icon className="size-5" />}
			</Button>

			<AnimatePresence>
				{open && (
					<ModalOverlay className="flex flex-col bg-neutral-950 sm:hidden">
						<div className="flex items-center justify-between px-4 py-4">
							<Image src="/logo/logo.svg" alt="Logo" width={24} height={24} />
							<ModalCloseButton onClick={close} className="size-9" ariaLabel="Close menu" />
						</div>
						<div className="flex flex-1 flex-col justify-between px-6 pb-10 pt-6">
							{props.user === null ? (
								<div className="flex flex-col gap-3 h-full items-center justify-center">
									<Button variant="outline" size="lg" className="w-full" href="/auth/register">
										Sign up
									</Button>
									<Button variant="light" size="lg" className="w-full" href="/auth">
										Sign in
									</Button>
								</div>
							) : (
								<UserControls user={props.user} />
							)}
						</div>
					</ModalOverlay>
				)}
			</AnimatePresence>
		</>
	);
}

function UserControls({ user }: { user: User }) {
	return (
		<Fragment>
			<div className="flex flex-col gap-6">
				<div className="flex flex-col gap-1">
					<div className="flex items-center gap-3">
						<UserAvatar user={user} />
						<span className="text-sm font-medium text-dark-neutral-50">{getUserDisplayName(user)}</span>
					</div>
					<span className="truncate pl-9 text-xs text-neutral-500">{user.email}</span>
				</div>
			</div>
			<div className="flex flex-col gap-3">
				<LogoutButton variant="ghost" size="lg" className="w-full" />
			</div>
		</Fragment>
	);
}

export { MobileMenu };
