import {assertNumber} from "../../assert";
import {parseThunk} from "../../erb/erb";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type Thunk from "../../thunk";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

const REND = /^REND$/i;
export default class Repeat extends Statement {
	public static parse(arg: string, lines: string[]): [Repeat, string[]] {
		const [thunk, rest] = parseThunk(lines, (l) => REND.test(l));
		rest.shift(); // Remove REND statement

		return [new Repeat(arg, thunk), rest];
	}

	public condition: Lazy<Expr>;
	public thunk: Thunk;

	public constructor(arg: string, thunk: Thunk) {
		super();
		this.condition = new Lazy(arg, U.arg1R1(E.expr));
		this.thunk = thunk;
	}

	public *run(vm: VM, label?: string) {
		if (label != null) {
			if (this.thunk.labelMap.has(label)) {
				return yield* this.thunk.run(vm, label);
			}
		}

		const condition = this.condition.get().reduce(vm);
		assertNumber(condition, "Condition for REPEAT should be an integer");

		loop: for (let i = 0; i < condition; ++i) {
			vm.getValue("COUNT").set(vm, i, []);
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
