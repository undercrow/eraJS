import {assertNumber} from "../../assert";
import type VM from "../../vm";
import type Expr from "./index";

export default class TernaryInt implements Expr {
	public condition: Expr;
	public left: Expr;
	public right: Expr;

	public constructor(condition: Expr, left: Expr, right: Expr) {
		this.condition = condition;
		this.left = left;
		this.right = right;
	}

	public reduce(vm: VM): number {
		const condition = this.condition.reduce(vm);
		assertNumber(condition, "Condition of ternary operator should be an integer");
		if (condition !== 0) {
			const left = this.left.reduce(vm);
			assertNumber(left, "Left value of ternary operator should be an integer");

			return left;
		} else {
			const right = this.right.reduce(vm);
			assertNumber(right, "Right value of ternary operator should be an integer");

			return right;
		}
	}
}
