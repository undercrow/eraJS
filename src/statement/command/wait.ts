import type VM from "../../vm";
import Statement from "../index";

export default class Wait extends Statement {
	public *run(vm: VM) {
		if (vm.skipDisp) {
			return null;
		}

		yield <const>{type: "wait"};

		return null;
	}
}
