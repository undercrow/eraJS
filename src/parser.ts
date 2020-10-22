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

function skip(parser: P.Parser<any>): P.Parser<null> {
	return parser.map(() => null);
}

type LanguageSpec = {
	Whitespace: null;
	Whitespace0M: null;
	Whitespace1M: null;
	EOL: null;
	Identifier: string;
	Label: ast.Label;
	Goto: ast.Goto;
	PlainCommand: ast.PlainCommand;
	Command: ast.Command;
	Statement: ast.Statement;
	Language: ast.Statement[];
};

const language = P.createLanguage<LanguageSpec>({
	// eslint-disable-next-line no-irregular-whitespace
	Whitespace: () => skip(P.alt(P.string(" "), P.string("\t"), P.string("　"))),
	Whitespace0M: (r) => skip(r.Whitespace.many()),
	Whitespace1M: (r) => skip(r.Whitespace.atLeast(1)),
	EOL: (r) => P.alt(r.Whitespace, P.newline).atLeast(1).map(() => null),
	Identifier: () => P.noneOf(SPECIAL_CHAR.join("")).atLeast(1).tie(),
	Label: (r) => P.string("@").then(r.Identifier).map(ast.label).skip(r.EOL),
	Goto: (r) => P.string("$").then(r.Identifier).map(ast.goto).skip(r.EOL),
	PlainCommand: (r) => P.alt(
		r.Whitespace0M.then(P.string("DRAWLINE")).map(ast.drawLine).skip(r.EOL),
		r.Whitespace0M.then(P.string("RESETCOLOR")).map(ast.resetColor).skip(r.EOL),
		r.Whitespace0M.then(P.string("RESETBGCOLOR")).map(ast.resetBgColor).skip(r.EOL),
		r.Whitespace0M.then(P.string("GETCOLOR")).map(ast.getColor).skip(r.EOL),
		r.Whitespace0M.then(P.string("GETDEFCOLOR")).map(ast.getDefColor).skip(r.EOL),
		r.Whitespace0M.then(P.string("GETBGCOLOR")).map(ast.getBgColor).skip(r.EOL),
		r.Whitespace0M.then(P.string("GETDEFBGCOLOR")).map(ast.getDefBgColor).skip(r.EOL),
		r.Whitespace0M.then(P.string("GETFOCUSCOLOR")).map(ast.getFocusColor).skip(r.EOL),
		r.Whitespace0M.then(P.string("GETSTYLE")).map(ast.getStyle).skip(r.EOL),
		r.Whitespace0M.then(P.string("GETFONT")).map(ast.getFont).skip(r.EOL),
		r.Whitespace0M.then(P.string("CURRENTALIGN")).map(ast.currentAlign).skip(r.EOL),
		r.Whitespace0M.then(P.string("CURRENTREDRAW")).map(ast.currentRedraw).skip(r.EOL),
		r.Whitespace0M.then(P.string("PRINTCPERLINE")).map(ast.printCPerLine).skip(r.EOL),
		r.Whitespace0M.then(P.string("LINEISEMPTY")).map(ast.lineIsEmpty).skip(r.EOL),
		r.Whitespace0M.then(P.string("ISSKIP")).map(ast.isSkip).skip(r.EOL),
		r.Whitespace0M.then(P.string("MOUSESKIP")).map(ast.mouseSkip).skip(r.EOL),
		r.Whitespace0M.then(P.string("ADDDEFCHARA")).map(ast.addDefChara).skip(r.EOL),
		r.Whitespace0M.then(P.string("ADDVOIDCHARA")).map(ast.addVoidChara).skip(r.EOL),
		r.Whitespace0M.then(P.string("DELALLCHARA")).map(ast.delAllChara).skip(r.EOL),
		r.Whitespace0M.then(P.string("RESETDATA")).map(ast.resetData).skip(r.EOL),
		r.Whitespace0M.then(P.string("RESETGLOBAL")).map(ast.resetGlobal).skip(r.EOL),
		r.Whitespace0M.then(P.string("SAVEGLOBAL")).map(ast.saveGlobal).skip(r.EOL),
		r.Whitespace0M.then(P.string("LOADGLOBAL")).map(ast.loadGlobal).skip(r.EOL),
		r.Whitespace0M.then(P.string("OUTPUTLOG")).map(ast.outputLog).skip(r.EOL),
		r.Whitespace0M.then(P.string("GETTIME")).map(ast.getTime).skip(r.EOL),
		r.Whitespace0M.then(P.string("GETMILLISECOND")).map(ast.getMillisecond).skip(r.EOL),
		r.Whitespace0M.then(P.string("GETSECOND")).map(ast.getSecond).skip(r.EOL),
		r.Whitespace0M.then(P.string("FORCEWAIT")).map(ast.forceWait).skip(r.EOL),
		r.Whitespace0M.then(P.string("WAITANYKEY")).map(ast.waitAnyKey).skip(r.EOL),
		r.Whitespace0M.then(P.string("DUMPRAND")).map(ast.dumpRand).skip(r.EOL),
		r.Whitespace0M.then(P.string("INITRAND")).map(ast.initRand).skip(r.EOL),
		r.Whitespace0M.then(P.string("DEBUGCLEAR")).map(ast.debugClear).skip(r.EOL),
		r.Whitespace0M.then(P.string("MOUSEX")).map(ast.mouseX).skip(r.EOL),
		r.Whitespace0M.then(P.string("MOUSEY")).map(ast.mouseY).skip(r.EOL),
		r.Whitespace0M.then(P.string("ISACTIVE")).map(ast.isActive).skip(r.EOL),
		r.Whitespace0M.then(P.string("CBGCLEAR")).map(ast.cbgClear).skip(r.EOL),
		r.Whitespace0M.then(P.string("CBGCLEARBUTTON")).map(ast.cbgClearButton).skip(r.EOL),
		r.Whitespace0M.then(P.string("CBGREMOVEBMAP")).map(ast.cbgRemoveBmap).skip(r.EOL),
		r.Whitespace0M.then(P.string("CLEARTEXTBOX")).map(ast.clearTextBox).skip(r.EOL),
		r.Whitespace0M.then(P.string("STRDATA")).map(ast.strData).skip(r.EOL),
		r.Whitespace0M.then(P.string("STOPCALLTRAIN")).map(ast.stopCallTrain).skip(r.EOL),
	),
	Command: (r) => r.PlainCommand,
	Statement: (r) => P.alt(
		r.Label,
		r.Goto,
		r.Command,
	),
	Language: (r) => r.Statement.many().skip(P.eof),
});

export default function parse(content: string): ast.Statement[] {
	return language.Language.tryParse(content + "\n");
}
