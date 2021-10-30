import * as assert from "../../assert";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import type Expr from "../expr";
import type Variable from "../expr/variable";
import Statement from "../index";

const PARSER = U.arg3R3(X.expr, X.expr, X.variable);
export default class Split extends Statement {
	public arg: Lazy<[Expr, Expr, Variable]>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public async *run(vm: VM) {
		const [valueExpr, sepExpr, destExpr] = this.arg.get();

		const value = await valueExpr.reduce(vm);
		assert.string(value, "1st argument of SPLIT must be a string!");
		const sep = await sepExpr.reduce(vm);
		assert.string(sep, "2nd argument of SPLIT must be a number!");
		const dest = destExpr.getCell(vm);
		const index = await destExpr.reduceIndex(vm);

		const chunkList = value.split(sep);
		for (let i = 0; i < chunkList.length; ++i) {
			dest.set(vm, chunkList[i], [...index, i]);
		}
		vm.getValue("RESULT").set(vm, BigInt(chunkList.length), [0]);

		return null;
	}
}
