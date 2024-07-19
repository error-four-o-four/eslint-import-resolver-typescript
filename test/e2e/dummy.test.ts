import { beforeAll, expect, it } from 'vitest';

import { changeCwdTo } from '@utils/cwd.ts';

import {
	getLintResult,
	logLintResult,
	logLintResultMessages,
} from './vitest.utils.ts';

import type { LintParams, LintResult } from './vitest.utils.ts';

let result: LintResult;

beforeAll(async () => {
	changeCwdTo('fixtures');

	const params: LintParams = {
		config: './eslint.base.js',
		files: ['./repo-basic/**/*.ts'],
	};

	result = await getLintResult(params);
	logLintResult(result);
	logLintResultMessages(result);
});

it('Should work', async () => {
	expect(true).toBe(true);
});
