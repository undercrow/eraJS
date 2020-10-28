import {assertString} from "../../assert";
import type VM from "../../vm";

export default function strLenS(_vm: VM, arg: Array<string | number>): number {
	const value = arg[0];
	assertString(value, "1st Argument of STRLENS should be a string");

	return value.length;
}
//
// export default class StrLenS implements Statement {
// 	public dest: string;
// 	public expr: Expr;
//
// 	public constructor(dest: string, expr: Expr) {
// 		this.dest = dest;
// 		this.expr = expr;
// 	}
//
// 	public *run(vm: VM) {
// 		const value = this.expr.reduce(vm);
// 		vm.setValue(value, this.dest, 0);
//
// 		return null;
// 	}
// }
