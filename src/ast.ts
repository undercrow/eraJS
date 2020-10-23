type Node<T extends string> = {
	type: T;
};
function node<T extends string>(type: T): Node<T> {
	return {
		type,
	};
}

export type Variable = Node<"variable"> & {
	name: string;
};
export const variable = (name: Variable["name"]): Variable => ({
	...node("variable"),
	name,
});

export type BinaryIntExpr = Node<"binary"> & {
	op: "*" | "/" | "%" | "<" | "<=" | ">" | ">=" | "==" | "!=";
	left: IntExpr;
	right: IntExpr;
};
export const binaryInt = (
	op: BinaryIntExpr["op"],
	left: BinaryIntExpr["left"],
	right: BinaryIntExpr["right"],
): BinaryIntExpr => ({
	...node("binary"),
	op,
	left,
	right,
});

export type InlineCall = Node<"inlinecall"> & {
	name: string;
	arg: IntExpr[];
};
export const inlineCall = (name: InlineCall["name"], arg: InlineCall["arg"]): InlineCall => ({
	...node("inlinecall"),
	name,
	arg,
});

export type IntExpr = number | Variable | BinaryIntExpr | InlineCall;

export type StringExpr = string | Variable | InlineCall;

export type Form = Node<"form"> & {
	expr: Array<string | IntExpr | StringExpr>;
};
export const form = (expr: Form["expr"]): Form => ({
	...node("form"),
	expr,
});

export type Label = Node<"label"> & {
	name: string;
};
export const label = (name: string): Label => ({
	...node("label"),
	name,
});

export type Assign = Node<"assign"> & {
	dest: Variable;
	expr: IntExpr | StringExpr | Form;
};
export const assign = (dest: Assign["dest"], expr: Assign["expr"]): Assign => ({
	...node("assign"),
	dest,
	expr,
});

type BaseCommand<T> = Node<"command"> & {
	command: T;
};
const command = <T>(cmd: T): BaseCommand<T> => ({
	...node("command"),
	command: cmd,
});

export type Print = BaseCommand<"print"> & {
	value: string | IntExpr | StringExpr | Form;
	outType?: "K" | "D";
	action?: "newline" | "wait";
};
export const print = (
	value: Print["value"],
	outType?: Print["outType"],
	action?: Print["action"],
): Print => ({
	...command("print"),
	value,
	outType,
	action,
});

export type DrawLine = BaseCommand<"drawline">;
export const drawLine = (): DrawLine => command("drawline");
export type ResetColor = BaseCommand<"resetcolor">;
export const resetColor = (): ResetColor => command("resetcolor");
export type ResetBgColor = BaseCommand<"resetbgcolor">;
export const resetBgColor = (): ResetBgColor => command("resetbgcolor");
export type GetColor = BaseCommand<"getcolor">;
export const getColor = (): GetColor => command("getcolor");
export type GetDefColor = BaseCommand<"getdefcolor">;
export const getDefColor = (): GetDefColor => command("getdefcolor");
export type GetBgColor = BaseCommand<"getbgcolor">;
export const getBgColor = (): GetBgColor => command("getbgcolor");
export type GetDefBgColor = BaseCommand<"getdefbgcolor">;
export const getDefBgColor = (): GetDefBgColor => command("getdefbgcolor");
export type GetFocusColor = BaseCommand<"getfocuscolor">;
export const getFocusColor = (): GetFocusColor => command("getfocuscolor");
export type GetStyle = BaseCommand<"getstyle">;
export const getStyle = (): GetStyle => command("getstyle");
export type GetFont = BaseCommand<"getfont">;
export const getFont = (): GetFont => command("getfont");
export type CurrentAlign = BaseCommand<"currentalign">;
export const currentAlign = (): CurrentAlign => command("currentalign");
export type CurrentRedraw = BaseCommand<"currentredraw">;
export const currentRedraw = (): CurrentRedraw => command("currentredraw");
export type PrintCPerLine = BaseCommand<"printcperline">;
export const printCPerLine = (): PrintCPerLine => command("printcperline");
export type LineIsEmpty = BaseCommand<"lineisempty">;
export const lineIsEmpty = (): LineIsEmpty => command("lineisempty");
export type IsSkip = BaseCommand<"isskip">;
export const isSkip = (): IsSkip => command("isskip");
export type MouseSkip = BaseCommand<"mouseskip">;
export const mouseSkip = (): MouseSkip => command("mouseskip");
export type AddDefChara = BaseCommand<"adddefchara">;
export const addDefChara = (): AddDefChara => command("adddefchara");
export type AddVoidChara = BaseCommand<"addvoidchara">;
export const addVoidChara = (): AddVoidChara => command("addvoidchara");
export type DelAllChara = BaseCommand<"delallchara">;
export const delAllChara = (): DelAllChara => command("delallchara");
export type ResetData = BaseCommand<"resetdata">;
export const resetData = (): ResetData => command("resetdata");
export type ResetGlobal = BaseCommand<"resetglobal">;
export const resetGlobal = (): ResetGlobal => command("resetglobal");
export type SaveGlobal = BaseCommand<"saveglobal">;
export const saveGlobal = (): SaveGlobal => command("saveglobal");
export type LoadGlobal = BaseCommand<"loadglobal">;
export const loadGlobal = (): LoadGlobal => command("loadglobal");
export type OutputLog = BaseCommand<"outputlog">;
export const outputLog = (): OutputLog => command("outputlog");
export type GetTime = BaseCommand<"gettime">;
export const getTime = (): GetTime => command("gettime");
export type GetMillisecond = BaseCommand<"getmillisecond">;
export const getMillisecond = (): GetMillisecond => command("getmillisecond");
export type GetSecond = BaseCommand<"getsecond">;
export const getSecond = (): GetSecond => command("getsecond");
export type ForceWait = BaseCommand<"forcewait">;
export const forceWait = (): ForceWait => command("forcewait");
export type WaitAnyKey = BaseCommand<"waitanykey">;
export const waitAnyKey = (): WaitAnyKey => command("waitanykey");
export type DumpRand = BaseCommand<"dumprand">;
export const dumpRand = (): DumpRand => command("dumprand");
export type InitRand = BaseCommand<"initrand">;
export const initRand = (): InitRand => command("initrand");
export type DebugClear = BaseCommand<"debugclear">;
export const debugClear = (): DebugClear => command("debugclear");
export type MouseX = BaseCommand<"mousex">;
export const mouseX = (): MouseX => command("mousex");
export type MouseY = BaseCommand<"mousey">;
export const mouseY = (): MouseY => command("mousey");
export type IsActive = BaseCommand<"isactive">;
export const isActive = (): IsActive => command("isactive");
export type CbgClear = BaseCommand<"cbgclear">;
export const cbgClear = (): CbgClear => command("cbgclear");
export type CbgClearButton = BaseCommand<"cbgclearbutton">;
export const cbgClearButton = (): CbgClearButton => command("cbgclearbutton");
export type CbgRemoveBmap = BaseCommand<"cbgremovebmap">;
export const cbgRemoveBmap = (): CbgRemoveBmap => command("cbgremovebmap");
export type ClearTextBox = BaseCommand<"cleartextbox">;
export const clearTextBox = (): ClearTextBox => command("cleartextbox");
export type StrData = BaseCommand<"strdata">;
export const strData = (): StrData => command("strdata");
export type StopCallTrain = BaseCommand<"stopcalltrain">;
export const stopCallTrain = (): StopCallTrain => command("stopcalltrain");

/* eslint-disable array-element-newline */
export type PlainCommand =
	| Print
	| DrawLine
	| ResetColor | ResetBgColor | GetColor | GetDefColor | GetBgColor | GetDefBgColor
	| GetFocusColor | GetStyle | GetFont | CurrentAlign | CurrentRedraw | PrintCPerLine
	| LineIsEmpty | IsSkip| MouseSkip | AddDefChara | AddVoidChara | DelAllChara | ResetData
	| ResetGlobal | SaveGlobal | LoadGlobal | OutputLog | GetTime | GetMillisecond | GetSecond
	| ForceWait | WaitAnyKey | DumpRand | InitRand | DebugClear | MouseX | MouseY | IsActive
	| CbgClear | CbgClearButton | CbgRemoveBmap | ClearTextBox | StrData | StopCallTrain;
/* eslint-enable array-element-newline */
export type Command = PlainCommand;

export type Conditional = Node<"conditional"> & {
	expr: Array<[IntExpr, Statement[]]>;
};
export const conditional = (expr: Conditional["expr"]): Conditional => ({
	...node("conditional"),
	expr,
});

export type Statement = Label | Command;

export type Fn = Node<"function"> & {
	name: string;
	statement: Statement[];
};
export const fn = (name: Fn["name"], statement: Fn["statement"]): Fn => ({
	...node("function"),
	name,
	statement,
});
