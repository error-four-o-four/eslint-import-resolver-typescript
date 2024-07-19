import { isString, isUnknownRecord } from 'utils/assert.ts';
import type { Cwd } from 'utils/path/types.ts';
import type {
	InternalOptions,
	ResolverOptions,
} from 'handlers/options/types.ts';

import { defaults } from './utils.ts';

export class OptionsHandler {
	public cwd: Cwd;
	public hash: typeof JSON.stringify;
	public hashed: string;
	public values: InternalOptions;

	constructor(cwd: Cwd) {
		this.cwd = cwd;
		/** @todo use another fn for better performance */
		this.hash = JSON.stringify;
		this.hashed = '';
		this.values = { ...defaults };
	}

	public apply(userOptions: unknown) {
		/** @todo loosely typed */
		/** @todo read custom conditions from tsconfig */
		const options: Record<string, any> = {};

		if (isUnknownRecord(userOptions)) {
			(['modules', 'extensions'] as (keyof ResolverOptions)[]).forEach(
				(key) => {
					if (!userOptions.hasOwnProperty(key)) return;

					const userValues = userOptions[key];

					if (!Array.isArray(userValues)) return;

					options[key] = [...this.values[key], ...userValues.filter(isString)];
				},
			);
		}

		this.values = Object.assign(this.values, options);
		this.hashed = this.hash(userOptions);
	}
}
