import Property from "../property";
import prop from "./property";
import preprocess from "./preprocess";

export default function parseERH(content: string): Property[] {
	const lineList = preprocess(content);

	return lineList.map((line) => prop.tryParse(line));
}
