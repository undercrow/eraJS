import * as assert from "../../assert";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

const PARSER = U.arg1R1(X.expr);
export default class PrintPalam extends Statement {
	public arg: Lazy<Expr>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public async *run(vm: VM) {
		if (vm.printer.skipDisp) {
			return null;
		}

		const index = await this.arg.get().reduce(vm);
		assert.number(index, "1st argument of PRINT_PALAM must be a number");

		const palamName = vm.getValue("PALAMNAME");
		const validName: string[] = [];
		for (let i = 0; i < palamName.length(0); ++i) {
			const name = palamName.get(vm, [i]) as string;
			if (name !== "") {
				validName.push(name);
			}
		}

		for (let i = 0; i < validName.length; ++i) {
			const name = validName[i];
			const value = vm.getValue("PALAM").get(vm, [index, i]) as number;
			const palamLv = [
				vm.getValue("PALAMLV").get(vm, [0]) as number,
				vm.getValue("PALAMLV").get(vm, [1]) as number,
				vm.getValue("PALAMLV").get(vm, [2]) as number,
				vm.getValue("PALAMLV").get(vm, [3]) as number,
				vm.getValue("PALAMLV").get(vm, [4]) as number,
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

			yield* vm.printer.print(text, new Set(), "LEFT");
			if ((i + 1) % vm.printCPerLine === 0) {
				yield* vm.printer.newline();
			}
		}
		yield* vm.printer.newline();

		return null;
	}
}
