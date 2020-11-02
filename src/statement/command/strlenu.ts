import {assertString} from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

export default class StrLenU extends Statement {
	public expr: Expr;

	public constructor(expr: Expr) {
		super();
		this.expr = expr;
	}

	public *run(vm: VM) {
		const value = this.expr.reduce(vm);
		assertString(value, "Argument of STRLENU must be a string!");
		vm.setValue(value.length, "RESULT", 0);

		return null;
	}
}
