import * as U from "../../erb/util";
import * as color from "../../color";
import type VM from "../../vm";
import Statement from "../index";

const PARSER = U.arg0R0();
export default class ResetBgColor extends Statement {
	public constructor(arg: string) {
		super();
		PARSER.tryParse(arg);
	}

	public *run(vm: VM) {
		vm.color.back = color.copy(vm.color.defaultBack);

		return null;
	}
}
