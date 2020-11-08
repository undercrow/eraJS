import {assertNumber} from "../../assert";
import type VM from "../../vm";
import type Expr from "./index";

// TODO: index
export default class Variable implements Expr {
	public name: string;
	public index: Expr[];

	public constructor(name: string, index: Expr[]) {
		this.name = name.toUpperCase();
		this.index = index;
	}

	public reduce(vm: VM): string | number {
		return vm.getValue(this.name).get(vm, this.reduceIndex(vm));
	}

	public reduceIndex(vm: VM): number[] {
		if (this.index.length !== 0) {
			const index = this.index.map((i) => i.reduce(vm));
			index.forEach((i) => assertNumber(i, "Index of variable should be an integer"));

			return index as number[];
		} else {
			return [0];
		}
	}
}
