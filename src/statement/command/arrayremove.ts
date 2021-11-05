import * as assert from "../../assert";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import type Expr from "../expr";
import type Variable from "../expr/variable";
import Statement from "../index";

const PARSER = U.arg3R3(X.variable, X.expr, X.expr);
export default class ArrayRemove extends Statement {
	public arg: Lazy<[Variable, Expr, Expr]>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public async *run(vm: VM) {
		const [targetExpr, startExpr, countExpr] = this.arg.get();

		const target = targetExpr.getCell(vm);
		const index = await targetExpr.reduceIndex(vm);
		const length = target.length(index.length);
		const start = await startExpr.reduce(vm);
		assert.bigint(start, "2nd argument of ARRAYREMOVE must be a number");
		const count = await countExpr.reduce(vm);
		assert.bigint(count, "3rd argument of ARRAYREMOVE must be a number");

		for (let i = start; i < BigInt(length) - count; ++i) {
			const value = target.get(vm, [...index, Number(i + count)]);
			target.set(vm, value, [...index, Number(i)]);
		}
		for (let i = 0n; i < count; ++i) {
			if (target.type === "number") {
				target.set(vm, 0n, [...index, length - 1 - Number(i)]);
			} else {
				target.set(vm, "", [...index, length - 1 - Number(i)]);
			}
		}

		return null;
	}
}
