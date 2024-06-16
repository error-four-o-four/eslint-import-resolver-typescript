import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { configDefaults, defineConfig } from 'vitest/config';

const path = dirname(fileURLToPath(new URL(import.meta.url)));

console.log('Initiating %o tests ...', 'unit');

export default defineConfig({
	test: {
		globals: true,
		// setupFiles: 'vitest.setup.ts',
		include: ['src/**/*.test.ts'],
		exclude: [...configDefaults.exclude],
		environment: 'node',
	},
	resolve: {
		alias: {
			"package.json": resolve(path, './package.json'),
			"src": resolve(path, 'src'),
			"core": resolve(path, 'src/core'),
			"utils": resolve(path, 'src/utils'),
			"unit": resolve(path, 'test/unit')
		}
	}
});