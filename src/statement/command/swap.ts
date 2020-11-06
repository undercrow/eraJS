import type VM from "../../vm";
import type Variable from "../expr/variable";
import Statement from "../index";

export default class Swap extends Statement {
	public left: Variable;
	public right: Variable;

	public constructor(left: Variable, right: Variable) {
		super();
		this.left = left;
		this.right = right;
	}

	public *run(vm: VM) {
		const leftIndex = this.left.reduceIndex(vm);
		const rightIndex = this.right.reduceIndex(vm);

		const length = vm.lengthOf(this.left.name, leftIndex.length as 0 | 1 | 2);
		for (let i = 0; i < length; ++i) {
			const left = vm.getValue(this.left.name, ...leftIndex, i);
			const right = vm.getValue(this.right.name, ...rightIndex, i);
			vm.setValue(right, this.left.name, ...leftIndex, i);
			vm.setValue(left, this.right.name, ...rightIndex, i);
		}

		return null;
	}
}
