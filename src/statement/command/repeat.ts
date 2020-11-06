import {assertNumber} from "../../assert";
import type Thunk from "../../thunk";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

export default class Repeat extends Statement {
	public condition: Expr;
	public thunk: Thunk;

	public constructor(condition: Expr, thunk: Thunk) {
		super();
		this.condition = condition;
		this.thunk = thunk;
	}

	public *run(vm: VM, label?: string) {
		if (label != null) {
			if (this.thunk.labelMap.has(label)) {
				return yield* this.thunk.run(vm, label);
			}
		}

		const condition = this.condition.reduce(vm);
		assertNumber(condition, "Condition for REPEAT should be an integer");

		loop: for (let i = 0; i < condition; ++i) {
			vm.setValue(i, "COUNT");
			const result = yield* this.thunk.run(vm);
			switch (result?.type) {
				case "begin": return result;
				case "goto": return result;
				case "break": break loop;
				case "continue": continue loop;
				case "throw": return result;
				case "return": return result;
				case "quit": return result;
				case undefined: continue loop;
			}
		}

		return null;
	}
}
