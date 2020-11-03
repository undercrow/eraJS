import {assertString} from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

export default class DrawLine extends Statement {
	public expr?: Expr;

	public constructor(expr?: Expr) {
		super();
		this.expr = expr;
	}

	public *run(vm: VM) {
		const value = this.expr?.reduce(vm);
		if (value != null) {
			assertString(value, "Argument of DRAWLINE must be a string");
		}

		yield <const>{
			type: "line",
			value,
		};

		return null;
	}
}
