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
	public static parse(lines: string[], from: number): [TryCJumpForm, number] {
		let index = from;

		const [target, arg] = CallForm.PARSER("").tryParse(
			lines[index].slice("TRYCJUMPFORM".length),
		);
		index += 1;

		if (lines.length <= index || !CATCH.test(lines[index])) {
			throw new Error("Expected CATCH statement");
		}
		index += 1;

		const [catchThunk, consumed] = parseThunk(lines, index, (l) => ENDCATCH.test(l));
		index += consumed + 1;

		return [new TryCJumpForm(target, arg, catchThunk), index - from];
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
