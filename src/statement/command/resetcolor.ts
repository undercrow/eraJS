import type VM from "../../vm";
import type Statement from "../index";

export default class ResetColor implements Statement {
	public *run(vm: VM) {
		vm.color.front = {
			r: 255,
			g: 255,
			b: 255,
		};

		return null;
	}
}
