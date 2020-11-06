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
	ExprL3: Expr;
	ExprL4: Expr;
	ExprL5: Expr;
	ExprL6: Expr;
	ExprL7: Expr;
	ExprL8: Expr;
	Expr: Expr;
	InlineCall: InlineCall;
	Form: Form;
};

const language = P.createLanguage<LanguageSpec>({
	Variable: (r) => U.sepBy1(":", U.Identifier, P.alt(
		U.UInt.map((value) => new Const(value)),
		r.InlineCall,
		U.Identifier.map((name) => new Variable(name, [])),
		U.wrap("(", r.Expr, ")"),
	))
		.map(([name, ...index]) => new Variable(name, index)),
	ExprL0: (r) => P.alt(
		U.wrap("(", r.Expr, ")"),
		U.UInt.map((val) => new Const(val)),
		U.Str.map((value) => new Const(value)),
		U.wrap('@"', P.noneOf('"\r\n').many().tie().thru(U.nest(r.Form)), '"'),
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
	ExprL3: (r) => leftAssociate(
		["+", "-"],
		r.ExprL2,
		(op, left, right) => new Binary(op, left, right),
	),
	ExprL4: (r) => leftAssociate(
		["<=", "<", ">=", ">"],
		r.ExprL3,
		(op, left, right) => new Binary(op, left, right),
	),
	ExprL5: (r) => leftAssociate(
		["==", "!="],
		r.ExprL4,
		(op, left, right) => new Binary(op, left, right),
	),
	ExprL6: (r) => leftAssociate(
		["&", "|", "^"],
		r.ExprL5,
		(op, left, right) => new Binary(op, left, right),
	),
	ExprL7: (r) => leftAssociate(
		["&&", "!&", "||", "!|", "^^"],
		r.ExprL6,
		(op, left, right) => new Binary(op, left, right),
	),
	ExprL8: (r) => P.seqMap(
		r.ExprL7,
		P.alt(
			P.seq(
				P.string("?").trim(U.WS0).then(r.ExprL7),
				P.string("#").trim(U.WS0).then(r.ExprL7),
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
	Expr: (r) => r.ExprL8,
	InlineCall: (r) => P.seqMap(
		U.Identifier,
		U.WS0.then(U.wrap("(", U.sepBy0(",", r.Expr), ")")),
		(name, arg) => new InlineCall(name, arg),
	),
	Form: (r) => {
		const chunk: P.Parser<Form["expr"][number]> = P.alt(
			U.wrap("{", P.noneOf("}\r\n").many().tie(), "}").thru(U.nest(P.seqMap(
				r.Expr,
				P.string(",").trim(U.WS0).then(r.Expr).fallback(undefined),
				P.string(",").trim(U.WS0).then(U.alt("LEFT", "RIGHT")).fallback(undefined),
				(value, display, align) => ({value, display, align}),
			))),
			U.wrap("%", P.noneOf("%\r\n").many().tie(), "%").thru(U.nest(P.seqMap(
				r.Expr,
				P.string(",").trim(U.WS0).then(r.Expr).fallback(undefined),
				P.string(",").trim(U.WS0).then(U.alt("LEFT", "RIGHT")).fallback(undefined),
				(value, display, align) => ({value, display, align}),
			))),
			U.wrap(
				"\\@",
				P.alt(P.noneOf("\r\n\\"), P.string("\\").notFollowedBy(P.string("@"))).many().tie(),
				"\\@",
			).thru(
				U.nest(P.lazy(() => P.seqMap(
					r.Expr,
					P.string("?").trim(U.WS0).then(chunk),
					P.string("#").trim(U.WS0).then(chunk),
					(expr, left, right) => ({
						value: new Ternary(expr, new Form([left]), new Form([right])),
					}),
				))),
			),
			U.charSeq("{", "%").map((value) => ({value})),
		);

		return chunk.atLeast(1).map((expr) => new Form(expr));
	},
});

export default language;
