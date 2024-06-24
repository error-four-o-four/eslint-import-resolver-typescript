import { resolve } from 'node:path';

import { expect, it, suite, test } from 'vitest';

import type { UnknownRecord } from 'type-fest';

import logSpy from '@utils/log-spy.ts';
import { yellow } from '@utils/cli.ts';

import { expectDefaultOptions } from './vitest.utils';

import { parse } from '@src/utils/path.ts';
import { defaults } from '@src/core/options/defaults.ts';
import { validateTscProjects, validateUserOptions } from '@src/core/options/validators.ts';

import type { DefaultOptions } from '@src/core/options/types.ts';

logSpy.clearLoggerMocksAfterEach();

logSpy.enableLoggerBeforeAll();
logSpy.disableLoggerAfterAll();

// ######

interface ValidateOptionsData {
	invalidArgs: unknown[],
	invalidOpts: UnknownRecord[];
}

const testUserOptions = test.extend<ValidateOptionsData>({
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

suite.todo('function validateUserOptions()', () => {
	it('returns the default options', () => {
		testUserOptions(`when ${yellow('no params')} were passed`, () => {
			const result = validateUserOptions();

			const expectedKeys = Object.keys(defaults) as (keyof DefaultOptions)[];
			expectedKeys.forEach(key => {
				const expectedValue = defaults[key];
				expect(result).toHaveProperty(key);
				expect(expectedValue).toStrictEqual(result[key]);
			});
		});

		testUserOptions(`when ${yellow('invalid params')} were passed`, ({ invalidArgs }) => {
			expectDefaultOptions(validateUserOptions(invalidArgs[0]));
			expectDefaultOptions(validateUserOptions(invalidArgs[1]));
		});
	});

	it(('logs that the default options were returned'), () => {
		testUserOptions(`when ${yellow('no params')} were passed`, () => {
			validateUserOptions();
			expect(logSpy.spy).toHaveBeenCalledOnce();
			expect(logSpy.spy).toHaveBeenCalledWith('Validating resolver options ...');
		});

		testUserOptions(`when ${yellow('invalid params')} were passed`, ({ invalidArgs }) => {
			validateUserOptions(invalidArgs[0]);
			expect(logSpy.spy).toHaveBeenCalledTimes(2);
			expect(logSpy.spy).toHaveBeenCalledWith('Received invalid resolver options - fallback to default options');
			logSpy.spy.mockClear();

			validateUserOptions(invalidArgs[1]);
			expect(logSpy.spy).toHaveBeenCalledTimes(2);
			expect(logSpy.spy).toHaveBeenCalledWith('Received invalid resolver options - fallback to default options');
		});
	});

	testUserOptions(('adjusts banned properties (\'fileSystem\', \'useSyncFileSystemCalls\')'), ({ invalidOpts }) => {
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

	testUserOptions('logs that the options were adjusted', ({ invalidOpts }) => {
		validateUserOptions(invalidOpts[3]);
		// options has 3 invalid properties + initial log call
		expect(logSpy.spy).toHaveBeenCalledTimes(4);
		expect(logSpy.spy).toHaveBeenCalledWith('%o is an invalid option', 'foo');
	});
});

// ##### validateTscProjects()
interface ValidateTscProjectsData {
	invalid: unknown[];
	relativeDir: string[];
	absoluteDir: string[];
	relativeFile: string[];
	absoluteFile: string[];
	globbed: string[];
}

const testTscProjects = test.extend<ValidateTscProjectsData>({
	invalid: [
		true,
		null,
		{},
		[],
		'',
		'invalid.json',
		'tsconfig.invalid',
		'./invalid.txt',
	],
	relativeDir: [
		'dir',
		'dir/',
		'dir/to',
		'./dir/to/file',
		'../dir/to/file'
	],
	absoluteDir: [
		'C:\\dir',
		'C:\\dir\\to',
		'C:\\dir\\to\\file\\',
		'/dir',
		'/dir/to',
		'/dir/to/file/',
	],
	relativeFile: [
		'tsconfig.json',
		'dir/to/tsonfig.json',
		'./dir/to/another/tsconfig.base.json',
		'../dir/to/tsconfig.json'
	],
	absoluteFile: [
		'C:\\tsconfig.json',
		'C:\\dir\\to\\tsconfig.json',
		'/tsconfig.json',
		'/dir/to/tsconfig.json',
	],
	globbed: [
		'*',
		'**/*',
		'invalid*json',
		'**/tsconfig.json',
		'dir/*',
		'dir/to/**/tsconfig.json',
		'tsconfig.*.json',
		'dir/**/tsconfig*',
	]
});

suite('function validateTscProjects()', () => {
	it('returns a default value', () => {
		testTscProjects(`when ${yellow('invalid params')} were passed `, ({ invalid }) => {
			invalid.forEach((value) => {
				const options = { project: value };
				const expected = parse(resolve('tsconfig.json'));

				const result = validateTscProjects(options);
				expect(result).toBeDefined();
				expect(result).toBeInstanceOf(Array);
				expect(result.length).toEqual(1);
				expect(result[0]).toStrictEqual(expected);
			});
		});

		testTscProjects(`when ${yellow('options')} were set to ${yellow('true')}`, () => {
			const options = true;
			const expected = parse(resolve('tsconfig.json'));

			const result = validateTscProjects(options);
			expect(result).toBeDefined();
			expect(result).toBeInstanceOf(Array);
			expect(result.length).toEqual(1);
			expect(result[0]).toStrictEqual(expected);
		});

		testTscProjects(`when ${yellow('options.project')} was set to ${yellow('true')}`, () => {
			const options = true;
			const expected = parse(resolve('tsconfig.json'));

			const result = validateTscProjects(options);
			expect(result).toBeDefined();
			expect(result).toBeInstanceOf(Array);
			expect(result.length).toEqual(1);
			expect(result[0]).toStrictEqual(expected);
		});
	});

	it.todo('narrows the value', () => {
		testTscProjects(`when it's a ${yellow('directoy')}`, () => {

		});

		testTscProjects(`when the file is a ${yellow('glob pattern')}`, () => {

		});
	});

});