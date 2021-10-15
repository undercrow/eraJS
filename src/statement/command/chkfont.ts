import * as assert from "../../assert";
import * as E from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import Expr from "../expr";
import Statement from "../index";

const PARSER = U.arg1R1(E.expr);
export default class ChkFont extends Statement {
	public arg: Lazy<Expr>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public *run(vm: VM) {
		const arg = this.arg.get().reduce(vm);
		assert.string(arg, "1st argument of CHKFONT should be a string");

		const result = vm.external.getFont(arg) ? 1 : 0;
		vm.getValue("RESULT").set(vm, result, [0]);

		return null;
	}
}
