import { afterAll, beforeAll, vi } from 'vitest';

import * as logger from '@src/utils/log.ts';

const spy = vi.spyOn(logger, 'log').mockImplementation(() => { /* void */ });

const enableLoggerBeforeAll = () => {
	beforeAll(() => {
		logger.enable();
	});
};

const disableLoggerAfterAll = () => {
	afterAll(() => {
		logger.disable();
	});
};

const clearLoggerMocksAfterEach = () => {
	spy.mockClear();
};

export default {
	spy,
	enable: logger.enable,
	disable: logger.disable,
	enableLoggerBeforeAll,
	disableLoggerAfterAll,
	clearLoggerMocksAfterEach
};