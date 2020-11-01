import type VM from "../../vm";
import type Expr from "../expr";
import type Variable from "../expr/variable";
import Statement from "../index";

export default class VarSet extends Statement {
	public dest: Variable;
	public value: Expr;

	public constructor(dest: Variable, value: Expr) {
		super();
		this.dest = dest;
		this.value = value;
	}

	public *run(vm: VM) {
		const index = this.dest.reduceIndex(vm);
		const value = this.value.reduce(vm);

		const length = vm.lengthOf(this.dest.name, index.length as 0 | 1 | 2);
		for (let i = 0; i < length; ++i) {
			vm.setValue(value, this.dest.name, ...index, i);
		}

		return null;
	}
}
