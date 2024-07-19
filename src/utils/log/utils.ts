import slash from 'slash';
import debug from 'debug';
import type { Debugger } from 'debug';
import type { UnknownArray } from 'type-fest';

import { getSlashedCwd, hasWinRoot } from 'utils/path/main.ts';
import { name } from './loggers.ts';
// import { LoggerLevel, loggers, name } from './loggers.ts';

export const enable = (level?: 'all' | 'info' | 'debug') => {
	if (level === 'all') {
		debug.enable('eslint*');
		return;
	}

	let namespace = `${name},${name}:warn`;

	if (level === 'info' || level === 'debug') {
		namespace += `,${name}:info`;
	}

	if (level === 'debug') {
		namespace += `,${name}:debug`;
	}

	debug.enable(namespace);
};

export const disable = debug.disable;

// #####

const replacement = '<root>';

export const replaceCwd = (path: string) => {
	if (hasWinRoot(path)) {
		return slash(path.replace(process.cwd(), replacement));
	}

	return path.replace(getSlashedCwd(), replacement);
};

// #####

const loggedOnce = new Set<string>();

export function logOnce(
	logger: Debugger,
	key: string,
	...args: Parameters<Debugger>
) {
	if (loggedOnce.has(key)) return;

	loggedOnce.add(key);
	logger(...args);
}

export function clearOnce(key: string) {
	loggedOnce.delete(key);
}

export function logMany(logger: Debugger, args: UnknownArray) {
	args.forEach((item) => logger(item));
}

// #####

// export class Collector {
// 	private logger: Debugger;
// 	private messages: Set<string>;

// 	constructor(level?: LoggerLevel) {
// 		this.logger = level ? loggers[level] : loggers.main;
// 		this.messages = new Set();
// 	}

// 	add(message: string) {
// 		this.messages.add(message);
// 	}

// 	log() {
// 		this.messages.forEach(item => this.logger(item));
// 	}
// }

// function insertSpace(msg: string) {
// 	return msg === '' ? '' : ' ';
// }

// function isLevelKey(arg: string): arg is LoggerLevel {
// 	return Object.keys(extended).includes(arg);
// }

// function parseParams(obj: typeof logger, args: LoggerParams) {
// 	let arg = args.shift();
// 	let msg = '';
// 	let fn = obj.log;

// 	if (typeof arg === 'string' && isLevelKey(arg)) {
// 		fn = obj[arg];
// 		arg = args.shift();
// 	} else if (typeof arg === 'function') {
// 		fn = arg as Debugger;
// 		arg = args.shift();
// 	}

// 	if (typeof arg === 'string') {
// 		msg = arg;
// 	}

// 	return [fn, msg, args] as [Debugger, string, unknown[]];
// }

// type LoggerParams = [Debugger | LoggerLevel, string, ...unknown[]]
// 	| [string, ...unknown[]];
