import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import {PrintFlag} from "../../printer";
import Slice from "../../slice";
import type VM from "../../vm";
import Form from "../expr/form";
import Statement from "../index";

const PARSER = U.arg1R0(X.form[""]).map((form) => form ?? new Form([{value: ""}]));
export default class PrintFormC extends Statement {
	public align: "LEFT" | "RIGHT";
	public flags: Set<PrintFlag>;
	public arg: Lazy<Form>;

	public constructor(align: PrintFormC["align"], flags: PrintFlag[], raw: Slice) {
		super(raw);

		this.align = align;
		this.flags = new Set(flags);
		this.arg = new Lazy(raw, PARSER);
	}

	public async *run(vm: VM) {
		if (vm.printer.skipDisp) {
			return null;
		}

		const value = await this.arg.get().reduce(vm);
		yield* vm.printer.print(value, this.flags, this.align);

		return null;
	}
}
