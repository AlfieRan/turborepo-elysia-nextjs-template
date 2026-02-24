'use client';

import { useUser } from '@/lib/hooks';

import { Header, HeaderLayout, HeaderSkeleton } from './components/header';

export default function Page() {
	const { user, loading } = useUser();

	return (
		<div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-2">
			<HeaderLayout>{loading ? <HeaderSkeleton /> : <Header user={user} />}</HeaderLayout>

			<main className="flex flex-1 flex-col items-center justify-center px-4">
				{loading ? (
					<div className="flex flex-col items-center gap-3">
						<div className="h-8 w-48 animate-pulse rounded-5 bg-neutral-800" />
						<div className="h-5 w-64 animate-pulse rounded-5 bg-neutral-800" />
					</div>
				) : user ? (
					<div className="flex flex-col items-center gap-2 animate-fade-up-sm">
						<h1 className="text-2xl font-medium text-dark-neutral-50">
							Welcome{user.firstName ? `, ${user.firstName}` : ''}
						</h1>
						<p className="text-sm text-neutral-400">You&apos;re signed in. Start building something great.</p>
					</div>
				) : (
					<div className="flex flex-col items-center gap-4 animate-fade-up-sm">
						<h1 className="text-2xl font-medium text-dark-neutral-50">Welcome</h1>
						<p className="text-sm text-neutral-400">Sign in or create an account to get started.</p>
					</div>
				)}
			</main>
		</div>
	);
}
