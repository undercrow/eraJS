import {assertNumber} from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

export default class Repeat extends Statement {
	public condition: Expr;
	public statement: Statement[];

	public constructor(condition: Expr, statement: Statement[]) {
		super();
		this.condition = condition;
		this.statement = statement;
	}

	public *run(vm: VM) {
		const condition = this.condition.reduce(vm);
		assertNumber(condition, "Condition for REPEAT should be an integer");

		loop: for (let i = 0; i < condition; ++i) {
			vm.setValue(i, "COUNT");
			const result = yield* vm.eval(this.statement);
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
