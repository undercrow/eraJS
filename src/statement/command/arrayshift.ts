import {assertNumber} from "../../assert";
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
		const target = vm.getValue(this.target.name);
		const index = this.target.reduceIndex(vm);
		const length = target.length(index.length);
		const count = this.count.reduce(vm);
		assertNumber(count, "2nd argument of ARRAYSHIFT must be a number");
		const fill = this.fill.reduce(vm);

		if (count > 0) {
			for (let i = length - 1; i >= count; --i) {
				const value = target.get(vm, [...index, i - count]);
				target.set(vm, value, [...index, i]);
			}
			for (let i = count - 1; i >= 0; --i) {
				target.set(vm, fill, [...index, i]);
			}
		} else if (count < 0) {
			for (let i = 0; i < length + count; ++i) {
				const value = target.get(vm, [...index, i + count]);
				target.set(vm, value, [...index, i]);
			}
			for (let i = length + count; i < length; ++i) {
				target.set(vm, fill, [...index, i]);
			}
		}

		return null;
	}
}
