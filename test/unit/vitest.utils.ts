// #####

export async function interop(path: string) {
	import(path).then((mod) => mod.default ?? mod);
}
