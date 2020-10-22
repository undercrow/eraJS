import P from "parsimmon";

import * as ast from "./ast";

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

function optional<T>(parser: P.Parser<T>, def: T): P.Parser<T> {
	return P.alt(parser, P.string("").map(() => def));
}

function wrap<T>(left: string, parser: P.Parser<T>, right: string): P.Parser<T> {
	return parser.wrap(P.string(left), P.string(right));
}

// eslint-disable-next-line no-irregular-whitespace
const WS = P.alt(P.string(" "), P.string("\t"), P.string("　")).map(nullFn);
const WS0 = WS.many().map(nullFn);
const WS1 = WS.atLeast(1).map(nullFn);
const Comment = P.seq(WS0, P.string(";"), P.noneOf("\r\n").many());
const EOL = P.alt(Comment, WS, P.newline).atLeast(1).map(nullFn);
const ConstInt = P.alt(
	P.string("0b").then(P.regex(/0x[0-1]+/)).map((val) => parseInt(val, 2)),
	P.string("0x").then(P.regex(/0x[0-9a-fA-F]+/)).map((val) => parseInt(val, 16)),
	P.regex(/[0-9]+/).map((val) => parseInt(val, 10)),
);
const ConstString = charSeq("\"").trim(P.string("\""));
const Identifier = P.noneOf(SPECIAL_CHAR.join("")).atLeast(1).tie();

function charSeq(...exclude: string[]): P.Parser<string> {
	const charParser = P.alt(
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
	return charParser.atLeast(1).tie();
}

function leftAssociate<E, OP extends string>(
	op: OP[],
	subExpr: P.Parser<E>,
	associate: (op: OP, left: E, right: E) => E,
): P.Parser<E> {
	return P.seqMap(
		subExpr,
		P.seq(P.alt(...op.map(P.string)).trim(WS0) as P.Parser<OP>, subExpr).atLeast(1),
		(first, rest) => rest.reduce((acc, val) => associate(val[0], acc, val[1]), first),
	);
}

function asLine<T>(parser: P.Parser<T>, leadingSpace: boolean = true): P.Parser<T> {
	return (leadingSpace ? WS0 : P.string("")).then(parser).skip(EOL);
}

type LanguageSpec = {
	Variable: ast.Variable;
	IntExprL0: ast.IntExpr;
	IntExprL1: ast.IntExpr;
	IntExprL2: ast.IntExpr;
	IntExprL3: ast.IntExpr;
	IntExpr: ast.IntExpr;
	StringExprL0: ast.StringExpr;
	StringExpr: ast.StringExpr;
	InlineCall: ast.InlineCall;
	Form: ast.Form;
	Label: ast.Label;
	Goto: ast.Goto;
	PrintOType: ast.Print["outType"];
	PrintAction: ast.Print["action"];
	PlainCommand: ast.PlainCommand;
	Command: ast.Command;
	Assign: ast.Assign;
	Statement: ast.Statement;
	Language: ast.Statement[];
};

const language = P.createLanguage<LanguageSpec>({
	Variable: () => Identifier.map(ast.variable),
	IntExprL0: (r) => P.alt(r.InlineCall, r.Variable, ConstInt),
	IntExprL1: (r) => P.alt(
		leftAssociate(["==", "!="], r.IntExprL0, ast.binaryInt),
		r.IntExprL0,
	),
	IntExprL2: (r) => P.alt(
		leftAssociate(["*", "/", "%"], r.IntExprL1, ast.binaryInt),
		r.IntExprL1,
	),
	IntExprL3: (r) => P.alt(
		leftAssociate(["<", "<=", ">", ">="], r.IntExprL2, ast.binaryInt),
		r.IntExprL2,
	),
	IntExpr: (r) => r.IntExprL3,
	StringExprL0: (r) => P.alt(r.InlineCall, r.Variable, ConstString),
	StringExpr: (r) => r.StringExprL0,
	InlineCall: (r) => P.seqMap(
		Identifier,
		wrap("(", P.alt(r.IntExpr, r.StringExpr).sepBy(P.string(",")), ")"),
		ast.inlineCall
	),
	Form: (r) => P.alt(wrap("{", r.IntExpr, "}"), wrap("%", r.StringExpr, "%"), charSeq("{", "%"))
		.atLeast(1)
		.map(ast.form),
	Label: () => asLine(P.string("@").then(Identifier).map(ast.label), false),
	Goto: () => asLine(P.string("$").then(Identifier).map(ast.goto), false),
	PrintOType: () => P.alt(P.string("K"), P.string("D"), P.string("")).map((o) => {
		switch (o) {
			case "K": return "K";
			case "D": return "D";
			case "": return undefined;
		}
		return undefined;
	}),
	PrintAction: () => P.alt(P.string("L"), P.string("W"), P.string("")).map((a) => {
		switch (a) {
			case "L": return "newline";
			case "W": return "wait";
			case "": return undefined;
		}
		return undefined;
	}),
	PlainCommand: (r) => P.alt(
		asLine(P.string("PRINT").then(P.alt(
			P.string("V").then(P.seqMap(
				r.PrintOType,
				r.PrintAction,
				WS1.then(r.IntExpr),
				(out, action, val) => ast.print(val, out, action),
			)),
			P.string("S").then(P.seqMap(
				r.PrintOType,
				r.PrintAction,
				WS1.then(r.StringExpr),
				(out, action, val) => ast.print(val, out, action),
			)),
			P.string("FORM").then(P.seqMap(
				r.PrintOType,
				r.PrintAction,
				optional(WS1.then(r.Form), ast.form([""])),
				(out, action, val) => ast.print(val, out, action),
			)),
			// TODO: FORMS
			P.seqMap(
				r.PrintOType,
				r.PrintAction,
				optional(WS1.then(charSeq()), ""),
				(out, action, val) => ast.print(val, out, action),
			),
		))),
		asLine(P.string("DRAWLINE").map(ast.drawLine)),
		asLine(P.string("RESETCOLOR").map(ast.resetColor)),
		asLine(P.string("RESETBGCOLOR").map(ast.resetBgColor)),
		asLine(P.string("GETCOLOR").map(ast.getColor)),
		asLine(P.string("GETDEFCOLOR").map(ast.getDefColor)),
		asLine(P.string("GETBGCOLOR").map(ast.getBgColor)),
		asLine(P.string("GETDEFBGCOLOR").map(ast.getDefBgColor)),
		asLine(P.string("GETFOCUSCOLOR").map(ast.getFocusColor)),
		asLine(P.string("GETSTYLE").map(ast.getStyle)),
		asLine(P.string("GETFONT").map(ast.getFont)),
		asLine(P.string("CURRENTALIGN").map(ast.currentAlign)),
		asLine(P.string("CURRENTREDRAW").map(ast.currentRedraw)),
		asLine(P.string("PRINTCPERLINE").map(ast.printCPerLine)),
		asLine(P.string("LINEISEMPTY").map(ast.lineIsEmpty)),
		asLine(P.string("ISSKIP").map(ast.isSkip)),
		asLine(P.string("MOUSESKIP").map(ast.mouseSkip)),
		asLine(P.string("ADDDEFCHARA").map(ast.addDefChara)),
		asLine(P.string("ADDVOIDCHARA").map(ast.addVoidChara)),
		asLine(P.string("DELALLCHARA").map(ast.delAllChara)),
		asLine(P.string("RESETDATA").map(ast.resetData)),
		asLine(P.string("RESETGLOBAL").map(ast.resetGlobal)),
		asLine(P.string("SAVEGLOBAL").map(ast.saveGlobal)),
		asLine(P.string("LOADGLOBAL").map(ast.loadGlobal)),
		asLine(P.string("OUTPUTLOG").map(ast.outputLog)),
		asLine(P.string("GETTIME").map(ast.getTime)),
		asLine(P.string("GETMILLISECOND").map(ast.getMillisecond)),
		asLine(P.string("GETSECOND").map(ast.getSecond)),
		asLine(P.string("FORCEWAIT").map(ast.forceWait)),
		asLine(P.string("WAITANYKEY").map(ast.waitAnyKey)),
		asLine(P.string("DUMPRAND").map(ast.dumpRand)),
		asLine(P.string("INITRAND").map(ast.initRand)),
		asLine(P.string("DEBUGCLEAR").map(ast.debugClear)),
		asLine(P.string("MOUSEX").map(ast.mouseX)),
		asLine(P.string("MOUSEY").map(ast.mouseY)),
		asLine(P.string("ISACTIVE").map(ast.isActive)),
		asLine(P.string("CBGCLEAR").map(ast.cbgClear)),
		asLine(P.string("CBGCLEARBUTTON").map(ast.cbgClearButton)),
		asLine(P.string("CBGREMOVEBMAP").map(ast.cbgRemoveBmap)),
		asLine(P.string("CLEARTEXTBOX").map(ast.clearTextBox)),
		asLine(P.string("STRDATA").map(ast.strData)),
		asLine(P.string("STOPCALLTRAIN").map(ast.stopCallTrain)),
	),
	Command: (r) => P.alt(
		r.PlainCommand,
		P.seqMap(
			asLine(P.string("SIF").skip(WS1).then(r.IntExpr)),
			r.PlainCommand,
			(cond, then) => ast.conditional([[cond, [then]]]),
		),
		P.seqMap(
			P.seq(asLine(P.string("IF").skip(WS1).then(r.IntExpr)), r.Command.many()),
			P.seq(asLine(P.string("ELSEIF").skip(WS1).then(r.IntExpr)), r.Command.many()).many(),
			optional(asLine(P.string("ELSE")).then(r.Command.many()), []),
			asLine(P.string("ENDIF")),
			(ifStmt, elifStmt, elseStmt) => ast.conditional([ifStmt, ...elifStmt, [1, elseStmt]]),
		),
	),
	Assign: (r) => asLine(P.seqMap(
		r.Variable,
		P.string("=").trim(WS0),
		P.alt(r.IntExpr, r.Form),
		(dest, _op, expr) => ast.assign(dest, expr),
	)),
	Statement: (r) => P.alt(
		r.Label,
		r.Goto,
		r.Assign,
		r.Command,
	),
	Language: (r) => r.Statement.many().skip(P.eof),
});

export default function parse(content: string): ast.Statement[] {
	return language.Language.tryParse(content + "\n");
}
