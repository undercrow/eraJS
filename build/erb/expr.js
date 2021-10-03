import P from "parsimmon";
import Binary from "../statement/expr/binary";
import Const from "../statement/expr/const";
import Form from "../statement/expr/form";
import InlineCall from "../statement/expr/inline-call";
import Ternary from "../statement/expr/ternary";
import Unary from "../statement/expr/unary";
import Variable from "../statement/expr/variable";
import * as U from "./util";
function leftAssociate(op, subExpr, associate) {
    return P.seqMap(subExpr, P.seq(U.alt(...op).trim(U.WS0), subExpr).many(), (first, rest) => rest.reduce((acc, val) => associate(val[0], acc, val[1]), first));
}
const language = P.createLanguage({
    SimpleVariable: () => P.alt(P.seqMap(U.Identifier, P.string("@"), U.Identifier, (name, _at, scope) => new Variable(name, [], scope)), U.Identifier.map((name) => new Variable(name, []))),
    Variable: (r) => U.sepBy1(":", r.SimpleVariable, P.alt(U.UInt.map((value) => new Const(value)), r.InlineCall, r.SimpleVariable, U.wrap("(", ")", r.FullExpr)))
        .map(([variable, ...index]) => new Variable(variable.name, index, variable.scope)),
    ExprL0: (r) => P.alt(U.wrap("(", ")", r.FullExpr), U.UInt.map((val) => new Const(val)), U.Str.map((value) => new Const(value)), U.wrap("@\"", "\"", form["\""]), ternaryChunk(), r.InlineCall, r.Variable),
    ExprL1: (r) => P.alt(P.seqMap(U.alt("+", "-", "!", "~").skip(U.WS0), r.ExprL0, (op, expr) => new Unary(op, expr)), r.ExprL0),
    ExprL2: (r) => leftAssociate(["*", "/", "%"], r.ExprL1, (op, left, right) => new Binary(op, left, right)),
    ExprL2_2: (r) => leftAssociate(["*", "/"], r.ExprL1, (op, left, right) => new Binary(op, left, right)),
    ExprL3: (r) => leftAssociate(["+", "-"], r.ExprL2, (op, left, right) => new Binary(op, left, right)),
    ExprL3_2: (r) => leftAssociate(["+", "-"], r.ExprL2_2, (op, left, right) => new Binary(op, left, right)),
    ExprL4: (r) => leftAssociate(["<<", ">>"], r.ExprL3, (op, left, right) => new Binary(op, left, right)),
    ExprL4_2: (r) => leftAssociate(["<<", ">>"], r.ExprL3_2, (op, left, right) => new Binary(op, left, right)),
    ExprL5: (r) => leftAssociate(["<=", "<", ">=", ">"], r.ExprL4, (op, left, right) => new Binary(op, left, right)),
    ExprL5_2: (r) => leftAssociate(["<=", "<", ">=", ">"], r.ExprL4_2, (op, left, right) => new Binary(op, left, right)),
    ExprL6: (r) => leftAssociate(["==", "!="], r.ExprL5, (op, left, right) => new Binary(op, left, right)),
    ExprL6_2: (r) => leftAssociate(["==", "!="], r.ExprL5_2, (op, left, right) => new Binary(op, left, right)),
    ExprL7: (r) => leftAssociate(["&", "|", "^"], r.ExprL6, (op, left, right) => new Binary(op, left, right)),
    ExprL7_2: (r) => leftAssociate(["&", "|", "^"], r.ExprL6_2, (op, left, right) => new Binary(op, left, right)),
    ExprL8: (r) => leftAssociate(["&&", "!&", "||", "!|", "^^"], r.ExprL7, (op, left, right) => new Binary(op, left, right)),
    ExprL8_2: (r) => leftAssociate(["&&", "!&", "||", "!|", "^^"], r.ExprL7_2, (op, left, right) => new Binary(op, left, right)),
    ExprL9: (r) => P.seqMap(r.ExprL8, P.alt(P.seq(P.string("?").trim(U.WS0).then(r.ExprL8), P.string("#").trim(U.WS0).then(r.ExprL8)), P.succeed(undefined)), (expr, ternary) => {
        if (ternary != null) {
            return new Ternary(expr, ternary[0], ternary[1]);
        }
        else {
            return expr;
        }
    }),
    ExprL9_2: (r) => P.seqMap(r.ExprL8_2, P.alt(P.seq(P.string("?").trim(U.WS0).then(r.ExprL8_2), P.string("#").trim(U.WS0).then(r.ExprL8_2)), P.succeed(undefined)), (expr, ternary) => {
        if (ternary != null) {
            return new Ternary(expr, ternary[0], ternary[1]);
        }
        else {
            return expr;
        }
    }),
    FullExpr: (r) => r.ExprL9,
    LightExpr: (r) => r.ExprL9_2,
    InlineCall: (r) => P.seqMap(U.Identifier, U.WS0.then(U.wrap("(", ")", U.sepBy0(",", r.FullExpr))), (name, arg) => new InlineCall(name, arg)),
});
const intChunk = U.wrap("{", "}", P.seqMap(language.FullExpr.trim(U.WS0), P.string(",").trim(U.WS0).then(language.FullExpr).fallback(undefined), P.string(",").trim(U.WS0).then(U.alt("LEFT", "RIGHT")).fallback(undefined), (value, display, align) => ({ value, display, align })));
const strChunk = U.wrap("%", "%", P.seqMap(language.LightExpr.trim(U.WS0), P.string(",").trim(U.WS0).then(language.LightExpr).fallback(undefined), P.string(",").trim(U.WS0).then(U.alt("LEFT", "RIGHT")).fallback(undefined), (value, display, align) => ({ value, display, align })));
function ternaryChunk(...exclude) {
    return U.wrap("\\@", "\\@", P.lazy(() => P.seqMap(language.ExprL8.trim(U.WS0), P.string("?").then(U.optional(formParser(...exclude, "#"))), P.string("#").then(U.optional(formParser(...exclude))), (expr, left, right) => ({
        value: new Ternary(expr, left ?? new Const(""), right ?? new Const("")),
    }))));
}
function formParser(...exclude) {
    const chunk = P.alt(intChunk, strChunk, ternaryChunk(...exclude), U.charSeq("{", "%", "\\@", ...exclude).map((value) => ({ value })));
    return chunk.atLeast(1).map((expr) => new Form(expr));
}
export const variable = language.Variable;
export const expr = language.FullExpr;
export const form = {
    "": formParser(),
    ",": formParser(","),
    "\"": formParser("\""),
    "(": formParser("("),
    "(,": formParser("(", ","),
};
