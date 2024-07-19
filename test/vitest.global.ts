import { resolve } from 'node:path';

import type { GlobalSetupContext } from 'vitest/node';

const ROOT_PATH = process.cwd();
const UNIT_PATH = resolve(ROOT_PATH, './test/unit');
const E2E_PATH = resolve(ROOT_PATH, './test/e2e');
const FXT_PATH = resolve(ROOT_PATH, './test/fixtures');

// console.log(process.cwd() === ROOT_PATH); // true

export default function (context: GlobalSetupContext) {
	context.provide('ROOT_PATH', ROOT_PATH);
	context.provide('UNIT_PATH', UNIT_PATH);
	context.provide('E2E_PATH', E2E_PATH);
	context.provide('FXT_PATH', FXT_PATH);
}

declare module 'vitest' {
	export interface ProvidedContext {
		ROOT_PATH: string;
		UNIT_PATH: string;
		E2E_PATH: string;
		FXT_PATH: string;
	}
}
