import P from "parsimmon";

import Fn, {Property} from "./fn";
import Statement from "./statement";
import Assign from "./statement/assign";
import ClearLine from "./statement/command/clearline";
import AddChara from "./statement/command/addchara";
import AddDefChara from "./statement/command/adddefchara";
import AddVoidChara from "./statement/command/addvoidchara";
import Alignment from "./statement/command/alignment";
import Begin from "./statement/command/begin";
import Break from "./statement/command/break";
import Call from "./statement/command/call";
import CbgClear from "./statement/command/cbgclear";
import CbgClearButton from "./statement/command/cbgclearbutton";
import CbgRemoveBmap from "./statement/command/cbgremovebmap";
import ClearTextBox from "./statement/command/cleartextbox";
import Conditional from "./statement/command/conditional";
import Continue from "./statement/command/continue";
import CurrentAlign from "./statement/command/currentalign";
import CurrentRedraw from "./statement/command/currentredraw";
import DebugClear from "./statement/command/debugclear";
import DelAllChara from "./statement/command/delallchara";
import DrawLine from "./statement/command/drawline";
import DumpRand from "./statement/command/dumprand";
import FontBold from "./statement/command/fontbold";
import FontItalic from "./statement/command/fontitalic";
import FontRegular from "./statement/command/fontregular";
import For from "./statement/command/for";
import ForceWait from "./statement/command/forcewait";
import GetBgColor from "./statement/command/getbgcolor";
import GetBit from "./statement/command/getbit";
import GetColor from "./statement/command/getcolor";
import GetDefBgColor from "./statement/command/getdefbgcolor";
import GetDefColor from "./statement/command/getdefcolor";
import GetFocusColor from "./statement/command/getfocuscolor";
import GetFont from "./statement/command/getfont";
import GetMillisecond from "./statement/command/getmillisecond";
import GetSecond from "./statement/command/getsecond";
import GetStyle from "./statement/command/getstyle";
import GetTime from "./statement/command/gettime";
import Goto from "./statement/command/goto";
import Input from "./statement/command/input";
import InputS from "./statement/command/inputs";
import InitRand from "./statement/command/initrand";
import IsActive from "./statement/command/isactive";
import IsSkip from "./statement/command/isskip";
import LineIsEmpty from "./statement/command/lineisempty";
import LoadGame from "./statement/command/loadgame";
import LoadGlobal from "./statement/command/loadglobal";
import MouseSkip from "./statement/command/mouseskip";
import MouseX from "./statement/command/mousex";
import MouseY from "./statement/command/mousey";
import OutputLog from "./statement/command/outputlog";
import Print from "./statement/command/print";
import PrintCPerLine from "./statement/command/printcperline";
import PutForm from "./statement/command/putform";
import Repeat from "./statement/command/repeat";
import ResetBgColor from "./statement/command/resetbgcolor";
import ResetColor from "./statement/command/resetcolor";
import ResetData from "./statement/command/resetdata";
import ResetGlobal from "./statement/command/resetglobal";
import Return from "./statement/command/return";
import SaveGame from "./statement/command/savegame";
import SaveGlobal from "./statement/command/saveglobal";
import SetColor from "./statement/command/setcolor";
import SetFont from "./statement/command/setfont";
import StopCallTrain from "./statement/command/stopcalltrain";
import StrData from "./statement/command/strdata";
import StrLen from "./statement/command/strlen";
import Substring from "./statement/command/substring";
import Wait from "./statement/command/wait";
import WaitAnyKey from "./statement/command/waitanykey";
import Expr from "./statement/expr";
import BinaryIntExpr from "./statement/expr/binary-int";
import ConstIntExpr from "./statement/expr/const-int";
import ConstStringExpr from "./statement/expr/const-string";
import Form from "./statement/expr/form";
import InlineCall from "./statement/expr/inline-call";
import Variable from "./statement/expr/variable";
import OpAssign from "./statement/op-assign";
import Thunk from "./thunk";

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
const ConstUInt = P.alt(
	P.string("0b").then(P.regex(/0x[0-1]+/)).map((val) => parseInt(val, 2)),
	P.string("0x").then(P.regex(/0x[0-9a-fA-F]+/)).map((val) => parseInt(val, 16)),
	P.regex(/[0-9]+/).map((val) => parseInt(val, 10)),
);
const ConstInt = P.alt(
	P.string("-").then(ConstUInt).map((val) => -val),
	ConstUInt,
);
const ConstString = char("\"").many().tie().trim(P.string("\""));
const Identifier = P.noneOf(SPECIAL_CHAR.join("")).atLeast(1).tie();

function char(...exclude: string[]): P.Parser<string> {
	return P.alt(
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
}

function charSeq(...exclude: string[]): P.Parser<string> {
	return char(...exclude).atLeast(1).tie();
}

function argument<E>(sep: string, expr: P.Parser<E>, includeFirst = false): P.Parser<E[]> {
	if (includeFirst) {
		return P.seqMap(expr, P.string(sep).trim(WS0).then(expr).many(), (a, b) => [a, ...b]);
	} else {
		return P.string(sep).trim(WS0).then(expr).many();
	}
}

function leftAssociate<E, OP extends string>(
	op: OP[],
	subExpr: P.Parser<E>,
	associate: (op: OP, left: E, right: E) => E,
): P.Parser<E> {
	return P.seqMap(
		subExpr,
		P.seq(oneOf(...op).trim(WS0), subExpr).atLeast(1),
		(first, rest) => rest.reduce((acc, val) => associate(val[0], acc, val[1]), first),
	);
}

function asLine<T>(parser: P.Parser<T>, leadingSpace: boolean = true): P.Parser<T> {
	return (leadingSpace ? WS0 : P.string("")).then(parser).skip(EOL);
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
	IntExpr: Expr;
	StringExprL0: Expr;
	StringExpr: Expr;
	InlineCall: InlineCall;
	Form: Form;
	Label: string;
	Property: Property;
	PrintOType: Print["outType"];
	PrintAction: Print["action"];
	PlainCommand: Statement;
	Command: Statement;
	Assign: Assign;
	OpAssign: OpAssign;
	Statement: Statement;
	Thunk: Thunk;
	Function: Fn;
	Language: Fn[];
};

const language = P.createLanguage<LanguageSpec>({
	Variable: (r) => P.seqMap(
		Identifier,
		argument(":", P.alt(
			ConstInt.map((value) => new ConstIntExpr(value)),
			Identifier.map((name) => new Variable(name, [])),
			wrap("(", r.IntExpr, ")"),
		)),
		(name, index) => new Variable(name, index),
	),
	IntExprL0: (r) => P.alt(
		wrap("(", r.IntExpr, ")"),
		ConstInt.map((val) => new ConstIntExpr(val)),
		r.InlineCall,
		r.Variable,
	),
	IntExprL1: (r) => P.alt(
		leftAssociate(
			["*", "/", "%"],
			r.IntExprL0,
			(op, left, right) => new BinaryIntExpr(op, left, right),
		),
		r.IntExprL0,
	),
	IntExprL2: (r) => P.alt(
		leftAssociate(
			["+", "-"],
			r.IntExprL1,
			(op, left, right) => new BinaryIntExpr(op, left, right),
		),
		r.IntExprL1,
	),
	IntExprL3: (r) => P.alt(
		leftAssociate(
			["<=", "<", ">=", ">"],
			r.IntExprL2,
			(op, left, right) => new BinaryIntExpr(op, left, right),
		),
		r.IntExprL2,
	),
	IntExprL4: (r) => P.alt(
		leftAssociate(
			["==", "!="],
			r.IntExprL3,
			(op, left, right) => new BinaryIntExpr(op, left, right),
		),
		r.IntExprL3,
	),
	IntExprL5: (r) => P.alt(
		leftAssociate(
			["&", "|", "^"],
			r.IntExprL4,
			(op, left, right) => new BinaryIntExpr(op, left, right),
		),
		r.IntExprL4,
	),
	IntExprL6: (r) => P.alt(
		leftAssociate(
			["&&", "!&", "||", "!|", "^^"],
			r.IntExprL5,
			(op, left, right) => new BinaryIntExpr(op, left, right),
		),
		r.IntExprL5,
	),
	IntExpr: (r) => r.IntExprL6,
	StringExprL0: (r) => P.alt(
		ConstString.map((value) => new ConstStringExpr(value)),
		r.InlineCall,
		r.Variable,
	),
	StringExpr: (r) => r.StringExprL0,
	InlineCall: (r) => P.seqMap(
		Identifier,
		wrap("(", argument(",", P.alt(r.IntExpr, r.StringExpr), true), ")"),
		(name, arg) => new InlineCall(name, arg),
	),
	Form: (r) => P.alt(wrap("{", r.IntExpr, "}"), wrap("%", r.StringExpr, "%"), charSeq("{", "%"))
		.atLeast(1)
		.map((expr) => new Form(expr)),
	Label: () => asLine(P.string("$").then(Identifier), false),
	Property: () => asLine(P.string("#").then(P.alt(
		P.string("PRI").map(() => <const>({type: "first"})),
		P.string("DIM").skip(WS1).then(P.seqMap(
			Identifier,
			argument(",", ConstInt),
			(name, size) => <const>({type: "variable-int", name, size}),
		)),
		P.string("DIMS").skip(WS1).then(P.seqMap(
			Identifier,
			argument(",", ConstInt),
			(name, size) => <const>({type: "variable-string", name, size}),
		)),
	))),
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
				(out, action, val) => new Print(val, out, action),
			)),
			P.string("S").then(P.seqMap(
				r.PrintOType,
				r.PrintAction,
				WS1.then(r.StringExpr),
				(out, action, val) => new Print(val, out, action),
			)),
			P.string("FORM").then(P.seqMap(
				r.PrintOType,
				r.PrintAction,
				optional<Expr>(WS1.then(r.Form), new ConstStringExpr("")),
				(out, action, val) => new Print(val, out, action),
			)),
			// TODO: FORMS
			P.seqMap(
				r.PrintOType,
				r.PrintAction,
				optional(WS1.then(charSeq()), ""),
				(out, action, val) => new Print(new ConstStringExpr(val), out, action),
			),
		)),
		P.string("DRAWLINE").map(() => new DrawLine()),
		P.string("CLEARLINE").skip(WS1).then(r.IntExpr).map((expr) => new ClearLine(expr)),
		P.string("RESETCOLOR").map(() => new ResetColor()),
		P.string("RESETBGCOLOR").map(() => new ResetBgColor()),
		P.string("SETCOLOR").skip(WS1).then(P.alt(
			P.seqMap(
				ConstInt,
				P.string(",").trim(WS0).then(ConstInt),
				P.string(",").trim(WS0).then(ConstInt),
				(colorR, colorG, colorB) => new SetColor(new ConstIntExpr(
					colorR * 0x010000 +
					colorG * 0x000100 +
					colorB
				)),
			),
			r.IntExpr.map((expr) => new SetColor(expr)),
		)),
		P.string("GETCOLOR").map(() => new GetColor()),
		P.string("GETDEFCOLOR").map(() => new GetDefColor()),
		P.string("GETBGCOLOR").map(() => new GetBgColor()),
		P.string("GETDEFBGCOLOR").map(() => new GetDefBgColor()),
		P.string("GETFOCUSCOLOR").map(() => new GetFocusColor()),
		P.string("FONTBOLD").map(() => new FontBold()),
		P.string("FONTITALIC").map(() => new FontItalic()),
		P.string("FONTREGULAR").map(() => new FontRegular()),
		P.string("GETSTYLE").map(() => new GetStyle()),
		P.string("SETFONT").then(optional(WS1.then(r.StringExpr), undefined)).map(
			(font) => new SetFont(font),
		),
		P.string("GETFONT").map(() => new GetFont()),
		P.string("ALIGNMENT").skip(WS1).then(oneOf("LEFT", "CENTER", "RIGHT")).map((align) => {
			switch (align) {
				case "LEFT": return new Alignment("left");
				case "CENTER": return new Alignment("center");
				case "RIGHT": return new Alignment("right");
			}
		}),
		P.string("CURRENTALIGN").map(() => new CurrentAlign()),
		P.string("CURRENTREDRAW").map(() => new CurrentRedraw()),
		P.string("PRINTCPERLINE").map(() => new PrintCPerLine()),
		P.string("LINEISEMPTY").map(() => new LineIsEmpty()),
		P.string("ISSKIP").map(() => new IsSkip()),
		P.string("MOUSESKIP").map(() => new MouseSkip()),
		P.string("STRLEN").skip(WS1).then(charSeq()).map(
			(expr) => new StrLen(new ConstStringExpr(expr)),
		),
		P.string("STRLENS").skip(WS1).then(r.StringExpr).map((expr) => new StrLen(expr)),
		P.string("STRLENFORM").skip(WS1).then(r.Form).map((expr) => new StrLen(expr)),
		P.string("SUBSTRING").skip(WS1).then(P.seqMap(
			r.StringExpr.trim(WS0),
			P.string(",").then(r.IntExpr.trim(WS0)),
			P.string(",").then(r.IntExpr.trim(WS0)),
			(expr, start, end) => new Substring(expr, start, end),
		)),
		P.string("GETBIT").skip(WS1).then(P.seqMap(
			r.IntExpr.trim(WS0),
			P.string(",").then(r.IntExpr.trim(WS0)),
			(expr, index) => new GetBit(expr, index),
		)),
		P.string("ADDCHARA").skip(WS1).then(r.IntExpr).map((expr) => new AddChara([expr])),
		P.string("ADDDEFCHARA").map(() => new AddDefChara()),
		P.string("ADDVOIDCHARA").map(() => new AddVoidChara()),
		P.string("DELALLCHARA").map(() => new DelAllChara()),
		P.string("RESETDATA").map(() => new ResetData()),
		P.string("RESETGLOBAL").map(() => new ResetGlobal()),
		P.string("PUTFORM").skip(WS1).then(r.Form).map((expr) => new PutForm(expr)),
		P.string("SAVEGAME").map(() => new SaveGame()),
		P.string("LOADGAME").map(() => new LoadGame()),
		P.string("SAVEGLOBAL").map(() => new SaveGlobal()),
		P.string("LOADGLOBAL").map(() => new LoadGlobal()),
		P.string("OUTPUTLOG").map(() => new OutputLog()),
		P.string("GETTIME").map(() => new GetTime()),
		P.string("GETMILLISECOND").map(() => new GetMillisecond()),
		P.string("GETSECOND").map(() => new GetSecond()),
		P.string("FORCEWAIT").map(() => new ForceWait()),
		P.string("INPUT").then(WS1.then(ConstInt).fallback(undefined)).map(
			(def) => new Input(def),
		),
		P.string("INPUTS").skip(WS1).then(charSeq().fallback(undefined)).map(
			(def) => new InputS(def),
		),
		P.string("WAIT").map(() => new Wait()),
		P.string("WAITANYKEY").map(() => new WaitAnyKey()),
		P.string("BREAK").map(() => new Break()),
		P.string("CONTINUE").map(() => new Continue()),
		P.string("DUMPRAND").map(() => new DumpRand()),
		P.string("INITRAND").map(() => new InitRand()),
		P.string("BEGIN").skip(WS1).then(Identifier).map((target) => new Begin(target)),
		P.string("CALL").skip(WS1).then(P.seqMap(
			Identifier,
			P.alt(
				wrap("(", argument(",", P.alt(r.IntExpr, r.StringExpr), true), ")"),
				argument(",", P.alt(r.IntExpr, r.StringExpr)),
			),
			(target, arg) => new Call(target, arg),
		)),
		P.string("GOTO").skip(WS1).then(Identifier).map((target) => new Goto(target)),
		P.string("RETURN").skip(WS1).then(r.IntExpr).map((expr) => new Return(expr)),
		P.string("DEBUGCLEAR").map(() => new DebugClear()),
		P.string("MOUSEX").map(() => new MouseX()),
		P.string("MOUSEY").map(() => new MouseY()),
		P.string("ISACTIVE").map(() => new IsActive()),
		P.string("CBGCLEAR").map(() => new CbgClear()),
		P.string("CBGCLEARBUTTON").map(() => new CbgClearButton()),
		P.string("CBGREMOVEBMAP").map(() => new CbgRemoveBmap()),
		P.string("CLEARTEXTBOX").map(() => new ClearTextBox()),
		P.string("STRDATA").map(() => new StrData()),
		P.string("STOPCALLTRAIN").map(() => new StopCallTrain()),
	)),
	Command: (r) => P.alt(
		r.PlainCommand,
		P.seqMap(
			asLine(P.string("SIF").skip(WS1).then(r.IntExpr)),
			P.alt(r.PlainCommand, r.Assign, r.OpAssign),
			(cond, then) => new Conditional([[cond, new Thunk([then])]]),
		),
		P.seqMap(
			P.seq(asLine(P.string("IF").skip(WS1).then(r.IntExpr)), r.Thunk),
			P.seq(asLine(P.string("ELSEIF").skip(WS1).then(r.IntExpr)), r.Thunk).many(),
			optional(asLine(P.string("ELSE")).then(r.Thunk), new Thunk([])),
			asLine(P.string("ENDIF")),
			(ifStmt, elifStmt, elseStmt) => new Conditional([
				ifStmt,
				...elifStmt,
				[new ConstIntExpr(1), elseStmt],
			]),
		),
		P.seqMap(
			asLine(P.string("REPEAT").skip(WS1).then(r.IntExpr)),
			r.Thunk,
			asLine(P.string("REND")),
			(condition, thunk) => new Repeat(condition, thunk),
		),
		P.seqMap(
			asLine(P.string("FOR").skip(WS1).then(P.seq(
				r.Variable.trim(WS0),
				P.string(",").then(r.IntExpr.trim(WS0)),
				P.string(",").then(r.IntExpr.trim(WS0)),
			))),
			r.Thunk,
			asLine(P.string("NEXT")),
			([counter, start, end], thunk) => new For(counter, start, end, thunk),
		),
	),
	Assign: (r) => asLine(P.seqMap(
		r.Variable,
		P.string("=").trim(WS0),
		P.alt(r.IntExpr, r.Form).fallback(new Form([""])),
		(dest, _op, expr) => new Assign(dest, expr),
	)),
	OpAssign: (r) => asLine(P.seqMap(
		r.Variable,
		oneOf("*", "/", "%", "+", "-", "&", "|", "^").skip(P.string("=")).trim(WS0),
		r.IntExpr,
		(dest, op, expr) => new OpAssign(dest, op, expr),
	)),
	Statement: (r) => P.alt(r.Command, r.Assign, r.OpAssign),
	Thunk: (r) => P.alt(r.Label, r.Statement).many().map((statement) => new Thunk(statement)),
	Function: (r) => P.seqMap(
		asLine(P.seq(
			P.string("@").then(Identifier),
			argument(",", P.seq(
				r.Variable,
				P.string("=").trim(WS0).then(P.alt(ConstInt, ConstString)).fallback(0),
			)),
		), false),
		r.Property.many(),
		r.Thunk,
		([name, arg], property, thunk) => new Fn(name, arg, property, thunk),
	),
	Language: (r) => EOL.fallback("").then(r.Function.many()).skip(P.eof),
});

export default function parse(content: string): Fn[] {
	return language.Language.tryParse(content + "\n");
}
