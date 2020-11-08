import {assertNumber} from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";
import type Variable from "../expr/variable";
import Statement from "../index";

export default class VarSet extends Statement {
	public dest: Variable;
	public value?: Expr;
	public start?: Expr;
	public end?: Expr;

	public constructor(dest: Variable, value?: Expr, start?: Expr, end?: Expr) {
		super();
		this.dest = dest;
		this.value = value;
		this.start = start;
		this.end = end;
	}

	public *run(vm: VM) {
		const dest = vm.getValue(this.dest.name);
		const index = this.dest.reduceIndex(vm);
		const start = this.start?.reduce(vm) ?? 0;
		assertNumber(start, "3rd argument of VARSET must be a number");
		const end = this.end?.reduce(vm) ?? dest.length(index.length);
		assertNumber(end, "4th argument of VARSET must be a number");

		if (this.value != null) {
			const value = this.value.reduce(vm);

			for (let i = start; i < end; ++i) {
				dest.set(vm, value, [...index, i]);
			}
		} else {
			if (dest.type === "number") {
				for (let i = start; i < end; ++i) {
					dest.set(vm, 0, [...index, i]);
				}
			} else {
				for (let i = start; i < end; ++i) {
					dest.set(vm, "", [...index, i]);
				}
			}
		}

		return null;
	}
}
