module.exports = {
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', 'prettier'],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended',
		'prettier',
	],
	parserOptions: {
		ecmaVersion: 'esnext',
		sourceType: 'module',
	},
	env: {
		node: true,
	},
	ignorePatterns: ['dist'],
	rules: {
		quotes: ['warn', 'single'],
		'dot-notation': 'off',
		eqeqeq: 'warn',
		curly: ['warn', 'all'],
		'brace-style': ['warn'],
		'prefer-arrow-callback': ['warn'],
		'no-console': ['warn'], // use the provided Homebridge log method instead
		'comma-spacing': ['error'],
		'no-multi-spaces': ['warn'],
		'no-trailing-spaces': ['error'],
		'lines-between-class-members': [
			'warn',
			'always',
			{ exceptAfterSingleLine: true },
		],
		'@typescript-eslint/semi': ['warn'],
		'@typescript-eslint/member-delimiter-style': ['warn'],
		'prefer-const': 'error',
		'no-unused-vars': 'off',
		'no-cond-assign': ['error', 'always'],
		'@typescript-eslint/no-unused-vars': [
			'error',
			{ ignoreRestSiblings: true },
		],
		'@typescript-eslint/no-explicit-any': 'error',
		'prettier/prettier': 'error',
	},
	overrides: [
		{
			files: ['*.js'],
			rules: {
				'@typescript-eslint/no-var-requires': 'off',
			},
		},
	],
};
