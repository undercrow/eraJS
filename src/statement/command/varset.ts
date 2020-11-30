import {assertNumber} from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import type Variable from "../expr/variable";
import Statement from "../index";

export default class VarSet extends Statement {
	public arg: Lazy<[Variable, Expr | undefined, Expr | undefined, Expr | undefined]>;

	public constructor(arg: string) {
		super();
		this.arg = new Lazy(arg, U.arg4R1(E.variable, E.expr, E.expr, E.expr));
	}

	public *run(vm: VM) {
		const [destExpr, valueExpr, startExpr, endExpr] = this.arg.get();

		const dest = vm.getValue(destExpr.name);
		const index = destExpr.reduceIndex(vm);
		const start = startExpr?.reduce(vm) ?? 0;
		assertNumber(start, "3rd argument of VARSET must be a number");
		const end = endExpr?.reduce(vm) ?? dest.length(index.length);
		assertNumber(end, "4th argument of VARSET must be a number");

		if (valueExpr != null) {
			const value = valueExpr.reduce(vm);

			for (let i = start; i < end; ++i) {
				dest.set(vm, value, [...index, i]);
			}
		} else {
			if (dest.type === "number") {
				for (let i = start; i < end; ++i) {
					dest.set(vm, 0, [...index, i]);
				}
			} else {
				for (let i = start; i < end; ++i) {
					dest.set(vm, "", [...index, i]);
				}
			}
		}

		return null;
	}
}
