import type VM from "../../vm";
import type Expr from "../expr";
import Variable from "../expr/variable";
import Statement from "../index";

export default class StrAssign extends Statement {
	public dest: Variable;
	public value: Expr[];

	public constructor(dest: Variable, value: Expr[]) {
		super();
		this.dest = dest;
		this.value = value;
	}

	public *run(vm: VM) {
		const dest = vm.getValue(this.dest.name);
		const index = this.dest.reduceIndex(vm);
		const partialIndex = index.slice(0, -1);
		const lastIndex = index[index.length - 1] ?? 0;

		for (let i = 0; i < this.value.length; ++i) {
			const value = this.value[i].reduce(vm);
			dest.set(vm, value, [...partialIndex, lastIndex + i]);
		}

		return null;
	}
}
