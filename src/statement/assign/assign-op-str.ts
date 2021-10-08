import * as assert from "../../assert";
import type VM from "../../vm";
import Expr from "../expr";
import Variable from "../expr/variable";
import Statement from "../index";

type Operator = "+=";
export default class OpAssign extends Statement {
	public dest: Variable;
	public operator: Operator;
	public expr: Expr;

	public constructor(dest: Variable, operator: Operator, expr: Expr) {
		super();
		this.dest = dest;
		this.operator = operator;
		this.expr = expr;
	}

	public *run(vm: VM) {
		const dest = this.dest.getCell(vm);
		const index = this.dest.reduceIndex(vm);

		const original = dest.get(vm, index) as string;
		const value = this.expr.reduce(vm);
		assert.string(value, `Right operand of ${this.operator} should be a string`);

		switch (this.operator) {
			case "+=": dest.set(vm, original + value, index); break;
		}

		return null;
	}
}
