import { loggers } from '../utils/log/loggers.ts';
import { colors } from '../utils/log/colors.ts';

import { cwdHandler } from './cwd.ts';
import { TsconfigHandler } from './tsconfig/class.ts';
import { PackageHandler } from './package/class.ts';
import { OptionsHandler } from './options/class.ts';
import type { Cwd } from '../utils/path/types.ts';

export const handler = {
	cwd: cwdHandler,
	/** @todo limit cache size; use class Cache */
	tsc: {} as Record<Cwd, TsconfigHandler>,
	pkg: {} as Record<Cwd, PackageHandler>,
	opts: {} as Record<Cwd, OptionsHandler>
};

function getHandler<T>(
	key: keyof Pick<typeof handler, 'pkg' | 'tsc' | 'opts'>
) {
	const cwd = handler.cwd.get();

	if (!handler[key].hasOwnProperty(cwd)) {
		const Handler = key === 'pkg'
			? PackageHandler
			: key === 'tsc'
				? TsconfigHandler
				: OptionsHandler;

		loggers.debug(
			`Instantiated ${colors.blueDark(Handler.name)}`
		);

		handler[key][cwd] = new Handler(cwd);
	}

	return handler[key][cwd] as T;
}

export function getTsconfigHandler() {
	return getHandler<TsconfigHandler>('tsc');
}

export function getPackageHandler() {
	return getHandler<PackageHandler>('pkg');
}

export function getOptionsHandler() {
	return getHandler<OptionsHandler>('opts');
}

/**
 * Validates, hashes and caches user options.
 */
export function applyUserOptions(userOptions: unknown) {
	const handler = getOptionsHandler();

	const hashed = handler.hash(userOptions);

	if (hashed === handler.hashed) return;

	handler.apply(userOptions);
}