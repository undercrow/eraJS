import * as U from "../../parser/util";
import Statement from "../index";
const PARSER = U.arg0R0();
export default class PrintShopItem extends Statement {
    constructor(raw) {
        super(raw);
        U.tryParse(PARSER, raw);
    }
    *run(vm) {
        if (vm.queue.skipDisp) {
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
            yield* vm.queue.print(text, new Set(), "LEFT");
            if ((i + 1) % vm.printCPerLine === 0) {
                yield* vm.queue.newline();
            }
        }
        yield* vm.queue.newline();
        return null;
    }
}
