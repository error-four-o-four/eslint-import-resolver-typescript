export {
	ResolvedResult,
	ResultFound,
	ResultNotFound,
	Resolver
} from 'eslint-plugin-import-x/utils/resolve.d.ts';

export type ResolvedPathResult = [string, string | null] | [null, string];