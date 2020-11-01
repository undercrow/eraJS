import type VM from "../../vm";
import type Expr from "./index";

type Operator =
	| "*" | "/" | "%"
	| "+" | "-"
	| "<" | "<=" | ">" | ">="
	| "==" | "!="
	| "&" | "|" | "^"
	| "&&" | "!&" | "||" | "!|" | "^^";

export default class Binary implements Expr {
	public left: Expr;
	public right: Expr;
	public op: Operator;

	public constructor(op: Operator, left: Expr, right: Expr) {
		this.op = op;
		this.left = left;
		this.right = right;
	}

	public reduce(vm: VM) {
		const left = this.left.reduce(vm);
		const right = this.right.reduce(vm);
		if (typeof left === "number" && typeof right === "number") {
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
		} else if (typeof left === "string" && typeof right === "string") {
			switch (this.op) {
				case "+": return left + right;
				case "<": return left < right ? 1 : 0;
				case "<=": return left <= right ? 1 : 0;
				case ">": return left > right ? 1 : 0;
				case ">=": return left >= right ? 1 : 0;
				case "==": return left === right ? 1 : 0;
				case "!=": return left !== right ? 1 : 0;
				default: { /* Do nothing */ }
			}
		} else if (typeof left === "string" && typeof right === "number") {
			switch (this.op) {
				case "*": return left.repeat(right);
				default: { /* Do nothing */ }
			}
		}

		throw new Error(`Type of operands for ${this.op} is invalid`);
	}
}
