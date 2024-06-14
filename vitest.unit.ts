import { configDefaults, defineConfig } from 'vitest/config';

console.log('Initiating %o tests ...', 'unit');

export default defineConfig({
	test: {
		globals: true,
		include: ['./test/unit/**/*.test.ts'],
		exclude: [...configDefaults.exclude],
		environment: 'node'
	}
});