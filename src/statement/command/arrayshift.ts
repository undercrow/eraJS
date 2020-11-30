import {assertNumber} from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import type Variable from "../expr/variable";
import Statement from "../index";

export default class ArrayShift extends Statement {
	public arg: Lazy<[Variable, Expr, Expr]>;

	public constructor(arg: string) {
		super();
		this.arg = new Lazy(arg, U.arg3R3(E.variable, E.expr, E.expr));
	}

	public *run(vm: VM) {
		const [targetExpr, countExpr, fillExpr] = this.arg.get();

		const target = vm.getValue(targetExpr.name);
		const index = targetExpr.reduceIndex(vm);
		const length = target.length(index.length);
		const count = countExpr.reduce(vm);
		assertNumber(count, "2nd argument of ARRAYSHIFT must be a number");
		const fill = fillExpr.reduce(vm);

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
