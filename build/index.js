import parseCSV from "./data";
import parseERB from "./erb/erb";
import parseERH from "./erb/erh";
import Define from "./property/define";
import VM from "./vm";
export function compile(erh, erb, csv) {
    const data = parseCSV(csv);
    const macros = new Set();
    let header = [];
    for (const content of erh) {
        const parsed = parseERH(content, macros);
        for (const property of parsed) {
            if (property instanceof Define) {
                macros.add(property.name);
            }
        }
        header = header.concat(parsed);
    }
    let fnList = [];
    for (const content of erb) {
        fnList = fnList.concat(parseERB(content, macros));
    }
    return new VM({ header, fnList, data });
}
