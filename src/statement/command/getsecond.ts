import dayjs from "dayjs";

import * as U from "../../parser/util";
import Slice from "../../slice";
import type VM from "../../vm";
import Statement from "../index";

// 719162 is number of days from 0001-01-01 to 1970-01-01
const UNIX_EPOCH = 719162 * 24 * 60 * 60;
const PARSER = U.arg0R0();
export default class GetSecond extends Statement {
	public constructor(raw: Slice) {
		super(raw);

		U.tryParse(PARSER, raw);
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async *run(vm: VM) {
		const time = dayjs(vm.external.getTime());

		vm.getValue("RESULT").set(vm, BigInt(time.unix() - UNIX_EPOCH), [0]);

		return null;
	}
}
