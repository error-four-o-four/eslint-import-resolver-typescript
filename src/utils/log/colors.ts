const escapeCode = '\u001B';
const colorEscapeCode = escapeCode + '[3';

const toColorCode = (c: number) => colorEscapeCode + (c < 8 ? c : '8;5;' + c) + ';1m';

const colorCodesMap = {
	// dark blue
	db: 8,
	// blue
	b: 33,
	// blue cyan
	bc: 39,
	// dark cyan
	dc: 45,
	// cyan
	c: 14,
	// dark yellow
	dy: 220,
} as const;

const mappedColorCodes = Object.fromEntries(
	Object.entries(
		colorCodesMap
	).map(([key, clr]) => [key, toColorCode(clr)])
) as Readonly<Record<keyof typeof colorCodesMap, string>>;

const cc = {
	...mappedColorCodes,
	r: colorEscapeCode + '1m',
	g: colorEscapeCode + '2m',
	// b: colorEscapeCode + '4m',
	// c: '\u001b[36m',
	y: colorEscapeCode + '3m',
	m: colorEscapeCode + '5m',
	off: escapeCode + '[0m',
};

const supported = process.env.COLORTERM === 'truecolor';

const clr = (c: string, s: string) => supported ? `${c}${s}${cc.off}` : s;

const colors = {
	red(s: string) {
		return clr(cc.r, s);
	},
	green(s: string) {
		return clr(cc.g, s);
	},
	blue(s: string) {
		return clr(cc.b, s);
	},
	blueDark(s: string) {
		return clr(cc.db, s);
	},
	blueCyan(s: string) {
		return clr(cc.bc, s);
	},
	cyan(s: string) {
		return clr(cc.c, s);
	},
	cyanDark(s: string) {
		return clr(cc.dc, s);
	},
	yellow(s: string) {
		return clr(cc.y, s);
	},
	yellowDark(s: string) {
		return clr(cc.dy, s);
	},
	magenta(s: string) {
		return clr(cc.m, s);
	},
} as const;

export {
	cc as colorCodes,
	colors
};