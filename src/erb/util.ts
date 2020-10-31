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

function nullFn(): null {
	return null;
}

export function alt<T extends string>(...values: T[]): P.Parser<T> {
	return P.alt(...values.map(P.string)) as P.Parser<T>;
}

export function asLine<T>(parser: P.Parser<T>): P.Parser<T> {
	const comment = P.seq(WS0, P.string(";"), char().many());
	const emptyLine = P.alt(comment, WS0).skip(P.newline);

	const lineParser = parser.trim(WS0).skip(comment.fallback(null)).skip(P.newline);
	return lineParser.trim(emptyLine.many());
}

export function sepBy<T>(sep: string, first: P.Parser<T>): P.Parser<T[]>;
export function sepBy<T, U>(
	sep: string,
	first: P.Parser<T>,
	rest: P.Parser<U>,
): P.Parser<[T, ...U[]]>;
export function sepBy<T, U>(
	sep: string,
	first: P.Parser<T>,
	rest?: P.Parser<U>,
): P.Parser<Array<T | U>> {
	return P.seqMap(
		first,
		P.string(sep).trim(WS0).then<T | U>(rest ?? first).many(),
		(f, r) => [f, ...r],
	);
}

export function wrap<T>(left: string, parser: P.Parser<T>, right: string): P.Parser<T> {
	return parser.wrap(P.string(left).skip(WS0), WS0.then(P.string(right)));
}

// eslint-disable-next-line no-irregular-whitespace
const WS = alt(" ", "\t", "　");
export const WS0 = WS.many().map(nullFn);
export const WS1 = WS.atLeast(1).map(nullFn);
export const Identifier = P.noneOf(SPECIAL_CHAR.join("")).atLeast(1).tie();
const UInt = P.alt(
	P.string("0b").then(P.regex(/0x[0-1]+/)).map((val) => parseInt(val, 2)),
	P.string("0x").then(P.regex(/0x[0-9a-fA-F]+/)).map((val) => parseInt(val, 16)),
	P.regex(/[0-9]+/).map((val) => parseInt(val, 10)),
);
export const Int = P.alt(UInt, P.string("-").then(UInt).map((val) => -val));
export const Str = char("\"").many().tie().trim(P.string("\""));

export function char(...exclude: string[]): P.Parser<string> {
	return P.alt(
		P.noneOf(exclude.join("") + "\r\n\\"),
		P.string("\\").then(P.noneOf(exclude.join("") + "\r\n")).map((c) => {
			switch (c) {
				case "s": return " ";
				// eslint-disable-next-line no-irregular-whitespace
				case "S": return "　";
				case "t": return "\t";
				case "n": return "\n";
				default: return c;
			}
		}),
	);
}

export function charSeq(...exclude: string[]): P.Parser<string> {
	return char(...exclude).atLeast(1).tie();
}

export function arg1R0<A0>(a0: P.Parser<A0>): P.Parser<A0 | undefined> {
	return P.alt(WS1.then(a0), WS0.map(() => undefined));
}

export function arg1R1<A0>(a0: P.Parser<A0>): P.Parser<A0> {
	return WS1.then(a0);
}

export function arg2R2<A0, A1>(a0: P.Parser<A0>, a1: P.Parser<A1>): P.Parser<[A0, A1]> {
	return WS1.then(P.seqMap(a0, P.string(",").trim(WS0).then(a1), (...arg) => arg));
}

export function arg3R3<A0, A1, A2>(
	a0: P.Parser<A0>,
	a1: P.Parser<A1>,
	a2: P.Parser<A2>,
): P.Parser<[A0, A1, A2]> {
	return WS1.then(P.seqMap(
		a0,
		P.string(",").trim(WS0).then(a1),
		P.string(",").trim(WS0).then(a2),
		(...arg) => arg,
	));
}

export function argNR0<AN>(an: P.Parser<AN>): P.Parser<AN[]> {
	return P.alt(WS1.then(sepBy(",", an)), WS0.map(() => []));
}

export function argNR1<A0, AN>(a0: P.Parser<A0>, an: P.Parser<AN>): P.Parser<[A0, ...AN[]]> {
	return WS1.then(sepBy(",", a0, an));
}
