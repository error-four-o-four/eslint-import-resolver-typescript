import { existsSync } from 'node:fs';

import { np, normAbsolute } from './path.ts';

const getResolvedOrFallback = (input: string | undefined, fallback: string) => input && np.resolve(input) || fallback;

export function findFilesBesidesAndUpSync(
	input: string | string[],
	options: {
		start?: string;
		stop?: string;
		max?: number;
	} = {}
): null | string | [string, string][] {
	const start = getResolvedOrFallback(options.start, process.cwd());
	const parsed = np.parse(start);

	let dir = parsed.ext === '' ? np.join(parsed.dir, parsed.base) : parsed.dir;
	let depth = 0;

	const stop = getResolvedOrFallback(options.stop, parsed.root);

	if (stop.length > dir.length) throw new Error(`'up' ... it's called 'UP' ... not 'down`);

	// console.log('\nsearching for %o', file);
	// console.log('start input was %o', options.start);
	// console.log('start directory is %o', dir);
	// console.log('stop input was %o', options.stop);
	// console.log('stop is %o\n', stop);

	const files = Array.isArray(input) ? input : [input];
	const search = new Set(files);
	const found = new Map<string, string>();

	while (dir && depth < (options.max || 30)) {

		search.forEach(file => {
			const filePath = np.join(dir, file);

			if (existsSync(filePath)) {
				found.set(file, normAbsolute(filePath));
				search.delete(file);
				// console.log('%o\n', true);
			}
		});

		if (search.size === 0) break;

		// console.log('%o - searching in %o', depth, dir);

		if (dir === stop) break;

		dir = np.dirname(dir);
		depth += 1;
	}

	if (found.size === 0) {
		return null;
	}

	if (found.size === 1 && files.length === 1) {
		return found.values().next().value;
	}

	return [...found.entries()];
}