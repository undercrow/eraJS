import type VM from "../vm";
import Expr from "./expr";
import type Statement from "./index";

// TODO: index
export default class Assign implements Statement {
	public dest: string;
	public expr: Expr;

	public constructor(dest: string, expr: Expr) {
		this.dest = dest;
		this.expr = expr;
	}

	public *run(vm: VM) {
		const value = this.expr.reduce(vm);
		vm.setValue(value, this.dest, 0);

		return null;
	}
}
