import dayjs from "dayjs";

import * as U from "../../erb/util";
import type VM from "../../vm";
import Statement from "../index";

export default class GetTime extends Statement {
	public constructor(arg: string) {
		super();
		U.arg0R0().tryParse(arg);
	}

	public *run(vm: VM) {
		const now = dayjs();

		vm.getValue("RESULT").set(vm, parseInt(now.format("YYYYMMDDHHmmssSSS")), [0]);
		vm.getValue("RESULTS").set(vm, now.format("YYYY年MM月DD日 HH:mm:ss"), [0]);

		return null;
	}
}
