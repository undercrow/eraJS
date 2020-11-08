import * as color from "../../color";
import VM from "../../vm";
import Statement from "../index";

export default class GetColor extends Statement {
	public *run(vm: VM) {
		vm.getValue("RESULT").set(vm, color.toHex(vm.color.front), [0]);

		return null;
	}
}
