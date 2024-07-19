import { resolve } from 'node:path';
import { inject } from 'vitest';

export const dirs = {
	root: inject('ROOT_PATH'),
	e2e: inject('E2E_PATH'),
	unit: inject('UNIT_PATH'),
	fixtures: inject('FXT_PATH'),
} as const;

type Dirs = keyof typeof dirs;

export function changeCwdTo(key: Dirs) {
	process.chdir(dirs[key]);
}

export function changeCwd(key: string) {
	const path = resolve(dirs.root, key);
	process.chdir(path);
}
