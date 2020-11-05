import type VM from "../vm";

export default class DimRef {
	public name: string;

	public constructor(name: DimRef["name"]) {
		this.name = name;
	}

	public apply(vm: VM) {
		const context = vm.context();
		context.refMap.set(this.name, "");
	}
}
