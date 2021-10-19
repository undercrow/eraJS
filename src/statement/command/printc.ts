import * as C from "../../parser/const";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import Statement from "../index";
import Print from "./print";

const PARSER = U.arg1R0(C.charSeq()).map((str) => str ?? "");
export default class PrintC extends Statement {
	public align: "LEFT" | "RIGHT";
	public postfix: string;
	public value: Lazy<string>;

	public constructor(align: PrintC["align"], postfix: string, raw: Slice) {
		super(raw);

		this.align = align;
		this.postfix = postfix;
		this.value = new Lazy(raw, PARSER);
	}

	public *run(vm: VM) {
		if (vm.skipDisp) {
			return null;
		}

		yield* vm.print(this.value.get(), this.align);
		yield* Print.runPostfix(vm, this.postfix);

		return null;
	}
}
