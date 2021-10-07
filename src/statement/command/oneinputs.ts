import {assertString} from "../../assert";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import Statement from "../index";

const PARSER = U.arg1R0(U.charSeq());
export default class OneInputS extends Statement {
	public arg: Lazy<string | undefined>;

	public constructor(raw: string) {
		super();
		this.arg = new Lazy(raw, PARSER);
	}

	public *run(vm: VM): ReturnType<Statement["run"]> {
		const arg = this.arg.get();

		let input = yield <const>{type: "input", numeric: false};
		assertString(input, "Input value for ONEINPUTS should be a valid string");
		if (arg != null && input === "") {
			input = arg;
		}
		vm.getValue("RESULTS").set(vm, input[0], [0]);

		return null;
	}
}
