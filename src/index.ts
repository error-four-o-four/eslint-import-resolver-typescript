import isCoreModule from 'is-core-module';

import {
	removeAfter,
	normAbsolute,
	resolveNormed
} from 'utils/path.ts';

import { log } from 'utils/log.ts';

import { validateUserOptions } from 'core/options/validator.ts';

import type { ResolveOptions, ResolvedResult } from './types.ts';

export {
	conditionNames,
	extensions,
	extensionAlias,
	mainFields
} from './core/options/resolve.ts';

export const interfaceVersion = 2;

export function resolve(
	modulePath: string,
	sourceFile: string,
	userOptions?: ResolveOptions | null,
): ResolvedResult {
	const request = removeAfter(modulePath, '?');
	log('Resolving %o in %o ...', modulePath, sourceFile);

	if (isCoreModule(request)) {
		log('Which is a core module. ✅', request);
		return {
			found: true,
			path: null
		};
	}

	const validOptions = validateUserOptions(userOptions);
	log('With options %O', validOptions);

	const cwd = normAbsolute(process.cwd());
	const requestor = resolveNormed(cwd, sourceFile);

	console.log(requestor);

	log(requestor);

	return {
		found: false
	};
}

export type * from './types.ts';