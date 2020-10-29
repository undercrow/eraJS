import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

export default class PutForm extends Statement {
	public expr: Expr;

	public constructor(expr: Expr) {
		super();
		this.expr = expr;
	}

	public *run(_vm: VM) {
		throw new Error("PUTFORM is not implemented yet");

		return null;
	}
}
