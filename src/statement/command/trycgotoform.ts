import {parseThunk} from "../../erb/erb";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import type Thunk from "../../thunk";
import type VM from "../../vm";
import type Form from "../expr/form";
import Statement from "../index";
import Goto from "./goto";

const CATCH = /^CATCH$/i;
const ENDCATCH = /^ENDCATCH$/i;
export default class TryCGotoForm extends Statement {
	public static parse(lines: string[]): [TryCGotoForm, string[]] {
		let rest = lines.slice();

		const target = U.arg1R1(E.form()).tryParse(rest.shift()!.slice("TRYCGOTOFORM".length));
		if (rest.length === 0 || !CATCH.test(rest[0])) {
			throw new Error("Expected CATCH statement");
		}
		rest.shift(); // Remove CATCH statement

		const [catchThunk, restC] = parseThunk(rest, (l) => ENDCATCH.test(l));
		rest = restC;
		rest.shift(); // Remove ENDCATCH statement

		return [new TryCGotoForm(target, catchThunk), rest];
	}

	public target: Form;
	public catchThunk: Thunk;

	public constructor(target: Form, catchThunk: Thunk) {
		super();
		this.target = target;
		this.catchThunk = catchThunk;
	}

	public *run(vm: VM, label?: string) {
		const target = this.target.reduce(vm).toUpperCase();
		const context = vm.context();
		if (context.fn.thunk.labelMap.has(target)) {
			return yield* new Goto(target).run(vm);
		} else {
			return yield* this.catchThunk.run(vm, label);
		}
	}
}
