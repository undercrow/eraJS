import {assertNumber} from "../../assert";
import type Thunk from "../../thunk";
import type VM from "../../vm";
import type Expr from "../expr";
import type Variable from "../expr/variable";
import Statement from "../index";

export default class For extends Statement {
	public counter: Variable;
	public start: Expr;
	public end: Expr;
	public thunk: Thunk;

	public constructor(counter: Variable, start: Expr, end: Expr, thunk: Thunk) {
		super();
		this.counter = counter;
		this.start = start;
		this.end = end;
		this.thunk = thunk;
	}

	public *run(vm: VM) {
		const start = this.start.reduce(vm);
		assertNumber(start, "Starting value for FOR should be an integer");
		const end = this.end.reduce(vm);
		assertNumber(end, "Ending value for FOR should be an integer");
		const index = this.counter.reduceIndex(vm);

		loop: for (let i = start; i < end; ++i) {
			vm.setValue(i, this.counter.name, ...index);
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
