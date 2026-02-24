import { config } from '@repo/eslint-config/node';

/** @type {import("eslint").Linter.Config[]} */
export default [...config, { ignores: ['dist/**', '.types/**', 'node_modules/**'] }];
