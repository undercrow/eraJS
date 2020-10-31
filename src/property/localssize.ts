import type VM from "../vm";

export default class LocalSSize {
	public size: number;

	public constructor(size: number) {
		this.size = size;
	}

	public apply(vm: VM, fn: string) {
		vm.staticMap.get(fn)!.set("LOCALS", Array(this.size).fill(""));
	}
}
