import P from "parsimmon";

import * as color from "../color";
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
import BarStr from "../statement/command/barstr";
import Begin from "../statement/command/begin";
import Break from "../statement/command/break";
import Call from "../statement/command/call";
import Case from "../statement/command/case";
import CbgClear from "../statement/command/cbgclear";
import CbgClearButton from "../statement/command/cbgclearbutton";
import CbgRemoveBmap from "../statement/command/cbgremovebmap";
import ClearBit from "../statement/command/clearbit";
import ClearTextBox from "../statement/command/cleartextbox";
import Continue from "../statement/command/continue";
import CurrentAlign from "../statement/command/currentalign";
import CurrentRedraw from "../statement/command/currentredraw";
import DebugClear from "../statement/command/debugclear";
import DelAllChara from "../statement/command/delallchara";
import DelChara from "../statement/command/delchara";
import DoWhile from "../statement/command/dowhile";
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
import InvertBit from "../statement/command/invertbit";
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
import PrintButton from "../statement/command/printbutton";
import PrintCPerLine from "../statement/command/printcperline";
import PrintData from "../statement/command/printdata";
import PrintPalam from "../statement/command/print_palam";
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
import SetBit from "../statement/command/setbit";
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
import Throw from "../statement/command/throw";
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
		U.arg1R1(P.seq(first, U.wrap("(", U.sepBy0(",", expr.Expr), ")"))),
		U.argNR1(first, expr.Expr).map(([f, ...r]) => [f, r]),
	);
}

export const language = P.createLanguage<LanguageSpec>({
	Label: () => U.asLine(P.string("$").then(U.Identifier)),
	Command: (r) => U.Identifier.chain<Statement>((instruction) => {
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
			// TODO: Use PrintC
			case "PRINTC": return U.arg1R0(U.charSeq0()).map(
				(val) => new Print(new Const(val ?? ""), undefined, undefined)
			);
			case "PRINTLC": return U.arg1R0(U.charSeq0()).map(
				(val) => new Print(new Const(val ?? ""), undefined, undefined)
			);
			case "PRINTFORMC": return U.arg1R0(U.charSeq0()).map(
				(val) => new Print(new Const(val ?? ""), undefined, undefined)
			);
			case "PRINTFORMLC": return U.arg1R0(U.charSeq0()).map(
				(val) => new Print(new Const(val ?? ""), undefined, undefined)
			);
			case "PRINTBUTTON": return U.arg2R2(expr.Expr, expr.Expr).map(
				([text, value]) => new PrintButton(text, value),
			);
			case "PRINTBUTTONC": return U.arg2R2(expr.Expr, expr.Expr).map(
				([text, value]) => new PrintButton(text, value),
			);
			case "PRINTBUTTONLC": return U.arg2R2(expr.Expr, expr.Expr).map(
				([text, value]) => new PrintButton(text, value),
			);
			case "PRINTPLAIN": return U.arg1R0(U.charSeq()).map(
				(val) => new Print(new Const(val ?? "")),
			);
			case "PRINTPLAINFORM": return U.arg1R0(expr.Form).map(
				(val) => new Print(val ?? new Const("")),
			);
			case "PRINT_PALAM": return U.arg1R1(expr.Expr).map(
				(index) => new PrintPalam(index),
			);
			case "TIMES": return U.arg2R2(expr.Variable, U.Float).map(
				([dest, value]) => new Times(dest, value),
			);
			case "DRAWLINE": return U.arg0R0().map(() => new DrawLine());
			case "CUSTOMDRAWLINE": return U.arg1R1(U.charSeq()).map(
				(e) => new DrawLine(new Const(e)),
			);
			case "DRAWLINEFORM": return U.arg1R1(expr.Form).map((e) => new DrawLine(e));
			case "CLEARLINE": return U.arg1R1(expr.Expr).map((e) => new ClearLine(e));
			case "RESETCOLOR": return U.arg0R0().map(() => new ResetColor());
			case "RESETBGCOLOR": return U.arg0R0().map(() => new ResetBgColor());
			case "SETCOLOR": return P.alt(
				U.arg3R3(U.UInt, U.UInt, U.UInt).map(
					([colorR, colorG, colorB]) => {
						const rgb = color.toHex({r: colorR, g: colorG, b: colorB});
						return new SetColor(new Const(rgb));
					},
				),
				U.arg1R1(expr.Expr).map((e) => new SetColor(e)),
			);
			case "GETCOLOR": return U.arg0R0().map(() => new GetColor());
			case "GETDEFCOLOR": return U.arg0R0().map(() => new GetDefColor());
			case "GETBGCOLOR": return U.arg0R0().map(() => new GetBgColor());
			case "GETDEFBGCOLOR": return U.arg0R0().map(() => new GetDefBgColor());
			case "GETFOCUSCOLOR": return U.arg0R0().map(() => new GetFocusColor());
			case "FONTBOLD": return U.arg0R0().map(() => new FontBold());
			case "FONTITALIC": return U.arg0R0().map(() => new FontItalic());
			case "FONTREGULAR": return U.arg0R0().map(() => new FontRegular());
			case "GETSTYLE": return U.arg0R0().map(() => new GetStyle());
			case "SETFONT": return U.arg1R0(expr.Expr).map((font) => new SetFont(font));
			case "GETFONT": return U.arg0R0().map(() => new GetFont());
			case "ALIGNMENT": return U.arg1R1(U.alt("LEFT", "CENTER", "RIGHT")).map((align) => {
				switch (align) {
					case "LEFT": return new Alignment("left");
					case "CENTER": return new Alignment("center");
					case "RIGHT": return new Alignment("right");
				}
			});
			case "CURRENTALIGN": return U.arg0R0().map(() => new CurrentAlign());
			case "CURRENTREDRAW": return U.arg0R0().map(() => new CurrentRedraw());
			case "PRINTCPERLINE": return U.arg0R0().map(() => new PrintCPerLine());
			case "LINEISEMPTY": return U.arg0R0().map(() => new LineIsEmpty());
			case "BAR": return U.arg3R3(expr.Expr, expr.Expr, expr.Expr).map(
				([value, max, length]) => new Bar(value, max, length),
			);
			case "BARL": return U.arg3R3(expr.Expr, expr.Expr, expr.Expr).map(
				([value, max, length]) => new Bar(value, max, length, true),
			);
			case "BARSTR": return U.arg3R3(expr.Expr, expr.Expr, expr.Expr).map(
				([value, max, length]) => new BarStr(value, max, length),
			);
			case "ISSKIP": return U.arg0R0().map(() => new IsSkip());
			case "MOUSESKIP": return U.arg0R0().map(() => new MouseSkip());
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
			case "SETBIT": return U.argNR1(expr.Variable, expr.Expr).map(
				([v, ...bits]) => new SetBit(v, bits),
			);
			case "CLEARBIT": return U.argNR1(expr.Variable, expr.Expr).map(
				([v, ...bits]) => new ClearBit(v, bits),
			);
			case "INVERTBIT": return U.argNR1(expr.Variable, expr.Expr).map(
				([v, ...bits]) => new InvertBit(v, bits),
			);
			case "ADDCHARA": return U.argNR0(expr.Expr).map((e) => new AddChara(e));
			case "ADDDEFCHARA": return U.arg0R0().map(() => new AddDefChara());
			case "ADDVOIDCHARA": return U.arg0R0().map(() => new AddVoidChara());
			case "DELCHARA": return U.argNR0(expr.Expr).map((e) => new DelChara(e));
			case "DELALLCHARA": return U.arg0R0().map(() => new DelAllChara());
			case "RESETDATA": return U.arg0R0().map(() => new ResetData());
			case "RESETGLOBAL": return U.arg0R0().map(() => new ResetGlobal());
			case "VARSET": return U.arg2R1(expr.Variable, expr.Expr).map(
				([dest, value]) => new VarSet(dest, value),
			);
			case "PUTFORM": return U.arg1R1(expr.Form).map((e) => new PutForm(e));
			case "SAVEGAME": return U.arg0R0().map(() => new SaveGame());
			case "LOADGAME": return U.arg0R0().map(() => new LoadGame());
			case "SAVEGLOBAL": return U.arg0R0().map(() => new SaveGlobal());
			case "LOADGLOBAL": return U.arg0R0().map(() => new LoadGlobal());
			case "OUTPUTLOG": return U.arg0R0().map(() => new OutputLog());
			case "GETTIME": return U.arg0R0().map(() => new GetTime());
			case "GETMILLISECOND": return U.arg0R0().map(() => new GetMillisecond());
			case "GETSECOND": return U.arg0R0().map(() => new GetSecond());
			case "FORCEWAIT": return U.arg0R0().map(() => new ForceWait());
			case "INPUT": return U.arg1R0(U.Int).map((def) => new Input(def));
			case "INPUTS": return U.arg1R0(U.charSeq()).map((def) => new InputS(def));
			case "WAIT": return U.arg0R0().map(() => new Wait());
			case "WAITANYKEY": return U.arg0R0().map(() => new WaitAnyKey());
			case "BREAK": return U.arg0R0().map(() => new Break());
			case "CONTINUE": return U.arg0R0().map(() => new Continue());
			case "DUMPRAND": return U.arg0R0().map(() => new DumpRand());
			case "INITRAND": return U.arg0R0().map(() => new InitRand());
			case "BEGIN": return U.arg1R1(U.Identifier).map((target) => new Begin(target));
			case "THROW": return U.arg1R1(expr.Form).map((e) => new Throw(e));
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
			case "RESTART": return U.arg0R0().map(() => new Restart());
			case "RETURN": return U.argNR0(expr.Expr).map((e) => new Return(e));
			case "RETURNF": return U.arg1R1(expr.Expr).map((e) => new Return([e]));
			case "DEBUGCLEAR": return U.arg0R0().map(() => new DebugClear());
			case "MOUSEX": return U.arg0R0().map(() => new MouseX());
			case "MOUSEY": return U.arg0R0().map(() => new MouseY());
			case "ISACTIVE": return U.arg0R0().map(() => new IsActive());
			case "CBGCLEAR": return U.arg0R0().map(() => new CbgClear());
			case "CBGCLEARBUTTON": return U.arg0R0().map(() => new CbgClearButton());
			case "CBGREMOVEBMAP": return U.arg0R0().map(() => new CbgRemoveBmap());
			case "CLEARTEXTBOX": return U.arg0R0().map(() => new ClearTextBox());
			case "STRDATA": return U.arg0R0().map(() => new StrData());
			case "STOPCALLTRAIN": return U.arg0R0().map(() => new StopCallTrain());
			case "PRINTDATA": {
				const dataParser: P.Parser<Expr> = P.lazy(() => P.alt(
					P.string("DATA").then(U.arg1R1(U.charSeq())).map((str) => new Const(str)),
					P.string("DATAFORM").then(U.arg1R1(expr.Form)),
				));

				return P.seqMap(
					U.arg0R0(),
					P.alt(
						dataParser,
						P.seqMap(
							P.string("DATALIST").then(U.arg0R0()),
							dataParser.many(),
							P.string("ENDLIST").then(U.arg0R0()),
							(_, data) => data,
						),
					).many(),
					P.string("ENDDATA").then(U.arg0R0()),
					(_, data) => new PrintData(data),
				);
			}
			case "SIF": return P.seqMap(
				U.arg1R1(expr.Expr),
				r.Statement,
				(cond, then) => new If([[cond, new Thunk([then])]], new Thunk([])),
			);
			case "IF": return P.seqMap(
				P.seq(U.arg1R1(expr.Expr), r.Thunk),
				P.seq(P.string("ELSEIF").then(U.arg1R1(expr.Expr)), r.Thunk).many(),
				U.asLine(P.string("ELSE")).then(r.Thunk).fallback(new Thunk([])),
				U.asLine(P.string("ENDIF")),
				(ifStmt, elifStmt, elseStmt) => new If([ifStmt, ...elifStmt], elseStmt),
			);
			case "SELECTCASE": return P.seqMap(
				U.arg1R1(expr.Expr),
				P.seq(
					P.string("CASE").then(U.argNR0(P.alt(
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
					))),
					r.Thunk,
				).many(),
				U.asLine(P.string("CASEELSE")).then(r.Thunk).fallback(new Thunk([])),
				U.asLine(P.string("ENDSELECT")),
				(e, branch, def) => new Case(e, branch, def),
			);
			case "REPEAT": return P.seqMap(
				U.arg1R1(expr.Expr),
				r.Thunk,
				U.asLine(P.string("REND")),
				(condition, thunk) => new Repeat(condition, thunk),
			);
			case "FOR": return P.seqMap(
				U.arg3R3(expr.Variable, expr.Expr, expr.Expr),
				r.Thunk,
				U.asLine(P.string("NEXT")),
				([counter, start, end], thunk) => new For(counter, start, end, thunk),
			);
			case "WHILE": return P.seqMap(
				U.arg1R1(expr.Expr),
				r.Thunk,
				U.asLine(P.string("WEND")),
				(condition, thunk) => new While(condition, thunk),
			);
			case "DO": return P.seqMap(
				U.arg0R0(),
				r.Thunk,
				P.string("LOOP").then(U.arg1R1(expr.Expr)),
				(_, thunk, condition) => new DoWhile(condition, thunk),
			);
			default: return P.fail("Valid instruction");
		}
	}),
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
		expr.Variable.skip(U.WS0).skip(P.string("++")).map(
			(dest) => new OpAssign(dest, "+", new Const(1)),
		),
		expr.Variable.skip(U.WS0).skip(P.string("--")).map(
			(dest) => new OpAssign(dest, "-", new Const(1)),
		),
	)),
	Statement: (r) => P.alt(r.Command, r.Assign, r.StrAssign, r.OpAssign),
	Thunk: (r) => P.alt(r.Label, r.Statement).many().map((statement) => new Thunk(statement)),
	Function: (r) => P.seqMap(
		U.asLine(P.string("@").then(P.lazy(() => {
			const arg = U.sepBy0(",", P.alt(
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
	// Convert \r\n and \r to \n
	const normalized = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

	// Strip comments
	const stripped = normalized.replace(/;.*/g, "");

	// Remove [SKIPSTART]~[SKIPEND] lines
	const processed = stripped.replace(/\[SKIPSTART\](.|\n)*?\[SKIPEND\]/g, "");

	// Trim leading/trailing whitespaces
	const trimmed = processed.replace(/^( |\t)+/mg, "").replace(/( |\t)+$/mg, "");

	// Remove leading empty lines
	const filtered = trimmed.replace(/^\n*/, "");

	return language.Language.tryParse(filtered + "\n");
}
