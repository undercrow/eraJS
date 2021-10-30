import * as assert from "../../assert";
import type VM from "../../vm";
import type Expr from "./index";

type Operator = "==" | "!=";

export default class Compare implements Expr {
	public left: Expr;
	public right: Expr;
	public op: Operator;

	public constructor(op: Operator, left: Expr, right: Expr) {
		this.op = op;
		this.left = left;
		this.right = right;
	}

	public async reduce(vm: VM): Promise<bigint> {
		const left = await this.left.reduce(vm);
		const right = await this.right.reduce(vm);

		if (typeof left !== typeof right) {
			assert.cond(false, `Type of left and right operand of ${this.op} should be equal`);
		}

		switch (this.op) {
			case "==": return left === right ? 1n : 0n;
			case "!=": return left !== right ? 1n : 0n;
		}
	}
}
