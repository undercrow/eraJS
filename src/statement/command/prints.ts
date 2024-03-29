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
export default class PrintS extends Statement {
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

		const value = await this.arg.get().reduce(vm);
		assert.string(value, "1st argument of PRINTS must be a string");
		yield* vm.printer.print(value, this.flags);

		return null;
	}
}
