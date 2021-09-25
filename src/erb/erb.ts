import P from "parsimmon";

import Fn from "../fn";
import Statement from "../statement";
import Assign from "../statement/assign";
import ClearLine from "../statement/command/clearline";
import AddChara from "../statement/command/addchara";
import AddDefChara from "../statement/command/adddefchara";
import AddVoidChara from "../statement/command/addvoidchara";
import Alignment from "../statement/command/alignment";
import ArrayShift from "../statement/command/arrayshift";
import Bar from "../statement/command/bar";
import BarStr from "../statement/command/barstr";
import Begin from "../statement/command/begin";
import Break from "../statement/command/break";
import Call from "../statement/command/call";
import CallF from "../statement/command/callf";
import CallForm from "../statement/command/callform";
import CallFormF from "../statement/command/callformf";
import CallTrain from "../statement/command/calltrain";
import Case from "../statement/command/case";
import CbgClear from "../statement/command/cbgclear";
import CbgClearButton from "../statement/command/cbgclearbutton";
import CbgRemoveBmap from "../statement/command/cbgremovebmap";
import ChkData from "../statement/command/chkdata";
import ClearBit from "../statement/command/clearbit";
import ClearTextBox from "../statement/command/cleartextbox";
import Continue from "../statement/command/continue";
import CurrentAlign from "../statement/command/currentalign";
import CurrentRedraw from "../statement/command/currentredraw";
import CustomDrawLine from "../statement/command/customdrawline";
import DebugClear from "../statement/command/debugclear";
import DelAllChara from "../statement/command/delallchara";
import DelChara from "../statement/command/delchara";
import DelData from "../statement/command/deldata";
import DoWhile from "../statement/command/dowhile";
import DrawLine from "../statement/command/drawline";
import DrawLineForm from "../statement/command/drawlineform";
import DumpRand from "../statement/command/dumprand";
import ExistCSV from "../statement/command/existcsv";
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
import GotoForm from "../statement/command/gotoform";
import If from "../statement/command/if";
import Input from "../statement/command/input";
import InputS from "../statement/command/inputs";
import InitRand from "../statement/command/initrand";
import InvertBit from "../statement/command/invertbit";
import IsActive from "../statement/command/isactive";
import IsSkip from "../statement/command/isskip";
import Jump from "../statement/command/jump";
import JumpForm from "../statement/command/jumpform";
import LineIsEmpty from "../statement/command/lineisempty";
import LoadData from "../statement/command/loaddata";
import LoadGame from "../statement/command/loadgame";
import LoadGlobal from "../statement/command/loadglobal";
import MouseSkip from "../statement/command/mouseskip";
import MouseX from "../statement/command/mousex";
import MouseY from "../statement/command/mousey";
import OutputLog from "../statement/command/outputlog";
import Print from "../statement/command/print";
import PrintButton from "../statement/command/printbutton";
import PrintC from "../statement/command/printc";
import PrintCPerLine from "../statement/command/printcperline";
import PrintData from "../statement/command/printdata";
import PrintForm from "../statement/command/printform";
import PrintFormC from "../statement/command/printformc";
import PrintPalam from "../statement/command/print_palam";
import PrintPlain from "../statement/command/printplain";
import PrintS from "../statement/command/prints";
import PrintShopItem from "../statement/command/print_shopitem";
import PrintV from "../statement/command/printv";
import PutForm from "../statement/command/putform";
import Quit from "../statement/command/quit";
import Randomize from "../statement/command/randomize";
import Redraw from "../statement/command/redraw";
import Repeat from "../statement/command/repeat";
import ResetBgColor from "../statement/command/resetbgcolor";
import ResetColor from "../statement/command/resetcolor";
import ResetData from "../statement/command/resetdata";
import ResetGlobal from "../statement/command/resetglobal";
import Restart from "../statement/command/restart";
import Return from "../statement/command/return";
import ReturnF from "../statement/command/returnf";
import ReuseLastLine from "../statement/command/reuselastline";
import SaveData from "../statement/command/savedata";
import SaveGame from "../statement/command/savegame";
import SaveGlobal from "../statement/command/saveglobal";
import SetBit from "../statement/command/setbit";
import SetColor from "../statement/command/setcolor";
import SetFont from "../statement/command/setfont";
import SkipDisp from "../statement/command/skipdisp";
import Split from "../statement/command/split";
import StopCallTrain from "../statement/command/stopcalltrain";
import StrData from "../statement/command/strdata";
import StrFind from "../statement/command/strfind";
import StrFindU from "../statement/command/strfindu";
import StrLen from "../statement/command/strlen";
import StrLenForm from "../statement/command/strlenform";
import StrLenFormU from "../statement/command/strlenformu";
import StrLenS from "../statement/command/strlens";
import StrLenSU from "../statement/command/strlensu";
import StrLenU from "../statement/command/strlenu";
import Substring from "../statement/command/substring";
import SubstringU from "../statement/command/substringu";
import Swap from "../statement/command/swap";
import Throw from "../statement/command/throw";
import Times from "../statement/command/times";
import TryCall from "../statement/command/trycall";
import TryCallForm from "../statement/command/trycallform";
import TryCCall from "../statement/command/tryccall";
import TryCCallForm from "../statement/command/tryccallform";
import TryCGoto from "../statement/command/trycgoto";
import TryCGotoForm from "../statement/command/trycgotoform";
import TryCJump from "../statement/command/trycjump";
import TryCJumpForm from "../statement/command/trycjumpform";
import TryGoto from "../statement/command/trygoto";
import TryGotoForm from "../statement/command/trygotoform";
import TryJump from "../statement/command/tryjump";
import TryJumpForm from "../statement/command/tryjumpform";
import VarSet from "../statement/command/varset";
import Wait from "../statement/command/wait";
import WaitAnyKey from "../statement/command/waitanykey";
import While from "../statement/command/while";
import Thunk from "../thunk";
import * as E from "./expr";
import preprocess from "./preprocess";
import prop from "./property";
import * as U from "./util";

export default function parseERB(content: string, macros: Set<string>): Fn[] {
	const lineList = preprocess(content, macros);

	const result: Fn[] = [];
	let rest = lineList.slice();
	while (rest.length > 0) {
		const [fn, restF] = parseFn(rest);
		result.push(fn);
		rest = restF;
	}

	return result;
}

function parseFn(lines: string[]): [Fn, string[]] {
	if (lines.length === 0) {
		throw new Error("Expected a function");
	}

	const rest = lines.slice();
	// Prepare definition, property and body of function
	const rawDef = rest.shift()!;
	const rawProp: string[] = [];
	const rawBody: string[] = [];

	while (rest.length > 0) {
		if (!rest[0].startsWith("#")) {
			break;
		}
		rawProp.push(rest.shift()!);
	}
	while (rest.length > 0) {
		if (rest[0].startsWith("@")) {
			break;
		}
		rawBody.push(rest.shift()!);
	}

	const argParser = U.sepBy0(",", P.seq(
		E.variable,
		P.alt(
			P.string("=").trim(U.WS0).then(U.Int),
			P.string("=").trim(U.WS0).then(U.Str),
			P.string("=").trim(U.WS0).then(E.variable),
			P.succeed(null),
		),
	));
	const defParser = P.string("@").then(P.seq(U.Identifier.skip(U.WS0), P.alt(
		U.wrap("(", ")", argParser),
		P.string(",").trim(U.WS0).then(argParser),
		P.succeed([]),
	)));

	const definition = defParser.tryParse(rawDef);

	const property = rawProp.map((p) => prop.tryParse(p));
	const [body] = parseThunk(rawBody);

	return [
		new Fn(definition[0], definition[1], property, body),
		rest,
	];
}

export function parseThunk(lines: string[], until?: (l: string) => boolean): [Thunk, string[]] {
	let rest = lines.slice();

	const body: Array<string | Statement> = [];
	while (rest.length > 0) {
		const current = rest[0];
		// eslint-disable-next-line @typescript-eslint/prefer-optional-chain
		if (until != null && until(current)) {
			break;
		}
		if (current.startsWith("$")) {
			body.push(current.slice(1));
			rest.shift();
		} else {
			const [statement, restS] = parseStatement(rest);
			body.push(statement);
			rest = restS;
		}
	}

	return [new Thunk(body), rest];
}

// eslint-disable-next-line no-useless-escape
const ID_REGEX = /^[^\+\-\*\/\%\=\!\<\>\|\&\^\~\?\#\(\)\{\}\[\]\.\,\:\$\\\'\"\@\;\s]+/;
function parseStatement(lines: string[]): [Statement, string[]] {
	const rest = lines.slice();
	const current = rest.shift()!;
	const match = ID_REGEX.exec(current);
	if (match != null) {
		const IDENTIFIER = match[0].toUpperCase();
		const arg = current.slice(match[0].length);
		switch (IDENTIFIER) {
			case "PRINT": return [new Print("PRINT", arg), rest];
			case "PRINTL": return [new Print("PRINTL", arg), rest];
			case "PRINTW": return [new Print("PRINTW", arg), rest];
			case "PRINTK": return [new Print("PRINTK", arg), rest];
			case "PRINTKL": return [new Print("PRINTKL", arg), rest];
			case "PRINTKW": return [new Print("PRINTKW", arg), rest];
			case "PRINTD": return [new Print("PRINTD", arg), rest];
			case "PRINTDL": return [new Print("PRINTDL", arg), rest];
			case "PRINTDW": return [new Print("PRINTDW", arg), rest];
			case "PRINTV": return [new PrintV("PRINTV", arg), rest];
			case "PRINTVL": return [new PrintV("PRINTVL", arg), rest];
			case "PRINTVW": return [new PrintV("PRINTVW", arg), rest];
			case "PRINTVK": return [new PrintV("PRINTVK", arg), rest];
			case "PRINTVKL": return [new PrintV("PRINTVKL", arg), rest];
			case "PRINTVKW": return [new PrintV("PRINTVKW", arg), rest];
			case "PRINTVD": return [new PrintV("PRINTVD", arg), rest];
			case "PRINTVDL": return [new PrintV("PRINTVDL", arg), rest];
			case "PRINTVDW": return [new PrintV("PRINTVDW", arg), rest];
			case "PRINTS": return [new PrintS("PRINTS", arg), rest];
			case "PRINTSL": return [new PrintS("PRINTSL", arg), rest];
			case "PRINTSW": return [new PrintS("PRINTSW", arg), rest];
			case "PRINTSK": return [new PrintS("PRINTSK", arg), rest];
			case "PRINTSKL": return [new PrintS("PRINTSKL", arg), rest];
			case "PRINTSKW": return [new PrintS("PRINTSKW", arg), rest];
			case "PRINTSD": return [new PrintS("PRINTSD", arg), rest];
			case "PRINTSDL": return [new PrintS("PRINTSDL", arg), rest];
			case "PRINTSDW": return [new PrintS("PRINTSDW", arg), rest];
			case "PRINTFORM": return [new PrintForm("PRINTFORM", arg), rest];
			case "PRINTFORML": return [new PrintForm("PRINTFORML", arg), rest];
			case "PRINTFORMW": return [new PrintForm("PRINTFORMW", arg), rest];
			case "PRINTFORMK": return [new PrintForm("PRINTFORMK", arg), rest];
			case "PRINTFORMKL": return [new PrintForm("PRINTFORMKL", arg), rest];
			case "PRINTFORMKW": return [new PrintForm("PRINTFORMKW", arg), rest];
			case "PRINTFORMD": return [new PrintForm("PRINTFORMD", arg), rest];
			case "PRINTFORMDL": return [new PrintForm("PRINTFORMDL", arg), rest];
			case "PRINTFORMDW": return [new PrintForm("PRINTFORMDW", arg), rest];
			case "PRINTC": return [new PrintC("RIGHT", "", arg), rest];
			case "PRINTCK": return [new PrintC("RIGHT", "K", arg), rest];
			case "PRINTCD": return [new PrintC("RIGHT", "D", arg), rest];
			case "PRINTLC": return [new PrintC("LEFT", "", arg), rest];
			case "PRINTLCK": return [new PrintC("LEFT", "K", arg), rest];
			case "PRINTLCD": return [new PrintC("LEFT", "D", arg), rest];
			case "PRINTFORMC": return [new PrintFormC("RIGHT", "", arg), rest];
			case "PRINTFORMCK": return [new PrintFormC("RIGHT", "K", arg), rest];
			case "PRINTFORMCD": return [new PrintFormC("RIGHT", "D", arg), rest];
			case "PRINTFORMLC": return [new PrintFormC("LEFT", "", arg), rest];
			case "PRINTFORMLCK": return [new PrintFormC("LEFT", "K", arg), rest];
			case "PRINTFORMLCD": return [new PrintFormC("LEFT", "D", arg), rest];
			case "PRINTBUTTON": return [new PrintButton(arg), rest];
			case "PRINTBUTTONC": return [new PrintButton(arg, "RIGHT"), rest];
			case "PRINTBUTTONLC": return [new PrintButton(arg, "LEFT"), rest];
			case "PRINTPLAIN": return [new PrintPlain(null, arg), rest];
			case "PRINTPLAINFORM": return [new PrintPlain("FORM", arg), rest];
			case "PRINT_PALAM": return [new PrintPalam(arg), rest];
			case "PRINT_SHOPITEM": return [new PrintShopItem(arg), rest];
			case "TIMES": return [new Times(arg), rest];
			case "DRAWLINE": return [new DrawLine(arg), rest];
			case "CUSTOMDRAWLINE": return [new CustomDrawLine(arg), rest];
			case "DRAWLINEFORM": return [new DrawLineForm(arg), rest];
			case "REUSELASTLINE": return [new ReuseLastLine(arg), rest];
			case "CLEARLINE": return [new ClearLine(arg), rest];
			case "RESETCOLOR": return [new ResetColor(arg), rest];
			case "RESETBGCOLOR": return [new ResetBgColor(arg), rest];
			case "SETCOLOR": return [new SetColor(arg), rest];
			case "GETCOLOR": return [new GetColor(arg), rest];
			case "GETDEFCOLOR": return [new GetDefColor(arg), rest];
			case "GETBGCOLOR": return [new GetBgColor(arg), rest];
			case "GETDEFBGCOLOR": return [new GetDefBgColor(arg), rest];
			case "GETFOCUSCOLOR": return [new GetFocusColor(arg), rest];
			case "FONTBOLD": return [new FontBold(arg), rest];
			case "FONTITALIC": return [new FontItalic(arg), rest];
			case "FONTREGULAR": return [new FontRegular(arg), rest];
			case "GETSTYLE": return [new GetStyle(arg), rest];
			case "SETFONT": return [new SetFont(arg), rest];
			case "GETFONT": return [new GetFont(arg), rest];
			case "ALIGNMENT": return [new Alignment(arg), rest];
			case "CURRENTALIGN": return [new CurrentAlign(arg), rest];
			case "REDRAW": return [new Redraw(arg), rest];
			case "CURRENTREDRAW": return [new CurrentRedraw(arg), rest];
			case "PRINTCPERLINE": return [new PrintCPerLine(arg), rest];
			case "LINEISEMPTY": return [new LineIsEmpty(arg), rest];
			case "SKIPDISP": return [new SkipDisp(arg), rest];
			case "BAR": return [new Bar(arg), rest];
			case "BARL": return [new Bar(arg, true), rest];
			case "BARSTR": return [new BarStr(arg), rest];
			case "ISSKIP": return [new IsSkip(arg), rest];
			case "MOUSESKIP": return [new MouseSkip(arg), rest];
			case "STRLEN": return [new StrLen(arg), rest];
			case "STRLENS": return [new StrLenS(arg), rest];
			case "STRLENFORM": return [new StrLenForm(arg), rest];
			case "STRLENU": return [new StrLenU(arg), rest];
			case "STRLENSU": return [new StrLenSU(arg), rest];
			case "STRLENFORMU": return [new StrLenFormU(arg), rest];
			case "SUBSTRING": return [new Substring(arg), rest];
			case "SUBSTRINGU": return [new SubstringU(arg), rest];
			case "STRFIND": return [new StrFind(arg), rest];
			case "STRFINDU": return [new StrFindU(arg), rest];
			case "SPLIT": return [new Split(arg), rest];
			case "GETBIT": return [new GetBit(arg), rest];
			case "SETBIT": return [new SetBit(arg), rest];
			case "CLEARBIT": return [new ClearBit(arg), rest];
			case "INVERTBIT": return [new InvertBit(arg), rest];
			case "ADDCHARA": return [new AddChara(arg), rest];
			case "ADDDEFCHARA": return [new AddDefChara(arg), rest];
			case "ADDVOIDCHARA": return [new AddVoidChara(arg), rest];
			case "DELCHARA": return [new DelChara(arg), rest];
			case "DELALLCHARA": return [new DelAllChara(arg), rest];
			case "EXISTCSV": return [new ExistCSV(arg), rest];
			case "SWAP": return [new Swap(arg), rest];
			case "RESETDATA": return [new ResetData(arg), rest];
			case "RESETGLOBAL": return [new ResetGlobal(arg), rest];
			case "VARSET": return [new VarSet(arg), rest];
			case "ARRAYSHIFT": return [new ArrayShift(arg), rest];
			case "PUTFORM": return [new PutForm(arg), rest];
			case "SAVEGAME": return [new SaveGame(arg), rest];
			case "LOADGAME": return [new LoadGame(arg), rest];
			case "SAVEDATA": return [new SaveData(arg), rest];
			case "LOADDATA": return [new LoadData(arg), rest];
			case "DELDATA": return [new DelData(arg), rest];
			case "CHKDATA": return [new ChkData(arg), rest];
			case "SAVEGLOBAL": return [new SaveGlobal(arg), rest];
			case "LOADGLOBAL": return [new LoadGlobal(arg), rest];
			case "OUTPUTLOG": return [new OutputLog(arg), rest];
			case "GETTIME": return [new GetTime(arg), rest];
			case "GETMILLISECOND": return [new GetMillisecond(arg), rest];
			case "GETSECOND": return [new GetSecond(arg), rest];
			case "FORCEWAIT": return [new ForceWait(arg), rest];
			case "INPUT": return [new Input(arg), rest];
			case "INPUTS": return [new InputS(arg), rest];
			case "WAIT": return [new Wait(arg), rest];
			case "WAITANYKEY": return [new WaitAnyKey(arg), rest];
			case "BREAK": return [new Break(arg), rest];
			case "CONTINUE": return [new Continue(arg), rest];
			case "RANDOMIZE": return [new Randomize(arg), rest];
			case "DUMPRAND": return [new DumpRand(arg), rest];
			case "INITRAND": return [new InitRand(arg), rest];
			case "BEGIN": return [new Begin(arg), rest];
			case "CALLTRAIN": return [new CallTrain(arg), rest];
			case "THROW": return [new Throw(arg), rest];
			case "QUIT": return [new Quit(arg), rest];
			case "CALL": return [Call.parse(arg), rest];
			case "CALLFORM": return [CallForm.parse(arg), rest];
			case "CALLF": return [CallF.parse(arg), rest];
			case "CALLFORMF": return [CallFormF.parse(arg), rest];
			case "TRYCALL": return [TryCall.parse(arg), rest];
			case "TRYCALLFORM": return [TryCallForm.parse(arg), rest];
			case "TRYCCALL": return TryCCall.parse(lines);
			case "TRYCCALLFORM": return TryCCallForm.parse(lines);
			case "JUMP": return [Jump.parse(arg), rest];
			case "JUMPFORM": return [JumpForm.parse(arg), rest];
			case "TRYJUMP": return [TryJump.parse(arg), rest];
			case "TRYJUMPFORM": return [TryJumpForm.parse(arg), rest];
			case "TRYCJUMP": return TryCJump.parse(lines);
			case "TRYCJUMPFORM": return TryCJumpForm.parse(lines);
			case "GOTO": return [Goto.parse(arg), rest];
			case "GOTOFORM": return [GotoForm.parse(arg), rest];
			case "TRYGOTO": return [TryGoto.parse(arg), rest];
			case "TRYGOTOFORM": return [TryGotoForm.parse(arg), rest];
			case "TRYCGOTO": return TryCGoto.parse(lines);
			case "TRYCGOTOFORM": return TryCGotoForm.parse(lines);
			case "RESTART": return [new Restart(arg), rest];
			case "RETURN": return [new Return(arg), rest];
			case "RETURNF": return [new ReturnF(arg), rest];
			case "DEBUGCLEAR": return [new DebugClear(arg), rest];
			case "MOUSEX": return [new MouseX(arg), rest];
			case "MOUSEY": return [new MouseY(arg), rest];
			case "ISACTIVE": return [new IsActive(arg), rest];
			case "CBGCLEAR": return [new CbgClear(arg), rest];
			case "CBGCLEARBUTTON": return [new CbgClearButton(arg), rest];
			case "CBGREMOVEBMAP": return [new CbgRemoveBmap(arg), rest];
			case "CLEARTEXTBOX": return [new ClearTextBox(arg), rest];
			case "STRDATA": return [new StrData(arg), rest];
			case "STOPCALLTRAIN": return [new StopCallTrain(arg), rest];
			case "PRINTDATA": return PrintData.parse("", rest);
			case "PRINTDATAL": return PrintData.parse("L", rest);
			case "PRINTDATAW": return PrintData.parse("W", rest);
			case "PRINTDATAK": return PrintData.parse("K", rest);
			case "PRINTDATAKL": return PrintData.parse("KL", rest);
			case "PRINTDATAKW": return PrintData.parse("KW", rest);
			case "PRINTDATAD": return PrintData.parse("D", rest);
			case "PRINTDATADL": return PrintData.parse("DL", rest);
			case "PRINTDATADW": return PrintData.parse("DW", rest);
			case "SIF": {
				const [statement, restS] = parseStatement(rest);
				return [new If([[arg, new Thunk([statement])]], new Thunk([])), restS];
			}
			case "IF": return If.parse(lines);
			case "SELECTCASE": return Case.parse(lines);
			case "REPEAT": return Repeat.parse(arg, rest);
			case "FOR": return For.parse(arg, rest);
			case "WHILE": return While.parse(arg, rest);
			case "DO": return DoWhile.parse(arg, rest);
		}
	}

	return [new Assign(current), rest];
}
