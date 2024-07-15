import type { PackageJson } from 'type-fest';
import type { EntryPoint } from '../../handlers/options/types.ts';

type BasePkgResult = {
	parsed: PackageJson;
	// absolute path with file name
	path: string;
	// absolute path without file name
	dir: string;
};

export type InternalPkgResult = BasePkgResult & {
	// matched dirs
	dirs: Set<string>;
	deps: Set<string>;
};

export type ExternalPkgResult = BasePkgResult & {
	name: string;
	entryPoints: ParsedEntryPoints;
};

export type ParsedEntryPoints = Partial<{
	[K in Exclude<EntryPoint, 'typings'>]: K extends 'exports'
	? ParsedExports
	: string
}>;

export type ParsedExports = Record<
	`.`,
	PackageJson.Exports
> & Partial<Record<
	`./${string}`,
	PackageJson.Exports
>>;
