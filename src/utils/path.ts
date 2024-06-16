import { platform } from "node:os";

import {
	dirname,
	isAbsolute,
	join,
	parse,
	resolve,
	sep
} from 'node:path';

const isWin32 = platform() === 'win32';

export const np = {
	dirname,
	isAbsolute,
	join,
	resolve,
	parse,
	sep
};

// #####

export const removeBefore = (input: string, seperator: string) => {
	const index = input.lastIndexOf(seperator);
	return index >= 0 ? input.slice(index + 1) : input;
};

export const removeAfter = (input: string, seperator: string) => {
	const index = input.lastIndexOf(seperator);
	return index >= 0 ? input.slice(0, index) : input;
};

// #####

export const normSlash = (path: string) => isWin32 ? path.replaceAll(np.sep, '/') : path;

const RE_RELATIVE = /^\.{1,2}(?:\/.*)?$/;

export const isRelativePath = (path: string) => RE_RELATIVE.test(path);

function assertAbsolute(path: string) {
	if (!np.isAbsolute(path)) throw new Error(`Expected absolute path. Received: '${path}'`);
	return;
}

function assertRelative(path: string) {
	if (np.isAbsolute(path)) throw new Error(`Expected relative path. Received: '${path}'`);
	return;
}

export const normAbsolute = (path: string) => {
	assertAbsolute(path);
	return isWin32 ? removeBefore(normSlash(path), ':') : path;
};

export const normRelative = (path: string) => {
	/** @consider special case '~/foo' */
	assertRelative(path);
	return (!RE_RELATIVE.test(path)) ? `./${path}` : path;
};

export const resolveNormed = (...args: string[]) => normAbsolute(np.resolve(...args));

// const reScoped = /^@.+\//
// export const isScoped