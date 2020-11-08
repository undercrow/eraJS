import * as color from "../../color";
import VM from "../../vm";
import Statement from "../index";

export default class GetDefColor extends Statement {
	public *run(vm: VM) {
		vm.getValue("RESULT").set(vm, color.toHex(vm.color.defaultFront), [0]);

		return null;
	}
}
