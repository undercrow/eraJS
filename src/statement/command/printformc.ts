import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import Form from "../expr/form";
import Statement from "../index";
import Print from "./print";

export default class PrintFormC extends Statement {
	public align: "LEFT" | "RIGHT";
	public postfix: string;
	public value: Lazy<Form>;

	public constructor(align: PrintFormC["align"], postfix: string, raw: string) {
		super();
		this.align = align;
		this.postfix = postfix;
		this.value = new Lazy(
			raw,
			U.arg1R0(E.form()).map((form) => form ?? new Form([{value: ""}])),
		);
	}

	public *run(vm: VM) {
		if (vm.skipDisp) {
			return null;
		}

		yield <const>{
			type: "string",
			text: this.value.get().reduce(vm),
			cell: this.align,
		};
		yield* Print.runPostfix(vm, this.postfix);

		return null;
	}
}
