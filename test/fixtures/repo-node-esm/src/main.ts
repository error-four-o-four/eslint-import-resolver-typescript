[
	'./foo-ts',
	'./foo-ts.js',
	'./foo-ts.jsx',
	'./foo-ts.ts',
	//
	'./foo-ts.tsx',
	'./foo-ts.mjs',
	'./foo-ts.cjs',
	'./foo-ts.mts',
	'./foo-ts.cts',
	null,
	'./nested/foo-js',
	'./nested/foo-js.js',
	'./nested/foo-js.jsx',
	//
	'./nested/foo-js.mjs',
	'./nested/foo-js.cjs',
	'./nested/foo-js.ts',
	'./nested/foo-js.tsx',
	'./nested/foo-js.mts',
	'./nested/foo-js.cts',
	null,
	'./bar-mts.mjs',
	'./bar-mts.mts',
	//
	'./bar-mts',
	'./bar-mts.js',
	'./bar-mts.jsx',
	'./bar-mts.cjs',
	'./bar-mts.ts',
	'./bar-mts.tsx',
	'./bar-mts.cts',
	null,
	'./baz-cts.cjs',
	'./baz-cts.cts',
	//
	'./baz-cts',
	'./baz-cts.js',
	'./baz-cts.jsx',
	'./baz-cts.mjs',
	'./baz-cts.ts',
	'./baz-cts.tsx',
	'./baz-cts.mts',
	null,
	'./nested/bar-mjs.mjs',
	//
	'./nested/bar-mjs',
	'./nested/bar-mjs.js',
	'./nested/bar-mjs.jsx',
	'./nested/bar-mjs.cjs',
	'./nested/bar-mjs.ts',
	'./nested/bar-mjs.tsx',
	'./nested/bar-mjs.mts',
	'./nested/bar-mjs.cts',
	null,
	'./nested/baz-cjs.cjs',
	//
	'./nested/baz-cjs',
	'./nested/baz-cjs.js',
	'./nested/baz-cjs.jsx',
	'./nested/baz-cjs.mjs',
	'./nested/baz-cjs.ts',
	'./nested/baz-cjs.tsx',
	'./nested/baz-cjs.mts',
	'./nested/baz-cjs.cts',
].reduce(reducer, Promise.resolve());

async function reducer(chain: Promise<void>, item: string | null) {
	await chain;
	return tryImport(item);
}

async function tryImport(path: string | null) {
	if (!path) {
		console.log(' ');
		return;
	}

	let result = '';
	try {
		const imported = await import(path).then((mod) => mod.default || mod);
		result = typeof imported === 'function' ? imported() : imported;
	} catch (err) {
		if (err instanceof Error) {
		}
	}

	console.log(`%o ${result}`, path);
}

export const morp = null;

export // fooTs,
// fooMjs,
// fooMts,
// FooJsx,
// FooTsx,
// bazJs,
// quxMjs,
// type barJs
 {};

// export default nested;
