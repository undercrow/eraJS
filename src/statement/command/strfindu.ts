import * as assert from "../../assert";
import * as E from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

const PARSER = U.arg2R2(E.expr, E.expr);
export default class StrFindU extends Statement {
	public arg: Lazy<[Expr, Expr]>;

	public constructor(arg: string) {
		super();
		this.arg = new Lazy(arg, PARSER);
	}

	public *run(vm: VM) {
		const [valueExpr, searchExpr] = this.arg.get();

		const value = valueExpr.reduce(vm);
		assert.string(value, "1st argument of STRFINDU must be a string!");
		const search = searchExpr.reduce(vm);
		assert.string(search, "2nd argument of STRFINDU must be a string!");
		// TODO: unicode
		vm.getValue("RESULT").set(vm, value.indexOf(search), [0]);

		return null;
	}
}
