import {assertNumber} from "../../assert";
import type Thunk from "../../thunk";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

export default class DoWhile extends Statement {
	public condition: Expr;
	public thunk: Thunk;

	public constructor(condition: Expr, thunk: Thunk) {
		super();
		this.condition = condition;
		this.thunk = thunk;
	}

	public *run(vm: VM, label?: string) {
		let firstLoop = true;
		while (true) {
			const result = yield* this.thunk.run(vm, firstLoop ? label : undefined);

			const condition = this.condition.reduce(vm);
			assertNumber(condition, "Condition of DO should be an integer");
			if (condition === 0) {
				break;
			}

			firstLoop = false;
			switch (result?.type) {
				case "begin": return result;
				case "goto": return result;
				case "break": return null;
				case "continue": continue;
				case "throw": return result;
				case "return": return result;
				case undefined: continue;
			}
		}

		return null;
	}
}
