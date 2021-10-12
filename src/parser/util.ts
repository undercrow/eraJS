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
	return P.alt(...values.map(P.string));
}

export function asLine<T>(parser: P.Parser<T>): P.Parser<T> {
	return parser.skip(EOL);
}

export function optional<T>(parser: P.Parser<T>): P.Parser<T | undefined> {
	return parser.fallback(undefined);
}

export function nest<T>(parser: P.Parser<T>) {
	return (prev: P.Parser<string>) => prev.map((value) => parser.tryParse(value));
}

export function not(...exclude: string[]) {
	return P.alt(...exclude.map((e) => P.string(e)), P.any).chain((prev) => {
		if (exclude.includes(prev)) {
			return P.fail("not " + exclude.join(", "));
		} else {
			return P.succeed(prev);
		}
	});
}

export function sepBy0<T>(sep: string, parser: P.Parser<T>): P.Parser<T[]> {
	return P.sepBy(parser, P.string(sep).trim(WS0));
}

export function sepBy1<T, U>(
	sep: string,
	first: P.Parser<T>,
	rest: P.Parser<U>,
): P.Parser<[T, ...U[]]> {
	return P.seq(first, P.string(sep).trim(WS0).then(rest).many()).map(
		([f, r]) => [f, ...r],
	);
}

export function wrap<T>(left: string, right: string, parser: P.Parser<T>): P.Parser<T> {
	return parser.wrap(P.string(left).skip(WS0), WS0.then(P.string(right)));
}

const EOL = P.string("\n").atLeast(1).map(nullFn);
// eslint-disable-next-line no-irregular-whitespace
const WS = alt(" ", "\t", "　");
export const WS0 = WS.many().map(nullFn);
export const WS1 = WS.atLeast(1).map(nullFn);
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
	return not(...exclude).chain((prev) => {
		if (prev === "\\") {
			return not(...exclude).map((c) => {
				switch (c) {
					case "s": return " ";
					// eslint-disable-next-line no-irregular-whitespace
					case "S": return "　";
					case "t": return "\t";
					case "n": return "\n";
					default: return c;
				}
			});
		} else {
			return P.succeed(prev);
		}
	});
}

export function charSeq(...exclude: string[]): P.Parser<string> {
	return char(...exclude).atLeast(1).tie();
}

export function charSeq0(...exclude: string[]): P.Parser<string> {
	return char(...exclude).many().tie();
}

export function arg0R0(): P.Parser<null> {
	return P.succeed(null);
}

export function arg1R0<A0>(a0: P.Parser<A0>): P.Parser<A0 | undefined> {
	return P.alt(WS1.then(a0), WS0.map(() => undefined));
}

export function arg1R1<A0>(a0: P.Parser<A0>): P.Parser<A0> {
	return WS1.then(a0);
}

export function arg2R0<A0, A1>(
	a0: P.Parser<A0>,
	a1: P.Parser<A1>,
): P.Parser<[A0 | undefined, A1 | undefined]> {
	return P.alt<[A0 | undefined, A1 | undefined]>(
		WS1.then(P.seq(
			a0,
			P.string(",").trim(WS0).then(a1).fallback(undefined),
		)),
		WS0.map(() => [undefined, undefined]),
	);
}

export function arg2R1<A0, A1>(
	a0: P.Parser<A0>,
	a1: P.Parser<A1>,
): P.Parser<[A0, A1 | undefined]> {
	return WS1.then(P.seq(
		a0,
		P.string(",").trim(WS0).then(a1).fallback(undefined),
	));
}

export function arg2R2<A0, A1>(a0: P.Parser<A0>, a1: P.Parser<A1>): P.Parser<[A0, A1]> {
	return WS1.then(P.seq(a0, P.string(",").trim(WS0).then(a1)));
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

export function arg4R1<A0, A1, A2, A3>(
	a0: P.Parser<A0>,
	a1: P.Parser<A1>,
	a2: P.Parser<A2>,
	a3: P.Parser<A3>,
): P.Parser<[A0, A1 | undefined, A2 | undefined, A3 | undefined]> {
	return WS1.then(P.seqMap(
		a0,
		P.string(",").trim(WS0).then(a1).fallback(undefined),
		P.string(",").trim(WS0).then(a2).fallback(undefined),
		P.string(",").trim(WS0).then(a3).fallback(undefined),
		(...arg) => arg,
	));
}

export function arg4R2<A0, A1, A2, A3>(
	a0: P.Parser<A0>,
	a1: P.Parser<A1>,
	a2: P.Parser<A2>,
	a3: P.Parser<A3>,
): P.Parser<[A0, A1, A2 | undefined, A3 | undefined]> {
	return WS1.then(P.seqMap(
		a0,
		P.string(",").trim(WS0).then(a1),
		P.string(",").trim(WS0).then(a2).fallback(undefined),
		P.string(",").trim(WS0).then(a3).fallback(undefined),
		(...arg) => arg,
	));
}

export function arg4R3<A0, A1, A2, A3>(
	a0: P.Parser<A0>,
	a1: P.Parser<A1>,
	a2: P.Parser<A2>,
	a3: P.Parser<A3>,
): P.Parser<[A0, A1, A2, A3 | undefined]> {
	return WS1.then(P.seqMap(
		a0,
		P.string(",").trim(WS0).then(a1),
		P.string(",").trim(WS0).then(a2),
		P.string(",").trim(WS0).then(a3).fallback(undefined),
		(...arg) => arg,
	));
}

export function arg5R1<A0, A1, A2, A3, A4>(
	a0: P.Parser<A0>,
	a1: P.Parser<A1>,
	a2: P.Parser<A2>,
	a3: P.Parser<A3>,
	a4: P.Parser<A4>
): P.Parser<[A0, A1 | undefined, A2 | undefined, A3 | undefined, A4 | undefined]> {
	return WS1.then(P.seqMap(
		a0,
		P.string(",").trim(WS0).then(a1).fallback(undefined),
		P.string(",").trim(WS0).then(a2).fallback(undefined),
		P.string(",").trim(WS0).then(a3).fallback(undefined),
		P.string(",").trim(WS0).then(a4).fallback(undefined),
		(...arg) => arg,
	));
}

export function arg5R3<A0, A1, A2, A3, A4>(
	a0: P.Parser<A0>,
	a1: P.Parser<A1>,
	a2: P.Parser<A2>,
	a3: P.Parser<A3>,
	a4: P.Parser<A4>
): P.Parser<[A0, A1, A2, A3 | undefined, A4 | undefined]> {
	return WS1.then(P.seqMap(
		a0,
		P.string(",").trim(WS0).then(a1),
		P.string(",").trim(WS0).then(a2),
		P.string(",").trim(WS0).then(a3).fallback(undefined),
		P.string(",").trim(WS0).then(a4).fallback(undefined),
		(...arg) => arg,
	));
}

export function argNR0<AN>(an: P.Parser<AN>): P.Parser<AN[]> {
	return P.alt(WS1.then(sepBy0(",", an)), WS0.map(() => []))
		.skip(P.string(",").fallback(""));
}

export function argNR1<A0, AN>(a0: P.Parser<A0>, an: P.Parser<AN>): P.Parser<[A0, ...AN[]]> {
	return WS1.then(sepBy1(",", a0, an)).skip(P.string(",").fallback(""));
}
