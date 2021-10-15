import * as assert from "../../assert";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import Statement from "../index";

const PARSER = U.arg1R1(U.charSeq());
export default class StrLen extends Statement {
	public arg: Lazy<string>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public *run(vm: VM) {
		const value = this.arg.get();
		assert.string(value, "Argument of STRLENU must be a string!");
		vm.getValue("RESULT").set(vm, value.length, [0]);

		return null;
	}
}
