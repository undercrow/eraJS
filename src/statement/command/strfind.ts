import {assertString} from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

export default class StrFind extends Statement {
	public expr: Expr;
	public search: Expr;
	public unicode: boolean;

	public constructor(expr: Expr, search: Expr, unicode: boolean = false) {
		super();
		this.expr = expr;
		this.search = search;
		this.unicode = unicode;
	}

	public *run(vm: VM) {
		const value = this.expr.reduce(vm);
		assertString(value, "1st argument of STRFIND must be a string!");
		const search = this.search.reduce(vm);
		assertString(search, "2nd argument of STRFIND must be a string!");
		// TODO: unicode
		vm.setValue(value.indexOf(search), "RESULT", 0);

		return null;
	}
}
