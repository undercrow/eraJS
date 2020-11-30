import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import Form from "../expr/form";
import Statement from "../index";
import Print from "./print";

export default class PrintForm extends Statement {
	public postfix: string;
	public value: Lazy<Form>;

	public constructor(instruction: string, raw: string) {
		super();
		this.postfix = instruction.replace(/^PRINTFORM/, "");
		this.value = new Lazy(
			raw,
			U.arg1R0(E.form()).map((form) => form ?? new Form([{value: ""}])),
		);
	}

	public *run(vm: VM) {
		if (vm.skipDisp) {
			return null;
		}

		yield* Print.print(vm, this.value.get().reduce(vm));
		yield* Print.runPostfix(vm, this.postfix);

		return null;
	}
}
