import { existsSync, statSync } from 'node:fs';
import { dirname, parse, resolve } from 'node:path';
import slash from 'slash';

import { loggers } from '../log/loggers.ts';
import { replaceCwd } from '../log/utils.ts';
import { getDirname, getSlashedCwd } from './main.ts';

export const stripBOM = (str: string) => str.replace(/^\uFEFF/, '');

// @see https://github.com/un-ts/eslint-plugin-import-x/blob/master/src/utils/pkg-up.ts
export function findFirstUp(
	name: string | string[],
	dir = process.cwd()
): string | null {
	const root = parse(dir).root;
	const names = [name].flat();

	while (true) {
		const paths = names.map(item => resolve(dir, item));
		const path = paths.find(item => existsSync(item));

		if (path) {
			return slash(path);
		}

		if (dir === root) {
			loggers.warn('Could not find any of %o', names);
			return null;
		}

		loggers.debug('in %o', replaceCwd(dir));
		dir = dirname(dir);
	}
}

export function findAllUp(
	name: string | string[],
	dirOrFile: string
): string[] | null {
	const stop = getSlashedCwd();
	const names = [name].flat();
	const matched = new Set<string>();

	let dir = slash(getDirname(dirOrFile));

	while (true) {
		names
			.map(item => resolve(dir, item))
			.filter(item => existsSync(item))
			.forEach(item => matched.add(item));

		if (dir === stop) {
			break;
		}

		loggers.debug('in %o', replaceCwd(slash(dir)));
		dir = dirname(dir);
	}

	if (matched.size === 0) {
		loggers.warn('Could not find any of %o', names);
	}

	return matched.size > 0
		? [...matched].map(slash)
		: null;
}

export function isDirectory(path: string) {
	try {
		return statSync(path, { throwIfNoEntry: false })?.isDirectory() ?? false;
	} catch { }

	return false;
}