import Property from "../property";
import prop from "./property";
import preprocess from "./preprocess";

export default function parseERH(content: string, macros: Set<string>): Property[] {
	const lineList = preprocess(content, macros);

	return lineList.map((line) => prop.tryParse(line));
}
