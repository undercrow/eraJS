import P from "parsimmon";

import Expr from "../statement/expr";
import BinaryInt from "../statement/expr/binary-int";
import Compare from "../statement/expr/compare";
import ConstIntExpr from "../statement/expr/const-int";
import ConstStringExpr from "../statement/expr/const-string";
import Form from "../statement/expr/form";
import InlineCall from "../statement/expr/inline-call";
import TernaryInt from "../statement/expr/ternary-int";
import UnaryInt from "../statement/expr/unary-int";
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
	IntExprL0: Expr;
	IntExprL1: Expr;
	IntExprL2: Expr;
	IntExprL3: Expr;
	IntExprL4: Expr;
	IntExprL5: Expr;
	IntExprL6: Expr;
	IntExprL7: Expr;
	IntExprL8: Expr;
	IntExpr: Expr;
	StringExprL0: Expr;
	StringExpr: Expr;
	Expr: Expr;
	InlineCall: InlineCall;
	Form: Form;
};

const language = P.createLanguage<LanguageSpec>({
	Variable: (r) => U.sepBy(":", U.Identifier, P.alt(
		U.Int.map((value) => new ConstIntExpr(value)),
		r.InlineCall,
		U.Identifier.map((name) => new Variable(name, [])),
		U.wrap("(", r.IntExpr, ")"),
	))
		.map(([name, ...index]) => new Variable(name, index)),
	IntExprL0: (r) => P.alt(
		U.wrap("(", r.IntExpr, ")"),
		U.Int.map((val) => new ConstIntExpr(val)),
		r.InlineCall,
		r.Variable,
	),
	IntExprL1: (r) => P.alt(
		P.seqMap(U.alt("!", "~"), r.IntExprL0, (op, expr) => new UnaryInt(op, expr)),
		r.IntExprL0,
	),
	IntExprL2: (r) => leftAssociate(
		["*", "/", "%"],
		r.IntExprL1,
		(op, left, right) => new BinaryInt(op, left, right),
	),
	IntExprL3: (r) => leftAssociate(
		["+", "-"],
		r.IntExprL2,
		(op, left, right) => new BinaryInt(op, left, right),
	),
	IntExprL4: (r) => leftAssociate(
		["<=", "<", ">=", ">"],
		r.IntExprL3,
		(op, left, right) => new BinaryInt(op, left, right),
	),
	IntExprL5: (r) => leftAssociate(
		["==", "!="],
		P.alt(r.IntExprL4, r.StringExpr),
		(op, left, right) => new Compare(op, left, right),
	),
	IntExprL6: (r) => leftAssociate(
		["&", "|", "^"],
		r.IntExprL5,
		(op, left, right) => new BinaryInt(op, left, right),
	),
	IntExprL7: (r) => leftAssociate(
		["&&", "!&", "||", "!|", "^^"],
		r.IntExprL6,
		(op, left, right) => new BinaryInt(op, left, right),
	),
	IntExprL8: (r) => P.seqMap(
		r.IntExprL7,
		P.alt(
			P.seq(
				P.string("?").trim(U.WS0).then(r.IntExprL7),
				P.string("#").trim(U.WS0).then(r.IntExprL7),
			),
			P.succeed(undefined),
		),
		(expr, ternary) => {
			if (ternary != null) {
				return new TernaryInt(expr, ternary[0], ternary[1]);
			} else {
				return expr;
			}
		},
	),
	IntExpr: (r) => r.IntExprL8,
	StringExprL0: (r) => P.alt(
		U.Str.map((value) => new ConstStringExpr(value)),
		r.InlineCall,
		r.Variable,
	),
	StringExpr: (r) => r.StringExprL0,
	Expr: (r) => P.alt(r.IntExpr, r.StringExpr),
	InlineCall: (r) => P.seqMap(
		U.Identifier,
		U.wrap("(", U.sepBy(",", P.alt(r.IntExpr, r.StringExpr)), ")"),
		(name, arg) => new InlineCall(name, arg),
	),
	Form: (r) => {
		const chunk = P.alt(
			U.wrap("{", P.seqMap(
				r.IntExpr,
				P.string(",").trim(U.WS0).then(r.IntExpr).fallback(undefined),
				P.string(",").trim(U.WS0).then(U.alt("LEFT", "RIGHT")).fallback(undefined),
				(value, display, align) => ({value, display, align}),
			), "}"),
			U.wrap("%", P.seqMap(
				r.StringExpr,
				P.string(",").trim(U.WS0).then(r.IntExpr).fallback(undefined),
				P.string(",").trim(U.WS0).then(U.alt("LEFT", "RIGHT")).fallback(undefined),
				(value, display, align) => ({value, display, align}),
			), "%"),
			U.charSeq("{", "%").map((value) => ({value})),
		);

		return chunk.atLeast(1).map((expr) => new Form(expr));
	},
});

export default language;
