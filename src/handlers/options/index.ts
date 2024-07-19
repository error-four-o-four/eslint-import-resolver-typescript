import { loggers } from 'utils/log/loggers.ts';
import { colors } from 'utils/log/colors.ts';
import type { Cwd } from 'utils/path/types.ts';

import { cwdHandler } from 'handlers/cwd.ts';

import { OptionsHandler } from './class.ts';

const cache: Record<Cwd, OptionsHandler> = {};

/**
 * Validates, hashes and caches user options.
 */
export function applyUserOptions(userOptions: unknown) {
	const cwd = cwdHandler.get();
	const handler = !cache.hasOwnProperty(cwd)
		? new OptionsHandler(cwd)
		: cache[cwd];

	const hashed = handler.hash(userOptions);

	if (hashed === handler.hashed) return;

	handler.apply(userOptions);
}

export function getOptions() {
	const cwd = cwdHandler.get();

	if (cwd in cache) {
		return cache[cwd].values;
	}

	/** @todo or throw */
	loggers.warn(`Expected ${colors.yellow('user options')} to be defined!`);
	const handler = cache[cwd] = new OptionsHandler(cwd);
	handler.apply(true);
	return handler.values;
}