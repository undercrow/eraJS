import {parseThunk} from "../../parser/erb";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type Thunk from "../../thunk";
import type VM from "../../vm";
import Statement from "../index";
import Call from "./call";

const CATCH = /^CATCH$/i;
const ENDCATCH = /^ENDCATCH$/i;
export default class TryCCall extends Statement {
	public static parse(arg: Slice, lines: Slice[], from: number): [TryCCall, number] {
		let index = from + 1;

		const [thenThunk, consumedT] = parseThunk(lines, index, (l) => CATCH.test(l));
		index += consumedT + 1;

		const [catchThunk, consumedC] = parseThunk(lines, index, (l) => ENDCATCH.test(l));
		index += consumedC + 1;

		return [new TryCCall(arg, thenThunk, catchThunk), index - from];
	}

	public arg: Call["arg"];
	public thenThunk: Thunk;
	public catchThunk: Thunk;

	public constructor(raw: Slice, thenThunk: Thunk, catchThunk: Thunk) {
		super(raw);

		this.arg = new Lazy(raw, Call.PARSER);
		this.thenThunk = thenThunk;
		this.catchThunk = catchThunk;
	}

	public async *run(vm: VM, label?: string) {
		if (label != null && this.thenThunk.labelMap.has(label)) {
			return yield* this.thenThunk.run(vm, label);
		}
		if (label != null && this.catchThunk.labelMap.has(label)) {
			return yield* this.catchThunk.run(vm, label);
		}

		const [target, argExpr] = this.arg.get();
		const realTarget = target.toUpperCase();
		if (vm.fnMap.has(realTarget)) {
			yield* Call.exec(vm, realTarget, argExpr);
			return yield* this.thenThunk.run(vm, label);
		} else {
			return yield* this.catchThunk.run(vm, label);
		}
	}
}
