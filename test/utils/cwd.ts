import { resolve } from "node:path";
import { inject } from "vitest";

const paths = {
	root: inject('ROOT_PATH'),
	e2e: inject('E2E_PATH'),
	unit: inject('UNIT_PATH'),
	fixtures: inject('FXT_PATH'),
} as const;

type Cwds = keyof typeof paths;

export function changeCwdTo(key: Cwds) {
	process.chdir(paths[key]);
}

export function changeCwd(key: string) {
	const path = resolve(paths.root, key);
	process.chdir(path);
}