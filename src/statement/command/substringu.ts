import {assertNumber, assertString} from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

export default class SubstringU extends Statement {
	public expr: Expr;
	public start: Expr;
	public end: Expr;

	public constructor(expr: Expr, start: Expr, end: Expr) {
		super();
		this.expr = expr;
		this.start = start;
		this.end = end;
	}

	public *run(vm: VM) {
		const original = this.expr.reduce(vm);
		assertString(original, "1st argument of SUBSTRINGU must be a string");
		const start = this.start.reduce(vm);
		assertNumber(start, "2nd argument of SUBSTRINGU must be a number");
		const end = this.end.reduce(vm);
		assertNumber(end, "3rd argument of SUBSTRINGU must be a number");
		if (end < 0) {
			vm.setValue(original.slice(start), "RESULTS", 0);
		} else {
			vm.setValue(original.slice(start, end), "RESULTS", 0);
		}

		return null;
	}
}