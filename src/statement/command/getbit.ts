import {assertNumber} from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

export default class GetBit extends Statement {
	public expr: Expr;
	public index: Expr;

	public constructor(expr: Expr, index: Expr) {
		super();
		this.expr = expr;
		this.index = index;
	}

	public *run(vm: VM) {
		const value = this.expr.reduce(vm);
		assertNumber(value, "1st Argument of GETBIT should be an integer");
		const index = this.index.reduce(vm);
		assertNumber(index, "2nd Argument of GETBIT should be an integer");

		// eslint-disable-next-line no-bitwise
		const result = (value & (1 << index)) !== 0 ? 1 : 0;
		vm.getValue("RESULT").set(vm, result, [0]);

		return null;
	}
}
