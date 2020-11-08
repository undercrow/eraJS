import type VM from "../../vm";
import Statement from "../index";

export default class Input extends Statement {
	public def?: number;

	public constructor(def?: number) {
		super();
		this.def = def;
	}

	public *run(vm: VM) {
		while (true) {
			const raw = yield <const>{type: "input"};
			const value = parseInt(raw);
			if (!isNaN(value)) {
				vm.getValue("RESULT").set(vm, value, [0]);
				break;
			}
		}

		return null;
	}
}
