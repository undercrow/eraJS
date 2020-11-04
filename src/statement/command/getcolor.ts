import * as color from "../../color";
import VM from "../../vm";
import Statement from "../index";

export default class GetColor extends Statement {
	public *run(vm: VM) {
		vm.setValue(color.toHex(vm.color.front), "RESULT", 0);

		return null;
	}
}
