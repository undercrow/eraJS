import * as assert from "../../assert";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import Str0DValue from "../../value/str-0d";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

const PARSER = U.arg1R1(X.form[""]);
export default class PutForm extends Statement {
	public arg: Lazy<Expr>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public async *run(vm: VM) {
		const value = await this.arg.get().reduce(vm);
		assert.string(value, "1st argument of PUTFORM should be a number");

		const cell = vm.getValue<Str0DValue>("SAVEDATA_TEXT");
		cell.set(vm, cell.get(vm, []) + value, []);

		return null;
	}
}
