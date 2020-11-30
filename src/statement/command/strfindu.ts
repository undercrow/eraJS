import {assertString} from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

export default class StrFindU extends Statement {
	public arg: Lazy<[Expr, Expr]>;

	public constructor(arg: string) {
		super();
		this.arg = new Lazy(arg, U.arg2R2(E.expr, E.expr));
	}

	public *run(vm: VM) {
		const [valueExpr, searchExpr] = this.arg.get();

		const value = valueExpr.reduce(vm);
		assertString(value, "1st argument of STRFINDU must be a string!");
		const search = searchExpr.reduce(vm);
		assertString(search, "2nd argument of STRFINDU must be a string!");
		// TODO: unicode
		vm.getValue("RESULT").set(vm, value.indexOf(search), [0]);

		return null;
	}
}
