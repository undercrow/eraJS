import * as assert from "../../assert";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import type Form from "../expr/form";
import Statement from "../index";

const PARSER = U.arg1R1(X.form[""]);
export default class StrLenFormU extends Statement {
	public arg: Lazy<Form>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public async *run(vm: VM) {
		const value = await this.arg.get().reduce(vm);
		assert.string(value, "Argument of STRLENFORMU must be a string!");
		vm.getValue("RESULT").set(vm, value.length, [0]);

		return null;
	}
}
