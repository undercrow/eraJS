import {assert, assertNumber} from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";
import type Variable from "../expr/variable";
import Statement from "../index";

export default class ArrayShift extends Statement {
	public target: Variable;
	public count: Expr;
	public fill: Expr;

	public constructor(target: Variable, count: Expr, fill: Expr) {
		super();
		this.target = target;
		this.count = count;
		this.fill = fill;
	}

	public *run(vm: VM) {
		const index = this.target.reduceIndex(vm);
		const length = vm.lengthOf(this.target.name, index.length as 0 | 1 | 2);
		const count = this.count.reduce(vm);
		assertNumber(count, "2nd argument of ARRAYSHIFT must be a number");
		const fill = this.fill.reduce(vm);
		assert(
			typeof fill === vm.typeof(this.target.name),
			"Cannot assign different type of value to variable",
		);

		if (count > 0) {
			for (let i = length - 1; i >= count; --i) {
				const value = vm.getValue(this.target.name, ...index, i - count);
				vm.setValue(value, this.target.name, ...index, i);
			}
			for (let i = count - 1; i >= 0; --i) {
				vm.setValue(fill, this.target.name, ...index, i);
			}
		} else if (count < 0) {
			for (let i = 0; i < length + count; ++i) {
				const value = vm.getValue(this.target.name, ...index, i + count);
				vm.setValue(value, this.target.name, ...index, i);
			}
			for (let i = length + count; i < length; ++i) {
				vm.setValue(fill, this.target.name, ...index, i);
			}
		}

		return null;
	}
}
