import * as U from "../../parser/util";
import Statement from "../index";
const PARSER = U.arg0R0();
export default class UpCheck extends Statement {
    constructor(raw) {
        super(raw);
        U.tryParse(PARSER, raw);
    }
    async *run(vm) {
        const length = Math.min(vm.getValue("PALAM").length(1), vm.getValue("UP").length(0), vm.getValue("DOWN").length(0));
        for (let i = 0; i < length; ++i) {
            const up = vm.getValue("UP").get(vm, [i]);
            const down = vm.getValue("DOWN").get(vm, [i]);
            const palam = vm.getValue("PALAM").get(vm, [i]);
            if (up <= 0 && down <= 0) {
                continue;
            }
            const result = palam + up - down;
            vm.getValue("PALAM").set(vm, result, [i]);
            vm.getValue("UP").set(vm, 0n, [i]);
            vm.getValue("DOWN").set(vm, 0n, [i]);
            if (!vm.printer.skipDisp) {
                const name = vm.code.csv.palam.get(i);
                let text = `${name} ${palam}`;
                if (up > 0) {
                    text += `+${up}`;
                }
                if (down > 0) {
                    text += `-${down}`;
                }
                text += `=${result}`;
                yield* vm.printer.print(text, new Set(["L"]));
            }
        }
        return null;
    }
}
