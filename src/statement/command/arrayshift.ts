import * as assert from "../../assert";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import type Expr from "../expr";
import type Variable from "../expr/variable";
import Statement from "../index";

const PARSER = U.arg5R3(X.variable, X.expr, X.expr, X.expr, X.expr);
export default class ArrayShift extends Statement {
	public arg: Lazy<[Variable, Expr, Expr, Expr | undefined, Expr | undefined]>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public *run(vm: VM) {
		// TODO: 4th and 5th argument
		const [targetExpr, countExpr, fillExpr] = this.arg.get();

		const target = targetExpr.getCell(vm);
		const index = targetExpr.reduceIndex(vm);
		const length = target.length(index.length);
		const count = countExpr.reduce(vm);
		assert.number(count, "2nd argument of ARRAYSHIFT must be a number");
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
				const value = target.get(vm, [...index, i - count]);
				target.set(vm, value, [...index, i]);
			}
			for (let i = length + count; i < length; ++i) {
				target.set(vm, fill, [...index, i]);
			}
		}

		return null;
	}
}