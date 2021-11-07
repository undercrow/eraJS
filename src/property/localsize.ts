import * as assert from "../assert";
import Expr from "../statement/expr";
import Int1DValue from "../value/int-1d";
import type VM from "../vm";

export default class LocalSize {
	public size: Expr;

	public constructor(size: Expr) {
		this.size = size;
	}

	public async apply(vm: VM, fn: string) {
		const size = await this.size.reduce(vm);
		assert.bigint(size, "Argument of LOCALSIZE should be a number");
		vm.staticMap.get(fn)!.set("LOCAL", new Int1DValue("LOCAL", [Number(size)]));
	}
}
