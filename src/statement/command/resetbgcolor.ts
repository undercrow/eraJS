import * as U from "../../erb/util";
import * as color from "../../color";
import type VM from "../../vm";
import Statement from "../index";

export default class ResetBgColor extends Statement {
	public constructor(arg: string) {
		super();
		U.arg0R0().tryParse(arg);
	}

	public *run(vm: VM) {
		vm.color.back = color.copy(vm.color.defaultBack);

		return null;
	}
}
