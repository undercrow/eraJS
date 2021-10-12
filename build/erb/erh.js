import prop from "./property";
import preprocess from "./preprocess";
export default function parseERH(content, macros) {
    const lineList = preprocess(content, macros);
    return lineList.map((line) => prop.tryParse(line));
}
