import P from "parsimmon";

import Expr from "../statement/expr";
import Binary from "../statement/expr/binary";
import Const from "../statement/expr/const";
import Form from "../statement/expr/form";
import InlineCall from "../statement/expr/inline-call";
import Ternary from "../statement/expr/ternary";
import Unary from "../statement/expr/unary";
import UnaryOp from "../statement/expr/unary-op";
import Variable from "../statement/expr/variable";
import * as C from "./const";
import * as U from "./util";

type LanguageSpec = {
	Variable: Variable;
	Index: Expr,
	FullVariable: Variable;
	UnaryOp: Expr;
	Leaf: Expr;
	Unary: Expr;
	Binary: Expr;
	PercentlessBinary: Expr;
	Ternary: Expr;
	PercentlessTernary: Expr;
	Expr: Expr;
	PercentlessExpr: Expr;
	InlineCall: InlineCall;
};

const language = P.createLanguage<LanguageSpec>({
	Variable: () => P.seqMap(
		C.Identifier,
		U.optional(P.string("@").then(C.Identifier)),
		(name, scope) => new Variable(name, [], scope),
	),
	Index: (r) => P.alt(
		C.UInt.map((value) => new Const(BigInt(value))),
		r.InlineCall,
		U.wrap("(", ")", r.Expr),
		r.Variable,
	),
	FullVariable: (r) => P.seqMap(
		r.Variable,
		U.optional(P.string(":").trim(C.WS0).then(r.Index)),
		U.optional(P.string(":").trim(C.WS0).then(r.Index)),
		U.optional(P.string(":").trim(C.WS0).then(r.Index)),
		(variable, index0, index1, index2) => {
			if (index0 == null) {
				variable.index = [];
			} else if (index1 == null) {
				variable.index = [index0];
			} else if (index2 == null) {
				variable.index = [index0, index1];
			} else {
				variable.index = [index0, index1, index2];
			}
			return variable;
		}
	),
	UnaryOp: (r) => P.alt(
		P.seqMap(
			r.FullVariable,
			U.alt("++", "--"),
			(variable, op) => new UnaryOp(variable, op, true),
		),
		P.seqMap(
			U.alt("++", "--"),
			r.FullVariable,
			(op, variable) => new UnaryOp(variable, op, false),
		),
	),
	Leaf: (r) => P.alt(
		C.UInt.map((val) => new Const(BigInt(val))),
		C.Str.map((value) => new Const(value)),
		r.InlineCall,
		U.wrap("@\"", "\"", form["\""]),
		U.wrap("(", ")", r.Expr),
		r.UnaryOp,
		r.FullVariable,
	),
	Unary: (r) => P.alt(
		P.seqMap(
			U.alt("+", "-", "!", "~").skip(C.WS0),
			r.Leaf,
			(op, expr) => new Unary(op, expr),
		),
		r.Leaf,
	),
	Binary: (r) => {
		let result = r.Unary;
		const operators = <const>[
			["*", "/", "%"],
			["+", "-"],
			["<<", ">>"],
			["<=", "<", ">=", ">"],
			["==", "!="],
			["&", "|", "^"],
			["&&", "!&", "||", "!|", "^^"],
		];
		for (const op of operators) {
			result = P.seqMap(
				result,
				P.seq(U.alt(...op).trim(C.WS0), result).many(),
				(first, rest) => rest.reduce((acc, val) => new Binary(val[0], acc, val[1]), first),
			);
		}

		return result;
	},
	PercentlessBinary: (r) => {
		let result = r.Unary;
		const operators = <const>[
			["*", "/"],
			["+", "-"],
			["<<", ">>"],
			["<=", "<", ">=", ">"],
			["==", "!="],
			["&", "|", "^"],
			["&&", "!&", "||", "!|", "^^"],
		];
		for (const op of operators) {
			result = P.seqMap(
				result,
				P.seq(U.alt(...op).trim(C.WS0), result).many(),
				(first, rest) => rest.reduce((acc, val) => new Binary(val[0], acc, val[1]), first),
			);
		}

		return result;
	},
	Ternary: (r) => P.alt(
		U.wrap("\\@", "\\@", P.seqMap(
			r.Binary,
			P.string("?").trim(C.WS0).then(U.optional(P.lazy(() => form["#"]))),
			U.optional(P.string("#").trim(C.WS0).then(U.optional(P.lazy(() => formEnd)))),
			(expr, left, right) => new Ternary(expr, left ?? new Const(""), right ?? new Const("")),
		)),
		P.seqMap(
			r.Binary,
			P.string("?").trim(C.WS0).then(r.Binary),
			P.string("#").trim(C.WS0).then(r.Binary),
			(expr, left, right) => new Ternary(expr, left, right),
		),
		r.Binary,
	),
	PercentlessTernary: (r) => P.alt(
		U.wrap("\\@", "\\@", P.seqMap(
			r.PercentlessBinary,
			P.string("?").trim(C.WS0).then(U.optional(P.lazy(() => form["#"]))),
			U.optional(P.string("#").trim(C.WS0).then(U.optional(P.lazy(() => formEnd)))),
			(expr, left, right) => new Ternary(expr, left ?? new Const(""), right ?? new Const("")),
		)),
		P.seqMap(
			r.PercentlessBinary,
			P.string("?").trim(C.WS0).then(r.PercentlessBinary),
			P.string("#").trim(C.WS0).then(r.PercentlessBinary),
			(expr, left, right) => new Ternary(expr, left, right),
		),
		r.PercentlessBinary,
	),
	Expr: (r) => r.Ternary,
	PercentlessExpr: (r) => r.PercentlessTernary,
	InlineCall: (r) => P.seqMap(
		C.Identifier,
		C.WS0.then(U.wrap("(", ")", U.sepBy0(",", r.Expr))),
		(name, arg) => new InlineCall(name, arg),
	),
});

function formParser(exclude: string, withTernary: boolean): P.Parser<Form> {
	const chunkParser: P.Parser<Form["expr"][number]>[] = [];

	chunkParser.push(U.wrap("{", "}", P.seqMap(
		language.Expr.trim(C.WS0),
		P.string(",").trim(C.WS0).then(U.optional(language.Expr)).fallback(undefined),
		P.string(",").trim(C.WS0).then(U.optional(U.alt("LEFT", "RIGHT"))).fallback(undefined),
		(value, display, align) => ({value, display, align}),
	)));

	chunkParser.push(U.wrap("%", "%", P.seqMap(
		language.PercentlessExpr.trim(C.WS0),
		P.string(",").trim(C.WS0).then(
			U.optional(language.PercentlessExpr),
		).fallback(undefined),
		P.string(",").trim(C.WS0).then(U.optional(U.alt("LEFT", "RIGHT"))).fallback(undefined),
		(value, display, align) => ({value, display, align}),
	)));

	if (withTernary) {
		chunkParser.push(U.wrap("\\@", "\\@", P.seqMap(
			language.Binary,
			P.string("?").trim(C.WS0).then(U.optional(P.lazy(() => form["#"]))),
			U.optional(P.string("#").trim(C.WS0).then(U.optional(P.lazy(() => formEnd)))),
			(expr, left, right) => ({
				value: new Ternary(expr, left ?? new Const(""), right ?? new Const("")),
			}),
		)));
	}

	chunkParser.push(C.charSeq("{", "%", "\\@", ...exclude).map((value) => ({value})));

	return P.alt(...chunkParser).atLeast(1).map((expr) => new Form(expr));
}

export const variable = language.FullVariable;
export const expr = language.Expr;
const formEnd = formParser("", false);
export const form = {
	"": formParser("", true),
	"#": formParser("#", true),
	",": formParser(",", true),
	"\"": formParser("\"", true),
	"(": formParser("(", true),
	"(,": formParser("(,", true),
};
