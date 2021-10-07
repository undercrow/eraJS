import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import Statement from "../index";
import Print from "./print";

const PARSER = U.arg1R0(U.charSeq()).map((str) => str ?? "");
export default class PrintSingle extends Statement {
	public postfix: string;
	public arg: Lazy<string>;

	public constructor(postfix: string, raw: string) {
		super();
		this.postfix = postfix;
		this.arg = new Lazy(raw, PARSER);
	}

	public *run(vm: VM) {
		if (vm.skipDisp) {
			return null;
		}

		yield* vm.printSingle(this.arg.get());
		yield* Print.runPostfix(vm, this.postfix);

		return null;
	}
}
