import * as assert from "../../assert";
import {parseThunk} from "../../parser/erb";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type Thunk from "../../thunk";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement, {Result} from "../index";

const WEND = /^WEND$/i;
const PARSER = U.arg1R1(X.expr);
export default class While extends Statement {
	public static parse(arg: Slice, lines: Slice[], from: number): [While, number] {
		let index = from + 1;

		const [thunk, consumed] = parseThunk(lines, index, (l) => WEND.test(l));
		index += consumed + 1;

		return [new While(arg, thunk), index - from];
	}

	public arg: Lazy<Expr>;
	public thunk: Thunk;

	public constructor(raw: Slice, thunk: Thunk) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
		this.thunk = thunk;
	}

	public async *run(vm: VM, label?: string) {
		let firstLoop = true;
		while (true) {
			let result: Result | null;
			if (firstLoop && label != null && this.thunk.labelMap.has(label)) {
				result = yield* this.thunk.run(vm, label);
			} else {
				const condition = await this.arg.get().reduce(vm);
				assert.bigint(condition, "Condition of WHILE should be an integer");
				if (condition === 0n) {
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
