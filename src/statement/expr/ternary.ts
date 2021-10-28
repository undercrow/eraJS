import * as assert from "../../assert";
import type VM from "../../vm";
import type Expr from "./index";

export default class Ternary implements Expr {
	public condition: Expr;
	public left: Expr;
	public right: Expr;

	public constructor(condition: Expr, left: Expr, right: Expr) {
		this.condition = condition;
		this.left = left;
		this.right = right;
	}

	public async reduce(vm: VM) {
		const condition = await this.condition.reduce(vm);
		assert.number(condition, "Condition of ternary operator should be an integer");
		return condition !== 0 ? this.left.reduce(vm) : this.right.reduce(vm);
	}
}
