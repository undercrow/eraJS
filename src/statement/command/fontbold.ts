import * as U from "../../erb/util";
import type VM from "../../vm";
import Statement from "../index";

export default class FontBold extends Statement {
	public constructor(arg: string) {
		super();
		U.arg0R0().tryParse(arg);
	}

	public *run(vm: VM) {
		vm.font.bold = !vm.font.bold;

		return null;
	}
}
