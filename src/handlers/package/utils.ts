import { dirname } from 'node:path';
import { join } from 'node:path/posix';
import { existsSync, readFileSync } from 'node:fs';
import type { PackageJson } from 'type-fest';

import { isString, isUnknownRecord } from 'utils/assert.ts';
import { pkgFilename, prefixTypes } from 'utils/path/constants.ts';
import { findFirstUp, stripBOM } from 'utils/path/file.ts';
import { getDirname, getRelation, isRelative } from 'utils/path/main.ts';

import { getOptions } from 'handlers/options/index.ts';
import type { EntryPoint } from 'handlers/options/types.ts';
import type {
	ExternalPkgResult,
	InternalPkgResult,
	ParsedEntryPoints,
	ParsedExports
} from 'handlers/package/types.ts';

export function getPkgDir(fileOrDir: string) {
	const dir = getDirname(fileOrDir);
	const file = findFirstUp(pkgFilename, dir);
	return file ? dirname(file) : null;
}

// @see https://github.com/un-ts/eslint-plugin-import-x/blob/master/src/utils/read-pkg-up.ts
export const parsePkgJson = (path: string) => {
	/** @todo error handling */
	return JSON.parse(
		stripBOM(readFileSync(path, { encoding: 'utf8' })),
	) as PackageJson;
};

export function createMatchedDirs(pkgDir: string, sourceFile: string) {
	const relation = getRelation(sourceFile, pkgDir);

	return (!relation)
		? []
		: relation
			/** @todo confirm */
			.split('/')
			.reduce((all, cur, ind) => {
				const prev = all[ind - 1] || '';
				const dir = prev === '' ? cur : `${prev}/${cur}`;
				return [...all, dir];
			}, [] as string[]);
}

export function createInternalPkgJsonResult(
	pkgDir: string,
): InternalPkgResult {
	const path = join(pkgDir, pkgFilename);
	const parsed = parsePkgJson(path);

	// loggers.debug(
	// 	`${colors.blueDark(PackageHandler.name)} created an entry for %o`,
	// 	replaceCwd(path)
	// );

	return {
		parsed,
		path,
		dir: pkgDir,
		dirs: new Set([]),
		deps: new Set([
			...(Object.keys(parsed.dependencies || {})),
			...(Object.keys(parsed.devDependencies || {})),
		])
		/** @todo parse imports ! */
	};
}

// ######

export function stripPkgBasePath(modulePath: string) {
	const parts = modulePath.split('/');

	return (parts[0].startsWith('@')) ? parts.slice(0, 2).join('/') : parts[0];
}

export function getPkgPathRequest(
	pkgName: NonNullable<PackageJson['name']>,
	modulePath: string
) {
	// consider that we might be searching in '@types/<modulePath>
	const base = pkgName.startsWith(prefixTypes) && !modulePath.startsWith(prefixTypes)
		? stripPkgBasePath(modulePath) : pkgName;

	return modulePath.replace(base, '.') as keyof ParsedExports;
}

export function getExternalPaths(
	pkgName: ReturnType<typeof stripPkgBasePath>,
	dirs: string[]
	// dirs: `${Cwd}/${string}`[]
) {
	const paths = new Set<string>();

	dirs.forEach(dir => {
		// prefer '<modules>/@types/<dependency>/package.json'
		let typedPkgName = (pkgName.startsWith(prefixTypes))
			? pkgName
			: (pkgName.startsWith('@'))
				? `${prefixTypes}/${pkgName.substring(1).replace('/', '__')}`
				: `${prefixTypes}/${pkgName}`;

		let pkgPath = join(dir, typedPkgName, pkgFilename);

		if (existsSync(pkgPath)) {
			paths.add(pkgPath);
		}

		// fallback '<modules>/<dependency>/package.json'
		pkgPath = join(dir, pkgName, pkgFilename);

		if (existsSync(pkgPath)) {
			paths.add(pkgPath);
		}
	});

	return [...paths];
}

export function createExternalPkgJsonResult(
	name: string,
	path: string,
): ExternalPkgResult {
	const dir = dirname(path);
	const parsed = parsePkgJson(path);

	// loggers.debug(
	// 	`${colors.blueDark(PackageHandler.name)} created an entry for %o`,
	// 	replaceCwd(path)
	// );

	return {
		name: parsed.name ?? name,
		parsed,
		path,
		dir,
		entryPoints: createEntryPoints(parsed)
	};
}

export function createEntryPoints(parsed: PackageJson) {
	const entryPoints: ParsedEntryPoints = {};

	const exports = parseExportsField(parsed.exports);
	const types = parsed.types
		?? parsed.typings
		?? (exports && findMainTypesCondition(exports['.']));

	getOptions()
		.entryPoints
		.filter((key): key is Exclude<
			EntryPoint,
			'types' | 'typings' | 'exports'
		> => !['types', 'typings', 'exports'].includes(key))
		.forEach(key => {
			let val = parsed[key];

			if (val && isString(val)) {
				entryPoints[key] = val;
			}
		});

	if (types) {
		entryPoints.types = types;
	}

	if (exports) {
		entryPoints.exports = exports;
	}

	Object.keys(entryPoints)
		.filter((key): key is keyof Omit<ParsedEntryPoints, 'exports'> => key !== 'exports')
		.forEach(key => {
			const val = entryPoints[key];
			if (isString(val) && !isRelative(val)) {
				entryPoints[key] = `./${val}`;
			}
		});

	return entryPoints;
}

function parseExportsField(
	field: PackageJson.Exports | undefined,
): ParsedExports | undefined {
	if (!field) return;

	if (typeof field === 'string' || Array.isArray(field)) {
		return { '.': field };
	}

	const conditions = new Set(getOptions().conditions);

	// check conditional mapping
	const mainKey = Object.keys(field).filter(key => key === '.')[0];
	const mappedKeys = Object.keys(field).filter(key => key.startsWith('./'));
	const conditionalKeys = Object.keys(field).filter(key => conditions.has(key));
	const fallback = {} as ParsedExports;

	// combine conditional keys
	if (!mainKey) {
		return {
			'.': conditionalKeys.reduce(...getKeysReducer(field)),
			...(!mappedKeys ? fallback : mappedKeys.reduce(...getKeysReducer(field)))
		};
	}

	// should be a rare case
	// path and conditional are mixed up
	if (mainKey && conditionalKeys.length > 0) {
		// use the one which has higher priority
		const keys = Object.keys(field);

		let indexCondition = 0;

		while (indexCondition < keys.length) {
			if (conditions.has(keys[indexCondition])) break;
			indexCondition++;
		}

		const mainVals = indexCondition > keys.indexOf(mainKey)
			? field[mainKey]
			: conditionalKeys.reduce(...getKeysReducer(field));

		return {
			// ts complaines when [mainKey] is used
			'.': mainVals,
			...(!mappedKeys ? fallback : mappedKeys.reduce(...getKeysReducer(field)))
		};
	}

	// filter odd ones out
	return {
		'.': field[mainKey],
		...(!mappedKeys ? fallback : mappedKeys.reduce(...getKeysReducer(field)))
	};
}

function getKeysReducer<T = PackageJson.ExportConditions>(
	exports: T
): [
		(all: Partial<T>, key: keyof T) => Partial<T>,
		{}
	] {
	return [
		(all, key) => ({
			...all,
			[key]: exports[key]
		}),
		{}
	];
}

function findMainTypesCondition(
	mappings: PackageJson.Exports
): string | undefined {
	if (!mappings) return;

	if (isString(mappings)) return;

	if (Array.isArray(mappings)) {
		for (const item of mappings) {
			if (isUnknownRecord(item)) {
				return findMainTypesCondition(item);
			}
		}
	}

	for (const item of Object.values(mappings)) {
		if (isUnknownRecord(item)) {
			return findMainTypesCondition(item);
		}
	}

	if (
		'types' in mappings &&
		isString(mappings.types) &&
		mappings.types.endsWith('.ts')
	) {
		return mappings.types;
	}
}