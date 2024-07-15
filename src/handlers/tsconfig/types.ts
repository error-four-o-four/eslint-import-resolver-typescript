import { createPathsMatcher } from 'get-tsconfig';

import type {
	FileMatcher,
	TsConfigJson,
	TsConfigJsonResolved,
	TsConfigResult
} from 'get-tsconfig';

import type { SetRequired } from 'type-fest';

export type GetTsconfigResult = TsConfigResult;

export type TscResult = {
	parsed: TscParsed;
	// absolute path with file name
	path: TsConfigResult['path'];
	// absolute path without file name
	dir: string;
	// matched sourceFiles
	included: Set<string>;
	mapper: ReturnType<typeof createPathsMatcher>;
};

export type TscParsed = TsConfigJsonResolved & {
	compilerOptions: SetRequired<
		TsConfigJson.CompilerOptions,
		| 'target'
		| 'module'
		| 'moduleResolution'
		| 'allowImportingTsExtensions'
		| 'paths'
	>;
};

// export type TscPathMapper = ReturnType<typeof createPathsMatcher>;

export type TscFileMatcher = FileMatcher;