import { expect, it } from 'vitest';

import { loggers } from 'utils/log/loggers.ts';
import { enable } from 'utils/log/utils.ts';

enable('debug');

it('Should work', async () => {
	loggers.debug('Dummy test ...');
	expect(true).toBe(true);
});
