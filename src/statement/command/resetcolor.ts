import * as U from "../../erb/util";
import * as color from "../../color";
import type VM from "../../vm";
import Statement from "../index";

export default class ResetColor extends Statement {
	public constructor(arg: string) {
		super();
		U.arg0R0().tryParse(arg);
	}

	public *run(vm: VM) {
		vm.color.front = color.copy(vm.color.defaultFront);

		return null;
	}
}
