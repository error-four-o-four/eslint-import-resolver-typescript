import { describe, it, expect } from 'vitest';

import { resolve } from '../../src/index.ts';

describe('resolve', () => {
	it('should resolve a module path', async () => {
		const result = resolve('some-module', 'src/index.ts');
		expect(result).toEqual({ found: true, path: 'resolved-path' });
	});
});
