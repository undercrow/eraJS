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
	public step?: Expr;
	public thunk: Thunk;

	public constructor(counter: Variable, start: Expr, end: Expr, thunk: Thunk, step?: Expr) {
		super();
		this.counter = counter;
		this.start = start;
		this.end = end;
		this.step = step;
		this.thunk = thunk;
	}

	public *run(vm: VM, label?: string) {
		if (label != null) {
			if (this.thunk.labelMap.has(label)) {
				return yield* this.thunk.run(vm, label);
			}
		}

		const start = this.start.reduce(vm);
		assertNumber(start, "Starting value for FOR should be an integer");
		const end = this.end.reduce(vm);
		assertNumber(end, "Ending value for FOR should be an integer");
		const step = this.step?.reduce(vm) ?? 1;
		assertNumber(step, "Step of FOR should be an integer");
		const index = this.counter.reduceIndex(vm);

		loop: for (let i = start; i < end; i += step) {
			vm.setValue(i, this.counter.name, ...index);
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
