import {assertNumber} from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";
import type Variable from "../expr/variable";
import Statement from "../index";

export default class SetBit extends Statement {
	public dest: Variable;
	public bitList: Expr[];

	public constructor(dest: Variable, bitList: Expr[]) {
		super();
		this.dest = dest;
		this.bitList = bitList;
	}

	public *run(vm: VM) {
		const dest = vm.getValue(this.dest.name);
		const value = this.dest.reduce(vm);
		assertNumber(value, "1st argument of SETBIT must be a number");
		const bitList = this.bitList.map((bit) => bit.reduce(vm));
		bitList.forEach((bit) => assertNumber(bit, "Argument of SETBIT must be a number"));

		let result = value;
		for (const bit of bitList as number[]) {
			// eslint-disable-next-line no-bitwise
			result |= 1 << bit;
		}

		dest.set(vm, result, this.dest.reduceIndex(vm));

		return null;
	}
}
