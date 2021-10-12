import {parseThunk} from "../../parser/erb";
import type Thunk from "../../thunk";
import type VM from "../../vm";
import Expr from "../expr";
import Statement from "../index";
import Call from "./call";
import Jump from "./jump";

const CATCH = /^CATCH$/i;
const ENDCATCH = /^ENDCATCH$/i;
export default class TryCJump extends Statement {
	public static parse(lines: string[], from: number): [TryCJump, number] {
		let index = from;

		const [target, arg] = Call.PARSER.tryParse(lines[index].slice("TRYCJUMP".length));
		index += 1;

		if (lines.length <= index || !CATCH.test(lines[index])) {
			throw new Error("Expected CATCH statement");
		}
		index += 1;

		const [catchThunk, consumed] = parseThunk(lines, index, (l) => ENDCATCH.test(l));
		index += consumed + 1;

		return [new TryCJump(target, arg, catchThunk), index - from];
	}

	public target: string;
	public arg: (Expr | undefined)[];
	public catchExpr: Thunk;

	public constructor(target: string, arg: TryCJump["arg"], catchExpr: Thunk) {
		super();
		this.target = target;
		this.arg = arg;
		this.catchExpr = catchExpr;
	}

	public *run(vm: VM, label?: string) {
		const target = this.target.toUpperCase();
		if (vm.fnMap.has(target)) {
			return yield* Jump.exec(vm, this.target, this.arg);
		} else {
			return yield* this.catchExpr.run(vm, label);
		}
	}
}
