import { getSlashedCwd } from './main.ts';

export type Cwd = ReturnType<typeof getSlashedCwd>;

/** @todo type SlashedPath ?? */

export type { FileExtension } from 'eslint-plugin-import-x/types.d.ts';