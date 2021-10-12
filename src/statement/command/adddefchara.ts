import * as U from "../../parser/util";
import type VM from "../../vm";
import Statement from "../index";
import AddChara from "./addchara";

const PARSER = U.arg0R0();
export default class AddDefChara extends Statement {
	public constructor(arg: string) {
		super();
		PARSER.tryParse(arg);
	}

	public *run(vm: VM) {
		return yield* new AddChara(" 0").run(vm);
	}
}
