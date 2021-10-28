import * as E from "../../error";
import {parseThunk} from "../../parser/erb";
import * as C from "../../parser/const";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type Thunk from "../../thunk";
import type VM from "../../vm";
import Statement from "../index";
import Goto from "./goto";

const CATCH = /^CATCH$/i;
const ENDCATCH = /^ENDCATCH$/i;
const PARSER = U.arg1R1(C.Identifier);
export default class TryCGoto extends Statement {
	public static parse(arg: Slice, lines: Slice[], from: number): [TryCGoto, number] {
		let index = from + 1;
		if (lines.length <= index) {
			throw E.parser("Unexpected end of thunk in TRYCGOTO expression");
		} else if (!CATCH.test(lines[index].content)) {
			throw E.parser("Could not find CATCH for TRYCGOTO expression");
		}
		index += 1;

		const [catchThunk, consumed] = parseThunk(lines, index, (l) => ENDCATCH.test(l));
		index += consumed + 1;

		return [new TryCGoto(arg, catchThunk), index - from];
	}

	public arg: Lazy<string>;
	public catchThunk: Thunk;

	public constructor(raw: Slice, catchThunk: Thunk) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
		this.catchThunk = catchThunk;
	}

	public async *run(vm: VM, label?: string) {
		const target = this.arg.get().toUpperCase();
		const context = vm.context();
		if (context.fn.thunk.labelMap.has(target)) {
			return yield* Goto.exec(vm, target);
		} else {
			return yield* this.catchThunk.run(vm, label);
		}
	}
}
