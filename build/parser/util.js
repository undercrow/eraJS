import P from "parsimmon";
import * as E from "../error";
import * as C from "./const";
export function alt(...values) {
    return P.alt(...values.map(P.string));
}
export function optional(parser) {
    return parser.fallback(undefined);
}
export function not(...exclude) {
    return P.alt(...exclude.map((e) => P.string(e)), P.any).chain((prev) => {
        if (exclude.includes(prev)) {
            return P.fail("not " + exclude.join(", "));
        }
        else {
            return P.succeed(prev);
        }
    });
}
export function sepBy0(sep, parser) {
    return P.sepBy(parser, P.string(sep).trim(C.WS0));
}
export function sepBy1(sep, first, rest) {
    return P.seq(first, P.string(sep).trim(C.WS0).then(rest).many()).map(([f, r]) => [f, ...r]);
}
export function wrap(left, right, parser) {
    return parser.wrap(P.string(left).skip(C.WS0), C.WS0.then(P.string(right)));
}
export function arg0R0() {
    return P.succeed(null);
}
export function arg1R0(a0) {
    return P.alt(C.WS1.then(a0), C.WS0.map(() => undefined));
}
export function arg1R1(a0) {
    return C.WS1.then(a0);
}
export function arg2R0(a0, a1) {
    return P.alt(C.WS1.then(P.seq(a0, P.string(",").trim(C.WS0).then(a1).fallback(undefined))), C.WS0.map(() => [undefined, undefined]));
}
export function arg2R1(a0, a1) {
    return C.WS1.then(P.seq(a0, P.string(",").trim(C.WS0).then(a1).fallback(undefined)));
}
export function arg2R2(a0, a1) {
    return C.WS1.then(P.seq(a0, P.string(",").trim(C.WS0).then(a1)));
}
export function arg3R3(a0, a1, a2) {
    return C.WS1.then(P.seqMap(a0, P.string(",").trim(C.WS0).then(a1), P.string(",").trim(C.WS0).then(a2), (...arg) => arg));
}
export function arg4R1(a0, a1, a2, a3) {
    return C.WS1.then(P.seqMap(a0, P.string(",").trim(C.WS0).then(a1).fallback(undefined), P.string(",").trim(C.WS0).then(a2).fallback(undefined), P.string(",").trim(C.WS0).then(a3).fallback(undefined), (...arg) => arg));
}
export function arg4R2(a0, a1, a2, a3) {
    return C.WS1.then(P.seqMap(a0, P.string(",").trim(C.WS0).then(a1), P.string(",").trim(C.WS0).then(a2).fallback(undefined), P.string(",").trim(C.WS0).then(a3).fallback(undefined), (...arg) => arg));
}
export function arg4R3(a0, a1, a2, a3) {
    return C.WS1.then(P.seqMap(a0, P.string(",").trim(C.WS0).then(a1), P.string(",").trim(C.WS0).then(a2), P.string(",").trim(C.WS0).then(a3).fallback(undefined), (...arg) => arg));
}
export function arg5R1(a0, a1, a2, a3, a4) {
    return C.WS1.then(P.seqMap(a0, P.string(",").trim(C.WS0).then(a1).fallback(undefined), P.string(",").trim(C.WS0).then(a2).fallback(undefined), P.string(",").trim(C.WS0).then(a3).fallback(undefined), P.string(",").trim(C.WS0).then(a4).fallback(undefined), (...arg) => arg));
}
export function arg5R3(a0, a1, a2, a3, a4) {
    return C.WS1.then(P.seqMap(a0, P.string(",").trim(C.WS0).then(a1), P.string(",").trim(C.WS0).then(a2), P.string(",").trim(C.WS0).then(a3).fallback(undefined), P.string(",").trim(C.WS0).then(a4).fallback(undefined), (...arg) => arg));
}
export function argNR0(an) {
    return P.alt(C.WS1.then(sepBy0(",", an)), C.WS0.map(() => []))
        .skip(P.string(",").fallback(""));
}
export function argNR1(a0, an) {
    return C.WS1.then(sepBy1(",", a0, an)).skip(P.string(",").fallback(""));
}
export function tryParse(parser, raw) {
    const result = parser.parse(raw.get());
    if (result.status) {
        return result.value;
    }
    else {
        throw E.parser(`Expected one of (${result.expected.join(", ")})`);
    }
}
