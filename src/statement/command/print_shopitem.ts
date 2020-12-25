import * as U from "../../erb/util";
import type VM from "../../vm";
import Statement from "../index";
import Print from "./print";
import PrintC from "./printc";

const PARSER = U.arg0R0();
export default class PrintShopItem extends Statement {
	public constructor(arg: string) {
		super();
		PARSER.tryParse(arg);
	}

	public *run(vm: VM) {
		if (vm.skipDisp) {
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

			yield* new PrintC("LEFT", "", " " + text).run(vm);
			if ((i + 1) % vm.printCPerLine === 0) {
				yield* Print.print(vm, "\n");
			}
		}
		yield* Print.print(vm, "\n");

		return null;
	}
}
