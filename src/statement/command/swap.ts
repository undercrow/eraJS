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
		const left = vm.getValue(this.left.name);
		const leftIndex = this.left.reduceIndex(vm);
		const right = vm.getValue(this.right.name);
		const rightIndex = this.right.reduceIndex(vm);

		const length = left.length(leftIndex.length);
		for (let i = 0; i < length; ++i) {
			const leftValue = left.get(vm, [...leftIndex, i]);
			const rightValue = right.get(vm, [...rightIndex, i]);
			left.set(vm, rightValue, [...leftIndex, i]);
			right.set(vm, leftValue, [...rightIndex, i]);
		}

		return null;
	}
}
