import type { SetRequired } from 'type-fest';

import type { ResolveOptions as EnhancedResolveOptions } from 'enhanced-resolve';

import type { FileExtension } from 'eslint-plugin-import-x/types.d.ts';

type CustomOptions = {
	alwaysTryTypes?: boolean;
	project?: string[] | string;
};

interface BaseOptions extends EnhancedResolveOptions, CustomOptions {
	extensions?: FileExtension[];
	extensionAlias?: Record<FileExtension, FileExtension[]>;
}

type InternalOptions = SetRequired<
	BaseOptions,
	'conditionNames'
	| 'extensions'
	| 'extensionAlias'
	| 'mainFields'
	| 'useSyncFileSystemCalls'
	| 'alwaysTryTypes'
	| 'project'
>;

type DefaultOptions = Omit<
	InternalOptions,
	'fileSystem'
>;

type ResolveOptions = Omit<
	BaseOptions,
	'fileSystem' | 'useSyncFileSystemCalls'
>;

export {
	FileExtension,
	EnhancedResolveOptions,
	InternalOptions,
	DefaultOptions,
	ResolveOptions
};

/**
 * @see https://github.com/webpack/enhanced-resolve/blob/main/README.md#resolver-options
 *
 * A list of exports field condition names.
 * conditionNames?: string[];*
 *
 * A list of extensions which should be tried for files
 * extensions?: string[];
 *
 * An object which maps extension to extension aliases
 * extensionAlias?: ExtensionAliasOptions
 *
 * The file system which should be used
 * fileSystem: FileSystem;
 *
 * A list of main fields in description files
 * mainFields?: (
 * 	| string
 * 	| string[]
 * 	| { name: string | string[]; forceRelative: boolean }
 * )[];
 */
