import { fileURLToPath } from 'node:url';

import { configDefaults, type UserConfig } from 'vitest/config';
import viteTsconfigPaths from 'vite-tsconfig-paths';

const common: UserConfig = {
	test: {
		// globals: true,
		globalSetup: fileURLToPath(new URL('./vitest.global.ts', import.meta.url)),
		// setupFiles: 'vitest.setup.ts',
		exclude: [...configDefaults.exclude],
		environment: 'node',
	},
	plugins: [
		viteTsconfigPaths({
			projects: [
				fileURLToPath(new URL('../tsconfig.json', import.meta.url)),
				fileURLToPath(new URL('./tsconfig.json', import.meta.url)),
			],
		}),
	],
};

export default common;
