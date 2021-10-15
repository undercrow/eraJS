import * as assert from "../../assert";
import * as E from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

const PARSER = U.arg1R1(E.expr);
export default class ClearLine extends Statement {
	public arg: Lazy<Expr>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public *run(vm: VM) {
		const count = this.arg.get().reduce(vm);
		assert.number(count, "Argument of CLEARLINE must be an integer!");

		yield <const>{type: "clearline", count};

		const lineCount = vm.getValue("LINECOUNT").get(vm, [0]) as number;
		vm.getValue("LINECOUNT").set(vm, lineCount - count, []);

		return null;
	}
}
