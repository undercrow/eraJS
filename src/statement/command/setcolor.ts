import {assertNumber} from "../../assert";
import * as color from "../../color";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

export default class SetColor extends Statement {
	public value: Expr;

	public constructor(value: Expr) {
		super();
		this.value = value;
	}

	public *run(vm: VM) {
		const value = this.value.reduce(vm);
		assertNumber(value, "Argument of SETCOLOR must be an integer");

		vm.color.front = color.hex(value);

		return null;
	}
}
