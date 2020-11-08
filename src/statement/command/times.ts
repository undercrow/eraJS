import {assertNumber} from "../../assert";
import type VM from "../../vm";
import type Variable from "../expr/variable";
import Statement from "../index";

export default class Times extends Statement {
	public dest: Variable;
	public value: number;

	public constructor(dest: Variable, value: number) {
		super();
		this.dest = dest;
		this.value = value;
	}

	public *run(vm: VM) {
		const original = this.dest.reduce(vm);
		assertNumber(original, "1st argument of TIMES must be a number");
		const index = this.dest.reduceIndex(vm);

		vm.getValue(this.dest.name).set(vm, Math.floor(original * this.value), index);

		return null;
	}
}
