import * as assert from "../../assert";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import type Expr from "../expr";
import type Variable from "../expr/variable";
import Statement from "../index";

const PARSER = U.arg4R1(X.variable, X.expr, X.expr, X.expr);
export default class VarSet extends Statement {
	public arg: Lazy<[Variable, Expr | undefined, Expr | undefined, Expr | undefined]>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public *run(vm: VM) {
		const [destExpr, valueExpr, startExpr, endExpr] = this.arg.get();

		const dest = destExpr.getCell(vm);
		const index = destExpr.reduceIndex(vm);
		const start = startExpr?.reduce(vm) ?? 0;
		assert.number(start, "3rd argument of VARSET must be a number");
		const end = endExpr?.reduce(vm) ?? dest.length(index.length);
		assert.number(end, "4th argument of VARSET must be a number");

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
