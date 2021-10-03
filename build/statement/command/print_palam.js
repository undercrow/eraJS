import { assertNumber } from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import Statement from "../index";
import Print from "./print";
import PrintC from "./printc";
const PARSER = U.arg1R1(E.expr);
export default class PrintPalam extends Statement {
    arg;
    constructor(arg) {
        super();
        this.arg = new Lazy(arg, PARSER);
    }
    *run(vm) {
        if (vm.skipDisp) {
            return null;
        }
        const index = this.arg.get().reduce(vm);
        assertNumber(index, "1st argument of PRINT_PALAM must be a number");
        const palamName = vm.getValue("PALAMNAME");
        const validName = [];
        for (let i = 0; i < palamName.length(0); ++i) {
            const name = palamName.get(vm, [i]);
            if (name !== "") {
                validName.push(name);
            }
        }
        for (let i = 0; i < validName.length; ++i) {
            const name = validName[i];
            const value = vm.getValue("PALAM").get(vm, [index, i]);
            const palamLv = [
                vm.getValue("PALAMLV").get(vm, [0]),
                vm.getValue("PALAMLV").get(vm, [1]),
                vm.getValue("PALAMLV").get(vm, [2]),
                vm.getValue("PALAMLV").get(vm, [3]),
                vm.getValue("PALAMLV").get(vm, [4]),
            ];
            let text = name;
            if (value >= palamLv[4]) {
                text += "[" + "*".repeat(10) + "]";
            }
            else if (value >= palamLv[3]) {
                const filled = Math.floor(10 * (value / palamLv[4]));
                text += "[" + "*".repeat(filled) + ".".repeat(10 - filled) + "]";
            }
            else if (value >= palamLv[2]) {
                const filled = Math.floor(10 * (value / palamLv[3]));
                text += "[" + ">".repeat(filled) + ".".repeat(10 - filled) + "]";
            }
            else if (value >= palamLv[1]) {
                const filled = Math.floor(10 * (value / palamLv[2]));
                text += "[" + "=".repeat(filled) + ".".repeat(10 - filled) + "]";
            }
            else {
                const filled = Math.floor(10 * (value / palamLv[1]));
                text += "[" + "-".repeat(filled) + ".".repeat(10 - filled) + "]";
            }
            text += value.toString();
            yield* new PrintC("LEFT", "", " " + text).run(vm);
            if ((i + 1) % vm.printCPerLine === 0) {
                yield* Print.print(vm, "\n");
            }
        }
        yield* Print.print(vm, "\n");
        return null;
    }
}
