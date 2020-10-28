import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

export default class Return extends Statement {
	public expr: Expr;

	public constructor(expr: Expr) {
		super();
		this.expr = expr;
	}

	public *run(vm: VM) {
		return <const>{
			type: "return",
			value: this.expr.reduce(vm),
		};
	}
}
