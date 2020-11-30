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
		if (rest.length === 0 || !CATCH.test(rest[0])) {
			throw new Error("Expected CATCH statement");
		}
		rest.shift(); // Remove CATCH statement

		const [catchThunk, restC] = parseThunk(rest, (l) => ENDCATCH.test(l));
		rest = restC;
		rest.shift(); // Remove ENDCATCH statement

		return [new TryCCall(target, arg, catchThunk), rest];
	}

	public target: string;
	public arg: Expr[];
	public catchThunk: Thunk;

	public constructor(target: string, arg: Expr[], catchThunk: Thunk) {
		super();
		this.target = target;
		this.arg = arg;
		this.catchThunk = catchThunk;
	}

	public *run(vm: VM, label?: string) {
		const target = this.target.toUpperCase();
		if (vm.fnMap.has(target)) {
			return yield* new Call(target, this.arg).run(vm);
		} else {
			return yield* this.catchThunk.run(vm, label);
		}
	}
}
