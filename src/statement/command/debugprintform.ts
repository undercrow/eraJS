import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import {PrintFlag} from "../../printer";
import Slice from "../../slice";
import type VM from "../../vm";
import Form from "../expr/form";
import Statement from "../index";

const PARSER = U.arg1R0(X.form[""]).map((form) => form ?? new Form([{value: ""}]));
export default class DebugPrintForm extends Statement {
	public flags: Set<PrintFlag>;
	public arg: Lazy<Form>;

	public constructor(flags: PrintFlag[], raw: Slice) {
		super(raw);

		this.flags = new Set(flags);
		this.arg = new Lazy(raw, PARSER);
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async *run(_vm: VM) {
		// TODO

		return null;
	}
}
