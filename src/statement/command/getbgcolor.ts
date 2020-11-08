import * as color from "../../color";
import VM from "../../vm";
import Statement from "../index";

export default class GetBgColor extends Statement {
	public *run(vm: VM) {
		vm.getValue("RESULT").set(vm, color.toHex(vm.color.back), [0]);

		return null;
	}
}
