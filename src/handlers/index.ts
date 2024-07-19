import { loggers } from 'utils/log/loggers.ts';
import { colors } from 'utils/log/colors.ts';
import type { Cwd } from 'utils/path/types.ts';

import { cwdHandler } from './cwd.ts';
import { TsconfigHandler } from './tsconfig/class.ts';
import { PackageHandler } from './package/class.ts';

export const handler = {
	/** @todo limit cache size; use class Cache */
	tsc: {} as Record<Cwd, TsconfigHandler>,
	pkg: {} as Record<Cwd, PackageHandler>,
};

function getHandler<T>(
	key: keyof typeof handler
) {
	const cwd = cwdHandler.get();

	if (!handler[key].hasOwnProperty(cwd)) {
		const Handler = key === 'pkg'
			? PackageHandler
			: TsconfigHandler;

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