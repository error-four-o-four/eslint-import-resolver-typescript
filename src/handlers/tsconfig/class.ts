import { join } from 'node:path';

import {
	createFilesMatcher,
	createPathsMatcher,
	parseTsconfig
} from 'get-tsconfig';

import { loggers } from '../../utils/log/loggers.ts';
import { colors } from '../../utils/log/colors.ts';
import { replaceCwd } from '../../utils/log/utils.ts';
import { tscFilename } from '../../utils/path/constants.ts';
import * as utils from './utils.ts';

import type { Cwd } from '../../utils/path/types.ts';
import type {
	GetTsconfigResult,
	TscFileMatcher,
	TscResult
} from './types.ts';

export class TsconfigHandler {
	// used internally by file matcher
	private _files: Map<GetTsconfigResult['path'], GetTsconfigResult['config']>;

	public cwd: Cwd;
	public files: Map<TscResult['path'], TscResult>;
	public matchers: Map<TscResult['path'], TscFileMatcher>;
	/** @todo consider */
	// public current: TscResult | null

	constructor(cwd: Cwd) {
		this._files = new Map();

		this.cwd = cwd;
		this.files = new Map();
		this.matchers = new Map();
	}

	private match(sourceFile: string): TscResult | null {
		for (const tsc of this.files.values()) {
			if (tsc.included.has(sourceFile)) {
				loggers.debug(`${colors.blueDark(TsconfigHandler.name)} matched a cached source file`);
				return tsc;
			}
		}

		for (const [path, matcher] of this.matchers.entries()) {
			const matched = matcher(sourceFile);

			if (matched && matched === this._files.get(path)) {
				const tsc = this.files.get(path);

				if (tsc) {
					loggers.debug(`${colors.blueDark(TsconfigHandler.name)} matched a source file`);
					tsc.included.add(sourceFile);
					return tsc;
				}
			}
		}

		return null;
	}

	public get(sourceFile: string) {
		loggers.debug(
			`${colors.blueDark(TsconfigHandler.name)} is searching for %o`,
			tscFilename
		);

		let tsc = this.match(sourceFile);

		if (tsc) return tsc;

		// const tscOriginal = getTsconfig(sourceFile);
		// use own fn because it utilises the logger
		const tscDir = utils.getTscDir(sourceFile);

		if (!tscDir) return null;

		loggers.debug('Found at %o', replaceCwd(tscDir));

		const tscPath = join(tscDir, tscFilename);
		const tscJson = parseTsconfig(tscPath);

		this._files.set(tscPath, tscJson);
		this.matchers.set(tscPath, createFilesMatcher({ path: tscPath, config: tscJson }));

		tsc = {
			parsed: utils.createTscWithCompilerOptions(tscJson),
			path: tscPath,
			dir: tscDir,
			included: new Set([sourceFile]),
			mapper: createPathsMatcher({ path: tscPath, config: tscJson })
		};

		// loggers.debug(
		// 	`${colors.blueDark(TsconfigHandler.name)} created an entry for %o`,
		// 	replaceCwd(tsc.path)
		// );

		this.files.set(tsc.path, tsc);

		return tsc;
	}
}