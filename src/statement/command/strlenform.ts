import * as assert from "../../assert";
import * as E from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import type Form from "../expr/form";
import Statement from "../index";

const PARSER = U.arg1R1(E.form[""]);
export default class StrLenForm extends Statement {
	public value: Lazy<Form>;

	public constructor(arg: string) {
		super();
		this.value = new Lazy(arg, PARSER);
	}

	public *run(vm: VM) {
		const value = this.value.get().reduce(vm);
		assert.string(value, "Argument of STRLENFORM must be a string!");
		vm.getValue("RESULT").set(vm, value.length, [0]);

		return null;
	}
}
