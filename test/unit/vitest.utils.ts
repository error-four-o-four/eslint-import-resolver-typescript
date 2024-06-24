import { expect } from 'vitest';

import type { UnknownRecord } from 'type-fest';

import { defaults } from '@src/core/options/defaults.ts';

import type { DefaultOptions } from '@src/core/options/types.ts';


// #####

const expectedKeys = Object.keys(defaults) as (keyof DefaultOptions)[];

export function expectDefaultOptions(result: UnknownRecord) {
	expectedKeys.forEach(key => {
		const expectedValue = defaults[key];
		expect(result).toHaveProperty(key);
		expect(expectedValue).toStrictEqual(result[key]);
	});
}