import type VM from "../vm";
import Expr from "./expr";
import Variable from "./expr/variable";
import Statement from "./index";

export default class Assign extends Statement {
	public dest: Variable;
	public expr: Expr | Expr[];

	public constructor(dest: Variable, expr: Assign["expr"]) {
		super();
		this.dest = dest;
		this.expr = expr;
	}

	public *run(vm: VM) {
		const index = this.dest.reduceIndex(vm);

		if (Array.isArray(this.expr)) {
			for (let i = 0; i < this.expr.length; ++i) {
				const value = this.expr[i].reduce(vm);
				vm.setValue(value, this.dest.name, ...index, i);
			}
		} else {
			const value = this.expr.reduce(vm);
			vm.setValue(value, this.dest.name, ...index);
		}

		return null;
	}
}
