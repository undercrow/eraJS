import type VM from "../../vm";
import type Form from "../expr/form";
import Variable from "../expr/variable";
import Statement from "../index";

export default class Assign extends Statement {
	public dest: Variable;
	public value: Form[];

	public constructor(dest: Variable, value: Form[]) {
		super();
		this.dest = dest;
		this.value = value;
	}

	public *run(vm: VM) {
		const dest = vm.getValue(this.dest.name);
		const index = this.dest.reduceIndex(vm);
		const partialIndex = index.slice(0, -1);
		const lastIndex = index[index.length - 1] ?? 0;

		if (this.value.length !== 0) {
			for (let i = 0; i < this.value.length; ++i) {
				const value = this.value[i].reduce(vm);
				dest.set(vm, value, [...partialIndex, lastIndex + i]);
			}
		} else {
			dest.set(vm, "", index);
		}

		return null;
	}
}
