import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import Statement from "../index";

const PARSER = U.arg1R0(U.Int);
export default class Input extends Statement {
	public def: Lazy<number | undefined>;

	public constructor(raw: string) {
		super();
		this.def = new Lazy(raw, PARSER);
	}

	// TODO: Use default value
	public *run(vm: VM) {
		while (true) {
			const input: string = yield <const>{type: "input"};
			const value = parseInt(input);
			if (!isNaN(value)) {
				vm.getValue("RESULT").set(vm, value, [0]);
				break;
			}
		}

		return null;
	}
}
