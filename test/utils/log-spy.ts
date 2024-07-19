import { afterAll, beforeAll, vi } from 'vitest';

import { loggers } from 'utils/log/loggers.ts';
import { enable, disable } from 'utils/log/utils.ts';

const spy = vi.spyOn(loggers, 'main');
// .mockImplementation(() => { /* void */ });

const enableLoggerBeforeAll = () => {
	beforeAll(() => {
		enable();
	});
};

const disableLoggerAfterAll = () => {
	afterAll(() => {
		disable();
	});
};

const clearLoggerMocksAfterEach = () => {
	spy.mockClear();
};

export default {
	spy,
	enable,
	disable,
	enableLoggerBeforeAll,
	disableLoggerAfterAll,
	clearLoggerMocksAfterEach
};