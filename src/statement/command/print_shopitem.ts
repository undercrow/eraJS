import type VM from "../../vm";
import Const from "../expr/const";
import Statement from "../index";
import PrintC from "./printc";

export default class PrintShopItem extends Statement {
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
			yield* new PrintC("PRINTC", new Const(text)).run(vm);
		}

		return null;
	}
}
