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
function nullFn() {
    return null;
}
export function alt(...values) {
    return P.alt(...values.map(P.string));
}
export function asLine(parser) {
    return parser.skip(EOL);
}
export function optional(parser) {
    return parser.fallback(undefined);
}
export function nest(parser) {
    return (prev) => prev.map((value) => parser.tryParse(value));
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
    return P.sepBy(parser, P.string(sep).trim(WS0));
}
export function sepBy1(sep, first, rest) {
    return P.seq(first, P.string(sep).trim(WS0).then(rest).many()).map(([f, r]) => [f, ...r]);
}
export function wrap(left, right, parser) {
    return parser.wrap(P.string(left).skip(WS0), WS0.then(P.string(right)));
}
const EOL = P.string("\n").atLeast(1).map(nullFn);
// eslint-disable-next-line no-irregular-whitespace
const WS = alt(" ", "\t", "　");
export const WS0 = WS.many().map(nullFn);
export const WS1 = WS.atLeast(1).map(nullFn);
export const Identifier = P.noneOf(SPECIAL_CHAR.join("")).atLeast(1).tie();
export const UInt = P.alt(P.regex(/1p/i).then(P.regex(/[0-9]+/)).map((val) => 2 ** parseInt(val, 10)), P.regex(/0b/i).then(P.regex(/[0-1]+/)).map((val) => parseInt(val, 2)), P.regex(/0x/i).then(P.regex(/[0-9a-fA-F]+/)).map((val) => parseInt(val, 16)), P.regex(/[0-9]+/).map((val) => parseInt(val, 10)));
export const Int = P.alt(P.string("+").then(UInt), P.string("-").then(UInt).map((val) => -val), UInt);
const UFloat = P.regex(/[0-9]+\.[0-9]+/).map((val) => parseFloat(val));
export const Float = P.alt(P.string("+").then(UFloat), P.string("-").then(UFloat).map((val) => -val), UFloat, Int);
export const Str = char("\"").many().tie().trim(P.string("\""));
export function char(...exclude) {
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
        }
        else {
            return P.succeed(prev);
        }
    });
}
export function charSeq(...exclude) {
    return char(...exclude).atLeast(1).tie();
}
export function charSeq0(...exclude) {
    return char(...exclude).many().tie();
}
export function arg0R0() {
    return P.succeed(null);
}
export function arg1R0(a0) {
    return P.alt(WS1.then(a0), WS0.map(() => undefined));
}
export function arg1R1(a0) {
    return WS1.then(a0);
}
export function arg2R1(a0, a1) {
    return WS1.then(P.seq(a0, P.string(",").trim(WS0).then(a1).fallback(undefined)));
}
export function arg2R2(a0, a1) {
    return WS1.then(P.seq(a0, P.string(",").trim(WS0).then(a1)));
}
export function arg3R3(a0, a1, a2) {
    return WS1.then(P.seqMap(a0, P.string(",").trim(WS0).then(a1), P.string(",").trim(WS0).then(a2), (...arg) => arg));
}
export function arg4R1(a0, a1, a2, a3) {
    return WS1.then(P.seqMap(a0, P.string(",").trim(WS0).then(a1).fallback(undefined), P.string(",").trim(WS0).then(a2).fallback(undefined), P.string(",").trim(WS0).then(a3).fallback(undefined), (...arg) => arg));
}
export function arg4R2(a0, a1, a2, a3) {
    return WS1.then(P.seqMap(a0, P.string(",").trim(WS0).then(a1), P.string(",").trim(WS0).then(a2).fallback(undefined), P.string(",").trim(WS0).then(a3).fallback(undefined), (...arg) => arg));
}
export function arg4R3(a0, a1, a2, a3) {
    return WS1.then(P.seqMap(a0, P.string(",").trim(WS0).then(a1), P.string(",").trim(WS0).then(a2), P.string(",").trim(WS0).then(a3).fallback(undefined), (...arg) => arg));
}
export function arg5R1(a0, a1, a2, a3, a4) {
    return WS1.then(P.seqMap(a0, P.string(",").trim(WS0).then(a1).fallback(undefined), P.string(",").trim(WS0).then(a2).fallback(undefined), P.string(",").trim(WS0).then(a3).fallback(undefined), P.string(",").trim(WS0).then(a4).fallback(undefined), (...arg) => arg));
}
export function argNR0(an) {
    return P.alt(WS1.then(sepBy0(",", an)), WS0.map(() => []))
        .skip(P.string(",").fallback(""));
}
export function argNR1(a0, an) {
    return WS1.then(sepBy1(",", a0, an)).skip(P.string(",").fallback(""));
}
