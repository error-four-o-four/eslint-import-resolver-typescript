import { beforeAll, expect, it } from 'vitest';

import {
	type LintResult,
	getLintResult,
	logLintResult,
	logLintResultMessages
} from './vitest.utils.ts';

let result: LintResult;

beforeAll(async () => {
	result = await getLintResult();
	logLintResult(result);
	logLintResultMessages(result);
});

it('Should work', async () => {
	expect(true).toBe(true);
});