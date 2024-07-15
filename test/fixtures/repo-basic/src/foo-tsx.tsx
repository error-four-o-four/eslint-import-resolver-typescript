export const content = 'foo-tsx';

export default function FooTsx() {
	return `Component ${content}`;
}

type FooTsxType = typeof content;

export { type FooTsxType };
