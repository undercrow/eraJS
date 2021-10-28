import * as C from "../../parser/const";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import {PrintFlag} from "../../output-queue";
import Slice from "../../slice";
import type VM from "../../vm";
import Statement from "../index";

const PARSER = U.arg1R0(C.charSeq()).map((str) => str ?? "");
export default class Print extends Statement {
	public flags: Set<PrintFlag>;
	public value: Lazy<string>;

	public constructor(flags: PrintFlag[], raw: Slice) {
		super(raw);

		this.flags = new Set(flags);
		this.value = new Lazy(raw, PARSER);
	}

	public async *run(vm: VM) {
		if (vm.queue.skipDisp) {
			return null;
		}

		yield* vm.queue.print(this.value.get(), this.flags);

		return null;
	}
}
