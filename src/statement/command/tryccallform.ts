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
		const [thenThunk, restT] = parseThunk(rest, (l) => CATCH.test(l));
		rest = restT;
		rest.shift(); // Remove CATCH statement

		const [catchThunk, restC] = parseThunk(rest, (l) => ENDCATCH.test(l));
		rest = restC;
		rest.shift(); // Remove ENDCATCH statement

		return [new TryCCallForm(target, arg, thenThunk, catchThunk), rest];
	}

	public target: Form;
	public arg: (Expr | undefined)[];
	public thenThunk: Thunk;
	public catchThunk: Thunk;

	public constructor(
		target: Form,
		arg: TryCCallForm["arg"],
		thenThunk: Thunk,
		catchThunk: Thunk,
	) {
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

		const target = this.target.reduce(vm).toUpperCase();
		if (vm.fnMap.has(target)) {
			yield* new Call(target, this.arg).run(vm);
			return yield* this.thenThunk.run(vm, label);
		} else {
			return yield* this.catchThunk.run(vm, label);
		}
	}
}
