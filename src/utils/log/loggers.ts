import debug from 'debug';

// import { name } from '../../package.json';

const name = 'eslint-import-resolver:ts';

const main = debug(name);

/** @todo bind for ENV vitest */
// const bind = (member: debug.Debugger) => {
// 	/** @todo check necessity */
// 	/** @todo bind to main.log */
// 	member.log = console.log.bind(console);
// 	return member;
// };

// const extend = main.extend.bind(console);

const extended = {
	info: main.extend('info'),
	warn: main.extend('warn'),
	debug: main.extend('debug'),
} as const;

main.color = '33';
extended.info.color = '8';
extended.debug.color = '45';
extended.warn.color = '3';

// extended.info.color = '4';
// extended.warn.color = '3';
// extended.debug.color = '6';

const loggers = {
	main,
	...extended,
};

Object.freeze(loggers);

export { name, loggers };

export type LoggerLevel = keyof typeof extended;
