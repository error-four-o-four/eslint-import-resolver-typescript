
import { defineConfig } from 'vitest/config';

import common from './vitest.common.ts';

console.log('Initiating %o tests ...', 'e2e');

export default defineConfig({
	test: {
		...common.test,
		pool: 'forks',
		poolOptions: {
			forks: {}
		},
		include: ['test/e2e/**/*.test.ts'],
	},
	plugins: common.plugins
});