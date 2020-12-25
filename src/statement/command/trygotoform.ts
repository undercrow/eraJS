import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import type VM from "../../vm";
import type Form from "../expr/form";
import Statement from "../index";
import Goto from "./goto";

const PARSER = U.arg1R1(E.form[""]);
export default class TryGotoForm extends Statement {
	public static parse(raw: string): TryGotoForm {
		const target = PARSER.tryParse(raw);
		return new TryGotoForm(target);
	}

	public target: Form;

	public constructor(target: Form) {
		super();
		this.target = target;
	}

	public *run(vm: VM) {
		const target = this.target.reduce(vm).toUpperCase();
		const context = vm.context();
		if (context.fn.thunk.labelMap.has(target)) {
			return yield* new Goto(target).run(vm);
		}

		return null;
	}
}
