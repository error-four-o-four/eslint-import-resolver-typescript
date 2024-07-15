import { dirname } from 'node:path';
import type { TsConfigJson } from 'type-fest';
import type { TsConfigResult } from 'get-tsconfig';

import { loggers } from '../../utils/log/loggers.ts';
import { tscFilename } from '../../utils/path/constants.ts';
import { findFirstUp } from '../../utils/path/file.ts';
import { getDirname } from '../../utils/path/main.ts';
import type { TscResult } from '../../handlers/tsconfig/types.ts';

export function getTscDir(fileOrDir: string) {
	const dir = getDirname(fileOrDir);
	const file = findFirstUp(tscFilename, dir);
	return file ? dirname(file) : null;
}

export function createTscWithCompilerOptions(
	config: TsConfigResult['config']
): TscResult['parsed'] {
	/** @todo refactor */
	const { compilerOptions } = config;

	/** https://www.typescriptlang.org/tsconfig/#target */
	const tscTarget = (
		compilerOptions?.target?.toLowerCase() ?? 'ES3'
	) as Lowercase<TsConfigJson.CompilerOptions.Target>;

	/** https://www.typescriptlang.org/tsconfig/#module */
	const tscModule = (
		compilerOptions?.module?.toLowerCase() ??
		((tscTarget === 'es3' || tscTarget === 'es5') ? 'commonjs' : 'es2015')
	) as Lowercase<TsConfigJson.CompilerOptions.Module>;

	/** https://www.typescriptlang.org/tsconfig/#moduleResolution */
	const tscResolution = (
		compilerOptions?.moduleResolution?.toLowerCase() ?? (
			isClassicModuleResolution(tscModule)
				? 'classic'
				: isNodeModuleResolution(tscModule)
					? tscModule.toLowerCase()
					: 'node'
		)
	) as Lowercase<TsConfigJson.CompilerOptions.ModuleResolution>;

	const allowImportingTsExtensions = (
		tscResolution === 'bundler' ||
		compilerOptions?.noEmit === true ||
		compilerOptions?.emitDeclarationOnly === true
	) ? compilerOptions?.allowImportingTsExtensions : false;

	const paths = compilerOptions?.paths && typeof compilerOptions.paths === 'object'
		? compilerOptions.paths : undefined;

	if (['classic', 'node', 'node10'].includes(tscResolution)) {
		/** @todo */
		loggers.warn('Don\'t!');
	}

	config.compilerOptions = {
		...compilerOptions,
		target: tscTarget,
		module: tscModule,
		moduleResolution: tscResolution,
		allowImportingTsExtensions,
		paths
	};

	return config as TscResult['parsed'];
}

function isClassicModuleResolution(
	tscModule: TsConfigJson.CompilerOptions.Module
) {
	const lowercase = (
		tscModule.toLowerCase() as Lowercase<TsConfigJson.CompilerOptions.Module>
	);

	return (
		lowercase === 'amd' ||
		lowercase === 'umd' ||
		lowercase === 'system' ||
		lowercase === 'es6' ||
		lowercase === 'es2015'
	);
}

function isNodeModuleResolution(
	tscModule: TsConfigJson.CompilerOptions.Module
) {
	const lowercase = (
		tscModule.toLowerCase() as Lowercase<TsConfigJson.CompilerOptions.Module>
	);

	return lowercase === 'node16' || lowercase === 'nodenext';
}