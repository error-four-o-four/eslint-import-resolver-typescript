import type { UnknownRecord } from 'type-fest';

function getExpectedMsg(type: string) {
	return `Expected value to be ${type}`;
}

function getExpectedValueMsg(value: string, type: string) {
	return `Expected '${value} to be ${type}`;
}

export function assertNonNullable(
	value: unknown,
	expected: string = 'value',
): asserts value is NonNullable<typeof value> {
	if (value === null || value === undefined) {
		throw new Error(getExpectedValueMsg(expected, `not '${typeof value}'`));
	}
}

export function assertIsString(
	value: unknown,
	message: string = getExpectedMsg("a 'string'"),
): asserts value is string {
	if (typeof value !== 'string') {
		throw new Error(message);
	}
}

export function assertIsRecord(
	value: unknown,
	message: string = getExpectedMsg("a 'record'"),
): asserts value is UnknownRecord {
	assertNonNullable(value);

	if (typeof value !== 'object') {
		throw new Error(message);
	}

	Object.keys(value as UnknownRecord).forEach((key) =>
		assertIsString(key, `Expected key '${key}' in 'record' to be a 'string'`),
	);
}

export function isNonNullable<T>(value: T): value is NonNullable<T> {
	return value !== null && value !== undefined;
}

export function isString(value: unknown): value is string {
	return typeof value === 'string';
}

export function isUnknownRecord(value: unknown): value is UnknownRecord {
	return value !== null && typeof value === 'object' && !Array.isArray(value);
}
