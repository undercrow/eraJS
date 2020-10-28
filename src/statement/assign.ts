import {assertNumber} from "../assert";
import type VM from "../vm";
import Expr from "./expr";
import Variable from "./expr/variable";
import Statement from "./index";

// TODO: index
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
		const index = this.dest.index.map((i) => i.reduce(vm));
		index.forEach((i) => assertNumber(i, "Index of variable should be an integer"));

		vm.setValue(value, this.dest.name, ...index.length === 0 ? [0] : index as number[]);

		return null;
	}
}
