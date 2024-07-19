import { existsSync } from 'node:fs';
import { dirname } from 'node:path';

import { loggers } from 'utils/log/loggers.ts';
import { clearOnce, logOnce, replaceCwd } from 'utils/log/utils.ts';
import { colors } from 'utils/log/colors.ts';
import { findAllUp } from 'utils/path/file.ts';
import { getRelation, resolve } from 'utils/path/main.ts';
import { pkgFilename } from 'utils/path/constants.ts';
import type { Cwd } from 'utils/path/types.ts';

import { getOptions } from 'handlers/options/index.ts';
import type {
	ExternalPkgResult,
	InternalPkgResult,
} from 'handlers/package/types.ts';

import * as utils from './utils.ts';

export class PackageHandler {
	constructor(cwd: Cwd) {
		this.cwd = cwd;
		this.external = {};
		this.internal = new Map();
		this.current = null;

		// create default pkg at cwd
		const rootPkgPath = resolve(cwd, pkgFilename);

		if (existsSync(rootPkgPath)) {
			this.internal.set(cwd, utils.createInternalPkgJsonResult(cwd));
		} else {
			throw new Error(
				`Could not find '${pkgFilename}' at root level '${this.cwd}'`,
			);
			/** @todo !!! get's stuck */
			// loggers.warn(`Could not find '${pkgFile}' at root level '${this.cwd}'`);
		}
	}

	public cwd: Cwd;
	public external: Record<ExternalPkgResult['path'], ExternalPkgResult>;
	public internal: Map<InternalPkgResult['dir'], InternalPkgResult>;
	public current: InternalPkgResult | null;

	/**
	 *
	 * @param sourceFile
	 * @returns
	 */
	private matchInternalPkg(sourceFile: string): InternalPkgResult | null {
		/** @todo describe strategy */

		for (const pkg of this.internal.values()) {
			const rel = getRelation(sourceFile, pkg.dir);

			// sourceFile is sibling
			if (!rel) {
				return pkg;
			}

			// sourceFile is closer to cwd as pkg
			if (rel.startsWith('..')) {
				continue;
			}

			// sourceFile is nested
			if (pkg.dirs.has(rel)) {
				return pkg;
			}
		}

		return null;
	}

	public getInternalPkg(sourceFile: string): InternalPkgResult {
		// search cached pkg files
		let pkg = this.matchInternalPkg(sourceFile);

		// set current pkg to access properties later
		if (pkg) return (this.current = pkg);

		// search for closest pkg dir
		loggers.debug(
			`${colors.blueDark(PackageHandler.name)} is searching for corresponding %o`,
			pkgFilename,
		);

		/** @todo consider using path = dir/package.json instead of dir */
		const pkgDir = utils.getPkgDir(sourceFile);

		// edge case
		if (!pkgDir) {
			throw new Error(`Can't find any '${pkgFilename}' in '${this.cwd}' !!!`);
		}

		loggers.debug('Found at %o', replaceCwd(pkgDir));

		// check cache again
		pkg = this.internal.get(pkgDir) || null;

		if (!pkg) {
			// pkg hasn't been cached yet
			pkg = utils.createInternalPkgJsonResult(pkgDir);
			this.internal.set(pkgDir, pkg);
		}

		// pkg has been cached but not been matched with the current source file
		// update internal pkg properties
		utils.createMatchedDirs(pkgDir, sourceFile).forEach((dir) => {
			if (!pkg.dirs.has(dir)) pkg.dirs.add(dir);
		});

		// set current pkg to access properties later
		return (this.current = pkg);
	}

	/**
	 * Searches and sets/unsets the current internal pkg
	 * which corresponds to the requested module path
	 */
	public searchExternalNameRecursive(
		requestingFileOrDir: string,
		request: string,
	): void {
		/** @todo search in root first ??? */
		const pkg = this.getInternalPkg(requestingFileOrDir);

		logOnce(loggers.info, 'isDep', 'Searching for dependencies ...');
		loggers.info('in %o ... ', replaceCwd(pkg.path));

		if (pkg.deps.has(request)) {
			loggers.info(`Found a corresponding dependency`);
			clearOnce('isDep');
			return;
		}

		if (pkg.dir === this.cwd) {
			loggers.info(
				`Could ${colors.yellow('not')} find any corresponding dependency`,
			);
			clearOnce('isDep');
			this.current = null;
			return;
		}

		this.searchExternalNameRecursive(dirname(pkg.dir), request);
	}

	/**
	 * Searches for `<modules>/@types/<dependency>/package.json`
	 * and (!) `<modules>/<dependency>/package.json`
	 */
	public matchExternalPath(request: string): string[] | null {
		if (!this.current) {
			/** @todo */
			// this should never be the case
			// throw new Error('Nope!');
			return null;
		}

		const { modules } = getOptions();
		const dirs = findAllUp(modules, this.current.dir);

		if (!dirs) {
			loggers.warn(`Could ${colors.yellow('not')} find any of: %o`, modules);
			return null;
		}

		loggers.info(
			`Found ${colors.yellow(`${dirs.length}`)} dependency folder${dirs.length === 1 ? '' : 's'}`,
		);

		const paths = utils.getExternalPaths(request, dirs);

		if (paths.length === 0) return null;

		/** @todo check equal names !! */
		// this.external.has ...
		// if (paths.length > 1) {
		// 	loggers.warn(
		// 		'Found multiple matching dependencies in %o',
		// 		paths.map(replaceCwd)
		// 	);
		// }

		paths.forEach((item) => {
			this.external[item] = utils.createExternalPkgJsonResult(request, item);
		});

		return paths;
	}
}
