import * as assert from "../../assert";
import {parseThunk} from "../../parser/erb";
import * as E from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import type Thunk from "../../thunk";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

const REND = /^REND$/i;
const PARSER = U.arg1R1(E.expr);
export default class Repeat extends Statement {
	public static parse(arg: string, lines: string[], from: number): [Repeat, number] {
		let index = from + 1;

		const [thunk, consumed] = parseThunk(lines, index, (l) => REND.test(l));
		index += consumed + 1;

		return [new Repeat(arg, thunk), index - from];
	}

	public condition: Lazy<Expr>;
	public thunk: Thunk;

	public constructor(arg: string, thunk: Thunk) {
		super();
		this.condition = new Lazy(arg, PARSER);
		this.thunk = thunk;
	}

	public *run(vm: VM, label?: string) {
		if (label != null) {
			if (this.thunk.labelMap.has(label)) {
				return yield* this.thunk.run(vm, label);
			}
		}

		const condition = this.condition.get().reduce(vm);
		assert.number(condition, "Condition for REPEAT should be an integer");

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
