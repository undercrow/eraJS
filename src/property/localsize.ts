import Int1DValue from "../value/int-1d";
import type VM from "../vm";

export default class LocalSize {
	public size: number;

	public constructor(size: number) {
		this.size = size;
	}

	public apply(vm: VM, fn: string) {
		vm.staticMap.get(fn)!.set("LOCAL", new Int1DValue(this.size));
	}
}
