import dayjs from "dayjs";

import * as U from "../../parser/util";
import Slice from "../../slice";
import type VM from "../../vm";
import Statement from "../index";

const PARSER = U.arg0R0();
export default class GetTime extends Statement {
	public constructor(raw: Slice) {
		super(raw);

		U.tryParse(PARSER, raw);
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async *run(vm: VM) {
		const time = dayjs(vm.external.getTime());

		vm.getValue("RESULT").set(vm, parseInt(time.format("YYYYMMDDHHmmssSSS")), [0]);
		vm.getValue("RESULTS").set(vm, time.format("YYYY年MM月DD日 HH:mm:ss"), [0]);

		return null;
	}
}
