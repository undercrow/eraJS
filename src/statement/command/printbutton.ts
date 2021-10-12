import * as assert from "../../assert";
import * as E from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

const PARSER = U.arg2R2(E.expr, E.expr);
export default class PrintButton extends Statement {
	public align?: "LEFT" | "RIGHT";
	public arg: Lazy<[Expr, Expr]>;

	public constructor(arg: string, align?: PrintButton["align"]) {
		super();
		this.align = align;
		this.arg = new Lazy(arg, PARSER);
	}

	public *run(vm: VM) {
		const [textExpr, valueExpr] = this.arg.get();

		const text = textExpr.reduce(vm);
		assert.string(text, "1st argument of PRINTBUTTON must be a string");
		const value = valueExpr.reduce(vm);

		yield <const>{
			type: "button",
			text,
			value: typeof value === "string" ? value : value.toString(),
			cell: this.align,
		};

		return null;
	}
}
