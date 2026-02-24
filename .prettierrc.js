module.exports = {
	tabWidth: 2,
	useTabs: true,
	semi: true,
	singleQuote: true,
	printWidth: 120,

	trailingComma: 'all',
	bracketSpacing: true,
	bracketSameLine: false,
	arrowParens: 'always',
	endOfLine: 'lf',
	embeddedLanguageFormatting: 'auto',
	jsxSingleQuote: false,
	quoteProps: 'as-needed',
	overrides: [
		{
			files: '*.md',
			options: {
				parser: 'markdown',
			},
		},
	],
	importOrder: [
		'<THIRD_PARTY_MODULES>',
		'@repo/shared',
		'^@/(admin|db|lib|middleware|users|components)/(.*)$',
		'@env',
		'@/(components|config.js)',
		'^[./]',
	],
	importOrderSeparation: true,
	importOrderSortSpecifiers: true,

	plugins: ['@trivago/prettier-plugin-sort-imports'],
};
