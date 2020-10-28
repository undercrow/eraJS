import type VM from "../../vm";
import type Statement from "../index";

type Align = "left" | "center" | "right";

export default class Alignment implements Statement {
	public align: Align;

	public constructor(align: Align) {
		this.align = align;
	}

	public *run(vm: VM) {
		vm.alignment = this.align;

		return null;
	}
}
