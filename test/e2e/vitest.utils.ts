import { platform } from 'node:os';
import { resolve, sep } from 'node:path';

import { inject } from "vitest";
import { ESLint } from "eslint";

const isWin32 = platform() === 'win32';

const slash = (filePath: string) => isWin32 ? filePath.replaceAll(sep, '/') : filePath;

const cwd = inject('FXT_PATH');
const root = inject('ROOT_PATH');

const defaultParams: LintParams = {
	// relative to test/fixtures/e2e
	config: 'eslint.config.js',
	files: ['**/*.ts']
};

const removeRoot = (input: string) => slash(input.replace(root, ''));

export async function getLintResult(params = defaultParams): Promise<ESLint.LintResult[]> {
	process.chdir(resolve(cwd));
	console.log('Loading config %o at %o', params.config, removeRoot(cwd));

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