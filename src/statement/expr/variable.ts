import {assert} from "../../assert";
import type VM from "../../vm";
import type Expr from "./index";

// TODO: index
export default class Variable implements Expr {
	public name: string;

	public constructor(name: string) {
		this.name = name;
	}

	public reduce(vm: VM): string | number {
		const result = vm.getValue(this.name, 0);
		assert(result != null, `Value of variable ${this.name} is null`);

		return result;
	}
}
