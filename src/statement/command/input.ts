import type VM from "../../vm";
import type Statement from "../index";

export default class Input implements Statement {
	public def?: number;

	public constructor(def?: number) {
		this.def = def;
	}

	public *run(vm: VM) {
		while (true) {
			const raw = yield <const>{type: "input"};
			const value = parseInt(raw);
			if (!isNaN(value)) {
				vm.setValue(value, "RESULT", 0);
				break;
			}
		}

		return null;
	}
}
