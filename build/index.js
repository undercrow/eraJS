import parseCSV from "./data";
import parseERB from "./parser/erb";
import parseERH from "./parser/erh";
import Define from "./property/define";
import VM from "./vm";
export { default as EraJSError } from "./error";
export function compile(files) {
    const csvFiles = new Map();
    const erhFiles = new Map();
    const erbFiles = new Map();
    for (const [file, content] of files) {
        const FILE = file.toUpperCase();
        if (FILE.endsWith(".CSV")) {
            csvFiles.set(file, content);
        }
        else if (FILE.endsWith(".ERH")) {
            erhFiles.set(file, content);
        }
        else if (FILE.endsWith(".ERB")) {
            erbFiles.set(file, content);
        }
    }
    const data = parseCSV(csvFiles);
    const macros = new Set();
    const header = parseERH(erhFiles, macros);
    for (const property of header) {
        if (property instanceof Define) {
            macros.add(property.name);
        }
    }
    const fnList = parseERB(erbFiles, macros);
    return new VM({ header, fnList, data });
}
