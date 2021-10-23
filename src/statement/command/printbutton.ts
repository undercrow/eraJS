import * as assert from "../../assert";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

const PARSER = U.arg2R2(X.expr, X.expr);
export default class PrintButton extends Statement {
	public align?: "LEFT" | "RIGHT";
	public arg: Lazy<[Expr, Expr]>;

	public constructor(raw: Slice, align?: PrintButton["align"]) {
		super(raw);

		this.align = align;
		this.arg = new Lazy(raw, PARSER);
	}

	public *run(vm: VM) {
		const [textExpr, valueExpr] = this.arg.get();

		const text = textExpr.reduce(vm);
		assert.string(text, "1st argument of PRINTBUTTON must be a string");
		const value = valueExpr.reduce(vm);

		yield* vm.queue.button(
			text,
			typeof value === "string" ? value : value.toString(),
			this.align,
		);

		return null;
	}
}
