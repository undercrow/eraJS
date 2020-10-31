import P from "parsimmon";

import Property from "../property";
import prop from "./property";

const parser = prop.many().skip(P.eof);

export default function parseERH(content: string): Property[] {
	return parser.tryParse(content + "\n");
}
