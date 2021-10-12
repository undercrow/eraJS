import * as assert from "../../assert";
import {parseThunk} from "../../parser/erb";
import * as E from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import type Thunk from "../../thunk";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement, {Result} from "../index";

const WEND = /^WEND$/i;
const PARSER = U.arg1R1(E.expr);
export default class While extends Statement {
	public static parse(arg: string, lines: string[], from: number): [While, number] {
		let index = from + 1;

		const [thunk, consumed] = parseThunk(lines, index, (l) => WEND.test(l));
		index += consumed + 1;

		return [new While(arg, thunk), index - from];
	}


	public condition: Lazy<Expr>;
	public thunk: Thunk;

	public constructor(arg: string, thunk: Thunk) {
		super();
		this.condition = new Lazy(arg, PARSER);
		this.thunk = thunk;
	}

	public *run(vm: VM, label?: string) {
		let firstLoop = true;
		while (true) {
			let result: Result | null;
			if (firstLoop && label != null && this.thunk.labelMap.has(label)) {
				result = yield* this.thunk.run(vm, label);
			} else {
				const condition = this.condition.get().reduce(vm);
				assert.number(condition, "Condition of WHILE should be an integer");
				if (condition === 0) {
					break;
				}
				result = yield* this.thunk.run(vm);
			}

			firstLoop = false;
			switch (result?.type) {
				case "begin": return result;
				case "goto": return result;
				case "break": return null;
				case "continue": continue;
				case "throw": return result;
				case "return": return result;
				case "quit": return result;
				case undefined: continue;
			}
		}

		return null;
	}
}
