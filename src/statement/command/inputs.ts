import * as assert from "../../assert";
import * as C from "../../parser/const";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import Statement, {EraGenerator} from "../index";

const PARSER = U.arg1R0(C.charSeq());
export default class InputS extends Statement {
	public arg: Lazy<string | undefined>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public async *run(vm: VM): EraGenerator {
		const arg = this.arg.get();

		let input = yield* vm.printer.input(false, arg != null);
		assert.string(input, "Input value for INPUTS should be a valid string");
		if (arg != null && input === "") {
			input = arg;
		}
		vm.getValue("RESULTS").set(vm, input, [0]);

		return null;
	}
}
