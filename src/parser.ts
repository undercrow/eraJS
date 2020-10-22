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

// eslint-disable-next-line no-irregular-whitespace
const WS = P.alt(P.string(" "), P.string("\t"), P.string("　")).map(nullFn);
const WS0 = WS.many().map(nullFn);
const Comment = P.seq(WS0, P.string(";"), P.noneOf("\r\n").many());
const EOL = P.alt(Comment, WS, P.newline).atLeast(1).map(nullFn);
const Identifier = P.noneOf(SPECIAL_CHAR.join("")).atLeast(1).tie();

function asLine<T>(parser: P.Parser<T>, leadingSpace: boolean = true): P.Parser<T> {
	return (leadingSpace ? WS0 : P.string("")).then(parser).skip(EOL);
}

type LanguageSpec = {
	Label: ast.Label;
	Goto: ast.Goto;
	PlainCommand: ast.PlainCommand;
	Command: ast.Command;
	Statement: ast.Statement;
	Language: ast.Statement[];
};

const language = P.createLanguage<LanguageSpec>({
	Label: () => asLine(P.string("@").then(Identifier).map(ast.label), false),
	Goto: () => asLine(P.string("$").then(Identifier).map(ast.goto), false),
	PlainCommand: () => P.alt(
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
