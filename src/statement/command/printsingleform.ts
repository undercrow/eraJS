import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import Form from "../expr/form";
import Statement from "../index";
import Print from "./print";

const PARSER = U.arg1R0(E.form[""]).map((form) => form ?? new Form([{value: ""}]));
export default class PrintSingleForm extends Statement {
	public postfix: string;
	public arg: Lazy<Form>;

	public constructor(postfix: string, raw: string) {
		super();
		this.postfix = postfix;
		this.arg = new Lazy(raw, PARSER);
	}

	public *run(vm: VM) {
		if (vm.skipDisp) {
			return null;
		}

		yield* vm.print(this.arg.get().reduce(vm));
		yield* Print.runPostfix(vm, this.postfix);

		return null;
	}
}
