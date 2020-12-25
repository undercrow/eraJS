import * as U from "../../erb/util";
import VM from "../../vm";
import Statement from "../index";

const PARSER = U.arg0R0();
export default class PrintCPerLine extends Statement {
	public constructor(arg: string) {
		super();
		PARSER.tryParse(arg);
	}

	public *run(vm: VM) {
		vm.getValue("RESULT").set(vm, vm.printCPerLine, [0]);

		return null;
	}
}
