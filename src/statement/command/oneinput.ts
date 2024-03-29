import * as assert from "../../assert";
import * as C from "../../parser/const";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import Statement, {EraGenerator} from "../index";

const PARSER = U.arg1R0(C.Int);
export default class OneInput extends Statement {
	public arg: Lazy<number | undefined>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	// TODO: use only the first character of argument
	public async *run(vm: VM): EraGenerator {
		const arg = this.arg.get();

		const input = yield* vm.printer.input(true, arg != null);
		assert.cond(input != null, "First value of input for ONEINPUT should be a valid number");

		let value = Number(input[0]);
		if (arg != null && input === "") {
			value = arg;
		}
		assert.number(value, "First value of input for ONEINPUT should be a valid number");
		yield* vm.printer.print(value.toString(), new Set(["S"]));

		vm.getValue("RESULT").set(vm, BigInt(value), [0]);

		return null;
	}
}
