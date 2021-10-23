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

	public *run(vm: VM) {
		if (vm.queue.skipDisp) {
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

			yield* vm.queue.print(text, "LEFT");
			if ((i + 1) % vm.printCPerLine === 0) {
				yield* vm.queue.newline();
			}
		}
		yield* vm.queue.newline();

		return null;
	}
}