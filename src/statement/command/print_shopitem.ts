import type VM from "../../vm";
import Const from "../expr/const";
import Statement from "../index";
import PrintC from "./printc";

export default class PrintShopItem extends Statement {
	public *run(vm: VM) {
		if (vm.skipDisp) {
			return null;
		}

		const itemLength = vm.lengthOf("ITEMNAME", 0);
		for (let i = 0; i < itemLength; ++i) {
			const name = vm.getValue("ITEMNAME", i) as string;
			if (name === "") {
				continue;
			}

			const price = vm.getValue("ITEMPRICE", i) as number;

			const text = `[${i}] ${name}(${price}$)`;
			yield* new PrintC("PRINTC", new Const(text)).run(vm);
		}

		return null;
	}
}
