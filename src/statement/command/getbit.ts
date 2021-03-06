import {assertNumber} from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

export default class GetBit extends Statement {
	public arg: Lazy<[Expr, Expr]>;

	public constructor(arg: string) {
		super();
		this.arg = new Lazy(arg, U.arg2R2(E.expr, E.expr));
	}

	public *run(vm: VM) {
		const [valueExpr, indexExpr] = this.arg.get();
		const value = valueExpr.reduce(vm);
		assertNumber(value, "1st Argument of GETBIT should be an integer");
		const index = indexExpr.reduce(vm);
		assertNumber(index, "2nd Argument of GETBIT should be an integer");

		// eslint-disable-next-line no-bitwise
		const result = (value & (1 << index)) !== 0 ? 1 : 0;
		vm.getValue("RESULT").set(vm, result, [0]);

		return null;
	}
}
