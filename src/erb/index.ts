import P from "parsimmon";

import Fn, {Property} from "../fn";
import Statement from "../statement";
import Assign from "../statement/assign";
import ClearLine from "../statement/command/clearline";
import AddChara from "../statement/command/addchara";
import AddDefChara from "../statement/command/adddefchara";
import AddVoidChara from "../statement/command/addvoidchara";
import Alignment from "../statement/command/alignment";
import Begin from "../statement/command/begin";
import Break from "../statement/command/break";
import Call from "../statement/command/call";
import CbgClear from "../statement/command/cbgclear";
import CbgClearButton from "../statement/command/cbgclearbutton";
import CbgRemoveBmap from "../statement/command/cbgremovebmap";
import ClearTextBox from "../statement/command/cleartextbox";
import Conditional from "../statement/command/conditional";
import Continue from "../statement/command/continue";
import CurrentAlign from "../statement/command/currentalign";
import CurrentRedraw from "../statement/command/currentredraw";
import DebugClear from "../statement/command/debugclear";
import DelAllChara from "../statement/command/delallchara";
import DelChara from "../statement/command/delchara";
import DrawLine from "../statement/command/drawline";
import DumpRand from "../statement/command/dumprand";
import FontBold from "../statement/command/fontbold";
import FontItalic from "../statement/command/fontitalic";
import FontRegular from "../statement/command/fontregular";
import For from "../statement/command/for";
import ForceWait from "../statement/command/forcewait";
import GetBgColor from "../statement/command/getbgcolor";
import GetBit from "../statement/command/getbit";
import GetColor from "../statement/command/getcolor";
import GetDefBgColor from "../statement/command/getdefbgcolor";
import GetDefColor from "../statement/command/getdefcolor";
import GetFocusColor from "../statement/command/getfocuscolor";
import GetFont from "../statement/command/getfont";
import GetMillisecond from "../statement/command/getmillisecond";
import GetSecond from "../statement/command/getsecond";
import GetStyle from "../statement/command/getstyle";
import GetTime from "../statement/command/gettime";
import Goto from "../statement/command/goto";
import Input from "../statement/command/input";
import InputS from "../statement/command/inputs";
import InitRand from "../statement/command/initrand";
import IsActive from "../statement/command/isactive";
import IsSkip from "../statement/command/isskip";
import LineIsEmpty from "../statement/command/lineisempty";
import LoadGame from "../statement/command/loadgame";
import LoadGlobal from "../statement/command/loadglobal";
import MouseSkip from "../statement/command/mouseskip";
import MouseX from "../statement/command/mousex";
import MouseY from "../statement/command/mousey";
import OutputLog from "../statement/command/outputlog";
import Print from "../statement/command/print";
import PrintCPerLine from "../statement/command/printcperline";
import PutForm from "../statement/command/putform";
import Repeat from "../statement/command/repeat";
import ResetBgColor from "../statement/command/resetbgcolor";
import ResetColor from "../statement/command/resetcolor";
import ResetData from "../statement/command/resetdata";
import ResetGlobal from "../statement/command/resetglobal";
import Return from "../statement/command/return";
import SaveGame from "../statement/command/savegame";
import SaveGlobal from "../statement/command/saveglobal";
import SetColor from "../statement/command/setcolor";
import SetFont from "../statement/command/setfont";
import Split from "../statement/command/split";
import StopCallTrain from "../statement/command/stopcalltrain";
import StrData from "../statement/command/strdata";
import StrLen from "../statement/command/strlen";
import Substring from "../statement/command/substring";
import VarSet from "../statement/command/varset";
import Wait from "../statement/command/wait";
import WaitAnyKey from "../statement/command/waitanykey";
import While from "../statement/command/while";
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
import OpAssign from "../statement/op-assign";
import Thunk from "../thunk";
import * as U from "./util";

/* eslint-disable array-element-newline */
const SPECIAL_CHAR = [
	"+", "-", "*", "/", "%", "=", "!", "<", ">", "|", "&", "^", "~", "?", "#", "(", ")", "{", "}",
	"[", "]", ".", ",", ":", "$", "\\", "'", '"', "@", ";",
	// eslint-disable-next-line no-irregular-whitespace
	" ", "\t", "　",
	"\r", "\n",
];
/* eslint-enable array-element-newline */

const ConstUInt = P.alt(
	P.string("0b").then(P.regex(/0x[0-1]+/)).map((val) => parseInt(val, 2)),
	P.string("0x").then(P.regex(/0x[0-9a-fA-F]+/)).map((val) => parseInt(val, 16)),
	P.regex(/[0-9]+/).map((val) => parseInt(val, 10)),
);
const ConstInt = P.alt(
	P.string("-").then(ConstUInt).map((val) => -val),
	ConstUInt,
);
const ConstString = U.char("\"").many().tie().trim(P.string("\""));
const Identifier = P.noneOf(SPECIAL_CHAR.join("")).atLeast(1).tie();

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
	InlineCall: InlineCall;
	Form: Form;
	Label: string;
	Property: Property;
	PlainCommand: Statement;
	Command: Statement;
	RawAssign: Assign;
	Assign: Assign;
	OpAssign: OpAssign;
	Statement: Statement;
	Thunk: Thunk;
	Function: Fn;
	Language: Fn[];
};

const language = P.createLanguage<LanguageSpec>({
	Variable: (r) => U.sepBy(":", Identifier, P.alt(
		ConstInt.map((value) => new ConstIntExpr(value)),
		r.InlineCall,
		Identifier.map((name) => new Variable(name, [])),
		U.wrap("(", r.IntExpr, ")"),
	))
		.map(([name, ...index]) => new Variable(name, index)),
	IntExprL0: (r) => P.alt(
		U.wrap("(", r.IntExpr, ")"),
		ConstInt.map((val) => new ConstIntExpr(val)),
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
		ConstString.map((value) => new ConstStringExpr(value)),
		r.InlineCall,
		r.Variable,
	),
	StringExpr: (r) => r.StringExprL0,
	InlineCall: (r) => P.seqMap(
		Identifier,
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
	Label: () => U.asLine(P.string("$").then(Identifier)),
	Property: () => U.asLine(P.string("#").then(Identifier).chain<Property>((property) => {
		switch (property) {
			case "PRI": return P.succeed(<const>({type: "first"}));
			case "DIM": return U.argNR1(Identifier, ConstInt).map(([name, ...size]) => <const>({
				type: "variable-int",
				name,
				size,
			}));
			case "DIMS": return U.argNR1(Identifier, ConstInt).map(([name, ...size]) => <const>({
				type: "variable-string",
				name,
				size,
			}));
			case "LOCALSIZE": return U.arg1R1(ConstInt).map((size) => <const>({
				type: "localsize",
				size,
			}));
			case "LOCALSSIZE": return U.arg1R1(ConstInt).map((size) => <const>({
				type: "localssize",
				size,
			}));
			default: return P.fail(`${property} is not a valid property`);
		}
	})),
	PlainCommand: (r) => U.asLine(Identifier.chain<Statement>((instruction) => {
		switch (instruction) {
			case "PRINT": return U.arg1R0(U.charSeq()).map(
				(val) => new Print(new ConstStringExpr(val ?? ""), undefined, undefined),
			);
			case "PRINTK": return U.arg1R0(U.charSeq()).map(
				(val) => new Print(new ConstStringExpr(val ?? ""), "K", undefined),
			);
			case "PRINTD": return U.arg1R0(U.charSeq()).map(
				(val) => new Print(new ConstStringExpr(val ?? ""), "D", undefined)
			);
			case "PRINTL": return U.arg1R0(U.charSeq()).map(
				(val) => new Print(new ConstStringExpr(val ?? ""), undefined, "newline"),
			);
			case "PRINTKL": return U.arg1R0(U.charSeq()).map(
				(val) => new Print(new ConstStringExpr(val ?? ""), "K", "newline"),
			);
			case "PRINTDL": return U.arg1R0(U.charSeq()).map(
				(val) => new Print(new ConstStringExpr(val ?? ""), "D", "newline"),
			);
			case "PRINTW": return U.arg1R0(U.charSeq()).map(
				(val) => new Print(new ConstStringExpr(val ?? ""), undefined, "wait"),
			);
			case "PRINTKW": return U.arg1R0(U.charSeq()).map(
				(val) => new Print(new ConstStringExpr(val ?? ""), "K", "wait"),
			);
			case "PRINTDW": return U.arg1R0(U.charSeq()).map(
				(val) => new Print(new ConstStringExpr(val ?? ""), "D", "wait"),
			);
			case "PRINTV": return U.arg1R1(r.IntExpr).map(
				(val) => new Print(val, undefined, undefined),
			);
			case "PRINTVK": return U.arg1R1(r.IntExpr).map(
				(val) => new Print(val, "K", undefined),
			);
			case "PRINTVD": return U.arg1R1(r.IntExpr).map(
				(val) => new Print(val, "D", undefined),
			);
			case "PRINTVL": return U.arg1R1(r.IntExpr).map(
				(val) => new Print(val, undefined, "newline"),
			);
			case "PRINTVKL": return U.arg1R1(r.IntExpr).map(
				(val) => new Print(val, "K", "newline"),
			);
			case "PRINTVDL": return U.arg1R1(r.IntExpr).map(
				(val) => new Print(val, "D", "newline"),
			);
			case "PRINTVW": return U.arg1R1(r.IntExpr).map(
				(val) => new Print(val, undefined, "wait"),
			);
			case "PRINTVKW": return U.arg1R1(r.IntExpr).map(
				(val) => new Print(val, "K", "wait"),
			);
			case "PRINTVDW": return U.arg1R1(r.IntExpr).map(
				(val) => new Print(val, "D", "wait"),
			);
			case "PRINTS": return U.arg1R1(r.StringExpr).map(
				(val) => new Print(val, undefined, undefined),
			);
			case "PRINTSK": return U.arg1R1(r.StringExpr).map(
				(val) => new Print(val, "K", undefined),
			);
			case "PRINTSD": return U.arg1R1(r.StringExpr).map(
				(val) => new Print(val, "D", undefined),
			);
			case "PRINTSL": return U.arg1R1(r.StringExpr).map(
				(val) => new Print(val, undefined, "newline"),
			);
			case "PRINTSKL": return U.arg1R1(r.StringExpr).map(
				(val) => new Print(val, "K", "newline"),
			);
			case "PRINTSDL": return U.arg1R1(r.StringExpr).map(
				(val) => new Print(val, "D", "newline"),
			);
			case "PRINTSW": return U.arg1R1(r.StringExpr).map(
				(val) => new Print(val, undefined, "wait"),
			);
			case "PRINTSKW": return U.arg1R1(r.StringExpr).map(
				(val) => new Print(val, "K", "wait"),
			);
			case "PRINTSDW": return U.arg1R1(r.StringExpr).map(
				(val) => new Print(val, "D", "wait"),
			);
			case "PRINTFORM": return U.arg1R0(r.Form).map(
				(val) => new Print(val ?? new ConstStringExpr(""), undefined, undefined),
			);
			case "PRINTFORMK": return U.arg1R0(r.Form).map(
				(val) => new Print(val ?? new ConstStringExpr(""), "K", undefined),
			);
			case "PRINTFORMD": return U.arg1R0(r.Form).map(
				(val) => new Print(val ?? new ConstStringExpr(""), "D", undefined),
			);
			case "PRINTFORML": return U.arg1R0(r.Form).map(
				(val) => new Print(val ?? new ConstStringExpr(""), undefined, "newline")
			);
			case "PRINTFORMKL": return U.arg1R0(r.Form).map(
				(val) => new Print(val ?? new ConstStringExpr(""), "K", "newline")
			);
			case "PRINTFORMDL": return U.arg1R0(r.Form).map(
				(val) => new Print(val ?? new ConstStringExpr(""), "D", "newline")
			);
			case "PRINTFORMW": return U.arg1R0(r.Form).map(
				(val) => new Print(val ?? new ConstStringExpr(""), undefined, "wait")
			);
			case "PRINTFORMKW": return U.arg1R0(r.Form).map(
				(val) => new Print(val ?? new ConstStringExpr(""), "K", "wait")
			);
			case "PRINTFORMDW": return U.arg1R0(r.Form).map(
				(val) => new Print(val ?? new ConstStringExpr(""), "D", "wait")
			);
			case "DRAWLINE": return P.succeed(new DrawLine());
			case "CLEARLINE": return U.arg1R1(r.IntExpr).map((expr) => new ClearLine(expr));
			case "RESETCOLOR": return P.succeed(new ResetColor());
			case "RESETBGCOLOR": return P.succeed(new ResetBgColor());
			case "SETCOLOR": return P.alt(
				U.arg3R3(ConstInt, ConstInt, ConstInt).map(
					([colorR, colorG, colorB]) => {
						const rgb = colorR * 0x010000 + colorG * 0x000100 + colorB;
						return new SetColor(new ConstIntExpr(rgb));
					},
				),
				U.arg1R1(r.IntExpr).map((expr) => new SetColor(expr)),
			);
			case "GETCOLOR": return P.succeed(new GetColor());
			case "GETDEFCOLOR": return P.succeed(new GetDefColor());
			case "GETBGCOLOR": return P.succeed(new GetBgColor());
			case "GETDEFBGCOLOR": return P.succeed(new GetDefBgColor());
			case "GETFOCUSCOLOR": return P.succeed(new GetFocusColor());
			case "FONTBOLD": return P.succeed(new FontBold());
			case "FONTITALIC": return P.succeed(new FontItalic());
			case "FONTREGULAR": return P.succeed(new FontRegular());
			case "GETSTYLE": return P.succeed(new GetStyle());
			case "SETFONT": return U.arg1R0(r.StringExpr).map((font) => new SetFont(font));
			case "GETFONT": return P.succeed(new GetFont());
			case "ALIGNMENT": return U.arg1R1(U.alt("LEFT", "CENTER", "RIGHT")).map((align) => {
				switch (align) {
					case "LEFT": return new Alignment("left");
					case "CENTER": return new Alignment("center");
					case "RIGHT": return new Alignment("right");
				}
			});
			case "CURRENTALIGN": return P.succeed(new CurrentAlign());
			case "CURRENTREDRAW": return P.succeed(new CurrentRedraw());
			case "PRINTCPERLINE": return P.succeed(new PrintCPerLine());
			case "LINEISEMPTY": return P.succeed(new LineIsEmpty());
			case "ISSKIP": return P.succeed(new IsSkip());
			case "MOUSESKIP": return P.succeed(new MouseSkip());
			case "STRLEN": return U.arg1R1(U.charSeq()).map(
				(expr) => new StrLen(new ConstStringExpr(expr)),
			);
			case "STRLENS": return U.arg1R1(r.StringExpr).map((expr) => new StrLen(expr));
			case "STRLENFORM": return U.arg1R1(r.Form).map((expr) => new StrLen(expr));
			case "SUBSTRING": return U.arg3R3(r.StringExpr, r.IntExpr, r.IntExpr).map(
				([expr, start, end]) => new Substring(expr, start, end),
			);
			case "SPLIT": return U.arg3R3(r.StringExpr, r.StringExpr, r.Variable).map(
				([expr, sep, dest]) => new Split(expr, sep, dest),
			);
			case "GETBIT": return U.arg2R2(r.IntExpr, r.IntExpr).map(
				([expr, index]) => new GetBit(expr, index),
			);
			case "ADDCHARA": return U.argNR0(r.IntExpr).map((exprList) => new AddChara(exprList));
			case "ADDDEFCHARA": return P.succeed(new AddDefChara());
			case "ADDVOIDCHARA": return P.succeed(new AddVoidChara());
			case "DELCHARA": return U.argNR0(r.IntExpr).map((exprList) => new DelChara(exprList));
			case "DELALLCHARA": return P.succeed(new DelAllChara());
			case "RESETDATA": return P.succeed(new ResetData());
			case "RESETGLOBAL": return P.succeed(new ResetGlobal());
			case "VARSET": return U.arg2R2(r.Variable, P.alt(r.IntExpr, r.StringExpr)).map(
				([dest, value]) => new VarSet(dest, value),
			);
			case "PUTFORM": return U.arg1R1(r.Form).map((expr) => new PutForm(expr));
			case "SAVEGAME": return P.succeed(new SaveGame());
			case "LOADGAME": return P.succeed(new LoadGame());
			case "SAVEGLOBAL": return P.succeed(new SaveGlobal());
			case "LOADGLOBAL": return P.succeed(new LoadGlobal());
			case "OUTPUTLOG": return P.succeed(new OutputLog());
			case "GETTIME": return P.succeed(new GetTime());
			case "GETMILLISECOND": return P.succeed(new GetMillisecond());
			case "GETSECOND": return P.succeed(new GetSecond());
			case "FORCEWAIT": return P.succeed(new ForceWait());
			case "INPUT": return U.arg1R0(ConstInt).map((def) => new Input(def));
			case "INPUTS": return U.arg1R0(U.charSeq()).map((def) => new InputS(def));
			case "WAIT": return P.succeed(new Wait());
			case "WAITANYKEY": return P.succeed(new WaitAnyKey());
			case "BREAK": return P.succeed(new Break());
			case "CONTINUE": return P.succeed(new Continue());
			case "DUMPRAND": return P.succeed(new DumpRand());
			case "INITRAND": return P.succeed(new InitRand());
			case "BEGIN": return U.arg1R1(Identifier).map((target) => new Begin(target));
			case "CALL": return P.alt(
				U.arg1R1(r.InlineCall).map(
					(parsed) => new Call(parsed.name, parsed.arg),
				),
				U.argNR1(Identifier, P.alt(r.IntExpr, r.StringExpr)).map(
					([target, ...arg]) => new Call(target, arg),
				),
			);
			case "GOTO": return U.arg1R1(Identifier).map((target) => new Goto(target));
			case "RETURN": return U.arg1R1(r.IntExpr).map((expr) => new Return(expr));
			case "DEBUGCLEAR": return P.succeed(new DebugClear());
			case "MOUSEX": return P.succeed(new MouseX());
			case "MOUSEY": return P.succeed(new MouseY());
			case "ISACTIVE": return P.succeed(new IsActive());
			case "CBGCLEAR": return P.succeed(new CbgClear());
			case "CBGCLEARBUTTON": return P.succeed(new CbgClearButton());
			case "CBGREMOVEBMAP": return P.succeed(new CbgRemoveBmap());
			case "CLEARTEXTBOX": return P.succeed(new ClearTextBox());
			case "STRDATA": return P.succeed(new StrData());
			case "STOPCALLTRAIN": return P.succeed(new StopCallTrain());
			default: return P.fail("Valid instruction");
		}
	})),
	Command: (r) => P.alt(
		P.seqMap(
			U.asLine(P.string("SIF").then(U.arg1R1(r.IntExpr))),
			r.Statement,
			(cond, then) => new Conditional([[cond, new Thunk([then])]]),
		),
		P.seqMap(
			P.seq(U.asLine(P.string("IF").then(U.arg1R1(r.IntExpr))), r.Thunk),
			P.seq(U.asLine(P.string("ELSEIF").then(U.arg1R1(r.IntExpr))), r.Thunk).many(),
			U.asLine(P.string("ELSE")).then(r.Thunk).fallback(new Thunk([])),
			U.asLine(P.string("ENDIF")),
			(ifStmt, elifStmt, elseStmt) => new Conditional([
				ifStmt,
				...elifStmt,
				[new ConstIntExpr(1), elseStmt],
			]),
		),
		P.seqMap(
			U.asLine(P.string("REPEAT").then(U.arg1R1(r.IntExpr))),
			r.Thunk,
			U.asLine(P.string("REND")),
			(condition, thunk) => new Repeat(condition, thunk),
		),
		P.seqMap(
			U.asLine(P.string("FOR").then(U.arg3R3(r.Variable, r.IntExpr, r.IntExpr))),
			r.Thunk,
			U.asLine(P.string("NEXT")),
			([counter, start, end], thunk) => new For(counter, start, end, thunk),
		),
		P.seqMap(
			U.asLine(P.string("WHILE").then(U.arg1R1(r.IntExpr))),
			r.Thunk,
			U.asLine(P.string("WEND")),
			(condition, thunk) => new While(condition, thunk),
		),
		r.PlainCommand,
	),
	RawAssign: (r) => P.seqMap(
		r.Variable,
		P.string("=").trim(U.WS0),
		P.alt(r.IntExpr, r.Form).fallback(new Form([{value: ""}])),
		(dest, _op, expr) => new Assign(dest, expr),
	),
	Assign: (r) => U.asLine(r.RawAssign),
	OpAssign: (r) => U.asLine(P.alt(
		P.seqMap(
			r.Variable,
			U.alt("*", "/", "%", "+", "-", "&", "|", "^").skip(P.string("=")).trim(U.WS0),
			r.IntExpr,
			(dest, op, expr) => new OpAssign(dest, op, expr),
		),
		r.Variable.skip(P.string("++")).map(
			(dest) => new OpAssign(dest, "+", new ConstIntExpr(1)),
		),
		r.Variable.skip(P.string("--")).map(
			(dest) => new OpAssign(dest, "-", new ConstIntExpr(1)),
		),
	)),
	Statement: (r) => P.alt(r.Command, r.Assign, r.OpAssign),
	Thunk: (r) => P.alt(r.Label, r.Statement).many().map((statement) => new Thunk(statement)),
	Function: (r) => P.seqMap(
		U.asLine(P.string("@").then(P.alt(
			P.seq(Identifier, U.wrap("(", U.sepBy(",", P.alt(r.RawAssign, r.Variable)), ")")),
			U.sepBy(",", Identifier, P.alt(r.RawAssign, r.Variable)).map(
				([name, ...arg]) => [name, arg] as [string, any[]],
			),
		))),
		r.Property.many(),
		r.Thunk,
		([name, arg], property, thunk) => new Fn(name, arg, property, thunk),
	),
	Language: (r) => r.Function.many().skip(P.eof),
});

export default function parseERB(content: string): Fn[] {
	return language.Language.tryParse(content + "\n");
}
