import { Config } from '@/config';
import Link from 'next/link';

export function AuthAgreement() {
	return (
		<p className="w-full text-xs leading-relaxed text-neutral-400 max-md:p-6 max-md:mt-auto md:absolute bottom-5 text-center">
			By continuing, you agree to our{' '}
			<Link
				href={Config.urls.terms}
				className="text-neutral-300 hover:text-neutral-200 border-b border-neutral-600"
				target="_blank"
				rel="noopener noreferrer"
			>
				Terms and Conditions
			</Link>{' '}
			and{' '}
			<Link
				href={Config.urls.privacy}
				className="text-neutral-300 hover:text-neutral-200 border-b border-neutral-600"
				target="_blank"
				rel="noopener noreferrer"
			>
				Privacy Policy
			</Link>
			.
		</p>
	);
}
