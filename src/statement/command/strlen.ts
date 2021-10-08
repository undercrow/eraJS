import * as assert from "../../assert";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import Statement from "../index";

const PARSER = U.arg1R1(U.charSeq());
export default class StrLen extends Statement {
	public value: Lazy<string>;

	public constructor(arg: string) {
		super();
		this.value = new Lazy(arg, PARSER);
	}

	public *run(vm: VM) {
		const value = this.value.get();
		assert.string(value, "Argument of STRLEN must be a string!");
		vm.getValue("RESULT").set(vm, value.length, [0]);

		return null;
	}
}
