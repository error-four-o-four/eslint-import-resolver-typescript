import { existsSync } from 'node:fs';

import { colors } from 'utils/log/colors.ts';
import { loggers } from 'utils/log/loggers.ts';
import type { FileExtension } from 'utils/path/types.ts';

export function narrowExtension(ext: string): ext is FileExtension {
	return Boolean(ext) && ext.startsWith('.');
}

export function resolveWithExtensions(request: string, exts: string[]) {
	let result: string;

	for (const ext of exts) {
		loggers.debug(`Checking existing path with ${colors.yellow(ext)}`);
		result = `${request}${ext}`;
		if (existsSync(result)) return result;
	}

	return null;
}
