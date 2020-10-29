import {assertNumber} from "../../assert";
import type VM from "../../vm";
import type Expr from "./index";

type Operator =
	| "*" | "/" | "%"
	| "+" | "-"
	| "<" | "<=" | ">" | ">="
	| "==" | "!="
	| "&" | "|" | "^"
	| "&&" | "!&" | "||" | "!|" | "^^";

export default class BinaryInt implements Expr {
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
		assertNumber(left, `Left operand of ${this.op} should be an integer`);
		const right = this.right.reduce(vm);
		assertNumber(right, `Right operand of ${this.op} should be an integer`);

		switch (this.op) {
			case "*": return left * right;
			case "/": return Math.floor(left / right);
			case "%": return left % right;
			case "+": return left + right;
			case "-": return left - right;
			case "<": return left < right ? 1 : 0;
			case "<=": return left <= right ? 1 : 0;
			case ">": return left > right ? 1 : 0;
			case ">=": return left >= right ? 1 : 0;
			case "==": return left === right ? 1 : 0;
			case "!=": return left !== right ? 1 : 0;
			// eslint-disable-next-line no-bitwise
			case "&": return left & right;
			// eslint-disable-next-line no-bitwise
			case "|": return left | right;
			// eslint-disable-next-line no-bitwise
			case "^": return left ^ right;
			case "&&": return left !== 0 && right !== 0 ? 1 : 0;
			case "!&": return !(left !== 0 && right !== 0) ? 1 : 0;
			case "||": return left !== 0 || right !== 0 ? 1 : 0;
			case "!|": return !(left !== 0 || right !== 0) ? 1 : 0;
			case "^^": return (left !== 0) !== (right !== 0) ? 1 : 0;
		}
	}
}
