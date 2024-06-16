import { normAbsolute } from 'utils/path.ts';

import type { DefaultOptions } from 'types/options.ts';

const conditionNames: DefaultOptions['conditionNames'] = [
	'types',
	'import',
	'require',
	'node',
	'node-addons',
	'browser',
	'default',
] as const;

/**
 * `.mts`, `.cts`, `.d.mts`, `.d.cts`, `.mjs`, `.cjs` are not included because `.cjs` and `.mjs` must be used explicitly
 */
const extensions: DefaultOptions['extensions'] = [
	'.ts',
	'.tsx',
	'.d.ts',
	'.js',
	'.jsx',
	'.json',
	'.node',
] as const;

const extensionAlias: DefaultOptions['extensionAlias'] = {
	// `.tsx` can also be compiled as `.js`
	'.js': ['.ts', '.tsx', '.d.ts', '.js',],
	'.jsx': ['.tsx', '.d.ts', '.jsx'],
	'.cjs': ['.cts', '.d.cts', '.cjs'],
	'.mjs': ['.mts', '.d.mts', '.mjs'],
} as const;

const mainFields: DefaultOptions['mainFields'] = [
	'types',
	'typings',
	'main',
	'module',
] as const;

const defaults: DefaultOptions = {
	conditionNames,
	extensions,
	extensionAlias,
	mainFields,
	useSyncFileSystemCalls: true,
	alwaysTryTypes: false,
	project: [normAbsolute(process.cwd())]
};

export {
	defaults,
	conditionNames,
	extensions,
	extensionAlias,
	mainFields
};