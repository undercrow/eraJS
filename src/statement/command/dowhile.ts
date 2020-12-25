import {assertNumber} from "../../assert";
import {parseThunk} from "../../erb/erb";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type Thunk from "../../thunk";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

const LOOP = /^LOOP\s+/i;
const PARSER_ARG = U.arg0R0();
const PARSER_COND = U.arg1R1(E.expr);
export default class DoWhile extends Statement {
	public static parse(arg: string, lines: string[]): [DoWhile, string[]] {
		PARSER_ARG.tryParse(arg);
		const [thunk, rest] = parseThunk(lines, (l) => LOOP.test(l));
		const expr = rest.shift()!.slice("LOOP".length);

		return [new DoWhile(expr, thunk), rest];
	}

	public condition: Lazy<Expr>;
	public thunk: Thunk;

	public constructor(condition: string, thunk: Thunk) {
		super();
		this.condition = new Lazy(condition, PARSER_COND);
		this.thunk = thunk;
	}

	public *run(vm: VM, label?: string) {
		let firstLoop = true;
		while (true) {
			const result = yield* this.thunk.run(vm, firstLoop ? label : undefined);

			const condition = this.condition.get().reduce(vm);
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
				case "quit": return result;
				case undefined: continue;
			}
		}

		return null;
	}
}
