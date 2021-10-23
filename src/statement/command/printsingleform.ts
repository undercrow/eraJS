import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import Form from "../expr/form";
import Statement from "../index";
import Print from "./print";

const PARSER = U.arg1R0(X.form[""]).map((form) => form ?? new Form([{value: ""}]));
export default class PrintSingleForm extends Statement {
	public postfix: string;
	public arg: Lazy<Form>;

	public constructor(postfix: string, raw: Slice) {
		super(raw);

		this.postfix = postfix;
		this.arg = new Lazy(raw, PARSER);
	}

	public *run(vm: VM) {
		if (vm.queue.skipDisp) {
			return null;
		}

		yield* vm.queue.print(this.arg.get().reduce(vm));
		yield* Print.runPostfix(vm, this.postfix);

		return null;
	}
}
