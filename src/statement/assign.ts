import type VM from "../vm";
import Expr from "./expr";
import Variable from "./expr/variable";
import Statement from "./index";

export default class Assign extends Statement {
	public dest: Variable;
	public expr: Expr;

	public constructor(dest: Variable, expr: Expr) {
		super();
		this.dest = dest;
		this.expr = expr;
	}

	public *run(vm: VM) {
		const value = this.expr.reduce(vm);
		const index = this.dest.reduceIndex(vm);

		vm.setValue(value, this.dest.name, ...index);

		return null;
	}
}
