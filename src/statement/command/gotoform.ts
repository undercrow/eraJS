import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import type VM from "../../vm";
import Form from "../expr/form";
import Statement from "../index";

export default class GotoForm extends Statement {
	public static parse(raw: string): GotoForm {
		const target = U.arg1R1(E.form()).tryParse(raw);
		return new GotoForm(target);
	}

	public target: Form;

	public constructor(target: Form) {
		super();
		this.target = target;
	}

	public *run(vm: VM) {
		const target = this.target.reduce(vm).toUpperCase();

		const context = vm.context();
		if (!context.fn.thunk.labelMap.has(target)) {
			throw new Error(`Label ${target} does not exist`);
		}

		return <const>{
			type: "goto",
			label: target,
		};
	}
}
