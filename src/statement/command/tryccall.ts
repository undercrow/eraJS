import {parseThunk} from "../../erb/erb";
import type Thunk from "../../thunk";
import type VM from "../../vm";
import Expr from "../expr";
import Statement from "../index";
import Call from "./call";

const CATCH = /^CATCH$/i;
const ENDCATCH = /^ENDCATCH$/i;
export default class TryCCall extends Statement {
	public static parse(lines: string[], from: number): [TryCCall, number] {
		let index = from;

		const [target, arg] = Call.PARSER.tryParse(lines[index].slice("TRYCCALL".length));
		index += 1;

		const [thenThunk, consumedT] = parseThunk(lines, index, (l) => CATCH.test(l));
		index += consumedT + 1;

		const [catchThunk, consumedC] = parseThunk(lines, index, (l) => ENDCATCH.test(l));
		index += consumedC + 1;

		return [new TryCCall(target, arg, thenThunk, catchThunk), index - from];
	}

	public target: string;
	public arg: (Expr | undefined)[];
	public thenThunk: Thunk;
	public catchThunk: Thunk;

	public constructor(target: string, arg: TryCCall["arg"], thenThunk: Thunk, catchThunk: Thunk) {
		super();
		this.target = target;
		this.arg = arg;
		this.thenThunk = thenThunk;
		this.catchThunk = catchThunk;
	}

	public *run(vm: VM, label?: string) {
		if (label != null && this.thenThunk.labelMap.has(label)) {
			return yield* this.thenThunk.run(vm, label);
		}
		if (label != null && this.catchThunk.labelMap.has(label)) {
			return yield* this.catchThunk.run(vm, label);
		}

		const target = this.target.toUpperCase();
		if (vm.fnMap.has(target)) {
			yield* Call.exec(vm, target, this.arg);
			return yield* this.thenThunk.run(vm, label);
		} else {
			return yield* this.catchThunk.run(vm, label);
		}
	}
}
