import { parse } from 'node:path';
import { existsSync } from 'node:fs';
import type { PackageJson } from 'type-fest';

import { loggers } from 'utils/log/loggers.ts';
import { EXT } from 'utils/path/constants.ts';
import {
	hasJavascriptExt,
	hasTypescriptExt,
	resolve,
} from 'utils/path/main.ts';

import { getPkgPathRequest } from 'handlers/package/utils.ts';
import { getPackageHandler } from 'handlers/index.ts';
import type {
	ExternalPkgResult,
	ParsedExports,
} from 'handlers/package/types.ts';

import { resolveWithExtensions } from './utils.ts';
import type { ResolvedPathResult } from './types.ts';

/**
 * Reads and resolves the entry points defined in 'package.json'.
 * Prioritizes resolved declaration files over exports over default entry points.
 */
export function resolveExternal(
	modulePath: string,
	matchedPath: string,
): ResolvedPathResult {
	const pkg = getPackageHandler().external[matchedPath];
	const requestedPath = getPkgPathRequest(pkg.name, modulePath);

	/** @todo depends on tsc module resolution */
	// if (request.at(-1) === '/') {
	// 	console.log('Only requesting file allowed');
	// 	return null;
	// }

	/** @todo consider using the current internal pkg (esp. to check pkg.type) */
	let resolvedPath = getPathFromEntryPoints(
		requestedPath,
		pkg.dir,
		pkg.entryPoints,
	);

	if (!resolvedPath || !existsSync(resolvedPath)) {
		/** @todo */
		return ['Nope', null];
	}

	if (hasTypescriptExt(resolvedPath)) {
		return [null, resolvedPath];
	}

	resolvedPath =
		resolveWithExtensions(resolvedPath.replace(parse(resolvedPath).ext, ''), [
			EXT.DTS,
			EXT.MTS,
			EXT.CTS,
		]) || resolvedPath;

	if (hasJavascriptExt(resolvedPath)) {
		return ['Could not find declaration file', resolvedPath];
	}

	return [null, resolvedPath];
}

function getPathFromEntryPoints(
	requestedPath: keyof ParsedExports,
	basePath: string,
	entryPoints: ExternalPkgResult['entryPoints'],
): string | null {
	let result: string | null = null;

	// highest priority
	if (requestedPath === '.' && entryPoints.types) {
		loggers.debug("Found 'types' field in 'package.json'");
		result = resolve(basePath, entryPoints.types);
	}

	if (!result && entryPoints.exports) {
		result = findPathInExports(requestedPath, entryPoints.exports);
		result && loggers.debug("Found %o in 'exports' field", result);
		result = result ? resolve(basePath, result) : null;
	}

	/** @todo (legacy) main fields */
	/** @todo distinguish imports vs requires */

	return result;
}

/** @todo use package conitional-export */
function findPathInExports(
	requestedPath: keyof ParsedExports,
	exports: ParsedExports,
) {
	/** @todo distinguish imports vs requires */
	/** @todo user conditions https://www.typescriptlang.org/tsconfig/#customConditions */
	const conditions = ['types', 'import', 'require', 'node', 'default'];

	let matchedKey: keyof ParsedExports | undefined;
	let matchedPrefix: string | undefined;
	let data: string[] = [];

	let result: string | null = null;

	if (exports[requestedPath]) {
		matchedKey = requestedPath;
		matchedPrefix = requestedPath;
		result = matchCondition(exports[requestedPath], conditions);
	} else {
		[matchedKey, matchedPrefix, data] = matchKey(requestedPath, exports);

		result =
			(matchedKey && matchCondition(exports[matchedKey], conditions, data)) ??
			null;
	}

	if (!result) return null;

	/** @todo depends on moduleResolution !!! */
	// If is dir match, the return must be dir
	const keyIsDir = matchedKey && matchedKey.endsWith('/');
	const resultIsDir = result.endsWith('/');
	if (keyIsDir && !resultIsDir) return null;
	if (!keyIsDir && resultIsDir) return null;
	if (matchedPrefix && requestedPath !== matchedPrefix) {
		result += requestedPath.slice(matchedPrefix.length);
	}

	/** @todo check extensions !! */
	return result;
}

function matchCondition(
	exports: PackageJson.Exports | undefined,
	conditions: string[],
	data?: string[],
): string | null {
	if (!exports) {
		return null;
	}

	if (typeof exports === 'string') {
		if (!data || !data.length) {
			return exports;
		}

		let result = '';

		//
		for (let i = 0, j = 0; i < exports.length; i += 1) {
			// wildcard path
			const nextIsStar = exports[i] === '*';

			if (nextIsStar && exports[i + 1] === '*') {
				return null;
			}

			result += nextIsStar ? data[j++] || '' : exports[i];
		}

		return result;
	}

	if (Array.isArray(exports)) {
		for (const item of exports) {
			const result = matchCondition(item, conditions, data);
			if (result) return result;
		}
		return null;
	}

	for (const key of Object.keys(exports)) {
		if (conditions.includes(key)) {
			const result = matchCondition(exports[key], conditions, data);
			if (result) return result;
		}
	}

	return null;
}

function matchKey(
	requestedPath: keyof ParsedExports,
	exports: ParsedExports,
): readonly [keyof ParsedExports | undefined, string | undefined, string[]] {
	const keys = Object.keys(exports).sort((a, b) => b.length - a.length);
	const data = [];
	const pathLen = requestedPath.length;

	/** @todo type ! */
	let matched: keyof ParsedExports | undefined;
	let prefix: string | undefined;

	for (const key of keys) {
		// break early
		if (matched) break;

		let pathIdx = 0;
		let keyIdx = 0;

		for (pathIdx = 0; pathIdx < pathLen; pathIdx += 1) {
			if (requestedPath[pathIdx] === key[keyIdx]) {
				keyIdx += 1;
			} else if (key[keyIdx] === '*') {
				const next = key[keyIdx + 1];

				if (next === '*') break;

				const nextPathIdx = !next
					? pathLen
					: requestedPath.indexOf(next, pathIdx + 1);

				if (nextPathIdx === -1) break;

				data.push(requestedPath.slice(pathIdx, nextPathIdx));
				keyIdx += 2;
				pathIdx = nextPathIdx;
			} else {
				break;
			}
		}

		if (keyIdx < key.length || (pathIdx < pathLen && !key.endsWith('/'))) {
			// reset data for next iteration
			data.length = 0;
		} else {
			matched = key as keyof ParsedExports;
			prefix = requestedPath.slice(0, pathIdx);
		}
	}
	return [matched, prefix, data] as const;
}
