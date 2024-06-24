import { sep } from 'node:path';

import { inject } from "vitest";
import { ESLint } from "eslint";

// const isWin32 = process.platform === 'win32';
// const root = inject('ROOT_PATH');
const slash = (input: string) => process.platform === 'win32' ? input.replaceAll(sep, '/') : input;
const removeRoot = (input: string) => slash(input.replace(inject('ROOT_PATH'), ''));

const defaultParams: LintParams = {
	config: 'eslint.base.js',
	files: ['**/*.ts']
};

export async function getLintResult(params = defaultParams): Promise<ESLint.LintResult[]> {
	console.log('Loading config %o at %o', params.config, removeRoot(process.cwd()));

	const eslint = new ESLint({
		fix: false,
		overrideConfigFile: params.config
	});

	console.log('Linting files %o', params.files);
	return await eslint.lintFiles(params.files);
}

export function logLintResult(input: ESLint.LintResult[]) {
	input.forEach(item => {
		const {
			errorCount,
			filePath,
			// messages
		} = item;

		console.log(
			`Eslint found %o error${errorCount !== 1 ? 's' : ''} in %o`,
			errorCount,
			removeRoot(filePath)
		);
		// console.log(messages, '\n');
	});
};

export function logLintResultMessages(input: ESLint.LintResult[]) {
	input.forEach(item => {
		console.log(...item.messages, '\n');
	});
}

export type LintParams = {
	config: string,
	files: string[];
};

export type LintResult = Awaited<ReturnType<typeof getLintResult>>;