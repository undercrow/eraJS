import type VM from "../../vm";
import Statement from "../index";

export default class FontRegular extends Statement {
	public *run(vm: VM) {
		vm.font.bold = false;

		return null;
	}
}
