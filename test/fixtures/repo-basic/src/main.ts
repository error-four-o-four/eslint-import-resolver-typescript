[
	"./foo-tsx",
	"./foo-tsx.js",
	"./foo-tsx.jsx",
	"./foo-tsx.tsx",
	//
	"./foo-tsx.ts",
	"./foo-tsx.mjs",
	"./foo-tsx.cjs",
	"./foo-tsx.mts",
	"./foo-tsx.cts",
	null,
	"./bar-ts",
	"./bar-ts.js",
	"./bar-ts.jsx",
	"./bar-ts.ts",
	//
	"./bar-ts.tsx",
	"./bar-ts.mjs",
	"./bar-ts.cjs",
	"./bar-ts.mts",
	"./bar-ts.cts",
	null,
	"./nested-js/foo-jsx",
	"./nested-js/foo-jsx.js",
	"./nested-js/foo-jsx.jsx",
	//
	"./nested-js/foo-jsx.ts",
	"./nested-js/foo-jsx.tsx",
	"./nested-js/foo-jsx.mjs",
	"./nested-js/foo-jsx.cjs",
	"./nested-js/foo-jsx.mts",
	"./nested-js/foo-jsx.cts",
	null,
	"./nested-js/bar-js",
	"./nested-js/bar-js.js",
	"./nested-js/bar-js.jsx",
	//
	"./nested-js/bar-js.mjs",
	"./nested-js/bar-js.cjs",
	"./nested-js/bar-js.ts",
	"./nested-js/bar-js.tsx",
	"./nested-js/bar-js.mts",
	"./nested-js/bar-js.cts",
	null,
	"./nested-js/with-module/baz-mts.mjs",
	"./nested-js/with-module/baz-mts.mts",
	//
	"./nested-js/with-module/baz-mts",
	"./nested-js/with-module/baz-mts.js",
	"./nested-js/with-module/baz-mts.jsx",
	"./nested-js/with-module/baz-mts.cjs",
	"./nested-js/with-module/baz-mts.ts",
	"./nested-js/with-module/baz-mts.tsx",
	"./nested-js/with-module/baz-mts.cts",
	null,
	"./nested-js/with-module/baz-cts.cjs",
	"./nested-js/with-module/baz-cts.cts",
	//
	"./nested-js/with-module/baz-cts",
	"./nested-js/with-module/baz-cts.js",
	"./nested-js/with-module/baz-cts.jsx",
	"./nested-js/with-module/baz-cts.mjs",
	"./nested-js/with-module/baz-cts.ts",
	"./nested-js/with-module/baz-cts.tsx",
	"./nested-js/with-module/baz-cts.mts",
	null,
	"./nested-js/with-module/qux-mjs.mjs",
	//
	"./nested-js/with-module/qux-mjs",
	"./nested-js/with-module/qux-mjs.js",
	"./nested-js/with-module/qux-mjs.jsx",
	"./nested-js/with-module/qux-mjs.cjs",
	"./nested-js/with-module/qux-mjs.ts",
	"./nested-js/with-module/qux-mjs.tsx",
	"./nested-js/with-module/qux-mjs.mts",
	"./nested-js/with-module/qux-mjs.cts",
	null,
	"./nested-js/with-module/qux-cjs.cjs",
	//
	"./nested-js/with-module/qux-cjs",
	"./nested-js/with-module/qux-cjs.js",
	"./nested-js/with-module/qux-cjs.jsx",
	"./nested-js/with-module/qux-cjs.mjs",
	"./nested-js/with-module/qux-cjs.ts",
	"./nested-js/with-module/qux-cjs.tsx",
	"./nested-js/with-module/qux-cjs.mts",
	"./nested-js/with-module/qux-cjs.cts",
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
		const imported = await import(path).then(mod => mod.default ?? mod);
		result = typeof imported === 'function'
			? imported()
			: imported;

	} catch (err) {
		if (err instanceof Error) { }
	}

	console.log(`%o ${result}`, path);
}

export const morp = null;

export {
	// fooTs,
	// fooMjs,
	// fooMts,
	// FooJsx,
	// FooTsx,
	// bazJs,
	// quxMjs,
	// type barJs
};

// export default nested;