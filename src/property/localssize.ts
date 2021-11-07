import * as assert from "../assert";
import Expr from "../statement/expr";
import Str1DValue from "../value/str-1d";
import type VM from "../vm";

export default class LocalSSize {
	public size: Expr;

	public constructor(size: Expr) {
		this.size = size;
	}

	public async apply(vm: VM, fn: string) {
		const size = await this.size.reduce(vm);
		assert.bigint(size, "Argument of LOCALSIZE should be a number");
		vm.staticMap.get(fn)!.set("LOCALS", new Str1DValue("LOCALS", [Number(size)]));
	}
}
