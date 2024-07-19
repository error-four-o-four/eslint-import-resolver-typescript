import { parse } from 'node:path';
import type { TsConfigJson } from 'type-fest';

import { EXT } from 'utils/path/constants.ts';
import { isDirectory } from 'utils/path/file.ts';
import { hasDeclaration, hasTypescriptExt, } from 'utils/path/main.ts';
import type { FileExtension } from 'utils/path/types.ts';

import { getTsconfigHandler } from 'handlers/index.ts';
import type { TscResult } from 'handlers/tsconfig/types.ts';

import { narrowExtension, resolveWithExtensions } from './utils.ts';
import type { ResolvedPathResult } from './types.ts';

/**
 * Resolves relative, existing files.
 * Depends on module resolution defined in 'tsconfig.json'
 */
export function resolveInternal(
	requestor: string,
	request: string
): ResolvedPathResult {
	const tsc = getTsconfigHandler().get(requestor);
	const [ext, exts] = matchExtensions(request, tsc);

	/** @todo use cache */

	/** @todo test and confirm conditions */
	// if (!ext && requiresExtension(compilerOptions)) {
	// 	return ['Module resolution requires file extension', , ,];
	// }

	// if (ext && hasTypescriptExt(ext) && !allowsTsExtension(compilerOptions)) {
	// 	return ['Compiler options \'allowImportingTsExtensions\' is required', , ,];
	// }

	if (ext) {
		request = request.replace(ext, ``);
	}

	if (!ext && isDirectory(request)) {
		request += '/index';
	}

	const resolved = resolveWithExtensions(request, exts);

	if (resolved) {
		return [null, resolved];
	}

	return [`Could not resolve any of [${exts.join(', ')}]`, null];
}

function matchExtensions(
	request: string,
	tsc: TscResult | null
): [null | FileExtension, FileExtension[]] {
	let { base, ext } = parse(request);

	const hasExt = narrowExtension(ext);

	if (tsc && !hasExt) {
		return [null, getUnknownExtensionsWithCompilerOptions(base, tsc.parsed.compilerOptions)];
	}

	if (hasExt) {
		return [ext, getKnownExtensions(ext)];
	}

	// if we don't know anything about module resolution
	// throw all possible extensions at the resolver and hope
	return [null, Object.values(EXT)];
}


// function requiresExtension({ moduleResolution }: TsConfigJson.CompilerOptions) {
// 	return moduleResolution === 'node16' || moduleResolution === 'nodenext';
// };

// function allowsTsExtension({ allowImportingTsExtensions }: TsConfigJson.CompilerOptions) {
// 	return Boolean(allowImportingTsExtensions);
// };

function getUnknownExtensionsWithCompilerOptions(
	base: string,
	compilerOptions: TsConfigJson.CompilerOptions
): FileExtension[] {
	const exts: FileExtension[] = [EXT.TS, EXT.MTS, EXT.CTS];

	if (compilerOptions.jsx) {
		exts.unshift(EXT.TSX);
		exts.push(EXT.DTSX);
	}

	if (!hasDeclaration(base)) {
		exts.push(EXT.DTS, EXT.DMTS, EXT.DCTS);
	}

	if (compilerOptions.allowJs && compilerOptions.jsx) {
		exts.push(EXT.JSX);
	}

	if (compilerOptions.allowJs) {
		exts.push(EXT.JS);
	}

	return exts;
}

function getKnownExtensions(
	ext: FileExtension,
	// compilerOptions: TsConfigJson.CompilerOptions | null
): FileExtension[] {
	// also applies to dts files
	if (hasTypescriptExt(ext)) {
		return [ext];
	}

	const ts = ext.replace('js', 'ts') as FileExtension;

	return [ts, `.d${ts}`, ext];
}