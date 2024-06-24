import { defineConfig } from 'vitest/config';

import common from './vitest.common.ts';

console.log('Initiating %o tests ...', 'unit');

export default defineConfig({
	test: {
		...common.test,
		include: ['test/unit/**/*.test.ts'],
	},
	plugins: common.plugins
});