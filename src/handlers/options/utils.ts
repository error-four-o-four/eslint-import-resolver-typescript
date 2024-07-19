import type { InternalOptions } from 'handlers/options/types.ts';

const modules: InternalOptions['modules'] = [
	'node_modules'
];

// @see https://nodejs.org/api/packages.html#package-entry-points
export const entryPoints: InternalOptions['entryPoints'] = [
	'types',
	'typings',
	// 'exports',
	'main',
	'module',
	'browser',
	'sideEffects',
	'esnext',
	'bin',
];


// @see https://nodejs.org/api/packages.html#community-conditions-definitions
export const conditions: InternalOptions['conditions'] = [
	'types',
	'default',
	'import',
	'require',
	'node',
	'node-addons',
	'browser',
	// 'development',
	// 'production'
];

export const defaults: InternalOptions = {
	modules,
	entryPoints,
	conditions,
	extensions: []
};