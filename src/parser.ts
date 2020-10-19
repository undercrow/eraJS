import * as P from "parsimmon";

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
	Identifier: string;
	Label: string;
	Goto: string;
	Line: ast.Node | null;
	MultiLine: (ast.Node | null)[];
};

const language = P.createLanguage<LanguageSpec>({
	// eslint-disable-next-line no-irregular-whitespace
	Whitespace: () => skip(P.alt(P.string(" "), P.string("\t"), P.string("　"))),
	Whitespace0M: (r) => skip(r.Whitespace.many()),
	Whitespace1M: (r) => skip(r.Whitespace.atLeast(1)),
	Identifier: () => P.noneOf(SPECIAL_CHAR.join("")).atLeast(1).tie(),
	Label: (r) => P.string("@").then(r.Identifier),
	Goto: (r) => P.string("$").then(r.Identifier),
	Line: (r) => P.alt(
		r.Label.skip(r.Whitespace0M).map((val) => ast.label(val)),
		r.Goto.skip(r.Whitespace0M).map((val) => ast.goto(val)),
	),
	MultiLine: (r) => r.Line.sepBy(P.newline).skip(P.eof),
});

export default function parse(content: string): ast.Node[] {
	const lines = language.MultiLine.tryParse(content);
	return lines.filter((line) => line != null) as ast.Node[];
}
