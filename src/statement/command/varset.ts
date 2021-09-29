import {assertNumber} from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import type Variable from "../expr/variable";
import Statement from "../index";

const PARSER = U.arg4R1(E.variable, E.expr, E.expr, E.expr);
export default class VarSet extends Statement {
	public arg: Lazy<[Variable, Expr | undefined, Expr | undefined, Expr | undefined]>;

	public constructor(arg: string) {
		super();
		this.arg = new Lazy(arg, PARSER);
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
			dest.rangeSet(vm, value, index, [start, end]);
		} else {
			if (dest.type === "number") {
				dest.rangeSet(vm, 0, index, [start, end]);
			} else {
				dest.rangeSet(vm, "", index, [start, end]);
			}
		}

		return null;
	}
}
