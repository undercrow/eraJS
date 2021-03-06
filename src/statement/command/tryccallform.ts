import {parseThunk} from "../../erb/erb";
import type Thunk from "../../thunk";
import type VM from "../../vm";
import type Expr from "../expr";
import type Form from "../expr/form";
import Statement from "../index";
import Call from "./call";
import CallForm from "./callform";

const CATCH = /^CATCH$/i;
const ENDCATCH = /^ENDCATCH$/i;
export default class TryCCallForm extends Statement {
	public static parse(lines: string[]): [TryCCallForm, string[]] {
		let rest = lines.slice();

		const [target, arg] = CallForm.compileArg(rest.shift()!.slice("TRYCCALLFORM".length), "");
		if (rest.length === 0 || !CATCH.test(rest[0])) {
			throw new Error("Expected CATCH statement");
		}
		rest.shift(); // Remove CATCH statement

		const [catchThunk, restC] = parseThunk(rest, (l) => ENDCATCH.test(l));
		rest = restC;
		rest.shift(); // Remove ENDCATCH statement

		return [new TryCCallForm(target, arg, catchThunk), rest];
	}

	public target: Form;
	public arg: Expr[];
	public catchThunk: Thunk;

	public constructor(target: Form, arg: Expr[], catchThunk: Thunk) {
		super();
		this.target = target;
		this.arg = arg;
		this.catchThunk = catchThunk;
	}

	public *run(vm: VM, label?: string) {
		const target = this.target.reduce(vm).toUpperCase();
		if (vm.fnMap.has(target)) {
			return yield* new Call(target, this.arg).run(vm);
		} else {
			return yield* this.catchThunk.run(vm, label);
		}
	}
}
