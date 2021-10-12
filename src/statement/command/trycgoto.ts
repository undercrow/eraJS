import {parseThunk} from "../../parser/erb";
import * as U from "../../parser/util";
import type Thunk from "../../thunk";
import type VM from "../../vm";
import Statement from "../index";
import Goto from "./goto";

const CATCH = /^CATCH$/i;
const ENDCATCH = /^ENDCATCH$/i;
const PARSER = U.arg1R1(U.Identifier);
export default class TryCGoto extends Statement {
	public static parse(lines: string[], from: number): [TryCGoto, number] {
		let index = from + 1;

		const target = PARSER.tryParse(lines[index].slice("TRYCGOTO".length));
		if (lines.length <= index || !CATCH.test(lines[index])) {
			throw new Error("Expected CATCH statement");
		}
		index += 1;

		const [catchThunk, consumed] = parseThunk(lines, index, (l) => ENDCATCH.test(l));
		index += consumed + 1;

		return [new TryCGoto(target, catchThunk), index - from];
	}

	public target: string;
	public catchThunk: Thunk;

	public constructor(target: string, catchThunk: Thunk) {
		super();
		this.target = target;
		this.catchThunk = catchThunk;
	}

	public *run(vm: VM, label?: string) {
		const target = this.target.toUpperCase();
		const context = vm.context();
		if (context.fn.thunk.labelMap.has(target)) {
			return yield* new Goto(target).run(vm);
		} else {
			return yield* this.catchThunk.run(vm, label);
		}
	}
}
