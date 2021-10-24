import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import {PrintFlag} from "../../output-queue";
import Slice from "../../slice";
import type VM from "../../vm";
import Form from "../expr/form";
import Statement from "../index";

const PARSER = U.arg1R0(X.form[""]).map((form) => form ?? new Form([{value: ""}]));
export default class PrintForm extends Statement {
	public flags: Set<PrintFlag>;
	public arg: Lazy<Form>;

	public constructor(flags: PrintFlag[], raw: Slice) {
		super(raw);

		this.flags = new Set(flags);
		this.arg = new Lazy(raw, PARSER);
	}

	public *run(vm: VM) {
		if (vm.queue.skipDisp) {
			return null;
		}

		const value = this.arg.get().reduce(vm);
		yield* vm.queue.print(value, this.flags);

		return null;
	}
}
