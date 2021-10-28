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
export default class SetBit extends Statement {
	public arg: Lazy<[Variable, ...Expr[]]>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public async *run(vm: VM) {
		const [destExpr, ...bitExpr] = this.arg.get();

		const dest = destExpr.getCell(vm);
		const value = await destExpr.reduce(vm);
		assert.number(value, "1st argument of SETBIT must be a number");
		const bitList: number[] = [];
		for (let i = 0; i < bitExpr.length; ++i) {
			const bit = await bitExpr[i].reduce(vm);
			assert.number(bit, `${i + 2}th argument of INVERTBIT must be a number`);
			bitList.push(bit);
		}

		let result = value;
		for (const bit of bitList) {
			// eslint-disable-next-line no-bitwise
			result |= 1 << bit;
		}

		dest.set(vm, result, await destExpr.reduceIndex(vm));

		return null;
	}
}
