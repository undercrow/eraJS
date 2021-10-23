import * as assert from "../../assert";
import * as C from "../../parser/const";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import Statement from "../index";

const PARSER = U.arg1R0(C.charSeq());
export default class OneInputS extends Statement {
	public arg: Lazy<string | undefined>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public *run(vm: VM): ReturnType<Statement["run"]> {
		const arg = this.arg.get();

		let input = yield* vm.queue.input(false);
		assert.string(input, "Input value for ONEINPUTS should be a valid string");
		if (arg != null && input === "") {
			input = arg;
		}
		vm.getValue("RESULTS").set(vm, input[0], [0]);

		return null;
	}
}
