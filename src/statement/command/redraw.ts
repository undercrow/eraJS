import {assertNumber} from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

export default class Redraw extends Statement {
	public value: Expr;

	public constructor(value: Expr) {
		super();
		this.value = value;
	}

	public *run(vm: VM) {
		const value = this.value.reduce(vm);
		assertNumber(value, "Argument of REDRAW must be a number");

		vm.draw = value !== 0;

		return null;
	}
}
