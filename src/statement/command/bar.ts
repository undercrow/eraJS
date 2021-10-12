import * as assert from "../../assert";
import * as E from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

const PARSER = U.arg3R3(E.expr, E.expr, E.expr);
export default class Bar extends Statement {
	public arg: Lazy<[Expr, Expr, Expr]>;
	public newline: boolean;

	public constructor(raw: string, newline: boolean = false) {
		super();
		this.arg = new Lazy(raw, PARSER);
		this.newline = newline;
	}

	public *run(vm: VM) {
		if (vm.skipDisp) {
			return null;
		}

		const [valueExpr, maxExpr, lengthExpr] = this.arg.get();

		const value = valueExpr.reduce(vm);
		assert.number(value, "1st argument of BAR must be a number");
		const max = maxExpr.reduce(vm);
		assert.number(max, "2nd argument of BAR must be a number");
		const length = lengthExpr.reduce(vm);
		assert.number(length, "3rd argument of BAR must be a number");

		const filled = Math.floor(length * (value / max));
		yield* vm.print("[" + "*".repeat(filled) + ".".repeat(length - filled) + "]");

		if (this.newline) {
			yield* vm.newline();
		}

		return null;
	}
}
