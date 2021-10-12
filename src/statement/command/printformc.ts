import * as E from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import Form from "../expr/form";
import Statement from "../index";
import Print from "./print";

const PARSER = U.arg1R0(E.form[""]).map((form) => form ?? new Form([{value: ""}]));
export default class PrintFormC extends Statement {
	public align: "LEFT" | "RIGHT";
	public postfix: string;
	public value: Lazy<Form>;

	public constructor(align: PrintFormC["align"], postfix: string, raw: string) {
		super();
		this.align = align;
		this.postfix = postfix;
		this.value = new Lazy(raw, PARSER);
	}

	public *run(vm: VM) {
		if (vm.skipDisp) {
			return null;
		}

		yield* vm.print(this.value.get().reduce(vm), this.align);
		yield* Print.runPostfix(vm, this.postfix);

		return null;
	}
}
