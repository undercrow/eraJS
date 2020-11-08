import type VM from "../../vm";
import Statement from "../index";

export default class CurrentRedraw extends Statement {
	public *run(vm: VM) {
		vm.getValue("RESULT").set(vm, vm.draw ? 0 : 1, [0]);

		return null;
	}
}
