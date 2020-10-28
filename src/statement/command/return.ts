import type VM from "../../vm";
import type Expr from "../expr";
import type Statement from "../index";

export default class Return implements Statement {
	public expr: Expr;

	public constructor(expr: Expr) {
		this.expr = expr;
	}

	public *run(vm: VM) {
		return <const>{
			type: "return",
			value: this.expr.reduce(vm),
		};
	}
}
