import {assert, assertNumber} from "../../assert";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import Statement from "../index";

const PARSER = U.arg1R0(U.Int);
export default class OneInput extends Statement {
	public arg: Lazy<number | undefined>;

	public constructor(raw: string) {
		super();
		this.arg = new Lazy(raw, PARSER);
	}

	// TODO: use only the first character of argument
	public *run(vm: VM): ReturnType<Statement["run"]> {
		const arg = this.arg.get();

		const input = yield <const>{type: "input", numeric: true};
		assert(input != null, "First value of input for ONEINPUT should be a valid number");

		let value = Number(input[0]);
		if (arg != null && input === "") {
			value = arg;
		}
		assertNumber(value, "First value of input for ONEINPUT should be a valid number");

		vm.getValue("RESULT").set(vm, value, [0]);

		return null;
	}
}
