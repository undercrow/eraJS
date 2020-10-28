import type VM from "../../vm";
import Statement from "../index";

type Align = "left" | "center" | "right";

export default class Alignment extends Statement {
	public align: Align;

	public constructor(align: Align) {
		super();
		this.align = align;
	}

	public *run(vm: VM) {
		vm.alignment = this.align;

		return null;
	}
}
