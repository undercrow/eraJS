import * as assert from "../../assert";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import {PrintFlag} from "../../printer";
import Slice from "../../slice";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

const PARSER = U.arg1R1(X.expr);
export default class PrintFormS extends Statement {
	public flags: Set<PrintFlag>;
	public arg: Lazy<Expr>;

	public constructor(flags: PrintFlag[], raw: Slice) {
		super(raw);

		this.flags = new Set(flags);
		this.arg = new Lazy(raw, PARSER);
	}

	public async *run(vm: VM) {
		if (vm.printer.skipDisp) {
			return null;
		}

		const form = await this.arg.get().reduce(vm);
		assert.string(form, "1st argument of PRINTFORMS must be a string");
		const text = await X.form[""].tryParse(form).reduce(vm);
		assert.string(text, "1st argument of PRINTFORMS must be reduced to a string");
		yield* vm.printer.print(text, this.flags);

		return null;
	}
}
