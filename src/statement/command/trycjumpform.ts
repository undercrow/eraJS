import {parseThunk} from "../../erb/erb";
import type Thunk from "../../thunk";
import type VM from "../../vm";
import type Expr from "../expr";
import type Form from "../expr/form";
import Statement from "../index";
import CallForm from "./callform";
import Jump from "./jump";

const CATCH = /^CATCH$/i;
const ENDCATCH = /^ENDCATCH$/i;
export default class TryCJumpForm extends Statement {
	public static parse(lines: string[]): [TryCJumpForm, string[]] {
		let rest = lines.slice();

		const [target, arg] = CallForm.compileArg(rest.shift()!.slice("TRYCJUMPFORM".length), "");
		if (rest.length === 0 || !CATCH.test(rest[0])) {
			throw new Error("Expected CATCH statement");
		}
		rest.shift(); // Remove CATCH statement

		const [catchThunk, restC] = parseThunk(rest, (l) => ENDCATCH.test(l));
		rest = restC;
		rest.shift(); // Remove ENDCATCH statement

		return [new TryCJumpForm(target, arg, catchThunk), rest];
	}

	public target: Form;
	public arg: (Expr | undefined)[];
	public catchThunk: Thunk;

	public constructor(target: Form, arg: TryCJumpForm["arg"], catchThunk: Thunk) {
		super();
		this.target = target;
		this.arg = arg;
		this.catchThunk = catchThunk;
	}

	public *run(vm: VM, label?: string) {
		const target = this.target.reduce(vm).toUpperCase();
		if (vm.fnMap.has(target)) {
			return yield* new Jump(target, this.arg).run(vm);
		} else {
			return yield* this.catchThunk.run(vm, label);
		}
	}
}
