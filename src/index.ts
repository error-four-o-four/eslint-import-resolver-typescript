import isCoreModule from 'is-core-module';

import { loggers } from 'utils/log/loggers.ts';
import { replaceCwd } from 'utils/log/utils.ts';
import { colors } from 'utils/log/colors.ts';
import { hasTypescriptExt, removeAfter } from 'utils/path/main.ts';

import { applyUserOptions } from 'handlers/options/index.ts';
import type { ResolverOptions } from 'handlers/options/types.ts';

import { getResolvedPaths } from 'core/index.ts';
import type { ResolvedResult } from 'core/types.ts';

export const interfaceVersion = 2;

/**
 * @param modulePath the requested module path
 * @param sourceFile the absolute path of the source file
 * @param userOptions
 * @returns
 */
export function resolve(
	modulePath: string,
	sourceFile: string,
	userOptions: ResolverOptions | true,
): ResolvedResult {
	let request = removeAfter(modulePath, '?');

	loggers.main(
		'Attempting to resolve %o ...\n... in source file %o ...',
		modulePath,
		replaceCwd(sourceFile)
	);

	if (isCoreModule(request)) {
		loggers.main(`... ${colors.yellow('resolved')} module path as a core module`);

		return {
			found: true,
			path: null
		};
	}

	applyUserOptions(userOptions);

	const paths = getResolvedPaths(sourceFile, request);
	const path = paths.find(item => hasTypescriptExt(item)) ?? paths[0];

	if (path) {
		loggers.main(
			`... ${colors.yellow('resolved')} module path to %o`,
			replaceCwd(path)
		);

		return {
			found: true,
			path
		};
	}

	loggers.main(`... could ${colors.yellow('not')} resolve module path`);

	return {
		found: false
	};
}

export type {
	Resolver,
	ResolvedResult,
	ResultFound,
	ResultNotFound,
} from './core/types.ts';

export type {
	ResolverOptions
} from './handlers/options/types.ts';

export type {
	FileExtension
} from './utils/path/types.ts';