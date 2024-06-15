import debug from "debug";

import { name } from '../../package.json';

const log = debug(name);

log.log = console.log.bind(console);

const enable = debug.enable.bind(debug, name);
const disable = debug.disable.bind(debug);

export {
	log,
	enable,
	disable,
};