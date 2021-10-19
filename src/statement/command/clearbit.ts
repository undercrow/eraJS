import * as assert from "../../assert";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import type Expr from "../expr";
import type Variable from "../expr/variable";
import Statement from "../index";

const PARSER = U.argNR1(X.variable, X.expr);
export default class ClearBit extends Statement {
	public arg: Lazy<[Variable, ...Expr[]]>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public *run(vm: VM) {
		const [destExpr, ...bitExpr] = this.arg.get();

		const value = destExpr.reduce(vm);
		assert.number(value, "1st argument of CLEARBIT must be a number");
		const bitList = bitExpr.map((bit) => bit.reduce(vm));
		bitList.forEach((bit) => assert.number(bit, "Argument of CLEARBIT must be a number"));

		let result = value;
		for (const bit of bitList as number[]) {
			// eslint-disable-next-line no-bitwise
			result &= ~(1 << bit);
		}
		destExpr.getCell(vm).set(vm, result, destExpr.reduceIndex(vm));

		return null;
	}
}
