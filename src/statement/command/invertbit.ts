import {assertNumber} from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import type Variable from "../expr/variable";
import Statement from "../index";

export default class InvertBit extends Statement {
	public arg: Lazy<[Variable, ...Expr[]]>;

	public constructor(arg: string) {
		super();
		this.arg = new Lazy(arg, U.argNR1(E.variable, E.expr));
	}

	public *run(vm: VM) {
		const [destExpr, ...bitExpr] = this.arg.get();

		const value = destExpr.reduce(vm);
		assertNumber(value, "1st argument of INVERTBIT must be a number");
		const bitList = bitExpr.map((bit) => bit.reduce(vm));
		bitList.forEach((bit) => assertNumber(bit, "Argument of INVERTBIT must be a number"));

		let result = value;
		for (const bit of bitList as number[]) {
			// eslint-disable-next-line no-bitwise
			result ^= 1 << bit;
		}
		vm.getValue(destExpr.name)!.set(vm, result, destExpr.reduceIndex(vm));

		return null;
	}
}
