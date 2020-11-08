import {assertNumber} from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

export default class BarStr extends Statement {
	public value: Expr;
	public max: Expr;
	public length: Expr;
	public constructor(value: Expr, max: Expr, length: Expr) {
		super();
		this.value = value;
		this.max = max;
		this.length = length;
	}

	public *run(vm: VM) {
		const value = this.value.reduce(vm);
		assertNumber(value, "1st argument of BAR must be a number");
		const max = this.max.reduce(vm);
		assertNumber(max, "2nd argument of BAR must be a number");
		const length = this.length.reduce(vm);
		assertNumber(length, "3rd argument of BAR must be a number");

		const filled = Math.floor(length * (value / max));
		const result = "[" + "*".repeat(filled) + ".".repeat(length - filled) + "]";
		vm.getValue("RESULTS").set(vm, result, [0]);

		return null;
	}
}
