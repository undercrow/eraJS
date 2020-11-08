import {assertString} from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";
import type Variable from "../expr/variable";
import Statement from "../index";

export default class Split extends Statement {
	public expr: Expr;
	public sep: Expr;
	public dest: Variable;

	public constructor(expr: Expr, sep: Expr, dest: Variable) {
		super();
		this.expr = expr;
		this.sep = sep;
		this.dest = dest;
	}

	public *run(vm: VM) {
		const value = this.expr.reduce(vm);
		assertString(value, "1st argument of SPLIT must be a string!");
		const sep = this.sep.reduce(vm);
		assertString(sep, "2nd argument of SPLIT must be a number!");
		const dest = vm.getValue(this.dest.name);
		const index = this.dest.reduceIndex(vm);

		const chunkList = value.split(sep);
		for (let i = 0; i < chunkList.length; ++i) {
			dest.set(vm, chunkList[i], [...index, i]);
		}
		vm.getValue("RESULT").set(vm, chunkList.length, [0]);

		return null;
	}
}
