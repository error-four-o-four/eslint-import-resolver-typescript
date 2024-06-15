import { resolve } from 'node:path';

import type { GlobalSetupContext } from 'vitest/node';

const ROOT_PATH = process.cwd();
const CWD_PATH = resolve(ROOT_PATH, './test/e2e');
const FXT_PATH = resolve(ROOT_PATH, './test/fixtures/e2e');

process.chdir(CWD_PATH);

export default function (context: GlobalSetupContext) {
	context.provide('ROOT_PATH', ROOT_PATH);
	context.provide('CWD_PATH', CWD_PATH);
	context.provide('FXT_PATH', FXT_PATH);
}

declare module 'vitest' {
	export interface ProvidedContext {
		ROOT_PATH: string;
		CWD_PATH: string;
		FXT_PATH: string;
	}
}