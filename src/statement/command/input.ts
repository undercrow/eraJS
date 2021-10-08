import * as assert from "../../assert";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import Statement from "../index";

const PARSER = U.arg1R0(U.Int);
export default class Input extends Statement {
	public arg: Lazy<number | undefined>;

	public constructor(raw: string) {
		super();
		this.arg = new Lazy(raw, PARSER);
	}

	public *run(vm: VM): ReturnType<Statement["run"]> {
		const arg = this.arg.get();

		const input = yield <const>{type: "input", numeric: true};
		assert.cond(input != null, "Input value for INPUT should be a valid number");

		let value = Number(input);
		if (arg != null && input === "") {
			value = arg;
		}
		assert.number(value, "Input value for INPUT should be a valid number");

		vm.getValue("RESULT").set(vm, value, [0]);

		return null;
	}
}
