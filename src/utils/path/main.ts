import {
	dirname,
	parse,
	relative,
	resolve as nresolve
} from 'node:path';

import slash from 'slash';

export function removeBefore(input: string, seperator: string) {
	const index = input.lastIndexOf(seperator);
	return index >= 0 ? input.slice(index + 1) : input;
}

export function removeAfter(input: string, seperator: string) {
	const index = input.lastIndexOf(seperator);
	return index >= 0 ? input.slice(0, index) : input;
}

const isWin = process.platform === 'win32';

export function getSlashedCwd() {
	return isWin ? slash(process.cwd()) : process.cwd();
}

export function resolve(...args: Parameters<typeof nresolve>) {
	return isWin ? slash(nresolve(...args)) : nresolve(...args);
}

export function getDirname(fileOrDir: string) {
	return Boolean(parse(fileOrDir).ext) ? dirname(fileOrDir) : fileOrDir;
}

export function getRelation(fileOrDir: string, wd = process.cwd()) {
	const dir = getDirname(fileOrDir);
	return relative(wd, dir) || null;
}

const RE_WIN_ROOT = /^[\W\w]:\\/;
export const hasWinRoot = (input: string) => RE_WIN_ROOT.test(input);

const RE_JS_EXT = /\.[c,m]?js|jsx$/;
export const hasJavascriptExt = (input: string) => RE_JS_EXT.test(input);

const RE_TS_EXT = /\.[c,m]?tsx?$/;
export const hasTypescriptExt = (input: string) => RE_TS_EXT.test(input);

const RE_DTS = /\.d$|\.d\.?/;
export const hasDeclaration = (path: string) => RE_DTS.test(path);

const RE_RELATIVE = /^\.{1,2}(?:\/.*)?$/;
export const isRelative = (path: string) => RE_RELATIVE.test(path);

export const isImports = (path: string) => path.startsWith('#');
