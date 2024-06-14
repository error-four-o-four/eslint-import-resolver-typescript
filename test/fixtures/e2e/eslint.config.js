import { fixupPluginRules } from '@eslint/compat';
import { parser } from 'typescript-eslint';

import pluginImportX from 'eslint-plugin-import-x';

// console.log('eslint cwd: %o', process.cwd());

/** @type {import('@eslint/compat').FlatConfig} */
const config = {
	name: 'test',
	files: ['**/*.js', '**/*.ts', '!**/*.test.ts'],
	plugins: {
		'import-x': fixupPluginRules(pluginImportX),
	},
	languageOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
		parser,
		parserOptions: {
			projectService: true,
		},
	},
	settings: {
		'import-x/resolver': {
			typescript: true,
		},
	},
	rules: {
		'import-x/no-unresolved': 2,
	},
};

export default [config];
