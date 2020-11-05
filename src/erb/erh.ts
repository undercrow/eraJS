import P from "parsimmon";

import Property from "../property";
import prop from "./property";

const parser = prop.many().skip(P.eof);

export default function parseERH(content: string): Property[] {
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

	return parser.tryParse(filtered + "\n");
}
