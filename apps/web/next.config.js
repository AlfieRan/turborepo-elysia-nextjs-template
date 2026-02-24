import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
	transpilePackages: ['@repo/shared', '@repo/api'],
	reactCompiler: true,
	reactStrictMode: true,
	turbopack: {
		root: path.join(__dirname, '..', '..'),
	},
	skipTrailingSlashRedirect: true,
	async rewrites() {
		return [
			{
				source: '/update/static/:path*',
				destination: 'https://eu-assets.i.posthog.com/static/:path*',
			},
			{
				source: '/update/:path*',
				destination: 'https://eu.i.posthog.com/:path*',
			},
		];
	},
	async redirects() {
		return [
			{
				source: '/404',
				destination: '/not-found',
				permanent: true,
			},
		];
	},
	images: {
		qualities: [75, 80, 90],
	},
};

export default nextConfig;
