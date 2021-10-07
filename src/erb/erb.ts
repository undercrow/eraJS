import P from "parsimmon";

import Fn from "../fn";
import Property from "../property";
import Statement from "../statement";
import Assign from "../statement/assign";
import Abs from "../statement/command/abs";
import AddChara from "../statement/command/addchara";
import AddCopyChara from "../statement/command/addcopychara";
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
import ChkFont from "../statement/command/chkfont";
import ClearBit from "../statement/command/clearbit";
import ClearLine from "../statement/command/clearline";
import ClearTextBox from "../statement/command/cleartextbox";
import Continue from "../statement/command/continue";
import CopyChara from "../statement/command/copychara";
import CsvAbl from "../statement/command/csvabl";
import CsvBase from "../statement/command/csvbase";
import CsvCallname from "../statement/command/csvcallname";
import CsvCflag from "../statement/command/csvcflag";
import CsvCstr from "../statement/command/csvcstr";
import CsvEquip from "../statement/command/csvequip";
import CsvExp from "../statement/command/csvexp";
import CsvJuel from "../statement/command/csvjuel";
import CsvMark from "../statement/command/csvmark";
import CsvMastername from "../statement/command/csvmastername";
import CsvName from "../statement/command/csvname";
import CsvNickname from "../statement/command/csvnickname";
import CsvRelation from "../statement/command/csvrelation";
import CsvTalent from "../statement/command/csvtalent";
import CUpCheck from "../statement/command/cupcheck";
import CurrentAlign from "../statement/command/currentalign";
import CurrentRedraw from "../statement/command/currentredraw";
import CustomDrawLine from "../statement/command/customdrawline";
import CVarSet from "../statement/command/cvarset";
import DebugClear from "../statement/command/debugclear";
import DelAllChara from "../statement/command/delallchara";
import DelChara from "../statement/command/delchara";
import DelData from "../statement/command/deldata";
import DoWhile from "../statement/command/dowhile";
import DrawLine from "../statement/command/drawline";
import DrawLineForm from "../statement/command/drawlineform";
import DumpRand from "../statement/command/dumprand";
import EncodeToUni from "../statement/command/encodetouni";
import Escape from "../statement/command/escape";
import ExistCSV from "../statement/command/existcsv";
import FindChara from "../statement/command/findchara";
import FindLastChara from "../statement/command/findlastchara";
import FontBold from "../statement/command/fontbold";
import FontItalic from "../statement/command/fontitalic";
import FontRegular from "../statement/command/fontregular";
import FontStyle from "../statement/command/fontstyle";
import For from "../statement/command/for";
import ForceWait from "../statement/command/forcewait";
import GetBgColor from "../statement/command/getbgcolor";
import GetBit from "../statement/command/getbit";
import GetChara from "../statement/command/getchara";
import GetColor from "../statement/command/getcolor";
import GetDefBgColor from "../statement/command/getdefbgcolor";
import GetDefColor from "../statement/command/getdefcolor";
import GetExpLv from "../statement/command/getexplv";
import GetFocusColor from "../statement/command/getfocuscolor";
import GetFont from "../statement/command/getfont";
import GetMillisecond from "../statement/command/getmillisecond";
import GetPalamLv from "../statement/command/getpalamlv";
import GetSecond from "../statement/command/getsecond";
import GetStyle from "../statement/command/getstyle";
import GetTime from "../statement/command/gettime";
import Goto from "../statement/command/goto";
import GotoForm from "../statement/command/gotoform";
import If from "../statement/command/if";
import Input from "../statement/command/input";
import InputS from "../statement/command/inputs";
import InitRand from "../statement/command/initrand";
import InRange from "../statement/command/inrange";
import InvertBit from "../statement/command/invertbit";
import IsActive from "../statement/command/isactive";
import IsSkip from "../statement/command/isskip";
import Jump from "../statement/command/jump";
import JumpForm from "../statement/command/jumpform";
import Limit from "../statement/command/limit";
import LineIsEmpty from "../statement/command/lineisempty";
import LoadData from "../statement/command/loaddata";
import LoadGame from "../statement/command/loadgame";
import LoadGlobal from "../statement/command/loadglobal";
import Max from "../statement/command/max";
import Min from "../statement/command/min";
import MouseSkip from "../statement/command/mouseskip";
import MouseX from "../statement/command/mousex";
import MouseY from "../statement/command/mousey";
import OneInput from "../statement/command/oneinput";
import OneInputS from "../statement/command/oneinputs";
import OutputLog from "../statement/command/outputlog";
import PickupChara from "../statement/command/pickupchara";
import Power from "../statement/command/power";
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
import ResetStain from "../statement/command/reset_stain";
import Restart from "../statement/command/restart";
import Return from "../statement/command/return";
import ReturnF from "../statement/command/returnf";
import ReuseLastLine from "../statement/command/reuselastline";
import SaveData from "../statement/command/savedata";
import SaveGame from "../statement/command/savegame";
import SaveGlobal from "../statement/command/saveglobal";
import SetBgColor from "../statement/command/setbgcolor";
import SetBgColorByName from "../statement/command/setbgcolorbyname";
import SetBit from "../statement/command/setbit";
import SetColor from "../statement/command/setcolor";
import SetColorByName from "../statement/command/setcolorbyname";
import SetFont from "../statement/command/setfont";
import Sign from "../statement/command/sign";
import SkipDisp from "../statement/command/skipdisp";
import SortChara from "../statement/command/sortchara";
import Split from "../statement/command/split";
import Sqrt from "../statement/command/sqrt";
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
import SwapChara from "../statement/command/swapchara";
import Throw from "../statement/command/throw";
import Times from "../statement/command/times";
import TInput from "../statement/command/tinput";
import TInputS from "../statement/command/tinputs";
import TOneInput from "../statement/command/toneinput";
import TOneInputS from "../statement/command/toneinputs";
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
import Unicode from "../statement/command/unicode";
import UpCheck from "../statement/command/upcheck";
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
	let index = 0;
	while (lineList.length > index) {
		const [fn, consumed] = parseFn(lineList, index);
		result.push(fn);
		index += consumed;
	}

	return result;
}

function parseFn(lines: string[], from: number): [Fn, number] {
	let index = from;
	if (lines.length <= index) {
		throw new Error("Expected a function");
	}

	// Prepare definition, property and body of function
	const defIndex = index;
	index += 1;

	const propIndex = index;
	while (lines.length > index) {
		if (!lines[index].startsWith("#")) {
			break;
		}
		index += 1;
	}

	const bodyIndex = index;
	while (lines.length > index) {
		if (lines[index].startsWith("@")) {
			break;
		}
		index += 1;
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

	const definition = defParser.tryParse(lines[defIndex]);

	const property: Property[] = [];
	for (let i = propIndex; i < bodyIndex; ++i) {
		property.push(prop.tryParse(lines[i]));
	}
	const [body] = parseThunk(lines.slice(bodyIndex, index), 0);

	return [
		new Fn(definition[0], definition[1], property, body),
		index - from,
	];
}

export function parseThunk(
	lines: string[],
	from: number,
	until?: (l: string) => boolean,
): [Thunk, number] {
	const body: Array<string | Statement> = [];
	let index = from;
	while (index < lines.length) {
		const current = lines[index];
		// eslint-disable-next-line @typescript-eslint/prefer-optional-chain
		if (until != null && until(current)) {
			break;
		}
		if (current.startsWith("$")) {
			body.push(current.slice(1));
			index += 1;
		} else {
			const [statement, consumed] = parseStatement(lines, index);
			body.push(statement);
			index += consumed;
		}
	}

	return [new Thunk(body), index - from];
}

// eslint-disable-next-line no-useless-escape
const ID_REGEX = /^[^\+\-\*\/\%\=\!\<\>\|\&\^\~\?\#\(\)\{\}\[\]\.\,\:\$\\\'\"\@\;\s]+/;
function parseStatement(lines: string[], index: number): [Statement, number] {
	const current = lines[index];
	const match = ID_REGEX.exec(current);
	if (match != null) {
		const IDENTIFIER = match[0].toUpperCase();
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (commandParser[IDENTIFIER] != null) {
			const arg = current.slice(match[0].length);
			return commandParser[IDENTIFIER](arg, lines, index);
		}
	}

	return [new Assign(current), 1];
}

type CommandParser = (arg: string, lines: string[], from: number) => [Statement, number];
const commandParser: Record<string, CommandParser> = {
	PRINT: (arg) => [new Print("PRINT", arg), 1],
	PRINTL: (arg) => [new Print("PRINTL", arg), 1],
	PRINTW: (arg) => [new Print("PRINTW", arg), 1],
	PRINTK: (arg) => [new Print("PRINTK", arg), 1],
	PRINTKL: (arg) => [new Print("PRINTKL", arg), 1],
	PRINTKW: (arg) => [new Print("PRINTKW", arg), 1],
	PRINTD: (arg) => [new Print("PRINTD", arg), 1],
	PRINTDL: (arg) => [new Print("PRINTDL", arg), 1],
	PRINTDW: (arg) => [new Print("PRINTDW", arg), 1],
	PRINTV: (arg) => [new PrintV("PRINTV", arg), 1],
	PRINTVL: (arg) => [new PrintV("PRINTVL", arg), 1],
	PRINTVW: (arg) => [new PrintV("PRINTVW", arg), 1],
	PRINTVK: (arg) => [new PrintV("PRINTVK", arg), 1],
	PRINTVKL: (arg) => [new PrintV("PRINTVKL", arg), 1],
	PRINTVKW: (arg) => [new PrintV("PRINTVKW", arg), 1],
	PRINTVD: (arg) => [new PrintV("PRINTVD", arg), 1],
	PRINTVDL: (arg) => [new PrintV("PRINTVDL", arg), 1],
	PRINTVDW: (arg) => [new PrintV("PRINTVDW", arg), 1],
	PRINTS: (arg) => [new PrintS("PRINTS", arg), 1],
	PRINTSL: (arg) => [new PrintS("PRINTSL", arg), 1],
	PRINTSW: (arg) => [new PrintS("PRINTSW", arg), 1],
	PRINTSK: (arg) => [new PrintS("PRINTSK", arg), 1],
	PRINTSKL: (arg) => [new PrintS("PRINTSKL", arg), 1],
	PRINTSKW: (arg) => [new PrintS("PRINTSKW", arg), 1],
	PRINTSD: (arg) => [new PrintS("PRINTSD", arg), 1],
	PRINTSDL: (arg) => [new PrintS("PRINTSDL", arg), 1],
	PRINTSDW: (arg) => [new PrintS("PRINTSDW", arg), 1],
	PRINTFORM: (arg) => [new PrintForm("PRINTFORM", arg), 1],
	PRINTFORML: (arg) => [new PrintForm("PRINTFORML", arg), 1],
	PRINTFORMW: (arg) => [new PrintForm("PRINTFORMW", arg), 1],
	PRINTFORMK: (arg) => [new PrintForm("PRINTFORMK", arg), 1],
	PRINTFORMKL: (arg) => [new PrintForm("PRINTFORMKL", arg), 1],
	PRINTFORMKW: (arg) => [new PrintForm("PRINTFORMKW", arg), 1],
	PRINTFORMD: (arg) => [new PrintForm("PRINTFORMD", arg), 1],
	PRINTFORMDL: (arg) => [new PrintForm("PRINTFORMDL", arg), 1],
	PRINTFORMDW: (arg) => [new PrintForm("PRINTFORMDW", arg), 1],
	PRINTC: (arg) => [new PrintC("RIGHT", "", arg), 1],
	PRINTCK: (arg) => [new PrintC("RIGHT", "K", arg), 1],
	PRINTCD: (arg) => [new PrintC("RIGHT", "D", arg), 1],
	PRINTLC: (arg) => [new PrintC("LEFT", "", arg), 1],
	PRINTLCK: (arg) => [new PrintC("LEFT", "K", arg), 1],
	PRINTLCD: (arg) => [new PrintC("LEFT", "D", arg), 1],
	PRINTFORMC: (arg) => [new PrintFormC("RIGHT", "", arg), 1],
	PRINTFORMCK: (arg) => [new PrintFormC("RIGHT", "K", arg), 1],
	PRINTFORMCD: (arg) => [new PrintFormC("RIGHT", "D", arg), 1],
	PRINTFORMLC: (arg) => [new PrintFormC("LEFT", "", arg), 1],
	PRINTFORMLCK: (arg) => [new PrintFormC("LEFT", "K", arg), 1],
	PRINTFORMLCD: (arg) => [new PrintFormC("LEFT", "D", arg), 1],
	PRINTBUTTON: (arg) => [new PrintButton(arg), 1],
	PRINTBUTTONC: (arg) => [new PrintButton(arg, "RIGHT"), 1],
	PRINTBUTTONLC: (arg) => [new PrintButton(arg, "LEFT"), 1],
	PRINTPLAIN: (arg) => [new PrintPlain(null, arg), 1],
	PRINTPLAINFORM: (arg) => [new PrintPlain("FORM", arg), 1],
	PRINT_PALAM: (arg) => [new PrintPalam(arg), 1],
	PRINT_SHOPITEM: (arg) => [new PrintShopItem(arg), 1],
	TIMES: (arg) => [new Times(arg), 1],
	DRAWLINE: (arg) => [new DrawLine(arg), 1],
	CUSTOMDRAWLINE: (arg) => [new CustomDrawLine(arg), 1],
	DRAWLINEFORM: (arg) => [new DrawLineForm(arg), 1],
	REUSELASTLINE: (arg) => [new ReuseLastLine(arg), 1],
	CLEARLINE: (arg) => [new ClearLine(arg), 1],
	RESETCOLOR: (arg) => [new ResetColor(arg), 1],
	RESETBGCOLOR: (arg) => [new ResetBgColor(arg), 1],
	SETCOLOR: (arg) => [new SetColor(arg), 1],
	SETBGCOLOR: (arg) => [new SetBgColor(arg), 1],
	SETCOLORBYNAME: (arg) => [new SetColorByName(arg), 1],
	SETBGCOLORBYNAME: (arg) => [new SetBgColorByName(arg), 1],
	GETCOLOR: (arg) => [new GetColor(arg), 1],
	GETDEFCOLOR: (arg) => [new GetDefColor(arg), 1],
	GETBGCOLOR: (arg) => [new GetBgColor(arg), 1],
	GETDEFBGCOLOR: (arg) => [new GetDefBgColor(arg), 1],
	GETFOCUSCOLOR: (arg) => [new GetFocusColor(arg), 1],
	FONTBOLD: (arg) => [new FontBold(arg), 1],
	FONTITALIC: (arg) => [new FontItalic(arg), 1],
	FONTREGULAR: (arg) => [new FontRegular(arg), 1],
	FONTSTYLE: (arg) => [new FontStyle(arg), 1],
	GETSTYLE: (arg) => [new GetStyle(arg), 1],
	CHKFONT: (arg) => [new ChkFont(arg), 1],
	SETFONT: (arg) => [new SetFont(arg), 1],
	GETFONT: (arg) => [new GetFont(arg), 1],
	ALIGNMENT: (arg) => [new Alignment(arg), 1],
	CURRENTALIGN: (arg) => [new CurrentAlign(arg), 1],
	REDRAW: (arg) => [new Redraw(arg), 1],
	CURRENTREDRAW: (arg) => [new CurrentRedraw(arg), 1],
	PRINTCPERLINE: (arg) => [new PrintCPerLine(arg), 1],
	LINEISEMPTY: (arg) => [new LineIsEmpty(arg), 1],
	SKIPDISP: (arg) => [new SkipDisp(arg), 1],
	BAR: (arg) => [new Bar(arg), 1],
	BARL: (arg) => [new Bar(arg, true), 1],
	BARSTR: (arg) => [new BarStr(arg), 1],
	ISSKIP: (arg) => [new IsSkip(arg), 1],
	MOUSESKIP: (arg) => [new MouseSkip(arg), 1],
	STRLEN: (arg) => [new StrLen(arg), 1],
	STRLENS: (arg) => [new StrLenS(arg), 1],
	STRLENFORM: (arg) => [new StrLenForm(arg), 1],
	STRLENU: (arg) => [new StrLenU(arg), 1],
	STRLENSU: (arg) => [new StrLenSU(arg), 1],
	STRLENFORMU: (arg) => [new StrLenFormU(arg), 1],
	SUBSTRING: (arg) => [new Substring(arg), 1],
	SUBSTRINGU: (arg) => [new SubstringU(arg), 1],
	STRFIND: (arg) => [new StrFind(arg), 1],
	STRFINDU: (arg) => [new StrFindU(arg), 1],
	SPLIT: (arg) => [new Split(arg), 1],
	ESCAPE: (arg) => [new Escape(arg), 1],
	UNICODE: (arg) => [new Unicode(arg), 1],
	ENCODETOUNI: (arg) => [new EncodeToUni(arg), 1],
	POWER: (arg) => [new Power(arg), 1],
	ABS: (arg) => [new Abs(arg), 1],
	SIGN: (arg) => [new Sign(arg), 1],
	SQRT: (arg) => [new Sqrt(arg), 1],
	MAX: (arg) => [new Max(arg), 1],
	MIN: (arg) => [new Min(arg), 1],
	LIMIT: (arg) => [new Limit(arg), 1],
	INRANGE: (arg) => [new InRange(arg), 1],
	GETBIT: (arg) => [new GetBit(arg), 1],
	SETBIT: (arg) => [new SetBit(arg), 1],
	CLEARBIT: (arg) => [new ClearBit(arg), 1],
	INVERTBIT: (arg) => [new InvertBit(arg), 1],
	ADDCHARA: (arg) => [new AddChara(arg), 1],
	ADDDEFCHARA: (arg) => [new AddDefChara(arg), 1],
	ADDVOIDCHARA: (arg) => [new AddVoidChara(arg), 1],
	DELCHARA: (arg) => [new DelChara(arg), 1],
	DELALLCHARA: (arg) => [new DelAllChara(arg), 1],
	GETCHARA: (arg) => [new GetChara(arg), 1],
	SWAPCHARA: (arg) => [new SwapChara(arg), 1],
	SORTCHARA: (arg) => [new SortChara(arg), 1],
	PICKUPCHARA: (arg) => [new PickupChara(arg), 1],
	FINDCHARA: (arg) => [new FindChara(arg), 1],
	FINDLASTCHARA: (arg) => [new FindLastChara(arg), 1],
	COPYCHARA: (arg) => [new CopyChara(arg), 1],
	ADDCOPYCHARA: (arg) => [new AddCopyChara(arg), 1],
	EXISTCSV: (arg) => [new ExistCSV(arg), 1],
	SWAP: (arg) => [new Swap(arg), 1],
	RESETDATA: (arg) => [new ResetData(arg), 1],
	RESETGLOBAL: (arg) => [new ResetGlobal(arg), 1],
	RESET_STAIN: (arg) => [new ResetStain(arg), 1],
	CSVABL: (arg) => [new CsvAbl(arg), 1],
	CSVBASE: (arg) => [new CsvBase(arg), 1],
	CSVCALLNAME: (arg) => [new CsvCallname(arg), 1],
	CSVCFLAG: (arg) => [new CsvCflag(arg), 1],
	CSVCSTR: (arg) => [new CsvCstr(arg), 1],
	CSVEQUIP: (arg) => [new CsvEquip(arg), 1],
	CSVEXP: (arg) => [new CsvExp(arg), 1],
	CSVJUEL: (arg) => [new CsvJuel(arg), 1],
	CSVMARK: (arg) => [new CsvMark(arg), 1],
	CSVMASTERNAME: (arg) => [new CsvMastername(arg), 1],
	CSVNAME: (arg) => [new CsvName(arg), 1],
	CSVNICKNAME: (arg) => [new CsvNickname(arg), 1],
	CSVRELATION: (arg) => [new CsvRelation(arg), 1],
	CSVTALENT: (arg) => [new CsvTalent(arg), 1],
	GETPALAMLV: (arg) => [new GetPalamLv(arg), 1],
	GETEXPLV: (arg) => [new GetExpLv(arg), 1],
	VARSET: (arg) => [new VarSet(arg), 1],
	CVARSET: (arg) => [new CVarSet(arg), 1],
	ARRAYSHIFT: (arg) => [new ArrayShift(arg), 1],
	UPCHECK: (arg) => [new UpCheck(arg), 1],
	CUPCHECK: (arg) => [new CUpCheck(arg), 1],
	PUTFORM: (arg) => [new PutForm(arg), 1],
	SAVEGAME: (arg) => [new SaveGame(arg), 1],
	LOADGAME: (arg) => [new LoadGame(arg), 1],
	SAVEDATA: (arg) => [new SaveData(arg), 1],
	LOADDATA: (arg) => [new LoadData(arg), 1],
	DELDATA: (arg) => [new DelData(arg), 1],
	CHKDATA: (arg) => [new ChkData(arg), 1],
	SAVEGLOBAL: (arg) => [new SaveGlobal(arg), 1],
	LOADGLOBAL: (arg) => [new LoadGlobal(arg), 1],
	OUTPUTLOG: (arg) => [new OutputLog(arg), 1],
	GETTIME: (arg) => [new GetTime(arg), 1],
	GETMILLISECOND: (arg) => [new GetMillisecond(arg), 1],
	GETSECOND: (arg) => [new GetSecond(arg), 1],
	FORCEWAIT: (arg) => [new ForceWait(arg), 1],
	INPUT: (arg) => [new Input(arg), 1],
	INPUTS: (arg) => [new InputS(arg), 1],
	TINPUT: (arg) => [new TInput(arg), 1],
	TINPUTS: (arg) => [new TInputS(arg), 1],
	ONEINPUT: (arg) => [new OneInput(arg), 1],
	ONEINPUTS: (arg) => [new OneInputS(arg), 1],
	TONEINPUT: (arg) => [new TOneInput(arg), 1],
	TONEINPUTS: (arg) => [new TOneInputS(arg), 1],
	WAIT: (arg) => [new Wait(arg), 1],
	WAITANYKEY: (arg) => [new WaitAnyKey(arg), 1],
	BREAK: (arg) => [new Break(arg), 1],
	CONTINUE: (arg) => [new Continue(arg), 1],
	RANDOMIZE: (arg) => [new Randomize(arg), 1],
	DUMPRAND: (arg) => [new DumpRand(arg), 1],
	INITRAND: (arg) => [new InitRand(arg), 1],
	BEGIN: (arg) => [new Begin(arg), 1],
	CALLTRAIN: (arg) => [new CallTrain(arg), 1],
	THROW: (arg) => [new Throw(arg), 1],
	QUIT: (arg) => [new Quit(arg), 1],
	CALL: (arg) => [new Call(arg), 1],
	CALLFORM: (arg) => [new CallForm(arg), 1],
	CALLF: (arg) => [new CallF(arg), 1],
	CALLFORMF: (arg) => [new CallFormF(arg), 1],
	TRYCALL: (arg) => [TryCall.parse(arg), 1],
	TRYCALLFORM: (arg) => [new TryCallForm(arg), 1],
	TRYCCALL: (_arg, lines, from) => TryCCall.parse(lines, from),
	TRYCCALLFORM: (_arg, lines, from) => TryCCallForm.parse(lines, from),
	JUMP: (arg) => [new Jump(arg), 1],
	JUMPFORM: (arg) => [new JumpForm(arg), 1],
	TRYJUMP: (arg) => [TryJump.parse(arg), 1],
	TRYJUMPFORM: (arg) => [TryJumpForm.parse(arg), 1],
	TRYCJUMP: (_arg, lines, from) => TryCJump.parse(lines, from),
	TRYCJUMPFORM: (_arg, lines, from) => TryCJumpForm.parse(lines, from),
	GOTO: (arg) => [new Goto(arg), 1],
	GOTOFORM: (arg) => [new GotoForm(arg), 1],
	TRYGOTO: (arg) => [TryGoto.parse(arg), 1],
	TRYGOTOFORM: (arg) => [TryGotoForm.parse(arg), 1],
	TRYCGOTO: (_arg, lines, from) => TryCGoto.parse(lines, from),
	TRYCGOTOFORM: (_arg, lines, from) => TryCGotoForm.parse(lines, from),
	RESTART: (arg) => [new Restart(arg), 1],
	RETURN: (arg) => [new Return(arg), 1],
	RETURNF: (arg) => [new ReturnF(arg), 1],
	DEBUGCLEAR: (arg) => [new DebugClear(arg), 1],
	MOUSEX: (arg) => [new MouseX(arg), 1],
	MOUSEY: (arg) => [new MouseY(arg), 1],
	ISACTIVE: (arg) => [new IsActive(arg), 1],
	CBGCLEAR: (arg) => [new CbgClear(arg), 1],
	CBGCLEARBUTTON: (arg) => [new CbgClearButton(arg), 1],
	CBGREMOVEBMAP: (arg) => [new CbgRemoveBmap(arg), 1],
	CLEARTEXTBOX: (arg) => [new ClearTextBox(arg), 1],
	STRDATA: (arg) => [new StrData(arg), 1],
	STOPCALLTRAIN: (arg) => [new StopCallTrain(arg), 1],
	PRINTDATA: (_arg, lines, from) => PrintData.parse("", lines, from),
	PRINTDATAL: (_arg, lines, from) => PrintData.parse("L", lines, from),
	PRINTDATAW: (_arg, lines, from) => PrintData.parse("W", lines, from),
	PRINTDATAK: (_arg, lines, from) => PrintData.parse("K", lines, from),
	PRINTDATAKL: (_arg, lines, from) => PrintData.parse("KL", lines, from),
	PRINTDATAKW: (_arg, lines, from) => PrintData.parse("KW", lines, from),
	PRINTDATAD: (_arg, lines, from) => PrintData.parse("D", lines, from),
	PRINTDATADL: (_arg, lines, from) => PrintData.parse("DL", lines, from),
	PRINTDATADW: (_arg, lines, from) => PrintData.parse("DW", lines, from),
	SIF: (arg, lines, from) => {
		const [statement, consumed] = parseStatement(lines, from + 1);
		return [new If([[arg, new Thunk([statement])]], new Thunk([])), consumed + 1];
	},
	IF: (_arg, lines, from) => If.parse(lines, from),
	SELECTCASE: (_arg, lines, from) => Case.parse(lines, from),
	REPEAT: (arg, lines, from) => Repeat.parse(arg, lines, from),
	FOR: (arg, lines, from) => For.parse(arg, lines, from),
	WHILE: (arg, lines, from) => While.parse(arg, lines, from),
	DO: (arg, lines, from) => DoWhile.parse(arg, lines, from),
};
