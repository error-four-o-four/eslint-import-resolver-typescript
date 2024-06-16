import {
	beforeAll,
	afterEach,
	afterAll,
	expect,
	describe,
	vi,
	test as base
} from 'vitest';

import type { UnknownRecord } from 'type-fest';

import * as logger from 'utils/log.ts';

import { validateUserOptions } from 'core/options/validator.ts';
import { defaults } from 'core/options/resolve.ts';

import type { DefaultOptions } from 'types/options.ts';

import { expectDefaultOptions, yellow } from './vitest.utils.ts';

const loggerSpy = vi.spyOn(logger, 'log').mockImplementation(() => { /* void */ });

interface ValidateOptionsFixture {
	invalidArgs: unknown[],
	invalidOpts: UnknownRecord[];
}

const test = base.extend<ValidateOptionsFixture>({
	invalidArgs: [
		0,
		'invalid',
		['invalid', undefined]
	],
	invalidOpts: async ({ }, use) => {
		const data = [
			{ fileSystem: true },
			{ useSyncFileSystemCalls: false },
			{
				fileSystem: 'invalid',
				useSyncFileSystemCalls: 'invalid',
			},
			{
				foo: 'bar',
				fileSystem: 'invalid',
				useSyncFileSystemCalls: 'invalid',
			}
		];

		const copy = data.map(item => ({ ...item }));

		use(copy);
	}
});

beforeAll(() => {
	logger.enable();
});

afterEach(() => {
	loggerSpy.mockClear();
});

afterAll(() => {
	logger.disable();
});

describe('core: validateUserOptions', () => {
	describe('returns the default options', () => {
		test(`when ${yellow('no params')} were passed`, () => {
			const result = validateUserOptions();

			const expectedKeys = Object.keys(defaults) as (keyof DefaultOptions)[];
			expectedKeys.forEach(key => {
				const expectedValue = defaults[key];
				expect(result).toHaveProperty(key);
				expect(expectedValue).toStrictEqual(result[key]);
			});
		});

		test(`when ${yellow('invalid params')} were passed`, ({ invalidArgs }) => {
			expectDefaultOptions(validateUserOptions(invalidArgs[0]));
			expectDefaultOptions(validateUserOptions(invalidArgs[1]));
		});
	});

	describe(('logs that the default options were returned'), () => {
		test(`when ${yellow('no params')} were passed`, () => {
			validateUserOptions();
			expect(logger.log).toHaveBeenCalledOnce();
			expect(logger.log).toHaveBeenCalledWith('Validating resolver options ...');
		});

		test(`when ${yellow('invalid params')} were passed`, ({ invalidArgs }) => {
			validateUserOptions(invalidArgs[0]);
			expect(logger.log).toHaveBeenCalledTimes(2);
			expect(logger.log).toHaveBeenCalledWith('Received invalid resolver options - fallback to default options');
			loggerSpy.mockClear();

			validateUserOptions(invalidArgs[1]);
			expect(logger.log).toHaveBeenCalledTimes(2);
			expect(logger.log).toHaveBeenCalledWith('Received invalid resolver options - fallback to default options');
		});
	});

	test(('adjusts banned properties (\'fileSystem\', \'useSyncFileSystemCalls\')'), ({ invalidOpts }) => {
		let result: DefaultOptions;

		result = validateUserOptions(invalidOpts[0]);
		expect(result).toStrictEqual(defaults);
		expect(result).not.toHaveProperty('fileSystem');

		result = validateUserOptions(invalidOpts[1]);
		expect(result).toStrictEqual(defaults);
		expect(result.useSyncFileSystemCalls).toBe(true);

		result = validateUserOptions(invalidOpts[2]);
		expect(result).toStrictEqual(defaults);

		result = validateUserOptions(invalidOpts[3]);
		expect(result).toStrictEqual(defaults);
	});

	test('logs that the options were adjusted', ({ invalidOpts }) => {
		const result = validateUserOptions(invalidOpts[3]);
		// options has 3 invalid properties + initial log call
		expect(logger.log).toHaveBeenCalledTimes(4);
		expect(logger.log).toHaveBeenCalledWith('%o is an invalid option', 'foo');
	});
});
