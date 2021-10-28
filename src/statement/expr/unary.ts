import * as assert from "../../assert";
import type VM from "../../vm";
import type Expr from "./index";

type Operator = "+" | "-" | "!" | "~";

export default class Unary implements Expr {
	public expr: Expr;
	public op: Operator;

	public constructor(op: Operator, expr: Expr) {
		this.op = op;
		this.expr = expr;
	}

	public async reduce(vm: VM): Promise<number> {
		const value = await this.expr.reduce(vm);
		assert.number(value, `Operand of ${this.op} should be an integer`);

		switch (this.op) {
			case "+": return value;
			case "-": return -value;
			case "!": return value === 0 ? 1 : 0;
				// eslint-disable-next-line no-bitwise
			case "~": return ~value;
		}
	}
}
