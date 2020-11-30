import {assertString} from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

// TODO: Alignment
// TODO: postfix
export default class PrintButton extends Statement {
	public arg: Lazy<[Expr, Expr]>;

	public constructor(arg: string) {
		super();
		this.arg = new Lazy(arg, U.arg2R2(E.expr, E.expr));
	}

	public *run(vm: VM) {
		const [textExpr, valueExpr] = this.arg.get();

		const text = textExpr.reduce(vm);
		assertString(text, "1st argument of PRINTBUTTON must be a string");
		const value = valueExpr.reduce(vm);

		yield <const>{
			type: "button",
			text,
			value: typeof value === "string" ? value : value.toString(),
		};

		return null;
	}
}
