import {assertString} from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import type Variable from "../expr/variable";
import Statement from "../index";

export default class Split extends Statement {
	public arg: Lazy<[Expr, Expr, Variable]>;

	public constructor(arg: string) {
		super();
		this.arg = new Lazy(arg, U.arg3R3(E.expr, E.expr, E.variable));
	}

	public *run(vm: VM) {
		const [valueExpr, sepExpr, destExpr] = this.arg.get();

		const value = valueExpr.reduce(vm);
		assertString(value, "1st argument of SPLIT must be a string!");
		const sep = sepExpr.reduce(vm);
		assertString(sep, "2nd argument of SPLIT must be a number!");
		const dest = vm.getValue(destExpr.name);
		const index = destExpr.reduceIndex(vm);

		const chunkList = value.split(sep);
		for (let i = 0; i < chunkList.length; ++i) {
			dest.set(vm, chunkList[i], [...index, i]);
		}
		vm.getValue("RESULT").set(vm, chunkList.length, [0]);

		return null;
	}
}
