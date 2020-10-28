import type VM from "../../vm";
import Statement from "../index";

export default class FontBold extends Statement {
	public *run(vm: VM) {
		vm.font.bold = !vm.font.bold;

		return null;
	}
}
