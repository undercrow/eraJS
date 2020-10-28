import type VM from "../../vm";
import type Statement from "../index";

export default class FontRegular implements Statement {
	public *run(vm: VM) {
		vm.font.bold = false;

		return null;
	}
}
