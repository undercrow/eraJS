import * as U from "../../parser/util";
import Slice from "../../slice";
import type VM from "../../vm";
import Statement from "../index";

const PARSER = U.arg0R0();
export default class PrintShopItem extends Statement {
	public constructor(raw: Slice) {
		super(raw);

		U.tryParse(PARSER, raw);
	}

	public async *run(vm: VM) {
		if (vm.printer.skipDisp) {
			return null;
		}

		const itemName = vm.getValue("ITEMNAME");
		const validItem: number[] = [];
		for (let i = 0; i < itemName.length(0); ++i) {
			const name = itemName.get(vm, [i]) as string;
			if (name !== "") {
				validItem.push(i);
			}
		}

		for (let i = 0; i < validItem.length; ++i) {
			const index = validItem[i];
			const name = itemName.get(vm, [index]) as string;
			const price = vm.getValue("ITEMPRICE").get(vm, [index]) as number;
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
