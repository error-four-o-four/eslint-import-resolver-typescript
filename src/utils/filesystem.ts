import nfs from 'node:fs';

import { CachedInputFileSystem } from 'enhanced-resolve';
import { DefaultOptions, InternalOptions } from '../types/options.ts';

let cachedFs: CachedInputFileSystem | null = null;

export function getFileSystem() {
	return (cachedFs ??= new CachedInputFileSystem(nfs, 5_000));
}

export function attachFileSytem(options: DefaultOptions): InternalOptions {
	return {
		...options,
		fileSystem: getFileSystem()
	};
}