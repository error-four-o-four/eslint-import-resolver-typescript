import { configDefaults, defineConfig } from 'vitest/config';

console.log('Initiating %o tests ...', 'e2e');

export default defineConfig({
	test: {
		root: './test/e2e',
		pool: 'forks',
		poolOptions: {
			forks: {}
		},
		globals: true,
		globalSetup: 'vitest.setup.ts',
		include: ['**/*.test.ts'],
		exclude: [...configDefaults.exclude],
		environment: 'node'
	}
});