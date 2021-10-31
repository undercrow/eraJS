import * as U from "../../parser/util";
import Statement from "../index";
const PARSER = U.arg0R0();
export default class PrintShopItem extends Statement {
    constructor(raw) {
        super(raw);
        U.tryParse(PARSER, raw);
    }
    async *run(vm) {
        if (vm.printer.skipDisp) {
            return null;
        }
        const itemName = vm.getValue("ITEMNAME");
        const validItem = [];
        for (let i = 0; i < itemName.length(0); ++i) {
            const name = itemName.get(vm, [i]);
            if (name !== "") {
                validItem.push(i);
            }
        }
        for (let i = 0; i < validItem.length; ++i) {
            const index = validItem[i];
            const name = itemName.get(vm, [index]);
            const price = vm.getValue("ITEMPRICE").get(vm, [index]);
            const text = `[${index}] ${name}(${price}$)`;
            yield* vm.printer.print(text, new Set(), "LEFT");
            if ((i + 1) % vm.printCPerLine === 0) {
                yield* vm.printer.newline();
            }
        }
        yield* vm.printer.newline();
        return null;
    }
}
