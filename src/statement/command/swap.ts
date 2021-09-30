import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import type Variable from "../expr/variable";
import Statement from "../index";

const PARSER = U.arg2R2(E.variable, E.variable);
export default class Swap extends Statement {
	public arg: Lazy<[Variable, Variable]>;

	public constructor(arg: string) {
		super();
		this.arg = new Lazy(arg, PARSER);
	}

	public *run(vm: VM) {
		const [leftExpr, rightExpr] = this.arg.get();
		const left = vm.getValue(leftExpr.name);
		const leftIndex = leftExpr.reduceIndex(vm);
		const right = vm.getValue(rightExpr.name);
		const rightIndex = rightExpr.reduceIndex(vm);

		const leftValue = left.get(vm, leftIndex);
		const rightValue = right.get(vm, rightIndex);
		left.set(vm, rightValue, leftIndex);
		right.set(vm, leftValue, rightIndex);

		return null;
	}
}
