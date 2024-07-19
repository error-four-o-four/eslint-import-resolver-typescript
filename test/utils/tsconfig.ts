// import { resolve } from 'node:path';
// import type { CamelCase } from 'type-fest';

// import { dirs } from "./cwd.ts";
// import { getTscResult } from "@src/core/handlers/tsc-result.ts";
// import { type TsConfigResultRequired } from "@src/core/handlers/tsc-result.ts";

// const names = [
// 	'create-react-app',
// 	'node10',
// 	'node16',
// 	'node-lts',
// 	'vite-react'
// ] as const;

// type TsFile = (typeof names)[number];
// type TsFileKey = CamelCase<TsFile>;

// const entries = names.map(name => [
// 	toCamelCase(name),
// 	getTscResult(resolve(dirs.fixtures, `tsconfig/${name}/tsconfig.json`))
// ] as [TsFileKey, TsConfigResultRequired]);

// export const tsc = Object.fromEntries(entries) as Record<TsFileKey, TsConfigResultRequired>;

// // #####

// export function toUpperCase(input: string): string {
// 	return input.slice(0, 1).toUpperCase() + input.slice(1).toLowerCase();
// }

// export function toCamelCase(input: string): string {
// 	const r = /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g;
// 	const m = input.match(r);

// 	if (!m) return input;

// 	const s = Array.isArray(m)
// 		? m
// 			.map(toUpperCase)
// 			.join('')
// 		: input;

// 	return s.slice(0, 1).toLowerCase() + s.slice(1);
// }

// export function toKebabCase(input: string): string {
// 	const r = /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g;
// 	const m = input.match(r);

// 	if (!m) return input;

// 	return m
// 		.join('-')
// 		.toLowerCase();
// }
