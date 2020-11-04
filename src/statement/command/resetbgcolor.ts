import * as color from "../../color";
import VM from "../../vm";
import Statement from "../index";

export default class ResetBgColor extends Statement {
	public *run(vm: VM) {
		vm.color.back = color.copy(vm.color.defaultBack);

		return null;
	}
}
