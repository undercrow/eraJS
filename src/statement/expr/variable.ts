import {assert, assertNumber} from "../../assert";
import type VM from "../../vm";
import type Expr from "./index";

// TODO: index
export default class Variable implements Expr {
	public name: string;
	public index: Expr[];

	public constructor(name: string, index: Expr[]) {
		this.name = name;
		this.index = index;
	}

	public reduce(vm: VM): string | number {
		const index = this.index.map((i) => i.reduce(vm));
		index.forEach((i) => assertNumber(i, "Index of variable should be an integer"));

		const result = vm.getValue(this.name, ...index.length === 0 ? [0] : index as number[]);
		assert(result != null, `Value of variable ${this.name} is null`);

		return result;
	}
}
