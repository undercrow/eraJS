import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import Statement from "../index";
import Print from "./print";

export default class PrintC extends Statement {
	public postfix: string;
	public value: Lazy<string>;

	public constructor(postfix: string, raw: string) {
		super();
		this.postfix = postfix;
		this.value = new Lazy(raw, U.arg1R0(U.charSeq()).map((str) => str ?? ""));
	}

	public *run(vm: VM) {
		if (vm.skipDisp) {
			return null;
		}

		const text = this.value.get();

		// TODO: Apply alignment
		yield* Print.print(vm, text);
		yield* Print.runPostfix(vm, this.postfix);

		return null;
	}
}
