import * as U from "../../erb/util";
import Statement from "../index";
const PARSER = U.arg0R0();
export default class CUpCheck extends Statement {
    constructor(arg) {
        super();
        PARSER.tryParse(arg);
    }
    *run(vm) {
        const target = vm.getValue("TARGET").get(vm, [0]);
        const length = Math.min(vm.getValue("PALAM").length(1), vm.getValue("CUP").length(1), vm.getValue("CDOWN").length(1));
        for (let i = 0; i < length; ++i) {
            const up = vm.getValue("CUP").get(vm, [target, i]);
            const down = vm.getValue("CDOWN").get(vm, [target, i]);
            const palam = vm.getValue("PALAM").get(vm, [target, i]);
            if (up <= 0 && down <= 0) {
                continue;
            }
            const result = palam + up - down;
            vm.getValue("PALAM").set(vm, result, [target, i]);
            vm.getValue("CUP").set(vm, 0, [target, i]);
            vm.getValue("CDOWN").set(vm, 0, [target, i]);
            if (!vm.skipDisp) {
                const name = vm.code.data.palam.get(i);
                let text = `${name} ${palam}`;
                if (up > 0) {
                    text += `+${up}`;
                }
                if (down > 0) {
                    text += `-${down}`;
                }
                text += `=${result}`;
                yield* vm.print(text);
                yield* vm.newline();
            }
        }
        return null;
    }
}
