import {assertNumber} from "../../assert";
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

	public reduce(vm: VM) {
		const condition = this.condition.reduce(vm);
		assertNumber(condition, "Condition of ternary operator should be an integer");
		return condition !== 0 ? this.left.reduce(vm) : this.right.reduce(vm);
	}
}
