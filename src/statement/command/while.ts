import {assertNumber} from "../../assert";
import type Thunk from "../../thunk";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

export default class While extends Statement {
	public condition: Expr;
	public thunk: Thunk;

	public constructor(condition: Expr, thunk: Thunk) {
		super();
		this.condition = condition;
		this.thunk = thunk;
	}

	public *run(vm: VM) {
		loop: for (;;) {
			const condition = this.condition.reduce(vm);
			assertNumber(condition, "Condition of WHILE should be an integer");

			const result = yield* this.thunk.run(vm);
			switch (result?.type) {
				case "begin": return result;
				case "break": break loop;
				case "continue": continue loop;
				case "return": return result;
				case undefined: continue loop;
			}
		}

		return null;
	}
}
