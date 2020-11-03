import type VM from "../../vm";
import Statement from "../index";

export default class Goto extends Statement {
	public target: string;

	public constructor(target: string) {
		super();
		this.target = target.toUpperCase();
	}

	public *run(vm: VM) {
		if (!vm.labelSet.has(this.target)) {
			throw new Error(`Label ${this.target} does not exist`);
		}

		return <const>{
			type: "goto",
			label: this.target,
		};
	}
}
