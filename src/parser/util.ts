import P from "parsimmon";

import * as E from "../error";
import Slice from "../slice";
import * as C from "./const";

export function alt<T extends string>(...values: T[]): P.Parser<T> {
	return P.alt(...values.map(P.string));
}

export function optional<T>(parser: P.Parser<T>): P.Parser<T | undefined> {
	return parser.fallback(undefined);
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
	return P.sepBy(parser, P.string(sep).trim(C.WS0));
}

export function sepBy1<T, U>(
	sep: string,
	first: P.Parser<T>,
	rest: P.Parser<U>,
): P.Parser<[T, ...U[]]> {
	return P.seq(first, P.string(sep).trim(C.WS0).then(rest).many()).map(
		([f, r]) => [f, ...r],
	);
}

export function wrap<T>(left: string, right: string, parser: P.Parser<T>): P.Parser<T> {
	return parser.wrap(P.string(left).skip(C.WS0), C.WS0.then(P.string(right)));
}

export function arg0R0(): P.Parser<null> {
	return P.succeed(null);
}

export function arg1R0<A0>(a0: P.Parser<A0>): P.Parser<A0 | undefined> {
	return P.alt(C.WS1.then(a0), C.WS0.map(() => undefined));
}

export function arg1R1<A0>(a0: P.Parser<A0>): P.Parser<A0> {
	return C.WS1.then(a0);
}

export function arg2R0<A0, A1>(
	a0: P.Parser<A0>,
	a1: P.Parser<A1>,
): P.Parser<[A0 | undefined, A1 | undefined]> {
	return P.alt<[A0 | undefined, A1 | undefined]>(
		C.WS1.then(P.seq(
			a0,
			P.string(",").trim(C.WS0).then(a1).fallback(undefined),
		)),
		C.WS0.map(() => [undefined, undefined]),
	);
}

export function arg2R1<A0, A1>(
	a0: P.Parser<A0>,
	a1: P.Parser<A1>,
): P.Parser<[A0, A1 | undefined]> {
	return C.WS1.then(P.seq(
		a0,
		P.string(",").trim(C.WS0).then(a1).fallback(undefined),
	));
}

export function arg2R2<A0, A1>(a0: P.Parser<A0>, a1: P.Parser<A1>): P.Parser<[A0, A1]> {
	return C.WS1.then(P.seq(a0, P.string(",").trim(C.WS0).then(a1)));
}

export function arg3R3<A0, A1, A2>(
	a0: P.Parser<A0>,
	a1: P.Parser<A1>,
	a2: P.Parser<A2>,
): P.Parser<[A0, A1, A2]> {
	return C.WS1.then(P.seqMap(
		a0,
		P.string(",").trim(C.WS0).then(a1),
		P.string(",").trim(C.WS0).then(a2),
		(...arg) => arg,
	));
}

export function arg4R1<A0, A1, A2, A3>(
	a0: P.Parser<A0>,
	a1: P.Parser<A1>,
	a2: P.Parser<A2>,
	a3: P.Parser<A3>,
): P.Parser<[A0, A1 | undefined, A2 | undefined, A3 | undefined]> {
	return C.WS1.then(P.seqMap(
		a0,
		P.string(",").trim(C.WS0).then(a1).fallback(undefined),
		P.string(",").trim(C.WS0).then(a2).fallback(undefined),
		P.string(",").trim(C.WS0).then(a3).fallback(undefined),
		(...arg) => arg,
	));
}

export function arg4R2<A0, A1, A2, A3>(
	a0: P.Parser<A0>,
	a1: P.Parser<A1>,
	a2: P.Parser<A2>,
	a3: P.Parser<A3>,
): P.Parser<[A0, A1, A2 | undefined, A3 | undefined]> {
	return C.WS1.then(P.seqMap(
		a0,
		P.string(",").trim(C.WS0).then(a1),
		P.string(",").trim(C.WS0).then(a2).fallback(undefined),
		P.string(",").trim(C.WS0).then(a3).fallback(undefined),
		(...arg) => arg,
	));
}

export function arg4R3<A0, A1, A2, A3>(
	a0: P.Parser<A0>,
	a1: P.Parser<A1>,
	a2: P.Parser<A2>,
	a3: P.Parser<A3>,
): P.Parser<[A0, A1, A2, A3 | undefined]> {
	return C.WS1.then(P.seqMap(
		a0,
		P.string(",").trim(C.WS0).then(a1),
		P.string(",").trim(C.WS0).then(a2),
		P.string(",").trim(C.WS0).then(a3).fallback(undefined),
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
	return C.WS1.then(P.seqMap(
		a0,
		P.string(",").trim(C.WS0).then(a1).fallback(undefined),
		P.string(",").trim(C.WS0).then(a2).fallback(undefined),
		P.string(",").trim(C.WS0).then(a3).fallback(undefined),
		P.string(",").trim(C.WS0).then(a4).fallback(undefined),
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
	return C.WS1.then(P.seqMap(
		a0,
		P.string(",").trim(C.WS0).then(a1),
		P.string(",").trim(C.WS0).then(a2),
		P.string(",").trim(C.WS0).then(a3).fallback(undefined),
		P.string(",").trim(C.WS0).then(a4).fallback(undefined),
		(...arg) => arg,
	));
}

export function argNR0<AN>(an: P.Parser<AN>): P.Parser<AN[]> {
	return P.alt(C.WS1.then(sepBy0(",", an)), C.WS0.map(() => []))
		.skip(P.string(",").fallback(""));
}

export function argNR1<A0, AN>(a0: P.Parser<A0>, an: P.Parser<AN>): P.Parser<[A0, ...AN[]]> {
	return C.WS1.then(sepBy1(",", a0, an)).skip(P.string(",").fallback(""));
}

export function tryParse<T>(parser: P.Parser<T>, raw: Slice): T {
	const result = parser.parse(raw.get());
	if (result.status) {
		return result.value;
	} else {
		throw E.parser(`Expected one of (${result.expected.join(", ")})`);
	}
}
