import * as U from "../../erb/util";
import type VM from "../../vm";
import Statement from "../index";
import PrintC from "./printc";

export default class PrintShopItem extends Statement {
	public constructor(arg: string) {
		super();
		U.arg0R0().tryParse(arg);
	}

	public *run(vm: VM) {
		if (vm.skipDisp) {
			return null;
		}

		const itemName = vm.getValue("ITEMNAME");
		for (let i = 0; i < itemName.length(0); ++i) {
			const name = itemName.get(vm, [i]) as string;
			if (name === "") {
				continue;
			}

			const price = vm.getValue("ITEMPRICE").get(vm, [i]) as number;
			const text = `[${i}] ${name}(${price}$)`;
			yield* new PrintC("LEFT", "", text).run(vm);
		}

		return null;
	}
}
