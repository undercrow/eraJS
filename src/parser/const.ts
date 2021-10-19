import P from "parsimmon";

/* eslint-disable array-element-newline */
const SPECIAL_CHAR = [
	"+", "-", "*", "/", "%", "=", "!", "<", ">", "|", "&", "^", "~", "?", "#", "(", ")", "{", "}",
	"[", "]", ".", ",", ":", "$", "\\", "'", '"', "@", ";",
	// eslint-disable-next-line no-irregular-whitespace
	" ", "\t", "　",
	"\r", "\n",
];
/* eslint-enable array-element-newline */

// eslint-disable-next-line no-irregular-whitespace
const WS = P.oneOf([" ", "\t", "　"].join(""));
export const WS0 = WS.many().map(() => null);
export const WS1 = WS.atLeast(1).map(() => null);
export const Identifier = P.noneOf(SPECIAL_CHAR.join("")).atLeast(1).tie();
export const UInt = P.alt(
	P.seqMap(
		P.regex(/[0-9]+p/i),
		P.regex(/[0-9]+/),
		(base, exponent) => parseInt(base) ** parseInt(exponent),
	),
	P.regex(/0b/i).then(P.regex(/[0-1]+/)).map((val) => parseInt(val, 2)),
	P.regex(/0x/i).then(P.regex(/[0-9a-fA-F]+/)).map((val) => parseInt(val, 16)),
	P.regex(/[0-9]+/).map((val) => parseInt(val, 10)),
);
export const Int = P.alt(
	P.string("+").then(UInt),
	P.string("-").then(UInt).map((val) => -val),
	UInt,
);
const UFloat = P.regex(/[0-9]+\.[0-9]+/).map((val) => parseFloat(val));
export const Float = P.alt(
	P.string("+").then(UFloat),
	P.string("-").then(UFloat).map((val) => -val),
	UFloat,
	Int,
);
export const Str = char("\"").many().tie().trim(P.string("\""));

export function char(...exclude: string[]): P.Parser<string> {
	return P.notFollowedBy(P.alt(...exclude.map((c) => P.string(c)))).then(P.alt(
		P.string("\\").then(P.alt(
			P.string("s").map(() => " "),
			// eslint-disable-next-line no-irregular-whitespace
			P.string("S").map(() => "　"),
			P.string("t").map(() => "\t"),
			P.string("n").map(() => "\n"),
			P.any
		)),
		P.any,
	));
}

export function charSeq(...exclude: string[]): P.Parser<string> {
	return char(...exclude).atLeast(1).tie();
}

export function charSeq0(...exclude: string[]): P.Parser<string> {
	return char(...exclude).many().tie();
}
