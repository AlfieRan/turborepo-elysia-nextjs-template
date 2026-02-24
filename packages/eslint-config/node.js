import { config as baseConfig } from './base.js';

/**
 * A custom ESLint configuration for libraries that use Next.js.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const config = [
	...baseConfig,
	{
		rules: {
			'@typescript-eslint/explicit-function-return-type': 'error',
		},
	},
];
