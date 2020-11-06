import type VM from "../../vm";
import Statement from "../index";

export default class CurrentRedraw extends Statement {
	public *run(vm: VM) {
		vm.setValue(vm.draw ? 0 : 1, "RESULT", 0);

		return null;
	}
}
