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

	public async *run(vm: VM) {
		const [destExpr, valueExpr, startExpr, endExpr] = this.arg.get();

		const dest = destExpr.getCell(vm);
		const index = await destExpr.reduceIndex(vm);
		const start = await startExpr?.reduce(vm) ?? 0n;
		assert.bigint(start, "3rd argument of VARSET must be a number");
		const end = await endExpr?.reduce(vm) ?? BigInt(dest.length(index.length));
		assert.bigint(end, "4th argument of VARSET must be a number");

		if (valueExpr != null) {
			const value = await valueExpr.reduce(vm);
			dest.rangeSet(vm, value, index, [Number(start), Number(end)]);
		} else {
			if (dest.type === "number") {
				dest.rangeSet(vm, 0n, index, [Number(start), Number(end)]);
			} else {
				dest.rangeSet(vm, "", index, [Number(start), Number(end)]);
			}
		}

		return null;
	}
}
