export const interfaceVersion = 2;

export function resolve(
	modulePath: string,
	sourceFile: string,
	options?: {} | null,
): { found: boolean; path?: string | null; } {
	console.log('Resolving %o in %o ...', modulePath, sourceFile);
	console.log('With options %o', { options });

	return {
		found: false
	};
}