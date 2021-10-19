import * as C from "../../parser/const";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import Statement from "../index";
import Print from "./print";

const PARSER = U.arg1R0(C.charSeq()).map((str) => str ?? "");
export default class PrintSingle extends Statement {
	public postfix: string;
	public arg: Lazy<string>;

	public constructor(postfix: string, raw: Slice) {
		super(raw);

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
