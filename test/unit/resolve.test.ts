import { beforeAll, afterAll, describe, it, expect } from 'vitest';

import { enable, disable } from '../../src/utils/log.ts';
import { resolve } from '../../src/index.ts';


beforeAll(() => {
	enable();
});

afterAll(() => {
	disable();
});

describe.todo('resolve', () => {

	it('should resolve a module path', async () => {
		const result = resolve('some-module', 'src/index.ts');
		expect(result).toEqual({ found: true, path: 'resolved-path' });



	});
});
