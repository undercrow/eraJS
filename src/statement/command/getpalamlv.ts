import * as assert from "../../assert";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

const PARSER = U.arg2R2(X.expr, X.expr);
export default class GetPalamLv extends Statement {
	public arg: Lazy<[Expr, Expr]>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public *run(vm: VM) {
		const [valExpr, maxExpr] = this.arg.get();

		const value = valExpr.reduce(vm);
		assert.number(value, "1st argument of GETPALAMLV must be a number");
		const max = maxExpr.reduce(vm);
		assert.number(max, "2nd argument of GETPALAMLV must be a number");

		let result = max;
		for (let i = 0; i <= max; ++i) {
			if (value < vm.getValue("PALAMLV").get(vm, [i])) {
				result = i - 1;
				break;
			}
		}
		vm.getValue("RESULT").set(vm, result, [0]);

		return null;
	}
}
