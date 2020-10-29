import {assertNumber} from "../../assert";
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
		const value = this.expr.reduce(vm);
		assertNumber(value, "Argument of RETURN should be an integer");

		return <const>{
			type: "return",
			value,
		};
	}
}
