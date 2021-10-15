import * as EM from "../../error";
import {parseThunk} from "../../parser/erb";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type Thunk from "../../thunk";
import type VM from "../../vm";
import Statement from "../index";
import CallForm from "./callform";
import Jump from "./jump";

const CATCH = /^CATCH$/i;
const ENDCATCH = /^ENDCATCH$/i;
export default class TryCJumpForm extends Statement {
	public static parse(arg: Slice, lines: Slice[], from: number): [TryCJumpForm, number] {
		let index = from + 1;
		if (lines.length <= index) {
			throw EM.parser("Unexpected end of thunk in TRYCJUMPFORM expression");
		} else if (!CATCH.test(lines[index].content)) {
			throw EM.parser("Could not find CATCH for TRYCJUMPFORM expression");
		}
		index += 1;

		const [catchThunk, consumed] = parseThunk(lines, index, (l) => ENDCATCH.test(l));
		index += consumed + 1;

		return [new TryCJumpForm(arg, catchThunk), index - from];
	}

	public arg: CallForm["arg"];
	public catchThunk: Thunk;

	public constructor(raw: Slice, catchThunk: Thunk) {
		super(raw);

		this.arg = new Lazy(raw, CallForm.PARSER(""));
		this.catchThunk = catchThunk;
	}

	public *run(vm: VM, label?: string) {
		const [targetExpr, argExpr] = this.arg.get();
		const target = targetExpr.reduce(vm).toUpperCase();
		if (vm.fnMap.has(target)) {
			return yield* Jump.exec(vm, target, argExpr);
		} else {
			return yield* this.catchThunk.run(vm, label);
		}
	}
}
