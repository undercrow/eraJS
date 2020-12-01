import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import Statement from "../index";
import Print from "./print";

export default class PrintC extends Statement {
	public align: "LEFT" | "RIGHT";
	public postfix: string;
	public value: Lazy<string>;

	public constructor(align: PrintC["align"], postfix: string, raw: string) {
		super();
		this.align = align;
		this.postfix = postfix;
		this.value = new Lazy(raw, U.arg1R0(U.charSeq()).map((str) => str ?? ""));
	}

	public *run(vm: VM) {
		if (vm.skipDisp) {
			return null;
		}

		yield <const>{
			type: "string",
			text: this.value.get(),
			cell: this.align,
		};
		yield* Print.runPostfix(vm, this.postfix);

		return null;
	}
}
