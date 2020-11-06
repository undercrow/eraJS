import {assertNumber} from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

export default class PrintPalam extends Statement {
	public index: Expr;

	public constructor(index: Expr) {
		super();
		this.index = index;
	}

	public *run(vm: VM) {
		const index = this.index.reduce(vm);
		assertNumber(index, "1st argument of PRINT_PALAM must be a number");
		const palamLength = vm.lengthOf("PALAMNAME", 0);
		for (let i = 0; i < palamLength; ++i) {
			const name = vm.getValue("PALAMNAME", i) as string;
			if (name === "") {
				continue;
			}

			const value = vm.getValue("PALAM", index, i) as number;
			const palamLv = [
				vm.getValue("PALAMLV", 0) as number,
				vm.getValue("PALAMLV", 1) as number,
				vm.getValue("PALAMLV", 2) as number,
				vm.getValue("PALAMLV", 3) as number,
				vm.getValue("PALAMLV", 4) as number,
			];

			let text = name;
			if (value >= palamLv[4]) {
				text += "[" + "*".repeat(10) + "]";
			} else if (value >= palamLv[3]) {
				const filled = Math.floor(10 * (value / palamLv[4]));
				text += "[" + "*".repeat(filled) + ".".repeat(10 - filled) + "]";
			} else if (value >= palamLv[2]) {
				const filled = Math.floor(10 * (value / palamLv[3]));
				text += "[" + ">".repeat(filled) + ".".repeat(10 - filled) + "]";
			} else if (value >= palamLv[1]) {
				const filled = Math.floor(10 * (value / palamLv[2]));
				text += "[" + "=".repeat(filled) + ".".repeat(10 - filled) + "]";
			} else {
				const filled = Math.floor(10 * (value / palamLv[1]));
				text += "[" + "-".repeat(filled) + ".".repeat(10 - filled) + "]";
			}

			text += value.toString();

			yield <const>{
				type: "string",
				text,
			};
		}

		return null;
	}
}