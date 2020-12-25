import {assertNumber, assertString} from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

const PARSER = U.arg3R3(E.expr, E.expr, E.expr);
export default class Substring extends Statement {
	public arg: Lazy<[Expr, Expr, Expr]>;

	public constructor(arg: string) {
		super();
		this.arg = new Lazy(arg, PARSER);
	}

	public *run(vm: VM) {
		const [valueExpr, startExpr, endExpr] = this.arg.get();

		const value = valueExpr.reduce(vm);
		assertString(value, "1st argument of SUBSTRING must be a string!");
		const start = startExpr.reduce(vm);
		assertNumber(start, "2nd argument of SUBSTRING must be a number!");
		const end = endExpr.reduce(vm);
		assertNumber(end, "3rd argument of SUBSTRING must be a number!");
		if (end < 0) {
			vm.getValue("RESULTS").set(vm, value.slice(start), [0]);
		} else {
			vm.getValue("RESULTS").set(vm, value.slice(start, end), [0]);
		}

		return null;
	}
}
