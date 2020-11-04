import * as color from "../../color";
import VM from "../../vm";
import Statement from "../index";

export default class GetFocusColor extends Statement {
	public *run(vm: VM) {
		vm.setValue(color.toHex(vm.color.focus), "RESULT", 0);

		return null;
	}
}
