import P from "parsimmon";

import Fn from "../fn";
import Statement from "../statement";
import Assign from "../statement/assign";
import OpAssign from "../statement/assign-op";
import StrAssign from "../statement/assign-str";
import ClearLine from "../statement/command/clearline";
import AddChara from "../statement/command/addchara";
import AddDefChara from "../statement/command/adddefchara";
import AddVoidChara from "../statement/command/addvoidchara";
import Alignment from "../statement/command/alignment";
import Bar from "../statement/command/bar";
import Begin from "../statement/command/begin";
import Break from "../statement/command/break";
import Call from "../statement/command/call";
import Case from "../statement/command/case";
import CbgClear from "../statement/command/cbgclear";
import CbgClearButton from "../statement/command/cbgclearbutton";
import CbgRemoveBmap from "../statement/command/cbgremovebmap";
import ClearTextBox from "../statement/command/cleartextbox";
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
import If from "../statement/command/if";
import Input from "../statement/command/input";
import InputS from "../statement/command/inputs";
import InitRand from "../statement/command/initrand";
import IsActive from "../statement/command/isactive";
import IsSkip from "../statement/command/isskip";
import Jump from "../statement/command/jump";
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
import Restart from "../statement/command/restart";
import Return from "../statement/command/return";
import SaveGame from "../statement/command/savegame";
import SaveGlobal from "../statement/command/saveglobal";
import SetColor from "../statement/command/setcolor";
import SetFont from "../statement/command/setfont";
import Split from "../statement/command/split";
import StopCallTrain from "../statement/command/stopcalltrain";
import StrData from "../statement/command/strdata";
import StrFind from "../statement/command/strfind";
import StrLen from "../statement/command/strlen";
import StrLenU from "../statement/command/strlenu";
import Substring from "../statement/command/substring";
import SubstringU from "../statement/command/substringu";
import Times from "../statement/command/times";
import TryCall from "../statement/command/trycall";
import TryGoto from "../statement/command/trygoto";
import TryJump from "../statement/command/tryjump";
import VarSet from "../statement/command/varset";
import Wait from "../statement/command/wait";
import WaitAnyKey from "../statement/command/waitanykey";
import While from "../statement/command/while";
import Expr from "../statement/expr";
import Const from "../statement/expr/const";
import Thunk from "../thunk";
import expr from "./expr";
import prop from "./property";
import * as U from "./util";

type LanguageSpec = {
	Label: string;
	PlainCommand: Statement;
	Command: Statement;
	Assign: Assign;
	StrAssign: Assign;
	OpAssign: OpAssign;
	Statement: Statement;
	Thunk: Thunk;
	Function: Fn;
	Language: Fn[];
};

function callArg<T>(target: P.Parser<T>): P.Parser<[T, Expr[]]> {
	const first = P.noneOf(",(;\r\n").many().tie().thru(U.nest(target));

	return P.alt(
		U.arg1R1(P.seq(first, U.wrap("(", U.sepBy(",", expr.Expr), ")"))),
		U.argNR1(first, expr.Expr).map(([f, ...r]) => [f, r]),
	);
}

export const language = P.createLanguage<LanguageSpec>({
	Label: () => U.asLine(P.string("$").then(U.Identifier)),
	PlainCommand: () => U.asLine(U.Identifier.chain<Statement>((instruction) => {
		switch (instruction.toUpperCase()) {
			case "PRINT": return U.arg1R0(U.charSeq()).map(
				(val) => new Print(new Const(val ?? ""), undefined, undefined),
			);
			case "PRINTK": return U.arg1R0(U.charSeq()).map(
				(val) => new Print(new Const(val ?? ""), "K", undefined),
			);
			case "PRINTD": return U.arg1R0(U.charSeq()).map(
				(val) => new Print(new Const(val ?? ""), "D", undefined)
			);
			case "PRINTL": return U.arg1R0(U.charSeq()).map(
				(val) => new Print(new Const(val ?? ""), undefined, "newline"),
			);
			case "PRINTKL": return U.arg1R0(U.charSeq()).map(
				(val) => new Print(new Const(val ?? ""), "K", "newline"),
			);
			case "PRINTDL": return U.arg1R0(U.charSeq()).map(
				(val) => new Print(new Const(val ?? ""), "D", "newline"),
			);
			case "PRINTW": return U.arg1R0(U.charSeq()).map(
				(val) => new Print(new Const(val ?? ""), undefined, "wait"),
			);
			case "PRINTKW": return U.arg1R0(U.charSeq()).map(
				(val) => new Print(new Const(val ?? ""), "K", "wait"),
			);
			case "PRINTDW": return U.arg1R0(U.charSeq()).map(
				(val) => new Print(new Const(val ?? ""), "D", "wait"),
			);
			case "PRINTV": return U.arg1R1(expr.Expr).map(
				(val) => new Print(val, undefined, undefined),
			);
			case "PRINTVK": return U.arg1R1(expr.Expr).map(
				(val) => new Print(val, "K", undefined),
			);
			case "PRINTVD": return U.arg1R1(expr.Expr).map(
				(val) => new Print(val, "D", undefined),
			);
			case "PRINTVL": return U.arg1R1(expr.Expr).map(
				(val) => new Print(val, undefined, "newline"),
			);
			case "PRINTVKL": return U.arg1R1(expr.Expr).map(
				(val) => new Print(val, "K", "newline"),
			);
			case "PRINTVDL": return U.arg1R1(expr.Expr).map(
				(val) => new Print(val, "D", "newline"),
			);
			case "PRINTVW": return U.arg1R1(expr.Expr).map(
				(val) => new Print(val, undefined, "wait"),
			);
			case "PRINTVKW": return U.arg1R1(expr.Expr).map(
				(val) => new Print(val, "K", "wait"),
			);
			case "PRINTVDW": return U.arg1R1(expr.Expr).map(
				(val) => new Print(val, "D", "wait"),
			);
			case "PRINTS": return U.arg1R1(expr.Expr).map(
				(val) => new Print(val, undefined, undefined),
			);
			case "PRINTSK": return U.arg1R1(expr.Expr).map(
				(val) => new Print(val, "K", undefined),
			);
			case "PRINTSD": return U.arg1R1(expr.Expr).map(
				(val) => new Print(val, "D", undefined),
			);
			case "PRINTSL": return U.arg1R1(expr.Expr).map(
				(val) => new Print(val, undefined, "newline"),
			);
			case "PRINTSKL": return U.arg1R1(expr.Expr).map(
				(val) => new Print(val, "K", "newline"),
			);
			case "PRINTSDL": return U.arg1R1(expr.Expr).map(
				(val) => new Print(val, "D", "newline"),
			);
			case "PRINTSW": return U.arg1R1(expr.Expr).map(
				(val) => new Print(val, undefined, "wait"),
			);
			case "PRINTSKW": return U.arg1R1(expr.Expr).map(
				(val) => new Print(val, "K", "wait"),
			);
			case "PRINTSDW": return U.arg1R1(expr.Expr).map(
				(val) => new Print(val, "D", "wait"),
			);
			case "PRINTFORM": return U.arg1R0(expr.Form).map(
				(val) => new Print(val ?? new Const(""), undefined, undefined),
			);
			case "PRINTFORMK": return U.arg1R0(expr.Form).map(
				(val) => new Print(val ?? new Const(""), "K", undefined),
			);
			case "PRINTFORMD": return U.arg1R0(expr.Form).map(
				(val) => new Print(val ?? new Const(""), "D", undefined),
			);
			case "PRINTFORML": return U.arg1R0(expr.Form).map(
				(val) => new Print(val ?? new Const(""), undefined, "newline")
			);
			case "PRINTFORMKL": return U.arg1R0(expr.Form).map(
				(val) => new Print(val ?? new Const(""), "K", "newline")
			);
			case "PRINTFORMDL": return U.arg1R0(expr.Form).map(
				(val) => new Print(val ?? new Const(""), "D", "newline")
			);
			case "PRINTFORMW": return U.arg1R0(expr.Form).map(
				(val) => new Print(val ?? new Const(""), undefined, "wait")
			);
			case "PRINTFORMKW": return U.arg1R0(expr.Form).map(
				(val) => new Print(val ?? new Const(""), "K", "wait")
			);
			case "PRINTFORMDW": return U.arg1R0(expr.Form).map(
				(val) => new Print(val ?? new Const(""), "D", "wait")
			);
			case "PRINTPLAIN": return U.arg1R0(U.charSeq()).map(
				(val) => new Print(new Const(val ?? "")),
			);
			case "PRINTPLAINFORM": return U.arg1R0(expr.Form).map(
				(val) => new Print(val ?? new Const("")),
			);
			case "TIMES": return U.arg2R2(expr.Variable, U.Float).map(
				([dest, value]) => new Times(dest, value),
			);
			case "DRAWLINE": return P.succeed(new DrawLine());
			case "CLEARLINE": return U.arg1R1(expr.Expr).map((e) => new ClearLine(e));
			case "RESETCOLOR": return P.succeed(new ResetColor());
			case "RESETBGCOLOR": return P.succeed(new ResetBgColor());
			case "SETCOLOR": return P.alt(
				U.arg3R3(U.Int, U.Int, U.Int).map(
					([colorR, colorG, colorB]) => {
						const rgb = colorR * 0x010000 + colorG * 0x000100 + colorB;
						return new SetColor(new Const(rgb));
					},
				),
				U.arg1R1(expr.Expr).map((e) => new SetColor(e)),
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
			case "SETFONT": return U.arg1R0(expr.Expr).map((font) => new SetFont(font));
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
			case "BAR": return U.arg3R3(expr.Expr, expr.Expr, expr.Expr).map(
				([value, max, length]) => new Bar(value, max, length),
			);
			case "BARL": return U.arg3R3(expr.Expr, expr.Expr, expr.Expr).map(
				([value, max, length]) => new Bar(value, max, length, true),
			);
			case "ISSKIP": return P.succeed(new IsSkip());
			case "MOUSESKIP": return P.succeed(new MouseSkip());
			case "STRLEN": return U.arg1R1(U.charSeq()).map(
				(e) => new StrLen(new Const(e)),
			);
			case "STRLENS": return U.arg1R1(expr.Expr).map((e) => new StrLen(e));
			case "STRLENFORM": return U.arg1R1(expr.Form).map((e) => new StrLen(e));
			case "STRLENU": return U.arg1R1(U.charSeq()).map(
				(e) => new StrLenU(new Const(e)),
			);
			case "STRLENSU": return U.arg1R1(expr.Expr).map((e) => new StrLenU(e));
			case "STRLENFORMU": return U.arg1R1(expr.Form).map((e) => new StrLenU(e));
			case "SUBSTRING": return U.arg3R3(expr.Expr, expr.Expr, expr.Expr).map(
				([e, start, end]) => new Substring(e, start, end),
			);
			case "SUBSTRINGU": return U.arg3R3(expr.Expr, expr.Expr, expr.Expr).map(
				([e, start, end]) => new SubstringU(e, start, end),
			);
			case "STRFIND": return U.arg2R2(expr.Expr, expr.Expr).map(
				([val, search]) => new StrFind(val, search),
			);
			case "STRFINDU": return U.arg2R2(expr.Expr, expr.Expr).map(
				([val, search]) => new StrFind(val, search, true),
			);
			case "SPLIT": return U.arg3R3(expr.Expr, expr.Expr, expr.Variable).map(
				([e, sep, dest]) => new Split(e, sep, dest),
			);
			case "GETBIT": return U.arg2R2(expr.Expr, expr.Expr).map(
				([e, index]) => new GetBit(e, index),
			);
			case "ADDCHARA": return U.argNR0(expr.Expr).map((e) => new AddChara(e));
			case "ADDDEFCHARA": return P.succeed(new AddDefChara());
			case "ADDVOIDCHARA": return P.succeed(new AddVoidChara());
			case "DELCHARA": return U.argNR0(expr.Expr).map((e) => new DelChara(e));
			case "DELALLCHARA": return P.succeed(new DelAllChara());
			case "RESETDATA": return P.succeed(new ResetData());
			case "RESETGLOBAL": return P.succeed(new ResetGlobal());
			case "VARSET": return U.arg2R1(expr.Variable, expr.Expr).map(
				([dest, value]) => new VarSet(dest, value),
			);
			case "PUTFORM": return U.arg1R1(expr.Form).map((e) => new PutForm(e));
			case "SAVEGAME": return P.succeed(new SaveGame());
			case "LOADGAME": return P.succeed(new LoadGame());
			case "SAVEGLOBAL": return P.succeed(new SaveGlobal());
			case "LOADGLOBAL": return P.succeed(new LoadGlobal());
			case "OUTPUTLOG": return P.succeed(new OutputLog());
			case "GETTIME": return P.succeed(new GetTime());
			case "GETMILLISECOND": return P.succeed(new GetMillisecond());
			case "GETSECOND": return P.succeed(new GetSecond());
			case "FORCEWAIT": return P.succeed(new ForceWait());
			case "INPUT": return U.arg1R0(U.Int).map((def) => new Input(def));
			case "INPUTS": return U.arg1R0(U.charSeq()).map((def) => new InputS(def));
			case "WAIT": return P.succeed(new Wait());
			case "WAITANYKEY": return P.succeed(new WaitAnyKey());
			case "BREAK": return P.succeed(new Break());
			case "CONTINUE": return P.succeed(new Continue());
			case "DUMPRAND": return P.succeed(new DumpRand());
			case "INITRAND": return P.succeed(new InitRand());
			case "BEGIN": return U.arg1R1(U.Identifier).map((target) => new Begin(target));
			case "CALL": return callArg(U.Identifier).map(
				([name, arg]) => new Call(new Const(name), arg),
			);
			case "CALLFORM": return callArg(expr.Form).map(([name, arg]) => new Call(name, arg));
			case "TRYCALL": return callArg(U.Identifier).map(
				([name, arg]) => new TryCall(new Const(name), arg),
			);
			case "TRYCALLFORM": return callArg(expr.Form).map(
				([name, arg]) => new TryCall(name, arg),
			);
			case "JUMP": return callArg(U.Identifier).map(
				([name, arg]) => new Jump(new Const(name), arg),
			);
			case "JUMPFORM": return callArg(expr.Form).map(([name, arg]) => new Jump(name, arg));
			case "TRYJUMP": return callArg(U.Identifier).map(
				([name, arg]) => new TryJump(new Const(name), arg),
			);
			case "TRYJUMPFORM": return callArg(expr.Form).map(
				([name, arg]) => new TryJump(name, arg),
			);
			case "GOTO": return U.arg1R1(U.Identifier).map(
				(target) => new Goto(new Const(target)),
			);
			case "GOTOFORM": return U.arg1R1(expr.Form).map((target) => new Goto(target));
			case "TRYGOTO": return U.arg1R1(U.Identifier).map(
				(target) => new TryGoto(new Const(target)),
			);
			case "TRYGOTOFORM": return U.arg1R1(expr.Form).map((target) => new TryGoto(target));
			case "RESTART": return P.succeed(new Restart());
			case "RETURN": return U.argNR1(expr.Expr, expr.Expr).map((e) => new Return(e));
			case "RETURNF": return U.argNR1(expr.Expr, expr.Expr).map((e) => new Return(e));
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
			U.asLine(P.string("SIF").then(U.arg1R1(expr.Expr))),
			r.Statement,
			(cond, then) => new If([[cond, new Thunk([then])]], new Thunk([])),
		),
		P.seqMap(
			P.seq(U.asLine(P.string("IF").then(U.arg1R1(expr.Expr))), r.Thunk),
			P.seq(U.asLine(P.string("ELSEIF").then(U.arg1R1(expr.Expr))), r.Thunk).many(),
			U.asLine(P.string("ELSE")).then(r.Thunk).fallback(new Thunk([])),
			U.asLine(P.string("ENDIF")),
			(ifStmt, elifStmt, elseStmt) => new If([ifStmt, ...elifStmt], elseStmt),
		),
		P.seqMap(
			U.asLine(P.string("SELECTCASE").then(U.arg1R1(expr.Expr))),
			P.seq(
				U.asLine(P.string("CASE").then(U.argNR0(P.alt(
					P.seqMap(U.Int, P.string("TO").trim(U.WS1).then(U.Int), (from, to) => ({
						type: "range",
						from,
						to,
					})),
					P.seqMap(
						P.string("IS").then(U.alt("<=", "<", ">=", ">").trim(U.WS0)),
						U.Int,
						(op, value) => ({type: "compare", op, value}),
					),
					U.Int.map((value) => ({type: "equal", value})),
					U.Str.map((value) => ({type: "equal", value})),
				)))),
				r.Thunk,
			).many(),
			U.asLine(P.string("CASEELSE")).then(r.Thunk).fallback(new Thunk([])),
			U.asLine(P.string("ENDSELECT")),
			(e, branch, def) => new Case(e, branch, def),
		),
		P.seqMap(
			U.asLine(P.string("REPEAT").then(U.arg1R1(expr.Expr))),
			r.Thunk,
			U.asLine(P.string("REND")),
			(condition, thunk) => new Repeat(condition, thunk),
		),
		P.seqMap(
			U.asLine(P.string("FOR").then(U.arg3R3(expr.Variable, expr.Expr, expr.Expr))),
			r.Thunk,
			U.asLine(P.string("NEXT")),
			([counter, start, end], thunk) => new For(counter, start, end, thunk),
		),
		P.seqMap(
			U.asLine(P.string("WHILE").then(U.arg1R1(expr.Expr))),
			r.Thunk,
			U.asLine(P.string("WEND")),
			(condition, thunk) => new While(condition, thunk),
		),
		r.PlainCommand,
	),
	Assign: () => U.asLine(P.seqMap(
		expr.Variable,
		P.string("=").trim(U.WS0).then(P.noneOf("\r\n;").many().tie()),
		(dest, e) => new Assign(dest, e),
	)),
	StrAssign: () => U.asLine(P.seqMap(
		expr.Variable,
		P.string("'=").trim(U.WS0).then(U.charSeq()),
		(dest, e) => new StrAssign(dest, e),
	)),
	OpAssign: () => U.asLine(P.alt(
		P.seqMap(
			expr.Variable,
			U.alt("*", "/", "%", "+", "-", "&", "|", "^").skip(P.string("=")).trim(U.WS0),
			expr.Expr,
			(dest, op, e) => new OpAssign(dest, op, e),
		),
		expr.Variable.skip(P.string("++")).map(
			(dest) => new OpAssign(dest, "+", new Const(1)),
		),
		expr.Variable.skip(P.string("--")).map(
			(dest) => new OpAssign(dest, "-", new Const(1)),
		),
	)),
	Statement: (r) => P.alt(r.Command, r.Assign, r.StrAssign, r.OpAssign),
	Thunk: (r) => P.alt(r.Label, r.Statement).many().map((statement) => new Thunk(statement)),
	Function: (r) => P.seqMap(
		U.asLine(P.string("@").then(P.lazy(() => {
			const arg = U.sepBy(",", P.alt(
				P.seqMap(
					expr.Variable,
					P.string("=").trim(U.WS0).then(U.charSeq(",", ")")),
					(dest, e) => new Assign(dest, e),
				),
				expr.Variable,
			));

			return P.seq(U.Identifier.skip(U.WS0), P.alt(
				U.wrap("(", arg, ")"),
				P.string(",").trim(U.WS0).then(arg),
				P.succeed([]),
			));
		}))),
		prop.many(),
		r.Thunk,
		([name, arg], property, thunk) => new Fn(name, arg, property, thunk),
	),
	Language: (r) => r.Function.many().skip(P.eof),
});

export default function parseERB(content: string): Fn[] {
	return language.Language.tryParse(content + "\n");
}
