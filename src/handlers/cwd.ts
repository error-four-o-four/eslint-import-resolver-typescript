import { getSlashedCwd } from 'utils/path/main.ts';

export const cwdHandler: {
	cached: null | string;
	get(): string;
} = {
	cached: null,
	get() {
		const cwd = getSlashedCwd();

		if (this.cached === cwd) return cwd;

		return this.cached = cwd;
	}
};
