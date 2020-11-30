import * as U from "../../erb/util";
import type VM from "../../vm";
import Statement from "../index";

export type Align = "LEFT" | "CENTER" | "RIGHT";

export default class Alignment extends Statement {
	public align: Align;

	public constructor(arg: string) {
		super();
		this.align = U.arg1R1(U.alt("LEFT", "CENTER", "RIGHT")).tryParse(arg);
	}

	public *run(vm: VM) {
		vm.alignment = this.align;

		return null;
	}
}
