import { log } from "utils/log.ts";

import type { DefaultOptions, InternalOptions } from "types/options.ts";

import { defaults } from "./resolve.ts";


const validOptions = new Set<keyof InternalOptions>([
	// ##### enhanced-resolve
	'alias',
	'aliasFields',
	'cachePredicate',
	'cacheWithContext',
	'conditionNames',
	'descriptionFiles',
	'enforceExtension',
	'exportsFields',
	'extensionAlias',
	'extensions',
	'fallback',
	// 'fileSystem'
	'fullySpecified',
	'importsFields',
	'mainFields',
	'mainFiles',
	'modules',
	'plugins',
	'pnpApi',
	'preferAbsolute',
	'preferRelative',
	'resolveToContext',
	'resolver',
	'restrictions',
	'roots',
	'symlinks',
	'unsafeCache',
	// 'useSyncFileSystemCalls'

	// ##### eslint-import-resolver
	'alwaysTryTypes',
	'project'
]);

export function validateUserOptions(input?: unknown): DefaultOptions {
	log('Validating resolver options ...');

	if (input === null || input === undefined) {
		return defaults;
	}

	if (typeof input !== 'object' || Array.isArray(input)) {
		log('Received invalid resolver options - fallback to default options');
		return defaults;
	}

	Object.keys(input).forEach((key) => {
		if (!validOptions.has(key as keyof InternalOptions)) {
			log('%o is an invalid option', key);
			delete input[key as keyof typeof input];
		}
	});

	return {
		...defaults,
		...input,
	};
}