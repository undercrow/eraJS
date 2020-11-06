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
		const index = this.dest.reduceIndex(vm);
		const length = vm.lengthOf(this.dest.name, index.length as 0 | 1 | 2);
		const start = this.start?.reduce(vm) ?? 0;
		assertNumber(start, "3rd argument of VARSET must be a number");
		const end = this.end?.reduce(vm) ?? length;
		assertNumber(end, "4th argument of VARSET must be a number");

		if (this.value != null) {
			const value = this.value.reduce(vm);

			for (let i = start; i < end; ++i) {
				vm.setValue(value, this.dest.name, ...index, i);
			}
		} else {
			const type = vm.typeof(this.dest.name);
			if (type === "number") {
				for (let i = start; i < end; ++i) {
					vm.setValue(0, this.dest.name, ...index, i);
				}
			} else {
				for (let i = start; i < end; ++i) {
					vm.setValue("", this.dest.name, ...index, i);
				}
			}
		}

		return null;
	}
}
