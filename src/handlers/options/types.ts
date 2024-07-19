import type { PackageJson, SetRequired } from 'type-fest';
import type { FileExtension } from 'utils/path/types.ts';

export type ResolverOptions = {
	modules?: string[];
	extensions?: FileExtension[];
};

export type InternalOptions = SetRequired<
	ResolverOptions,
	'modules' | 'extensions'
> & {
	entryPoints: EntryPoint[];
	// https://www.typescriptlang.org/tsconfig/#customConditions
	conditions: (keyof PackageJson.ExportConditions)[];
};

export type EntryPoint = keyof Pick<
	PackageJson.PackageJsonStandard,
	| 'main'
	| 'exports'
	| 'bin'
> | keyof Pick<
	PackageJson.TypeScriptConfiguration,
	| 'types'
	| 'typings'
> | keyof Pick<
	PackageJson.NonStandardEntryPoints,
	| 'module'
	| 'browser'
	| 'esnext'
	| 'sideEffects'
>;
