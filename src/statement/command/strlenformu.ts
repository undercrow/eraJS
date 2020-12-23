import {assertString} from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import type Form from "../expr/form";
import Statement from "../index";

export default class StrLenFormU extends Statement {
	public value: Lazy<Form>;

	public constructor(arg: string) {
		super();
		this.value = new Lazy(arg, U.arg1R1(E.form[""]));
	}

	public *run(vm: VM) {
		const value = this.value.get().reduce(vm);
		assertString(value, "Argument of STRLENFORMU must be a string!");
		vm.getValue("RESULT").set(vm, value.length, [0]);

		return null;
	}
}
