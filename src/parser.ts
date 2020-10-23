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

function oneOf<T extends string>(...values: T[]): P.Parser<T> {
	return P.alt(...values.map(P.string)) as P.Parser<T>;
}

function wrap<T>(left: string, parser: P.Parser<T>, right: string): P.Parser<T> {
	return parser.wrap(P.string(left), P.string(right));
}

// eslint-disable-next-line no-irregular-whitespace
const WS = oneOf(" ", "\t", "　").map(nullFn);
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
		P.seq(oneOf(...op).trim(WS1), subExpr).atLeast(1),
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
	IntExprL4: ast.IntExpr;
	IntExpr: ast.IntExpr;
	StringExprL0: ast.StringExpr;
	StringExpr: ast.StringExpr;
	InlineCall: ast.InlineCall;
	Form: ast.Form;
	Label: ast.Label;
	PrintOType: ast.Print["outType"];
	PrintAction: ast.Print["action"];
	PlainCommand: ast.PlainCommand;
	Command: ast.Command;
	Assign: ast.Assign;
	Statement: ast.Statement;
	Function: ast.Fn;
	Language: ast.Fn[];
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
		leftAssociate(["+", "-"], r.IntExprL2, ast.binaryInt),
		r.IntExprL2,
	),
	IntExprL4: (r) => P.alt(
		leftAssociate(["<", "<=", ">", ">="], r.IntExprL3, ast.binaryInt),
		r.IntExprL3,
	),
	IntExpr: (r) => r.IntExprL4,
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
	Label: () => asLine(P.string("$").then(Identifier).map(ast.label), false),
	PrintOType: () => oneOf("K", "D", "").map((o) => {
		switch (o) {
			case "K": return "K";
			case "D": return "D";
			case "": return undefined;
		}
	}),
	PrintAction: () => oneOf("L", "W", "").map((a) => {
		switch (a) {
			case "L": return "newline";
			case "W": return "wait";
			case "": return undefined;
		}
	}),
	PlainCommand: (r) => asLine(P.alt(
		P.string("PRINT").then(P.alt(
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
		)),
		P.string("DRAWLINE").map(ast.drawLine),
		P.string("CLEARLINE").skip(WS1).then(r.IntExpr).map(ast.clearLine),
		P.string("RESETCOLOR").map(ast.resetColor),
		P.string("RESETBGCOLOR").map(ast.resetBgColor),
		P.string("GETCOLOR").map(ast.getColor),
		P.string("GETDEFCOLOR").map(ast.getDefColor),
		P.string("GETBGCOLOR").map(ast.getBgColor),
		P.string("GETDEFBGCOLOR").map(ast.getDefBgColor),
		P.string("GETFOCUSCOLOR").map(ast.getFocusColor),
		P.string("FONTBOLD").map(ast.fontBold),
		P.string("FONTITALIC").map(ast.fontItalic),
		P.string("FONTREGULAR").map(ast.fontRegular),
		P.string("GETSTYLE").map(ast.getStyle),
		P.string("SETFONT").then(optional(WS1.then(r.StringExpr), "")).map(ast.setFont),
		P.string("GETFONT").map(ast.getFont),
		P.string("ALIGNMENT").skip(WS1).then(oneOf("LEFT", "CENTER", "RIGHT")).map((align) => {
			switch (align) {
				case "LEFT": return ast.alignment("left");
				case "CENTER": return ast.alignment("center");
				case "RIGHT": return ast.alignment("right");
			}
		}),
		P.string("CURRENTALIGN").map(ast.currentAlign),
		P.string("CURRENTREDRAW").map(ast.currentRedraw),
		P.string("PRINTCPERLINE").map(ast.printCPerLine),
		P.string("LINEISEMPTY").map(ast.lineIsEmpty),
		P.string("ISSKIP").map(ast.isSkip),
		P.string("MOUSESKIP").map(ast.mouseSkip),
		P.string("STRLEN").skip(WS1).then(charSeq()).map(ast.strlen),
		P.string("STRLENS").skip(WS1).then(r.StringExpr).map(ast.strlen),
		P.string("STRLENFORM").skip(WS1).then(r.Form).map(ast.strlen),
		P.string("SUBSTRING").skip(WS1).then(P.seqMap(
			r.StringExpr.trim(WS0),
			P.string(",").then(r.IntExpr.trim(WS0)),
			P.string(",").then(r.IntExpr.trim(WS0)),
			ast.substring,
		)),
		P.string("ADDCHARA").skip(WS1).then(r.IntExpr).map(ast.addChara),
		P.string("ADDDEFCHARA").map(ast.addDefChara),
		P.string("ADDVOIDCHARA").map(ast.addVoidChara),
		P.string("DELALLCHARA").map(ast.delAllChara),
		P.string("RESETDATA").map(ast.resetData),
		P.string("RESETGLOBAL").map(ast.resetGlobal),
		P.string("SAVEGAME").map(ast.saveGame),
		P.string("LOADGAME").map(ast.loadGame),
		P.string("SAVEGLOBAL").map(ast.saveGlobal),
		P.string("LOADGLOBAL").map(ast.loadGlobal),
		P.string("OUTPUTLOG").map(ast.outputLog),
		P.string("GETTIME").map(ast.getTime),
		P.string("GETMILLISECOND").map(ast.getMillisecond),
		P.string("GETSECOND").map(ast.getSecond),
		P.string("FORCEWAIT").map(ast.forceWait),
		P.string("INPUT").then(WS1.then(ConstInt).fallback(undefined)).map(ast.input),
		P.string("INPUTS").skip(WS1).then(charSeq().fallback(undefined)).map(ast.inputS),
		P.string("WAITANYKEY").map(ast.waitAnyKey),
		P.string("DUMPRAND").map(ast.dumpRand),
		P.string("INITRAND").map(ast.initRand),
		P.string("BEGIN").skip(WS1).then(Identifier).map(ast.begin),
		P.string("CALL").skip(WS1).then(Identifier).map(ast.call),
		P.string("GOTO").skip(WS1).then(Identifier).map(ast.goto),
		P.string("RETURN").skip(WS1).then(r.IntExpr).map(ast.ret),
		P.string("DEBUGCLEAR").map(ast.debugClear),
		P.string("MOUSEX").map(ast.mouseX),
		P.string("MOUSEY").map(ast.mouseY),
		P.string("ISACTIVE").map(ast.isActive),
		P.string("CBGCLEAR").map(ast.cbgClear),
		P.string("CBGCLEARBUTTON").map(ast.cbgClearButton),
		P.string("CBGREMOVEBMAP").map(ast.cbgRemoveBmap),
		P.string("CLEARTEXTBOX").map(ast.clearTextBox),
		P.string("STRDATA").map(ast.strData),
		P.string("STOPCALLTRAIN").map(ast.stopCallTrain),
	)),
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
		r.Assign,
		r.Command,
	),
	Function: (r) => P.seqMap(
		asLine(P.string("@").then(Identifier), false),
		r.Statement.many(),
		ast.fn,
	),
	Language: (r) => r.Function.many().skip(P.eof),
});

export default function parse(content: string): ast.Fn[] {
	return language.Language.tryParse(content + "\n");
}
