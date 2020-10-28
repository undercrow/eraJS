import type VM from "../../vm";
import type Statement from "../index";

export default class FontBold implements Statement {
	public *run(vm: VM) {
		vm.font.bold = !vm.font.bold;

		return null;
	}
}
