import type VM from "../../vm";
import Statement from "../index";

export default class ResetColor extends Statement {
	public *run(vm: VM) {
		vm.color.front = {
			r: 255,
			g: 255,
			b: 255,
		};

		return null;
	}
}
