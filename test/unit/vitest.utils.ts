import { afterAll, beforeAll, expect, vi } from 'vitest';
import type { UnknownRecord } from 'type-fest';

import * as logger from 'utils/log.ts';
import { defaults } from 'core/options/resolve.ts';

import type { DefaultOptions } from 'types/options.ts';

export const yellow = (s: string) => `\u001b[33m${s}\u001b[0m`;

// #####

export const loggerSpy = vi.spyOn(logger, 'log').mockImplementation(() => { /* void */ });

export const enableLoggerBeforeAll = () => {
	beforeAll(() => {
		logger.enable();
	});
};

export const disableLoggerAfterAll = () => {
	afterAll(() => {
		logger.disable();
	});
};

// #####

const expectedKeys = Object.keys(defaults) as (keyof DefaultOptions)[];

export function expectDefaultOptions(result: UnknownRecord) {
	expectedKeys.forEach(key => {
		const expectedValue = defaults[key];
		expect(result).toHaveProperty(key);
		expect(expectedValue).toStrictEqual(result[key]);
	});
}