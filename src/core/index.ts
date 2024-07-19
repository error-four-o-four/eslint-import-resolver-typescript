import { dirname } from 'node:path';
import { existsSync } from 'node:fs';

import { loggers } from 'utils/log/loggers.ts';
import { replaceCwd } from 'utils/log/utils.ts';
import { isString } from 'utils/assert.ts';
import { pkgFilename } from 'utils/path/constants.ts';
import { isImports, isRelative, resolve } from 'utils/path/main.ts';

/** @todo use pkg conditional-exports.parse */
import { getPackageHandler, getTsconfigHandler } from 'handlers/index.ts';
import { stripPkgBasePath } from 'handlers/package/utils.ts';
import type { TscResult } from 'handlers/tsconfig/types.ts';

import { resolveExternal } from './external.ts';
import { resolveInternal } from './internal.ts';

/**
 * @returns an array of absolute and existing file paths
 */
export function getResolvedPaths(
	requestor: string,
	request: string,
): string[] {
	const resolved = getMatchedPaths(requestor, request)
		.map(matchedPath => {
			loggers.info(
				'Mapped module path to %o',
				replaceCwd(matchedPath)
			);

			const [message, result] = matchedPath.endsWith(pkgFilename)
				? resolveExternal(request, matchedPath)
				: resolveInternal(requestor, matchedPath);

			if (message) {
				loggers.info(message);
			}

			return result;
		})
		.filter((resolvedPath): resolvedPath is string => isString(resolvedPath));

	if (resolved.length > 1) {
		/** @todo condition should be multiple resolved .js paths */
		loggers.warn('resolved multiple matching paths:');
	}

	return resolved;
}

/**
 * Converts the requested module path to absolute file paths.
 * Distinquishes relative, imports, dependency or mapped tsc paths.
 * If the requested module is an external dependency
 * the returned path points to its 'package.json' file.
 * Otherwise the returned path points to an internal file or folder.
 * @todo resolve imports
 * @todo resolve internal mono repo packages
 */
export function getMatchedPaths(
	requestor: string,
	request: string,
): string[] {
	if (isRelative(request)) {
		loggers.main('... as a relative module path ...');
		return [resolve(dirname(requestor), request)];
	}

	if (isImports(request)) {
		loggers.main('... as a hashed module path ...');
		return [getImportsPath(requestor, request)];
	};

	const tsc = getTsconfigHandler().get(requestor);

	let matched = getBaseUrlPath(request, tsc);

	if (matched) {
		loggers.main('... as a module path relative to \'baseUrl\' ...');
		return matched;
	}

	matched = getPackagePaths(requestor, request, tsc);

	if (matched) {
		loggers.main('... as a dependency ...');
		return matched;
	}

	matched = getMappedPaths(request, tsc);

	if (matched) {
		loggers.main('... as a mapped module path ...');
		return matched;
	}

	/** @todo consider */
	// return getBaseUrlPath(request, tsc)
	// 	|| getPackagePaths(requestor, request, tsc)
	// 	|| getMappedPaths(request, tsc)
	// 	|| [];

	return [];
}

/**
 * @todo
 * @returns
 */
function getImportsPath(
	requestor: string,
	request: string,
) {
	/** @todo */
	// const pkgHandler = getPackageHandler();
	// resolve imports field
	// check actual file or package.json module
	return '@todo';
};

/**
 *
 * Checks existing bare specifier module names.
 * https://www.typescriptlang.org/tsconfig/#baseUrl
 */
function getBaseUrlPath(
	request: string,
	tsc: TscResult | null
): string[] | null {
	if (!tsc) return null;

	let base = tsc?.parsed.compilerOptions.baseUrl;

	if (!base) return null;

	base = resolve(tsc.dir, base);

	return existsSync(resolve(base, request.split('/')[0]))
		? [resolve(base, request)]
		: null;
}

/**
 * Iterates over internal pkgs to find dependencies
 * which correspond to the requested module path
 * @returns
 */
function getPackagePaths(
	requestor: string,
	request: string,
	tsc: TscResult | null
): string[] | null {
	const pkgHandler = getPackageHandler();
	const baseRequest = request.includes('/')
		? stripPkgBasePath(request) : request;

	/** @todo check cache !!! external */

	if (isMappedInternalPath(request, tsc)) {
		return null;
	}

	pkgHandler.searchExternalNameRecursive(requestor, baseRequest);

	if (!pkgHandler.current) {
		return null;
	}

	return pkgHandler.matchExternalPath(baseRequest);
}

/**
 * Excludes prefixed (`~/*`, `@src/*`) or bare (`src/core/*`) paths
 * which resolve to internal files. Paths which could be resolved
 * to vendors (`jquery`, `lodash`, `whatever`) are not excluded
 */
function isMappedInternalPath(
	request: string,
	tsc: TscResult | null
) {
	if (!tsc) return false;

	if (!tsc.parsed.compilerOptions.paths) return false;

	for (const pattern of Object.keys(tsc.parsed.compilerOptions.paths)) {
		/** @todo confirm conditions */
		if (
			pattern.includes('*') &&
			request.startsWith(pattern.split('*')[0])
		) {
			return true;
		}
	}

	return false;
}

/**
 * Uses tsc path mapper to convert the requested path
 * to a mapped, absolute file path
 */
function getMappedPaths(
	request: string,
	tsc: TscResult | null
) {
	if (!tsc) return null;

	const mapped = tsc.mapper && tsc.mapper(request);

	if (!mapped) return mapped;

	/** @todo check dirname.includes('node_modules') and package.json paths */

	return mapped;
}
