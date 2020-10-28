import {assertString} from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";
import type Statement from "../index";

export default class StrLen implements Statement {
	public expr: Expr;

	public constructor(expr: Expr) {
		this.expr = expr;
	}

	public *run(vm: VM) {
		const value = this.expr.reduce(vm);
		assertString(value, "Argument of STRLEN must be a string!");
		vm.setValue(value.length, "RESULT", 0);

		return null;
	}
}
