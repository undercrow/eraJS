import {assertNumber} from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

export default class ClearLine extends Statement {
	public count: Expr;

	public constructor(count: Expr) {
		super();
		this.count = count;
	}

	public *run(vm: VM) {
		const value = this.count.reduce(vm);
		assertNumber(value, "Argument of CLEARLINE must be an integer!");

		yield <const>{type: "clearline", count: value};

		const lineCount = vm.getValue("LINECOUNT").get(vm, [0]) as number;
		vm.getValue("LINECOUNT").set(vm, lineCount - value, []);

		return null;
	}
}
