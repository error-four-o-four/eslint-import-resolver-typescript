import { expect } from 'vitest';

import type { UnknownRecord } from 'type-fest';

import { defaults } from 'core/options/defaults.ts';

import type { ValidOptions } from 'core/options/types.ts';

export const yellow = (s: string) => `\u001b[33m${s}\u001b[0m`;

// #####

const expectedKeys = Object.keys(defaults) as (keyof ValidOptions)[];

export function expectDefaultOptions(result: UnknownRecord) {
	expectedKeys.forEach(key => {
		const expectedValue = defaults[key];
		expect(result).toHaveProperty(key);
		expect(expectedValue).toStrictEqual(result[key]);
	});
}