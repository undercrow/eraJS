import {assertString} from "../../assert";
import type VM from "../../vm";
import type Expr from "./index";

type Operator =
	| "<" | "<=" | ">" | ">="
	| "==" | "!=";

export default class CompareString implements Expr {
	public left: Expr;
	public right: Expr;
	public op: Operator;

	public constructor(op: Operator, left: Expr, right: Expr) {
		this.op = op;
		this.left = left;
		this.right = right;
	}

	public reduce(vm: VM): number {
		const left = this.left.reduce(vm);
		assertString(left, `Left operand of ${this.op} should be a string`);
		const right = this.right.reduce(vm);
		assertString(right, `Right operand of ${this.op} should be a string`);

		switch (this.op) {
			case "<": return left < right ? 1 : 0;
			case "<=": return left <= right ? 1 : 0;
			case ">": return left > right ? 1 : 0;
			case ">=": return left >= right ? 1 : 0;
			case "==": return left === right ? 1 : 0;
			case "!=": return left !== right ? 1 : 0;
		}
	}
}
