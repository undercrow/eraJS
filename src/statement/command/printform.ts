import type VM from "../../vm";
import type Form from "../expr/form";
import Statement from "../index";
import Print from "./print";

export default class PrintForm extends Statement {
	public postfix: string;
	public value: Form;

	public constructor(instruction: string, value: Form) {
		super();
		this.postfix = instruction.replace(/^PRINTFORM/, "");
		this.value = value;
	}

	public *run(vm: VM) {
		if (vm.skipDisp) {
			return null;
		}

		yield* Print.print(vm, this.value.reduce(vm));
		yield* Print.runPostfix(vm, this.postfix);

		return null;
	}
}
