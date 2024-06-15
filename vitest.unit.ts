import { configDefaults, defineConfig } from 'vitest/config';

console.log('Initiating %o tests ...', 'unit');

export default defineConfig({
	test: {
		root: './test/unit',
		globals: true,
		// setupFiles: 'vitest.setup.ts',
		include: ['**/*.test.ts'],
		exclude: [...configDefaults.exclude],
		environment: 'node',
		alias: {

		}
	}
});