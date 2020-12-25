import P from "parsimmon";

import Expr from "../statement/expr";
import Binary from "../statement/expr/binary";
import Const from "../statement/expr/const";
import Form from "../statement/expr/form";
import InlineCall from "../statement/expr/inline-call";
import Ternary from "../statement/expr/ternary";
import Unary from "../statement/expr/unary";
import Variable from "../statement/expr/variable";
import * as U from "./util";

function leftAssociate<E, OP extends string>(
	op: OP[],
	subExpr: P.Parser<E>,
	associate: (op: OP, left: E, right: E) => E,
): P.Parser<E> {
	return P.seqMap(
		subExpr,
		P.seq(U.alt(...op).trim(U.WS0), subExpr).many(),
		(first, rest) => rest.reduce((acc, val) => associate(val[0], acc, val[1]), first),
	);
}

type LanguageSpec = {
	Variable: Variable;
	ExprL0: Expr;
	ExprL1: Expr;
	ExprL2: Expr;
	ExprL2_2: Expr;
	ExprL3: Expr;
	ExprL3_2: Expr;
	ExprL4: Expr;
	ExprL4_2: Expr;
	ExprL5: Expr;
	ExprL5_2: Expr;
	ExprL6: Expr;
	ExprL6_2: Expr;
	ExprL7: Expr;
	ExprL7_2: Expr;
	ExprL8: Expr;
	ExprL8_2: Expr;
	ExprL9: Expr;
	ExprL9_2: Expr;
	FullExpr: Expr;
	LightExpr: Expr;
	InlineCall: InlineCall;
};

const language = P.createLanguage<LanguageSpec>({
	Variable: (r) => U.sepBy1(":", U.Identifier, P.alt(
		U.UInt.map((value) => new Const(value)),
		r.InlineCall,
		U.Identifier.map((name) => new Variable(name, [])),
		U.wrap("(", r.FullExpr, ")"),
	))
		.map(([name, ...index]) => new Variable(name, index)),
	ExprL0: (r) => P.alt(
		U.wrap("(", r.FullExpr, ")"),
		U.UInt.map((val) => new Const(val)),
		U.Str.map((value) => new Const(value)),
		U.wrap('@"', form["\""], '"'),
		r.InlineCall,
		r.Variable,
	),
	ExprL1: (r) => P.alt(
		P.seqMap(
			U.alt("+", "-", "!", "~").skip(U.WS0),
			r.ExprL0,
			(op, expr) => new Unary(op, expr),
		),
		r.ExprL0,
	),
	ExprL2: (r) => leftAssociate(
		["*", "/", "%"],
		r.ExprL1,
		(op, left, right) => new Binary(op, left, right),
	),
	ExprL2_2: (r) => leftAssociate(
		["*", "/"],
		r.ExprL1,
		(op, left, right) => new Binary(op, left, right),
	),
	ExprL3: (r) => leftAssociate(
		["+", "-"],
		r.ExprL2,
		(op, left, right) => new Binary(op, left, right),
	),
	ExprL3_2: (r) => leftAssociate(
		["+", "-"],
		r.ExprL2_2,
		(op, left, right) => new Binary(op, left, right),
	),
	ExprL4: (r) => leftAssociate(
		["<<", ">>"],
		r.ExprL3,
		(op, left, right) => new Binary(op, left, right),
	),
	ExprL4_2: (r) => leftAssociate(
		["<<", ">>"],
		r.ExprL3_2,
		(op, left, right) => new Binary(op, left, right),
	),
	ExprL5: (r) => leftAssociate(
		["<=", "<", ">=", ">"],
		r.ExprL4,
		(op, left, right) => new Binary(op, left, right),
	),
	ExprL5_2: (r) => leftAssociate(
		["<=", "<", ">=", ">"],
		r.ExprL4_2,
		(op, left, right) => new Binary(op, left, right),
	),
	ExprL6: (r) => leftAssociate(
		["==", "!="],
		r.ExprL5,
		(op, left, right) => new Binary(op, left, right),
	),
	ExprL6_2: (r) => leftAssociate(
		["==", "!="],
		r.ExprL5_2,
		(op, left, right) => new Binary(op, left, right),
	),
	ExprL7: (r) => leftAssociate(
		["&", "|", "^"],
		r.ExprL6,
		(op, left, right) => new Binary(op, left, right),
	),
	ExprL7_2: (r) => leftAssociate(
		["&", "|", "^"],
		r.ExprL6_2,
		(op, left, right) => new Binary(op, left, right),
	),
	ExprL8: (r) => leftAssociate(
		["&&", "!&", "||", "!|", "^^"],
		r.ExprL7,
		(op, left, right) => new Binary(op, left, right),
	),
	ExprL8_2: (r) => leftAssociate(
		["&&", "!&", "||", "!|", "^^"],
		r.ExprL7_2,
		(op, left, right) => new Binary(op, left, right),
	),
	ExprL9: (r) => P.seqMap(
		r.ExprL8,
		P.alt(
			P.seq(
				P.string("?").trim(U.WS0).then(r.ExprL8),
				P.string("#").trim(U.WS0).then(r.ExprL8),
			),
			P.succeed(undefined),
		),
		(expr, ternary) => {
			if (ternary != null) {
				return new Ternary(expr, ternary[0], ternary[1]);
			} else {
				return expr;
			}
		},
	),
	ExprL9_2: (r) => P.seqMap(
		r.ExprL8_2,
		P.alt(
			P.seq(
				P.string("?").trim(U.WS0).then(r.ExprL8_2),
				P.string("#").trim(U.WS0).then(r.ExprL8_2),
			),
			P.succeed(undefined),
		),
		(expr, ternary) => {
			if (ternary != null) {
				return new Ternary(expr, ternary[0], ternary[1]);
			} else {
				return expr;
			}
		},
	),
	FullExpr: (r) => r.ExprL9,
	LightExpr: (r) => r.ExprL9_2,
	InlineCall: (r) => P.seqMap(
		U.Identifier,
		U.WS0.then(U.wrap("(", U.sepBy0(",", r.FullExpr), ")")),
		(name, arg) => new InlineCall(name, arg),
	),
});

function createFormParser(...exclude: string[]): P.Parser<Form> {
	const chunk: P.Parser<Form["expr"][number]> = P.alt(
		U.wrap(
			"{",
			P.seqMap(
				language.FullExpr.trim(U.WS0),
				P.string(",").trim(U.WS0).then(language.FullExpr).fallback(undefined),
				P.string(",").trim(U.WS0).then(U.alt("LEFT", "RIGHT")).fallback(undefined),
				(value, display, align) => ({value, display, align}),
			),
			"}",
		),
		U.wrap(
			"%",
			P.seqMap(
				language.LightExpr.trim(U.WS0),
				P.string(",").trim(U.WS0).then(language.LightExpr).fallback(undefined),
				P.string(",").trim(U.WS0).then(U.alt("LEFT", "RIGHT")).fallback(undefined),
				(value, display, align) => ({value, display, align}),
			),
			"%",
		),
		U.wrap(
			"\\@",
			P.lazy(() => P.seqMap(
				language.ExprL8.trim(U.WS0),
				P.string("?").then(P.noneOf("#").many().tie()).thru(U.nest(chunk)),
				P.string("#").then(chunk),
				(expr, left, right) => ({
					value: new Ternary(expr, new Form([left]), new Form([right])),
				}),
			)),
			"\\@",
		),
		U.charSeq("{", "%", "\\@", ...exclude),
	);

	return chunk.atLeast(1).map((expr) => new Form(expr));
}

export const variable = language.Variable;
export const expr = language.FullExpr;
export const form = {
	"": createFormParser(),
	",": createFormParser(","),
	"\"": createFormParser("\""),
	"(": createFormParser("("),
};
