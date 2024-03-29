import * as assert from "../../assert";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

const PARSER = U.arg2R2(X.expr, X.expr);
export default class StrFindU extends Statement {
	public arg: Lazy<[Expr, Expr]>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public async *run(vm: VM) {
		const [valueExpr, searchExpr] = this.arg.get();

		const value = await valueExpr.reduce(vm);
		assert.string(value, "1st argument of STRFINDU must be a string!");
		const search = await searchExpr.reduce(vm);
		assert.string(search, "2nd argument of STRFINDU must be a string!");
		// TODO: unicode
		vm.getValue("RESULT").set(vm, BigInt(value.indexOf(search)), [0]);

		return null;
	}
}
