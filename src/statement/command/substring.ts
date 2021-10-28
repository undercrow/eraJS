import * as assert from "../../assert";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

const PARSER = U.arg3R3(X.expr, X.expr, X.expr);
export default class Substring extends Statement {
	public arg: Lazy<[Expr, Expr, Expr]>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public async *run(vm: VM) {
		const [valueExpr, startExpr, endExpr] = this.arg.get();

		const value = await valueExpr.reduce(vm);
		assert.string(value, "1st argument of SUBSTRING must be a string!");
		const start = await startExpr.reduce(vm);
		assert.number(start, "2nd argument of SUBSTRING must be a number!");
		const end = await endExpr.reduce(vm);
		assert.number(end, "3rd argument of SUBSTRING must be a number!");
		if (end < 0) {
			vm.getValue("RESULTS").set(vm, value.slice(start), [0]);
		} else {
			vm.getValue("RESULTS").set(vm, value.slice(start, end), [0]);
		}

		return null;
	}
}
