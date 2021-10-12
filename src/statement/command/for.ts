import * as assert from "../../assert";
import {parseThunk} from "../../parser/erb";
import * as E from "../../parser/expr";
import * as U from "../../parser/util";
import type Thunk from "../../thunk";
import type VM from "../../vm";
import type Expr from "../expr";
import type Variable from "../expr/variable";
import Statement from "../index";

const NEXT = /^NEXT$/i;
const PARSER = U.arg4R3(E.variable, E.expr, E.expr, E.expr);
export default class For extends Statement {
	public static parse(arg: string, lines: string[], from: number): [For, number] {
		let index = from + 1;

		const [thunk, consumed] = parseThunk(lines, index, (l) => NEXT.test(l));
		index += consumed + 1;

		return [new For(arg, thunk), index - from];
	}

	public raw: string;
	public thunk: Thunk;

	public counter?: Variable;
	public start?: Expr;
	public end?: Expr;
	public step?: Expr;

	public constructor(raw: string, thunk: Thunk) {
		super();
		this.raw = raw;
		this.thunk = thunk;
	}

	public compile() {
		if (this.counter == null) {
			[this.counter, this.start, this.end, this.step] = PARSER.tryParse(this.raw);
		}
	}

	public *run(vm: VM, label?: string) {
		this.compile();

		if (label != null) {
			if (this.thunk.labelMap.has(label)) {
				return yield* this.thunk.run(vm, label);
			}
		}

		const start = this.start!.reduce(vm);
		assert.number(start, "Starting value for FOR should be an integer");
		const end = this.end!.reduce(vm);
		assert.number(end, "Ending value for FOR should be an integer");
		const step = this.step?.reduce(vm) ?? 1;
		assert.number(step, "Step of FOR should be an integer");
		const index = this.counter!.reduceIndex(vm);

		loop: for (let i = start; i < end; i += step) {
			this.counter!.getCell(vm).set(vm, i, index);
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
