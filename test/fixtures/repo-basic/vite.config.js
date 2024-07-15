import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vite';

const dirname = fileURLToPath(new URL('./', import.meta.url));

export default defineConfig({
	build: {
		target: 'node16',
		lib: {
			entry: resolve(dirname, 'src/main.vite-react.ts'),
			name: 'morp',
		},
	},
});
