import {parseThunk} from "../../erb/erb";
import type Thunk from "../../thunk";
import type VM from "../../vm";
import Expr from "../expr";
import Statement from "../index";
import Call from "./call";

const CATCH = /^CATCH$/i;
const ENDCATCH = /^ENDCATCH$/i;
export default class TryCCall extends Statement {
	public static parse(lines: string[]): [TryCCall, string[]] {
		let rest = lines.slice();

		const [target, arg] = Call.compileArg(rest.shift()!.slice("TRYCCALL".length));
		const [thenThunk, restT] = parseThunk(rest, (l) => CATCH.test(l));
		rest = restT;
		rest.shift(); // Remove CATCH statement

		const [catchThunk, restC] = parseThunk(rest, (l) => ENDCATCH.test(l));
		rest = restC;
		rest.shift(); // Remove ENDCATCH statement

		return [new TryCCall(target, arg, thenThunk, catchThunk), rest];
	}

	public target: string;
	public arg: Expr[];
	public thenThunk: Thunk;
	public catchThunk: Thunk;

	public constructor(target: string, arg: Expr[], thenThunk: Thunk, catchThunk: Thunk) {
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
			yield* new Call(target, this.arg).run(vm);
			return yield* this.thenThunk.run(vm, label);
		} else {
			return yield* this.catchThunk.run(vm, label);
		}
	}
}
